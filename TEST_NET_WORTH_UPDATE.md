# Test: Net Worth Update on Price Refresh

**Date:** February 5, 2026  
**Issue:** Net worth appears static when pulling to refresh  
**Status:** Fixed + Enhanced Logging

---

## 🔍 What Was Changed to Fix This

### 1. **Force Fresh Prices** (Main Fix)
**Before:**
```typescript
body: { symbols, forceRefresh: false }, // Use cache if fresh (< 1 hour)
```

**After:**
```typescript
body: { symbols, forceRefresh: true }, // ALWAYS get fresh prices on refresh
```

**Impact:** Every refresh now fetches the latest prices from Twelve Data API, not cached prices

---

### 2. **Comprehensive Logging Added**
Now logs every step of the refresh process:

```
🔄 Pull-to-refresh: Starting price refresh...
💎 Current Net Worth: 100000.00 GBP           <-- BEFORE
🔄 Fetching prices for 3 symbols: ['AAPL', 'MSFT', 'BTC-USD']
✅ Prices fetched: { ... }
💰 AAPL: $180.00 → $185.00 (100 shares)        <-- Per-stock changes
💰 MSFT: $400.00 → $410.00 (50 shares)
📊 Stocks Portfolio: $23,000.00 → $24,250.00 (+5.43%)  <-- Per-asset changes
💰 BTC-USD: $45000.00 → $46000.00 (1 shares)
📊 Crypto Holdings: $45,000.00 → $46,000.00 (+2.22%)
🔄 Updating 2 investment assets...
✅ Asset updated in context: abc123
✅ Asset updated in context: def456
✅ All 2 assets updated
🎯 Investment value change: $68,000.00 → $70,250.00 (+$2,250.00)
📈 Expected net worth: $100,000.00 → $102,250.00 (+$2,250.00)  <-- EXPECTED
✅ Pull-to-refresh: Complete!
```

---

## 🧪 How to Test

### Step 1: Add Test Assets
1. Open WorthView app
2. Add a stock (e.g., AAPL with 10 shares)
3. Note the initial price and net worth

### Step 2: Pull to Refresh
1. Pull down on home screen
2. **Watch console logs** (open Xcode console or React Native debugger)
3. Look for the logs above

### Step 3: Verify Results
Check if:
- [ ] Prices actually changed (💰 lines show different values)
- [ ] Per-asset values updated (📊 lines show changes)
- [ ] Expected net worth is calculated correctly (📈 line)
- [ ] **UI net worth animates to new value** (visually confirm on screen)
- [ ] Chart shows new data point

---

## 🔍 Debugging Scenarios

### Scenario A: Prices Actually Didn't Change
**Console shows:**
```
💰 AAPL: $180.00 → $180.00 (100 shares)
📈 Expected net worth: $100,000.00 → $100,000.00 (+$0.00)
```

**Reason:** Market hasn't moved since last update  
**Solution:** This is normal! Try again during market hours or wait for actual price movement  
**Verify:** Check Yahoo Finance or Google to confirm AAPL price is actually $180

---

### Scenario B: Prices Changed, But Net Worth Didn't Update on Screen
**Console shows:**
```
💰 AAPL: $180.00 → $185.00 (100 shares)
📈 Expected net worth: $100,000.00 → $100,500.00 (+$500.00)
```

**But UI still shows:** $100,000  

**Possible Causes:**
1. **React state not updating** - Check DataContext `setAssets` is being called
2. **Animation not triggering** - Check `animationKey` is incrementing
3. **Component not re-rendering** - Check NetWorthCard props

**How to Debug:**
- Add this log in DataContext after `setAssets()`:
  ```typescript
  console.log('🔄 Assets state updated, new total:', updatedAssets.reduce((s, a) => s + a.value, 0));
  ```

---

### Scenario C: API Error
**Console shows:**
```
❌ Pull-to-refresh error: [error details]
```

**Possible Causes:**
1. Supabase Edge Function not deployed
2. API key invalid or expired
3. Network connection issue
4. Rate limit exceeded

**How to Debug:**
- Check Supabase logs: Dashboard → Edge Functions → fetch-asset-prices
- Check network: Are you online?
- Check API quota: Twelve Data dashboard

---

## 📊 How the Update Flow Works

### Data Flow:
```
1. User pulls down
   ↓
2. refreshPortfolioPrices() called
   ↓
3. Fetch fresh prices (forceRefresh: true)
   ↓
4. Calculate new asset values
   ↓
5. Call updateAsset() for each investment
   ↓
6. DataContext updates assets state array
   ↓
7. netWorth recalculates (computed from assets)
   ↓
8. NetWorthCard receives new netWorth prop
   ↓
9. useEffect detects netWorth change
   ↓
10. Animation runs: displayValue counts up
   ↓
11. UI shows new net worth ✅
```

### Key Components:

**`app/home.tsx`:**
- `refreshPortfolioPrices()` - Orchestrates the refresh
- `updateAsset()` - Updates individual assets

**`contexts/DataContext.tsx`:**
- `setAssets()` - Updates state
- `netWorth` - Computed value (lines 265-267)

**`components/NetWorthCard.tsx`:**
- `useEffect([netWorth])` - Triggers animation (lines 431-448)
- `displayValue` - Animated value shown in UI

---

## 🎯 Expected Behavior After Fix

### Before Fix:
- Pull to refresh → API returns cached prices → Net worth unchanged ❌

### After Fix:
- Pull to refresh → API returns fresh prices → Net worth updates ✅
- Auto-refresh on launch → Checks if >24h → Refreshes if needed ✅
- Console logs show exactly what changed ✅

---

## 🧪 Testing Checklist

### Test 1: Manual Refresh During Market Hours
- [ ] Open app
- [ ] Note net worth (e.g., $100,000)
- [ ] Pull down to refresh
- [ ] **Check console logs** - Do prices change?
- [ ] **Check UI** - Does net worth animate to new value?
- [ ] Wait 5 minutes and repeat (prices should be different)

### Test 2: Manual Refresh Outside Market Hours
- [ ] Test on weekend or after 4 PM ET
- [ ] Pull to refresh
- [ ] **Check console** - Prices should still fetch, might not change
- [ ] Expected: Prices same, net worth same (normal)

### Test 3: Auto-Refresh on Launch
- [ ] Add investment assets
- [ ] Close app for 25+ hours (or change device date)
- [ ] Reopen app
- [ ] **Check console** - Should see "Auto-refresh: Last update was 25.X hours ago"
- [ ] Verify prices refresh automatically

### Test 4: Multiple Assets
- [ ] Add stocks, ETFs, and crypto
- [ ] Pull to refresh
- [ ] **Check console** - Each should log separately
- [ ] Verify total net worth = sum of all changes

---

## 📈 Market Hours Reference

For realistic testing during live market:

**US Stocks (AAPL, MSFT, GOOGL):**
- Monday-Friday, 9:30 AM - 4:00 PM ET
- Pre-market: 4:00 AM - 9:30 AM ET (some APIs support)
- After-hours: 4:00 PM - 8:00 PM ET

**Crypto (BTC, ETH):**
- 24/7/365 (always live, always changing)

**UK Stocks (VUSA.L, VWRL.L):**
- Monday-Friday, 8:00 AM - 4:30 PM GMT

**Best Time to Test:** 
- **Crypto** - Anytime (most volatile)
- **US Stocks** - 2:30-4:00 PM ET (highest volume)
- **UK Stocks** - 9:00-11:00 AM GMT (morning session)

---

## 🔧 Additional Debugging Tools

### Add Manual Logging:

If you want to debug further, add this to DataContext.tsx in the `updateAsset` function (line 356):

```typescript
setAssets(updatedAssets);
console.log('🔄 Assets state updated, new array length:', updatedAssets.length);
console.log('💰 Updated asset values:', updatedAssets.map(a => ({ name: a.name, value: a.value })));
const newTotal = updatedAssets.reduce((s, a) => s + a.value, 0);
console.log('💎 New total assets:', newTotal);
```

This will confirm the assets state is actually updating.

---

## ✅ Success Criteria

After this fix, you should see:

1. **Console logs are detailed** - Can trace every step ✅
2. **Prices force-refresh** - No stale cache ✅
3. **Net worth recalculates** - Expected value shown in logs ✅
4. **UI animates** - Count-up to new value ✅
5. **Chart updates** - New snapshot created ✅
6. **User sees changes** - Net worth reflects market movements ✅

---

## 🚀 Ready for Testing

**Changes included in Build 8:**
- ✅ Force fresh prices on refresh
- ✅ Comprehensive logging for debugging
- ✅ Auto-refresh on app launch (>24h)
- ✅ Better error handling

**To test:**
```bash
# Build and deploy
eas build --platform ios --profile production --auto-submit

# Or test locally
npm start
# Then open on iOS device with Expo Go
```

**Monitor console output to verify prices are actually changing!**

---

**Status:** ✅ FIXED (forceRefresh + logging)  
**Next:** Test with Build 8 and review console logs  
**If still not working:** Share console output for deeper debugging  

---

**Last Updated:** February 5, 2026
