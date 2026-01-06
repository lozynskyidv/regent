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

### ⚠️ CRITICAL BLOCKER: Auth Sign-Out/Sign-In Race Condition (UNRESOLVED)

**Last Updated:** January 6, 2026  
**Status:** 🔴 **BLOCKING** - 4 iterations attempted, all failed  
**Symptoms:** After 2-3 sign-out/sign-in cycles → infinite loading, session timeouts, or infinite redirect loops

---

#### The Problem

**What happens:**
1. User signs in successfully → Uses app → Signs out
2. User immediately signs in again → Works
3. **After 2-3 cycles:** One of these failures occurs:
   - "Continue with Google" button shows infinite loading (OAuth never initiates)
   - OAuth completes but infinite redirect loop between `/` and `/auth`
   - Session check times out (2+ seconds instead of <100ms)

**Root causes identified (multiple, compounding):**
1. **AsyncStorage accumulation** - Orphaned Supabase session keys accumulate over cycles
2. **State management race** - Local React state updates before/after Supabase async operations
3. **Auth listener timing** - `onAuthStateChange` fires before state updates complete
4. **SecureStore size limit** - Session tokens exceed 2048-byte iOS limit (fixed in v2)

---

#### 🔄 What We've Tried (4 Iterations)

##### **Attempt #1: State Order Reversal + Stop/Start Auto-Refresh**
**Date:** Jan 6, 2026 morning  
**Theory:** Supabase cleanup must complete BEFORE clearing local state

**Implementation:**
```typescript
// DataContext.tsx signOut():
await supabase.auth.stopAutoRefresh();  // Stop refresh
await supabase.auth.signOut();  // Sign out
await new Promise(resolve => setTimeout(resolve, 1000));  // Wait
await supabase.auth.startAutoRefresh();  // Restart ← PROBLEM!
setIsAuthenticated(false);  // Then clear state
```

**Result:** ❌ **FAILED - Caused new hang issue**
- `startAutoRefresh()` after sign-out corrupted Supabase client
- Client tried to refresh non-existent session
- Next `getSession()` call hung indefinitely (2+ second timeout)

**Logs showed:**
```
Line 969: Restarting token auto-refresh...
Line 978: Checking for existing session...
Line 980: [HANG - no more logs]
```

**Lesson learned:** Don't manually call `stopAutoRefresh()` / `startAutoRefresh()` - Supabase handles internally

---

##### **Attempt #2: Remove Manual Auto-Refresh Calls**
**Date:** Jan 6, 2026 afternoon  
**Theory:** Let Supabase manage its own lifecycle, add timeout to prevent hanging

**Implementation:**
```typescript
// DataContext.tsx signOut():
await supabase.auth.signOut();  // Just sign out, no manual stop/start
await new Promise(resolve => setTimeout(resolve, 1500));
setIsAuthenticated(false);

// app/index.tsx - Added timeout to getSession():
const { data: { session } } = await Promise.race([
  supabase.auth.getSession(),
  new Promise(resolve => setTimeout(() => resolve({ data: { session: null } }), 2000))
]);
```

**Result:** ✅ **Partially worked** - First 2 cycles succeeded  
❌ **Then failed** - After 2-3 cycles:
- `getSession()` started timing out (2+ seconds)
- OAuth completed but infinite redirect loop between `/` and `/auth`

**Logs showed:**
```
Line 900: WARN ⏱️ Session check timed out
Line 929: WARN ⏱️ Session check timed out ← Getting progressively worse
```

**Lesson learned:** Timeout prevents hang but doesn't fix root cause (AsyncStorage accumulation)

---

##### **Attempt #3: Pre-OAuth AsyncStorage Cleanup + Session Retry**
**Date:** Jan 6, 2026 evening  
**Theory:** Clean AsyncStorage BEFORE OAuth to prevent accumulation, add retry logic in `/auth`

**Implementation:**
```typescript
// app/index.tsx - BEFORE OAuth:
const allKeys = await AsyncStorage.getAllKeys();
const supabaseKeys = allKeys.filter(key => 
  key.startsWith('sb-') || key.includes('auth-token')
);
await AsyncStorage.multiRemove(supabaseKeys);  // Nuclear cleanup
await new Promise(resolve => setTimeout(resolve, 500));  // Wait for flush
// Then start OAuth

// app/auth.tsx - Retry up to 3 times:
for (let attempt = 1; attempt <= 3; attempt++) {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) break;
  await new Promise(resolve => setTimeout(resolve, 500));
}
```

**Result:** ❌ **FAILED - Race condition + PIN deletion**
- Cleaning AsyncStorage BEFORE OAuth created race condition
- OAuth `setSession()` wrote to AsyncStorage
- `/auth` tried to read before write completed
- Session unavailable → infinite loop
- **Bonus issue:** Sometimes PIN was deleted (user prompted to create new PIN)

**Logs showed:**
```
Cleaning AsyncStorage... → OAuth completes → Session write → /auth reads → null → Loop
```

**Lesson learned:** Cleaning BEFORE OAuth is too early - causes race with session write

---

##### **Attempt #4: Post-Sign-Out AsyncStorage Cleanup**
**Date:** Jan 6, 2026 late evening  
**Theory:** Clean AsyncStorage AFTER sign-out (not before sign-in)

**Implementation:**
```typescript
// DataContext.tsx signOut():
await supabase.auth.signOut();
// Then nuclear AsyncStorage cleanup:
const allKeys = await AsyncStorage.getAllKeys();
const supabaseKeys = allKeys.filter(key => 
  key.startsWith('sb-') || key.includes('auth-token')
);
await AsyncStorage.multiRemove(supabaseKeys);
await new Promise(resolve => setTimeout(resolve, 1000));
setIsAuthenticated(false);

// app/index.tsx - No cleanup, just OAuth
// app/auth.tsx - Simple session check (no retry)
```

**Result:** ❌ **STILL FAILING** (user report: "same issue persists")
- Exact failure mode unknown (user didn't provide logs)
- Likely still infinite loop or timeout after 2-3 cycles

**Lesson learned:** Moving cleanup timing alone doesn't solve underlying issue

---

#### 🤔 Current Hypothesis (For Next Developer)

**The issue is likely deeper than timing or cleanup:**

1. **Supabase client state corruption** - After multiple auth cycles, the Supabase client enters an invalid state that persists across operations
2. **AsyncStorage read/write conflicts** - React Native AsyncStorage may have concurrency issues we're not handling
3. **Auth listener memory leak** - Multiple `onAuthStateChange` listeners may be accumulating
4. **Expo OAuth flow issues** - `expo-web-browser` may not properly clean up between cycles

**Potential solutions to explore:**

##### **Option A: Reinitialize Supabase Client on Sign-Out**
```typescript
// Create entirely new client instance after sign-out
await supabase.auth.signOut();
supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: AsyncStorageAdapter, ... }
});
```
**Pros:** Forces fresh start, no accumulated state  
**Cons:** Loses all listeners, need to re-register  
**Risk:** Medium - Major refactor but cleanest solution

##### **Option B: Sequential AsyncStorage Operations with Locks**
```typescript
// Use mutex/lock to prevent concurrent AsyncStorage operations
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

await lock.acquire('supabase-storage', async () => {
  await supabase.auth.signOut();
  await cleanAsyncStorage();
});
```
**Pros:** Prevents race conditions  
**Cons:** Adds dependency, complexity  
**Risk:** Low - Non-invasive addition

##### **Option C: Switch to Alternative Auth Provider**
```typescript
// Use Firebase Auth or expo-auth-session directly
// Bypass Supabase Auth entirely for sign-in/sign-out
```
**Pros:** More mature OAuth handling  
**Cons:** Massive refactor, lose Supabase integration  
**Risk:** High - 2-3 days work, architectural change

##### **Option D: Add Auth State Machine**
```typescript
// Explicit state machine to prevent invalid transitions
enum AuthState { SIGNED_OUT, SIGNING_IN, SIGNED_IN, SIGNING_OUT }
// Block operations if state transition in progress
```
**Pros:** Prevents race conditions at application level  
**Cons:** Added complexity, doesn't fix root cause  
**Risk:** Medium - Architectural change

##### **Option E: Debug with Supabase Logs**
```typescript
// Enable verbose Supabase client logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth event:', event);
  console.log('📦 Session state:', JSON.stringify(session));
  console.log('💾 AsyncStorage keys:', await AsyncStorage.getAllKeys());
});
```
**Pros:** May reveal root cause  
**Cons:** Doesn't provide solution, only diagnostic  
**Risk:** Low - Diagnostic only

---

#### 📚 Related Files & Documentation

**Implementation files:**
- `contexts/DataContext.tsx` - Sign-out logic (lines 371-443)
- `app/index.tsx` - OAuth flow (lines 32-114)
- `app/auth.tsx` - Session validation (lines 34-59)
- `utils/supabase.ts` - Client config with AsyncStorage adapter
- `app/_layout.tsx` - Auth listeners and AuthGuard

**Documentation files:**
- `AUTH_FIX_SUMMARY.md` - Attempt #1 documentation
- `AUTH_FIX_V2_SUMMARY.md` - Attempt #2 documentation
- `AUTH_FIX_V3_FINAL.md` - Attempt #3 documentation
- `AUTH_FIX_V4_FINAL.md` - Attempt #4 documentation

**External resources:**
- [Supabase Auth Issues](https://github.com/supabase/auth-js/issues)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo OAuth Deep Linking](https://docs.expo.dev/guides/authentication/#oauth-and-openid-connect)

---

#### 💡 Recommendations for Next Developer

**Before attempting another fix:**
1. **Add comprehensive logging** - Log every auth state change, AsyncStorage operation, and Supabase call
2. **Test with real device** - Expo Go behaves differently than standalone builds
3. **Monitor Supabase dashboard** - Check for orphaned sessions on server
4. **Test incrementally** - Make one small change, test 10 cycles, iterate

**Most promising approach:**
**Option A (Reinitialize Supabase Client)** seems most likely to succeed because:
- Forces truly clean state
- Eliminates any accumulated corruption
- Used successfully by other projects with similar issues
- Risk is manageable with careful implementation

**If all else fails:**
Consider this a **known limitation** and implement:
- "Force refresh" button that clears all app data
- Automatic app restart after 3 failed auth attempts
- Clear user messaging: "If sign-in fails, restart the app"

---

**Status:** 🔴 **BLOCKING P0 ISSUE** - Must be resolved before production launch

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
