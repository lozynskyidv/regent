# Regent - Premium Net Worth Tracker

**⚠️ DESIGN PROTOTYPE ONLY - NOT PRODUCTION CODE**

This repository contains a **React web prototype** for design and planning purposes. It is **NOT production-ready code** and should only be used as a **visual and functional reference** for building the actual React Native (Expo) iOS app.

---

## Purpose

This prototype demonstrates:
- ✅ Complete user flows (invite code → signup → Face ID → home)
- ✅ UI/UX design system (premium banking aesthetic)
- ✅ Component architecture and interaction patterns
- ✅ Invite-only viral growth mechanics
- ✅ Business logic and validation flows

**What this is NOT:**
- ❌ Production-ready code
- ❌ React Native implementation
- ❌ Connected to real backend/database
- ❌ App Store deployable

---

## Technology Stack

### Current (Prototype)
- **React** (web-based)
- **TypeScript**
- **Tailwind CSS v4**
- **Vite** (build tool)

### Target Production Stack
- **React Native** (Expo)
- **TypeScript**
- **Supabase** (backend)
- **TrueLayer** (bank connections)
- iOS-first (Face ID, StoreKit, native APIs)

---

## How to Use This Prototype

### For Developers
1. **Study the flows**: Navigate through screens using the bottom navigation bar
2. **Reference components**: Copy UI patterns and logic, but adapt for React Native
3. **Understand state management**: See how data flows between screens
4. **Review business rules**: Check validation logic, invite mechanics, etc.

### For Designers
1. **Visual reference**: All screens match final design specifications
2. **Interaction patterns**: Buttons, modals, animations, transitions
3. **Copy/content**: All microcopy and error messages finalized
4. **Spacing/typography**: Design tokens in `/styles/globals.css`

---

## Screen Guide

### Navigation
Use the **bottom navigation bar** to jump between screens:

| Screen | Purpose | Key Features |
|--------|---------|--------------|
| **Landing** | Marketing page | Hero, features, "Get Started" CTA |
| **Invite Code** | Gate entry with exclusive code | Validation, waitlist modal, error handling |
| **Sign Up** | Google OAuth placeholder | Google Sign-In button (mock) |
| **Face ID** | Biometric setup | Face ID animation, skip option |
| **Subscribe** | Subscription authorization (deprecated) | *Note: This screen is deprecated in invite-only model* |
| **Home** | Main dashboard | Net worth card, assets/liabilities, invite sharing |
| **Invite Comparison** | Design iterations | Compare different invite card designs |

### Valid Test Codes
Any code starting with `RGNT` (e.g., `RGNT1234`, `RGNT5678`)

---

## Key Files

### Core Screens
- `/components/InviteCodeScreen.tsx` - Invite code entry
- `/components/SignUpScreen.tsx` - Google sign-up (mock)
- `/components/FaceIDScreen.tsx` - Biometric authentication
- `/components/HomeScreen.tsx` - Main dashboard
- `/components/SettingsScreen.tsx` - User settings

### Invite System
- `/components/ShareInviteCard.tsx` - Invite sharing UI (5 invites per user)
- `/components/WaitlistModal.tsx` - Email capture for non-invited users
- `/components/InvitePromptCard.tsx` - Prompt to share invites

### Detail Screens
- `/components/AssetsDetailScreen.tsx` - Bank accounts, portfolios, property
- `/components/LiabilitiesDetailScreen.tsx` - Credit cards, mortgages, loans
- `/components/PortfolioDetailScreen.tsx` - Stock/crypto holdings

### Modals (Asset/Liability Entry)
- `/components/ConnectBankModal.tsx` - TrueLayer bank connection (mock)
- `/components/AddManualPortfolioModal.tsx` - Manual stock/crypto entry
- `/components/AddPropertyModal.tsx` - Real estate entry
- `/components/AddMortgageModal.tsx` - Mortgage entry
- `/components/ConnectCreditCardModal.tsx` - Credit card connection

### Design System
- `/styles/globals.css` - Design tokens, typography, colors
- `/components/ui/*` - Reusable UI components (buttons, modals, etc.)

---

## Design System

### Colors
- **Background**: `#FAFAFA` (light), `#1A1A1A` (dark)
- **Card**: `#FFFFFF` (light), `#262626` (dark)
- **Borders**: `#E5E5E5` (subtle)
- **Text**: `#1A1A1A` (primary), `#737373` (muted)

### Typography
- **Premium restraint**: No flashy fonts, emphasis on clarity
- **Hierarchy**: Clear visual weight without over-styling
- **iOS native feel**: San Francisco font aesthetic

### Principles
- ✅ **Uber-like modernism**: Clean, minimal, functional
- ✅ **JPM/private banking restraint**: Sophisticated, never flashy
- ✅ **No gradients**: Flat colors only
- ✅ **Subtle shadows**: Elevation through soft shadows
- ✅ **Card-based UI**: Information grouped in clear containers

---

## Business Model Context

### Original Plan (Deprecated)
- £149/year subscription via RevenueCat
- Paywall on app launch
- Required FCA regulation

### Current Plan (Invite-Only)
- **No subscription** during private beta
- **Invite-only access** (5 invites per user)
- **Viral growth mechanics** (no ad spend)
- **Avoids FCA costs** while maintaining premium positioning
- Perfect for CV/portfolio (shows strategic thinking)

---

## Implementation Guidance

### DO ✅
- Reference UI patterns and component structure
- Copy business logic (validation rules, invite mechanics)
- Use design tokens as a guide for React Native styling
- Study user flows and state management
- Review error handling and edge cases

### DON'T ❌
- Copy-paste code directly into React Native
- Use web-specific libraries (React DOM, Tailwind CSS)
- Deploy this prototype as a production app
- Treat localStorage as production data persistence
- Use mock validation logic in production

---

## Converting to React Native

### Key Changes Needed

| Web (Current) | React Native (Target) |
|---------------|----------------------|
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<input>` | `<TextInput>` |
| Tailwind CSS classes | StyleSheet or styled-components |
| `localStorage` | `AsyncStorage` or Supabase |
| Browser APIs | Expo APIs (Linking, Sharing, LocalAuthentication) |

### Required Expo Libraries
- `expo-local-authentication` (Face ID)
- `expo-linking` (deep links for invites)
- `expo-sharing` (share invite functionality)
- `expo-auth-session` (Google OAuth)
- `@supabase/supabase-js` (backend)

---

## Documentation

### For Backend Implementation
See **`/INVITE_SYSTEM.md`** for:
- Why we pivoted from subscription to invite-only
- Complete backend architecture (3 options)
- Supabase database schemas
- React Native code examples
- Security considerations

### For Design Specifications
See **`/REGENT_CURSOR_SPEC.md`** for:
- Complete product specification
- Design system details
- Feature requirements
- User flows

---

## Running the Prototype

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (web only - not needed)
npm run build
```

Open `http://localhost:5173` and use the bottom navigation to explore screens.

---

## Questions?

This is a **design artifact**, not production code. When implementing:
1. Read `/INVITE_SYSTEM.md` for backend guidance
2. Adapt React components to React Native equivalents
3. Replace all mock data with Supabase calls
4. Implement proper authentication (Google OAuth + Face ID)
5. Connect TrueLayer for real bank data

**Current Status**: Design complete, ready for React Native implementation.

---

**Built with care for mass affluent professionals. 🏛️**
