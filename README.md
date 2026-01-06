# Regent - Premium Net Worth Tracking

**Version:** 0.1.0 (MVP Phase)  
**Platform:** iOS (React Native + Expo)  
**Target:** Mass Affluent Professionals (£100k-£1m net worth)

---

## 📖 Documentation Overview

**New to this project? Start here:**

1. **`AI_CONTEXT.md`** ← START HERE for quick orientation (5 min read)
2. **`README.md`** ← This file - Technical implementation guide
3. **`REGENT_CURSOR_SPEC.md`** ← Complete product specification (comprehensive)
4. **`CHANGELOG.md`** ← What's been built, week by week

---

## 🎯 Project Vision

Regent is a **premium iOS net worth tracking app** that combines:
- **Uber-like modernism** (clean, spacious, fast)
- **JPM private banking restraint** (sophisticated, discreet)
- **Muted warmth** (NYC/London cityscapes, never cold or sterile)

**Core Value:** Financial clarity for discerning professionals who value discretion over gamification.

---

## 🏗️ Current Implementation Status

### ✅ COMPLETE (Week 1)

**Authentication & Onboarding**
- Sign Up screen with cityscape background (edge-to-edge design)
- Google OAuth UI (ready for integration)
- Face ID authentication with auto-trigger
- PIN entry fallback (4-digit numeric keypad)
- Navigation flow: Sign Up → Auth → Home

**Design System**
- Complete color palette (premium, muted)
- Typography hierarchy (6 levels)
- Spacing scale (4pt base unit)
- Layout system (border radius, shadows)
- All constants exported from `/constants/`

**Data Architecture**
- TypeScript interfaces for all data models
- Asset, Liability, User types defined
- SubscriptionState, AuthState structures
- Currency, AssetType, LiabilityType enums

**Developer Experience**
- Expo Router (file-based routing)
- TypeScript strict mode
- Modular folder structure
- Comprehensive documentation

### 🚧 IN PROGRESS

None currently - ready for Week 2 features

### ❌ NOT STARTED (Planned)

**Week 2 Priorities**
- Home Screen (Net Worth Card, Assets Card, Liabilities Card)
- Add Asset modal (manual entry)
- Add Liability modal (manual entry)
- AsyncStorage persistence
- Edit/Delete flows

**Future Phases**
- Charts (horizontal bar, asset/liability breakdown)
- Stock tracking (Twelve Data API integration)
- Bank connections (TrueLayer OAuth)
- Subscriptions (RevenueCat)
- Settings screen
- Currency conversion

---

## 🛠️ Tech Stack

### Core Framework
- **React Native:** 0.81.5
- **React:** 19.1.0
- **Expo SDK:** 54.0.0
- **TypeScript:** 5.9.0
- **Node.js:** 18+ (LTS)

### Navigation & Routing
- **expo-router:** 6.0.0 (file-based routing)
- **react-navigation:** (via Expo Router)

### Authentication
- **expo-local-authentication:** 17.0.0 (Face ID/Touch ID)
- **expo-secure-store:** 15.0.0 (encrypted storage for PIN)
- `@react-native-google-signin/google-signin` (planned)

### Data & Storage
- **@react-native-async-storage/async-storage:** 2.2.0 (local persistence)
- **expo-secure-store:** 15.0.0 (sensitive data)

### UI & Animations
- **react-native-reanimated:** 4.2.0 (smooth animations)
- **react-native-gesture-handler:** 2.30.0 (touch interactions)
- **react-native-safe-area-context:** 5.6.0 (safe area handling)
- **react-native-svg:** 15.15.0 (icons, charts)
- **react-native-worklets:** 0.7.1 (Reanimated 4 dependency)

### Planned Integrations
- **TrueLayer:** Bank account connections (OAuth)
- **Twelve Data:** Live stock prices
- **RevenueCat:** Subscription management
- **Victory Native:** Charts (react-native-victory)

---

## 📂 Project Structure

```
regent/
├── app/                              # Expo Router screens
│   ├── _layout.tsx                  # Root layout (Slot routing)
│   ├── index.tsx                    # Sign Up screen (/)
│   ├── auth.tsx                     # Auth screen (/auth)
│   └── home.tsx                     # Home dashboard (/home) [placeholder]
│
├── constants/                        # Design system (COMPLETE)
│   ├── Colors.ts                    # Color palette
│   ├── Spacing.ts                   # Spacing scale (xs to 3xl)
│   ├── Typography.ts                # Font sizes, weights, line heights
│   ├── Layout.ts                    # Border radius, shadows
│   └── index.ts                     # Central export
│
├── types/                            # TypeScript definitions (COMPLETE)
│   └── index.ts                     # Asset, Liability, User, etc.
│
├── web-prototype/                    # Original Figma React code
│   └── src/
│       ├── components/              # React web components (reference)
│       └── REGENT_CURSOR_SPEC.md    # Original spec (copied to root)
│
├── REGENT_CURSOR_SPEC.md            # Product specification (3000+ lines)
├── README.md                        # This file
├── AI_CONTEXT.md                    # Quick handoff guide for AI
├── CHANGELOG.md                     # Build history
│
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel setup (Reanimated plugin)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── .gitignore                       # Git ignore rules
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js:** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI:** `npm install -g expo-cli`
- **iOS Simulator:** Xcode 15+ (Mac only)
- **Physical iPhone:** For Face ID testing

### Installation Steps

1. **Clone & Install**
```bash
cd "/path/to/Regent - Final/regent"
npm install
```

2. **Start Development Server**
```bash
npm start
# or
npx expo start
```

3. **Run on iOS**
```bash
npm run ios
# or scan QR code in Expo Go app on iPhone
```

4. **Clear Cache (if needed)**
```bash
npx expo start --clear
```

### Environment Setup (Future)
Create `.env` file for API keys (not needed for current MVP):
```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_TRUELAYER_CLIENT_ID=your_truelayer_client_id
EXPO_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_key
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_key
```

---

## 🎨 Design System

### Colors (`constants/Colors.ts`)

```typescript
export const Colors = {
  // Backgrounds
  background: '#FAFAFA',      // Off-white, primary screen background
  card: '#FFFFFF',            // Pure white for cards
  
  // Text
  primary: '#2B3035',         // Dark gray, primary text
  secondary: '#6E7378',       // Medium gray, secondary text
  muted: '#8C9196',           // Light gray, tertiary text
  
  // Accent
  accent: '#4A90E2',          // Blue for CTAs, links
  
  // Semantic
  success: '#7ED321',         // Green (positive indicators)
  destructive: '#D0021B',     // Red (delete, negative)
  warning: '#F5A623',         // Orange (warnings)
  
  // Borders
  border: '#E1E3E5',          // Subtle borders
  
  // Category Colors (Assets)
  categoryCash: '#4A90E2',         // Blue
  categoryProperty: '#7ED321',     // Green
  categoryInvestments: '#9013FE',  // Purple
  categoryOther: '#9B9B9B',        // Gray
  
  // Category Colors (Liabilities)
  categoryMortgage: '#2C3E50',     // Dark blue
  categoryLoan: '#F5A623',         // Orange
  categoryCreditCard: '#D0021B',   // Red
};
```

### Typography (`constants/Typography.ts`)

```typescript
export const Typography = {
  // Headings
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 30 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  
  // Body
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  
  // UI Elements
  button: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  
  // Display (for large numbers)
  displayLarge: { fontSize: 56, fontWeight: '700', lineHeight: 62 },
  displayMedium: { fontSize: 32, fontWeight: '600', lineHeight: 38 },
};
```

### Spacing (`constants/Spacing.ts`)

Base unit: 4pt

```typescript
export const Spacing = {
  xs: 4,    // Tight spacing
  sm: 8,    // Small spacing
  md: 12,   // Medium spacing
  lg: 16,   // Large spacing
  xl: 24,   // Extra large
  '2xl': 32,  // 2x extra large
  '3xl': 48,  // 3x extra large
};
```

### Layout (`constants/Layout.ts`)

```typescript
export const BorderRadius = {
  sm: 8,    // Small elements (badges, pills)
  md: 12,   // Buttons, inputs
  lg: 16,   // Cards
  full: 9999, // Circles
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  // ... more shadow types
};
```

---

## 📱 Screen Architecture

### Current Screens

#### 1. Sign Up Screen (`app/index.tsx`)
**Route:** `/`  
**Purpose:** First impression, authentication entry point

**Features:**
- Edge-to-edge cityscape background (NYC skyline)
- Translucent status bar (cityscape extends behind)
- Regent logo and tagline
- Three sign-in options:
  - Continue with Apple (primary CTA, black)
  - Continue with Google (secondary, white with Google logo)
  - Continue with Email (tertiary)
- "Already have an account? Sign in" link
- Terms of Service & Privacy Policy links

**Design Notes:**
- Uses `useSafeAreaInsets` for manual safe area control (not `SafeAreaView`)
- Hero section height: 320pt (extends behind status bar)
- StatusBar: `translucent`, `backgroundColor="transparent"`
- Gradient overlay on cityscape for text legibility

**Navigation:**
```typescript
// All sign-in buttons navigate to Auth screen
router.push('/auth');
```

#### 2. Auth Screen (`app/auth.tsx`)
**Route:** `/auth`  
**Purpose:** Secure authentication via Face ID or PIN

**Features:**
- **Face ID Mode:**
  - Auto-triggers on screen load (useEffect)
  - Shows Face ID icon (concentric circles)
  - "Use Face ID to access" title
  - "Authenticate" button (triggers Face ID manually)
  - "Use PIN instead" link (switches to PIN mode)
  
- **PIN Mode:**
  - "Enter PIN" title
  - 4 dots (filled as user types)
  - Numeric keypad (1-9, 0, backspace)
  - "Use Face ID instead" link (switches back)

**Face ID Implementation:**
```typescript
const handleFaceID = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (!hasHardware || !isEnrolled) {
    setShowPIN(true);
    return;
  }
  
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access Regent',
    cancelLabel: 'Use PIN instead',
    disableDeviceFallback: true,
  });
  
  if (result.success) {
    router.replace('/home');
  } else {
    setShowPIN(true);
  }
};
```

**Known Limitation:**
- In Expo Go, Face ID shows device passcode prompt (Expo Go limitation)
- Authentication validates successfully, just uses passcode UI
- Will show proper Face ID UI in standalone builds

**Navigation:**
```typescript
// On success (Face ID or PIN)
router.replace('/home');
```

#### 3. Home Screen (`app/home.tsx`)
**Route:** `/home`  
**Purpose:** Main dashboard (net worth, assets, liabilities)

**Current State:** Placeholder only
```typescript
// Shows: "Welcome to Regent" + "Home Screen - Coming Soon"
```

**Planned Implementation (Week 2):**
- Net Worth Card (large, prominent display)
- Assets Card (list + chart)
- Liabilities Card (list + chart)
- Bottom action bar (Add Asset / Add Liability)
- Empty states with prompts
- Pull-to-refresh

---

## 💾 Data Architecture

### TypeScript Interfaces (`types/index.ts`)

#### Asset
```typescript
export interface Asset {
  id: string;                    // UUID
  name: string;                  // User-defined name
  value: number;                 // In primary currency
  type: AssetType;               // 'bank' | 'portfolio' | 'property' | 'other'
  currency: Currency;            // 'GBP' | 'USD' | 'EUR'
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  metadata?: {
    // Bank accounts (TrueLayer)
    accountId?: string;
    bankName?: string;
    lastSynced?: string;
    
    // Stocks/ETFs (Twelve Data)
    ticker?: string;
    quantity?: number;
    lastPrice?: number;
    holdings?: StockHolding[];
    
    // Properties
    address?: string;
    
    // Generic
    notes?: string;
  };
}
```

#### Liability
```typescript
export interface Liability {
  id: string;
  name: string;
  value: number;                 // Amount owed (always positive)
  type: LiabilityType;           // 'mortgage' | 'creditcard' | 'loan' | 'other'
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    interestRate?: string;
    monthlyPayment?: string;
    notes?: string;
  };
}
```

#### User
```typescript
export interface User {
  id: string;                    // From Google OAuth
  email: string;
  name: string;
  profilePhotoUrl?: string;
  primaryCurrency: Currency;     // Default: 'GBP'
  createdAt: string;
  lastLoginAt: string;
  hasFaceIDEnabled: boolean;
  hasCompletedOnboarding: boolean;
}
```

### Data Storage Strategy

#### AsyncStorage (Unencrypted)
- User profile: `@regent_user`
- Assets array: `@regent_assets`
- Liabilities array: `@regent_liabilities`
- App preferences: `@regent_preferences`

#### SecureStore (Encrypted)
- PIN hash: `@regent_auth`
- TrueLayer tokens: `@regent_truelayer_tokens`
- Google OAuth tokens: `@regent_google_token`

#### Net Worth Calculation
```typescript
// Derived data (not stored)
const netWorth = assets.reduce((sum, asset) => sum + asset.value, 0)
                - liabilities.reduce((sum, liability) => sum + liability.value, 0);
```

---

## 🔌 API Integrations (Planned)

### 1. Google OAuth
**Purpose:** User authentication  
**Library:** `@react-native-google-signin/google-signin`  
**Status:** UI ready, SDK not integrated yet

**Setup Required:**
- Google Cloud Console project
- OAuth 2.0 credentials (iOS client ID)
- Bundle ID: `com.regent.app`

### 2. Face ID (Expo Local Authentication)
**Purpose:** Biometric authentication  
**Library:** `expo-local-authentication`  
**Status:** ✅ Implemented

**Configuration:**
```json
// app.json
{
  "ios": {
    "infoPlist": {
      "NSFaceIDUsageDescription": "Regent uses Face ID to securely access your financial data."
    }
  },
  "plugins": [
    ["expo-local-authentication", {
      "faceIDPermission": "Regent uses Face ID to securely access your financial data."
    }]
  ]
}
```

### 3. TrueLayer (Banking)
**Purpose:** Read-only bank account balances  
**Status:** Not started  
**Permissions:** `accounts` scope only (NOT `investments`)

**Flow:**
1. User selects bank (Barclays, HSBC, etc.)
2. TrueLayer OAuth opens in WebView
3. User logs into bank
4. App receives account balances
5. Auto-creates Assets with metadata

### 4. Twelve Data (Stock Prices)
**Purpose:** Live stock/ETF prices  
**Status:** Not started  
**Free Tier:** 800 requests/day

**Endpoints:**
- `/price?symbol=AAPL` - Current price
- `/quote?symbol=AAPL` - Detailed quote

### 5. RevenueCat (Subscriptions)
**Purpose:** Subscription management  
**Status:** Not started  
**Pricing:** £49.99/year

**Free Tier Limits:**
- 3 assets max
- 2 liabilities max
- No bank connections
- No stock tracking

---

## 🚨 Known Issues & Limitations

### 1. Face ID in Expo Go
**Issue:** Device passcode prompt instead of Face ID UI  
**Root Cause:** Expo Go can't use custom `NSFaceIDUsageDescription`  
**Impact:** Authentication works, just uses passcode fallback  
**Solution:** Build standalone app (EAS Build) for proper Face ID

**Code Reference:** `app/auth.tsx`, lines 20-56

### 2. React 19 Serialization Issues
**Issue:** Complex props in native components cause type errors  
**Root Cause:** React 19 stricter JSI serialization  
**Workarounds Applied:**
- Removed `edges` prop from SafeAreaView
- Removed `animation` and `contentStyle` from Stack
- Switched to `<Slot />` routing

**Affected Files:**
- `app/_layout.tsx` (now uses `<Slot />` instead of `<Stack>`)
- `app/index.tsx` (uses `useSafeAreaInsets` instead of `SafeAreaView` `edges`)
- `app/auth.tsx` (removed `edges` prop)

### 3. Babel Config Detection
**Issue:** Metro sometimes detects babel.config.js changes on startup  
**Solution:** Run with `--clear` flag:
```bash
npx expo start --clear
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Sign Up screen displays correctly (cityscape edge-to-edge)
- [ ] Tap sign-in button navigates to Auth screen
- [ ] Face ID auto-triggers on Auth screen load
- [ ] Can switch to PIN entry
- [ ] 4-digit PIN entry works (any PIN accepted for now)
- [ ] Successful auth navigates to Home screen

**Visual Design:**
- [ ] No gray bar at top of Sign Up screen
- [ ] Cityscape extends behind status bar
- [ ] All text is legible (gradient overlay working)
- [ ] Buttons have correct colors and styles
- [ ] Spacing matches design system

**Navigation:**
- [ ] Can navigate Sign Up → Auth → Home
- [ ] Back navigation works appropriately
- [ ] No navigation errors in console

### Device-Specific Testing

**iPhone Physical Device:**
- Face ID authentication (in standalone build)
- Deep link handling (TrueLayer redirect)
- SafeArea insets (notch, home indicator)
- Performance (60fps animations)

**iOS Simulator:**
- Basic UI testing
- Navigation flow
- Layout on different screen sizes
- Note: Face ID not fully supported

---

## 🐛 Debugging

### Console Logs

**Face ID Debugging:**
```typescript
console.log('Biometric Support:', { hasHardware, isEnrolled, supportedTypes });
console.log('Auth result:', result);
```

**Navigation Debugging:**
```typescript
console.log('Navigating to:', route);
console.log('Sign in with:', method);
```

### Common Issues

**1. White screen on launch**
- Check Metro bundler for errors
- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**2. "Cannot find module"**
- Restart Metro bundler
- Check import paths (case-sensitive)
- Verify file exists

**3. "Unable to resolve module expo-router/entry"**
- Check `main` field in package.json: `"expo-router/entry"`
- Run `npx expo install`

**4. Face ID not triggering**
- Expected in Expo Go (uses passcode)
- Check console logs for biometric support detection
- Test on physical device with Face ID enrolled

---

## 📦 Build & Deployment

### Development Build (Expo Go)
```bash
# Currently using Expo Go for testing
npm start
# Scan QR code with Expo Go app
```

### Production Build (EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --profile production --platform ios

# Submit to TestFlight
eas submit --platform ios
```

### TestFlight Distribution
1. Build with EAS: `eas build --profile production --platform ios`
2. Submit to App Store Connect: `eas submit`
3. Add beta testers in App Store Connect
4. Testers receive TestFlight invite

---

## 🎯 Development Priorities

### Week 2 (Next Up)
1. Home Screen UI (Net Worth, Assets, Liabilities cards)
2. Add Asset modal (manual entry)
3. Add Liability modal (manual entry)
4. AsyncStorage implementation
5. Edit/Delete flows

### Week 3
1. Horizontal bar charts (Assets/Liabilities breakdown)
2. Currency selection
3. Currency conversion (basic)
4. Empty states polish
5. Loading states

### Week 4
1. Stock tracking (Twelve Data integration)
2. TrueLayer integration (bank connections)
3. RevenueCat (subscriptions)
4. Settings screen
5. Testing & bug fixes

### Week 5
1. TestFlight build
2. Beta testing
3. Feedback implementation
4. Final polish
5. App Store submission

---

## 📚 Additional Resources

### Product Documentation
- **Product Spec:** `REGENT_CURSOR_SPEC.md` (3000+ lines, comprehensive)
- **User Flows:** Section 3 of spec (10 detailed flows)
- **Design System:** Section 6 of spec (colors, typography, components)
- **Integrations:** Section 7 of spec (Google, Face ID, TrueLayer, etc.)

### Code References
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **Expo Local Authentication:** https://docs.expo.dev/versions/latest/sdk/local-authentication/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **TypeScript:** https://www.typescriptlang.org/docs/

### Design Inspiration
- **Cityscapes:** Unsplash (search "NYC skyline dusk")
- **UI Patterns:** Apple HIG, iOS native apps
- **Color Palette:** Muted, professional (avoid bright colors)

---

## 🤝 Contributing

### For AI Developers

**Before Starting:**
1. Read `AI_CONTEXT.md` (5 min quick orientation)
2. Skim `REGENT_CURSOR_SPEC.md` sections 1-4 (product context)
3. Review this README (technical details)

**When Building:**
- Follow TypeScript interfaces strictly
- Use design system constants (no hardcoded values)
- Test on physical iPhone when possible
- Handle empty states and errors elegantly
- Save to AsyncStorage after every data change

**When Stuck:**
- Check `REGENT_CURSOR_SPEC.md` for design intent
- Review existing screens for patterns
- Console log liberally for debugging
- Ask user for clarification if product requirements unclear

---

## 📄 License

**Private Project** - Not open source

---

**Built with ❤️ for discerning professionals who value financial clarity.**

For questions or handoff, see `AI_CONTEXT.md` for quick orientation.
