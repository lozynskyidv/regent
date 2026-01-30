# Regent - Premium Net Worth Tracking

**Version:** 1.0.0 (Production Ready - TestFlight)  
**Platform:** iOS only (React Native + Expo)  
**Target:** Mass Affluent Professionals (£100k-£1m net worth)  
**Access:** £49/year subscription with 7-day free trial (via RevenueCat + Apple IAP)  
**Status:** 🚀 **LIVE ON TESTFLIGHT** - Ready for testing

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
- **Monetization:** RevenueCat (subscription management) + Apple In-App Purchase
- **Navigation:** Expo Router (file-based, `<Slot />` only)
- **State:** React Context API (DataContext, ModalContext)
- **Storage:** AsyncStorage (data) + SecureStore (sensitive) + Supabase (cloud backups)
- **Icons:** Lucide React Native 0.562.0
- **Gestures:** react-native-gesture-handler 2.30.0

---

## 📱 Current Features (P0 MVP Complete)

✅ **Subscription System:** £49/year with 7-day free trial (RevenueCat + Apple IAP) - **PRODUCTION KEYS**  
✅ **Paywall Screen:** Pixel-perfect UI matching web prototype, above-the-fold optimized  
✅ **Authentication:** Apple Sign In, Google OAuth, Email/Password, Face ID/PIN, Supabase Auth - **ALL WORKING**  
✅ **Empty State Onboarding:** Beautiful hero card for new users with NYC skyline  
✅ **Net Worth Card (Merged):** Hero card with integrated performance chart, count-up animation, interactive scrubbing  
✅ **Time Ranges:** 1M, 3M, 6M, 1Y, All (dynamic data sampling, 30-100 points)  
✅ **Haptic Feedback:** iOS tactile feedback on time range switches and chart scrubbing  
✅ **Portfolio Tracking:** Live prices for stocks, ETFs, crypto, commodities via Twelve Data API  
✅ **Pull-to-Refresh:** User-triggered price updates with smart caching + timestamp tracking  
✅ **Animations:** Smooth net worth count-up (0 → value) on load/refresh, spring physics  
✅ **CRUD:** Add/Edit/Delete assets & liabilities  
✅ **Detail Screens:** Full lists with swipe gestures  
✅ **Modals:** 2-step flow (type picker → specific form)  
✅ **Settings:** Currency switcher, Sign Out, GDPR-compliant Delete Account, Test Data Generator  
✅ **Charts:** Horizontal bar charts (category breakdown), interactive performance chart  
✅ **Data:** AsyncStorage persistence (auto-save), encrypted cloud backups, historical snapshots

---

## 🎯 Recent Changes (January 2026)

### **🎯 Paywall Timing - 7-Second "Aha Moment"** ✅ PRODUCTION READY (v0.9.9 - January 28, 2026)

**Improved onboarding: Users see their data for 7 seconds before paywall appears**

**What Changed:**
- ✅ **7-Second Delay:** Paywall appears 7 seconds after user sees their net worth (aha moment!)
- ✅ **Better UX:** Users experience product value before being asked to subscribe
- ✅ **Updated Flow:** Sign up → PIN → Home → Add first asset → **See data for 7 seconds** → Paywall
- ✅ **State Management:** Added `markPaywallSeen()` function and timer tracking

**Technical Changes:**
- Moved paywall trigger from `DataContext.addAsset()` to `app/home.tsx`
- Added `useEffect` hook with 7-second timer in home screen
- Fixed timer bug: Removed state from dependency array to prevent premature cleanup
- Added comprehensive debug logging

**User Flow:**
1. User adds first asset and modal closes
2. User sees their net worth card populated with real data (aha moment! 🎉)
3. 7-second timer counts down silently
4. Paywall appears with subscription offer
5. User starts trial or subscribes

---

### **🎨 UI/UX Refinements - Design System Alignment** ✅ PRODUCTION READY (v0.9.8 - January 28, 2026)

**Comprehensive visual polish across all screens to match paywall's refined design-sense**

**Paywall Improvements:**
- ✅ **Removed Face ID Card:** Native iOS purchase dialog handles Face ID automatically (cleaner UX)
- ✅ **Typography Precision:** All font sizes, weights, and letter spacing now match web prototype exactly
- ✅ **Above-the-Fold Optimization:** 80-90% of content fits on one screen (only legal text scrolls)
- ✅ **Reduced Benefits:** 5 → 3 key benefits for focused messaging
- ✅ **Price Update:** £149/year → **£49/year** (more accessible pricing)

**Home Screen Improvements:**
- ✅ **Typography Hierarchy:** User name (14px → 17px), "Overview" (32px → 28px), timestamp opacity improved
- ✅ **Consistent Spacing:** 24px rhythm between all cards (was mixed 16px/24px)
- ✅ **NET WORTH Card Enhancement:**
  - Label size: 12px → 13px (more readable)
  - Main value: 48px → 44px (refined scale)
  - Card padding: 24px → 28px (more breathing room)
  - Shadow depth increased for visual prominence
- ✅ **Assets/Liabilities Cards:**
  - Label: 15px → 16px
  - Total: 24px → 28px (emphasize amounts)
  - List items: 16px → 15px, values now weight 500 (clearer hierarchy)
  - Padding: 32px → 24px (consistent with other cards)
- ✅ **Empty State Polish:** Better spacing, refined typography, improved message box styling

**Design-Sense Achievement:**
- Deliberate typographic scale (13px → 14-17px → 28-44px)
- Consistent 24px vertical rhythm across all cards
- NET WORTH card visually dominant (larger padding, stronger shadow)
- Professional, refined feel matching paywall quality

**Technical Changes:**
- Updated `app/home.tsx` typography and spacing
- Refined `components/NetWorthCard.tsx` styling
- Polished `components/AssetsCard.tsx` and `components/LiabilitiesCard.tsx`
- Aligned `components/PaywallScreen.tsx` with web prototype pixel-perfectly

---

### **💰 Subscription System Implementation** ✅ INTEGRATION READY (v0.9.7 - January 27, 2026)

**Removed invite-only system, implemented £49/year subscription with RevenueCat**

**Major Changes:**
- ❌ **Removed Invite System:** Deleted ShareInviteCard, invite code screens, invite validation
- ✅ **Added Subscription Flow:** £49/year with 7-day free trial via RevenueCat
- ✅ **Paywall Screen:** Beautiful UI 100% matching web prototype design
- ✅ **Purchase & Restore:** Full RevenueCat integration with Apple In-App Purchase
- ✅ **Auth Flow Updated:** PIN entry → Paywall → Home (subscription check)

**Implementation:**
- Created `PaywallScreen.tsx` component (pixel-perfect match to web prototype)
- Integrated `react-native-purchases` SDK (RevenueCat)
- Updated `AuthGuard` to remove invite validation
- Added subscription state tracking to `DataContext`

**Next Steps Required:**
1. Configure RevenueCat dashboard (see `SUBSCRIPTION_SETUP.md`)
2. Create In-App Purchase product in App Store Connect (£49/year, 7-day trial)
3. Link RevenueCat to App Store Connect
4. Test purchase flow with sandbox account
5. Submit app with IAP for App Store review

**Unit Economics:**
- Revenue: £49/year (£4.08/month)
- Costs: ~£1.78/month (Twelve Data + Supabase)
- Margin: ~56% gross profit

---

### **🔐 Privacy & UX Bug Fixes** ✅ PRODUCTION READY (v0.9.6 - January 27, 2026)

**Critical privacy fix and chart scrubbing improvements**

**Privacy Fix:**
- 🔴 **CRITICAL:** Sign out now clears ALL data (financial data + PIN)
- **Issue:** User A signs out → User B signs in → User B sees User A's data
- **Fix:** Complete data wipe on sign out (auth, financial data, PIN, React state)
- **Impact:** Prevents data leakage when multiple users share the same device

**UX Bug Fixes:**
- ✅ **Chart Scrubbing:** Main net worth number now updates when dragging on chart
- ✅ **Optimal Data Density:** Balanced data points (30-100) for smooth charts without overcrowding

**Technical Changes:**
- Updated `signOut()` to call `clearAllData()` and clear PIN from SecureStore
- Fixed net worth display to show historical value during scrubbing: `selectedPointIndex !== null ? chartDisplayValue : displayValue`
- Optimized data sampling: 1M=30pts, 3M=45pts, 6M=60pts, 1Y=52pts, All=100pts

---

### **📊 Merged Net Worth Card with Integrated Performance** ✅ PRODUCTION READY (v0.9.5 - January 27, 2026)

**Single hero card combining net worth display with interactive performance chart**

**Major UX Improvement:**
- ✅ **Eliminated Redundancy:** Removed separate Net Worth and Performance Chart cards
- ✅ **Unified Metrics:** All information (value, change, percentage, period) in one place
- ✅ **No Contradiction:** Everything synced to selected time range (no YTD vs 1M confusion)
- ✅ **Added Time Ranges:** 6M (6 months) and All (complete history)
- ✅ **Removed YTD:** Eliminated confusing Year-to-Date option
- ✅ **Haptic Feedback:** iOS tactile response on interactions

**New Card Structure:**
```
NET WORTH
£263,020
↑ £89,987 (+52.0%)    ← Both absolute and percentage together
All time              ← Time period label

[Interactive Chart]   ← Custom SVG with gradient fill

1M | 3M | 6M | 1Y | All  ← 5 time range options
```

**Benefits:**
- Reduces visual clutter (2 cards → 1 hero card)
- Increases information density without complexity
- Matches modern fintech UX patterns (Robinhood, Coinbase)
- Better visual hierarchy (clear focal point)
- Faster comprehension (everything in one glance)

**Technical Implementation:**
- Merged `NetWorthCard.tsx` and `PerformanceChart.tsx`
- Deleted old `PerformanceChart.tsx` component
- Added `expo-haptics` for iOS tactile feedback
- Updated home screen to use single merged component

---

### **📊 Custom SVG Performance Chart** ✅ COMPLETE (v0.9.4 - January 27, 2026)

**Interactive chart with instant touch response and smooth tracking**

**Key Features:**
- ✅ **Custom SVG Implementation:** Full control over rendering, animations, and interactions
- ✅ **Gradient Fill:** Beautiful gradient under line (matches web prototype)
- ✅ **Instant Dot Response:** 0ms delay on tap, bypasses throttle for immediate feedback
- ✅ **Smooth 60fps Tracking:** Throttled updates during drag for optimal performance
- ✅ **Bezier Curves:** Smooth cubic interpolation for professional appearance
- ✅ **Fractional Position Interpolation:** Smooth movement between data points
- ✅ **Gesture Coordination:** Proper touch handling with react-native-gesture-handler

**How It Works:**
```typescript
// Worklet-based gesture handling
Gesture.Pan()
  .onStart((event) => {
    // Calculate position on UI thread (fast)
    // Set position via runOnJS (bypasses throttle for instant response)
    runOnJS(handleGestureStart)(snappedIndex, clampedFractional);
  })
  .onUpdate((event) => {
    // Throttled updates at 60fps during drag
    runOnJS(handleGestureUpdate)(snappedIndex, clampedFractional, timestamp);
  })
```

**Technical Implementation:**
- **Thread Coordination:** Gesture.Pan() callbacks are worklets (UI thread), bridged to JS thread via runOnJS
- **Instant Appearance:** Direct setValue() for dot opacity/scale (no animation delay)
- **Smooth Tracking:** Fractional position interpolation provides smooth movement
- **Performance:** Calculations on UI thread, state updates throttled to 60fps
- **Accurate Boundaries:** onLayout measurement ensures dot stays within chart area

**Result:** Professional-grade interactive chart with instant response and pixel-perfect accuracy.

---

### **📊 Performance Chart - Critical UX Fixes** ✅ COMPLETE (v0.9.2 - January 26, 2026)

**What We Fixed:**

**1. ScrollView Gesture Conflict (RESOLVED)**
- ✅ Implemented dynamic ScrollView disabling when chart is touched
- ✅ Page freezes when dragging on chart (no more accidental scrolls)
- ✅ Scrolling resumes automatically when touch ends
- ✅ 100% reliable gesture isolation

**Technical Implementation:**
```typescript
// Chart touch starts → Disable ScrollView
onChartTouchStart={() => setScrollEnabled(false)}
// Chart touch ends → Enable ScrollView  
onChartTouchEnd={() => setScrollEnabled(true)}
```

**2. Improved Data Granularity**
- ✅ Dynamic max points per time range (30-50 points)
- ✅ 1M: Daily data points (30 points)
- ✅ 3M: Every 2 days (45 points)
- ✅ YTD/1Y: High-resolution (50 points)
- ✅ Smoother charts, better scrubbing experience

**3. Precise Date Labels**
- ✅ 1M: "15 Jan", "16 Jan" (daily precision)
- ✅ 3M: "1 Jan", "8 Jan" (every 2 days)
- ✅ 1Y: "15 Jan", "22 Jan" (weekly with day)
- ✅ YTD: "Jan", "Feb" (monthly for clean x-axis)
- ✅ No more repeated "Jun 25" for different dates

**User Experience Before → After:**
- ❌ Dragging chart scrolls page → ✅ Perfect gesture isolation
- ❌ Choppy line (10 points) → ✅ Smooth curve (30-50 points)
- ❌ Ambiguous dates ("Jun 25") → ✅ Specific dates ("15 Jun")

---

### **📈 Net Worth Card - YTD Percentage Context** ✅ COMPLETE (v0.9.1 - January 26, 2026)

**What We Added:**
- ✅ **YTD Percentage Display:** Shows year-to-date growth/decline (e.g., "↑ 21.2% this year")
- ✅ **Color-Coded Feedback:** Green for gains (↑), red for losses (↓)
- ✅ **Smart Calculation:** Uses earliest snapshot from current calendar year
- ✅ **Contextual Information:** Answers "Am I winning?" at a glance
- ✅ **Minimal Design:** Small, muted text that doesn't compete with main number

**User Experience:**
```
NET WORTH
£262,733
↑ 21.2% this year    ← NEW!
```

**Why This Matters:**
- Adds context without clutter (single line, 13px text)
- No scrolling needed to see performance
- Aligns with modern finance app standards (Robinhood, Coinbase)
- YTD period is meaningful and calendar-aligned
- Reinforces Net Worth as the hero metric while providing growth context

**Technical Implementation:**
- Calculates YTD from snapshots (January 1st to now)
- Handles edge cases (no data, zero start value)
- Dynamic color (green/red based on positive/negative)
- Graceful for Day 1 users (only shows if data available)

---

### **📊 Performance Chart - Interactive MVP** ✅ COMPLETE (v0.9.0 - January 26, 2026)

**What We Built:**
- ✅ **Interactive Line Chart:** Tap + drag to scrub through historical values
- ✅ **BitBox-Style Layout:** Current value + change + percentage + time period (all in one card)
- ✅ **Smooth Animations:** Spring physics for number counting, scale micro-interactions
- ✅ **Animated Metrics:** Numbers count up/down smoothly when scrubbing (0.98x → 1.02x pulse)
- ✅ **Time Range Selector:** 1M, 3M, YTD, 1Y with 600ms fade transitions
- ✅ **Day 1 Empty State:** Pixel-perfect match to web-prototype (current value + dot + message)
- ✅ **Test Data Generator:** Settings screen button to generate 2 years of historical data
- ✅ **Historical Snapshots:** Support for 730+ data points with smart sampling

**User Experience:**
- Tap + drag horizontally on chart → Values update in real-time
- Release → Smooth return to current value (fade animation)
- Switch time ranges → Smooth fade out/in transitions
- Numbers animate between values (spring physics)
- Scale feedback on touch (feels responsive)

**Technical Implementation:**
- `react-native-chart-kit` for line chart rendering
- `PanResponder` for smooth scrubbing gesture
- `Animated.Value` for number interpolation
- Spring animations (tension: 100, friction: 10)
- 10-point sampling for readability
- `generateTestSnapshots.ts` utility for test data

**Status:** ✅ All issues resolved - chart is production ready with instant touch response

---

### **✨ UX Polish & Timestamp System** ✅ COMPLETE (v0.8.1 - January 16, 2026)

**What We Built:**
- **Net Worth Count-Up Animation:** Smooth 0 → value animation (500ms, ease-out cubic)
- **Persistent Timestamp System:** "Updated X ago" now accurate across app restarts
- **Hybrid Time Display:** Relative time (<24h) → Absolute time (≥24h with clock time)
- **Commodity Symbol Fix:** Corrected all 20 commodity symbols to forex pair format (XAU/USD, XAG/USD, etc.)

**Technical Implementation:**
- React Native Animated API for 60fps count-up animation
- AsyncStorage persistence for last data sync timestamp
- Auto-updates timestamp on: app open, data changes, pull-to-refresh
- Animation triggers on pull-to-refresh even when net worth unchanged (key prop pattern)

**User Experience:**
- Net worth animates from £0 → £480,000 on every screen load/refresh
- Timestamp shows: "Updated just now" → "Updated 15m ago" → "Updated yesterday at 4:26 PM"
- Commodities now fetch correct prices (Gold ~$2,700/oz, not $41)
- Banking shows accurate "Cash, savings, checking accounts" description

---

### **📈 Portfolio Tracking with Live Prices** ✅ COMPLETE (v0.8.0 - January 16, 2026)

**Major UX Improvement:** Split "Investment Portfolio" into 4 specific asset types for clarity

**What We Built:**
- **4 Separate Investment Types:** Stocks, Crypto, ETFs, Commodities (each with dedicated modal)
- **Searchable Dropdown:** 130+ popular symbols with instant search (no typos!)
- **Live Price Fetching:** Twelve Data API integration with 800 calls/day free tier
- **Smart Caching:** 1 hour for stocks/ETFs/commodities, 30 min for crypto
- **Pull-to-Refresh:** Manual price updates on home screen (all investment types)
- **Auto-Formatting:** Crypto pairs auto-format (BTC → BTC/USD) during price fetch
- **USD Pricing:** All investments stored and displayed in USD (not user's primary currency)
- **Multi-Holding Support:** Add multiple tickers per investment (e.g., 3 stocks in one portfolio)

**User Flow:**
1. Tap "+ Add Asset" → See: Stocks, Crypto, ETFs, Commodities (all with "Live prices" badges)
2. Select type → Enter name + tap ticker field
3. **Dropdown shows top 10 popular symbols** (or search by typing)
4. Select symbol OR type custom ticker → Prices auto-fetch after 800ms
5. Enter quantity → Save → Asset appears in net worth
6. Pull-to-refresh home screen → All investments update

**Supported Assets:**
- **Stocks:** AAPL, MSFT, TSLA, GOOGL, NVDA, etc.
- **Crypto:** BTC/USD, ETH/USD, SOL/USD, etc. (auto-formats from BTC)
- **ETFs:** SPY, QQQ, VOO, VTI, IVV, etc.
- **Commodities:** GOLD, SILVER, OIL, COPPER, etc.

**Technical Implementation:**
- **Modals:** `AddStocksModal.tsx`, `AddCryptoModal.tsx`, `AddETFsModal.tsx`, `AddCommoditiesModal.tsx`
- **Dropdown:** `SymbolSearchInput.tsx` (reusable component with instant search)
- **Data:** `PopularSymbols.ts` (50 stocks, 30 crypto, 30 ETFs, 20 commodities)
- **Edge Function:** `fetch-asset-prices` with `forceRefresh` support
- **Database:** `asset_prices` table for caching (migration `005`)
- **Types:** Extended `AssetType` to include `stocks`, `crypto`, `etf`, `commodities`

**Cost Optimization:**
- Free tier: 800 API calls/day
- With caching: Supports 10+ active users
- User-triggered updates only (no background jobs)
- Estimated usage: ~100-175 calls/day for 10 users

**Critical Fixes Applied:**
- ✅ Force fresh prices (`forceRefresh: true`) to bypass corrupted cache
- ✅ USD pricing for all investments (not user's primary currency)
- ✅ Auto-formatting happens during price fetch (not on blur/interrupting UX)
- ✅ Pull-to-refresh recognizes all investment types (not just legacy 'portfolio')
- ✅ Fixed JSX syntax errors with dollar signs
- ✅ Searchable dropdown: Clean UI (no double icons), proper ticker selection, no React Native warnings

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
**Symptom:** Face ID enable screen may flicker on new account creation  
**Severity:** Low (cosmetic, happens only on first sign-up)

---

## 🚀 Current Status: TestFlight Beta

✅ **Build 1.0.0 (1)** - Submitted to TestFlight (January 30, 2026)  
✅ **Apple OAuth** - Production ready, configured in Supabase  
✅ **RevenueCat** - Production iOS SDK key installed  
✅ **Performance Chart** - Custom SVG with gradient fill and interactive scrubbing  
🧪 **Testing Phase** - Verifying Apple Sign In and subscription flow

**TestFlight Link:** https://appstoreconnect.apple.com/apps/6758517452/testflight/ios

---

## 🧪 Testing Checklist

### **Critical Tests (Pre-App Store):**
- [ ] Apple Sign In authentication flow
- [ ] RevenueCat subscription purchase (£49/year)
- [ ] Face ID/PIN setup and authentication
- [ ] Portfolio live price updates
- [ ] Data persistence across sessions
- [ ] Sign out and sign back in
- [ ] Account deletion (GDPR compliance)

### **Pre-Launch Checklist:**
- [x] Fix performance chart gesture conflict
- [x] Add visual indicator dot to performance chart
- [x] Add gradient fill to performance chart
- [x] Enable Apple OAuth in Supabase
- [x] Replace RevenueCat test keys with production keys
- [x] Configure App Store Connect product
- [x] Build and submit to TestFlight
- [ ] Complete TestFlight testing
- [ ] Create App Store listing
- [ ] Submit for App Store review

---

## 🔜 Next Steps

### **1. TestFlight Testing** (Current)
- Test Apple Sign In thoroughly
- Test subscription purchases with sandbox accounts
- Verify all features work on real devices
- Fix any bugs discovered

### **2. App Store Submission** (Next)
- Prepare app screenshots
- Write app description and metadata
- Create privacy policy and support URL
- Submit for App Store review

### **3. Post-Launch** (Future)
- Monitor crash reports and user feedback
- Iterate based on real user behavior
- Plan P1 features (referrals, analytics, etc.)

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

## 🎯 Future Roadmap

### **P1: Post-Launch Enhancements**
- [ ] **Trial Reminders:** Push notification on Day 5 ("2 days left")
- [ ] **Onboarding Tutorial:** 3-step walkthrough for new users
- [ ] **Settings Enhancement:** Add "Manage Subscription" deep link
- [ ] **Analytics:** Track trial_started, trial_converted, churn events
- [ ] **Referral System:** "Invite friends" viral growth mechanic

### **P2: Advanced Features**
- [ ] **Monthly Subscription:** £14.99/month option alongside annual
- [ ] **Family Sharing:** Share subscription with up to 5 family members
- [ ] **Export Data:** PDF reports, CSV exports for tax filing
- [ ] **Investment Insights:** Performance attribution, sector allocation
- [ ] **Widgets:** iOS home screen widgets for quick net worth glance
- [ ] **Watch App:** Net worth on Apple Watch

### **P3: Long-Term Vision**
- [ ] **Android Version:** React Native codebase ready for Android
- [ ] **Wealth Projections:** "What if" scenarios and retirement planning
- [ ] **Tax Optimization:** Capital gains tracking and tax-loss harvesting
- [ ] **Financial Advisor Integration:** Share view-only access with advisors

---

## ⚠️ Critical Constraints

**iOS Only:** Test on physical device (Face ID, gestures)  
**Backend:** Supabase for auth, cloud backups, and account deletion (local-first design with cloud sync)  
**React 19 Issues:** Always use `<Slot />`, never `<Stack>` with `screenOptions`  
**Gestures:** Requires `GestureHandlerRootView` at app root

---

## 🐛 Known Issues

**Performance Chart:** ✅ ALL RESOLVED - Custom SVG implementation with instant touch response  
**Face ID in Expo Go:** Shows passcode (Expo Go limitation, works in standalone build)  
**Currency:** Symbol-only change (no conversion yet)

---

## 📚 Documentation

| Doc | Purpose | When to Use |
|-----|---------|-------------|
| **`PROJECT_CONTEXT.md`** | Self-sufficient quick reference | **Start here, use 95% of the time** |
| **`REGENT_CURSOR_SPEC.md`** | Complete product specification | Complex integrations only (RevenueCat, etc.) |
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
