# WorthView - Project Context

**Version:** 1.0.0 (Build 14)  
**Platform:** iOS (React Native + Expo)  
**Status:** ❌ BLOCKED - Critical bugs preventing App Store submission  
**Tagline:** Everything you own and owe, in one place

---

## 🚨 CRITICAL STATUS UPDATE (Feb 9, 2026)

### Build 14 - Current Status

**❌ Apple Sign In Name - UNRESOLVED (5 builds, 3 days):**
- Builds 10-14: All attempts failed
- Problem: Shows "User" instead of real name
- Cause: Race condition between auth and profile sync
- **BLOCKING:** App Store submission
- **Solution:** Implement manual name input (30 min)
- **Details:** See `APPLE_SIGNIN_NAME_ISSUE.md`

**❌ Performance Chart Dates - BROKEN:**
- Problem: Shows future dates (Feb 26 when today is Feb 9)
- Cause: Likely timezone parsing issue
- **Impact:** Confusing, unprofessional
- **Solution:** Store dates as YYYY-MM-DD strings (15 min)
- **Details:** See `CHART_DATE_BUG.md`

**✅ Automatic Price Refresh - WORKING:**
- Prices refresh automatically on app launch if >24 hours old
- Force fresh prices enabled (no cached data)
- Performance chart shows daily trends

**✅ iPad Support - ENABLED:**
- App works on both iPhone and iPad
- Native Apple authentication implemented

**⚠️ Subscription Not Available:**
- In-app purchase not configured
- Requires App Store Connect + RevenueCat setup
- Not blocking testing, but required for launch

---

## 📋 Build History

### Build 14 (Current - Feb 9, 2026)
- **Status:** On TestFlight, **FAILED** to fix name issue
- **Build ID:** `863c0f1b-dcf3-4399-bf30-cae63802b75f`
- **Attempted:** Pass name in `signInWithIdToken` options
- **Result:** ❌ Still shows "User"
- **Impact:** BLOCKING App Store submission

### Build 13 (Feb 7, 2026)
- **Status:** **FAILED**
- **Attempted:** Direct database upsert with name
- **Result:** ❌ Race condition, database record created before upsert

### Build 12 (Feb 7, 2026)
- **Status:** **FAILED**
- **Added:** Debug view in Settings to show user metadata
- **Result:** ❌ Confirmed metadata is empty

### Build 11 (Feb 6, 2026)
- **Status:** ✅ Diagnostic success
- **Added:** Extensive logging for Apple credential
- **Result:** ✅ Confirmed Apple sends name, extraction works

### Build 10 (Feb 6, 2026)
- **Status:** **FAILED**
- **Attempted:** Basic `updateUser()` metadata call
- **Result:** ❌ Name not appearing

### Build 9 (Feb 6, 2026)
- **Status:** ✅ SUCCESS
- **Build ID:** `2298b52f-4cb2-49ba-b9df-0239b6ec6060`
- **Fixed:** Apple Sign In nonce bug

### Build 8 (Feb 5, 2026)
- **Status:** ✅ SUCCESS
- **Fixed:** Native Apple Sign In, iPad support, auto price refresh

### Build 7 (Feb 4, 2026)
- **Status:** ❌ REJECTED by App Store
- **Issue:** Apple Sign In not working (web OAuth unreliable)

---

## 🔴 CRITICAL: Next Steps

### 1. Fix Apple Sign In Name (30 min) - HIGHEST PRIORITY
**Recommended Approach:** Manual name input screen
```typescript
// Add to app/welcome-name.tsx
if (getUserFullName() === 'User') {
  // Show "What's your name?" input
  // Save to Supabase users.name
}
```
**Why:** Guaranteed to work, industry standard, no Apple limitations  
**Details:** See `APPLE_SIGNIN_NAME_ISSUE.md`

### 2. Fix Chart Date Bug (15 min)
**Approach:** Store dates as YYYY-MM-DD strings
```typescript
// Change from:
timestamp: now.toISOString()
// To:
timestamp: now.toISOString().split('T')[0]
```
**Details:** See `CHART_DATE_BUG.md`

### 3. Configure In-App Purchase (45 min)
**App Store Connect:**
- Product ID: `worthview_annual`
- Price: £49.99/year, 7-day trial
- Submit for review

**RevenueCat:**
- Add product `worthview_annual`
- Create "premium" entitlement
- Create "Current" offering

### 4. Build 15 & Resubmit to App Store
- Test all fixes on TestFlight
- Reply to App Store rejection with detailed fix list
- Submit for App Review

---

## Overview

WorthView is a net worth tracking app for iOS. Track stocks, crypto, property, bank accounts, loans, and all your assets in one simple app. Clean design, local-first storage, and strong privacy.

**Key Features:**
- Track all asset types (stocks, crypto, ETFs, property, bank accounts, commodities)
- Live investment prices via Twelve Data API
- Interactive performance charts with time ranges (1M, 3M, 6M, 1Y, All)
- Face ID / PIN authentication
- Encrypted cloud backups (Supabase)
- Multi-currency support (GBP, USD, EUR - symbol-only, no conversion)
- £49/year subscription with 7-day free trial (RevenueCat + Apple IAP)

---

## Tech Stack

**Core:**
- React Native (Expo SDK 54)
- React 19.1.0
- TypeScript 5.9
- Expo Router (file-based navigation)

**Backend:**
- Supabase (authentication, cloud backups)
- RevenueCat (subscription management)
- Twelve Data API (live prices, 800 calls/day free tier)

**Storage:**
- AsyncStorage (local data)
- SecureStore (PIN, sensitive data)
- Supabase (encrypted cloud backups)

**State Management:**
- React Context API (DataContext, ModalContext)

---

## Project Structure

```
app/                  # Screens
├── _layout.tsx       # Root + AuthGuard
├── index.tsx         # Sign up/in
├── auth.tsx          # PIN/Face ID
├── paywall.tsx       # Subscription
├── home.tsx          # Dashboard
├── assets-detail.tsx
├── liabilities-detail.tsx
└── settings.tsx

components/           # UI components
├── PaywallScreen.tsx
├── NetWorthCard.tsx  # Hero card with chart
├── AssetsCard.tsx
├── LiabilitiesCard.tsx
├── Add*Modal.tsx     # Asset entry modals
└── Edit*Modal.tsx    # Edit modals

contexts/
├── DataContext.tsx   # Global state
└── ModalContext.tsx  # Modal management

utils/
├── storage.ts        # AsyncStorage helpers
├── encryption.ts     # PIN hashing
├── supabase.ts       # Supabase client
└── useRevenueCat.ts  # Subscription
```

---

## Data Models

### Asset
```typescript
{
  id: string
  name: string
  value: number
  type: 'bank' | 'stocks' | 'crypto' | 'etf' | 'commodities' | 'property' | 'other'
  currency: 'GBP' | 'USD' | 'EUR'
  createdAt: string
  updatedAt: string
  metadata?: { holdings, prices, etc. }
}
```

### Liability
```typescript
{
  id: string
  name: string
  value: number
  type: 'mortgage' | 'loan' | 'creditcard' | 'other'
  currency: 'GBP' | 'USD' | 'EUR'
  createdAt: string
  updatedAt: string
}
```

### User
```typescript
{
  id: string
  name: string
  email: string
  primaryCurrency: 'GBP' | 'USD' | 'EUR'
  createdAt: string
  hasFaceIDEnabled: boolean
}
```

---

## Key Features

### 1. Authentication
- **Apple Sign In** - Native iOS authentication (expo-apple-authentication)
- **Google OAuth** - Web-based OAuth flow
- **Email/Password** - Supabase auth
- **Face ID / PIN** - Local biometric + encrypted PIN (SecureStore)

### 2. Subscription (RevenueCat)
- £49/year with 7-day free trial
- Apple In-App Purchase
- Paywall appears 7 seconds after adding first asset (aha moment)
- Restore purchases for reinstalls

### 3. Investment Tracking
- **Stocks:** AAPL, MSFT, TSLA, etc. (Twelve Data API)
- **Crypto:** BTC/USD, ETH/USD (auto-formats from BTC)
- **ETFs:** SPY, QQQ, VOO
- **Commodities:** XAU/USD (gold), XAG/USD (silver)
- Smart caching: 1hr for stocks/ETFs, 30min for crypto
- Pull-to-refresh for manual updates

### 4. Performance Chart
- Custom SVG with gradient fill
- Interactive scrubbing (tap + drag)
- Time ranges: 1M, 3M, 6M, 1Y, All
- Haptic feedback on iOS
- Day 1 empty state

### 5. Privacy & Security
- Local-first storage (AsyncStorage)
- PIN hashing (SHA-256, 1000 iterations)
- Encrypted cloud backups (PIN-derived key)
- No bank connections (manual entry only)
- GDPR-compliant account deletion

---

## User Flow

```
Sign Up (Apple/Google/Email)
    ↓
Set PIN + Face ID
    ↓
Home Screen (Empty State)
    ↓
Add First Asset
    ↓
See Net Worth (7 seconds)
    ↓
Paywall Appears
    ↓
Start Trial / Subscribe
    ↓
Full Access
```

---

## Design System

**Colors:**
- Background: `#FAFAFA`
- Card: `#FFFFFF`
- Text: `#2B3035` (primary), `#8C9196` (muted)
- Accent: `#4A90E2` (blue)

**Typography:**
- SF Pro (iOS native)
- Display: 44-56px
- Headings: 28-32px
- Body: 14-16px

**Spacing:** 4pt base (8, 12, 16, 24, 32, 48)

**Border Radius:** 8, 12, 16px

---

## Critical Constraints

### iOS Only
- SF Pro font (native)
- Face ID / Touch ID (physical device required for testing)
- Haptic feedback (expo-haptics)

### React 19 + Expo Router
- Always use `<Slot />` in `_layout.tsx` (never `<Stack>`)
- No complex props to native components (causes JSI errors)
- Wrap app in `<GestureHandlerRootView>` for swipe gestures

### Storage Keys
All prefixed with `worthview_`:
- `worthview_assets`
- `worthview_liabilities`
- `worthview_user`
- `worthview_preferences`
- `worthview_subscription`
- `worthview_net_worth_snapshots`
- `worthview_pin_hash` (SecureStore)

### Currency Handling
- Symbol-only change (£ → $ → €)
- NO value conversion
- Investments always stored in USD

---

## Development Patterns

### Adding a Screen
1. Create `app/screen-name.tsx`
2. Use `useSafeAreaInsets()` for safe area
3. Import design constants from `/constants`
4. Use `StyleSheet.create()`

### Adding a Modal
1. Create `components/ModalName.tsx`
2. Register in `ModalContext.tsx`
3. Use `openModalName()` from `useModals()` hook

### Data Operations
1. Use `DataContext` methods
2. AsyncStorage auto-saves on every change
3. UI re-renders automatically

---

## Known Issues

### ⚠️ ACTIVE ISSUES (Feb 9, 2026)

**Issue 1: Apple Sign In Name Shows "User"**
- **Status:** ❌ CRITICAL - BLOCKING App Store submission
- **Builds Affected:** 10, 11, 12, 13, 14 (5 failed attempts)
- **Cause:** Race condition - syncUserProfile() runs before name is set
- **Impact:** Poor UX, unprofessional, likely rejection
- **Fix:** Manual name input screen (30 min)
- **Documentation:** `APPLE_SIGNIN_NAME_ISSUE.md`
- **ETA:** 30 minutes to implement + 1 build cycle

**Issue 2: Performance Chart Shows Wrong Dates**
- **Status:** ❌ MEDIUM - Confusing but not blocking
- **Symptom:** Shows "Feb 26" when today is Feb 9
- **Cause:** Timezone parsing or date calculation bug
- **Impact:** Confusing date labels on chart
- **Fix:** Store dates as YYYY-MM-DD strings (15 min)
- **Documentation:** `CHART_DATE_BUG.md`
- **ETA:** 15 minutes to implement + 1 build cycle

**Issue 3: Subscription "Not Available" Error**
- **Status:** ⚠️ LOW - Blocks monetization but not testing
- **Cause:** In-app purchase not created in App Store Connect
- **Impact:** Users cannot subscribe, paywall doesn't work
- **Fix:** Configure IAP in App Store Connect + RevenueCat
- **ETA:** 45 minutes to configure + Apple review time (1-2 days)

### ✅ RESOLVED ISSUES

**Issue: Apple Sign In Authentication**
- **Fixed:** Build 9 (Feb 6, 2026)
- **Cause:** Build 7 used web OAuth (unreliable), Build 8 had nonce bug
- **Solution:** Native Apple authentication + removed incorrect nonce
- **Note:** Sign-in WORKS, only the name display is broken

**Issue: Flat Performance Chart**
- **Fixed:** Build 8 (Feb 5, 2026)
- **Cause:** No automatic price refresh mechanism
- **Solution:** AppState listener for daily auto-refresh

**Issue: Net Worth Not Updating**
- **Fixed:** Build 8 (Feb 5, 2026)
- **Cause:** Using cached prices (forceRefresh: false)
- **Solution:** Changed to forceRefresh: true, added comprehensive logging

---

## Deployment

### TestFlight Build
```bash
eas build --platform ios
eas submit --platform ios
```

### Build Configuration
- Bundle ID: `com.dmy.networth`
- Version: 1.0.0
- Build Number: 9 (reads from app.json)
- Slug: `regent` (EAS project name, internal only)
- iPad Support: Enabled
- Apple Sign In: Native authentication enabled

### Required Configuration
- Supabase redirect URLs: `worthview://auth/callback`
- RevenueCat production iOS key: `appl_YsKPtpcVpohFQoThbTiytPNKxPB`
- Apple OAuth configured in Supabase
- Auto-submit configured in eas.json
- Apple Sign In entitlement enabled

### Demo Account (Apple Review)
- **Email:** dmy@gmail.com
- **Password:** 5Q69q25q
- **Status:** Active in Supabase
- **Created:** Jan 31, 2026

---

## For AI Assistants

**Project Goals:**
- Simple, clear net worth tracking
- No elitism, universal appeal
- Local-first, privacy-focused
- Clean design, no clutter

**When Making Changes:**
- Read this file first for context
- Check design constants (`/constants`)
- Test on physical iPhone (Face ID, gestures)
- Never add features not in spec
- Always use TypeScript strictly

**Common Tasks:**
- Add new asset type → Create modal in `/components`
- Add new screen → Create in `/app`
- Update copy → Check tagline: "Everything you own and owe, in one place"

---

## Links

- **Website:** https://worthview.app (Netlify)
- **Website Repo:** https://github.com/lozynskyidv/worthview-website
- **App Repo:** https://github.com/lozynskyidv/regent
- **TestFlight:** https://appstoreconnect.apple.com/apps/6758517452/testflight/ios
- **Supabase:** https://supabase.com/dashboard/project/jkseowelliyafkoizjzx
- **RevenueCat:** https://app.revenuecat.com

---

## Marketing & Assets

### Website (worthview.app)
**Location:** `/Users/dmytrolozynskyi/Documents/Regent App/worthview-website/`  
**Deployment:** Netlify (auto-deploy from GitHub)  
**Tech:** React + Vite + Tailwind CSS

The website features:
- Hero section with WorthView logo (WV monogram)
- App screenshot with transparent background
- Feature showcase (local storage, privacy, etc.)
- Pricing section (£49/year, 7-day trial)
- Trust bar (encrypted, FCA-compliant, no data sharing)
- Download button (ready for App Store link)

**How it works:**
1. Push code to `github.com/lozynskyidv/worthview-website` (main branch)
2. Netlify automatically builds and deploys
3. Live at `worthview.app` (DNS configured via Namecheap)
4. Build command: `npm run build` → `dist/` folder

### App Store Icons
**Location:** `/Users/dmytrolozynskyi/Documents/Regent App/WorthView/app-store-icons/`

Contains:
- `WorthViewIcon.tsx` - SVG logo component (WV monogram on black)
- `IconShowcase.tsx` - Interactive page to generate/download icons at all required sizes
- `README.md` - Complete export instructions

**Logo Specs:**
- Background: #1A1A1A (black)
- Text: #FAFAFA (white)
- Monogram: WV
- Font Weight: 300 (light)
- Corner Radius: 26px (scales proportionally)

**Required Sizes:** 1024×1024, 512×512, 180×180, 120×120, 87×87, 80×80, 60×60

### Domain & DNS
- **Domain:** `worthview.app` (purchased on Namecheap)
- **Hosting:** Netlify
- **DNS:** Netlify nameservers configured in Namecheap
- **SSL:** Automatic via Netlify (Let's Encrypt)

---

**Everything you own and owe, in one place.** 🎯
