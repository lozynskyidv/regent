# WorthView

**Everything you own and owe, in one place.**

Track your complete net worth across stocks, crypto, property, bank accounts, and all assets. Simple, clear, and private.

---

## 🚨 Current Status

**Version:** 1.0.0 (Build 10)  
**TestFlight:** Build 10 ready for submission  
**App Store:** Rejected (Build 7) - **Build 10 ready for resubmission**  
**Last Updated:** February 6, 2026

### Latest Changes (Build 10 - Feb 6, 2026)

**✅ Fixed Apple Sign In User Name:**
- **Problem:** App showed "User" instead of actual name from Apple account
- **Root Cause:** Not extracting and saving user's name from Apple credential
- **Fix:** Extract `fullName` from Apple Sign In and save to Supabase user metadata
- **Result:** App now displays user's real name (e.g., "J. Rothschild")
- **Note:** Name only available on FIRST Apple Sign In (Apple privacy feature)

### Recent Work (Builds 8-9)

**✅ Build 8 Completed:**
- Implemented native Apple authentication (`expo-apple-authentication`)
- Enabled iPad support (reviewer tested on iPad Air)
- Implemented automatic daily price refresh on app launch/foreground
- Fixed flat performance chart issue
- Added comprehensive logging for debugging
- Incremented build: 7 → 8

**✅ Build 9 Completed:**
- Fixed Apple Sign In nonce bug
- Enhanced error logging and messages
- Incremented build: 8 → 9
- Successfully submitted to TestFlight

**✅ Build 10 In Progress:**
- Fixed user name not appearing after Apple Sign In
- Extract and save Apple user's full name to Supabase
- Incremented build: 9 → 10

**⚠️ Still Outstanding:**
1. **Subscription Not Available:** In-app purchase not configured (see PROJECT_CONTEXT.md)

### Next Steps (Priority Order)

**🟢 IMMEDIATE - Build & Test Build 10:**
1. **Build for TestFlight:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Test Apple Sign In on TestFlight:**
   - **IMPORTANT:** Delete app and reinstall (Apple only sends name on FIRST sign in)
   - Tap "Continue with Apple"
   - Complete Face ID authentication
   - ✅ Should show your real name (e.g., "J. Rothschild")
   - Verify session persists on app restart

3. **If successful, resubmit to App Store:**
   - Reply to App Store rejection
   - Include: "Build 10 fixes Apple Sign In with native authentication and user profile"
   - Submit for App Review

**🔴 BEFORE PRODUCTION:**
4. **Configure In-App Purchase:**
   - Product ID: `worthview_annual`
   - Price: £49.99/year, 7-day trial
   - Configure RevenueCat Dashboard

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
