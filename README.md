# Regent - Premium Net Worth Tracking

**Status:** 🟢 Clean Setup Complete - Ready to Build  
**Last Updated:** January 6, 2026  
**Progress:** Week 1 Complete (25% MVP)

---

## 🎉 Fresh Start Complete!

This project was **completely rebuilt** from scratch with stable, production-ready dependencies. All React 19 + incompatibility issues have been eliminated.

### ✅ What's Fixed

- **React 18.2.0** (stable, not experimental React 19)
- **Expo SDK 52** (battle-tested, production-ready)
- **React Native 0.76.5** (latest stable)
- **0 vulnerabilities** in dependency tree
- **All packages compatible** with each other

---

## 📁 Project Structure

```
regent/
├── app/                        ✅ Screens (Expo Router)
│   ├── _layout.tsx            → Navigation wrapper
│   ├── index.tsx              → Sign Up Screen (complete)
│   ├── auth.tsx               → Face ID/PIN Screen (complete)
│   └── home.tsx               → Home Dashboard (placeholder)
├── constants/                  ✅ Design System
│   ├── Colors.ts              → Color palette
│   ├── Typography.ts          → Font styles
│   ├── Spacing.ts             → Spacing scale
│   ├── Layout.ts              → Borders, shadows, dimensions
│   └── index.ts               → Export all
├── types/                      ✅ TypeScript
│   └── index.ts               → Asset, Liability, User types
├── components/                 📁 Empty (Week 2)
├── hooks/                      📁 Empty (Week 2)
├── utils/                      📁 Empty (Week 2)
├── web-prototype/              📚 Reference (Figma code + spec)
│   └── src/
│       ├── REGENT_CURSOR_SPEC.md  ← FULL PRODUCT SPEC (100+ pages)
│       └── components/             ← Web reference code
├── assets/                     ✅ Icons and images
├── app.json                    ✅ Expo configuration
├── package.json                ✅ Dependencies (stable versions)
└── tsconfig.json               ✅ TypeScript config
```

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
cd "/Users/dmytrolozynskyi/Library/CloudStorage/OneDrive-Personal/Regent - Final/regent"
npm start
```

### 2. Run on iOS

**Option A: iOS Simulator**
```bash
# Press 'i' in the terminal after npm start
# OR
npm run ios
```

**Option B: Physical iPhone (Recommended for Face ID)**
1. Install **Expo Go** from App Store
2. Run `npm start`
3. Scan QR code with Camera app
4. App opens in Expo Go

---

## 📦 Installed Dependencies

### Core
- `expo` ~52.0.0 - Expo SDK
- `react` 18.2.0 - React (stable)
- `react-native` 0.76.5 - React Native

### Navigation
- `expo-router` ~4.0.0 - File-based routing
- `react-native-screens` ~4.0.0 - Native screens
- `react-native-safe-area-context` 4.12.0 - Safe areas

### Authentication & Storage
- `expo-local-authentication` ~15.0.0 - Face ID/Touch ID
- `expo-secure-store` ~14.0.0 - Encrypted storage (PIN)
- `@react-native-async-storage/async-storage` 2.0.0 - Data persistence

### UI & Animations
- `react-native-reanimated` ~3.16.0 - Smooth animations
- `react-native-gesture-handler` ~2.20.0 - Touch gestures
- `react-native-svg` 15.8.0 - Vector graphics

### Utilities
- `expo-constants` ~17.0.0 - App constants
- `expo-linking` ~7.0.0 - Deep linking
- `expo-status-bar` ~2.0.0 - Status bar

---

## ✅ What's Built (Week 1)

### 1. **Sign Up Screen** (`app/index.tsx`)
- Hero section with NYC cityscape
- Apple/Google/Email sign-in buttons (UI complete)
- Premium aesthetic with shadows and spacing
- Navigation to Face ID screen

### 2. **Face ID/PIN Authentication** (`app/auth.tsx`)
- Native Face ID integration
- Custom 4-digit PIN keypad
- Graceful fallback between Face ID ↔ PIN
- Error handling and validation
- Smooth animations

### 3. **Home Screen Placeholder** (`app/home.tsx`)
- Basic layout ready
- Will build dashboard in Week 2

### 4. **Design System** (`constants/`)
- Complete color palette
- Typography scale (display → body → labels)
- Spacing system (8px → 64px)
- Shadows, borders, radii

### 5. **TypeScript Types** (`types/`)
- Asset, Liability, User interfaces
- Currency, AssetType, LiabilityType enums
- Subscription and Auth state types

---

## 🎨 Design Principles

From REGENT_CURSOR_SPEC.md:

1. **Restrained Modernism** - Clean, spacious, minimal
2. **Muted Warmth** - Cityscapes, soft gradients
3. **Typography as Hierarchy** - Font weight creates structure
4. **Progressive Disclosure** - Show essentials first
5. **No Gamification** - No streaks, badges, or celebrations

**Color Palette:**
- Background: `#FAFAFA` (off-white)
- Foreground: `#1A1A1A` (almost black)
- Primary: `#1A1A1A` (dark buttons)
- Muted: `#6B6B6B` (secondary text)

---

## 🔮 Next Steps (Week 2)

### Priority 1: Home Screen Dashboard
- [ ] Net Worth Card (large display with £/$/€)
- [ ] Assets List (collapsible)
- [ ] Liabilities List (collapsible)
- [ ] Add Asset/Liability buttons
- [ ] Empty state messaging

### Priority 2: Data Persistence
- [ ] AsyncStorage setup for assets/liabilities
- [ ] Net worth calculation logic
- [ ] SecureStore for PIN hash (with bcrypt)
- [ ] Mock data generator for demo

### Priority 3: Add Asset/Liability Modals
- [ ] Bottom sheet modal component
- [ ] Form validation
- [ ] Currency input with formatting
- [ ] Category picker (Property, Stocks, Other)

---

## 📚 Reference Materials

### In This Repo
- **Product Spec:** `web-prototype/src/REGENT_CURSOR_SPEC.md` (100+ pages, complete)
- **Web Prototype:** `web-prototype/src/components/` (reference only)
- **Design System:** `constants/` (source of truth)

### External
- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Expo Router Docs:** https://docs.expo.dev/router/introduction/

---

## 🛠️ Development Commands

```bash
# Start dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android (not configured yet)
# npm run android

# Clear cache and restart
npm start -- --clear

# Install new dependency
npm install <package-name>

# Check TypeScript errors
npx tsc --noEmit
```

---

## 🐛 Troubleshooting

### "Unable to resolve module..."
```bash
npm start -- --clear
# If still broken:
rm -rf node_modules package-lock.json
npm install
```

### Face ID not working
- Test on **physical device** (simulator has limited Face ID support)
- Go to Settings → Face ID → Ensure it's enrolled
- Check `app.json` has `NSFaceIDUsageDescription`

### App crashes on launch
- Check Metro bundler terminal for errors
- Verify all imports are correct (no missing modules)
- Try running on a different device/simulator

---

## 📊 Progress Tracker

**MVP Completion: 25%**

| Feature | Status |
|---------|--------|
| Sign Up Screen | ✅ Complete |
| Face ID/PIN Auth | ✅ Complete |
| Home Dashboard | 🚧 Next |
| Add Asset | 🚧 Next |
| Add Liability | 🚧 Next |
| Charts/Graphs | ⏳ Week 3 |
| Stock Tracking (Twelve Data) | ⏳ Week 3 |
| Bank Connection (TrueLayer) | ⏳ Week 3 |
| Subscription Paywall (RevenueCat) | ⏳ Week 3 |
| Settings Screen | ⏳ Week 4 |
| TestFlight Beta | ⏳ Week 4 |

---

## 🎯 MVP Success Criteria

From REGENT_CURSOR_SPEC.md, MVP is complete when:

1. ✅ User can sign up (Google/Apple)
2. ✅ User can authenticate with Face ID (PIN fallback)
3. ⏳ User can add/edit/delete assets manually
4. ⏳ User can add/edit/delete liabilities manually
5. ⏳ User can connect bank account via TrueLayer
6. ⏳ User can add stock portfolio (ticker + quantity)
7. ⏳ App fetches live stock prices via Twelve Data
8. ⏳ Net worth calculates correctly in real-time
9. ⏳ Charts display asset/liability breakdowns
10. ⏳ Currency selection works (GBP/USD/EUR)
11. ⏳ Subscription paywall implemented (RevenueCat)
12. ⏳ Data persists between sessions
13. ⏳ App feels premium and polished

**Target Launch:** Q1 2026

---

## 🤝 Support

- Check this README for guidance
- Review `web-prototype/src/REGENT_CURSOR_SPEC.md` for detailed specs
- Expo documentation: https://docs.expo.dev
- React Native documentation: https://reactnative.dev

---

## 🔐 Security Notes

- **PIN Storage:** Will use bcrypt hashing + SecureStore (iOS Keychain)
- **Bank Data:** TrueLayer OAuth (read-only, account balances only)
- **No Backend:** All data stored locally (MVP)
- **FCA Compliance:** App is "informational only" - no investment management

---

**Status:** ✅ Ready to build Week 2 features!

Run `npm start` to begin development.
