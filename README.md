# Regent - Premium Net Worth Tracking

**Version:** 0.8.0 (Portfolio Tracking with Live Prices)  
**Platform:** iOS only (React Native + Expo)  
**Target:** Mass Affluent Professionals (£100k-£1m net worth)  
**Access:** Exclusive invite-only (replaced paid subscription model)

---

## 🚀 Quick Start

**New to this project?**  
1. Read **`PROJECT_CONTEXT.md`** ← **START HERE** (2-3 pages, 80/20 essentials)
2. For full product spec: **`REGENT_CURSOR_SPEC.md`** (3000+ lines, use only when needed)
3. Start building!

---

## 📦 Installation

```bash
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
npm install
npm start  # or: npm run ios
```

**Clear cache if needed:**
```bash
npx expo start --clear
```


## 🛠️ Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript 5.9
- **React:** 19.1.0 (locked for compatibility)
- **Backend:** Supabase (auth, database, Edge Functions)
- **Access Control:** Invite-only system (custom implementation)
- **Navigation:** Expo Router (file-based, `<Slot />` only)
- **State:** React Context API (DataContext, ModalContext)
- **Storage:** AsyncStorage (data) + SecureStore (sensitive) + Supabase (cloud backups)
- **Icons:** Lucide React Native 0.562.0
- **Gestures:** react-native-gesture-handler 2.30.0

---

## 📱 Current Features (P0 MVP Complete)

✅ **Invite System:** Exclusive invite-only access (RGNT-XXXXXX codes)  
✅ **Viral Growth:** Each user gets 5 invite codes to share  
✅ **Authentication:** Google OAuth, Email/Password, Face ID/PIN, Supabase Auth  
✅ **Empty State Onboarding:** Beautiful hero card for new users with NYC skyline  
✅ **Home Screen:** Net Worth, Assets, Liabilities cards + Invite Share Card  
✅ **Portfolio Tracking:** Live prices for stocks, ETFs, crypto, commodities via Twelve Data API  
✅ **Pull-to-Refresh:** User-triggered price updates with smart caching (1 hour stocks, 30 min crypto)  
✅ **CRUD:** Add/Edit/Delete assets & liabilities  
✅ **Detail Screens:** Full lists with swipe gestures  
✅ **Modals:** 2-step flow (type picker → specific form)  
✅ **Settings:** Currency switcher, Sign Out, GDPR-compliant Delete Account  
✅ **Charts:** Horizontal bar charts (category breakdown)  
✅ **Data:** AsyncStorage persistence (auto-save), encrypted cloud backups

---

## 🎯 Recent Changes (January 2026)

### **📈 Portfolio Tracking with Live Prices** ✅ COMPLETE (v0.8.0 - January 16, 2026)
- **Added:** Investment portfolio tracking with multi-holding support
- **Added:** Live price fetching via Twelve Data API (stocks, ETFs, crypto, commodities)
- **Added:** Supabase Edge Function `fetch-asset-prices` with intelligent caching
- **Added:** Pull-to-refresh on home screen for manual price updates
- **Added:** Database migration for `asset_prices` table (caching layer)
- **Caching:** 1 hour for stocks/ETFs/commodities, 30 minutes for crypto
- **UX:** Auto-fetch prices while typing ticker symbols
- **Cost:** Optimized for free tier (800 calls/day supports 10+ active users)
- **Supported Assets:** Stocks (AAPL, MSFT, TSLA), Crypto (BTC/USD, ETH/USD), Commodities (GOLD, SILVER), ETFs (SPY, QQQ, VOO)
- **Files:** `components/AddPortfolioModal.tsx`, `supabase/functions/fetch-asset-prices/index.ts`, `supabase/migrations/005_create_asset_prices.sql`

### **🎨 Empty State Onboarding** ✅ COMPLETE (v0.7.2 - January 14, 2026)
- **Added:** Beautiful empty state card for new users (100% match to web prototype)
- **Added:** Hero image with NYC skyline sunset + gradient overlay
- **Added:** Dynamic header title: "Welcome, [FirstName]" when empty, "Overview" when has data
- **Added:** Prominent CTA button: "Add Your First Asset"
- **Fixed:** User name display now shows actual names (e.g., "J. Rockefeller")
- **Fixed:** Welcome message uses real first name from Supabase user metadata
- **Dependency:** Added `expo-linear-gradient` for gradient overlay
- **Documentation:** Complete guide in `EMPTY_STATE_IMPLEMENTATION.md`
- **UX Impact:** New users see welcoming onboarding instead of £0 values

### **🍎 Apple OAuth Preparation** ✅ CODE READY (January 14, 2026)
- **Fixed:** Apple OAuth code now matches working Google OAuth pattern
- **Added:** Missing `redirectTo` parameter in OAuth flow
- **Added:** Comprehensive debug logging for troubleshooting
- **Documentation:** Created 5 setup guides (`APPLE_OAUTH_*.md` files)
- **Status:** ⏳ Waiting for Apple Developer Program enrollment approval
- **Next:** Configure in Supabase once Apple Developer access granted

### **🔧 Account Deletion & Invite Flow** ✅ FIXED (v0.7.1)
- **Fixed:** Account deletion now works (removed restrictive `used_requires_user` constraint)
- **Fixed:** Proper invite code clearing during account deletion
- **Fixed:** Correct routing flow: delete account → invite screen → sign up → PIN → home
- **Migration:** `004_fix_invite_codes_deletion.sql` removes blocking constraint
- **Verified:** GDPR-compliant deletion with full invite code reset
- **Tested:** Complete end-to-end account lifecycle

### **🎟️ Invite-Only System** ✅ IMPLEMENTED (v0.7.0 - Replaced Paywall)
- **Business Model Change:** Removed RevenueCat subscription paywall
- **New Flow:** Invite Code → Sign Up → Face ID → Home
- **Invite Codes:** Format `RGNT-XXXXXX` (6 alphanumeric, no confusing chars)
- **Viral Mechanic:** Each user gets 5 codes to share
- **Backend:** Supabase Edge Functions (validate, generate, mark-used)
- **Database:** `invite_codes` table with RLS policies
- **Founder Codes:** 10 pre-seeded codes (`RGNT-F0UND1` through `RGNT-F0UNDA`)
- **UI:** New `/invite-code` screen + ShareInviteCard on home
- **AuthGuard:** Updated routing logic for invite validation

### **📋 Implementation Details**
- **Edge Functions Deployed:**
  - `validate-invite`: Check if code is valid and unused
  - `generate-invite-codes`: Create 5 new codes for user on signup
  - `mark-invite-used`: Mark code as used and decrement referrer count
- **Database Migration:** `001_create_invite_codes.sql` with constraints
- **Files Added:**
  - `app/invite-code.tsx` - Invite entry screen
  - `components/ShareInviteCard.tsx` - Share UI on home
  - `supabase/functions/*` - Three Edge Functions
- **Files Modified:**
  - `app/_layout.tsx` - AuthGuard routing for invites
  - `contexts/DataContext.tsx` - Invite code generation on signup
  - `app/home.tsx` - ShareInviteCard integration
  - `app/settings.tsx` - Removed RevenueCat references

### **Paywall & Trial Management**
- 14-day free trial flow (sign up → paywall → purchase)
- RevenueCat manages subscription state (no local storage)
- AuthGuard routing based on premium status
- Background user identification (doesn't block UI)

### **GDPR-Compliant Account Deletion** ✅ WORKING
- Complete data erasure (cloud + local)
- Supabase Edge Function with admin privileges
- Deletes: auth user, user profile, backups, invite codes, local data, PIN
- Token state management for reliable deletion
- Comprehensive error handling with timeouts
- **Fixed:** Removed restrictive CHECK constraint blocking deletion (migration `004`)
- **Fixed:** Proper invite code clearing and routing flow

---

## ⚠️ Known Issues

### **Issue 1: Face ID Screen Flickering** 🟡 MINOR
**Symptom:** Face ID enable screen flickers on new account creation

**Severity:** Low (happens only on first sign-up)

---

## 🔜 Next Up (P1 Features - Priority Order)

### 1. Apple OAuth 🟡 ON HOLD (Waiting for Apple Developer Enrollment)
**Goal:** Enable Apple sign-in (App Store requirement)  
**What to do:**
- Enable Apple provider in Supabase Dashboard
- Add Service ID and key from Apple Developer
- Test sign-in flow (code already implemented)

**Current state:**  
- ✅ Code complete (fixed `redirectTo` parameter, added logging)
- ✅ Comprehensive documentation created (5 setup guides)
- ⏳ **Waiting for Apple Developer Program confirmation** (enrollment documents submitted)
- 🔴 **BLOCKED:** Cannot configure without Apple Developer access

**Effort:** 5-10 minutes (once enrollment approved)  
**Documentation:** See `APPLE_OAUTH_SETUP.md` for complete setup guide

---

### 2. Bank Connections (TrueLayer OAuth)
**Goal:** Read-only UK bank account balance fetching  
**What to build:**
- TrueLayer OAuth flow (similar to Google OAuth)
- Bank selection UI
- Auto-refresh mechanism (24-hour cycle)
- Secure token storage in SecureStore

**Current state:** Manual bank entry only

---

### 3. Performance Chart
**Goal:** Net worth over time visualization  
**What to build:**
- Historical snapshots table in Supabase
- Line chart component (react-native-chart-kit)
- Time range selector (1M, 3M, 6M, 1Y, All)

**Current state:** No historical tracking

---

### 4. TestFlight Beta
**Goal:** Distribute to beta testers  
**What to do:**
- Build with EAS: `eas build --platform ios`
- Submit to App Store Connect
- Create TestFlight internal group
- Gather feedback and iterate

**Pre-Launch Checklist:**
- [ ] Enable Apple OAuth in Supabase (App Store requirement)
- [ ] Re-enable email verification in Supabase (currently disabled for Expo Go testing)
- [ ] Replace RevenueCat test keys with production keys
- [ ] Configure App Store Connect product (£149/year)
- [ ] Test Face ID in standalone build
- [ ] Verify all entitlements in RevenueCat dashboard

---

## 🎨 Design System

All design constants live in **`/constants/`**:
- `Colors.ts` - Muted, premium palette
- `Typography.ts` - Font sizes, weights, line heights
- `Spacing.ts` - 4pt base scale (xs to 3xl)
- `Layout.ts` - Border radius, shadows

**Brand:** "Uber modernism + JPM restraint" - no gamification, no bright colors, no fluff.

---

## 📂 Project Structure

```
app/                  # Screens (Expo Router)
components/           # Modals, Cards, Swipeable Items
contexts/             # DataContext, ModalContext
utils/                # storage.ts, generateId.ts
constants/            # Design system
types/                # TypeScript interfaces
web-prototype/        # Reference only (NOT for production)
```

---

## ⚠️ Critical Constraints

**iOS Only:** Test on physical device (Face ID, gestures)  
**Backend:** Supabase for auth, cloud backups, and account deletion (local-first design with cloud sync)  
**React 19 Issues:** Always use `<Slot />`, never `<Stack>` with `screenOptions`  
**Gestures:** Requires `GestureHandlerRootView` at app root

---

## 🐛 Known Issues

**Face ID in Expo Go:** Shows passcode (Expo Go limitation, works in standalone build)  
**Currency:** Symbol-only change (no conversion yet)

---

## 📚 Documentation

| Doc | Purpose | When to Use |
|-----|---------|-------------|
| **`PROJECT_CONTEXT.md`** | Self-sufficient quick reference | **Start here, use 95% of the time** |
| **`REGENT_CURSOR_SPEC.md`** | Complete product specification | Complex integrations only (TrueLayer, RevenueCat, etc.) |
| **Git History** | Build history & decisions | `git log --oneline` for past changes |

---

## 🚀 Development Workflow

**Start a new feature:**
1. Check `PROJECT_CONTEXT.md` for patterns
2. Create component/screen in appropriate folder
3. Use design constants from `/constants/`
4. Update `DataContext` if touching global state
5. Test on physical iPhone (Face ID, gestures)

**Adding a modal:**
1. Create component in `/components/`
2. Register in `ModalContext.tsx`
3. Use `useModals()` hook to open

**Data operations:**
1. Update via `DataContext` methods
2. AsyncStorage auto-saves
3. UI re-renders automatically

---

## 🧪 Testing Checklist

- [ ] Works on physical iPhone (Face ID, gestures)
- [ ] Data persists after app close
- [ ] Empty states display correctly
- [ ] Error states show helpful messages
- [ ] Animations are smooth (60fps)
- [ ] No console errors/warnings

---

## 📞 For Questions

**Product Decisions:** See `REGENT_CURSOR_SPEC.md` sections 1-4  
**Technical Patterns:** See `PROJECT_CONTEXT.md` "Development Patterns"  
**Build History:** Run `git log --oneline` or check commit messages

---

**Built with restraint for discerning professionals.** 🎯
