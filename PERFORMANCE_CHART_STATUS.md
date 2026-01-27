# Performance Chart Status Report
**Date:** January 27, 2026  
**Status:** ✅ FIXED - Using runOnJS for gesture callbacks

---

## 🎉 RESOLUTION (January 27, 2026)

**The crash has been FIXED!**

**Solution:** Wrapped all JavaScript operations in gesture callbacks with `runOnJS()` from react-native-reanimated.

**Root Cause:** `Gesture.Pan()` callbacks are worklets (UI thread), but the code was directly calling React setState and callbacks (JS thread operations) without proper bridging.

**Changes Made:**
1. Added `import { runOnJS } from 'react-native-reanimated'`
2. Created helper functions (`handleGestureStart`, `handleGestureUpdate`, etc.)
3. Wrapped all JS operations with `runOnJS(functionName)(args)`
4. Added explicit `'worklet'` annotations for clarity

**See:** `PERFORMANCE_CHART_FIX.md` for complete technical details.

---

## ✅ THE GOOD: What Works

### 1. Touch Event Fall-Through **FIXED** ✅
**Problem (Original):** Tapping on chart caused touches to fall through to time range buttons below, making the chart morph between time ranges.

**Solution:** Migrated from React Native's `PanResponder` to `react-native-gesture-handler`
- Using `Gesture.Pan()` instead of `PanResponder`
- Using `TouchableOpacity` from `react-native-gesture-handler` (not `react-native`)
- Using `GestureDetector` wrapper

**Result:** Touch event coordination works! Tapping chart no longer triggers button presses.

**Files Changed:**
- `components/PerformanceChart.tsx`: Lines 8, 306, 495, 529

---

## 🔴 THE BAD: Current Crash

### Symptom
- App loads fine ✅
- Home screen displays ✅  
- Chart renders ✅
- **Tap on chart line → App crashes immediately** ❌
- **NO error logs appear in Metro terminal** ❌
- **NO JavaScript error appears** ❌
- This is a **native/bridge crash** happening before JS executes

### Crash Pattern
```
User flow:
1. PIN entrance → ✅ works
2. Home screen loads → ✅ works  
3. Chart displays → ✅ works
4. Tap chart line → ❌ INSTANT CRASH (no logs)
```

---

## 🔬 WHAT WE TRIED (Debugging Journey)

### Attempt 1: Remove Reanimated Shared Values from Dependencies
**Theory:** Reanimated shared values in `useEffect` dependencies cause `stopTracking is not a function` error

**Changes:**
- Removed `dotX`, `dotY`, `dotOpacity`, `dotScale` from `useEffect` dependency array
- Kept only `fractionalPosition` as dependency

**Result:** ❌ Still crashes

### Attempt 2: Remove Reanimated Entirely (Fix #3)
**Theory:** Mixed animation libraries (Reanimated + React Native Animated) cause conflicts

**Changes:**
- Removed `react-native-reanimated` import
- Converted `useSharedValue` → `Animated.Value`
- Converted `withSpring`/`withTiming` → `Animated.spring`/`Animated.timing`
- Converted `Reanimated.View` → `Animated.View`
- Kept `react-native-gesture-handler` (for touch fix)

**Result:** ❌ Still crashes

### Attempt 3: Remove Refs from Worklets
**Theory:** `Gesture.Pan()` callbacks are worklets (UI thread). Modifying refs inside worklets causes native crash.

**Warning Seen:**
```
WARN [Worklets] Tried to modify key `current` of an object 
which has been already passed to a worklet.
```

**Changes:**
- Removed `gestureStartRef`, `chartPointsRef`, `dataPointsRef`
- Changed gesture to use `dataPoints` and `chartPoints` from closure
- Added `dataPoints` and `chartPoints` to `panGesture` dependencies

**Result:** ❌ Still crashes (no logs appear)

### Attempt 4: Add Debug Logging
**Theory:** Trace execution to find exact crash point

**Changes:**
- Added console.log at every step in gesture callbacks (🎯 markers)
- Added console.log at every step in useEffect (💎 markers)

**Result:** ❌ **NO LOGS APPEAR** - Crash happens before first console.log executes

---

## 🎯 ROOT CAUSE ANALYSIS

### Evidence
1. ✅ Gesture handler imports correctly
2. ✅ Chart renders without issues
3. ❌ Crash on tap (no JS logs)
4. ❌ No Metro error
5. ❌ No native crash logs found
6. ⚠️ Worklet warnings appear before crash

### Most Likely Cause
**Native crash in `react-native-gesture-handler` / `react-native-reanimated` bridge**

The crash happens in the native gesture layer before any JavaScript callback executes. This is why:
- No console.log appears
- No JS error is thrown
- Metro terminal shows nothing

### Key Insight
`Gesture.Pan()` from `react-native-gesture-handler` v2+ uses Reanimated worklets internally, even if you don't import Reanimated. The gesture callbacks run on the UI thread as worklets.

---

## 📁 CURRENT CODE STRUCTURE

### Key Files
```
components/PerformanceChart.tsx  ← Main component (crashes here)
app/home.tsx                     ← Renders PerformanceChart
```

### Current Implementation (Simplified)
```typescript
// Using gesture-handler (fixes touch fall-through)
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';

// NOT using Reanimated (removed to debug)
// import Reanimated from 'react-native-reanimated'; ← REMOVED

// Using React Native Animated
import { Animated } from 'react-native';

const panGesture = useMemo(() => {
  return Gesture.Pan()
    .onStart((event) => {
      // ⚠️ CRASHES HERE when tapped (before console.log executes)
      console.log('🎯 Gesture onStart - ENTRY');
      // ... rest of code
    })
}, [dataPoints, chartPoints, screenWidth, ...]);
```

---

## 🔍 WHERE TO LOOK NEXT

### Option 1: Revert to PanResponder (Safest)
**Pros:** No worklets, proven to work before  
**Cons:** Need to solve touch fall-through differently  
**Files to check:** Look at git history before `Gesture.Pan()` migration

### Option 2: Use Reanimated Properly (Modern)
**Pros:** Best performance, modern API  
**Cons:** Complex, need to understand worklet serialization  
**Key:** Use `useSharedValue` for gesture state, avoid `useState` in gesture callbacks

### Option 3: Different Gesture Library
**Pros:** Might avoid worklet issues  
**Cons:** Major refactor  
**Examples:** `react-native-gesture-handler` v1 API, custom touch handling

### Option 4: Investigate Native Logs
**Commands to try:**
```bash
# iOS Simulator logs
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Expo"'

# Crash reports
~/Library/Logs/DiagnosticReports/

# React Native debug logs
npx react-native log-ios
```

---

## 🔧 DEPENDENCIES

### Current Versions (check package.json)
```json
{
  "react-native-gesture-handler": "^?.?.?",
  "react-native-reanimated": "^?.?.?" (currently removed from imports)
}
```

### Important
- `react-native-gesture-handler` v2+ has breaking changes from v1
- Gesture callbacks run as worklets (UI thread)
- Cannot use regular JavaScript refs/functions in worklets without serialization

---

## 📝 REPRODUCTION STEPS

1. Clone repo
2. `npm install`
3. `npm start`
4. Open in iOS simulator
5. Navigate through: Index → Auth → PIN entry → Home
6. **Tap anywhere on the performance chart line**
7. **App crashes instantly** (no error message)

---

## 💡 RECOMMENDATIONS FOR NEXT DEVELOPER

### Immediate Next Steps
1. **Check `react-native-gesture-handler` version**
   - If v2+, gesture callbacks are worklets
   - Consider downgrading to v1 if possible

2. **Capture native crash log**
   - Run: `xcrun simctl spawn booted log stream` before tapping
   - Look for crash signature

3. **Try minimal gesture test**
   - Create simple button with `Gesture.Tap()`
   - If that works, issue is in `Gesture.Pan()` implementation
   - If that crashes, issue is in gesture-handler setup

4. **Check babel.config.js**
   - Ensure reanimated plugin is configured correctly
   - Even if not using Reanimated, gesture-handler needs it

### Long-term Solution
Consider **hybrid approach:**
- Keep `TouchableOpacity` from gesture-handler (prevents button presses)
- Use native `View` with `onTouchStart`/`onTouchMove`/`onTouchEnd` for chart interaction
- Avoid `Gesture.Pan()` entirely if worklets are problematic

---

## 📚 RELEVANT DOCUMENTATION

- [React Native Gesture Handler v2 Migration](https://docs.swmansion.com/react-native-gesture-handler/docs/guides/migrating-off-rnghv1/)
- [Reanimated Worklets](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#worklet)
- [Worklet Troubleshooting](https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting)

---

**Last Updated:** January 27, 2026  
**Status:** Actively crashing, needs native debugging
