# WorthView

**Everything you own and owe, in one place.**

Track your complete net worth across stocks, crypto, property, bank accounts, and all assets. Simple, clear, and private.

---

## 🚨 Current Status

**Version:** 1.0.0 (Build 6)  
**TestFlight:** Active (Build 5 live, Build 6 pending)  
**App Store:** Rejected - resubmitting with fixes  
**Last Updated:** January 31, 2026

### Recent Work (Jan 31, 2026)

**✅ Completed:**
- Fixed app icon issue (regenerated WV monogram icons)
- Configured EAS auto-submit to TestFlight
- Incremented build number to 6
- Created demo account for Apple review (dmy@gmail.com)
- Updated eas.json for proper build number tracking

**⚠️ Critical Issues Found:**
1. **App Icons Missing:** Build 5 had placeholder icons - FIXED, ready for Build 6
2. **Subscription Not Available:** In-app purchase not configured - NEEDS ACTION

### Next Steps (Priority Order)

**🔴 CRITICAL - Before Next Build:**
1. **Configure In-App Purchase in App Store Connect**
   - Product ID: `worthview_annual`
   - Price: £49.99/year, 7-day trial
   - Submit for review
   - See: `SUBSCRIPTION_SETUP.md` for step-by-step guide

2. **Configure RevenueCat Dashboard**
   - Add product `worthview_annual`
   - Create "premium" entitlement
   - Create "Current" offering with annual package

**🟡 THEN - Build & Submit:**
3. **Build 6 with proper icons:**
   ```bash
   eas build --platform ios --profile production --auto-submit
   ```

4. **Test on TestFlight:**
   - Verify WV icon appears
   - Test demo account login (dmy@gmail.com / 5Q69q25q)
   - Test subscription flow (after IAP configured)

5. **Submit Build 6 for App Store Review**
   - Select Build 6 (not Build 5)
   - Add demo credentials to review notes
   - Reply to previous rejection

---

## Features

- **Complete Net Worth Tracking** - See all your assets and liabilities at a glance
- **Live Investment Prices** - Stocks, ETFs, crypto, and commodities with real-time data
- **Interactive Charts** - Visualize your net worth over time with beautiful performance charts
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
