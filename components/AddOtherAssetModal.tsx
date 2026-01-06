/**
 * Add Other Asset Modal
 * Matches web prototype design exactly
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';

interface AddOtherAssetModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddOtherAssetModal({ visible, onClose }: AddOtherAssetModalProps) {
  const { addAsset, primaryCurrency } = useData();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setName('');
    setValue('');
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an asset name');
      return;
    }

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      await addAsset({
        name: name.trim(),
        type: 'other',
        value: numericValue,
        currency: primaryCurrency,
      });

      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add asset. Please try again.');
      console.error('Add other asset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatValueInput = (input: string) => {
    const numeric = input.replace(/[^0-9.]/g, '');
    const parts = numeric.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numeric;
  };

  const getCurrencySymbol = () => {
    switch (primaryCurrency) {
      case 'GBP':
        return '£';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return '£';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.6}>
              <X size={24} color={Colors.foreground} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Asset</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form - Scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Asset Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Asset Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Rolex Submariner, Gold Bullion"
                placeholderTextColor={Colors.mutedForeground}
                autoFocus
              />
            </View>

            {/* Current Value */}
            <View style={styles.field}>
              <Text style={styles.label}>Current Value</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={value}
                  onChangeText={(text) => setValue(formatValueInput(text))}
                  placeholder="0"
                  placeholderTextColor={Colors.mutedForeground}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What can I add here?</Text>
              <Text style={styles.infoText}>
                Collectibles, vehicles, jewellery, cryptocurrency, or any other valuable assets. Values are updated manually.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || !name.trim() || !value || parseFloat(value) <= 0}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding...' : 'Add Asset'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.foreground,
    letterSpacing: -0.17,
  },
  headerSpacer: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },

  // Form Fields
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 15, // 0.9375rem
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  input: {
    height: 56,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencyInputContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.mutedForeground,
    marginRight: Spacing.xs,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground,
    height: 56,
  },

  // Info Box
  infoBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21, // 1.5 * 14
  },

  // Submit Button
  submitButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
  },
});
