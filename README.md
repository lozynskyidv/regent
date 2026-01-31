# WorthView

**Everything you own and owe, in one place.**

Track your complete net worth across stocks, crypto, property, bank accounts, and all assets. Simple, clear, and private.

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

---

## License

Copyright © 2026 WorthView

---

**Built simple and clear.** 🎯
