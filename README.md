# WorthView

**Everything you own and owe, in one place.**

Track your complete net worth across stocks, crypto, property, bank accounts, and all assets. Simple, clear, and private.

---

## 🚨 Current Status

**Version:** 1.0.0 (Build 8)  
**TestFlight:** Build 7 active  
**App Store:** Rejected (Build 7) - **Build 8 ready with fixes**  
**Last Updated:** February 5, 2026

### Latest Rejection (Feb 4, 2026)
- **Issue:** Apple Sign In not working (tested on iPad Air 11-inch M3)
- **Fix:** ✅ Implemented native Apple authentication
- **Status:** Ready to build & resubmit
- **Details:** See `APPLE_SIGNIN_FIX.md`

### Recent Work (Feb 5, 2026)

**✅ Completed:**
- **Fixed Apple Sign In rejection** - Implemented native Apple authentication
- **Fixed flat chart issue** - Implemented automatic daily price refresh on app launch
- Enabled iPad support (reviewer tested on iPad Air)
- Added `expo-apple-authentication` for native iOS Sign in with Apple
- Replaced web-based OAuth with native authentication flow
- Added AppState listener for automatic price refresh when app opens/foregrounds
- Prices now refresh automatically if >24 hours old
- Daily snapshots create historical performance chart data
- Incremented build number to 8
- Previous fixes: App icons, demo account, EAS auto-submit

**⚠️ Still Outstanding:**
1. **Subscription Not Available:** In-app purchase not configured - NEEDS ACTION (see `SUBSCRIPTION_SETUP.md`)

### Next Steps (Priority Order)

**🟢 IMMEDIATE - Build 8 (Apple Sign In Fix):**
1. **Install new dependency:**
   ```bash
   npm install
   ```

2. **Build 8 with native Apple Sign In:**
   ```bash
   eas build --platform ios --profile production --auto-submit
   ```

3. **Test on TestFlight (MUST test on physical device):**
   - Install Build 8 from TestFlight
   - Test "Continue with Apple" (should show native Apple Sign In sheet)
   - Test on iPad if possible (reviewer used iPad Air)
   - Test demo account (dmy@gmail.com / 5Q69q25q)

4. **Reply to App Store rejection:**
   - Go to App Store Connect → Your App → App Review
   - Use the reply template in `APPLE_SIGNIN_FIX.md`
   - Inform Apple that Build 8 fixes the Apple Sign In issue

**🔴 STILL NEEDED - Before Production:**
5. **Configure In-App Purchase in App Store Connect**
   - Product ID: `worthview_annual`
   - Price: £49.99/year, 7-day trial
   - See: `SUBSCRIPTION_SETUP.md` for step-by-step guide

6. **Configure RevenueCat Dashboard**
   - Add product `worthview_annual`
   - Create "premium" entitlement
   - Create "Current" offering with annual package

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

See `APP_STORE_SUBMISSION_CHECKLIST.md` for complete submission guide.

---

## Additional Resources

### App Store Icons
Located at `/Users/dmytrolozynskyi/Documents/Regent App/WorthView/app-store-icons/`
- Contains WorthView logo component (WV monogram)
- Icon showcase for generating all required sizes
- See folder README for export instructions

### Documentation
- **App Store Checklist:** `APP_STORE_SUBMISSION_CHECKLIST.md`
- **Build & Ship Guide:** `BUILD_AND_SHIP.md`
- **Project Context:** `PROJECT_CONTEXT.md`

### 🆘 Troubleshooting Guides (NEW)
- **SUBSCRIPTION_SETUP.md** - Fix "subscription not available" error
- **TESTFLIGHT_FIX.md** - Why builds weren't showing in TestFlight
- **create-demo-account.sh** - Script to create Apple review demo account

---

## License

Copyright © 2026 WorthView

---

**Built simple and clear.** 🎯
