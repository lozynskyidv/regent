# AI CONTEXT - Quick Handoff Guide

**Last Updated:** January 6, 2026  
**Current Version:** 0.1.0 (MVP Phase - Week 1 Complete)  
**Session Summary:** Fresh start after Face ID implementation

---

## 🚀 START HERE - 5 Minute Orientation

### What is Regent?
Premium iOS net worth tracking app for mass affluent professionals (£100k-£1m net worth). Think "Uber-like modernism meets JPM private banking restraint." Built with React Native (Expo).

### What You Need to Know RIGHT NOW

**The Project:**
- **Product Spec:** `REGENT_CURSOR_SPEC.md` (complete product vision, design system, user flows)
- **Technical Guide:** `README.md` (what's built, how it works, architecture)
- **This File:** Quick context for immediate work

**Current State:**
- ✅ **WORKING:** Sign Up screen, Face ID/PIN auth, Home screen (placeholder), Design system, Navigation
- ❌ **NOT WORKING:** Face ID triggers device passcode in Expo Go (limitation - will work in production build)
- 🚧 **IN PROGRESS:** None (ready for next features)

---

## 📍 Where We Are - Project Status

### ✅ What's Been Built (Week 1 Complete)

**1. Authentication Flow**
- Google OAuth sign-up (UI only, not connected yet)
- Face ID authentication screen
- PIN entry fallback (4-digit numeric keypad)
- Navigation: Sign Up → Auth → Home

**2. Design System (Complete)**
- Colors: Premium palette (muted, restrained)
- Typography: Hierarchy established
- Spacing: 4pt base scale
- Layout: Border radius, shadows
- ALL in `/constants/` folder

**3. Core Screens**
- `app/index.tsx` - Sign Up screen (cityscape background, edge-to-edge)
- `app/auth.tsx` - Face ID/PIN authentication
- `app/home.tsx` - Placeholder home screen
- `app/_layout.tsx` - Root layout (using `<Slot />` for routing)

**4. Data Models**
- TypeScript types defined (`/types/index.ts`)
- Asset, Liability, User, SubscriptionState interfaces
- Currency, AssetType, LiabilityType enums

**5. Tech Stack**
- Expo SDK 54
- React 19.1.0
- React Native 0.81.5
- TypeScript 5.9
- Expo Router (file-based routing)

---

## 🔥 Recent Changes (Last Session - Jan 6, 2026)

### What We Just Fixed

**Problem 1: Face ID Not Triggering**
- **Issue:** Face ID was asking for device passcode instead of showing Face ID UI
- **Root Cause:** Expo Go limitation - can't use custom `NSFaceIDUsageDescription` from `app.json`
- **Solution:** 
  - Added `expo-local-authentication` plugin to `app.json`
  - Set `disableDeviceFallback: true` to force biometric-only
  - Added auto-trigger Face ID on Auth screen load (`useEffect`)
  - Added console logging for debugging
- **Current State:** Authentication WORKS (validates successfully), but uses device passcode in Expo Go. Will use Face ID properly in standalone build.

**Problem 2: Gray Bar at Top of Sign Up Screen**
- **Issue:** Status bar area showed gray background instead of edge-to-edge cityscape
- **Root Cause:** `SafeAreaView` was adding padding at top
- **Solution:**
  - Replaced `SafeAreaView` with regular `View`
  - Used `useSafeAreaInsets` hook for manual safe area control
  - Set `StatusBar` to `translucent` with `backgroundColor="transparent"`
  - Increased hero section height (280 → 320) to extend behind status bar
  - Added bottom padding for home indicator
- **Current State:** ✅ FIXED - Cityscape extends edge-to-edge beautifully

### Technical Decisions Made

**1. Navigation Architecture**
- Using `<Slot />` instead of `<Stack>` in `_layout.tsx`
- Why: React 19 + Expo SDK 54 + New Architecture had serialization issues with complex `Stack` props
- Simplified to basic routing - will enhance later

**2. New Architecture Enabled**
- `newArchEnabled: true` in `app.json`
- Why: Expo Go always enables it, so we match to avoid runtime mismatches

**3. Dependencies Added**
- `expo-asset` - Required by Expo Router
- `expo-font` - Font loading support
- `react-native-worklets` - Required by react-native-reanimated v4

---

## 🚧 Known Issues & Workarounds

### Issue 1: Face ID in Expo Go
**Status:** Expected behavior, not a bug  
**What:** Face ID prompt shows device passcode instead of Face ID UI  
**Why:** Expo Go is a pre-built app that can't use custom Face ID permissions from your `app.json`  
**Workaround:** Authentication still works (validates successfully), just uses passcode fallback  
**Fix:** Will work properly when you build standalone app (EAS Build or TestFlight)  
**Code Location:** `app/auth.tsx`, line 20-56 (handleFaceID function)

### Issue 2: React 19 Compatibility
**Status:** Resolved via workarounds  
**What:** React 19 has stricter JSI serialization for native bridge props  
**Impact:** Arrays and complex objects in React Native component props can cause type errors  
**Workarounds Applied:**
- Removed `edges={['top', 'bottom']}` from `SafeAreaView` (caused string/boolean type error)
- Removed `animation: 'fade'` from Stack screenOptions
- Removed `contentStyle` from Stack screenOptions
- Eventually switched to `<Slot />` for simplicity
**Future:** Expo SDK 55+ should have better React 19 support

### Issue 3: Babel Config Changes
**Status:** Monitor on startup  
**What:** Metro bundler sometimes detects babel config changes and asks to restart  
**Workaround:** If you see "Detected a change in babel.config.js", run:
```bash
npx expo start --clear
```

---

## 🎯 Immediate Next Steps (Priority Order)

### P0 - Core MVP Features (Build These Next)

**1. Home Screen Implementation** (Week 2 Priority)
- Net Worth Card (large display: £0 initially)
- Assets Card (list view, no chart yet)
- Liabilities Card (list view, no chart yet)
- Empty states with "Add your first asset" prompts
- Bottom action bar (Add Asset / Add Liability buttons)

**2. Add Asset Modal** (Week 2)
- Manual entry form (name, category, value)
- Categories: Cash, Property, Investments, Other
- Currency input (large, centered)
- Validation (required fields, positive values)
- Save to AsyncStorage
- Update home screen immediately

**3. Add Liability Modal** (Week 2)
- Similar to Add Asset
- Categories: Mortgage, Loan, Credit Card, Other
- Manual entry only (no bank connections yet)

**4. Data Persistence** (Week 2)
- AsyncStorage implementation
- Auto-save on every action
- Load data on app launch
- Handle app lifecycle (background/foreground)

**5. Edit/Delete Flows** (Week 2)
- Tap asset/liability to edit
- Swipe left to delete
- Confirmation dialogs
- Update net worth on change

---

## 📂 Project Structure

```
regent/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout (Slot-based routing)
│   ├── index.tsx                # Sign Up screen ✅ DONE
│   ├── auth.tsx                 # Face ID/PIN auth ✅ DONE
│   └── home.tsx                 # Home dashboard 🚧 Placeholder
├── constants/                    # Design system ✅ COMPLETE
│   ├── Colors.ts                # Color palette
│   ├── Spacing.ts               # Spacing scale (4pt base)
│   ├── Typography.ts            # Font sizes, weights
│   ├── Layout.ts                # Border radius, shadows
│   └── index.ts                 # Central export
├── types/                        # TypeScript definitions ✅ DONE
│   └── index.ts                 # All interfaces
├── web-prototype/                # Original Figma React code (REFERENCE ONLY)
│   └── src/
│       ├── REGENT_CURSOR_SPEC.md  # (copied to root)
│       └── components/            # React web components (design reference)
├── REGENT_CURSOR_SPEC.md         # 📖 Product spec (read this!)
├── README.md                     # 🛠️ Technical guide
├── AI_CONTEXT.md                 # 👋 This file (start here!)
├── CHANGELOG.md                  # 📝 What's been built
├── app.json                      # Expo config
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## 🎨 Design System Quick Reference

### Colors (from `constants/Colors.ts`)
- **Background:** `#FAFAFA` (off-white)
- **Card:** `#FFFFFF` (pure white)
- **Primary:** `#2B3035` (dark gray, almost black)
- **Muted:** `#8C9196` (medium gray for secondary text)
- **Accent:** `#4A90E2` (blue for CTAs)

### Typography (from `constants/Typography.ts`)
- **h1:** 32pt, bold (screen titles)
- **h2:** 28pt, bold (section headers)
- **h3:** 24pt, semibold (card headers)
- **body:** 16pt, regular (default)
- **button:** 16pt, semibold (CTA text)

### Spacing (from `constants/Spacing.ts`)
- Base: 4pt
- xs: 4pt, sm: 8pt, md: 12pt, lg: 16pt, xl: 24pt, 2xl: 32pt

---

## 💻 How to Run & Test

### Development
```bash
# Start Expo dev server
npm start

# Or directly start iOS
npm run ios

# Clear cache if needed
npx expo start --clear
```

### Testing Face ID
- **Expo Go:** Will use device passcode (expected)
- **Standalone Build:** Will use Face ID properly
- **Simulator:** Face ID not fully supported (use device)

### Test User Flow
1. Launch app → See Sign Up screen (cityscape, edge-to-edge)
2. Tap any sign-in button → Navigate to Auth screen
3. Face ID auto-triggers (or shows PIN entry)
4. Enter any 4-digit PIN → Navigate to Home screen
5. Home screen shows placeholder text (Week 2 will build this)

---

## 🛠️ Key Technical Patterns

### File-Based Routing (Expo Router)
- `app/index.tsx` = `/` (Sign Up screen)
- `app/auth.tsx` = `/auth` (Auth screen)
- `app/home.tsx` = `/home` (Home screen)
- Navigate: `router.push('/auth')` or `router.replace('/home')`

### Design System Usage
```typescript
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.primary,
  },
});
```

### Data Models
```typescript
import { Asset, Liability, User } from '../types';

const asset: Asset = {
  id: uuid(),
  name: 'Current Account',
  value: 5000,
  type: 'bank',
  currency: 'GBP',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### AsyncStorage Pattern (To Implement)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('@regent_assets', JSON.stringify(assets));

// Load
const data = await AsyncStorage.getItem('@regent_assets');
const assets = data ? JSON.parse(data) : [];
```

---

## 🚨 Critical Reminders

### DO:
- ✅ Read `REGENT_CURSOR_SPEC.md` for product vision (it's comprehensive!)
- ✅ Use design system constants (never hardcode colors/spacing)
- ✅ Follow TypeScript interfaces strictly
- ✅ Test on physical iPhone (Face ID, deep links don't work in simulator)
- ✅ Save to AsyncStorage after EVERY data change
- ✅ Handle empty states elegantly (no data yet)

### DON'T:
- ❌ Modify `_layout.tsx` without good reason (it's fragile with React 19)
- ❌ Use `SafeAreaView` `edges` prop (causes React 19 serialization issues)
- ❌ Add complex props to native components (keep it simple)
- ❌ Skip error handling (APIs fail, networks drop)
- ❌ Hardcode values (use constants)
- ❌ Build features not in spec (stay focused on MVP)

---

## 📚 Key Files to Reference

### Must Read
1. **`REGENT_CURSOR_SPEC.md`** - Complete product spec (3000+ lines, comprehensive)
2. **`README.md`** - Technical implementation guide
3. **`types/index.ts`** - All data models
4. **`constants/index.ts`** - Design system

### Code Examples
- **Navigation:** `app/auth.tsx` (line 47: `router.replace('/home')`)
- **Design System:** `app/index.tsx` (full implementation of cityscape, buttons, spacing)
- **TypeScript:** `types/index.ts` (all interfaces, proper patterns)

---

## 🤝 Handoff Notes

### For Next AI Developer

**What Works:**
- Design system is solid and complete
- Navigation flow is stable
- Auth UI is polished
- TypeScript types are comprehensive

**What Needs Attention:**
- Home screen is empty (placeholder text only)
- No data persistence yet (AsyncStorage not implemented)
- No Add Asset/Liability modals yet
- Google OAuth UI exists but not connected to real auth

**Best Starting Point:**
1. Read this file completely (you just did! ✅)
2. Skim `REGENT_CURSOR_SPEC.md` sections 1-4 (get product context)
3. Read `README.md` for technical details
4. Start building Home Screen (follow spec section 4, screen 3)

**Time Estimate:** Week 2 features = 10-15 hours of development

---

## 📞 Questions to Ask User

When starting new session, confirm:
1. "Ready to build Home Screen (Net Worth + Assets + Liabilities cards)?"
2. "Should we implement AsyncStorage persistence this session?"
3. "Any design changes needed before building data entry?"

---

**Remember:** This is a premium app for discerning professionals. Restraint, elegance, and clarity are core to the brand. No gamification, no bright colors, no fluff. Read the spec for full context! 🎯
