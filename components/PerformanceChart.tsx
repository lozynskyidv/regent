/**
 * Performance Chart Component
 * Shows net worth over time with react-native-chart-kit
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, UIManager, Animated, PanResponder } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, Spacing, BorderRadius } from '../constants';
import { NetWorthSnapshot, Currency } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TimeRange = '1M' | '3M' | 'YTD' | '1Y';

interface PerformanceChartProps {
  snapshots: NetWorthSnapshot[];
  currentNetWorth: number;
  currency: Currency;
  onChartTouchStart?: () => void;
  onChartTouchEnd?: () => void;
}

export function PerformanceChart({ snapshots, currentNetWorth, currency, onChartTouchStart, onChartTouchEnd }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const chartOpacity = useRef(new Animated.Value(1)).current;
  const metricsOpacity = useRef(new Animated.Value(1)).current;
  const metricsScale = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0.8)).current;
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [fractionalPosition, setFractionalPosition] = useState<number | null>(null); // For smooth dot positioning
  const [displayedValue, setDisplayedValue] = useState<number>(currentNetWorth);
  const [displayedChange, setDisplayedChange] = useState<number>(0);
  const animatedValue = useRef(new Animated.Value(currentNetWorth)).current;
  const animatedChange = useRef(new Animated.Value(0)).current;
  const gestureStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Chart width = screen width - scroll padding (24px each side) + chart negative margins (12px each side)
  // = screenWidth - 48 + 24 = screenWidth - 24
  const screenWidth = Dimensions.get('window').width - (Spacing.lg * 2) + (Spacing.sm * 2);
  
  // Separate padding constants for touch detection vs dot rendering
  // Touch detection: Maps screen coordinates to data point indices
  const TOUCH_PADDING_HORIZONTAL = 12; // react-native-chart-kit's internal horizontal padding
  
  // Dot rendering: Maps data points to visual positions on screen
  const DOT_PADDING_HORIZONTAL = 12;   // Horizontal padding for dot positioning
  const DOT_PADDING_VERTICAL = 20;     // Vertical padding for dot positioning

  // Handle time range change with smooth animation (like web: 1000ms ease-out)
  const handleTimeRangeChange = (range: TimeRange) => {
    if (range === timeRange) return;
    
    // Animate fade out and fade in with timing similar to web (slower, smoother)
    Animated.parallel([
      Animated.timing(chartOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(metricsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeRange(range);
      
      // Fade back in with ease-out
      Animated.parallel([
        Animated.timing(chartOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(metricsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Calculate exact fractional position from X coordinate (TOUCH DETECTION)
  const getPositionFromX = (x: number): { index: number; fractional: number } => {
    const dataPoints = chartData.datasets[0].data;
    if (dataPoints.length === 0) return { index: -1, fractional: 0 };
    
    // Account for chart's internal horizontal padding (for touch coordinates)
    const effectiveWidth = screenWidth - (2 * TOUCH_PADDING_HORIZONTAL);
    const touchX = x - TOUCH_PADDING_HORIZONTAL;
    
    // Calculate fractional position (can be 0.0, 1.5, 2.7, etc.)
    const fractionalPos = (touchX / effectiveWidth) * (dataPoints.length - 1);
    const clampedFractional = Math.max(0, Math.min(fractionalPos, dataPoints.length - 1));
    
    // Snap to nearest integer for displaying values (actual data point)
    const snappedIndex = Math.round(clampedFractional);
    
    return { 
      index: snappedIndex,
      fractional: clampedFractional 
    };
  };

  // PanResponder for smooth scrubbing gesture
  const panResponder = useRef(
    PanResponder.create({
      // Always capture touches in chart area
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // Aggressively block parent ScrollView - capture ALL touches
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      
      // NEVER let ScrollView steal this gesture
      onPanResponderTerminationRequest: () => false,
      
      onPanResponderGrant: (evt) => {
        // Disable parent ScrollView scrolling
        onChartTouchStart?.();
        
        // Store start position for direction detection
        gestureStartRef.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };
        
        // Touch started - show value at touch position with haptic-like feedback
        const x = evt.nativeEvent.locationX;
        const position = getPositionFromX(x);
        if (position.index >= 0) {
          // Slight scale down on touch
          Animated.spring(metricsScale, {
            toValue: 0.98,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
          }).start();
          setSelectedPointIndex(position.index);
          setFractionalPosition(position.fractional);
        }
      },
      
      onPanResponderMove: (evt) => {
        // Dragging - update value in real-time with smooth animations
        const x = evt.nativeEvent.locationX;
        const position = getPositionFromX(x);
        if (position.index >= 0) {
          // Always update fractional position for smooth dot movement
          setFractionalPosition(position.fractional);
          
          // Only update displayed value when we move to a different data point
          if (position.index !== selectedPointIndex) {
            setSelectedPointIndex(position.index);
          }
        }
      },
      
      onPanResponderRelease: () => {
        // Re-enable parent ScrollView scrolling
        onChartTouchEnd?.();
        
        // Clear gesture start reference
        gestureStartRef.current = null;
        
        // Touch ended - return to current value with smooth animation
        Animated.parallel([
          Animated.spring(metricsScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 200,
            friction: 12,
          }),
          Animated.timing(metricsOpacity, {
            toValue: 0.6,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setSelectedPointIndex(null);
          Animated.timing(metricsOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      },
      
      onPanResponderTerminate: () => {
        // Re-enable parent ScrollView if gesture was interrupted
        onChartTouchEnd?.();
        
        // Gesture was interrupted - clean up
        gestureStartRef.current = null;
        setSelectedPointIndex(null);
        Animated.spring(metricsScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 12,
        }).start();
      },
    })
  ).current;

  // Helper functions
  const formatDateLabel = (date: Date, range: TimeRange): string => {
    if (range === '1M') {
      // Daily precision: "15 Jan"
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === '3M') {
      // Weekly precision: "15 Jan"
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === 'YTD') {
      // Monthly precision: "Jan", "Feb"
      return date.toLocaleString('en-GB', { month: 'short' });
    }
    // 1Y: Weekly precision with day: "15 Jan"
    return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
  };

  const getTimePeriodLabel = () => {
    if (timeRange === '1M') return 'This month';
    if (timeRange === '3M') return 'Last 3 months';
    if (timeRange === 'YTD') return 'This year';
    return 'This year';
  };

  const getCurrencySymbol = (currency: Currency) => {
    return { GBP: '£', USD: '$', EUR: '€' }[currency];
  };

  const formatCurrency = (value: number) => {
    return `${getCurrencySymbol(currency)}${Math.abs(value).toLocaleString('en-GB', { 
      maximumFractionDigits: 0 
    })}`;
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

    // Dynamic max points based on time range for better granularity
    const getMaxPoints = () => {
      if (timeRange === '1M') return 30;  // Daily for 1 month
      if (timeRange === '3M') return 45;  // Every 2 days for 3 months
      if (timeRange === 'YTD') return 50; // Variable, good granularity
      return 50; // 1Y: ~weekly points
    };
    
    const maxPoints = getMaxPoints();
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

  // Calculate performance metrics (either for selected point or end of period)
  const dataPoints = chartData.datasets[0].data;
  const firstValue = dataPoints[0];
  
  // Use selected point if available, otherwise use last point
  const displayIndex = selectedPointIndex !== null ? selectedPointIndex : dataPoints.length - 1;
  const displayValue = dataPoints[displayIndex];
  const displayLabel = selectedPointIndex !== null ? chartData.labels[selectedPointIndex] : getTimePeriodLabel();
  
  const performanceChange = displayValue - firstValue;
  const performancePercent = firstValue !== 0 
    ? ((performanceChange / firstValue) * 100).toFixed(1) 
    : '0.0';
  const isPositive = performanceChange >= 0;

  // Calculate dot position with smooth interpolation (DOT RENDERING)
  const dotPosition = useMemo(() => {
    if (fractionalPosition === null || selectedPointIndex === null) return null;

    const dataValues = chartData.datasets[0].data;
    const numPoints = dataValues.length;
    
    if (numPoints === 0) return null;

    // X position: Use fractional position for smooth movement (with dot padding)
    const effectiveChartWidth = screenWidth - (2 * DOT_PADDING_HORIZONTAL);
    const x = DOT_PADDING_HORIZONTAL + 
              (fractionalPosition / (numPoints - 1)) * effectiveChartWidth;

    // Y position: Interpolate between adjacent points for smooth movement
    const minValue = Math.min(...dataValues);
    const maxValue = Math.max(...dataValues);
    
    // Get adjacent points for interpolation
    const index0 = Math.floor(fractionalPosition);
    const index1 = Math.min(index0 + 1, numPoints - 1);
    const fraction = fractionalPosition - index0; // 0.0 to 1.0
    
    // Interpolate value between two adjacent points
    const value0 = dataValues[index0];
    const value1 = dataValues[index1];
    const interpolatedValue = value0 + (value1 - value0) * fraction;
    
    const chartHeight = 120;
    const effectiveChartHeight = chartHeight - (2 * DOT_PADDING_VERTICAL);
    const valueRange = maxValue - minValue;
    const normalizedValue = valueRange === 0 ? 0.5 : (interpolatedValue - minValue) / valueRange;
    
    // Invert Y (chart coordinates start from top)
    const y = DOT_PADDING_VERTICAL + effectiveChartHeight - (normalizedValue * effectiveChartHeight);

    return { x, y };
  }, [fractionalPosition, selectedPointIndex, chartData, screenWidth, DOT_PADDING_HORIZONTAL, DOT_PADDING_VERTICAL]);

  // Animate value changes smoothly
  useEffect(() => {
    // Animate the value with spring for natural feel
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: displayValue,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.spring(animatedChange, {
        toValue: performanceChange,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.sequence([
        Animated.spring(metricsScale, {
          toValue: 1.02,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.spring(metricsScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]),
    ]).start();
  }, [displayValue, performanceChange]);

  // Animate dot appearance/disappearance
  useEffect(() => {
    if (fractionalPosition !== null) {
      // Show dot with spring animation
      Animated.parallel([
        Animated.spring(dotOpacity, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }),
        Animated.spring(dotScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }),
      ]).start();
    } else {
      // Hide dot
      Animated.parallel([
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fractionalPosition]);

  // Listen to animated values and update displayed numbers
  useEffect(() => {
    const valueListener = animatedValue.addListener(({ value }) => {
      setDisplayedValue(Math.round(value));
    });
    const changeListener = animatedChange.addListener(({ value }) => {
      setDisplayedChange(Math.round(value));
    });

    return () => {
      animatedValue.removeListener(valueListener);
      animatedChange.removeListener(changeListener);
    };
  }, []);

  // Day 1 state - matches web prototype (shows when < 2 historical data points)
  if (isDay1) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.currentValue}>{formatCurrency(currentNetWorth)}</Text>
        
        <View style={styles.emptyStateContainer}>
          <View style={styles.dotContainer}>
            {/* Outer ring */}
            <View style={styles.dotRing}>
              {/* Inner dot */}
              <View style={styles.dot} />
            </View>
          </View>
          
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Performance tracking begins today</Text>
            <Text style={styles.messageSubtitle}>Check back tomorrow for your trend</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header with metrics */}
      <Animated.View 
        style={[
          styles.metricsContainer, 
          { 
            opacity: metricsOpacity,
            transform: [{ scale: metricsScale }]
          }
        ]}
      >
        <Text style={styles.title}>Performance</Text>
        
        {/* Display Value - Animates smoothly between values */}
        <Text style={styles.currentValue}>
          {formatCurrency(displayedValue)}
        </Text>
        
        {/* Change Amount and Percentage */}
        <View style={styles.changeContainer}>
          <Text style={[styles.changeAmount, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            {isPositive ? '↑' : '↓'} {formatCurrency(Math.abs(displayedChange))}
          </Text>
          <Text style={[styles.changePercent, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            ({isPositive ? '+' : ''}{performancePercent}%)
          </Text>
        </View>
        
        {/* Time Period or Selected Date */}
        <Text style={styles.timePeriod}>
          {displayLabel}
        </Text>
      </Animated.View>

      {/* Chart */}
      <Animated.View style={[styles.chartContainer, { opacity: chartOpacity }]}>
        <View pointerEvents="box-only">
          <LineChart
            data={chartData}
            width={screenWidth}
            height={120}
            strokeWidth={2.5}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: Colors.card,
              backgroundGradientTo: Colors.card,
              decimalPlaces: 0,
              color: () => 'rgb(71, 85, 105)',
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
          
          {/* Transparent touch overlay with PanResponder */}
          <View
            style={styles.touchOverlay}
            {...panResponder.panHandlers}
          />

          {/* Indicator dot at selected point */}
          {dotPosition && (
            <Animated.View
              style={[
                styles.indicatorDot,
                {
                  left: dotPosition.x - 6, // Center the 12px dot
                  top: dotPosition.y - 6,
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
              pointerEvents="none"
            />
          )}
        </View>
      </Animated.View>

      {/* Time range selector */}
      <View style={styles.timeRangeContainer}>
        {(['1M', '3M', 'YTD', '1Y'] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => handleTimeRangeChange(range)}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive
            ]}
            activeOpacity={0.7}
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
    borderRadius: BorderRadius.lg, // Changed from md to lg for consistency with NetWorthCard
    padding: Spacing.md, // Reduced from lg (24px) to md (16px) for compact layout
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    color: Colors.mutedForeground,
    fontWeight: '500',
    marginBottom: 12,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -0.32,
    lineHeight: 40,
    color: Colors.primary,
    marginBottom: 8,
  },
  header: {
    marginBottom: Spacing.md,
  },
  metricsContainer: {
    marginBottom: Spacing.md, // Reduced from lg (24px) to md (16px) for compact layout
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  changeAmount: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.17,
    lineHeight: 24,
  },
  changePercent: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  timePeriod: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  chartContainer: {
    height: 120, // Reduced from 150px to 120px for compact layout
    marginLeft: -Spacing.sm,
    marginRight: -Spacing.sm,
    marginBottom: Spacing.md, // Reduced from lg to md
    overflow: 'hidden',
  },
  chart: {
    marginLeft: 0,
    paddingRight: 0,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm, // Reduced from md to sm for compact layout
    flexWrap: 'wrap',
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
    minWidth: 48,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.background,
  },
  timeRangeText: {
    fontSize: 13,
    color: Colors.mutedForeground,
    fontWeight: '500',
    opacity: 0.6,
  },
  timeRangeTextActive: {
    color: Colors.primary,
    opacity: 1,
  },
  // Empty state
  emptyStateContainer: {
    width: '100%',
  },
  dotContainer: {
    height: 120, // Match chart height
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dotRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(100, 116, 139)',
  },
  messageBox: {
    padding: 16,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  messageTitle: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  messageSubtitle: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 21,
  },
  // Indicator dot
  indicatorDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(71, 85, 105)', // Chart line color
    borderWidth: 2.5,
    borderColor: Colors.card, // White border for contrast
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
