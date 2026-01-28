/**
 * Liabilities Card Component
 * Displays list of liabilities with clean, professional design
 * Tap chevron to navigate to full Liabilities Detail Screen
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Liability } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants';

interface LiabilitiesCardProps {
  liabilities: Liability[];
  totalLiabilities: number;
  currency: string;
  onAddLiability: () => void;
  onNavigateToDetail?: () => void;
}

export default function LiabilitiesCard({
  liabilities,
  totalLiabilities,
  currency,
  onAddLiability,
  onNavigateToDetail,
}: LiabilitiesCardProps) {
  const formatCurrency = (value: number) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <View style={styles.card}>
      {/* Header with Title, Value, and Action Icons */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.label}>Liabilities</Text>
          <Text style={styles.total}>{formatCurrency(totalLiabilities)}</Text>
        </View>
        
        <View style={styles.headerRight}>
          {/* Add Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onAddLiability}
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

      {/* Liability List - Only show top 3 */}
      {liabilities.length > 0 && (
        <View style={styles.list}>
          {liabilities.slice(0, 3).map((liability) => (
            <View
              key={liability.id}
              style={styles.listItem}
            >
              <Text style={styles.itemName} numberOfLines={1}>
                {liability.name}
              </Text>
              <Text style={styles.itemValue}>{formatCurrency(liability.value)}</Text>
            </View>
          ))}
          
          {/* Show "+X more" if there are more than 3 liabilities */}
          {liabilities.length > 3 && (
            <Text style={styles.moreText}>
              +{liabilities.length - 3} more
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
    padding: 24,
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
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: '500',
    color: Colors.mutedForeground,
    marginBottom: 6,
  },
  total: {
    fontSize: 28,
    fontWeight: '400',
    color: Colors.foreground,
    letterSpacing: -0.28,
    lineHeight: 36,
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
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.foreground,
    flex: 1,
    marginRight: Spacing.md,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },
  moreText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
});
