# PROJECT CONTEXT - Regent iOS App

**Last Updated:** January 6, 2026  
**Version:** 0.3.0 (P0 MVP Complete ✅)  
**Platform:** iOS only (React Native Expo)

---

## 🚀 QUICK START (5-Min Orientation)

**What is Regent?**  
Premium net worth tracking for mass affluent professionals (£100k-£1m). "Uber modernism + JPM restraint." Local storage, no backend.

**Current State (What's ACTUALLY Built):**  
✅ **P0 MVP COMPLETE:**
- Sign Up screen (Google OAuth UI, not functional yet)
- Auth screen (Face ID/PIN, placeholder logic)
- Home Screen (Net Worth + Assets + Liabilities cards with live data)
- **Edit Modals** (EditAssetModal, EditLiabilityModal - pre-populated forms, delete buttons)
- **Detail Screens** (Assets/Liabilities full lists with swipe-to-edit/delete gestures)
- **Global Modal Context** (centralized modal state, eliminated 66% code duplication)
- **Charts** (horizontal bar charts, category breakdown with colors)
- **CRUD** (Create, Read, Update, Delete all working)
- **Currency Switcher** (GBP/USD/EUR - **symbol-only, NO value conversion**)
- **Settings Screen** (currency selection, sign out, delete account)

❌ **NOT BUILT (P1):** Stock tracking, Bank connections, Subscriptions (RevenueCat), Performance chart

**Tech Stack:**  
- React Native (Expo SDK 54), React 19.1.0, TypeScript 5.9  
- Local storage: AsyncStorage (data) + SecureStore (PIN/tokens)  
- Icons: Lucide React Native 0.562.0  
- Gestures: react-native-gesture-handler 2.30.0 (swipe-to-edit/delete)  
- State: React Context API (DataContext, ModalContext)  
- Navigation: Expo Router (file-based, **ALWAYS use `<Slot />` not `<Stack>`**)

---

## 📂 PROJECT STRUCTURE

```
app/                  # Expo Router screens
├── _layout.tsx       # Root (Slot routing, GestureHandlerRootView)
├── index.tsx         # Sign Up (Google OAuth UI)
├── paywall.tsx       # TO BUILD: Paywall ("Start 14-Day Free Trial")
├── auth.tsx          # Face ID/PIN auth (placeholder)
├── home.tsx          # Dashboard (Net Worth + Assets + Liabilities)
├── assets-detail.tsx # Full asset list (swipe gestures)
├── liabilities-detail.tsx
└── settings.tsx      # Currency, Sign Out, Delete Account

components/           # Modals & Cards
├── NetWorthCard, AssetsCard, LiabilitiesCard
├── AssetTypePickerModal, LiabilityTypePickerModal
│   └── (2-step flow: Step 1 = type picker, Step 2 = specific form)
├── Add[Bank|Property|OtherAsset]Modal.tsx
├── Add[Mortgage|Loan|OtherLiability]Modal.tsx
├── EditAssetModal, EditLiabilityModal (pre-populated, delete button)
└── SwipeableAssetItem, SwipeableLiabilityItem (gesture handlers)

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
  createdAt: string (ISO timestamp)
  lastLoginAt: string
  hasFaceIDEnabled: boolean
  hasCompletedOnboarding: boolean
}
```

**SubscriptionState** (AsyncStorage `@regent_subscription`)
```typescript
{
  isActive: boolean (true after "Start Trial" button tapped)
  trialStartDate?: string (ISO timestamp when user started trial)
  trialDaysRemaining: number (14 → 0, calculated from trialStartDate)
  expiresAt?: string (subscription expiry date from RevenueCat)
  productId?: string ('regent_annual_149')
  willRenew?: boolean (from RevenueCat, true if auto-renewing)
}
```

**Trial Flow:**
- User signs up → Paywall appears → User taps "Start 14-Day Free Trial"
- RevenueCat subscription starts (with 14-day trial period)
- `trialStartDate = new Date().toISOString()`, `isActive = true`
- App grants full access for 14 days
- After 14 days: RevenueCat auto-charges £149/year, `expiresAt = 1 year from now`

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
- ✅ Home Screen (live data, charts, CRUD)
- ✅ Add/Edit/Delete Modals (all working)
- ✅ Detail Screens (swipe gestures, edit/delete)
- ✅ Settings (currency switcher, sign out, delete account)
- ✅ AsyncStorage persistence (all data saves/loads)
- ✅ Global Modal Context (production-ready)
- ✅ Charts (real-time category breakdown)

**UI Only (Not Functional Yet):**
- ❌ **Google OAuth** - UI buttons exist, but no actual OAuth integration
- ❌ **Face ID/PIN Auth** - Screen exists, but just placeholder validation (any PIN works)
- ❌ **Sign Out** - Button exists in Settings, but doesn't clear data yet
- ❌ **Delete Account** - Button exists in Settings, but doesn't wipe data yet
- ❌ **Subscription Badge** - Settings shows "Trial (14d left)" hardcoded, not dynamic

**Not Built At All (P1 - Next Priorities):**
- ❌ **Paywall Screen** - Needs to appear after sign-up, before app usage
- ❌ **RevenueCat SDK** - Not integrated (subscription purchase, trial tracking, auto-charge)
- ❌ Stock tracking (Twelve Data API integration)
- ❌ Bank connections (TrueLayer OAuth flow)
- ❌ Performance chart (net worth over time, line chart)

---

## 🔥 KNOWN ISSUES & WORKAROUNDS

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

## 🔐 AUTHENTICATION IMPLEMENTATION & KNOWN ISSUES

**Last Updated:** January 6, 2026  
**Status:** ⚠️ CRITICAL ISSUE - Sign-in infinite loading after 3rd sign-out cycle

### What We've Built

**Architecture: Hybrid Cloud Auth + Local Data**
- ✅ **Supabase** for user identity & OAuth (Google, Apple)
- ✅ **Local storage** for financial data (AsyncStorage)
- ✅ **Encrypted cloud backups** (PIN-derived encryption key)
- ✅ **Device PIN** + optional Face ID (fintech-standard onboarding)
- ✅ **RevenueCat** integration architecture (not implemented yet)

**Implementation Details:**
- Google OAuth via `supabase.auth.signInWithOAuth()` + `expo-web-browser`
- Session storage in `SecureStore` (iOS Keychain)
- Deep linking with `expo-auth-session` (`makeRedirectUri()`)
- PIN hashing with `expo-crypto` (SHA-256, 100k iterations)
- Mandatory PIN + optional Face ID during onboarding (see `app/auth.tsx`)

**Files Modified:**
- `utils/supabase.ts` - Supabase client with SecureStore adapter
- `utils/encryption.ts` - PIN-derived key + XOR encryption
- `contexts/DataContext.tsx` - Auth state, sign-out logic, backup/restore
- `app/index.tsx` - OAuth implementation (Google/Apple)
- `app/auth.tsx` - 3-stage onboarding (Face ID prompt → PIN setup → PIN entry)
- `app/_layout.tsx` - AuthGuard, session listener
- `app/settings.tsx` - Sign-out button, backup/restore UI

### Critical Issue: Infinite Loading on 3rd Sign-Out

**Problem:**
After 2-3 rapid sign-out/sign-in cycles, "Continue with Google" button shows infinite loading and OAuth never initiates.

**Root Cause (Suspected):**
Race condition between `signOut()` and `signInWithOAuth()`:
1. User signs out → `supabase.auth.signOut()` starts (takes 2-3 seconds)
2. User immediately taps "Continue with Google" → `signInWithOAuth()` starts
3. Supabase is processing sign-out WHILE processing sign-in
4. Internal session storage becomes corrupted/inconsistent
5. Subsequent OAuth attempts hang indefinitely

**Evidence from Logs:**
```
924  LOG  🔐 Starting Google OAuth...
927  LOG  🌐 Opening browser for OAuth...
929  LOG  ✅ Supabase signOut completed  ← Sign-out completes AFTER OAuth started!
```

### Attempted Fixes (What Didn't Work)

**Attempt 1: Fire-and-Forget Sign-Out**
- Cleared local state immediately, let Supabase signOut run in background
- Result: ❌ Still caused race condition

**Attempt 2: Timeout for Supabase SignOut**
- Added 3-second timeout using `Promise.race()`
- Result: ❌ Sometimes timed out before completion, leaving orphaned sessions

**Attempt 3: Manual SecureStore Cleanup**
- Manually deleted `supabase.auth.token` from SecureStore during sign-out
- Result: ❌ Corrupted Supabase's internal storage, made problem worse

**Attempt 4: Pre-OAuth Session Check**
- Checked for existing session before OAuth, called `signOut()` if found
- Result: ❌ Created nested race condition (sign-out within OAuth flow)

**Attempt 5: Global Auth Lock + Cooldown (Current Implementation)**
- Added `isAuthProcessing` flag to block concurrent auth operations
- Added 500ms cooldown after sign-out completes
- Added full-screen loading overlay to prevent user interaction
- Result: ⚠️ **STILL FAILING** - Issue persists after 2-3 cycles

**Current Code State:**
```typescript
// contexts/DataContext.tsx
const signOut = async () => {
  setIsAuthProcessing(true); // 🔒 Global lock
  
  try {
    setSupabaseUser(null);
    setIsAuthenticated(false);
    
    await Promise.race([
      supabase.auth.signOut(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    // 500ms cooldown for Supabase cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
  } finally {
    setIsAuthProcessing(false); // 🔓 Release lock
  }
};

// app/index.tsx
const handleGoogleSignIn = async () => {
  if (isAuthProcessing) {
    Alert.alert('Please Wait', 'Auth operation in progress');
    return;
  }
  // ... OAuth flow
};
```

### Potential Solutions (Not Yet Tried)

**Option 1: Reinitialize Supabase Client on Sign-Out**
```typescript
// Create new Supabase client instance after sign-out
await supabase.auth.signOut();
supabaseClient = createClient(url, key, { ... }); // Fresh client
```

**Option 2: Clear ALL SecureStore Keys**
```typescript
// Nuclear option - wipe all Supabase-related keys
const supabaseKeys = [
  'supabase.auth.token',
  'supabase.session',
  'sb-localhost-auth-token', // Development
  'sb-auth-token', // Production
];
await Promise.all(supabaseKeys.map(key => 
  SecureStore.deleteItemAsync(key).catch(() => {})
));
```

**Option 3: Use Supabase stopAutoRefresh/startAutoRefresh**
```typescript
// Pause Supabase internal refresh cycle during sign-out
await supabase.auth.stopAutoRefresh();
await supabase.auth.signOut();
await new Promise(resolve => setTimeout(resolve, 1000)); // Cooldown
await supabase.auth.startAutoRefresh(); // Restart for next sign-in
```

**Option 4: Implement Exponential Backoff**
```typescript
// Prevent rapid sign-out/sign-in cycles
let lastSignOutTime = 0;
const MIN_SIGNOUT_INTERVAL = 3000; // 3 seconds

if (Date.now() - lastSignOutTime < MIN_SIGNOUT_INTERVAL) {
  Alert.alert('Please wait before signing in again');
  return;
}
```

**Option 5: Switch to Alternative Auth Provider**
- Consider using `expo-auth-session` directly (bypass Supabase Auth)
- Or use Firebase Auth instead of Supabase
- Pro: More mature OAuth handling
- Con: Major refactor, lose Supabase database integration

**Option 6: Add Manual Session Validation**
```typescript
// Before OAuth, verify Supabase is in clean state
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  console.warn('Stale session detected, forcing cleanup');
  await supabase.auth.signOut({ scope: 'local' }); // Force local-only signout
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### Recommendations for Future Developer

**Immediate Priority:**
1. Try **Option 3** (stopAutoRefresh/startAutoRefresh) - most elegant
2. If that fails, try **Option 2** (nuclear SecureStore wipe) - brute force but reliable
3. If both fail, consider **Option 5** (switch auth provider) - last resort

**Testing Protocol:**
- Test 20 rapid sign-out/sign-in cycles before declaring fix
- Monitor Supabase dashboard for orphaned sessions
- Check Xcode device logs for native-level errors
- Test on REAL device (not Expo Go) - auth behaves differently

**Debug Logging to Add:**
```typescript
// Log ALL Supabase internal state
const session = await supabase.auth.getSession();
console.log('Supabase session state:', JSON.stringify(session));
console.log('SecureStore keys:', await listAllSecureStoreKeys()); // Implement helper
```

**Related Files:**
- `utils/supabase.ts` - Client initialization
- `contexts/DataContext.tsx` - Sign-out logic (lines 366-394)
- `app/index.tsx` - OAuth flow (lines 30-105)
- `SETUP_GUIDE.md` - Supabase configuration instructions
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Original implementation plan

**External Resources:**
- Supabase Auth docs: https://supabase.com/docs/guides/auth
- Expo SecureStore docs: https://docs.expo.dev/versions/latest/sdk/securestore/
- Known Supabase Auth issues: https://github.com/supabase/auth-js/issues

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
   - **Paywall at sign-up** - Appears immediately after user signs up (before using app)
   - **"Start 14-Day Free Trial" button** - Subscribes via RevenueCat, starts trial
   - **Full access for 14 days** - All features available during trial (stocks, banks, unlimited assets)
   - **Auto-charge after trial** - After 14 days, user charged £149/year automatically
   - **Pricing:** Single tier only - £149/year (GBP), $149/year (USD), €149/year (EUR)
   - **Restore purchases** functionality for returning users
   - **Flow:** Sign Up → Paywall → Start Trial → Auth → Home (use app for 14 days) → Auto-charged £149

4. **Performance Chart**
   - Net worth over time (line chart)
   - Historical snapshots (monthly)

5. **TestFlight Beta**
   - Build with EAS
   - Beta testing
   - Feedback implementation

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
