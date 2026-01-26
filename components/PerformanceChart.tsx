/**
 * Performance Chart Component
 * Shows net worth over time with react-native-chart-kit
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { NetWorthSnapshot, Currency } from '../types';

type TimeRange = '1M' | '3M' | 'YTD' | '1Y';

interface PerformanceChartProps {
  snapshots: NetWorthSnapshot[];
  currentNetWorth: number;
  currency: Currency;
}

export function PerformanceChart({ snapshots, currentNetWorth, currency }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const screenWidth = Dimensions.get('window').width - (Spacing.lg * 2);

  // Helper function to format date labels
  const formatDateLabel = (date: Date, range: TimeRange): string => {
    if (range === '1M') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === '3M' || range === 'YTD') {
      return date.toLocaleString('en-GB', { month: 'short' });
    }
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' });
  };

  // Generate chart data based on time range
  const { chartData, isDay1 } = useMemo(() => {
    const now = new Date();

    // Filter snapshots based on time range
    const filteredSnapshots = snapshots.filter(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      const daysAgo = (now.getTime() - snapshotDate.getTime()) / (1000 * 60 * 60 * 24);

      if (timeRange === '1M') return daysAgo <= 30;
      if (timeRange === '3M') return daysAgo <= 90;
      if (timeRange === 'YTD') return snapshotDate.getFullYear() === now.getFullYear();
      if (timeRange === '1Y') return daysAgo <= 365;
      return false;
    });

    // Sort by date (oldest first)
    const sortedSnapshots = [...filteredSnapshots].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Day 1 check: If we have fewer than 2 historical data points, show Day 1 state
    const isDay1 = sortedSnapshots.length < 2;

    // Limit to max 10 data points for readability
    const maxPoints = 10;
    const step = Math.max(1, Math.floor(sortedSnapshots.length / maxPoints));
    const sampledSnapshots = sortedSnapshots.filter((_, index) => index % step === 0);

    // Add current value as last point
    const allSnapshots = [...sampledSnapshots, {
      timestamp: now.toISOString(),
      netWorth: currentNetWorth,
      totalAssets: 0,
      totalLiabilities: 0
    }];

    const chartData = {
      labels: allSnapshots.map((snapshot, index) => {
        if (index === allSnapshots.length - 1) return 'Now';
        const date = new Date(snapshot.timestamp);
        return formatDateLabel(date, timeRange);
      }),
      datasets: [{
        data: allSnapshots.map(snapshot => snapshot.netWorth)
      }]
    };

    return { chartData, isDay1 };
  }, [snapshots, currentNetWorth, timeRange]);

  // Calculate performance metrics
  const firstValue = chartData.datasets[0].data[0];
  const lastValue = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
  const performanceChange = lastValue - firstValue;
  const performancePercent = firstValue !== 0 
    ? ((performanceChange / firstValue) * 100).toFixed(1) 
    : '0.0';
  const isPositive = performanceChange >= 0;

  const getCurrencySymbol = (currency: Currency) => {
    return { GBP: '£', USD: '$', EUR: '€' }[currency];
  };

  const formatCurrency = (value: number) => {
    return `${getCurrencySymbol(currency)}${Math.abs(value).toLocaleString('en-GB', { 
      maximumFractionDigits: 0 
    })}`;
  };

  const getTimePeriodLabel = () => {
    if (timeRange === '1M') return 'This month';
    if (timeRange === '3M') return 'Last 3 months';
    if (timeRange === 'YTD') return 'This year';
    return 'This year';
  };

  // Day 1 state - matches web prototype (shows when < 2 historical data points)
  if (isDay1) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.currentValue}>{formatCurrency(currentNetWorth)}</Text>
        
        <View style={styles.emptyStateContainer}>
          <View style={styles.dotContainer}>
            <View style={styles.dot} />
          </View>
          
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Your performance tracking begins today</Text>
            <Text style={styles.messageSubtitle}>Check back tomorrow to see your first trend</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header with metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.title}>Performance</Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.changeAmount, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            {isPositive ? '↑' : '↓'} {formatCurrency(performanceChange)}
          </Text>
          <Text style={[styles.changePercent, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            ({isPositive ? '+' : ''}{performancePercent}%)
          </Text>
        </View>
        <Text style={styles.timePeriod}>
          {getTimePeriodLabel()}
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth + (Spacing.xl * 2)}
          height={150}
          strokeWidth={3}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: Colors.card,
            backgroundGradientTo: Colors.card,
            decimalPlaces: 0,
            color: () => 'rgb(100, 116, 139)',
            labelColor: () => 'transparent',
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: '0',
            },
            propsForBackgroundLines: {
              stroke: 'transparent'
            }
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withDots={false}
          withShadow={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          fromZero={false}
          segments={4}
        />
      </View>

      {/* Time range selector */}
      <View style={styles.timeRangeContainer}>
        {(['1M', '3M', 'YTD', '1Y'] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => setTimeRange(range)}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive
            ]}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === range && styles.timeRangeTextActive
            ]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 15,
    color: Colors.muted,
    fontWeight: '500',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: -0.5,
    lineHeight: 32,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.md,
  },
  metricsContainer: {
    marginBottom: Spacing.md,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  changeAmount: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  changePercent: {
    fontSize: 15,
    fontWeight: '500',
  },
  timePeriod: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  chartContainer: {
    height: 150,
    marginLeft: -Spacing.xl,
    marginRight: -Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginLeft: -Spacing.lg,
    paddingRight: 0,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.background,
  },
  timeRangeText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: Colors.primary,
  },
  // Empty state
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  dotContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(100, 116, 139)',
    shadowColor: 'rgb(100, 116, 139)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  messageBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  messageSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
