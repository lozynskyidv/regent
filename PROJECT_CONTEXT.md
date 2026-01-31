# WorthView - Project Context

**Version:** 1.0.0  
**Platform:** iOS (React Native + Expo)  
**Status:** Production Ready - Live on TestFlight  
**Tagline:** Everything you own and owe, in one place

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

**None!** All critical issues resolved. App is production-ready.

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
- Build Number: 2 (increment for each submission)
- Slug: `regent` (EAS project name, internal only)

### Required Configuration
- Supabase redirect URLs: `worthview://auth/callback`
- RevenueCat production iOS key: `appl_YsKPtpcVpohFQoThbTiytPNKxPB`
- Apple OAuth configured in Supabase

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

- **TestFlight:** https://appstoreconnect.apple.com/apps/6758517452/testflight/ios
- **Supabase:** https://supabase.com/dashboard/project/jkseowelliyafkoizjzx
- **RevenueCat:** https://app.revenuecat.com
- **App Store Checklist:** `APP_STORE_SUBMISSION_CHECKLIST.md`
- **Build Guide:** `BUILD_AND_SHIP.md`

---

**Everything you own and owe, in one place.** 🎯
