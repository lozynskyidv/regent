/**
 * Assets Card Component
 * Displays list of assets with clean, professional design
 * Tap chevron to navigate to full Assets Detail Screen
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants';

interface AssetsCardProps {
  assets: Asset[];
  totalAssets: number;
  currency: string;
  onAddAsset: () => void;
  onNavigateToDetail?: () => void;
}

export default function AssetsCard({ assets, totalAssets, currency, onAddAsset, onNavigateToDetail }: AssetsCardProps) {
  const formatCurrency = (value: number) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <View style={styles.card}>
      {/* Header with Title, Value, and Action Icons */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.label}>Assets</Text>
          <Text style={styles.total}>{formatCurrency(totalAssets)}</Text>
        </View>
        
        <View style={styles.headerRight}>
          {/* Add Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onAddAsset}
            activeOpacity={0.6}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
          
          {/* ChevronRight Icon */}
          <TouchableOpacity
            style={[styles.iconButton, styles.chevronButton]}
            onPress={onNavigateToDetail}
            activeOpacity={0.6}
          >
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Asset List - Only show top 3 */}
      {assets.length > 0 && (
        <View style={styles.list}>
          {assets.slice(0, 3).map((asset) => (
            <View
              key={asset.id}
              style={styles.listItem}
            >
              <Text style={styles.itemName} numberOfLines={1}>
                {asset.name}
              </Text>
              <Text style={styles.itemValue}>{formatCurrency(asset.value)}</Text>
            </View>
          ))}
          
          {/* Show "+X more" if there are more than 3 assets */}
          {assets.length > 3 && (
            <Text style={styles.moreText}>
              +{assets.length - 3} more
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.mutedForeground,
    marginBottom: 4,
  },
  total: {
    fontSize: 24,
    fontWeight: '400',
    color: Colors.foreground,
    letterSpacing: -0.24, // -0.01em
    lineHeight: 31.2, // 1.3 * 24
  },
  
  // Icon Buttons
  iconButton: {
    padding: 6,
    borderRadius: BorderRadius.md,
  },
  chevronButton: {
    marginRight: -6,
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.mutedForeground,
    opacity: 0.7,
  },
  chevronIcon: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.mutedForeground,
  },
  
  // List
  list: {
    gap: Spacing.sm, // 12px (space-y-3 in web)
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.foreground,
    flex: 1,
    marginRight: Spacing.md,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.foreground,
  },
  moreText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
