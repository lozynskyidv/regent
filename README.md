# WorthView

**Everything you own and owe, in one place.**

Track your complete net worth across stocks, crypto, property, bank accounts, and all assets. Simple, clear, and private.

---

## 🚨 Current Status

**Version:** 1.0.0 (Build 14)  
**TestFlight:** Build 14 submitted (Feb 9, 2026)  
**App Store:** Rejected (Build 7) - **Blocked by critical bugs**  
**Last Updated:** February 9, 2026

### 🔴 CRITICAL ISSUES BLOCKING LAUNCH

**❌ Apple Sign In Name Bug (Builds 10-14)**
- **Status:** UNRESOLVED after 5 build attempts
- **Problem:** App shows "User" instead of real name from Apple account
- **Impact:** Poor UX, likely App Store rejection
- **Cause:** Race condition between auth state and profile sync
- **Documentation:** See `APPLE_SIGNIN_NAME_ISSUE.md` for complete analysis
- **Recommendation:** Implement manual name input screen (30 min fix)

**❌ Performance Chart Date Bug**
- **Status:** UNRESOLVED
- **Problem:** Chart shows future dates (e.g., "Feb 26" when today is Feb 9)
- **Impact:** Confusing, unprofessional appearance
- **Cause:** Likely timezone parsing issue
- **Documentation:** See `CHART_DATE_BUG.md` for investigation
- **Recommendation:** Store dates as YYYY-MM-DD strings (15 min fix)

**⚠️ Subscription Not Configured**
- **Status:** Not started
- **Problem:** In-app purchase not set up
- **Impact:** Users cannot subscribe
- **Fix:** Configure App Store Connect + RevenueCat (~45 min)

### Recent Build History (Feb 6-9, 2026)

**Build 14** (Feb 9) - Pass name in signInWithIdToken options - **FAILED** ❌  
**Build 13** (Feb 7) - Direct database upsert - **FAILED** ❌  
**Build 12** (Feb 7) - Debug UI in Settings - **FAILED** ❌  
**Build 11** (Feb 6) - Diagnostic logging - Confirmed name extraction works ✅  
**Build 10** (Feb 6) - Basic metadata update - **FAILED** ❌  
**Build 9** (Feb 6) - Fixed nonce bug - **SUCCESS** ✅  
**Build 8** (Feb 5) - Native Apple auth, iPad support - **SUCCESS** ✅  
**Build 7** (Feb 4) - **REJECTED** by App Store ❌

### Next Steps (Priority Order)

**🔴 CRITICAL - Fix Blocking Bugs:**

1. **Implement Manual Name Input** (~30 min)
   - Add "What's your name?" welcome screen
   - Save to Supabase on sign-up/sign-in
   - Guaranteed to work, industry standard
   - See `APPLE_SIGNIN_NAME_ISSUE.md` for details

2. **Fix Chart Date Bug** (~15 min)
   - Store snapshots as YYYY-MM-DD strings
   - Fix timezone parsing
   - See `CHART_DATE_BUG.md` for investigation

3. **Configure In-App Purchase** (~45 min)
   - App Store Connect: Create worthview_annual product
   - RevenueCat: Add product, create offering
   - Test subscription flow

4. **Build 15 & Submit to App Store**
   - Test all three fixes on TestFlight
   - Resubmit to App Store with confidence

---

## Features

- **Complete Net Worth Tracking** - See all your assets and liabilities at a glance
- **Live Investment Prices** - Stocks, ETFs, crypto, and commodities with automatic daily updates
- **Interactive Charts** - Visualize your net worth over time with beautiful performance charts
- **Automatic Price Refresh** - Prices update automatically when you open the app (if >24h old)
- **Daily Snapshots** - Historical performance tracking with daily net worth snapshots
- **Privacy First** - Your data stays on your device, encrypted and secure
- **Face ID / PIN** - Biometric authentication for quick, secure access
- **Multi-Currency** - Support for GBP, USD, and EUR

---

## Website

**Live at:** [worthview.app](https://worthview.app) (deployed on Netlify)

The marketing website is a separate React/Vite/Tailwind project located at:
```
/Users/dmytrolozynskyi/Documents/Regent App/worthview-website/
```

**Website Features:**
- Landing page with hero section and app screenshot
- WorthView logo (WV monogram)
- Feature showcase
- Pricing information
- App Store download button (placeholder, ready for production link)

**Tech Stack:**
- React 19.1 + TypeScript
- Vite 5.4 (build tool)
- Tailwind CSS 3.4
- Deployed on Netlify with automatic deployments from GitHub
- Domain: `worthview.app` (Namecheap)

**Repository:** [github.com/lozynskyidv/worthview-website](https://github.com/lozynskyidv/worthview-website)

**Deployment:**
- Pushes to `main` branch automatically deploy to Netlify
- Build command: `npm run build`
- Output directory: `dist`

---

## Tech Stack

- **Platform:** iOS (React Native + Expo SDK 54)
- **Language:** TypeScript 5.9
- **Backend:** Supabase (auth, cloud backups)
- **Subscription:** RevenueCat + Apple In-App Purchase (£49/year, 7-day free trial)
- **Live Prices:** Twelve Data API
- **Storage:** AsyncStorage (local) + Supabase (encrypted backups)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios
```

---

## Project Structure

```
app/                    # Screens (Expo Router)
├── index.tsx          # Sign up / Sign in
├── auth.tsx           # PIN / Face ID setup
├── paywall.tsx        # Subscription screen
├── home.tsx           # Dashboard
├── assets-detail.tsx  # Asset list
├── liabilities-detail.tsx
└── settings.tsx       # Settings

components/            # UI components
├── PaywallScreen.tsx
├── NetWorthCard.tsx
├── AssetsCard.tsx
├── Add*Modal.tsx      # Asset/liability modals
└── Edit*Modal.tsx

contexts/
├── DataContext.tsx    # Global state
└── ModalContext.tsx   # Modal management

utils/
├── storage.ts         # AsyncStorage helpers
├── encryption.ts      # PIN hashing
├── supabase.ts        # Supabase client
└── useRevenueCat.ts   # Subscription management
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Required Setup

1. **Supabase Project** - For authentication and cloud backups
2. **RevenueCat Account** - For subscription management
3. **Apple Developer Account** - For App Store distribution
4. **Twelve Data API Key** - For live investment prices (optional)

---

## Building for Production

### TestFlight

```bash
# Build for iOS
eas build --platform ios

# Submit to TestFlight
eas submit --platform ios
```

### App Store

Submit via App Store Connect when ready for production.

---

## Additional Resources

### App Store Icons
Located at `/Users/dmytrolozynskyi/Documents/Regent App/WorthView/app-store-icons/`
- Contains WorthView logo component (WV monogram)
- Icon showcase for generating all required sizes
- See folder README for export instructions

### Documentation
- **README.md** - Project overview and current status
- **PROJECT_CONTEXT.md** - Complete project context and configuration details

---

## License

Copyright © 2026 WorthView

---

**Built simple and clear.** 🎯
