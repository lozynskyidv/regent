# Regent - Premium Net Worth Tracking

**Version:** 0.5.0 (P0 MVP Complete ✅ + RevenueCat Integration ✅)  
**Platform:** iOS only (React Native + Expo)  
**Target:** Mass Affluent Professionals (£100k-£1m net worth)

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
- **Payments:** RevenueCat (react-native-purchases 8.2.5)
- **Navigation:** Expo Router (file-based, `<Slot />` only)
- **State:** React Context API (DataContext, ModalContext, RevenueCatContext)
- **Storage:** AsyncStorage (data) + SecureStore (sensitive) + Supabase (cloud backups)
- **Icons:** Lucide React Native 0.562.0
- **Gestures:** react-native-gesture-handler 2.30.0

---

## 📱 Current Features (P0 MVP Complete)

✅ **Authentication:** Google OAuth, Face ID/PIN, Supabase Auth  
✅ **Paywall:** 14-day free trial with RevenueCat, £149/year subscription  
✅ **Payments:** RevenueCat integration (purchase flow, restore purchases, entitlements)  
✅ **Home Screen:** Net Worth, Assets, Liabilities cards  
✅ **CRUD:** Add/Edit/Delete assets & liabilities  
✅ **Detail Screens:** Full lists with swipe gestures  
✅ **Modals:** 2-step flow (type picker → specific form)  
✅ **Settings:** Currency switcher, Sign Out, GDPR-compliant Delete Account, Restore Purchases  
✅ **Charts:** Horizontal bar charts (category breakdown)  
✅ **Data:** AsyncStorage persistence (auto-save), encrypted cloud backups

---

## 🎯 Recent Additions

### **RevenueCat Integration** ✅ COMPLETE
- Full subscription management with RevenueCat SDK
- Apple In-App Purchase integration (14-day trial, £149/year)
- Purchase flow with error handling (cancellations, failures)
- Restore purchases functionality
- Entitlement checking (premium access control)
- Sandbox testing complete (verified successful purchases)
- Smart user identification (only identifies when user changes)
- Cross-device subscription support

### **Email/Password Authentication** ✅ NEW
- Full email/password sign-up and sign-in flow
- Email validation and password strength checking (8+ chars)
- Show/hide password toggle
- Comprehensive error handling (duplicate email, wrong password, etc.)
- Modal-based UI matching existing design system
- Switch between sign-up and sign-in seamlessly

### **Paywall & Trial Management**
- 14-day free trial flow (sign up → paywall → purchase)
- RevenueCat manages subscription state (no local storage)
- AuthGuard routing based on premium status
- Background user identification (doesn't block UI)

### **GDPR-Compliant Account Deletion**
- Complete data erasure (cloud + local)
- Supabase Edge Function with admin privileges
- Deletes: auth user, user profile, backups, local data, PIN, RevenueCat user ID
- Token state management for reliable deletion
- Comprehensive error handling with timeouts

---

## ⚠️ Known Issues (For Next Developer)

### **Issue 1: Paywall Flash on App Reload** 🔴 ACTIVE
**Symptom:** Reopening app shows paywall briefly before PIN entry

**Expected:** Direct to PIN entry (like Google OAuth does perfectly)

**Investigation:**
- RevenueCat initialization takes 100-500ms to load cached customer info
- During this time, `isPremium = false` → AuthGuard shows paywall
- When customer info loads, `isPremium = true` → Routes to PIN

**Files to Check:**
- `utils/useRevenueCat.ts` (lines 40-80) - Initialization
- `app/_layout.tsx` (lines 30-60) - AuthGuard routing logic
- RevenueCat SDK docs - Check for synchronous cached customer info

**Potential Solutions:**
1. Check if RevenueCat has `getCachedCustomerInfo()` synchronous method
2. Add minimum wait time in AuthGuard before routing
3. Set initial `customerInfo` from SDK cache before async load

---

### **Issue 2: PIN Screen Flickering After Purchase** 🟡 ACTIVE
**Symptom:** After purchase, PIN screen flickers/refreshes requiring double PIN entry

**Expected:** Single smooth PIN entry

**Investigation:**
- After purchase, `isPremium` changes `false → true`
- May cause AuthGuard or PIN screen to remount
- Subscription state update triggers re-render

**Files to Check:**
- `app/_layout.tsx` (lines 60-80) - Post-paywall routing
- `app/auth.tsx` - Check if component remounts on state change
- `app/paywall.tsx` - Navigation timing after purchase

**Potential Solutions:**
1. Add `useRef` in auth.tsx to prevent duplicate PIN checks
2. Add delay before navigation after purchase
3. Check useEffect dependencies causing remount

---

### **Issue 3: Face ID Screen Flickering** 🟡 MINOR
**Symptom:** Face ID enable screen flickers on new account creation

**Likely Related To:** Issue 2 (state changes causing remount)

---

### **Issue 4: Brief Paywall on Account Deletion** 🟢 MINOR
**Symptom:** 2-second paywall flash when deleting account

**Severity:** Low (rare operation, user expects delay anyway)

---

## 🔜 Next Up (P1 Features - Priority Order)

### 1. Apple OAuth 🔴 CRITICAL
**Goal:** Enable Apple sign-in (App Store requirement)  
**What to do:**
- Enable Apple provider in Supabase Dashboard
- Add Service ID and key from Apple Developer
- Test sign-in flow (code already implemented)

**Current state:** Code complete, needs Supabase configuration  
**Effort:** 5-10 minutes  
**Blocker:** App Store will reject without this

---

### 2. Email/Password Authentication
**Goal:** Alternative auth for privacy-conscious users  
**What to build:**
- Create email sign-up/sign-in modals
- Use Supabase email auth
- Add email verification flow

**Current state:** Button shows "Coming Soon"  
**Effort:** 4-6 hours

---

### 3. Stock Tracking (Twelve Data API)
**Goal:** Let users manually add stock holdings with live prices  
**What to build:**
- Create `AddStockModal.tsx` (ticker input, quantity, manual price)
- Integrate Twelve Data API for live price fetching
- Add portfolio type to asset categories
- Display portfolio breakdown on home screen

**Current state:** Manual "Other" assets only

---

### 3. Bank Connections (TrueLayer OAuth)
**Goal:** Read-only UK bank account balance fetching  
**What to build:**
- TrueLayer OAuth flow (similar to Google OAuth)
- Bank selection UI
- Auto-refresh mechanism (24-hour cycle)
- Secure token storage in SecureStore

**Current state:** Manual bank entry only

---

### 4. Performance Chart
**Goal:** Net worth over time visualization  
**What to build:**
- Historical snapshots table in Supabase
- Line chart component (react-native-chart-kit)
- Time range selector (1M, 3M, 6M, 1Y, All)

**Current state:** No historical tracking

---

### 5. TestFlight Beta
**Goal:** Distribute to beta testers  
**What to do:**
- Build with EAS: `eas build --platform ios`
- Submit to App Store Connect
- Create TestFlight internal group
- Gather feedback and iterate

**Pre-Launch Checklist:**
- [ ] Enable Apple OAuth in Supabase (App Store requirement)
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
