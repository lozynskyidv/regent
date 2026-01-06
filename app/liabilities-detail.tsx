/**
 * Liabilities Detail Screen
 * Full list of all liabilities with swipe-to-edit/delete
 * Matches web prototype exactly
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';
import { useModals } from '../contexts/ModalContext';
import { Liability } from '../types';
import SwipeableLiabilityItem from '../components/SwipeableLiabilityItem';

export default function LiabilitiesDetailScreen() {
  const router = useRouter();
  const { liabilities, totalLiabilities, primaryCurrency, deleteLiability } = useData();
  const { openAddLiabilityFlow, openEditLiability } = useModals();

  const formatCurrency = (value: number) => {
    const symbol = primaryCurrency === 'GBP' ? '£' : primaryCurrency === 'USD' ? '$' : '€';
    return `${symbol}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleDelete = (liability: Liability) => {
    Alert.alert(
      'Delete Liability',
      `Are you sure you want to delete "${liability.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLiability(liability.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete liability');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <ChevronLeft size={24} color={Colors.foreground} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openAddLiabilityFlow}
            style={styles.addButton}
            activeOpacity={0.6}
          >
            <Plus size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerLabel}>Liabilities</Text>
          <Text style={styles.headerTotal}>{formatCurrency(totalLiabilities)}</Text>
        </View>
      </View>

      {/* Liabilities List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {liabilities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No liabilities yet. Tap + to add your first liability.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {liabilities.map((liability) => (
              <SwipeableLiabilityItem
                key={liability.id}
                liability={liability}
                onEdit={() => openEditLiability(liability)}
                onDelete={() => handleDelete(liability)}
                showEdit={true} // All liabilities can be edited
                formatCurrency={formatCurrency}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  addButton: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
  },
  headerContent: {
    gap: Spacing.xs,
  },
  headerLabel: {
    fontSize: 15, // 0.9375rem
    fontWeight: '500',
    color: Colors.mutedForeground,
  },
  headerTotal: {
    fontSize: 40, // 2.5rem
    fontWeight: '300',
    letterSpacing: -0.8, // -0.02em
    color: Colors.foreground,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },

  // Empty State
  emptyState: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },

  // List
  list: {
    gap: Spacing.md, // space-y-4
  },
});
