# Performance Chart Date Bug

**Status:** ❌ **ACTIVE BUG**  
**Reported:** Feb 9, 2026  
**Impact:** MEDIUM - Chart displays incorrect dates, confusing users

---

## Problem Statement

The performance chart shows future dates (e.g., "Feb 26") when viewing recent data, even though today is Feb 9, 2026. This makes the chart confusing and unprofessional.

---

## Observed Behavior

### What Should Happen:
1. User adds stocks on Feb 9
2. Chart shows data points from previous days (Feb 5, 6, 7, 8, 9)
3. Dates are labeled correctly: "5 Feb", "6 Feb", "7 Feb", "8 Feb", "9 Feb"

### What Actually Happens:
1. User adds stocks on Feb 9  
2. Chart initially shows "flat line" (no historical data - correct)
3. After a day or refresh, chart updates with price changes
4. **Chart shows dates like "Feb 26"** - 17 days in the future!

---

## Initial Behavior Notes

User reported:
> "I added stocks a few days ago and performance chart at first showed flat line then updated (odd behavior) and showed they went down (true) but when you use chart it shows Feb 26 lol"

### Analysis:
1. **Flat line initially** - Expected on Day 1 (no historical snapshots yet)
2. **Updated and showed price changes** - Correct (automatic price refresh working)
3. **Shows Feb 26** - BUG (incorrect date labels)

---

## Technical Investigation

### Date Formatting Code
**File:** `components/NetWorthCard.tsx` (Lines 100-112)

```typescript
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
```

### Snapshot Creation Code
**File:** `contexts/DataContext.tsx` (Lines 273-307)

```typescript
useEffect(() => {
  const createDailySnapshot = async () => {
    if (assets.length === 0 && liabilities.length === 0) {
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if we already have a snapshot for today
    const hasToday = snapshots.some(s => 
      s.timestamp.startsWith(today)
    );

    if (!hasToday) {
      const newSnapshot: NetWorthSnapshot = {
        id: generateId(),
        netWorth,
        totalAssets,
        totalLiabilities,
        timestamp: now.toISOString(),  // ← Stores as ISO string
      };
      // ...
    }
  };
  createDailySnapshot();
}, [assets, liabilities]);
```

### Chart Data Generation
**File:** `components/NetWorthCard.tsx` (Lines 133-190)

```typescript
const { chartData, isDay1 } = useMemo(() => {
  const now = new Date();

  // Filter snapshots based on time range
  const filteredSnapshots = snapshots.filter(snapshot => {
    const snapshotDate = new Date(snapshot.timestamp);  // ← Parse ISO string
    const daysAgo = (now.getTime() - snapshotDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (timeRange === '1M') return daysAgo <= 30;
    // ...
  });

  // Sort by date
  const sortedSnapshots = [...filteredSnapshots].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Add current value as last point
  const allSnapshots = [...sampledSnapshots, {
    timestamp: now.toISOString(),  // ← Current time
    netWorth: netWorth,
    // ...
  }];

  const chartData = {
    labels: allSnapshots.map((snapshot, index) => {
      if (index === allSnapshots.length - 1) return 'Now';
      const date = new Date(snapshot.timestamp);  // ← Parse for label
      return formatDateLabel(date, timeRange);
    }),
    // ...
  };
}, [snapshots, netWorth, timeRange]);
```

---

## Potential Causes

### Hypothesis 1: Timezone Issue
- `new Date().toISOString()` returns UTC time
- `new Date(snapshot.timestamp)` might parse incorrectly based on local timezone
- Could cause dates to shift forward/backward

**Example:**
```typescript
// Creating snapshot (UTC)
timestamp: "2026-02-09T18:00:00.000Z"  // 6pm UTC = 6pm London

// Parsing snapshot (Local)
new Date("2026-02-09T18:00:00.000Z")  // Might interpret as different day in local TZ
```

### Hypothesis 2: Date Calculation Bug
The `daysAgo` calculation might have an off-by-one error:
```typescript
const daysAgo = (now.getTime() - snapshotDate.getTime()) / (1000 * 60 * 60 * 24);
```

If `now` is ahead or behind due to timezone, could miscalculate which dates to show.

### Hypothesis 3: Data Corruption
Snapshots might have incorrect timestamps stored from an earlier bug.

---

## Reproduction Steps

1. Add stocks to app (e.g., Feb 5, 2026)
2. Wait for automatic price refresh (24 hours)
3. View performance chart
4. Check date labels on x-axis
5. **Expected:** "5 Feb", "6 Feb", "7 Feb", "8 Feb", "9 Feb"
6. **Actual:** Shows "Feb 26" (17 days in future)

---

## Debug Steps

### Step 1: Log Snapshot Timestamps
Add logging to see what's actually stored:
```typescript
console.log('📸 Snapshots:', snapshots.map(s => ({
  date: s.timestamp,
  parsed: new Date(s.timestamp).toISOString(),
  localDate: new Date(s.timestamp).toLocaleDateString()
})));
```

### Step 2: Log Chart Data Generation
Add logging to see what dates are being used:
```typescript
console.log('📊 Chart labels:', allSnapshots.map((s, i) => ({
  timestamp: s.timestamp,
  parsed: new Date(s.timestamp),
  label: formatDateLabel(new Date(s.timestamp), timeRange),
  isNow: i === allSnapshots.length - 1
})));
```

### Step 3: Check Raw AsyncStorage Data
Read the snapshots directly from storage:
```typescript
const raw = await AsyncStorage.getItem('worthview_net_worth_snapshots');
console.log('💾 Raw snapshots:', JSON.parse(raw || '[]'));
```

---

## Proposed Fixes

### Fix 1: Normalize to Local Timezone
Always use local date, not UTC:
```typescript
// Instead of:
timestamp: now.toISOString()

// Use:
timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
```

### Fix 2: Use Date-only Strings
Store dates as YYYY-MM-DD strings instead of full ISO:
```typescript
timestamp: now.toISOString().split('T')[0]  // "2026-02-09"
```

### Fix 3: Add Timezone Offset
Adjust for local timezone when parsing:
```typescript
const snapshotDate = new Date(snapshot.timestamp);
const localDate = new Date(snapshotDate.getTime() + snapshotDate.getTimezoneOffset() * 60000);
```

---

## Impact Assessment

### User Experience:
- **Confusing** - Future dates make no sense
- **Unprofessional** - Looks like a bug (because it is)
- **Trust issue** - If dates are wrong, what else is wrong?

### Business Impact:
- **Medium priority** - Not blocking launch, but looks bad
- **Easy to fix** - Likely a timezone/parsing issue
- **Should fix before App Store** - Reviewers will notice

---

## Action Items

1. **Add debug logging** to see what timestamps are stored
2. **Test with manual snapshots** to isolate the issue
3. **Implement Fix 2** (date-only strings) - simplest and most reliable
4. **Test across timezones** to verify fix works universally

---

## Temporary Workaround

Until fixed, users can:
- Ignore the date labels
- Focus on the shape of the chart (trend direction)
- Use "Now" label for current value

---

**Last Updated:** Feb 9, 2026  
**Status:** ❌ UNRESOLVED  
**Priority:** MEDIUM
