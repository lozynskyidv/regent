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

## License

Copyright © 2026 WorthView

---

**Built simple and clear.** 🎯
