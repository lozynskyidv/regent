/**
 * Swipeable Asset Item
 * Swipe left to reveal Edit and Delete buttons
 * Matches iOS Mail app pattern
 */

import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Asset } from '../types';
import { Colors, Spacing, BorderRadius } from '../constants';

interface SwipeableAssetItemProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
  showEdit: boolean; // Only show edit for property and other types
  formatCurrency: (value: number) => string;
}

export default function SwipeableAssetItem({
  asset,
  onEdit,
  onDelete,
  showEdit,
  formatCurrency,
}: SwipeableAssetItemProps) {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    // Calculate button widths
    const editWidth = showEdit ? 70 : 0;
    const deleteWidth = 70;
    const totalWidth = editWidth + deleteWidth;

    // Edit button translate (slides in from right)
    const editTranslate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [editWidth, 0],
    });

    // Delete button translate (slides in from right)
    const deleteTranslate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [deleteWidth, 0],
    });

    return (
      <View style={styles.actionsContainer}>
        {showEdit && (
          <Animated.View
            style={[
              styles.actionButton,
              styles.editButton,
              { transform: [{ translateX: editTranslate }] },
            ]}
          >
            <TouchableOpacity
              onPress={onEdit}
              style={styles.actionButtonInner}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.actionButton,
            styles.deleteButton,
            { transform: [{ translateX: deleteTranslate }] },
          ]}
        >
          <TouchableOpacity
            onPress={onDelete}
            style={styles.actionButtonInner}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      overshootFriction={8}
      rightThreshold={40}
    >
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <View style={styles.itemLeft}>
            <Text style={styles.itemName} numberOfLines={1}>
              {asset.name}
            </Text>

            {/* Metadata (for bank accounts with sync info) */}
            {asset.metadata?.lastSynced && (
              <Text style={styles.itemMetadata}>
                Synced {asset.metadata.lastSynced}
              </Text>
            )}

            {/* Portfolio holdings count */}
            {asset.type === 'portfolio' && asset.metadata?.holdingsCount && (
              <Text style={styles.itemMetadata}>
                {asset.metadata.holdingsCount}{' '}
                {asset.metadata.holdingsCount === 1 ? 'holding' : 'holdings'}
              </Text>
            )}
          </View>

          <View style={styles.itemRight}>
            <Text style={styles.itemValue}>{formatCurrency(asset.value)}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  // Item Container
  itemContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // Item Left
  itemLeft: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16, // 1rem
    fontWeight: '500',
    color: Colors.foreground,
  },
  itemMetadata: {
    fontSize: 13, // 0.8125rem
    color: Colors.mutedForeground,
    opacity: 0.6,
  },

  // Item Right
  itemRight: {
    flexShrink: 0,
  },
  itemValue: {
    fontSize: 16, // 1rem
    fontWeight: '500',
    color: Colors.foreground,
  },

  // Actions Container
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Action Buttons
  actionButton: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.destructive,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
