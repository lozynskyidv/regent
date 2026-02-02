/**
 * Edit Asset Modal
 * Pre-populated form for editing existing assets
 */

import { useState, useEffect } from 'react';
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
import type { Asset } from '../types';

interface EditAssetModalProps {
  visible: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export default function EditAssetModal({ visible, onClose, asset }: EditAssetModalProps) {
  const { updateAsset, deleteAsset, primaryCurrency } = useData();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form when asset changes
  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setValue(asset.value.toString());
    }
  }, [asset]);

  const handleClose = () => {
    setName('');
    setValue('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!asset) return;

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
      await updateAsset(asset.id, {
        name: name.trim(),
        value: numericValue,
      });

      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update asset. Please try again.');
      console.error('Update asset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!asset) return;

    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete "${asset.name}"? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAsset(asset.id);
              handleClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete asset. Please try again.');
              console.error('Delete asset error:', error);
            }
          },
        },
      ]
    );
  };

  const formatValueInput = (input: string) => {
    // Replace comma with dot for European keyboards
    const normalized = input.replace(',', '.');
    const numeric = normalized.replace(/[^0-9.]/g, '');
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

  const getAssetTypeLabel = () => {
    if (!asset) return 'Asset';
    switch (asset.type) {
      case 'bank':
        return 'Bank Account';
      case 'property':
        return 'Property';
      case 'portfolio':
        return 'Portfolio';
      case 'other':
        return 'Other Asset';
      default:
        return 'Asset';
    }
  };

  if (!asset) return null;

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
            <Text style={styles.title}>Edit {getAssetTypeLabel()}</Text>
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
              <Text style={styles.label}>
                {asset.type === 'property' ? 'Property Name' : 'Asset Name'}
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={Colors.mutedForeground}
                autoFocus
              />
            </View>

            {/* Current Value */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {asset.type === 'property' ? 'Current Valuation' : 'Current Value'}
              </Text>
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

            {/* Info Box (for property and other assets) */}
            {(asset.type === 'property' || asset.type === 'other') && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {asset.type === 'property'
                    ? 'Property values are updated manually. You can edit the valuation anytime.'
                    : 'Asset values are updated manually. You can edit anytime.'}
                </Text>
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || !name.trim() || !value || parseFloat(value) <= 0}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>Delete Asset</Text>
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
    marginTop: Spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
  },

  // Delete Button
  deleteButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.destructive,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.destructive,
  },
});
