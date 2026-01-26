# PROJECT CONTEXT - Regent iOS App

**Last Updated:** January 26, 2026  
**Version:** 0.8.2 (Performance Chart - In Progress)  
**Platform:** iOS only (React Native Expo)  
**Access Model:** Exclusive invite-only (replaced paid subscription)

---

## 🚀 QUICK START (5-Min Orientation)

**What is Regent?**  
Premium net worth tracking for mass affluent professionals (£100k-£1m). "Uber modernism + JPM restraint." Local storage + Supabase backend. **Exclusive invite-only access.**

**Current State (What's ACTUALLY Built):**  
✅ **P0 MVP COMPLETE:**
- **Invite System** (RGNT-XXXXXX codes, viral growth mechanic - 5 codes per user)
- **Authentication** (Google OAuth + Email/Password - fully functional with Supabase)
- **Auth screen** (Face ID/PIN onboarding, fully functional)
- **Empty State Onboarding** (Beautiful hero card with NYC skyline for new users)
- **Home Screen** (Net Worth with count-up animation + Assets + Liabilities + ShareInviteCard + Pull-to-Refresh)
- **Portfolio Tracking** (Live prices for stocks, ETFs, crypto, commodities via Twelve Data API)
- **Smart Caching** (1 hour for stocks/ETFs, 30 min for crypto - optimized for 800 API calls/day free tier)
- **Persistent Timestamps** (Accurate "Updated X ago" with hybrid relative/absolute time display)
- **Smooth Animations** (Net worth count-up from 0 → value on every load/refresh)
- **Dynamic User Display** (Formatted names: "J. Rockefeller", "Welcome, John")
- **Edit Modals** (EditAssetModal, EditLiabilityModal - pre-populated forms, delete buttons)
- **Detail Screens** (Assets/Liabilities full lists with swipe-to-edit/delete gestures)
- **Global Modal Context** (centralized modal state, eliminated 66% code duplication)
- **Charts** (horizontal bar charts, category breakdown with colors)
- **CRUD** (Create, Read, Update, Delete all working)
- **Currency Switcher** (GBP/USD/EUR - **symbol-only, NO value conversion**)
- **Settings Screen** (currency selection, sign out, GDPR-compliant delete account)
- **Cloud Backups** (encrypted with PIN, stored in Supabase)

❌ **P1 PRIORITIES:** Performance chart polish (HIGH), Apple OAuth (App Store requirement), Bank connections, TestFlight

**Tech Stack:**  
- React Native (Expo SDK 54), React 19.1.0, TypeScript 5.9  
- **Backend:** Supabase (auth, database, Edge Functions)  
- **Access Control:** Custom invite-only system (Supabase Edge Functions + PostgreSQL)  
- **Storage:** AsyncStorage (data) + SecureStore (PIN/tokens)  
- **Auth:** Supabase Auth (Google OAuth, session management)  
- **Cloud:** Supabase Edge Functions (validate-invite, generate-invite-codes, mark-invite-used, delete-account, fetch-asset-prices)  
- **External APIs:** Twelve Data API (live stock/crypto/commodity prices, 800 calls/day free tier)  
- Icons: Lucide React Native 0.562.0  
- Gestures: react-native-gesture-handler 2.30.0 (swipe-to-edit/delete)  
- State: React Context API (DataContext, ModalContext)  
- Navigation: Expo Router (file-based, **ALWAYS use `<Slot />` not `<Stack>`**)

---

## 📂 PROJECT STRUCTURE

```
app/                  # Expo Router screens
├── _layout.tsx       # Root (Slot routing, GestureHandlerRootView, AuthGuard)
├── invite-code.tsx   # Invite code entry (first screen for new users)
├── index.tsx         # Sign Up (Google OAuth UI)
├── auth.tsx          # Face ID/PIN auth (fully functional)
├── home.tsx          # Dashboard (Net Worth + Assets + Liabilities + ShareInviteCard)
├── assets-detail.tsx # Full asset list (swipe gestures)
├── liabilities-detail.tsx
└── settings.tsx      # Currency, Sign Out, Delete Account

components/           # Modals & Cards
├── NetWorthCard, AssetsCard, LiabilitiesCard
├── ShareInviteCard   # NEW: Display & share invite codes
├── AssetTypePickerModal, LiabilityTypePickerModal
│   └── (2-step flow: Step 1 = type picker, Step 2 = specific form)
├── Add[Bank|Property|OtherAsset|Portfolio]Modal.tsx
│   └── AddPortfolioModal: Multi-holding, auto-fetch prices, live calculations
├── Add[Mortgage|Loan|OtherLiability]Modal.tsx
├── EditAssetModal, EditLiabilityModal (pre-populated, delete button)
└── SwipeableAssetItem, SwipeableLiabilityItem (gesture handlers)

contexts/
├── DataContext.tsx        # Global state (assets, liabilities, user, invites)
└── ModalContext.tsx       # Centralized modal management

supabase/
├── migrations/
│   ├── 001_create_invite_codes.sql  # Invite system schema
│   ├── 002_fix_delete_constraints.sql
│   ├── 003_fix_all_auth_constraints.sql
│   ├── 004_fix_invite_codes_deletion.sql
│   └── 005_create_asset_prices.sql   # Price caching for portfolio tracking
└── functions/
    ├── validate-invite/      # Check if code is valid
    ├── generate-invite-codes/ # Create 5 codes for new user
    ├── mark-invite-used/      # Mark code as used
    ├── delete-account/        # GDPR-compliant deletion
    └── fetch-asset-prices/    # Live price fetching with smart caching

utils/
├── storage.ts        # AsyncStorage helpers
├── generateId.ts     # UUID for entities
├── supabase.ts       # Supabase client configuration
├── encryption.ts     # PIN hashing/verification
└── useRevenueCat.ts  # RevenueCat SDK integration hook

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
  createdAt: string (ISO timestamp)
  lastLoginAt: string
  hasFaceIDEnabled: boolean
  hasCompletedOnboarding: boolean
}
```

**Subscription State (RevenueCat)**
- Managed by RevenueCat SDK (no local storage needed)
- `isPremium`: Boolean (checks entitlements.active['premium'] or activeSubscriptions)
- `isInTrial`: Boolean (checks if in trial period)
- `trialEndDate`: Date | null (when trial expires)
- `packages`: Available subscription packages from RevenueCat

**Paywall Flow (Fully Implemented with RevenueCat):**
1. User signs up with Google → Authenticated ✅
2. AuthGuard detects `isAuthenticated && !isPremium` → Routes to `/paywall`
3. Paywall screen shows features + "Start 14-Day Free Trial" button
4. User taps button → RevenueCat `purchasePackage()` initiates Apple IAP
5. Apple handles payment (sandbox: free, production: £149/year after trial)
6. RevenueCat grants `premium` entitlement → `isPremium = true`
7. AuthGuard detects premium status → Routes to `/auth` (PIN setup)
8. User creates PIN → Routes to `/home` (full app access) ✅

**RevenueCat Features Implemented:**
- ✅ SDK initialization with platform-specific API keys
- ✅ Purchase flow with error handling (user cancellation, failures)
- ✅ Restore purchases functionality
- ✅ Entitlement checking (premium access)
- ✅ Trial period tracking
- ✅ Subscription status monitoring
- ⚠️ Using test API keys (replace with production keys before launch)

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

## ⚡ WHAT'S REAL VS PLACEHOLDER

**Fully Functional:**
- ✅ Google OAuth (Supabase auth, token management)
- ✅ Paywall (14-day free trial with RevenueCat, £149/year)
- ✅ RevenueCat Integration (purchase flow, restore purchases, entitlements)
- ✅ Face ID/PIN Auth (onboarding, authentication)
- ✅ Empty State Onboarding (hero card with NYC skyline, dynamic welcome message)
- ✅ Home Screen (live data, charts, CRUD, formatted user names, pull-to-refresh)
- ✅ **Investment Tracking (4 Types):**
  - ✅ Stocks (AAPL, MSFT, TSLA) - `AddStocksModal.tsx`
  - ✅ Crypto (BTC/USD, ETH/USD) - `AddCryptoModal.tsx` with auto-formatting
  - ✅ ETFs (SPY, QQQ, VOO) - `AddETFsModal.tsx`
  - ✅ Commodities (GOLD, SILVER) - `AddCommoditiesModal.tsx`
- ✅ Live Price Fetching (Twelve Data API, 800 calls/day free tier)
- ✅ Smart Price Caching (Supabase Edge Function, 1hr stocks/30min crypto)
- ✅ Pull-to-Refresh (manual price updates for all investment types)
- ✅ Add/Edit/Delete Modals (all asset types working)
- ✅ Detail Screens (swipe gestures, edit/delete)
- ✅ Settings (currency switcher, sign out, GDPR-compliant delete account, restore purchases)
- ✅ AsyncStorage persistence (all data saves/loads)
- ✅ Encrypted Cloud Backups (Supabase, PIN-derived key)
- ✅ Global Modal Context (production-ready)
- ✅ Charts (real-time category breakdown)

**Not Built Yet (P1 - Next Priorities):**
- ❌ **Apple OAuth** - Code implemented, needs Supabase configuration (App Store requirement)
- ❌ Bank connections (TrueLayer OAuth flow)
- ❌ Performance chart (net worth over time, line chart)
- ❌ TestFlight distribution

---

## 🔥 KNOWN ISSUES & WORKAROUNDS

**Performance Chart Styling (HIGH PRIORITY):**
- Chart renders but appearance is mediocre, doesn't match web prototype polish
- Day 1 state works correctly (shows current value + dot + message)
- Line visibility and spacing issues in full chart view (Day 2+)
- Severity: High (affects premium brand perception)
- **Next:** Fine-tune styling to match `web-prototype/src/components/HomeScreen.tsx` exactly

**Face ID in Expo Go:**
- Shows device passcode instead of Face ID UI (Expo Go limitation)
- Auth still works, just uses passcode fallback
- Will work properly in standalone build

**Layout Shift on Settings Screen:**
- Fixed via `useSafeAreaInsets()` + LayoutAnimation (300ms fade)
- Never use `SafeAreaView` with `edges` prop (React 19 serialization issue)

**Currency Handling (Critical):**
- **Symbol-only change** - When user switches from GBP → USD → EUR, ONLY the symbol changes (£ → $ → €)
- **NO value conversion** - A £10,000 asset becomes $10,000 (NOT $12,700 via exchange rate)
- **Underlying numeric values remain unchanged** - This matches web prototype behavior
- **Why:** Simpler UX, no API dependency, no compounding conversion errors
- **Future:** May add optional live conversion with exchange rate API

---

## 🔐 AUTHENTICATION IMPLEMENTATION

**Last Updated:** January 6, 2026  
**Status:** ✅ FULLY FUNCTIONAL

### What We've Built

**Architecture: Hybrid Cloud Auth + Local Data**
- ✅ **Supabase** for user identity & OAuth (Google, Apple)
- ✅ **Local storage** for financial data (AsyncStorage)
- ✅ **Encrypted cloud backups** (PIN-derived encryption key)
- ✅ **Device PIN** + optional Face ID (fintech-standard onboarding)
- ✅ **RevenueCat** integration architecture (not implemented yet)

**Implementation Details:**
- Google OAuth via `supabase.auth.signInWithOAuth()` + `expo-web-browser`
- Session storage in AsyncStorage (Supabase handles internally)
- Deep linking with `expo-auth-session` (`makeRedirectUri()`)
- PIN hashing with `expo-crypto` (SHA-256, 1000 iterations)
- Mandatory PIN + optional Face ID during onboarding (see `app/auth.tsx`)
- Supabase client reinitialization on sign-out (prevents state corruption)

**Files:**
- `utils/supabase.ts` - Supabase client with AsyncStorage adapter, client reinitialization
- `utils/encryption.ts` - PIN hashing/verification (SHA-256, 1000 iterations)
- `contexts/DataContext.tsx` - Auth state, sign-out with client reinitialization, backup/restore
- `app/index.tsx` - OAuth implementation (Google/Apple)
- `app/auth.tsx` - Loading state + PIN check (Face ID prompt → PIN setup → PIN entry)
- `app/_layout.tsx` - AuthGuard (single navigation source)
- `app/settings.tsx` - Sign-out button, backup/restore UI

### Key Fixes Applied

**Issue #1: Auth Race Condition (Infinite Loops)**
- **Root Cause:** Dual navigation (DataContext + AuthGuard both navigating to `/auth`)
- **Fix:** Removed navigation from DataContext, AuthGuard handles all routing
- **Result:** Single navigation source eliminates race condition

**Issue #2: PIN Not Persisting**
- **Root Cause:** Component rendered with default `stage='face_id_prompt'` before async PIN check completed, user tapped button before check finished
- **Fix:** Changed initial state to `null`, added loading screen until check completes
- **Result:** User cannot interact until PIN status determined

**Issue #3: Stuck on Loading Screen**
- **Root Cause:** `supabase.auth.getSession()` hung after client reinitialization, component remounting multiple times
- **Fix:** Use `isAuthenticated` from DataContext instead of calling `getSession()`, added `isCheckingSetup` guard
- **Result:** No hanging, no multiple checks, smooth loading → PIN entry flow

**Implementation Pattern:**
```typescript
// app/auth.tsx - Loading state prevents premature interaction
const [stage, setStage] = useState<OnboardingStage>(null); // null = loading

if (stage === null) {
  return <LoadingScreen />; // User waits for PIN check
}

// Use isAuthenticated from context (not getSession())
if (!isAuthenticated) {
  router.replace('/');
  return;
}

// Check PIN in SecureStore
const pinHash = await SecureStore.getItemAsync('regent_pin_hash');
if (pinHash) {
  setStage('pin_entry'); // Returning user
} else {
  setStage('face_id_prompt'); // New user
}
```

**Testing:** Verified 10+ sign-out/sign-in cycles with no issues

---

## 💳 REVENUECAT INTEGRATION

**Last Updated:** January 7, 2026  
**Status:** ✅ FULLY FUNCTIONAL (Sandbox Testing Complete)

### Implementation

**Flow:** Sign Up → Paywall → Purchase → Auth → Home

**Architecture:**
- RevenueCat SDK manages subscription state (no local storage needed)
- AuthGuard checks `isPremium` from RevenueCat entitlements
- Paywall appears when authenticated but not premium
- Apple In-App Purchase handles payment processing
- 14-day free trial, then £149/year (or $149/€149 based on region)

**Files:**
- `utils/useRevenueCat.ts` - Custom hook wrapping RevenueCat SDK
- `contexts/RevenueCatContext.tsx` - Provides subscription state to app
- `app/paywall.tsx` - Paywall screen with purchase flow
- `app/_layout.tsx` - AuthGuard with premium status routing
- `app/settings.tsx` - Restore purchases button

**Key Implementation Details:**
```typescript
// RevenueCat Context provides:
{
  isPremium: boolean,              // Has active premium entitlement
  isInTrial: boolean,              // Currently in trial period
  trialEndDate: Date | null,       // When trial expires
  packages: PurchasesPackage[],    // Available subscriptions
  purchasePackage: (pkg) => void,  // Initiate purchase
  restorePurchases: () => void,    // Restore previous purchases
  isLoadingSubscription: boolean   // Loading state
}

// AuthGuard routing logic
if (isAuthenticated && !isPremium && !isLoadingSubscription) {
  router.replace('/paywall'); // Show paywall
}
```

**Features:**
- ✅ Apple In-App Purchase integration
- ✅ 14-day free trial (automatic)
- ✅ £149/year subscription (sandbox tested with $149)
- ✅ Restore purchases functionality
- ✅ Entitlement checking (premium access)
- ✅ Error handling (user cancellation, purchase failures)
- ✅ Loading states (prevents UI flashing)
- ✅ Sandbox testing complete (successful purchases verified)

**Configuration:**
- **Product ID:** `premium` (configured in RevenueCat dashboard)
- **Offering:** Default offering with ANNUAL package
- **Entitlement:** `premium` (grants app access)
- **API Keys:** Test keys in use (replace with production before launch)

**Known Behaviors:**
- First sandbox purchase may fail (Apple quirk, subsequent purchases work)
- Expo Go shows initialization error (expected, works in standalone builds)
- Face ID missing description warning (already configured in app.json)

**Production Checklist:**
- [ ] Replace test API keys with production keys
- [ ] Configure App Store Connect product
- [ ] Test with real Apple ID (not sandbox)
- [ ] Verify entitlements in RevenueCat dashboard
- [ ] Enable Apple OAuth in Supabase (App Store requirement)

---

## 📧 EMAIL/PASSWORD AUTHENTICATION

**Last Updated:** January 7, 2026  
**Status:** ✅ FULLY FUNCTIONAL (Expo Go Testing Complete)

### Implementation

**Components:**
- `components/SignUpEmailModal.tsx` - Email sign-up with name/email/password validation
- `components/SignInEmailModal.tsx` - Email sign-in with error handling
- `app/index.tsx` - "Continue with Email" button + modal integration

**Features:**
- ✅ Email/password sign-up with validation (8+ char password, email format)
- ✅ Email/password sign-in
- ✅ Show/hide password toggle
- ✅ Comprehensive error handling (duplicate email, wrong password, unverified email)
- ✅ Switch between sign-up and sign-in modals
- ✅ Loading states during submission
- ✅ Consistent design with OAuth buttons

**Email Verification:**
- **Development:** Disabled in Supabase dashboard for Expo Go testing
- **Production:** Must re-enable before App Store launch
- **Note:** Deep linking for email verification only works in standalone builds

**Files:**
- `components/SignUpEmailModal.tsx` (310 lines)
- `components/SignInEmailModal.tsx` (260 lines)
- Total: ~580 lines

---

## 🐛 KNOWN ISSUES & INVESTIGATION NOTES

**Last Updated:** January 7, 2026  
**Status:** ⚠️ PARTIALLY RESOLVED - Some issues remain

### Issue 1: Paywall Flash on App Reload (ACTIVE)

**Symptom:** When reopening app with existing authenticated user, paywall shows briefly before PIN entry

**Expected Behavior:** Should go directly to PIN entry (no paywall)

**What We Tried:**
1. **User Identification Optimization** - Added smart check to only call `logIn()` if user ID changed
   ```typescript
   // Fast path: Check immediately if already identified
   if (customerInfo?.originalAppUserId === userId) {
     return; // Skip identification
   }
   ```
   **Result:** Reduced delay but paywall still flashes

2. **Background Identification** - Removed `isIdentifying` from loading state
   ```typescript
   // Don't block UI during identification
   return { isLoading, isPremium, ... }; // Not: isLoading || isIdentifying
   ```
   **Result:** Eliminated black screen but paywall still appears

3. **Removed Sign-Out Logout** - Don't call `logOutRevenueCat()` on sign out, only on account deletion
   ```typescript
   // Sign out: Keep RevenueCat user ID cached
   // Delete account: Clear RevenueCat user ID
   ```
   **Result:** Should work but paywall still shows

**Current Hypothesis:**
- RevenueCat initialization completes with `isPremium = false` initially
- Takes ~100-500ms to load customer info from cache
- During that time, AuthGuard sees `isPremium = false` and routes to paywall
- When customer info loads, `isPremium = true`, AuthGuard re-routes

**Where to Look Next:**
1. `utils/useRevenueCat.ts` - Line 40-80 (initialization)
   - Check if we can make `getCustomerInfo()` synchronous from cache
   - Or set initial `customerInfo` from cached SDK data
   
2. `app/_layout.tsx` - Line 30-60 (AuthGuard logic)
   - Consider adding minimum wait time before routing decisions
   - Or check if RevenueCat has loaded before making routing decision
   
3. RevenueCat SDK documentation
   - Check if there's a `getCachedCustomerInfo()` synchronous method
   - Or a way to get cached entitlements without async call

---

### Issue 2: PIN Entry Screen Flickering After Purchase (ACTIVE)

**Symptom:** After purchasing on paywall, PIN entry screen appears but flickers/refreshes, requiring PIN entry twice

**Expected Behavior:** Single PIN entry screen, enter PIN once, proceed to home

**What We Tried:**
1. **Remove isIdentifying from loading** - Didn't fix flickering
2. **Optimize logIn checks** - Still flickering

**Current Hypothesis:**
- After purchase, `isPremium` changes from `false` to `true`
- This triggers AuthGuard re-evaluation
- AuthGuard may be routing to `/auth` twice
- Or `/auth` screen is remounting due to state changes

**Where to Look Next:**
1. `app/_layout.tsx` - Line 60-80 (AuthGuard routing after paywall)
   - Add logging to see if routing happens multiple times
   - Check dependencies in useEffect
   
2. `app/auth.tsx` - Component may be remounting
   - Check if `isPremium` is in dependencies causing remount
   - Add `useRef` to prevent multiple PIN checks
   
3. `app/paywall.tsx` - After successful purchase
   - Check if navigation happens before state settles
   - Add delay before router.replace('/auth')

---

### Issue 3: Paywall Flash on Account Deletion (MINOR)

**Symptom:** When deleting account, paywall shows for 2 seconds before sign-up screen

**Expected Behavior:** Should go directly to sign-up screen

**What We Tried:**
1. **Clear Auth State Immediately** - Set `isAuthenticated = false` before async operations
   ```typescript
   // At start of deleteAccount()
   setIsAuthenticated(false);
   setSupabaseUser(null);
   ```
   **Result:** Improved but paywall may still flash briefly

**Current Hypothesis:**
- RevenueCat state (`isPremium`) clears after auth state
- Brief window where `isAuthenticated = false` but `isPremium = true`
- AuthGuard logic may show paywall during this window

**Where to Look Next:**
1. `app/settings.tsx` - Delete account flow
   - Call `logOutRevenueCat()` synchronously at start, not awaited
   - Clear both auth and subscription state before any async operations

**Severity:** Low (happens only on account deletion, rare operation)

---

### Issue 4: Face ID Onboarding Flickering (MINOR)

**Symptom:** When creating new account, Face ID enable screen flickers

**Expected Behavior:** Smooth Face ID prompt screen

**Current Hypothesis:**
- Similar to Issue 2, state changes causing remount
- Likely related to `isPremium` updating after purchase

**Where to Look Next:**
- Same as Issue 2 (app/auth.tsx component)

**Severity:** Low (happens only on first sign-up)

---

### ✅ What's Working Perfectly

**Google OAuth Sign In (Existing Account):**
- ✅ No paywall shown
- ✅ Direct to PIN entry
- ✅ Home screen loads correctly
- **This is the gold standard behavior**

**Email Authentication:**
- ✅ Sign up works
- ✅ Sign in works (after email verification disabled)
- ✅ Error handling works correctly
- ✅ Modal switching works

**Purchase Flow (New Account):**
- ✅ Paywall shows correctly
- ✅ Purchase completes
- ✅ PIN setup works (after flickering settles)
- ✅ Home screen loads

**RevenueCat Core Functionality:**
- ✅ Purchase processing works
- ✅ Subscription entitlements work
- ✅ Restore purchases works
- ✅ Cross-device support works (after identification)

---

## 🎨 EMPTY STATE ONBOARDING

**Last Updated:** January 14, 2026  
**Status:** ✅ PRODUCTION READY

### What It Is

Beautiful onboarding card shown to new users (when `assets.length === 0 && liabilities.length === 0`).

### Design (100% Match to Web Prototype)

**Hero Image Section:**
- NYC skyline sunset photo (200px height, Unsplash)
- Dark gradient overlay (rgba(0,0,0,0.2) → rgba(0,0,0,0.4))
- White text: "Let's build your financial picture"
- Subtext: "Add your first asset to begin"

**CTA Section:**
- Large button: "Add Your First Asset" (with Plus icon)
- Helper text: "Add accounts, investments, property, or cash"
- Dark background (#1a1a1a), centered layout

**Dynamic Header:**
- Empty state: "Welcome, [FirstName]" (uses actual user name)
- Normal state: "Overview"
- Timestamp: Hidden when empty, shown when has data

### User Name Display

**Top Left Corner:** Formatted as "J. Rockefeller"  
**Welcome Title:** Shows actual first name "Welcome, John"

**Implementation:**
```typescript
// Priority fallback for user name
getUserFullName():
  1. supabaseUser.user_metadata.full_name (Google OAuth)
  2. supabaseUser.user_metadata.name (Email signup)
  3. user.name (local storage)
  4. 'User' (fallback)

// Format display name
formatDisplayName("John Rockefeller") → "J. Rockefeller"
getUserFirstName() → "John"
```

### Files

- `app/home.tsx` - Empty state conditional rendering (lines 110-153)
- `EMPTY_STATE_IMPLEMENTATION.md` - Complete documentation

### Dependencies

- `expo-linear-gradient` - For gradient overlay on hero image

### User Flow

1. New user signs up → Completes PIN setup
2. Lands on home: "Welcome, John" + Hero card
3. Taps "Add Your First Asset" → Opens Asset Type Picker
4. Adds first asset → Transitions to normal state with cards
5. Never sees empty state again (unless deletes all assets)

---

## 📈 PORTFOLIO TRACKING IMPLEMENTATION

**Last Updated:** January 16, 2026  
**Status:** ✅ PRODUCTION READY

### What It Is

**Split Investment Types:** 4 dedicated asset types (Stocks, Crypto, ETFs, Commodities) with live price fetching via Twelve Data API.

**Key Decision:** Replaced single "Investment Portfolio" with 4 specific types for better UX and clarity.

### Architecture

**Client Modals:**
- `AddStocksModal.tsx` - Track stocks with searchable dropdown (50 popular)
- `AddCryptoModal.tsx` - Track crypto with searchable dropdown (30 popular) + auto-formatting
- `AddETFsModal.tsx` - Track ETFs with searchable dropdown (30 popular)
- `AddCommoditiesModal.tsx` - Track commodities with searchable dropdown (20 popular)
- `SymbolSearchInput.tsx` - Reusable dropdown component (instant search, clean UI, ScrollView-based)

**Data:**
- `PopularSymbols.ts` - Curated lists (130+ symbols total, zero API calls)

**API:** Twelve Data API (800 calls/day free tier)  
**Caching:** Supabase `asset_prices` table (reduces API calls)  
**Edge Function:** `fetch-asset-prices` - Smart caching + `forceRefresh` support

### User Experience

**Add Asset Flow:**
1. Tap "+ Add Asset"
2. See 4 investment options (all with "Live prices" badges)
3. Select type → Opens dedicated modal
4. Enter name + tap ticker field
5. **Dropdown shows top 10 popular symbols** (e.g., AAPL, MSFT for stocks)
6. Search by typing (filters by ticker OR name, e.g., "Apple" → AAPL)
7. Select symbol OR type custom ticker
8. Prices auto-fetch after 800ms debounce
9. Enter quantity → Save → Asset appears in net worth

**Crypto Auto-Formatting:**
- User types: "BTC"
- After 800ms: Auto-formats to "BTC/USD" + fetches price
- No interruption during typing (happens with price fetch)

**Searchable Dropdown:**
- Shows top 10 popular symbols on focus
- Instant filtering by ticker OR name (e.g., "Apple" → AAPL)
- Tap to select → Auto-fills ticker
- Clean UI: No duplicate icons, proper state management
- ScrollView-based (no VirtualizedList warnings)

**Pull-to-Refresh:**
- Works for ALL investment types (stocks, crypto, ETFs, commodities)
- Fetches fresh prices for all holdings
- Shows "Updated just now" timestamp

### Supported Assets

- **Stocks:** AAPL, MSFT, TSLA, GOOGL, NVDA, AMZN, META, etc.
- **Crypto:** BTC/USD, ETH/USD, SOL/USD, ADA/USD, etc. (auto-formats from BTC)
- **ETFs:** SPY, QQQ, VOO, VTI, IVV, SCHD, etc.
- **Commodities:** GOLD, SILVER, OIL, COPPER, PLATINUM, etc.

### Caching Strategy

- **Stocks/ETFs/Commodities:** 1 hour cache
- **Crypto:** 30 minute cache
- **Force Refresh:** `forceRefresh: true` on all modal fetches (bypasses stale cache)
- **Pull-to-Refresh:** Uses cache if fresh (< 1 hour)

### Cost Optimization

- Free tier: 800 API calls/day
- With caching: Supports 10+ active users
- User-triggered updates only (no background jobs)
- Estimated usage: ~100-175 calls/day for 10 users

### Pricing Display

**Critical:** All investments display in USD (not user's primary currency)
- Individual prices: "$94,614" (not "€94,614")
- Total value: "Total Value (USD) $47,307,000"
- Stored with: `currency: 'USD'`
- Matches how markets quote prices

### Implementation Details

**User Flow:**
1. Tap "+ Add Asset" → Select "Investment Portfolio"
2. Enter portfolio name (e.g., "Tech Stocks")
3. Add holdings: Ticker (e.g., AAPL) + Quantity (e.g., 500)
4. Price auto-fetches in 800ms (debounced)
5. Total value calculates live: `shares × price`
6. Save → Portfolio appears in net worth

**Pull-to-Refresh:**
1. User pulls down on home screen
2. Fetches all unique symbols from portfolios
3. Calls Edge Function with `forceRefresh: false` (uses cache if fresh)
4. Updates asset values with new prices
5. Shows "Updated just now" timestamp

**Files:**
- `components/AddStocksModal.tsx` - Stock portfolio entry UI
- `components/AddCryptoModal.tsx` - Crypto portfolio entry UI (with auto-formatting)
- `components/AddETFsModal.tsx` - ETF portfolio entry UI
- `components/AddCommoditiesModal.tsx` - Commodity portfolio entry UI
- `supabase/functions/fetch-asset-prices/index.ts` - Price fetching logic
- `supabase/migrations/005_create_asset_prices.sql` - Caching table
- `app/home.tsx` - Pull-to-refresh implementation (all investment types)

**Database Schema:**
```sql
CREATE TABLE asset_prices (
  symbol TEXT PRIMARY KEY,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  exchange TEXT,
  name TEXT,
  change_percent NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Asset Metadata Structure:**
```typescript
{
  holdings: [
    {
      symbol: "AAPL",        // or "BTC/USD" for crypto
      name: "Apple Inc.",    // Fetched from API
      shares: 500,           // or "units" for commodities
      currentPrice: 258.21,  // Always in USD
      totalValue: 129105.00, // shares * currentPrice
      change: 2.5            // Percentage (future feature)
    }
  ],
  holdingsCount: 1,
  lastPriceUpdate: "2026-01-16T12:11:53.429Z"
}
```

**Example Full Asset:**
```typescript
{
  id: "abc123",
  type: "stocks",           // or "crypto", "etf", "commodities"
  name: "Tech Stocks",
  value: 129105.00,
  currency: "USD",          // Always USD for investments
  metadata: {
    holdings: [...],
    holdingsCount: 1,
    lastPriceUpdate: "2026-01-16T12:11:53.429Z"
  }
}
```

### Deployment

**Prerequisites:**
- Twelve Data API key (sign up at twelvedata.com)
- Supabase CLI installed

**Setup:**
```bash
# 1. Run migration
supabase db push

# 2. Set API key secret
supabase secrets set TWELVE_DATA_API_KEY=your_key_here

# 3. Deploy Edge Function
supabase functions deploy fetch-asset-prices

# 4. Test
curl -X POST "https://YOUR-PROJECT.supabase.co/functions/v1/fetch-asset-prices" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"symbols": ["AAPL"]}'
```

---

## ✨ UX POLISH & ANIMATIONS

**Last Updated:** January 16, 2026  
**Status:** ✅ PRODUCTION READY

### Net Worth Count-Up Animation

**What It Is:** Smooth animation from £0 → actual net worth value on every screen load and pull-to-refresh.

**Implementation:**
- React Native Animated API (60fps performance)
- 500ms duration with ease-out cubic easing (matches web prototype)
- Triggers on: component mount, pull-to-refresh, net worth changes
- Uses key prop pattern to force re-animation even when value unchanged

**Files:**
- `components/NetWorthCard.tsx` - Animation logic with Animated.Value
- `app/home.tsx` - Key prop management for re-triggering

### Persistent Timestamp System

**What It Is:** Accurate "Updated X ago" timestamp that persists across app restarts.

**Hybrid Display Format:**
- < 1 min: "Updated just now"
- 1-59 min: "Updated 15m ago"  
- 1-23 hours: "Updated 3h ago"
- Yesterday: "Updated yesterday at 4:26 PM"
- Older: "Updated Jan 15 at 4:26 PM"

**Files:**
- `utils/storage.ts` - saveLastDataSync(), loadLastDataSync()
- `contexts/DataContext.tsx` - lastDataSync state + auto-updates
- `app/home.tsx` - Hybrid time formatting logic

### Commodity Symbol Fixes

**What We Fixed:** All 20 commodity symbols updated to forex pair format (XAU/USD, XAG/USD, etc.)

**Files:**
- `constants/PopularSymbols.ts` - All commodity symbols corrected

### Banking Badge Removal

**What We Fixed:** Removed misleading "Live sync" badge (TrueLayer not implemented yet)

**Files:**
- `components/AssetTypePickerModal.tsx` - Badge removed

---

## 📊 PERFORMANCE CHART IMPLEMENTATION

**Last Updated:** January 26, 2026  
**Status:** 🟡 PARTIAL - Works but needs styling polish

### What We Built

**Feature:** Net worth over time visualization with historical snapshots and time range filtering.

**Components:**
- `components/PerformanceChart.tsx` - Main chart component
- Daily snapshots stored in DataContext (local AsyncStorage)
- Time range selector: 1M, 3M, YTD, 1Y
- Two states: Day 1 (onboarding) vs Day 2+ (full chart)

**Day 1 State (matches web prototype):**
- Shows current net worth value (e.g., £250,000)
- Single centered dot visualization
- Message: "Your performance tracking begins today"
- No metrics, no time range selector (minimal onboarding)

**Day 2+ State (full chart):**
- Line chart showing net worth trend
- Performance metrics: ↑/↓ amount and percentage change
- Time period label (e.g., "This month")
- Time range selector (1M/3M/YTD/1Y buttons)

### Library Migration Journey

**Original Attempt: `victory-native`**
- Popular charting library for React Native
- **Why we tried it:** Rich features, good documentation, used by many apps
- **Why it failed:**
  1. Required `@shopify/react-native-skia` (heavy graphics engine)
  2. Required `react-native-reanimated@~4.2.x` (Expo SDK 54 needs `~4.1.1`)
  3. Required `react-native-worklets` (threading library)
  4. Version conflicts with Expo Go and React 19
  5. Multiple errors: "formatDateLabel is not a function", "Element type is invalid"
  6. Development complexity too high for our use case

**Current Solution: `react-native-chart-kit`**
- Lighter weight, simpler API
- No heavy native dependencies
- Works with Expo Go (critical for fast iteration)
- **Trade-off:** Less customization, harder to match web prototype exactly

### Current Issues (🔴 HIGH PRIORITY)

**Styling Mediocre:**
- Chart appearance doesn't match web prototype polish
- Line stroke visibility inconsistent (sometimes too light)
- Spacing and margins need refinement
- Overall "feel" lacks the premium quality of web version

**What's Working:**
- ✅ Day 1 state shows correctly
- ✅ Data calculations accurate
- ✅ Time range filtering works
- ✅ Card positioned correctly (after Net Worth, before Assets)

**Next Steps:**
- Fine-tune stroke width, colors, container styling
- Match web prototype exactly (`web-prototype/src/components/HomeScreen.tsx` lines 469-515)
- May need alternative library if polish can't be achieved

**Files:**
- `components/PerformanceChart.tsx` - Chart component
- `contexts/DataContext.tsx` - Snapshot creation logic (daily)
- `app/home.tsx` - Integration (positioned after Net Worth)

**Dependencies:**
- `react-native-chart-kit@^6.12.0` (current charting library)
- `react-native-svg@15.12.1` (peer dependency)
- **Removed:** `victory-native`, `@shopify/react-native-skia`, `react-native-worklets`

---

## 🗑️ GDPR-COMPLIANT ACCOUNT DELETION

**Last Updated:** January 7, 2026  
**Status:** ✅ PRODUCTION READY

### Architecture

**Approach:** Supabase Edge Function with admin privileges (only way to delete auth.users)

**Why Edge Function:**
- ✅ Only way to access `auth.admin.deleteUser()` (requires service_role key)
- ✅ Server-side validation (can't be bypassed by client)
- ✅ Atomic deletion (all-or-nothing transaction)
- ✅ Audit logging (who, when, what was deleted)
- ✅ GDPR Article 17 compliant (complete erasure)

### Implementation

**Files:**
- `supabase/functions/delete-account/index.ts` - Edge Function (server-side deletion)
- `supabase/config.toml` - Edge Function configuration (verify_jwt = false)
- `contexts/DataContext.tsx` - deleteAccount() action
- `app/settings.tsx` - Delete Account button with double confirmation

**Flow:**
1. User taps "Delete Account" (double confirmation)
2. Client sends access token to Edge Function
3. Edge Function validates token with `supabaseAdmin.auth.getUser(token)`
4. Edge Function deletes: backups table → users table → auth.users record
5. Client signs out, clears local data (AsyncStorage + SecureStore)
6. Client clears React state and redirects to sign-up

**Key Implementation Details:**

```typescript
// Client-side: Token state management (no getSession() calls)
const [accessToken, setAccessToken] = useState<string | null>(null);

// Store token after sign-in
supabase.auth.onAuthStateChange((event, session) => {
  setAccessToken(session?.access_token ?? null);
});

// Use stored token for deletion (bypasses getSession() hang)
const response = await fetch(edgeFunctionUrl, {
  headers: { 'Authorization': `Bearer ${accessToken}` },
});

// Timeouts prevent infinite loading
- Edge Function fetch: 30 seconds
- supabase.auth.signOut(): 3 seconds
- All operations have fallbacks
```

**Server-side (Edge Function):**
```typescript
// Validate token
const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

// Delete in order (cascading foreign keys)
await supabaseAdmin.from('backups').delete().eq('user_id', user.id);
await supabaseAdmin.from('users').delete().eq('id', user.id);
await supabaseAdmin.auth.admin.deleteUser(user.id); // GDPR compliance
```

**Security:**
- ✅ JWT validation on server (can't be bypassed)
- ✅ Service role key never exposed to client
- ✅ Manual JWT verification in Edge Function
- ✅ Token stored in memory only (React state, not disk)

**Robustness:**
- ✅ Comprehensive timeout handling (prevents infinite loading)
- ✅ Verification of PIN and trial state deletion
- ✅ Works reliably on 1st, 2nd, 3rd+ deletions
- ✅ Detailed logging with timestamps for debugging

**Deployment:**
```bash
supabase functions deploy delete-account
```

**Testing:** Verified 5+ deletion cycles with no issues

---

## 📋 NEXT PRIORITIES (P1 Features - In Priority Order)

### **1. Performance Chart Polish** 🔴 HIGH PRIORITY

**Current State:** Chart works but styling is mediocre  
**Goal:** Match web prototype visual quality exactly

**Quick Fix:** Fine-tune `components/PerformanceChart.tsx` styling:
- Reference: `web-prototype/src/components/HomeScreen.tsx` (lines 469-515)
- Fix line stroke visibility (`rgb(100, 116, 139)`, 2.5px width)
- Match spacing, margins, overall polish

**Effort:** 1-2 hours  
**Why Priority 1:** Affects premium brand perception (user-facing)

---

### **2. Apple OAuth** 🔴 **CRITICAL - APP STORE REQUIREMENT**

**Current State:** Code fully implemented in `app/index.tsx`, needs Supabase configuration  
**Goal:** Enable Apple sign-in (App Store requires it if Google OAuth exists)

**What to Do:**
- Go to Supabase Dashboard → Authentication → Providers
- Enable Apple provider
- Add Service ID and key from Apple Developer account
- Test sign-in flow (should work identically to Google OAuth)

**Effort:** 5-10 minutes (configuration only, no code needed)  
**Blocker:** App Store will reject without this

---

### **3. Bank Connections** (TrueLayer OAuth)

**Current State:** Users manually enter bank balances  
**Goal:** Read-only UK bank account connections with auto-refresh

**What to Build:**
- TrueLayer OAuth setup:
  - Create account at truelayer.com
  - Register redirect URI
  - Add client ID/secret to `.env`
- Create `ConnectBankModal.tsx`:
  - Bank selection UI (Barclays, HSBC, Lloyds, etc.)
  - OAuth flow (similar to Google OAuth in `app/index.tsx`)
  - Handle callback and token storage (SecureStore)
- Create `utils/truelayerApi.ts`:
  - Fetch account balances
  - Refresh access tokens
  - Handle errors (expired tokens, revoked access)
- Add auto-refresh mechanism:
  - Check connections on app open
  - Refresh every 24 hours
  - Show "Connected" badge on bank assets

**Starting Point:** See `app/index.tsx` Google OAuth flow, adapt for TrueLayer

---

### **4. TestFlight Beta**

**Current State:** Running in Expo Go only  
**Goal:** Distribute standalone build to beta testers

**What to Do:**
- Setup EAS Build:
  ```bash
  npm install -g eas-cli
  eas login
  eas build:configure
  eas build --platform ios
  ```
- Configure App Store Connect:
  - Create app listing
  - Add TestFlight internal testers
  - Submit build for review
- Gather feedback:
  - Add analytics (optional: PostHog, Mixpanel)
  - Create feedback form
  - Iterate on bugs/UX issues

**Starting Point:** Run `eas build:configure`, follow prompts

**Pre-Launch Checklist:**
- [ ] Enable Apple OAuth in Supabase (App Store requirement)
- [ ] Re-enable email verification in Supabase (currently disabled for Expo Go testing)
- [ ] Replace RevenueCat test keys with production keys
- [ ] Configure App Store Connect product (£149/year)
- [ ] Test Face ID in standalone build
- [ ] Verify all entitlements in RevenueCat dashboard

---

## 💾 ASYNCSTORAGE KEYS (Implementation Reference)

**Core Data:**
- `@regent_user` - User profile (name, email, currency, etc.)
- `@regent_assets` - Assets array (JSON)
- `@regent_liabilities` - Liabilities array (JSON)
- `@regent_subscription` - Subscription state (trial days, expiry, etc.)

**SecureStore (Encrypted):**
- `@regent_auth` - PIN hash (bcrypt)
- `@regent_truelayer_tokens` - Bank OAuth tokens
- `@regent_google_token` - Google OAuth tokens

**Trial Tracking Logic (Model A - Paywall at Sign-Up):**
- User signs up → Navigate to Paywall screen (`/paywall`)
- User taps "Start 14-Day Free Trial" → RevenueCat subscription starts
- `trialStartDate = new Date().toISOString()`, `isActive = true`
- User gets full app access for 14 days
- On each app launch: Calculate `trialDaysRemaining = 14 - daysPassed`
- After 14 days: RevenueCat auto-charges £149/year
- If user cancels trial → `isActive = false`, show paywall again

---

## 🛠️ DEVELOPMENT PATTERNS

**Adding New Screen:**
1. Create `app/screen-name.tsx`
2. Use `useSafeAreaInsets()` for safe area (not SafeAreaView)
3. Import design constants from `/constants`
4. Use `StyleSheet.create()` for styles (not inline)
5. Add LayoutAnimation for smooth transitions
6. **Example:** See `app/home.tsx` or `app/settings.tsx`

**Adding New Modal:**
1. Create `components/ModalName.tsx`
2. Register in `ModalContext.tsx` (add state + open function)
3. Use `openModalName()` from `useModals()` hook in screen
4. Style: `presentationStyle="pageSheet"`, `animationType="slide"`
5. **Example:** See `components/EditAssetModal.tsx` + `contexts/ModalContext.tsx`

**Data Operations:**
1. Use `DataContext` for global state
2. Update AsyncStorage after every change (auto-saves)
3. Re-render UI automatically (React Context handles)
4. **Example:** See `contexts/DataContext.tsx` methods (addAsset, updateAsset, deleteAsset)

**Swipe Gestures:**
1. Use `react-native-gesture-handler` (`PanGestureHandler`)
2. Wrap items in `SwipeableAssetItem` or `SwipeableLiabilityItem`
3. Requires `GestureHandlerRootView` at app root
4. **Example:** See `components/SwipeableAssetItem.tsx`

---

## 💻 COMMON CODE PATTERNS (Copy-Paste Reference)

**Modal Registration (ModalContext.tsx):**
```typescript
// 1. Add state
const [isMyModalVisible, setIsMyModalVisible] = useState(false);

// 2. Add open function
const openMyModal = () => setIsMyModalVisible(true);

// 3. Add to return value
return { isMyModalVisible, setIsMyModalVisible, openMyModal, ... };

// 4. In screen, use hook
const { openMyModal } = useModals();
```

**AsyncStorage Save/Load Pattern:**
```typescript
// Save
await AsyncStorage.setItem('@regent_assets', JSON.stringify(assets));

// Load
const stored = await AsyncStorage.getItem('@regent_assets');
const assets = stored ? JSON.parse(stored) : [];

// Update (load → modify → save)
const assets = await loadAssets();
assets.push(newAsset);
await saveAssets(assets);
```

**Currency Symbol Helper:**
```typescript
const getCurrencySymbol = (currency: Currency) => {
  return { GBP: '£', USD: '$', EUR: '€' }[currency];
};
```

**LayoutAnimation Pattern (Smooth Transitions):**
```typescript
import { LayoutAnimation, UIManager, Platform } from 'react-native';

// Enable on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Use in component
useEffect(() => {
  LayoutAnimation.configureNext(LayoutAnimation.create(
    300, // Duration
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity
  ));
}, []);
```

**Safe Area Pattern (Instead of SafeAreaView):**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
return (
  <View style={[styles.container, { paddingTop: insets.top }]}>
    {/* content */}
  </View>
);
```

**Design Constants Import:**
```typescript
import { Colors, Spacing, BorderRadius, Typography } from '../constants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.primary,
  },
});
```

**When to Reference Code Directly:**
- ❓ Stuck implementing a pattern → Check example file listed above
- ❓ Need exact modal structure → Read `components/EditAssetModal.tsx`
- ❓ Need design reference → Check `web-prototype/src/components/HomeScreen.tsx`
- ❓ Need to understand data flow → Read `contexts/DataContext.tsx`

---

## 🏗️ KEY ARCHITECTURAL DECISIONS (Recent)

**Why Global Modal Context?**
- **Problem:** Modal state duplicated in 3 screens (Home, Assets Detail, Liabilities Detail) = ~300 lines of redundant code
- **Solution:** Centralized all modal logic in `ModalContext.tsx`
- **Result:** 66% code reduction, single source of truth, easier maintenance
- **Usage:** Import `useModals()` hook, call `openAddAssetFlow()`, `openEditAsset(asset)`, etc.

**Why `<Slot />` Not `<Stack>`?**
- **Problem:** React 19 JSI serialization crashes when passing `screenOptions` props to `<Stack>`
- **Solution:** Use `<Slot />` in `_layout.tsx` - bypasses serialization, Expo Router handles transitions
- **Critical:** NEVER go back to `<Stack>` with options unless React 19 compatibility improves

**Why `useSafeAreaInsets()` Not `SafeAreaView`?**
- **Problem:** `SafeAreaView` with `edges` prop causes React 19 serialization errors + async measurement causes layout shift
- **Solution:** Manual padding with `useSafeAreaInsets()` + LayoutAnimation (300ms fade) for smooth mount
- **Where:** Settings screen, any full-screen views

**Why 2-Step Modal Flow?**
- **Matches web prototype:** Step 1 = Type Picker (Bank/Portfolio/Property/Other), Step 2 = Specific Form
- **Better UX:** Clear separation, easier to extend (add new asset types)
- **Implementation:** `AssetTypePickerModal` → opens → `AddBankModal` / `AddPropertyModal` / etc.

---

## 📚 REFERENCE DOCS

**Full Specs (Only When Needed):**
- `docs/archive/REGENT_CURSOR_SPEC.md` - Complete product vision, user flows, design system (3000+ lines)
  - ⚠️ **DO NOT READ unless user explicitly requests it** (e.g., "check the full spec" or "read REGENT_CURSOR_SPEC")
  - ⚠️ **This is archived for token optimization** - PROJECT_CONTEXT.md contains 95% of what you need
  - ✅ **Only reference when:** User asks for detailed user flows, complete design system specs, or integration deep-dives
- `README.md` - Technical implementation details, setup, testing
- `docs/archive/CHANGELOG.md` - Full build history (archived for token optimization)
- **`web-prototype/`** - **Figma-to-React code (REFERENCE ONLY)**
  - ⚠️ **DO NOT copy code directly** (it's React web, not React Native)
  - ✅ **USE FOR:** Design patterns, logic flow, component structure
  - ✅ **DO NOT USE:** Tailwind classes, web components (div/span), localStorage

**Quick Lookups:**
- Design system: `/constants/` folder
- Data models: `/types/index.ts`
- API patterns: `contexts/DataContext.tsx`, `utils/storage.ts`
- Modal patterns: `contexts/ModalContext.tsx`

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

## ⚖️ REGULATORY NOTES (Critical)

**Why Regent Avoids FCA Regulation:**
- ❌ NO direct investment account connections (avoids FCA licensing)
- ✅ TrueLayer ONLY for bank account balances (NOT investments)
- ✅ Manual stock entry (user enters ticker + quantity, we fetch prices)
- ✅ Read-only data (no trades, no management, no advice)
- ✅ "For informational purposes only" disclaimer

**What This Means:**
- Users manually add stock holdings (can't connect Fidelity/Vanguard/etc.)
- We fetch live prices via Twelve Data API
- We calculate portfolio value (quantity × price)
- We NEVER execute trades or provide investment advice

---

**For detailed specs, see `docs/archive/REGENT_CURSOR_SPEC.md` (only if explicitly asked). This doc is your 80/20 reference - everything you need 95% of the time.** 🎯
