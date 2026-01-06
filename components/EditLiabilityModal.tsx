/**
 * Edit Liability Modal
 * Pre-populated form for editing existing liabilities
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
import type { Liability } from '../types';

interface EditLiabilityModalProps {
  visible: boolean;
  onClose: () => void;
  liability: Liability | null;
}

export default function EditLiabilityModal({
  visible,
  onClose,
  liability,
}: EditLiabilityModalProps) {
  const { updateLiability, deleteLiability, primaryCurrency } = useData();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form when liability changes
  useEffect(() => {
    if (liability) {
      setName(liability.name);
      setValue(liability.value.toString());
    }
  }, [liability]);

  const handleClose = () => {
    setName('');
    setValue('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!liability) return;

    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a liability name');
      return;
    }

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateLiability(liability.id, {
        name: name.trim(),
        value: numericValue,
      });

      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update liability. Please try again.');
      console.error('Update liability error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!liability) return;

    Alert.alert(
      'Delete Liability',
      `Are you sure you want to delete "${liability.name}"? This cannot be undone.`,
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
              await deleteLiability(liability.id);
              handleClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete liability. Please try again.');
              console.error('Delete liability error:', error);
            }
          },
        },
      ]
    );
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

  const getLiabilityTypeLabel = () => {
    if (!liability) return 'Liability';
    switch (liability.type) {
      case 'mortgage':
        return 'Mortgage';
      case 'loan':
        return 'Loan';
      case 'creditcard':
        return 'Credit Card';
      case 'other':
        return 'Other Liability';
      default:
        return 'Liability';
    }
  };

  const getValueLabel = () => {
    if (!liability) return 'Outstanding Balance';
    return liability.type === 'creditcard' ? 'Current Balance' : 'Outstanding Balance';
  };

  if (!liability) return null;

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
            <Text style={styles.title}>Edit {getLiabilityTypeLabel()}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form - Scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Liability Name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {liability.type === 'creditcard' ? 'Card Name' : 'Liability Name'}
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

            {/* Outstanding Balance */}
            <View style={styles.field}>
              <Text style={styles.label}>{getValueLabel()}</Text>
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

            {/* Info Box (for other liabilities) */}
            {liability.type === 'other' && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Any other debt or financial obligation not covered by other categories. Values are
                  updated manually.
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
              <Text style={styles.deleteButtonText}>Delete Liability</Text>
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
