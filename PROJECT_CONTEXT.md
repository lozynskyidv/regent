# PROJECT CONTEXT - Regent iOS App

**Last Updated:** January 6, 2026  
**Version:** 0.3.0 (P0 MVP Complete ✅)  
**Platform:** iOS only (React Native Expo)

---

## 🚀 QUICK START (5-Min Orientation)

**What is Regent?**  
Premium net worth tracking for mass affluent professionals (£100k-£1m). "Uber modernism + JPM restraint." Local storage, no backend.

**Current State:**  
✅ P0 MVP COMPLETE - Sign Up, Auth (Face ID/PIN), Home Screen, Settings, Edit/Delete, Detail Screens, Modals, Charts, CRUD, Currency Switcher  
❌ NOT BUILT - Stock tracking (Twelve Data), Bank connections (TrueLayer), Subscriptions (RevenueCat)

**Tech Stack:**  
- React Native (Expo SDK 54), React 19.1.0, TypeScript 5.9  
- Local storage: AsyncStorage (data) + SecureStore (PIN/tokens)  
- Icons: Lucide React Native  
- State: React Context API  
- Navigation: Expo Router (file-based, uses `<Slot />` not `<Stack>`)

---

## 📂 PROJECT STRUCTURE

```
app/                  # Expo Router screens
├── _layout.tsx       # Root (Slot routing, GestureHandlerRootView)
├── index.tsx         # Sign Up (Google OAuth UI)
├── auth.tsx          # Face ID/PIN auth
├── home.tsx          # Dashboard (Net Worth + Assets + Liabilities)
├── assets-detail.tsx # Full asset list (swipe gestures)
├── liabilities-detail.tsx
└── settings.tsx      # Currency, Sign Out, Delete Account

components/           # Modals & Cards
├── NetWorthCard, AssetsCard, LiabilitiesCard
├── AssetTypePickerModal, LiabilityTypePickerModal (2-step flow)
├── Add[Bank|Property|OtherAsset]Modal.tsx
├── Add[Mortgage|Loan|OtherLiability]Modal.tsx
├── EditAssetModal, EditLiabilityModal
└── SwipeableAssetItem, SwipeableLiabilityItem

contexts/
├── DataContext.tsx   # Global state (assets, liabilities, user)
└── ModalContext.tsx  # Centralized modal management

utils/
├── storage.ts        # AsyncStorage helpers
└── generateId.ts     # UUID for entities

constants/            # Design system
├── Colors.ts, Typography.ts, Spacing.ts, Layout.ts
└── index.ts

types/
└── index.ts          # Asset, Liability, User interfaces
```

---

## 🧩 DATA MODELS

**Asset**
```typescript
{
  id: string (UUID)
  name: string
  value: number (in primaryCurrency)
  type: 'bank' | 'portfolio' | 'property' | 'other'
  currency: 'GBP' | 'USD' | 'EUR'
  createdAt: string (ISO)
  updatedAt: string (ISO)
  metadata?: { ticker, quantity, lastPrice, accountId, etc. }
}
```

**Liability** (same structure, type: 'mortgage' | 'loan' | 'creditcard' | 'other')

**User** (AsyncStorage `@regent_user`)
```typescript
{
  id: string
  name: string
  email: string
  primaryCurrency: 'GBP' | 'USD' | 'EUR'
  profilePhotoUrl?: string
}
```

**Net Worth:** `totalAssets - totalLiabilities` (calculated, not stored)

---

## 🎨 DESIGN SYSTEM (Quick Ref)

**Colors:**
- Background: `#FAFAFA`, Card: `#FFFFFF`
- Text: `#2B3035` (primary), `#8C9196` (muted)
- Accent: `#4A90E2` (blue), `#D0021B` (red/delete)
- Categories (Assets): Blue (cash), Green (property), Purple (investments), Gray (other)
- Categories (Liabilities): Dark blue (mortgage), Orange (loan), Red (credit card), Gray (other)

**Typography:**
- Display large: 56pt (net worth)
- Headings: 32pt, 24pt, 20pt
- Body: 16pt (default), 14pt (labels), 12pt (captions)
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Spacing:** 4pt base (xs: 4, sm: 8, md: 12, lg: 16, xl: 24, 2xl: 32, 3xl: 48)

**Border Radius:** sm: 8pt, md: 12pt, lg: 16pt, full: 9999pt

---

## ⚠️ CRITICAL CONSTRAINTS

**iOS Only:**
- Use SF Pro font (iOS native)
- Use SF Symbols for system icons (Lucide for custom)
- Test on physical device (Face ID, gestures)

**Local Storage Only:**
- All data in AsyncStorage (unencrypted)
- Sensitive data (PIN, tokens) in SecureStore (iOS Keychain)
- No backend, no cloud sync (MVP)

**React 19 + Expo Router Issues:**
- ❌ DO NOT use `<Stack>` with `screenOptions` (JSI serialization errors)
- ✅ ALWAYS use `<Slot />` in `_layout.tsx`
- ❌ DO NOT pass complex props to native components (arrays, objects cause crashes)
- ✅ ALWAYS wrap app in `<GestureHandlerRootView>` (for swipe gestures)

**Navigation:**
- File-based routing (`app/` folder = routes)
- Use `router.push('/path')` or `router.replace('/path')`
- Smooth transitions with LayoutAnimation (not Stack animations)

**State Management:**
- React Context API (DataContext, ModalContext)
- No Redux, no MobX (keep it simple)
- AsyncStorage auto-saves on every data change

---

## 🔥 KNOWN ISSUES & WORKAROUNDS

**Face ID in Expo Go:**
- Shows device passcode instead of Face ID UI (Expo Go limitation)
- Auth still works, just uses passcode fallback
- Will work properly in standalone build

**Layout Shift on Settings Screen:**
- Fixed via `useSafeAreaInsets()` + LayoutAnimation (300ms fade)
- Never use `SafeAreaView` with `edges` prop (React 19 serialization issue)

**Currency Handling:**
- Symbol-only change (no conversion) - matches web prototype
- Future: Live conversion with exchange rate API

---

## 📋 NEXT PRIORITIES (P1 Features)

**Week 4-5: P1 MVP (Launch-Ready)**

1. **Stock Tracking** (Twelve Data API)
   - Ticker input + validation
   - Live price fetching (15-min refresh)
   - Quantity × Price calculation
   - Currency conversion

2. **Bank Connections** (TrueLayer OAuth)
   - UK banks (Barclays, HSBC, Lloyds, etc.)
   - Read-only balance access
   - Auto-refresh (24-hour cycle)
   - Refresh token storage (SecureStore)

3. **Subscriptions** (RevenueCat)
   - Free tier: 3 assets, 2 liabilities (manual only)
   - Premium tier: Unlimited + bank connections + live stocks
   - Paywall modal (£49.99/year, 7-day trial)
   - Restore purchases

4. **Performance Chart**
   - Net worth over time (line chart)
   - Historical snapshots (monthly)

5. **TestFlight Beta**
   - Build with EAS
   - Beta testing
   - Feedback implementation

---

## 🛠️ DEVELOPMENT PATTERNS

**Adding New Screen:**
1. Create `app/screen-name.tsx`
2. Use `useSafeAreaInsets()` for safe area (not SafeAreaView)
3. Import design constants from `/constants`
4. Use `StyleSheet.create()` for styles (not inline)
5. Add LayoutAnimation for smooth transitions

**Adding New Modal:**
1. Create `components/ModalName.tsx`
2. Register in `ModalContext.tsx`
3. Use `openModalName()` from `useModals()` hook
4. Style: `presentationStyle="pageSheet"`, `animationType="slide"`

**Data Operations:**
1. Use `DataContext` for global state
2. Update AsyncStorage after every change
3. Re-render UI automatically (React Context handles)

**Swipe Gestures:**
1. Use `react-native-gesture-handler` (`PanGestureHandler`)
2. Wrap items in `SwipeableAssetItem` or `SwipeableLiabilityItem`
3. Requires `GestureHandlerRootView` at app root

---

## 📚 REFERENCE DOCS

**Full Specs (Only When Needed):**
- `REGENT_CURSOR_SPEC.md` - Complete product vision, user flows, design system (3000+ lines)
- `README.md` - Technical implementation details, setup, testing
- `CHANGELOG.md` - Full build history
- `web-prototype/` - Design reference only (NOT for production)

**Quick Lookups:**
- Design system: `/constants/` folder
- Data models: `/types/index.ts`
- API patterns: `contexts/DataContext.tsx`, `utils/storage.ts`

---

## 🚨 CRITICAL REMINDERS

**DO:**
- ✅ Use design system constants (never hardcode)
- ✅ Test on physical iPhone (Face ID, gestures, transitions)
- ✅ Handle empty states, loading states, error states
- ✅ Auto-save to AsyncStorage after every action
- ✅ Use TypeScript strictly (no `any`)

**DON'T:**
- ❌ Modify `_layout.tsx` without checking React 19 constraints
- ❌ Use `<Stack>` with `screenOptions` (causes crashes)
- ❌ Build features not in spec (stay focused)
- ❌ Skip error handling (APIs fail, networks drop)
- ❌ Add gamification (against brand positioning)

---

## 💡 TARGET MARKET

**User:** "The Grounded Achiever"  
- Age: 28-45, Income: £100k-£250k, Net worth: £100k-£1m  
- Location: London, NYC, financial hubs  
- Mindset: Values clarity, discretion, restraint (NOT gamification)

**Brand:** "Uber modernism + JPM restraint + NYC/London warmth"  
- Muted colors, elegant typography, minimal decoration  
- No bright colors, no playful elements, no streaks/badges  
- Professional, discreet, premium

---

**For detailed specs, see `REGENT_CURSOR_SPEC.md`. This doc is your 80/20 reference - everything you need 95% of the time.** 🎯
