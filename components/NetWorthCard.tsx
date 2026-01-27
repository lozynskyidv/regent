/**
 * Net Worth Card Component (Merged with Performance Chart)
 * - Displays total net worth with large prominent typography
 * - Interactive performance chart with historical trends
 * - Count-up animation from 0 to current value
 * - YTD percentage change for context
 * - Time range selector: 1M, 3M, 6M, YTD, 1Y, All
 * - Custom SVG implementation with gradient fill and precise coordinate control
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, UIManager, Animated, Easing } from 'react-native';
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants';
import { NetWorthSnapshot, Currency } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All';

interface NetWorthCardProps {
  netWorth: number;
  currency: Currency;
  snapshots: NetWorthSnapshot[];
  onChartTouchStart?: () => void;
  onChartTouchEnd?: () => void;
}

export default function NetWorthCard({ netWorth, currency, snapshots, onChartTouchStart, onChartTouchEnd }: NetWorthCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('All');
  const chartOpacity = useRef(new Animated.Value(1)).current;
  
  // Count-up animation for main net worth value
  const [displayValue, setDisplayValue] = useState(0);
  const animatedNetWorth = useRef(new Animated.Value(0)).current;
  
  // Dot appearance (instant response, no animations)
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0.8)).current;
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [fractionalPosition, setFractionalPosition] = useState<number | null>(null);
  const [displayedChange, setDisplayedChange] = useState<number>(0);
  const animatedChange = useRef(new Animated.Value(0)).current;
  
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [lockedDataPoints, setLockedDataPoints] = useState<number[] | null>(null);
  
  // Throttle state to prevent flooding JS thread with updates
  const lastUpdateTime = useRef(0);
  const UPDATE_THROTTLE_MS = 16; // ~60fps max
  const isFirstUpdate = useRef(true); // Skip throttle on first tap
  
  // Use actual measured width instead of calculated width
  const fallbackWidth = Dimensions.get('window').width - (Spacing.lg * 2);
  const [chartContainerWidth, setChartContainerWidth] = useState(fallbackWidth);
  
  const CHART_HEIGHT = 150;
  const CHART_PADDING_HORIZONTAL = 12;
  const CHART_PADDING_VERTICAL = 20;

  const handleTimeRangeChange = (range: TimeRange) => {
    if (isGestureActive) return;
    if (range === timeRange) return;
    
    // Haptic feedback on time range change
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedPointIndex(null);
    setFractionalPosition(null);
    setIsGestureActive(false);
    setLockedDataPoints(null);
    
    // Animate fade out and fade in
    Animated.timing(chartOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeRange(range);
      
      Animated.timing(chartOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  // Helper functions
  const formatDateLabel = (date: Date, range: TimeRange): string => {
    if (range === '1M') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === '3M' || range === '6M') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === '1Y') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    // All - show month + year for long time spans
    return date.toLocaleString('en-GB', { month: 'short', year: '2-digit' });
  };

  const getTimePeriodLabel = () => {
    if (timeRange === '1M') return 'This month';
    if (timeRange === '3M') return 'Last 3 months';
    if (timeRange === '6M') return 'Last 6 months';
    if (timeRange === '1Y') return 'This year';
    return 'All time';
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
      if (timeRange === '6M') return daysAgo <= 180;
      if (timeRange === '1Y') return daysAgo <= 365;
      if (timeRange === 'All') return true; // Show all data
      return false;
    });

    // Sort by date (oldest first)
    const sortedSnapshots = [...filteredSnapshots].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Day 1 check: If we have fewer than 2 historical data points, show Day 1 state
    const isDay1 = sortedSnapshots.length < 2;

    // Dynamic max points based on time range - optimal balance of detail vs. visual clarity
    const getMaxPoints = () => {
      if (timeRange === '1M') return 30;   // ~Daily granularity (30 points for 30 days)
      if (timeRange === '3M') return 45;   // ~Every 2 days (45 points for 90 days)
      if (timeRange === '6M') return 60;   // ~Every 3 days (60 points for 180 days)
      if (timeRange === '1Y') return 52;   // ~Weekly granularity (52 weeks)
      return 100; // All - sample for performance (could be years of data)
    };
    
    const maxPoints = getMaxPoints();
    const step = Math.max(1, Math.floor(sortedSnapshots.length / maxPoints));
    const sampledSnapshots = sortedSnapshots.filter((_, index) => index % step === 0);

    // Add current value as last point
    const allSnapshots = [...sampledSnapshots, {
      timestamp: now.toISOString(),
      netWorth: netWorth,
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
  }, [snapshots, netWorth, timeRange]);

  // Single source of truth - simplified data flow
  const dataPoints = useMemo(() => chartData.datasets[0].data, [chartData]);
  
  // Single activeDataPoints calculation (no multiple sources)
  const activeDataPoints = useMemo(() => {
    return isGestureActive && lockedDataPoints ? lockedDataPoints : dataPoints;
  }, [isGestureActive, lockedDataPoints, dataPoints]);
  
  const firstValue = activeDataPoints[0];
  
  const displayIndex = selectedPointIndex !== null ? selectedPointIndex : activeDataPoints.length - 1;
  const chartDisplayValue = activeDataPoints[displayIndex];
  const displayLabel = selectedPointIndex !== null ? chartData.labels[selectedPointIndex] : getTimePeriodLabel();
  
  const performanceChange = chartDisplayValue - firstValue;
  const performancePercent = firstValue !== 0 
    ? ((performanceChange / firstValue) * 100).toFixed(1) 
    : '0.0';
  const isPositive = performanceChange >= 0;

  // Chart paths calculation
  const { linePath, gradientPath, chartPoints } = useMemo(() => {
    const points = activeDataPoints;
    if (points.length === 0) return { linePath: '', gradientPath: '', chartPoints: [] };

    const effectiveWidth = chartContainerWidth - (2 * CHART_PADDING_HORIZONTAL);
    const effectiveHeight = CHART_HEIGHT - (2 * CHART_PADDING_VERTICAL);

    // Find min/max for scaling
    const minValue = Math.min(...points);
    const maxValue = Math.max(...points);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Calculate chart points
    const calculatedPoints = points.map((value, index) => {
      const x = CHART_PADDING_HORIZONTAL + (index / (points.length - 1)) * effectiveWidth;
      const normalizedValue = (value - minValue) / valueRange;
      const y = CHART_PADDING_VERTICAL + effectiveHeight - (normalizedValue * effectiveHeight);
      return { x, y, value };
    });

    // Create smooth bezier curve path for the line
    const linePath = calculatedPoints.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x},${point.y}`;
      }
      
      // Smooth bezier curve
      const prevPoint = calculatedPoints[index - 1];
      const controlX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
      const controlY1 = prevPoint.y;
      const controlX2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
      const controlY2 = point.y;
      
      return `${path} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${point.x},${point.y}`;
    }, '');

    // Create gradient fill area (same path but closed to bottom)
    const gradientPath = `${linePath} L ${calculatedPoints[calculatedPoints.length - 1].x},${CHART_HEIGHT} L ${calculatedPoints[0].x},${CHART_HEIGHT} Z`;

    return { linePath, gradientPath, chartPoints: calculatedPoints };
  }, [activeDataPoints, chartContainerWidth]);

  // Helper functions for gesture callbacks
  const handleGestureStart = useCallback((snappedIndex: number, clampedFractional: number) => {
    onChartTouchStart?.();
    
    // Haptic feedback on chart touch start
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setLockedDataPoints(dataPoints);
    setIsGestureActive(true);
    isFirstUpdate.current = true;
    lastUpdateTime.current = Date.now();
    
    setSelectedPointIndex(snappedIndex);
    setFractionalPosition(clampedFractional);
  }, [dataPoints, onChartTouchStart]);

  // Track last haptic index to avoid excessive feedback
  const lastHapticIndex = useRef<number>(-1);

  const handleGestureUpdate = useCallback((snappedIndex: number, clampedFractional: number, timestamp: number) => {
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }
    
    const timeSinceLastUpdate = timestamp - lastUpdateTime.current;
    if (timeSinceLastUpdate < UPDATE_THROTTLE_MS) {
      return;
    }
    
    // Haptic feedback when crossing to a new data point
    if (Platform.OS === 'ios' && snappedIndex !== lastHapticIndex.current) {
      Haptics.selectionAsync();
      lastHapticIndex.current = snappedIndex;
    }
    
    lastUpdateTime.current = timestamp;
    setSelectedPointIndex(snappedIndex);
    setFractionalPosition(clampedFractional);
  }, []);

  const handleGestureEnd = useCallback(() => {
    onChartTouchEnd?.();
    setIsGestureActive(false);
    setLockedDataPoints(null);
    isFirstUpdate.current = true;
    lastHapticIndex.current = -1; // Reset haptic tracking
    
    // Fade transition back to current value
    Animated.timing(chartOpacity, {
      toValue: 0.6,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPointIndex(null);
      setFractionalPosition(null);
      Animated.timing(chartOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [onChartTouchEnd, chartOpacity]);

  const handleGestureFinalize = useCallback(() => {
    onChartTouchEnd?.();
    setIsGestureActive(false);
    setLockedDataPoints(null);
    setSelectedPointIndex(null);
    setFractionalPosition(null);
    isFirstUpdate.current = true;
    lastHapticIndex.current = -1; // Reset haptic tracking
  }, [onChartTouchEnd]);

  // Update dot position when fractional position changes
  useEffect(() => {
    if (fractionalPosition !== null && chartPoints.length > 0) {
      const clampedPosition = Math.max(0, Math.min(fractionalPosition, chartPoints.length - 1));
      const lowerIndex = Math.floor(clampedPosition);
      const upperIndex = Math.min(Math.ceil(clampedPosition), chartPoints.length - 1);
      const fraction = clampedPosition - lowerIndex;
      
      const lowerPoint = chartPoints[lowerIndex];
      const upperPoint = chartPoints[upperIndex];
      
      if (!lowerPoint || !upperPoint) return;
      
      const targetX = lowerPoint.x + (upperPoint.x - lowerPoint.x) * fraction;
      const targetY = lowerPoint.y + (upperPoint.y - lowerPoint.y) * fraction;
      
      setDotPosition({ x: targetX, y: targetY });
      
      dotOpacity.setValue(1);
      dotScale.setValue(1);
    } else {
      setDotPosition(null);
      dotOpacity.setValue(0);
      dotScale.setValue(0.8);
    }
  }, [fractionalPosition, chartPoints, dotOpacity, dotScale]);

  // Pan gesture with runOnJS for all JS thread operations
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart((event) => {
        'worklet';
        
        if (chartPoints.length === 0) return;
        
        const x = event.x;
        const effectiveWidth = chartContainerWidth - (2 * CHART_PADDING_HORIZONTAL);
        const touchX = x - CHART_PADDING_HORIZONTAL;
        
        const clampedTouchX = Math.max(0, Math.min(touchX, effectiveWidth));
        
        const fractionalPos = (clampedTouchX / effectiveWidth) * (chartPoints.length - 1);
        const clampedFractional = Math.max(0, Math.min(fractionalPos, chartPoints.length - 1));
        const snappedIndex = Math.round(clampedFractional);
        
        if (snappedIndex >= 0 && snappedIndex < chartPoints.length) {
          runOnJS(handleGestureStart)(snappedIndex, clampedFractional);
        }
      })
      .onUpdate((event) => {
        'worklet';
        
        if (chartPoints.length === 0) return;
        
        const x = event.x;
        const effectiveWidth = chartContainerWidth - (2 * CHART_PADDING_HORIZONTAL);
        const touchX = x - CHART_PADDING_HORIZONTAL;
        
        const clampedTouchX = Math.max(0, Math.min(touchX, effectiveWidth));
        
        const fractionalPos = (clampedTouchX / effectiveWidth) * (chartPoints.length - 1);
        const clampedFractional = Math.max(0, Math.min(fractionalPos, chartPoints.length - 1));
        const snappedIndex = Math.round(clampedFractional);
        
        if (snappedIndex >= 0 && snappedIndex < chartPoints.length) {
          runOnJS(handleGestureUpdate)(snappedIndex, clampedFractional, Date.now());
        }
      })
      .onEnd(() => {
        'worklet';
        runOnJS(handleGestureEnd)();
      })
      .onFinalize(() => {
        'worklet';
        runOnJS(handleGestureFinalize)();
      });
  }, [chartPoints, chartContainerWidth, handleGestureStart, handleGestureUpdate, handleGestureEnd, handleGestureFinalize]);

  // Animate performance change
  useEffect(() => {
    Animated.spring(animatedChange, {
      toValue: performanceChange,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [performanceChange]);

  // Listen to animated change value
  useEffect(() => {
    const changeListener = animatedChange.addListener(({ value }) => {
      setDisplayedChange(Math.round(value));
    });

    return () => {
      animatedChange.removeListener(changeListener);
    };
  }, []);

  // Count-up animation for main net worth value (triggers on mount and when netWorth changes)
  useEffect(() => {
    animatedNetWorth.setValue(0);
    
    const listenerId = animatedNetWorth.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    
    Animated.timing(animatedNetWorth, {
      toValue: netWorth,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedNetWorth.removeListener(listenerId);
    };
  }, [netWorth, animatedNetWorth]);

  // Day 1 state
  if (isDay1) {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>NET WORTH</Text>
        <Text style={styles.mainValue}>{formatCurrency(displayValue)}</Text>
        
        <View style={styles.emptyStateContainer}>
          <View style={styles.dotContainer}>
            <View style={styles.dotRing}>
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
      {/* Header with main value, change amount, percentage, and time period */}
      <View style={styles.headerContainer}>
        <Text style={styles.label}>NET WORTH</Text>
        
        <Text style={styles.mainValue}>
          {formatCurrency(selectedPointIndex !== null ? chartDisplayValue : displayValue)}
        </Text>
        
        {/* Show both absolute change and percentage together */}
        <Text style={[styles.changeText, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
          {isPositive ? '↑' : '↓'} {formatCurrency(Math.abs(displayedChange))} ({isPositive ? '+' : ''}{performancePercent}%)
        </Text>
        
        {/* Time period label */}
        <Text style={styles.timePeriod}>
          {displayLabel}
        </Text>
      </View>

      {/* Chart */}
      <GestureDetector gesture={panGesture}>
        <Animated.View 
          style={[styles.chartContainer, { opacity: chartOpacity }]}
          onLayout={(e) => setChartContainerWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.svgContainer}>
            <Svg width={chartContainerWidth} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="rgb(100, 116, 139)" stopOpacity={0.15} />
                  <Stop offset="100%" stopColor="rgb(100, 116, 139)" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              
              <Path d={gradientPath} fill="url(#chartGradient)" />
              <Path
                d={linePath}
                stroke="rgb(100, 116, 139)"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>

            {/* Dot indicator */}
            {dotPosition && (
              <Animated.View
                style={[
                  styles.indicatorDot,
                  {
                    left: dotPosition.x - 6,
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
      </GestureDetector>

      {/* Time range selector */}
      <View style={styles.timeRangeContainer}>
        {(['1M', '3M', '6M', '1Y', 'All'] as TimeRange[]).map((range) => (
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.mutedForeground,
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  headerContainer: {
    marginBottom: 20,
  },
  mainValue: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.foreground,
    letterSpacing: -1.44,
    lineHeight: 56,
    marginBottom: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.16,
    lineHeight: 24,
  },
  timePeriod: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  chartContainer: {
    height: 150,
    marginLeft: -Spacing.lg,
    marginRight: -Spacing.lg,
    marginBottom: 16,
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'relative',
    height: 150,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    marginTop: 16,
  },
  dotContainer: {
    height: 150,
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
    backgroundColor: 'rgb(71, 85, 105)',
    borderWidth: 2.5,
    borderColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
