# AI CONTEXT - Quick Handoff Guide

**Last Updated:** January 6, 2026 (Evening)  
**Current Version:** 0.2.0 (MVP Phase - Week 2 Complete)  
**Session Summary:** Complete modal system rebuild + HomeScreen pixel-perfect redesign

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
- ✅ **WORKING:** Sign Up screen, Face ID/PIN auth, Complete Home Screen with Net Worth/Assets/Liabilities cards, Two-step modals for Assets & Liabilities, All individual modals (8 total), DataContext with AsyncStorage persistence, Charts, Delete functionality, Design system, Navigation
- ❌ **NOT WORKING:** Face ID triggers device passcode in Expo Go (limitation - will work in production build)
- 🚧 **IN PROGRESS:** Week 3 features (Edit flows, Settings, Detail screens)

---

## 📍 Where We Are - Project Status

### ✅ What's Been Built (Week 1-2 Complete)

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
- `app/home.tsx` - **COMPLETE Home Screen** with Net Worth, Assets, Liabilities cards
- `app/_layout.tsx` - Root layout (using `<Slot />` for routing)

**4. Components (11 NEW)**
- `NetWorthCard.tsx` - Net worth display with "Updated just now"
- `AssetsCard.tsx` - Asset breakdown with chart + list
- `LiabilitiesCard.tsx` - Liability breakdown with chart + list
- `AssetTypePickerModal.tsx` - Two-step flow, Lucide icons
- `LiabilityTypePickerModal.tsx` - Two-step flow, Lucide icons
- `AddBankModal.tsx` - Bank account entry
- `AddPropertyModal.tsx` - Property asset entry
- `AddOtherAssetModal.tsx` - Other asset entry
- `AddMortgageModal.tsx` - Mortgage entry (header button, all fields)
- `AddLoanModal.tsx` - Loan entry (dropdown, all fields)
- `AddOtherLiabilityModal.tsx` - Other liability entry

**5. Data Layer**
- TypeScript types defined (`/types/index.ts`)
- Asset, Liability, User, SubscriptionState interfaces
- Currency, AssetType, LiabilityType enums
- **DataContext** with React Context API (global state)
- **AsyncStorage persistence** (auto-save on every action)
- CRUD operations: Create, Read, Delete (Update coming in Week 3)

**6. Tech Stack**
- Expo SDK 54
- React 19.1.0 (locked)
- React Native 0.81.5
- TypeScript 5.9
- Expo Router (file-based routing)
- Lucide React Native 0.562.0 (icons)

---

## 🔥 Recent Changes (Last Session - Jan 6, 2026 Evening)

### What We Just Built (Week 2 Complete ✅)

**Major Feature: Complete Home Screen**
- **Net Worth Card** with large 56pt display, "Updated just now" timestamp
- **Assets Card** with horizontal bar chart, category breakdown, and list of all assets
- **Liabilities Card** with horizontal bar chart, category breakdown, and list of all liabilities
- Personalized header with user name and "Overview" title
- Settings icon (Lucide `Settings`) in header
- Pull-to-refresh support (placeholder for future API integration)
- Pixel-perfect alignment with web prototype (exact proportions, typography, spacing)

**Major Feature: Two-Step Modal System**
- **Step 1:** Type Picker modal (select Bank, Portfolio, Property, Other for assets)
- **Step 2:** Specific form modal (tailored fields for each type)
- All modals use Lucide icons (replaced emoji placeholders)
- Smooth transitions with `animationType="slide"` and `presentationStyle="pageSheet"`
- Architecture matches web prototype exactly

**Individual Modals (8 Total):**
- `AddBankModal.tsx` - Bank account entry (TrueLayer placeholder)
- `AddPropertyModal.tsx` - Property entry (name, value, info box)
- `AddOtherAssetModal.tsx` - Other asset entry (collectibles, vehicles, crypto)
- `AddMortgageModal.tsx` - Mortgage entry (header "Add" button, property address, lender, rates, payments)
- `AddLoanModal.tsx` - Loan entry (header "Add" button, dropdown for type, lender, rates)
- `AddOtherLiabilityModal.tsx` - Other liability entry (info box)
- All modals: Title Case labels (15px, 500 weight), 56px input height, inline currency symbols

**Data Layer Complete:**
- `DataContext.tsx` - Global state with React Context API
- `AsyncStorage` persistence - auto-saves on every create/delete action
- Exposes `totalAssets`, `totalLiabilities`, `primaryCurrency` for UI
- Delete functionality with confirmation alerts
- Net worth recalculates in real-time

**Charts & Visualizations:**
- Horizontal bar charts for asset/liability breakdown
- Category color coding (Cash: blue, Property: green, Investments: purple, etc.)
- Real-time updates on data changes
- Smooth animations

### Technical Issues Resolved

**React Version Mismatch**
- **Issue:** "Incompatible React versions" error after installing `lucide-react-native`
- **Root Cause:** React 19.2.3 vs react-native-renderer 19.1.0 mismatch
- **Solution:** 
  - Explicitly locked `react: "^19.1.0"` in package.json
  - Deleted node_modules and package-lock.json
  - Reinstalled with `npm install`
  - Restarted dev server with `npx expo start --ios --clear`
- **Current State:** ✅ FIXED - No more version errors

**Design Inconsistencies**
- **Issue:** HomeScreen didn't match web prototype (typography, spacing, icons)
- **Solution:** Complete redesign with pixel-perfect alignment
  - Fixed all typography (sizes, weights, line heights, letter spacing)
  - Replaced emoji with Lucide icons throughout
  - Adjusted all spacing to match web prototype exactly
  - Rebuilt modal architecture (submit button inside form, not footer)
- **Current State:** ✅ FIXED - Matches web prototype exactly

**Port Conflict**
- **Issue:** Port 8081 already in use after restart
- **Solution:** `lsof -ti:8081 | xargs kill -9`
- **Current State:** ✅ FIXED - Server running smoothly

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

### P0 - Complete Core MVP (Week 3 - Build These Next)

**1. Edit Modal System** (START HERE - Priority 1)
- Create `EditAssetModal.tsx` & `EditLiabilityModal.tsx`
- Pre-populate forms with existing data from DataContext
- Wire to `updateAsset` / `updateLiability` functions
- Add edit action to list items (tap item or pencil icon)
- Add "Delete" button in edit modal (red, bottom)
- Test: edit → save → see update on HomeScreen → verify AsyncStorage

**2. Settings Screen** (Priority 2)
- Create `/app/settings.tsx` screen
- User profile display (name, email from DataContext)
- Currency switcher (GBP/USD/EUR with conversion logic)
- Face ID toggle (enable/disable)
- Logout button (clears AsyncStorage, returns to Sign Up)
- Version info (display current version number)
- Wire settings icon in HomeScreen header to navigate here

**3. Detail Screens** (Priority 3)
- Create `/app/assets-detail.tsx` - Full asset list view
- Create `/app/liabilities-detail.tsx` - Full liability list view
- Group items by category (Cash, Property, etc.)
- Swipe-to-delete functionality (react-native-gesture-handler)
- Wire chevron icons in HomeScreen cards to navigate here
- Show total at top of screen
- Add "Add Asset/Liability" button in header

**4. Stock/ETF Tracking** (Week 3-4)
- Sign up for Twelve Data API (free tier: 800 requests/day)
- Add stock/ETF toggle in Add Asset flow
- Ticker validation & live price fetching
- Auto-refresh every 15 min (or on pull-to-refresh)
- Currency conversion for stocks

**5. Subscriptions** (Week 4)
- RevenueCat SDK setup
- Paywall modal (trigger at 4th asset for free tier)
- Free tier enforcement (3 assets, 2 liabilities max)
- Premium entitlement check
- Restore purchases flow

---

## 📂 Project Structure

```
regent/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout (Slot-based routing)
│   ├── index.tsx                # Sign Up screen ✅ DONE
│   ├── auth.tsx                 # Face ID/PIN auth ✅ DONE
│   └── home.tsx                 # Home dashboard ✅ COMPLETE
├── components/                   # React Native components ✅ NEW (Week 2)
│   ├── NetWorthCard.tsx         # Net worth display
│   ├── AssetsCard.tsx           # Asset breakdown card
│   ├── LiabilitiesCard.tsx      # Liability breakdown card
│   ├── AssetTypePickerModal.tsx     # Two-step flow (step 1)
│   ├── LiabilityTypePickerModal.tsx # Two-step flow (step 1)
│   ├── AddBankModal.tsx         # Bank account entry
│   ├── AddPropertyModal.tsx     # Property entry
│   ├── AddOtherAssetModal.tsx   # Other asset entry
│   ├── AddMortgageModal.tsx     # Mortgage entry
│   ├── AddLoanModal.tsx         # Loan entry
│   └── AddOtherLiabilityModal.tsx # Other liability entry
├── contexts/                     # React Context ✅ NEW (Week 2)
│   └── DataContext.tsx          # Global state + AsyncStorage
├── utils/                        # Helper functions ✅ NEW (Week 2)
│   ├── storage.ts               # AsyncStorage helpers
│   └── generateId.ts            # UUID generation
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

**What Works Perfectly:**
- Design system is solid and complete
- Navigation flow is stable
- Auth UI is polished
- TypeScript types are comprehensive
- ✅ **Home Screen is COMPLETE** (Net Worth, Assets, Liabilities cards)
- ✅ **Two-step modal system is COMPLETE** (8 modals total)
- ✅ **Data persistence is COMPLETE** (AsyncStorage auto-saves)
- ✅ **CRUD operations:** Create ✅, Read ✅, Delete ✅, Update ❌ (coming Week 3)

**What Needs Attention (Week 3 Priorities):**
- Edit flows (can't edit assets/liabilities yet, only delete)
- Settings screen (no way to change currency or logout)
- Detail screens (no full list view yet)
- Stock tracking (no Twelve Data API integration)
- Bank connections (no TrueLayer OAuth)
- Subscriptions (no RevenueCat paywall)

**Best Starting Point:**
1. Read this file completely (you just did! ✅)
2. Review `CHANGELOG.md` to see what was built in Week 2
3. Look at `HomeScreen` and `DataContext` to understand current architecture
4. Start building Edit Modal System (Priority 1 for Week 3)

**Time Estimate:** Week 3 features = 8-12 hours of development (Edit + Settings + Details)

---

## 📞 Questions to Ask User

When starting new session, confirm:
1. "Ready to build Home Screen (Net Worth + Assets + Liabilities cards)?"
2. "Should we implement AsyncStorage persistence this session?"
3. "Any design changes needed before building data entry?"

---

**Remember:** This is a premium app for discerning professionals. Restraint, elegance, and clarity are core to the brand. No gamification, no bright colors, no fluff. Read the spec for full context! 🎯
