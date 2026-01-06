/**
 * Liabilities Card Component
 * Displays list of liabilities with clean, professional design
 */

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Liability } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';

interface LiabilitiesCardProps {
  liabilities: Liability[];
  totalLiabilities: number;
  currency: string;
  onAddLiability: () => void;
}

export default function LiabilitiesCard({
  liabilities,
  totalLiabilities,
  currency,
  onAddLiability,
}: LiabilitiesCardProps) {
  const { deleteLiability } = useData();

  const formatCurrency = (value: number) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleDeleteLiability = (liability: Liability) => {
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
            onPress={() => console.log('Navigate to Liabilities Detail')}
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
            <TouchableOpacity
              key={liability.id}
              style={styles.listItem}
              onLongPress={() => handleDeleteLiability(liability)}
              activeOpacity={0.6}
            >
              <Text style={styles.itemName} numberOfLines={1}>
                {liability.name}
              </Text>
              <Text style={styles.itemValue}>{formatCurrency(liability.value)}</Text>
            </TouchableOpacity>
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
