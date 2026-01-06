/**
 * Assets Detail Screen
 * Full list of all assets with swipe-to-edit/delete
 * Matches web prototype exactly
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { useData } from '../contexts/DataContext';
import { useModals } from '../contexts/ModalContext';
import { Asset } from '../types';
import SwipeableAssetItem from '../components/SwipeableAssetItem';

export default function AssetsDetailScreen() {
  const router = useRouter();
  const { assets, totalAssets, primaryCurrency, deleteAsset } = useData();
  const { openAddAssetFlow, openEditAsset } = useModals();

  const formatCurrency = (value: number) => {
    const symbol = primaryCurrency === 'GBP' ? '£' : primaryCurrency === 'USD' ? '$' : '€';
    return `${symbol}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleDelete = (asset: Asset) => {
    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete "${asset.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAsset(asset.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete asset');
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
            onPress={openAddAssetFlow}
            style={styles.addButton}
            activeOpacity={0.6}
          >
            <Plus size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerLabel}>Assets</Text>
          <Text style={styles.headerTotal}>{formatCurrency(totalAssets)}</Text>
        </View>
      </View>

      {/* Assets List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {assets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No assets yet. Tap + to add your first asset.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {assets.map((asset) => (
              <SwipeableAssetItem
                key={asset.id}
                asset={asset}
                onEdit={() => openEditAsset(asset)}
                onDelete={() => handleDelete(asset)}
                showEdit={asset.type === 'property' || asset.type === 'other'}
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
