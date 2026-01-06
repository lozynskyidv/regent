/**
 * Asset Type Picker Modal
 * First step: User selects which type of asset to add
 * Matches web prototype design exactly
 */

import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, TrendingUp, Home, Plus } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { AssetType } from '../types';

interface AssetTypePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: AssetType) => void;
}

interface AssetTypeOption {
  id: AssetType;
  icon: any;
  title: string;
  description: string;
  badge?: string;
}

export default function AssetTypePickerModal({
  visible,
  onClose,
  onSelectType,
}: AssetTypePickerModalProps) {
  const assetTypes: AssetTypeOption[] = [
    {
      id: 'bank',
      icon: Building2,
      title: 'Bank Account',
      description: 'Connect via TrueLayer for auto-sync',
      badge: 'Live sync',
    },
    {
      id: 'portfolio',
      icon: TrendingUp,
      title: 'Investment Portfolio',
      description: 'Track stocks with live prices',
      badge: 'Live prices',
    },
    {
      id: 'property',
      icon: Home,
      title: 'Property',
      description: 'Manual valuation',
    },
    {
      id: 'other',
      icon: Plus,
      title: 'Other Asset',
      description: 'Manual entry',
    },
  ];

  const handleSelectType = (type: AssetType) => {
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

          <Text style={styles.title}>Add Asset</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Asset Type List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {assetTypes.map((type) => {
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
                    <View style={styles.titleRow}>
                      <Text style={styles.typeTitle}>{type.title}</Text>
                      {type.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{type.badge}</Text>
                        </View>
                      )}
                    </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    opacity: 0.9,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.background,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 19.6, // 1.4 * 14
  },
});
