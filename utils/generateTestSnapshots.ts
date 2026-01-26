/**
 * Generate Test Snapshots for Performance Chart
 * Creates realistic historical net worth data for testing
 */

import { NetWorthSnapshot } from '../types';

export function generateTestSnapshots(
  currentNetWorth: number,
  daysOfHistory: number = 730 // 2 years default
): NetWorthSnapshot[] {
  const snapshots: NetWorthSnapshot[] = [];
  const now = new Date();
  
  // Starting value: 75% of current (25% growth over period)
  const startValue = currentNetWorth * 0.75;
  
  // Generate daily snapshots
  for (let daysAgo = daysOfHistory; daysAgo >= 1; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(12, 0, 0, 0); // Noon for consistency
    
    // Calculate progress (0 to 1)
    const progress = (daysOfHistory - daysAgo) / daysOfHistory;
    
    // Base growth: linear progression from start to current
    const baseValue = startValue + (currentNetWorth - startValue) * progress;
    
    // Add realistic volatility (±2% daily fluctuation)
    const volatilityPercent = (Math.random() * 0.04 - 0.02); // -2% to +2%
    const volatility = baseValue * volatilityPercent;
    
    // Add seasonal patterns (market cycles)
    const seasonalFactor = Math.sin((daysAgo / 365) * Math.PI * 2) * 0.03;
    const seasonal = baseValue * seasonalFactor;
    
    // Calculate final value
    let netWorth = baseValue + volatility + seasonal;
    
    // Ensure it doesn't go negative
    netWorth = Math.max(netWorth, 0);
    
    // Round to nearest pound
    netWorth = Math.round(netWorth);
    
    // Estimate assets and liabilities (roughly 80/20 split for positive net worth)
    const totalAssets = Math.round(netWorth * 1.2);
    const totalLiabilities = totalAssets - netWorth;
    
    snapshots.push({
      id: `snapshot-${date.getTime()}`,
      netWorth,
      totalAssets,
      totalLiabilities,
      timestamp: date.toISOString()
    });
  }
  
  return snapshots;
}

/**
 * Generate snapshots with more dramatic growth pattern
 * Useful for testing chart visualization
 */
export function generateTestSnapshotsWithGrowth(
  currentNetWorth: number,
  daysOfHistory: number = 730,
  growthPercent: number = 50 // 50% growth by default
): NetWorthSnapshot[] {
  const snapshots: NetWorthSnapshot[] = [];
  const now = new Date();
  
  // Calculate starting value based on desired growth
  const startValue = currentNetWorth / (1 + (growthPercent / 100));
  
  for (let daysAgo = daysOfHistory; daysAgo >= 1; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(12, 0, 0, 0);
    
    const progress = (daysOfHistory - daysAgo) / daysOfHistory;
    
    // Exponential growth curve (more realistic than linear)
    const growthFactor = Math.pow(1 + (growthPercent / 100), progress);
    const baseValue = startValue * growthFactor;
    
    // Add volatility
    const volatilityPercent = (Math.random() * 0.04 - 0.02);
    const volatility = baseValue * volatilityPercent;
    
    let netWorth = baseValue + volatility;
    netWorth = Math.max(Math.round(netWorth), 0);
    
    const totalAssets = Math.round(netWorth * 1.2);
    const totalLiabilities = totalAssets - netWorth;
    
    snapshots.push({
      id: `snapshot-${date.getTime()}`,
      netWorth,
      totalAssets,
      totalLiabilities,
      timestamp: date.toISOString()
    });
  }
  
  return snapshots;
}
