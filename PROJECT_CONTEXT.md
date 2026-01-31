# WorthView - Project Context

**Version:** 1.0.0 (Build 6 pending)  
**Platform:** iOS (React Native + Expo)  
**Status:** In TestFlight Review - Resubmitting with Fixes  
**Tagline:** Everything you own and owe, in one place

---

## 🚨 CRITICAL STATUS UPDATE (Jan 31, 2026)

### What We Just Fixed

**Problem 1: Missing App Icons in TestFlight**
- ✅ **FIXED:** Regenerated WV monogram icons (black background, white "WV")
- ✅ Icons copied to `/assets/` folder
- ✅ Build number incremented to 6
- ⏳ **Next:** Build 6 will have proper icons

**Problem 2: App Store Rejection**
- ✅ **FIXED:** Created demo account (dmy@gmail.com / 5Q69q25q)
- ✅ Account exists and works in Supabase
- ⏳ **Next:** Submit Build 6 with demo credentials

**Problem 3: Only 1 Build in TestFlight Despite Multiple Builds**
- ✅ **ROOT CAUSE IDENTIFIED:** Builds weren't being submitted to TestFlight
- ✅ **FIXED:** Updated `eas.json` with auto-submit configuration
- ✅ Set `appVersionSource: "local"` to read build number from app.json
- ⏳ **Next:** Future builds will auto-submit

**Problem 4: "Subscription Not Available" Error**
- ⚠️ **BLOCKING ISSUE:** In-app purchase not configured
- ⚠️ **REQUIRED:** Configure IAP in App Store Connect + RevenueCat
- 📋 **SEE:** `SUBSCRIPTION_SETUP.md` for complete fix guide

---

## 🔴 CRITICAL: What You MUST Do Before Next Build

### 1. Configure In-App Purchase (App Store Connect)

**Why:** Subscription won't work until IAP is created and submitted for review

**Steps:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com/apps/6758517452)
2. **Features** → **In-App Purchases** → **"+"**
3. Create Auto-Renewable Subscription:
   - **Product ID:** `worthview_annual`
   - **Price:** £49.99/year
   - **Trial:** 7 days
   - **Group:** "WorthView Subscriptions" (create new)
4. **CRITICAL:** Click **"Submit for Review"**

### 2. Configure RevenueCat

**Why:** App fetches subscription products from RevenueCat

**Steps:**
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. **Products** → Add `worthview_annual`
3. **Entitlements** → Create "premium" → Link to `worthview_annual`
4. **Offerings** → "Current" → Add Annual package → Select `worthview_annual`

**Complete Guide:** See `SUBSCRIPTION_SETUP.md`

---

## 📋 Build & Submit Workflow (Updated Jan 31)

### Build 6 (Ready to Build)

```bash
# Build with auto-submit to TestFlight
cd "/Users/dmytrolozynskyi/Documents/Regent App/WorthView"
eas build --platform ios --profile production --auto-submit
```

**What's Included:**
- ✅ WV monogram icon (proper, not placeholder)
- ✅ Build number 6 (tracked correctly)
- ✅ Auto-submits to TestFlight
- ✅ Demo account configured

**Timeline:**
- Build: ~10-15 min
- Auto-submit: ~5 min
- TestFlight processing: ~15-30 min
- **Total: ~30-45 min until testable**

### After Build 6 is in TestFlight

1. **Test on Device:**
   - Install from TestFlight
   - Verify WV icon shows
   - Test login with dmy@gmail.com / 5Q69q25q
   - (Subscription won't work until IAP configured)

2. **Submit for App Store Review:**
   - Go to [Distribution Tab](https://appstoreconnect.apple.com/apps/6758517452/distribution/ios/version/inflight)
   - Select **Build 6** (not Build 5)
   - Add demo credentials to review notes
   - Submit for review

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
- Apple Sign In (production)
- Google OAuth
- Email/Password
- Face ID / PIN (SecureStore)

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

### ⚠️ ACTIVE ISSUES (Jan 31, 2026)

**Issue: Subscription "Not Available" Error**
- **Status:** BLOCKING - needs configuration
- **Cause:** In-app purchase not created in App Store Connect
- **Impact:** Users cannot subscribe, paywall doesn't work
- **Fix:** See `SUBSCRIPTION_SETUP.md` for step-by-step guide
- **ETA:** ~1-2 hours to configure + Apple review time

**Issue: Build 5 Has Placeholder Icon**
- **Status:** FIXED in Build 6
- **Cause:** Icons weren't the proper WV monogram
- **Fix:** Regenerated icons, ready for Build 6
- **ETA:** Will be fixed when Build 6 is built and submitted

### ✅ RESOLVED ISSUES

**Issue: Only 1 Build in TestFlight**
- **Fixed:** Jan 31, 2026
- **Cause:** Builds weren't being submitted to TestFlight
- **Solution:** Updated eas.json with auto-submit configuration

**Issue: App Store Rejection (Guideline 2.1)**
- **Fixed:** Jan 31, 2026
- **Cause:** Invalid demo account credentials
- **Solution:** Created working demo account (dmy@gmail.com / 5Q69q25q)

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
- Build Number: 6 (auto-increments from app.json)
- Slug: `regent` (EAS project name, internal only)

### Required Configuration
- Supabase redirect URLs: `worthview://auth/callback`
- RevenueCat production iOS key: `appl_YsKPtpcVpohFQoThbTiytPNKxPB`
- Apple OAuth configured in Supabase
- **NEW:** Auto-submit configured in eas.json
- **NEW:** Local app version source (reads from app.json)

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
- **App Store Checklist:** `APP_STORE_SUBMISSION_CHECKLIST.md`
- **Build Guide:** `BUILD_AND_SHIP.md`

### 🆘 Troubleshooting Guides (NEW - Jan 31, 2026)

- **SUBSCRIPTION_SETUP.md** - Complete guide to fix subscription error
- **TESTFLIGHT_FIX.md** - Why builds weren't appearing in TestFlight
- **TESTFLIGHT_RESUBMISSION.md** - Build 4 submission details (archived)
- **create-demo-account.sh** - Script to create demo account in Supabase

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
