# WorthView - Project Context

**Version:** 1.0.0 (Build 10)  
**Platform:** iOS (React Native + Expo)  
**Status:** Build 10 ready for TestFlight - Ready for App Store Resubmission  
**Tagline:** Everything you own and owe, in one place

---

## 🚨 CRITICAL STATUS UPDATE (Feb 6, 2026)

### Build 10 - Latest Status

**✅ Apple Sign In - FULLY FIXED:**
- Build 8: Implemented native Apple authentication
- Build 9: Fixed nonce bug (was causing "could not be completed" error)
- Build 10: Fixed user name not appearing (now saves Apple user's full name)
- Status: Ready for testing on TestFlight

**✅ Automatic Price Refresh - WORKING:**
- Prices refresh automatically on app launch if >24 hours old
- Force fresh prices enabled (no cached data)
- Performance chart shows daily trends

**✅ iPad Support - ENABLED:**
- App works on both iPhone and iPad
- Reviewer tested on iPad Air (reason for rejection)

**⚠️ Subscription Not Available:**
- In-app purchase not configured
- Requires App Store Connect + RevenueCat setup
- Blocking production release

---

## 📋 Build History

### Build 10 (Current - Feb 6, 2026)
- **Status:** Ready for build
- **Fixed:** User name not appearing after Apple Sign In
- **Changes:** 
  - Extract full name from Apple credential (`givenName` + `familyName`)
  - Save to Supabase user metadata as `full_name`
  - Display real name in app (e.g., "J. Rothschild")
  - Added logging for name extraction

### Build 9 (Feb 6, 2026)
- **Status:** Submitted to TestFlight, processing by Apple
- **Build ID:** `2298b52f-4cb2-49ba-b9df-0239b6ec6060`
- **Fixed:** Apple Sign In nonce bug
- **Changes:** Removed incorrect nonce parameter, enhanced error logging

### Build 8 (Feb 6, 2026)
- **Status:** Live on TestFlight
- **Fixed:** Native Apple Sign In, iPad support, auto price refresh
- **Issue:** Nonce bug prevented sign in completion

### Build 7 (Feb 4, 2026)
- **Status:** Rejected by App Store
- **Issue:** Apple Sign In not working (web OAuth unreliable on iPad)

---

## 🔴 CRITICAL: Next Steps

### 1. Build & Test Build 10 on TestFlight (~15 min)
- Run: `eas build --platform ios --profile production`
- Wait for Apple processing (~5-10 minutes)
- **IMPORTANT:** Delete app and reinstall (Apple only sends name on FIRST sign in)
- Test Apple Sign In: Tap → Face ID → Should show real name ✅
- Verify session persists on restart

### 2. Resubmit to App Store (~5 min)
If Build 10 Apple Sign In works:
- Reply to App Store rejection
- Message: "Build 10 fixes Apple Sign In with native authentication and user profile"
- Submit for App Review

### 3. Configure In-App Purchase (~45 min)
**App Store Connect:**
- Product ID: `worthview_annual`
- Price: £49.99/year, 7-day trial
- Submit for review

**RevenueCat:**
- Add product `worthview_annual`
- Create "premium" entitlement
- Create "Current" offering

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

### ⚠️ ACTIVE ISSUES (Feb 6, 2026)

**Issue: Subscription "Not Available" Error**
- **Status:** BLOCKING production release
- **Cause:** In-app purchase not created in App Store Connect
- **Impact:** Users cannot subscribe, paywall doesn't work
- **Fix:** Configure IAP in App Store Connect + RevenueCat
- **ETA:** ~1 hour to configure + Apple review time (1-2 days)

### ✅ RESOLVED ISSUES

**Issue: Apple Sign In Not Working**
- **Fixed:** Build 9 (Feb 6, 2026)
- **Cause:** Build 7 used web OAuth (unreliable), Build 8 had nonce bug
- **Solution:** Native Apple authentication + removed incorrect nonce

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
