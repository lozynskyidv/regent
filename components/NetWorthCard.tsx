/**
 * Net Worth Card Component
 * Displays total net worth (assets - liabilities) with large, prominent typography
 * Features smooth count-up animation from 0 to current value
 */

import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants';

interface NetWorthCardProps {
  netWorth: number;
  currency: string;
}

export default function NetWorthCard({ netWorth, currency }: NetWorthCardProps) {
  // State for displaying the animated value
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animated value for count-up animation
  const animatedValue = useRef(new Animated.Value(0)).current;

  const formatCurrency = (value: number) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    const formatted = Math.abs(value).toLocaleString('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
  };

  // Animate net worth from 0 to current value
  useEffect(() => {
    // Reset to 0 and animate to netWorth
    animatedValue.setValue(0);
    
    // Add listener to update display value during animation
    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    
    Animated.timing(animatedValue, {
      toValue: netWorth,
      duration: 500, // 500ms duration (matches web prototype)
      easing: Easing.out(Easing.cubic), // Ease-out cubic for smooth deceleration
      useNativeDriver: false, // Text animations require JS driver
    }).start();

    // Cleanup listener on unmount
    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [netWorth, animatedValue]);

  return (
    <View style={styles.card}>
      {/* Label */}
      <Text style={styles.label}>NET WORTH</Text>
      
      {/* Large Amount - Hero Typography with Animation */}
      <Text style={styles.amount}>{formatCurrency(displayValue)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.mutedForeground,
    letterSpacing: 0.75, // 0.05em
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 56,
    fontWeight: '300',
    color: Colors.foreground,
    letterSpacing: -1.68, // -0.03em
    lineHeight: 61.6, // 1.1 * 56
  },
});
