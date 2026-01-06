# Changelog

All notable changes to the Regent project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### To Build (Week 3 Priorities)
- Edit flows (Edit Asset/Liability modals)
- Settings Screen (currency switcher, logout)
- Detail Screens (full asset/liability lists)
- Stock/ETF tracking (Twelve Data API)
- Bank connections (TrueLayer OAuth)
- Subscriptions (RevenueCat)

---

## [0.2.0] - 2026-01-06 (Evening)

### Added - Week 2: Core Features Complete ✅

**Home Screen Implementation**
- `NetWorthCard.tsx` - Large net worth display with "Updated just now" timestamp
- `AssetsCard.tsx` - Asset breakdown with horizontal bar chart and list
- `LiabilitiesCard.tsx` - Liability breakdown with horizontal bar chart and list
- Personalized header with user name and "Overview" title
- Settings icon (Lucide `Settings`) in header
- Pixel-perfect alignment with web prototype (exact proportions, typography, spacing)

**Two-Step Modal System**
- `AssetTypePickerModal.tsx` - First step: select asset type (Bank, Portfolio, Property, Other)
- `LiabilityTypePickerModal.tsx` - First step: select liability type (Mortgage, Credit Card, Loan, Other)
- Lucide icons throughout (`Building2`, `TrendingUp`, `Home`, `Plus`, `CreditCard`, `MoreHorizontal`)
- Smooth modal transitions with `animationType="slide"` and `presentationStyle="pageSheet"`

**Individual Asset Modals**
- `AddBankModal.tsx` - Bank account entry (TrueLayer placeholder)
- `AddPropertyModal.tsx` - Property asset entry (name, value, info box)
- `AddOtherAssetModal.tsx` - Other asset entry (collectibles, vehicles, crypto, etc.)
- All modals match web prototype: Title Case labels (15px, 500 weight), 56px input height, inline currency symbols

**Individual Liability Modals**
- `AddMortgageModal.tsx` - Mortgage entry with header "Add" button, property address, lender, interest rate, monthly payment
- `AddLoanModal.tsx` - Loan entry with header "Add" button, loan type dropdown (Personal, Car, Student), all fields
- `AddOtherLiabilityModal.tsx` - Other liability entry with info box
- Dropdown implementation with `ChevronDown` icon for loan type selection

**Data Layer**
- `contexts/DataContext.tsx` - Global state management with React Context API
- `utils/storage.ts` - AsyncStorage helpers (`saveAssets`, `loadAssets`, `saveLiabilities`, `loadLiabilities`)
- `utils/generateId.ts` - UUID generation for assets/liabilities
- Auto-persistence: All data saves to AsyncStorage on every create/delete action
- Exposes `totalAssets`, `totalLiabilities`, `primaryCurrency` for UI consumption

**Charts & Visualizations**
- Horizontal bar charts for asset/liability breakdown
- Category color coding (Cash: blue, Property: green, Investments: purple, etc.)
- Real-time chart updates on data changes
- Smooth animations

**Delete Functionality**
- Long-press on asset/liability items to delete
- Confirmation alerts before deletion
- Net worth recalculates immediately
- Data persists to AsyncStorage

**Dependencies**
- Installed `lucide-react-native` (0.562.0) for professional icons
- Fixed React version mismatch: locked `react` to `^19.1.0` in package.json
- Reinstalled all dependencies to resolve version conflicts

### Fixed

**React Version Mismatch**
- Error: "Incompatible React versions" (react: 19.2.3 vs react-native-renderer: 19.1.0)
- Solution: Explicitly set `react: "^19.1.0"` in package.json
- Deleted node_modules and package-lock.json, reinstalled with `npm install`
- Restarted dev server with `npx expo start --ios --clear`

**Port Conflict**
- Error: Port 8081 already in use
- Solution: Killed process using `lsof -ti:8081 | xargs kill -9`
- Restarted server successfully

**Design Inconsistencies (Complete Overhaul)**
- **Initial Issues:** Net Worth typography too small, missing header personalization, wrong card styles, emoji usage, spacing mismatches
- **Precision Audit:** Fixed subtle inconsistencies:
  - Header userName letterSpacing: 0.5 → 0.42 (0.03em)
  - Net Worth label letterSpacing: 0.8 → 0.75 (0.05em)
  - Net Worth amount lineHeight: 62 → 61.6 (1.1 × 56)
  - Assets/Liabilities total lineHeight: 31 → 31.2 (1.3 × 24)
  - List item gap: 8px → 12px (Spacing.sm for space-y-3)
  - Net Worth card bottom margin: 16px → 24px (mb-6)
- **Modal System Issues:** Fixed architecture mismatch (submit button now inside form), typography (Title Case labels), input styling (56px height, inline currency), added info boxes

### Changed

**Home Screen Architecture**
- Replaced placeholder with fully functional dashboard
- Integrated DataContext for reactive state management
- Added pull-to-refresh support (placeholder for future API refresh)
- Implemented empty states with "Add your first asset" prompts

**Modal Flow**
- Changed from single-step to two-step process (type picker → specific form)
- Matches web prototype exactly
- Better UX: clear separation of concerns, easier to extend

**Typography Scale**
- Net Worth amount increased to 56pt (from 32pt) to match web prototype
- Labels changed from ALL CAPS to Title Case
- Adjusted line heights and letter spacing for pixel-perfect alignment

**Icon System**
- Replaced all emoji placeholders with Lucide React Native icons
- Consistent 24pt icon size throughout
- Professional, modern appearance

### Technical Details

**File Structure**
```
components/
├── AssetTypePickerModal.tsx       (Two-step flow, Lucide icons)
├── LiabilityTypePickerModal.tsx   (Two-step flow, Lucide icons)
├── AddBankModal.tsx               (Bank account form)
├── AddPropertyModal.tsx           (Property asset form)
├── AddOtherAssetModal.tsx         (Other asset form)
├── AddMortgageModal.tsx           (Mortgage liability form with header button)
├── AddLoanModal.tsx               (Loan liability form with dropdown)
├── AddOtherLiabilityModal.tsx     (Other liability form)
├── NetWorthCard.tsx               (Net worth display)
├── AssetsCard.tsx                 (Asset breakdown card)
└── LiabilitiesCard.tsx            (Liability breakdown card)

contexts/
└── DataContext.tsx                (Global state + AsyncStorage)

utils/
├── storage.ts                     (AsyncStorage helpers)
└── generateId.ts                  (UUID generation)
```

**Package Versions (Updated)**
```json
{
  "react": "^19.1.0",
  "lucide-react-native": "^0.562.0"
}
```

---

## [0.1.0] - 2026-01-06

### Added - Week 1: Foundation & Authentication

**Authentication Flow**
- Sign Up screen with cityscape background (NYC skyline)
- Edge-to-edge design (cityscape extends behind status bar)
- Google OAuth UI (three sign-in options)
- Face ID authentication screen with auto-trigger
- PIN entry fallback (4-digit numeric keypad)
- Navigation flow: Sign Up → Auth → Home

**Design System (Complete)**
- `constants/Colors.ts` - Premium color palette (muted, restrained)
- `constants/Typography.ts` - Font hierarchy (6 levels: h1-h4, body, button, etc.)
- `constants/Spacing.ts` - Spacing scale (4pt base: xs to 3xl)
- `constants/Layout.ts` - Border radius, shadows, layout utilities
- `constants/index.ts` - Central export for all design constants

**Data Architecture**
- `types/index.ts` - TypeScript interfaces for all data models:
  - `Asset` interface (bank, portfolio, property, other)
  - `Liability` interface (mortgage, loan, creditcard, other)
  - `User` interface (profile, preferences)
  - `SubscriptionState` interface (free tier, premium)
  - `AuthState` interface (Face ID, PIN)
  - Type enums: `Currency`, `AssetType`, `LiabilityType`

**Screens**
- `app/index.tsx` - Sign Up screen (/) ✅
- `app/auth.tsx` - Face ID/PIN authentication (/auth) ✅
- `app/home.tsx` - Home dashboard placeholder (/home) 🚧
- `app/_layout.tsx` - Root layout with Slot routing

**Project Structure**
- Expo Router setup (file-based routing)
- TypeScript strict mode configuration
- Modular folder structure (app, constants, types)
- Web prototype preserved in `/web-prototype/` for design reference

**Developer Experience**
- Comprehensive documentation created:
  - `README.md` - Technical implementation guide
  - `AI_CONTEXT.md` - Quick handoff guide for AI developers
  - `REGENT_CURSOR_SPEC.md` - Complete product specification (copied from web-prototype)
  - `CHANGELOG.md` - This file
- Git repository initialized with proper .gitignore
- Package.json configured with all dependencies

### Fixed

**Face ID Implementation**
- Added `expo-local-authentication` plugin to `app.json` with Face ID permission
- Implemented auto-trigger Face ID on Auth screen load (useEffect)
- Added console logging for biometric support debugging
- Set `disableDeviceFallback: true` to force biometric-only authentication
- Known limitation: Expo Go shows device passcode (expected behavior)

**Status Bar & Safe Area**
- Fixed gray bar at top of Sign Up screen
- Replaced `SafeAreaView` with manual safe area control via `useSafeAreaInsets`
- Set StatusBar to `translucent` with `backgroundColor="transparent"`
- Increased hero section height (280 → 320) to extend behind status bar
- Added bottom safe area padding for home indicator

**React 19 Compatibility**
- Removed `edges={['top', 'bottom']}` from SafeAreaView (serialization issue)
- Removed `animation: 'fade'` from Stack screenOptions
- Removed `contentStyle` from Stack screenOptions
- Switched to `<Slot />` routing for simplicity (avoiding Stack prop serialization)
- Set `newArchEnabled: true` in `app.json` (match Expo Go behavior)

### Changed

**Navigation Architecture**
- Switched from `<Stack>` to `<Slot />` in `_layout.tsx`
- Reason: React 19 + Expo SDK 54 + New Architecture serialization issues
- Simplified routing approach for stability

**Dependencies**
- Added `expo-asset` (required by Expo Router)
- Added `expo-font` (font loading support)
- Added `react-native-worklets` (required by react-native-reanimated v4)
- Updated to Expo SDK 54.0.0
- Updated to React 19.1.0

### Technical Details

**Package Versions**
```json
{
  "expo": "~54.0.0",
  "react": "^19.1.0",
  "react-native": "0.81.5",
  "typescript": "~5.9.0",
  "expo-router": "~6.0.0",
  "expo-local-authentication": "~17.0.0",
  "react-native-reanimated": "~4.2.0"
}
```

**Babel Configuration**
```javascript
// babel.config.js
plugins: [
  'react-native-reanimated/plugin',
  'react-native-worklets/plugin',
]
```

**App Configuration**
```json
// app.json
{
  "newArchEnabled": true,
  "plugins": [
    "expo-router",
    ["expo-local-authentication", {
      "faceIDPermission": "Regent uses Face ID to securely access your financial data."
    }]
  ]
}
```

### Git Commits (January 6, 2026)

1. **Initial setup** - Fresh start after Face ID issues
2. **Design system** - Added Colors, Typography, Spacing, Layout constants
3. **Sign Up screen** - Implemented cityscape background, OAuth UI
4. **Auth screen** - Face ID + PIN entry implementation
5. **Home placeholder** - Basic home screen structure
6. **Face ID debugging** - Added console logs, auto-trigger
7. **Fix status bar** - Edge-to-edge cityscape, translucent status bar
8. **Fix Face ID config** - Added plugin, set disableDeviceFallback
9. **Documentation** - Created README, AI_CONTEXT, copied CURSOR_SPEC

---

## [0.0.1] - 2026-01-05 (Pre-Fresh Start)

### Context
- Initial exploration phase
- Encountered multiple React 19 + Expo SDK compatibility issues
- Face ID implementation triggered device passcode unexpectedly
- Navigation serialization errors with Stack component
- Decision made to do "fresh start" (Option 5) on January 6

### Issues Encountered (Resolved in 0.1.0)
- `Cannot find module 'babel-preset-expo'`
- `Unable to resolve module expo-linking`
- `Unable to resolve module react-native-screens`
- `Error: Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string'`
- SafeAreaView `edges` prop serialization errors
- React version mismatch (react vs react-native-renderer)

### Lessons Learned
- React 19 requires careful prop handling for native components
- Expo Go has limitations with Face ID permissions (use standalone builds)
- New Architecture must be explicitly enabled to match Expo Go
- Keep navigation simple - avoid complex Stack configurations

---

## Development Phases

### ✅ Phase 1: Foundation (Week 1) - COMPLETE
- Project setup (Expo, TypeScript, folder structure)
- Design system implementation
- Authentication UI (Sign Up, Auth screens)
- Basic navigation flow
- Documentation

### 🚧 Phase 2: Core Functionality (Week 2) - IN PROGRESS
- Home Screen (Net Worth + Assets + Liabilities cards)
- Add Asset modal (manual entry)
- Add Liability modal (manual entry)
- AsyncStorage persistence
- Edit/Delete flows

### 📅 Phase 3: Data & Charts (Week 3) - PLANNED
- Horizontal bar charts (asset/liability breakdown)
- Currency selection in Settings
- Currency conversion (basic)
- Empty states polish
- Loading states

### 📅 Phase 4: Integrations (Week 4) - PLANNED
- Twelve Data integration (stock tracking)
- TrueLayer integration (bank connections)
- RevenueCat integration (subscriptions)
- Settings screen (full implementation)
- Animations and polish

### 📅 Phase 5: Launch Prep (Week 5) - PLANNED
- TestFlight build
- Beta testing with friends/family
- Feedback collection and implementation
- Final polish and bug fixes
- App Store submission

---

## Known Issues

### 1. Face ID in Expo Go
**Status:** Expected behavior, not a bug  
**Issue:** Face ID shows device passcode prompt instead of Face ID UI  
**Impact:** Authentication works correctly, just uses passcode fallback  
**Workaround:** Test in Expo Go with passcode, verify Face ID in standalone builds  
**Priority:** Low (will resolve naturally with production build)

### 2. Home Screen Placeholder
**Status:** Intentional, not implemented yet  
**Issue:** Home screen shows only placeholder text  
**Impact:** Cannot test full user flow beyond authentication  
**Next Step:** Week 2 implementation (Net Worth, Assets, Liabilities cards)  
**Priority:** High (Week 2 focus)

---

## Future Roadmap

### P0 Features (MVP - Must Have)
- [x] Sign Up screen
- [x] Authentication (Face ID/PIN)
- [x] Design system
- [ ] Home Screen (Net Worth display)
- [ ] Add Asset (manual entry)
- [ ] Add Liability (manual entry)
- [ ] Edit/Delete flows
- [ ] Data persistence (AsyncStorage)
- [ ] Currency selection

### P1 Features (Launch Ready)
- [ ] Charts (horizontal bar, asset/liability breakdown)
- [ ] Stock tracking (Twelve Data API)
- [ ] Bank connections (TrueLayer OAuth)
- [ ] Subscriptions (RevenueCat)
- [ ] Settings screen (full)
- [ ] Animations and polish
- [ ] Empty states (all screens)
- [ ] Error handling (all flows)

### P2 Features (Post-Launch)
- [ ] Net worth over time (line chart)
- [ ] Historical snapshots (monthly)
- [ ] Export to CSV
- [ ] Dark mode
- [ ] Widgets (iOS home screen)
- [ ] Notifications (daily/weekly summaries)
- [ ] Multi-device sync (backend)

---

## Performance Metrics

### Current Status (Week 1)
- **Build Time:** ~30 seconds (initial)
- **App Size:** ~25 MB (Expo Go)
- **Startup Time:** <2 seconds (on iPhone 13)
- **Navigation:** 60fps smooth transitions
- **Dependencies:** 29 packages

### Targets (Production)
- **App Size:** <50 MB (standalone)
- **Startup Time:** <1 second
- **Frame Rate:** 60fps sustained
- **API Response:** <500ms average

---

## References

### Documentation
- Product Spec: `REGENT_CURSOR_SPEC.md`
- Technical Guide: `README.md`
- Handoff Guide: `AI_CONTEXT.md`

### External Resources
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- TypeScript: https://www.typescriptlang.org/

### GitHub Repository
- Remote: `git@github.com:lozynskyidv/regent.git`
- Branch: `main`
- Last Push: January 6, 2026

---

**Note:** This changelog is maintained manually. All significant changes should be documented here with:
- Date of change
- Type of change (Added, Fixed, Changed, Removed)
- Detailed description
- Impact on project
- Related files/commits

For questions about specific changes, see the Git commit history or relevant documentation files.
