/**
 * Add Mortgage Modal
 * Comprehensive mortgage entry with property details
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

interface AddMortgageModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddMortgageModal({ visible, onClose }: AddMortgageModalProps) {
  const { addLiability, primaryCurrency } = useData();

  const [propertyAddress, setPropertyAddress] = useState('');
  const [lender, setLender] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setPropertyAddress('');
    setLender('');
    setOutstandingBalance('');
    setInterestRate('');
    setMonthlyPayment('');
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (!propertyAddress.trim()) {
      Alert.alert('Error', 'Please enter property address');
      return;
    }

    if (!lender.trim()) {
      Alert.alert('Error', 'Please enter lender name');
      return;
    }

    const balance = parseFloat(outstandingBalance.replace(/,/g, ''));
    if (isNaN(balance) || balance <= 0) {
      Alert.alert('Error', 'Please enter a valid outstanding balance');
      return;
    }

    try {
      setIsSubmitting(true);
      await addLiability({
        name: `${lender} Mortgage`,
        type: 'mortgage',
        value: balance,
        currency: primaryCurrency,
      });

      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add mortgage. Please try again.');
      console.error('Add mortgage error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumberInput = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num) return '';
    return parseFloat(num).toLocaleString('en-GB');
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

  const canSubmit = propertyAddress.trim() && lender.trim() && outstandingBalance && !isSubmitting;

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
          {/* Header with Add Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.6}>
              <X size={24} color={Colors.foreground} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Mortgage</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={styles.addButton}
              activeOpacity={0.6}
            >
              <Text style={[styles.addButtonText, !canSubmit && styles.addButtonTextDisabled]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form - Scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Property Address */}
            <View style={styles.field}>
              <Text style={styles.label}>Property Address</Text>
              <TextInput
                style={styles.input}
                value={propertyAddress}
                onChangeText={setPropertyAddress}
                placeholder="e.g., 123 High Street, London"
                placeholderTextColor={Colors.mutedForeground}
                autoFocus
              />
            </View>

            {/* Lender */}
            <View style={styles.field}>
              <Text style={styles.label}>Lender</Text>
              <TextInput
                style={styles.input}
                value={lender}
                onChangeText={setLender}
                placeholder="e.g., Halifax"
                placeholderTextColor={Colors.mutedForeground}
              />
            </View>

            {/* Outstanding Balance */}
            <View style={styles.field}>
              <Text style={styles.label}>Outstanding Balance</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={outstandingBalance}
                  onChangeText={(text) => {
                    const value = text.replace(/[^\d]/g, '');
                    setOutstandingBalance(value ? formatNumberInput(value) : '');
                  }}
                  placeholder="0"
                  placeholderTextColor={Colors.mutedForeground}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Interest Rate (Optional) */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Interest Rate <Text style={styles.optional}>(optional)</Text>
              </Text>
              <View style={styles.percentInputContainer}>
                <TextInput
                  style={styles.percentInput}
                  value={interestRate}
                  onChangeText={setInterestRate}
                  placeholder="e.g., 3.5"
                  placeholderTextColor={Colors.mutedForeground}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.percentSymbol}>%</Text>
              </View>
            </View>

            {/* Monthly Payment (Optional) */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Monthly Payment <Text style={styles.optional}>(optional)</Text>
              </Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={monthlyPayment}
                  onChangeText={(text) => {
                    const value = text.replace(/[^\d]/g, '');
                    setMonthlyPayment(value ? formatNumberInput(value) : '');
                  }}
                  placeholder="0"
                  placeholderTextColor={Colors.mutedForeground}
                  keyboardType="number-pad"
                />
              </View>
            </View>
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
  addButton: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.primary,
  },
  addButtonTextDisabled: {
    opacity: 0.4,
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
    gap: 8,
  },
  label: {
    fontSize: 15, // 0.9375rem
    fontWeight: '500',
    color: Colors.foreground,
  },
  optional: {
    color: Colors.mutedForeground,
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
    color: Colors.mutedForeground,
    marginRight: Spacing.xs,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground,
    height: 56,
  },
  percentInputContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  percentInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground,
    height: 56,
  },
  percentSymbol: {
    fontSize: 16,
    color: Colors.mutedForeground,
    marginLeft: Spacing.xs,
  },
});
