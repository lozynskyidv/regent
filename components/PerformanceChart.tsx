/**
 * Performance Chart Component
 * Custom SVG implementation with gradient fill and precise coordinate control
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, UIManager, Animated } from 'react-native';
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
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
  
  // Dot appearance (instant response, no animations)
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0.8)).current;
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [fractionalPosition, setFractionalPosition] = useState<number | null>(null);
  const [displayedValue, setDisplayedValue] = useState<number>(currentNetWorth);
  const [displayedChange, setDisplayedChange] = useState<number>(0);
  const animatedValue = useRef(new Animated.Value(currentNetWorth)).current;
  const animatedChange = useRef(new Animated.Value(0)).current;
  
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [lockedDataPoints, setLockedDataPoints] = useState<number[] | null>(null);
  
  // Throttle state to prevent flooding JS thread with updates
  const lastUpdateTime = useRef(0);
  const UPDATE_THROTTLE_MS = 16; // ~60fps max
  const isFirstUpdate = useRef(true); // Skip throttle on first tap
  
  // FIX: Use actual measured width instead of calculated width
  // event.x is relative to chartContainer, so we need its actual rendered width
  const fallbackWidth = Dimensions.get('window').width - (Spacing.lg * 2);
  const [chartContainerWidth, setChartContainerWidth] = useState(fallbackWidth);
  
  const CHART_HEIGHT = 120;
  const CHART_PADDING_HORIZONTAL = 12;
  const CHART_PADDING_VERTICAL = 20;

  const handleTimeRangeChange = (range: TimeRange) => {
    if (isGestureActive) return;
    if (range === timeRange) return;
    
    setSelectedPointIndex(null);
    setFractionalPosition(null);
    setIsGestureActive(false);
    setLockedDataPoints(null);
    
    // Animate fade out and fade in
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

  // Helper functions
  const formatDateLabel = (date: Date, range: TimeRange): string => {
    if (range === '1M') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === '3M') {
      return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
    }
    if (range === 'YTD') {
      return date.toLocaleString('en-GB', { month: 'short' });
    }
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
      if (timeRange === '1M') return 30;
      if (timeRange === '3M') return 45;
      if (timeRange === 'YTD') return 50;
      return 50;
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

  // Single source of truth - simplified data flow
  const dataPoints = useMemo(() => chartData.datasets[0].data, [chartData]);
  
  // Single activeDataPoints calculation (no multiple sources)
  const activeDataPoints = useMemo(() => {
    return isGestureActive && lockedDataPoints ? lockedDataPoints : dataPoints;
  }, [isGestureActive, lockedDataPoints, dataPoints]);
  
  const firstValue = activeDataPoints[0];
  
  const displayIndex = selectedPointIndex !== null ? selectedPointIndex : activeDataPoints.length - 1;
  const displayValue = activeDataPoints[displayIndex];
  const displayLabel = selectedPointIndex !== null ? chartData.labels[selectedPointIndex] : getTimePeriodLabel();
  
  const performanceChange = displayValue - firstValue;
  const performancePercent = firstValue !== 0 
    ? ((performanceChange / firstValue) * 100).toFixed(1) 
    : '0.0';
  const isPositive = performanceChange >= 0;

  // FIX #1 & #4: chartPoints calculation WITHOUT causing circular dependency
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

  // Helper functions for gesture callbacks (must be defined in JS scope for runOnJS)
  const handleGestureStart = useCallback((snappedIndex: number, clampedFractional: number) => {
    onChartTouchStart?.();
    setLockedDataPoints(dataPoints);
    setIsGestureActive(true);
    isFirstUpdate.current = true; // Bypass throttle for first update
    lastUpdateTime.current = Date.now();
    
    // Set initial position immediately (no throttle delay)
    setSelectedPointIndex(snappedIndex);
    setFractionalPosition(clampedFractional);
  }, [dataPoints, onChartTouchStart]);

  const handleGestureUpdate = useCallback((snappedIndex: number, clampedFractional: number, timestamp: number) => {
    // Skip throttle on first update for instant response
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return; // Position already set in handleGestureStart
    }
    
    // Throttle subsequent updates to prevent flooding JS thread
    const timeSinceLastUpdate = timestamp - lastUpdateTime.current;
    if (timeSinceLastUpdate < UPDATE_THROTTLE_MS) {
      return; // Skip this update
    }
    
    lastUpdateTime.current = timestamp;
    setSelectedPointIndex(snappedIndex);
    setFractionalPosition(clampedFractional);
  }, []);

  const handleGestureEnd = useCallback(() => {
    onChartTouchEnd?.();
    setIsGestureActive(false);
    setLockedDataPoints(null);
    isFirstUpdate.current = true; // Reset for next gesture
    
    // Fade out metrics, reset selection, fade back in
    Animated.timing(metricsOpacity, {
      toValue: 0.6,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPointIndex(null);
      setFractionalPosition(null);
      Animated.timing(metricsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [onChartTouchEnd, metricsOpacity]);

  const handleGestureFinalize = useCallback(() => {
    onChartTouchEnd?.();
    setIsGestureActive(false);
    setLockedDataPoints(null);
    setSelectedPointIndex(null);
    setFractionalPosition(null);
    isFirstUpdate.current = true; // Reset for next gesture
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
      
      if (!lowerPoint || !upperPoint) {
        console.warn('⚠️ Points missing:', { lowerIndex, upperIndex, chartPointsLength: chartPoints.length });
        return;
      }
      
      const targetX = lowerPoint.x + (upperPoint.x - lowerPoint.x) * fraction;
      const targetY = lowerPoint.y + (upperPoint.y - lowerPoint.y) * fraction;
      
      // Set dot position (interpolation provides smooth movement)
      setDotPosition({ x: targetX, y: targetY });
      
      // Set opacity and scale to 1 instantly (no animation needed)
      dotOpacity.setValue(1);
      dotScale.setValue(1);
    } else {
      // Hide dot instantly when gesture ends
      setDotPosition(null);
      dotOpacity.setValue(0);
      dotScale.setValue(0.8);
    }
  }, [fractionalPosition, chartPoints, dotOpacity, dotScale]);

  // Pan gesture with runOnJS for all JS thread operations
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart((event) => {
        'worklet'; // Explicit worklet annotation
        
        // Perform calculations on UI thread (faster)
        if (chartPoints.length === 0) return;
        
        const x = event.x;
        const effectiveWidth = chartContainerWidth - (2 * CHART_PADDING_HORIZONTAL);
        const touchX = x - CHART_PADDING_HORIZONTAL;
        
        // Clamp touchX to valid chart boundaries (prevent dot going outside)
        const clampedTouchX = Math.max(0, Math.min(touchX, effectiveWidth));
        
        const fractionalPos = (clampedTouchX / effectiveWidth) * (chartPoints.length - 1);
        const clampedFractional = Math.max(0, Math.min(fractionalPos, chartPoints.length - 1));
        const snappedIndex = Math.round(clampedFractional);
        
        // Start gesture and set initial position immediately (bypasses throttle)
        if (snappedIndex >= 0 && snappedIndex < chartPoints.length) {
          runOnJS(handleGestureStart)(snappedIndex, clampedFractional);
        }
      })
      .onUpdate((event) => {
        'worklet'; // Explicit worklet annotation
        
        if (chartPoints.length === 0) return;
        
        // Perform calculations on UI thread (faster)
        const x = event.x;
        const effectiveWidth = chartContainerWidth - (2 * CHART_PADDING_HORIZONTAL);
        const touchX = x - CHART_PADDING_HORIZONTAL;
        
        // Clamp touchX to valid chart boundaries (prevent dot going outside)
        const clampedTouchX = Math.max(0, Math.min(touchX, effectiveWidth));
        
        const fractionalPos = (clampedTouchX / effectiveWidth) * (chartPoints.length - 1);
        const clampedFractional = Math.max(0, Math.min(fractionalPos, chartPoints.length - 1));
        const snappedIndex = Math.round(clampedFractional);
        
        // Update state on JS thread (with timestamp for throttling)
        if (snappedIndex >= 0 && snappedIndex < chartPoints.length) {
          runOnJS(handleGestureUpdate)(snappedIndex, clampedFractional, Date.now());
        }
      })
      .onEnd(() => {
        'worklet'; // Explicit worklet annotation
        
        // End gesture on JS thread (includes animation sequence)
        runOnJS(handleGestureEnd)();
      })
      .onFinalize(() => {
        'worklet'; // Explicit worklet annotation
        
        // Finalize gesture on JS thread
        runOnJS(handleGestureFinalize)();
      });
  }, [chartPoints, chartContainerWidth, handleGestureStart, handleGestureUpdate, handleGestureEnd, handleGestureFinalize]);
  // All JS operations now properly bridged via runOnJS

  // Animate value changes
  useEffect(() => {
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
    ]).start();
  }, [displayValue, performanceChange]);

  // Listen to animated values
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

  // Day 1 state
  if (isDay1) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.currentValue}>{formatCurrency(currentNetWorth)}</Text>
        
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
      {/* Header with metrics */}
      <Animated.View 
        style={[
          styles.metricsContainer, 
          { 
            opacity: metricsOpacity
          }
        ]}
      >
        <Text style={styles.title}>Performance</Text>
        
        <Text style={styles.currentValue}>
          {formatCurrency(displayedValue)}
        </Text>
        
        <View style={styles.changeContainer}>
          <Text style={[styles.changeAmount, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            {isPositive ? '↑' : '↓'} {formatCurrency(Math.abs(displayedChange))}
          </Text>
          <Text style={[styles.changePercent, { color: isPositive ? '#22C55E' : '#EF4444' }]}>
            ({isPositive ? '+' : ''}{performancePercent}%)
          </Text>
        </View>
        
        <Text style={styles.timePeriod}>
          {displayLabel}
        </Text>
      </Animated.View>

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
                  <Stop offset="0%" stopColor="rgb(71, 85, 105)" stopOpacity={0.15} />
                  <Stop offset="100%" stopColor="rgb(71, 85, 105)" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              
              <Path d={gradientPath} fill="url(#chartGradient)" />
              <Path
                d={linePath}
                stroke="rgb(71, 85, 105)"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>

            {/* Dot indicator - FIX #3: Using React Native Animated (stable) */}
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
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
  metricsContainer: {
    marginBottom: Spacing.md,
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
    height: 120,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'relative',
    height: 120,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.md,
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
    height: 120,
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
