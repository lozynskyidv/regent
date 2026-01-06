/**
 * Liability Type Picker Modal
 * First step: User selects which type of liability to add
 * Matches web prototype design exactly
 */

import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, CreditCard, Building2, MoreHorizontal } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { LiabilityType } from '../types';

interface LiabilityTypePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: LiabilityType) => void;
}

interface LiabilityTypeOption {
  id: LiabilityType;
  icon: any;
  title: string;
  description: string;
}

export default function LiabilityTypePickerModal({
  visible,
  onClose,
  onSelectType,
}: LiabilityTypePickerModalProps) {
  const liabilityTypes: LiabilityTypeOption[] = [
    {
      id: 'mortgage',
      icon: Home,
      title: 'Mortgage',
      description: 'Property loans and mortgages',
    },
    {
      id: 'creditcard',
      icon: CreditCard,
      title: 'Credit Cards',
      description: 'Auto-sync via TrueLayer',
    },
    {
      id: 'loan',
      icon: Building2,
      title: 'Loans',
      description: 'Personal, car, or student loans',
    },
    {
      id: 'other',
      icon: MoreHorizontal,
      title: 'Other Liability',
      description: 'Any other debt or obligation',
    },
  ];

  const handleSelectType = (type: LiabilityType) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.6}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add Liability</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Liability Type List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {liabilityTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={styles.typeCard}
                onPress={() => handleSelectType(type.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  {/* Icon Box */}
                  <View style={styles.iconBox}>
                    <Icon size={22} color={Colors.foreground} strokeWidth={2} />
                  </View>

                  {/* Content */}
                  <View style={styles.textContent}>
                    <Text style={styles.typeTitle}>{type.title}</Text>
                    <Text style={styles.typeDescription}>{type.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  closeIcon: {
    fontSize: 24,
    fontWeight: '400',
    color: Colors.foreground,
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
    gap: Spacing.sm,
    paddingBottom: Spacing['2xl'],
  },

  // Type Cards
  typeCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },

  // Icon
  iconBox: {
    width: 44,
    height: 44,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text Content
  textContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 19.6, // 1.4 * 14
  },
});
