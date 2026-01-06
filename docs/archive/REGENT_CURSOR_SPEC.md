# REGENT - Complete Product & Technical Specification
**Premium Net Worth Tracking for Mass Affluent Professionals**

*Version 1.0 - January 2026*  
*For Cursor AI Implementation - React Native (Expo)*

---

## ⚠️ **READ PROJECT_CONTEXT.MD FIRST - DO NOT START HERE**

**This is a comprehensive 3000+ line specification document.**

**For 95% of tasks, use `PROJECT_CONTEXT.md` instead.**

Only reference specific sections of THIS doc when:
- Building complex integrations (TrueLayer, Twelve Data, RevenueCat)
- Need detailed API specifications or OAuth flows
- Need complete user flow descriptions (e.g., "Flow 3: Connecting Bank Account")
- Need regulatory compliance details (FCA, disclaimers)
- Need complete design system specifications

**Start here:** Read `PROJECT_CONTEXT.md`, build feature, come back here only if stuck.

---

# TABLE OF CONTENTS

1. [TL;DR - Executive Summary](#1-tldr---executive-summary)
2. [Setup Requirements](#2-setup-requirements)
3. [User Flows](#3-user-flows)
4. [Screens Deep Dive](#4-screens-deep-dive)
5. [Data Models](#5-data-models)
6. [Design System](#6-design-system)
7. [Integrations](#7-integrations)
8. [Build Priorities](#8-build-priorities)
9. [Reference](#9-reference)

---

# 1. TL;DR - EXECUTIVE SUMMARY

## What is Regent?

Regent is a **premium iOS net worth tracking app** for mass affluent professionals (£100k–£1m net worth) who want **clarity, not coaching**. It combines Uber-like modernism with JPM/private banking restraint and quiet human warmth via muted NYC/London cityscapes.

**Core Value Proposition:**
- Discretion over gamification
- Professional elegance without sterility
- Financial clarity without condescension
- Premium experience worthy of the target market

## Target User

**Primary Persona: "The Grounded Achiever"**
- Age: 28-45
- Income: £100k–£250k/year
- Net worth: £100k–£1m
- Location: London, NYC, other major financial hubs
- Occupation: Senior professionals, consultants, tech leads, finance professionals
- Mindset: Values clarity and control, suspicious of gamification, appreciates discretion

**Key Behaviors:**
- Checks net worth weekly, not daily
- Wants to understand asset allocation at a glance
- Values privacy and data security
- Willing to pay for premium tools
- Expects banking-grade polish

## Why React Native (Expo)?

**Strategic Decision:**
- Faster development cycle than Swift/Xcode
- Leverage existing React knowledge
- Easier to iterate during learning phase
- Still delivers native iOS feel
- Easy to add Android later (bonus, not priority)

**Critical:** This is a **design prototype transitioning to production**. The Figma Make React web code serves as a reference, but we're rebuilding from scratch in React Native.

## Tech Stack

**Framework:** React Native (Expo)
- Expo SDK 52+
- TypeScript
- Expo Router for navigation

**Core Libraries:**
- **Auth:** @react-native-google-signin/google-signin + Expo Local Authentication (Face ID)
- **Storage:** AsyncStorage (SecureStore for sensitive data)
- **Charts:** Victory Native (react-native-victory)
- **Currency:** react-native-currency-input
- **State Management:** React Context API (keep it simple)
- **Subscriptions:** RevenueCat (replaces StoreKit 2 from prototype)

**External APIs:**
- **Banking:** TrueLayer (OAuth, no direct investment account access)
- **Stock Prices:** Twelve Data API
- **Auth:** Google OAuth 2.0

**Development Tools:**
- Expo Go for testing
- TestFlight for beta distribution
- Cursor AI for development

## Key Design Principles

1. **Restrained Modernism:** Clean, spacious, minimal decoration
2. **Muted Warmth:** Cityscapes, soft gradients, never cold
3. **Typography as Hierarchy:** Font weight and size create structure, not color
4. **Progressive Disclosure:** Show essentials, hide complexity
5. **No Gamification:** No streaks, no badges, no congratulations

## Core Architecture Decisions

**Data Flow:**
1. User enters assets/liabilities manually OR connects bank via TrueLayer
2. For stocks/ETFs, user enters ticker + quantity (manual portfolio entry)
3. Twelve Data API fetches live prices every 15 minutes
4. App calculates net worth locally (Assets - Liabilities)
5. All data stored locally (AsyncStorage/SecureStore)
6. No backend database (for now)

**Regulatory Compliance:**
- **NEVER connect directly to investment accounts** (avoid FCA regulation)
- TrueLayer only for bank account **balances**, not investment data
- Manual portfolio entry for all stocks/funds
- Clear disclaimer: "For informational purposes only"

## Three Core Screens

**1. Sign-Up Screen**
- Google OAuth authentication
- Clean, minimal design
- Sets up user profile

**2. Auth Screen (Login)**
- Face ID primary authentication
- PIN fallback (4-digit)
- Biometric permission handling

**3. Home Screen**
- **Card 1:** Net Worth Total (large, prominent)
- **Card 2:** Assets Breakdown (chart + list)
- **Card 3:** Liabilities Breakdown (chart + list)
- Bottom action: Add Asset/Liability (modal)

## Success Criteria

**This prototype is complete when:**
1. ✅ User can sign up with Google
2. ✅ User can authenticate with Face ID (PIN fallback)
3. ✅ User can add/edit/delete assets manually
4. ✅ User can add/edit/delete liabilities manually
5. ✅ User can connect bank account via TrueLayer
6. ✅ User can add stock portfolio (ticker + quantity)
7. ✅ App fetches live stock prices via Twelve Data
8. ✅ Net worth calculates correctly in real-time
9. ✅ Charts display asset/liability breakdowns
10. ✅ Currency selection works (GBP/USD/EUR)
11. ✅ Subscription paywall implemented (RevenueCat)
12. ✅ Data persists between sessions
13. ✅ App feels premium and polished

---

# 2. SETUP REQUIREMENTS

## Developer Accounts Needed

### 1. Apple Developer Account
**Why:** Required for Face ID, TestFlight, App Store submission  
**Cost:** £99/year  
**Setup:**
- Enroll at developer.apple.com
- Enable Face ID capability in App ID
- Create provisioning profiles

### 2. Google Cloud Platform
**Why:** Google OAuth authentication  
**Setup:**
- Create project at console.cloud.google.com
- Enable Google Sign-In API
- Create OAuth 2.0 credentials (iOS client ID)
- Configure consent screen
- Add bundle ID from Expo

### 3. TrueLayer Account
**Why:** Bank account connection (read-only balance access)  
**Cost:** Free sandbox, pay-per-use production  
**Setup:**
- Sign up at truelayer.com
- Create app in console
- Get client_id and client_secret
- Configure redirect URI (Expo deep link)
- Enable UK banks (Barclays, HSBC, Lloyds, etc.)
- **Important:** Only request "accounts" scope, NOT investments

### 4. Twelve Data Account
**Why:** Live stock/ETF price data  
**Cost:** Free tier (800 requests/day), $29/mo for more  
**Setup:**
- Sign up at twelvedata.com
- Get API key
- Test endpoints: /price, /quote, /time_series
- Note rate limits

### 5. RevenueCat Account
**Why:** Subscription management (replaces StoreKit 2)  
**Cost:** Free up to $10k MRR  
**Setup:**
- Sign up at revenuecat.com
- Create iOS app
- Configure App Store Connect integration
- Create entitlements: "premium"
- Create products: Annual (£149/year)

### 6. Expo Account
**Why:** Building and testing  
**Cost:** Free (Expo Application Services optional)  
**Setup:**
- Sign up at expo.dev
- Install EAS CLI: `npm install -g eas-cli`
- Link project: `eas init`

## Environment Setup

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn
- Xcode 15+ (for iOS simulator)
- Expo Go app (on physical iPhone for testing Face ID)

### Project Initialization
```bash
npx create-expo-app@latest regent-app --template
cd regent-app
npx expo install expo-router
```

### Required Dependencies
Install these packages (Cursor will handle this, but list for reference):
- expo-local-authentication (Face ID)
- @react-native-google-signin/google-signin
- @react-native-async-storage/async-storage
- expo-secure-store
- react-native-victory (charts)
- react-native-currency-input
- react-native-revenuecat (RevenueCat SDK)
- axios (API calls)

### Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_TRUELAYER_CLIENT_ID=your_truelayer_client_id
EXPO_PUBLIC_TRUELAYER_CLIENT_SECRET=your_truelayer_secret
EXPO_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_key
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_key
```

**Security Note:** Never commit `.env` to GitHub. Use `.env.example` as template.

## API Registration Checklist

Before building, register and test:
- [ ] Google OAuth credentials (iOS)
- [ ] TrueLayer app with redirect URI
- [ ] Twelve Data API key with test requests
- [ ] RevenueCat products configured
- [ ] Expo project linked

---

# 3. USER FLOWS

## Flow 1: First-Time User Onboarding

**Scenario:** User downloads Regent for the first time.

### Step-by-Step Journey

1. **App Launch → Sign-Up Screen**
   - User sees: Regent logo, tagline, cityscape background
   - CTA: "Sign in with Google" button

2. **User Taps "Sign in with Google"**
   - Google OAuth sheet appears (native iOS sheet)
   - User selects Google account
   - Permissions: Basic profile info (name, email)

3. **Google Auth Success → Face ID Setup**
   - App requests Face ID permission
   - iOS system alert: "Regent would like to use Face ID"
   - User taps "OK"

4. **Face ID Permission Granted → PIN Setup**
   - Screen shows: "Create your 4-digit PIN"
   - Purpose: "Use this as a backup if Face ID is unavailable"
   - User enters PIN twice (confirmation)

5. **PIN Created → Currency Selection**
   - Modal appears: "Choose your primary currency"
   - Options: GBP (£), USD ($), EUR (€)
   - Default: GBP (based on device region if possible)

6. **Currency Selected → Home Screen (Empty State)**
   - Shows three empty cards:
     - Net Worth: £0
     - Assets: "No assets yet"
     - Liabilities: "No liabilities yet"
   - Large CTA: "Add your first asset"

**Edge Cases:**
- User denies Face ID → Show warning: "PIN will be your only login method"
- User denies Google → Can't proceed (required for MVP)
- User closes app mid-setup → Resume where left off (store setup progress)

---

## Flow 2: Adding First Asset (Manual Entry)

**Scenario:** User wants to add a bank account balance manually.

### Step-by-Step Journey

1. **User Taps "Add Asset" on Home Screen**
   - Modal slides up from bottom
   - Title: "Add Asset"
   - Tabs: "Manual" | "Connect Bank" (Manual selected by default)

2. **User Fills Manual Entry Form**
   - Field 1: **Asset Name** (text input)
     - Placeholder: "e.g., Current Account, ISA, Emergency Fund"
   - Field 2: **Category** (dropdown)
     - Options: Cash, Property, Investments, Other
   - Field 3: **Value** (currency input)
     - Shows currency symbol based on user's selection (£, $, €)
     - Large, centered, easy to tap
     - Format: £15,000 (comma-separated, 2 decimals)
   - CTA: "Add Asset" button (bottom of modal)

3. **User Taps "Add Asset"**
   - Validation:
     - Name required (show error if empty)
     - Value must be > 0
   - If valid:
     - Modal closes
     - Asset appears in Assets card
     - Net worth updates immediately
     - Smooth animation (card expands, number counts up)

4. **Home Screen Updates**
   - Net Worth card: Shows new total (e.g., £15,000)
   - Assets card: Shows chart (if multiple assets) or single item
   - Liabilities card: Still empty

**Edge Cases:**
- User enters text in value field → Block non-numeric input
- User enters negative value → Show error: "Asset value must be positive"
- User taps outside modal → Ask: "Discard changes?" (if fields filled)

---

## Flow 3: Connecting Bank Account (TrueLayer)

**Scenario:** User wants to connect their Barclays current account.

### Step-by-Step Journey

1. **User Taps "Connect Bank" Tab in Add Asset Modal**
   - Screen shows: List of supported UK banks (logos + names)
   - Search bar at top
   - Banks: Barclays, HSBC, Lloyds, Nationwide, Santander, etc.

2. **User Taps "Barclays"**
   - TrueLayer OAuth flow begins
   - Opens in-app browser (WebView)
   - Shows Barclays login page (official TrueLayer interface)

3. **User Logs into Barclays**
   - Enters online banking credentials
   - Completes 2FA (if required)
   - Sees permission screen: "Regent wants to view your account balances"
   - User approves

4. **TrueLayer Returns Data**
   - App receives:
     - Account name (e.g., "Current Account")
     - Account balance (e.g., £8,456.32)
     - Account type (checking/savings)
   - Modal closes
   - Asset auto-created with:
     - Name: "Barclays Current Account"
     - Category: Cash
     - Value: £8,456.32
     - Source: "TrueLayer" (tagged for auto-refresh)

5. **Home Screen Updates**
   - Net worth recalculates
   - Assets card shows connected account
   - Badge: "Connected" (visual indicator)

**Subsequent Refreshes:**
- TrueLayer refreshes balance every 24 hours (background)
- User can manually refresh by pulling down on Home Screen
- If TrueLayer token expires → Prompt to reconnect

**Edge Cases:**
- User cancels bank login → Return to modal, show message: "Connection cancelled"
- Bank login fails → Show error: "Unable to connect. Please try again."
- TrueLayer returns no accounts → Show error: "No accounts found."
- User connects multiple accounts → Each becomes separate asset

---

## Flow 4: Adding Stock Portfolio

**Scenario:** User owns 50 shares of Apple stock and wants to track its value.

### Step-by-Step Journey

1. **User Taps "Add Asset" → Manual Tab**
   - Selects Category: **"Investments"**
   - New field appears: **"Is this a stock/ETF?"** (toggle)

2. **User Toggles "Stock/ETF" ON**
   - Form changes:
     - Field 1: **Ticker Symbol** (text input)
       - Placeholder: "e.g., AAPL, VUSA.L, MSFT"
     - Field 2: **Quantity** (number input)
       - Placeholder: "Number of shares"
     - Field 3: **Currency** (dropdown)
       - Options: GBP, USD, EUR
       - Default: User's primary currency
     - Field 4: **Current Value** (read-only, auto-calculated)
       - Shows live price × quantity
       - Example: "50 shares × $185.23 = $9,261.50"

3. **User Enters Ticker "AAPL"**
   - App calls Twelve Data API: `/price?symbol=AAPL`
   - Shows loading spinner
   - Returns: Current price $185.23
   - Displays below ticker field: "Apple Inc. • $185.23"

4. **User Enters Quantity "50"**
   - Current Value auto-calculates: $9,261.50
   - Converts to user's currency if needed (e.g., £7,200 if GBP selected)

5. **User Taps "Add Asset"**
   - Asset created with:
     - Name: "Apple Inc. (AAPL)"
     - Category: Investments
     - Value: £7,200 (converted)
     - Metadata: ticker, quantity, last_price, currency
     - Source: "TwelveData" (tagged for auto-refresh)

6. **Home Screen Updates**
   - Net worth includes stock value
   - Assets card shows "Apple Inc. (AAPL)" with live price indicator
   - Price refreshes every 15 minutes (background)

**Price Updates:**
- During market hours: Every 15 minutes
- Outside market hours: Last closing price (show "Closed" badge)
- User can manually refresh

**Edge Cases:**
- Invalid ticker → Show error: "Ticker not found. Try again."
- API rate limit exceeded → Use cached price, show warning
- Twelve Data API down → Use last known price, show "Price may be outdated"
- User owns multiple positions → Each is separate asset (allow duplicates)

---

## Flow 5: Adding Liability (Manual)

**Scenario:** User has a £15,000 car loan to track.

### Step-by-Step Journey

1. **User Taps "Add Liability" Button on Home Screen**
   - Modal slides up (similar to Add Asset)
   - Title: "Add Liability"
   - Only Manual entry (no bank connection for liabilities in MVP)

2. **User Fills Form**
   - Field 1: **Liability Name** (text input)
     - Placeholder: "e.g., Mortgage, Car Loan, Credit Card"
   - Field 2: **Category** (dropdown)
     - Options: Mortgage, Loan, Credit Card, Other
   - Field 3: **Amount Owed** (currency input)
     - Shows currency symbol
     - User enters: £15,000

3. **User Taps "Add Liability"**
   - Validation (same as assets)
   - Modal closes
   - Liability appears in Liabilities card
   - Net worth decreases (Assets - Liabilities)

4. **Home Screen Updates**
   - Net Worth card: Recalculates (e.g., £23,000 assets - £15,000 liabilities = £8,000)
   - Liabilities card: Shows chart + list
   - Visual: Liabilities displayed in muted red/orange (not alarming, but distinct)

**Edge Cases:**
- User enters negative amount → Block and show error
- Net worth becomes negative → Display clearly (not alarming, just factual)

---

## Flow 6: Editing/Deleting Assets or Liabilities

**Scenario:** User's savings account balance changed.

### Step-by-Step Journey

1. **User Taps on Asset Card in Home Screen**
   - Card expands to full-screen modal
   - Shows detailed list of all assets
   - Each item has: Name, Category, Value, Edit/Delete icons

2. **User Taps Edit Icon on "Emergency Fund"**
   - Opens edit modal (same form as Add Asset)
   - Fields pre-populated with current values
   - User changes value from £10,000 → £12,000

3. **User Taps "Save Changes"**
   - Asset updates
   - Net worth recalculates
   - Returns to detailed list

4. **User Swipes Left on Asset to Delete**
   - Shows red "Delete" button
   - User taps "Delete"
   - Confirmation alert: "Delete Emergency Fund? This cannot be undone."
   - User confirms

5. **Asset Deleted**
   - Removed from list
   - Net worth recalculates
   - Smooth fade-out animation

**Edge Cases:**
- User tries to delete connected bank account → Show warning: "This will disconnect your bank. You can reconnect anytime."
- User tries to delete only asset → Allow (net worth becomes £0)
- User edits stock ticker → Re-fetch price from Twelve Data

---

## Flow 7: Returning User Login (Face ID)

**Scenario:** User opens app the next day.

### Step-by-Step Journey

1. **App Launch → Auth Screen**
   - Shows: Regent logo, cityscape, Face ID icon
   - Text: "Authenticate to continue"
   - Face ID automatically prompts

2. **Face ID Success**
   - Immediate transition to Home Screen
   - Data loads from AsyncStorage
   - Stock prices refresh (if stale)

3. **Home Screen Appears**
   - Shows current net worth
   - All assets/liabilities visible
   - Live prices update if market open

**Face ID Failure Scenarios:**

**Scenario A: Face ID Fails (Face Not Recognized)**
- After 2 failed attempts → Show "Use PIN" button
- User taps → PIN entry screen
- User enters 4-digit PIN
- If correct → Home Screen
- If wrong → "Incorrect PIN. Try again" (3 attempts max)
- After 3 failed PIN attempts → Lock for 1 minute

**Scenario B: Face ID Unavailable (Device Issue)**
- Show PIN entry screen immediately
- Text: "Face ID unavailable. Use your PIN."

**Scenario C: User Disabled Face ID in Settings**
- App detects on launch
- Show alert: "Face ID is disabled. Enable in Settings or use PIN."
- PIN becomes primary method

---

## Flow 8: Currency Switching

**Scenario:** User relocates from London to NYC, wants to switch from GBP to USD.

### Step-by-Step Journey

1. **User Taps Settings Icon (Top Right of Home Screen)**
   - Opens Settings screen
   - Options: Currency, Face ID/PIN, Subscription, About, Logout

2. **User Taps "Currency"**
   - Shows current: GBP (£)
   - Options: GBP, USD, EUR
   - User selects USD ($)

3. **Confirmation Alert**
   - "Switch to USD? All values will be converted at current exchange rates."
   - User confirms

4. **App Converts All Values**
   - Fetches latest exchange rate (use public API like exchangerate-api.com)
   - Converts all assets/liabilities
   - Updates display: £ → $
   - Net worth shows in USD

5. **Returns to Home Screen**
   - All cards show USD
   - Future entries default to USD

**Edge Cases:**
- Exchange rate API unavailable → Use fallback rates (hardcoded, show warning)
- User switches currency frequently → Maintain original value + conversion (don't compound errors)

---

## Flow 9: Subscription Paywall (RevenueCat)

**Scenario:** User hits free tier limit (e.g., 3 assets max).

### Step-by-Step Journey

1. **User Tries to Add 4th Asset**
   - Paywall modal appears
   - Title: "Unlock Unlimited Tracking"
   - Features:
     - ✓ Unlimited assets & liabilities
     - ✓ Live stock price updates
     - ✓ Bank account connections
     - ✓ Priority support
   - Pricing:
     - Annual: £149/year
   - CTA: "Start 7-Day Free Trial" (then £149/year)

2. **User Taps "Start 7-Day Free Trial"**
   - RevenueCat handles:
     - App Store purchase flow
     - Receipt validation
     - Entitlement check
   - iOS shows subscription confirmation

3. **User Confirms Purchase**
   - RevenueCat grants "premium" entitlement
   - Paywall closes
   - User can now add unlimited assets
   - Badge in Settings: "Premium"

4. **Free Trial → Paid Subscription**
   - After 7 days, user charged £149
   - Recurring annually (until cancelled)
   - Managed in iOS Settings → Subscriptions

**Edge Cases:**
- User cancels trial → Reverts to free tier at end of trial period
- User already subscribed on another device → RevenueCat syncs entitlement
- User restores purchases → RevenueCat checks receipt, grants access

---

## Flow 10: Data Persistence & App Lifecycle

**Scenario:** User closes app, reopens later.

### Expected Behavior

**On App Close:**
- All data auto-saves to AsyncStorage
- No explicit "Save" button needed
- Real-time saves after each action (add/edit/delete)

**On App Reopen:**
- AsyncStorage loads all data
- Home Screen renders immediately (no loading screen)
- Stock prices refresh in background (show stale prices first)
- TrueLayer balances refresh if > 24 hours old

**Data Stored:**
- User profile (name, email, currency)
- Authentication (encrypted PIN in SecureStore)
- Assets array (all manual + connected)
- Liabilities array
- Last refresh timestamps
- RevenueCat entitlements (cached)

**Data NOT Stored:**
- Google OAuth tokens (handle via SDK)
- TrueLayer access tokens (refresh on demand)
- Twelve Data API responses (always fetch fresh)

---

# 4. SCREENS DEEP DIVE

## Screen 1: Sign-Up Screen

**Purpose:** First impression, Google OAuth entry point.

### Visual Design

**Background:**
- Full-screen cityscape image (muted, slightly desaturated)
- Suggested: NYC skyline at dusk, or London financial district
- Subtle gradient overlay (dark at top, lighter at bottom)

**Layout:**
- **Top Third:** Regent logo (centered, white, elegant serif)
- **Middle Third:** Tagline
  - Text: "Financial clarity for grounded achievers"
  - Font: Light weight, 18pt, white, centered
- **Bottom Third:** CTA button
  - "Sign in with Google" button
  - White background, rounded corners (12pt radius)
  - Google "G" logo + text in Google brand colors
  - Shadow for depth

**Typography:**
- Logo: Serif (Playfair Display or similar), 48pt, bold
- Tagline: Sans-serif (SF Pro), 18pt, light
- Button text: Sans-serif, 16pt, medium

**No Other Elements:**
- No fields, no footer text, no "Skip" option
- Clean, uncluttered, premium feel

### Interactions

**User Taps Button:**
- Google OAuth sheet slides up from bottom (native iOS)
- Smooth transition, no jarring full-screen takeover

**OAuth Success:**
- Immediate transition to Face ID setup (no loading screen needed)

**OAuth Failure:**
- Alert: "Unable to sign in. Please try again."
- Button becomes tappable again

### States

1. **Default:** Button inactive, ready to tap
2. **Loading:** Button shows spinner (after tap, before OAuth sheet)
3. **Error:** Alert overlays screen

### Edge Cases

- User denies Google permission → Can't proceed (required)
- Network offline → Error message: "No internet connection"
- Google account already registered → Log in (skip setup)

---

## Screen 2: Auth Screen (Face ID/PIN)

**Purpose:** Secure authentication for returning users.

### Visual Design

**Background:**
- Same cityscape theme as Sign-Up
- Slightly different image (variety)

**Layout:**
- **Top Third:** Regent logo (smaller than Sign-Up, 32pt)
- **Middle:** Face ID icon (iOS system icon, 80pt, white)
- **Below Icon:** Text
  - "Authenticate to continue"
  - Font: Sans-serif, 16pt, white, centered
- **Bottom:** "Use PIN" button (small, text-only, white, underlined)

**Face ID Prompt:**
- iOS native Face ID alert appears automatically on screen load
- App doesn't show custom UI during scanning

### Interactions

**On Screen Load:**
- Face ID automatically triggers (no button tap needed)
- User looks at device
- Success → Home Screen
- Failure → Show "Use PIN" button

**User Taps "Use PIN":**
- Transition to PIN entry screen
- 4-digit numeric keypad (iOS native style)
- Each digit masked (•••• format)

**PIN Entry:**
- User types 4 digits
- Auto-submits (no "Enter" button)
- Correct → Home Screen
- Incorrect → Shake animation, clear field, "Try again"

### States

1. **Face ID Active:** Icon animates (subtle pulse)
2. **Face ID Failed:** Icon changes to ⚠️, "Use PIN" button appears
3. **PIN Entry:** Keypad visible, dots fill as user types
4. **PIN Wrong:** Red shake animation, error text

### Edge Cases

- Face ID disabled on device → Skip to PIN immediately
- User forgets PIN → "Reset PIN" link (requires Google re-authentication)
- Too many failed attempts → Lock for 1 minute, show countdown

---

## Screen 3: Home Screen (Main Dashboard)

**Purpose:** Net worth overview, primary interaction hub.

### Visual Design

**Background:**
- Subtle gradient (light gray to off-white)
- Clean, spacious, not stark white

**Header:**
- **Top Left:** Regent wordmark (small, gray, 20pt)
- **Top Right:** Settings icon (gear, gray, 24pt)
- **Below Header:** Date
  - Text: "Monday, 5 January 2026"
  - Font: Sans-serif, 14pt, medium gray, left-aligned

**Main Content:** Three Cards (Vertical Stack)

### Card 1: Net Worth Total

**Visual:**
- Large white card, rounded corners (16pt), subtle shadow
- Padding: 24pt all sides
- **Label (Top):** "Net Worth"
  - Font: Sans-serif, 14pt, medium gray, uppercase, tracking +0.5pt
- **Amount (Center):** "£127,456"
  - Font: Sans-serif, 56pt, bold, dark gray
  - Comma-separated, no decimals (for visual clarity)
- **Change Indicator (Below Amount):** "+£3,200 this month"
  - Font: Sans-serif, 14pt, green (if positive), red (if negative)
  - Icon: ↑ (green) or ↓ (red)
- **Refresh Icon (Top Right):** Small circular arrow (gray, 20pt)

**Behavior:**
- Tappable → No action (static display)
- Pull down on screen → Refresh data (TrueLayer + Twelve Data)

### Card 2: Assets Breakdown

**Visual:**
- White card, same style as Card 1
- Padding: 20pt all sides
- **Header:**
  - Left: "Assets" label (14pt, gray, uppercase)
  - Right: Total amount "£152,456" (18pt, bold, dark gray)
- **Chart Section:**
  - Horizontal bar chart (stacked)
  - Categories: Cash, Property, Investments, Other
  - Colors:
    - Cash: Blue (#4A90E2)
    - Property: Green (#7ED321)
    - Investments: Purple (#9013FE)
    - Other: Gray (#9B9B9B)
  - Shows proportions (not labeled, visual glance)
- **List Section (Below Chart):**
  - Each asset item:
    - Left: Icon (category-specific) + Name
    - Right: Value
    - Font: 14pt, medium weight
    - Spacing: 12pt between items
  - Example:
    ```
    💰 Barclays Current Account        £8,456
    🏠 London Flat                    £125,000
    📈 Apple Inc. (AAPL)                £7,200
    ```
- **Footer:** "Add Asset" button (small, text + icon, gray)

**Behavior:**
- Tap card → Expands to full-screen detailed view
- Tap "Add Asset" → Opens Add Asset modal
- Tap individual asset → Edit/Delete options

**Chart Behavior:**
- Updates in real-time as assets change
- Smooth animation (bar segments grow/shrink)
- If only one asset → Show single-color bar (not empty)

### Card 3: Liabilities Breakdown

**Visual:**
- Identical structure to Assets card
- **Header:**
  - Left: "Liabilities" label
  - Right: Total amount "£25,000" (18pt, bold, dark gray)
- **Chart Section:**
  - Horizontal bar chart (stacked)
  - Categories: Mortgage, Loan, Credit Card, Other
  - Colors:
    - Mortgage: Dark blue (#2C3E50)
    - Loan: Orange (#F5A623)
    - Credit Card: Red (#D0021B)
    - Other: Gray (#9B9B9B)
- **List Section:**
  - Same format as Assets
  - Example:
    ```
    🏡 Mortgage                        £15,000
    🚗 Car Loan                         £8,000
    💳 Credit Card                      £2,000
    ```
- **Footer:** "Add Liability" button

**Behavior:**
- Same as Assets card

### Bottom Action Bar

**Visual:**
- Fixed at bottom of screen
- White background, top border (1px, light gray)
- Two buttons (side-by-side, equal width):
  - Left: "Add Asset" (blue background, white text)
  - Right: "Add Liability" (gray background, white text)
- Padding: 16pt vertical, 20pt horizontal

**Behavior:**
- Taps open respective modals

### Empty State (No Data)

**Net Worth Card:**
- Shows "£0" (not "—" or blank)
- No change indicator
- Text below: "Add your first asset to get started"

**Assets Card:**
- No chart
- Center-aligned text: "No assets yet"
- Large "Add Asset" button (primary CTA)

**Liabilities Card:**
- Same as Assets (empty state)

### Loading State (Data Refresh)

**During Refresh:**
- Small spinner appears next to "Net Worth" label
- Cards remain visible (show stale data)
- After refresh completes → Smooth counter animation for changed values

### States

1. **Default:** All data visible, interactive
2. **Refreshing:** Spinner visible, data updating
3. **Empty:** No assets/liabilities, prompts to add
4. **Error:** If API fails, show toast: "Unable to refresh prices"

### Interactions Summary

- Pull down → Refresh all data
- Tap card → Expand to details
- Tap "Add Asset/Liability" → Modal
- Tap individual item → Edit/Delete
- Tap Settings icon → Settings screen

---

## Screen 4: Add Asset Modal (Manual Entry)

**Purpose:** Manual asset entry form.

### Visual Design

**Modal Style:**
- Slides up from bottom (iOS native sheet behavior)
- White background
- Rounded top corners (16pt)
- Dismissible by swipe down

**Header:**
- **Left:** "Cancel" button (text, gray)
- **Center:** "Add Asset" title (18pt, bold)
- **Right:** Empty (for symmetry)

**Tabs (Below Header):**
- Two tabs: "Manual" | "Connect Bank"
- Active tab: Blue underline (3pt thick)
- Inactive tab: Gray text

### Manual Tab Form Fields

**Field 1: Asset Name**
- Label: "Name" (12pt, gray, uppercase)
- Input: Text field
- Placeholder: "e.g., Current Account, ISA"
- Border: Bottom border only (1pt, light gray)
- Focus state: Blue bottom border

**Field 2: Category**
- Label: "Category"
- Input: Dropdown (iOS native picker)
- Options: Cash, Property, Investments, Other
- Default: Cash
- Shows chevron (›) on right

**Field 3: Value**
- Label: "Value"
- Input: Currency input (large, centered)
- Format: £15,000.00
- Keypad: Numeric with decimal
- Currency symbol auto-displays based on user's setting
- Largest field (emphasis)

**Optional: Stock/ETF Toggle**
- Only appears if Category = "Investments"
- Toggle switch (iOS native)
- Label: "Is this a stock or ETF?"
- Default: Off

**If Stock/ETF Toggle ON:**
- **Field 3a: Ticker Symbol**
  - Label: "Ticker"
  - Placeholder: "e.g., AAPL, VUSA.L"
  - Auto-capitalize, trim whitespace
- **Field 3b: Quantity**
  - Label: "Shares"
  - Numeric input
  - Placeholder: "Number of shares"
- **Field 3c: Currency**
  - Dropdown: GBP, USD, EUR
  - Default: User's primary currency
- **Field 3d: Current Value (Read-Only)**
  - Shows: "50 shares × $185.23 = $9,261.50"
  - Auto-calculated
  - Gray text, italic

**Bottom Button:**
- "Add Asset" button
- Full width (minus 40pt padding)
- Blue background, white text, rounded (12pt)
- Disabled if Name empty or Value = 0

### Connect Bank Tab

**Visual:**
- List of UK banks (logos + names)
- Search bar at top
- Each bank item:
  - Left: Bank logo (40pt square)
  - Center: Bank name (16pt, bold)
  - Right: Chevron (›)
- Tappable rows

**Banks List:**
- Barclays
- HSBC
- Lloyds
- Nationwide
- Santander
- NatWest
- (and others supported by TrueLayer)

### Interactions

**User Taps "Manual" Tab:**
- Shows form fields
- Focus on Name field (keyboard appears)

**User Taps "Connect Bank" Tab:**
- Shows bank list
- Search bar active

**User Fills Form:**
- Real-time validation
- Error states: Red border + text below field
- Example: "Name is required"

**User Taps "Add Asset":**
- If Stock/ETF → API call to Twelve Data (show spinner)
- If valid → Modal closes, Home Screen updates
- If error → Show alert

**User Taps "Cancel":**
- If fields empty → Close immediately
- If fields filled → Alert: "Discard changes?"

**User Taps Bank in Connect Bank Tab:**
- Opens TrueLayer OAuth flow (in-app browser)
- After success → Auto-creates asset(s)
- Modal closes, returns to Home Screen

### States

1. **Default:** Empty form, button disabled
2. **Typing:** Fields filling, validation active
3. **Stock API Loading:** Spinner on value field
4. **Valid:** Button enabled (blue, solid)
5. **Error:** Red borders, error text visible

### Edge Cases

- Name too long → Truncate to 50 characters
- Ticker invalid → Show error after API call
- API timeout → Show: "Unable to fetch price. Add manually?"
- User adds duplicate ticker → Allow (separate holdings)

---

## Screen 5: Edit Asset Modal

**Purpose:** Modify existing asset.

### Visual Design

**Header:**
- "Edit Asset" title (not "Add Asset")

**Form Fields:**
- Pre-populated with current values
- Same layout as Add Asset modal
- Bottom button: "Save Changes" (not "Add Asset")

**Additional Option:**
- "Delete Asset" button at very bottom
- Red text, no background
- Shows confirmation alert on tap

### Interactions

**User Changes Value:**
- Real-time update (no "Save" until button tap)

**User Taps "Save Changes":**
- Updates AsyncStorage
- Modal closes
- Home Screen reflects changes

**User Taps "Delete Asset":**
- Alert: "Delete [Asset Name]? This cannot be undone."
- Options: "Delete" (red) | "Cancel"
- If Delete → Asset removed, modal closes

### States

1. **Default:** Current values shown
2. **Editing:** Values changing
3. **Saving:** Button shows spinner
4. **Deleting:** Alert visible

---

## Screen 6: Assets Detail Screen (Full View)

**Purpose:** See all assets in one list.

### Visual Design

**Layout:**
- Full screen (not modal)
- White background
- **Header:**
  - Left: Back arrow (← "Home")
  - Center: "Assets" title (20pt, bold)
  - Right: "Add" button (+ icon)
- **Total Section (Top):**
  - Large number: "£152,456"
  - Label below: "Total Assets"
  - Subtle background (light blue tint)
- **Chart Section:**
  - Same horizontal bar chart from Home Screen
  - Slightly larger (more detail)
  - Legend below chart (color dots + labels)
- **List Section:**
  - Grouped by category
  - Section headers: "Cash", "Property", etc.
  - Each item:
    - Left: Icon + Name
    - Right: Value + Edit icon (pencil)
  - Swipe left → Delete button

### Interactions

**User Taps Item:**
- Opens Edit Asset modal

**User Swipes Left:**
- Red "Delete" button appears
- Tap → Confirmation → Delete

**User Taps "Add":**
- Opens Add Asset modal

**User Taps Back:**
- Returns to Home Screen

---

## Screen 7: Settings Screen

**Purpose:** App configuration, account management.

### Visual Design

**Layout:**
- Full screen
- **Header:**
  - Left: Back arrow
  - Center: "Settings" title
- **Profile Section (Top):**
  - User avatar (Google profile photo, 60pt circle)
  - Name below (from Google)
  - Email below name (gray, 14pt)
  - Subscription badge: "Premium" or "Free" (pill shape)

**Settings List:**
- Grouped sections (iOS native style)

**Section 1: Preferences**
- Currency (shows current: GBP, USD, EUR)
- Face ID & PIN
- Notifications (toggle)

**Section 2: Subscription**
- Manage Subscription
- Restore Purchases

**Section 3: About**
- Version (gray, small text)
- Privacy Policy (opens web view)
- Terms of Service (opens web view)
- Contact Support (mailto link)

**Section 4: Account**
- Log Out (red text)

### Interactions

**User Taps "Currency":**
- Opens Currency Selection screen
- Shows: GBP, USD, EUR (radio buttons)
- Select → Confirmation → Convert all values

**User Taps "Face ID & PIN":**
- Opens security settings
- Options:
  - Face ID (toggle)
  - Change PIN
  - Reset PIN (requires Google re-auth)

**User Taps "Manage Subscription":**
- If Premium → Opens iOS Subscription Settings (deep link)
- If Free → Opens paywall modal

**User Taps "Restore Purchases":**
- RevenueCat checks receipt
- Shows alert: "Subscription restored" or "No subscription found"

**User Taps "Log Out":**
- Alert: "Are you sure? Data is stored locally."
- Options: "Log Out" (red) | "Cancel"
- If Log Out → Clear AsyncStorage (except encrypted data), return to Sign-Up Screen

---

## Screen 8: Paywall Modal

**Purpose:** Subscription upsell.

### Visual Design

**Modal Style:**
- Full screen (not bottom sheet)
- Dark gradient background (premium feel)
- Dismissible: X icon (top right)

**Content:**
- **Top:** Icon/Image (abstract, elegant)
- **Title:** "Unlock Unlimited Tracking"
  - Font: 32pt, bold, white, centered
- **Subtitle:** "For serious wealth builders"
  - Font: 18pt, light, white, centered

**Features List:**
- ✓ Unlimited assets & liabilities
- ✓ Live stock price updates
- ✓ Bank account connections
- ✓ Priority support
- ✓ Export to CSV (future feature teaser)

Each feature:
- Left: Checkmark icon (green)
- Right: Text (16pt, white)
- Spacing: 16pt between items

**Pricing Display:**

**Single Pricing Card (Centered):**
- Solid white background
- Clean, minimal design
- "Annual" label (14pt, dark gray)
- "£149" large (48pt, dark gray, bold)
- "/year" small (14pt, gray)
- Subtext: "£4.16 per month" (14pt, muted gray)

**Bottom Button:**
- "Start 7-Day Free Trial"
- Full width, blue, rounded
- White text, 18pt, bold
- Subtext below: "Then £149/year. Cancel anytime."

**Footer:**
- Small text: "Terms apply" (link)
- Restore Purchases (link)

### Interactions

**User Taps "Start 7-Day Free Trial":**
- iOS purchase sheet appears
- Shows: "£149/year after 7-day trial"
- User confirms via Face ID/PIN
- RevenueCat validates
- Modal closes, user now Premium

**User Taps X:**
- Modal closes, user remains on Free tier

---

# 5. DATA MODELS

## User Profile

**Purpose:** Store user identity and preferences.

**Structure:**
```
User
├── id (string, unique, from Google)
├── email (string, from Google)
├── name (string, from Google)
├── profilePhotoUrl (string, from Google)
├── primaryCurrency (string: "GBP" | "USD" | "EUR")
├── createdAt (timestamp)
├── lastLoginAt (timestamp)
├── hasFaceIDEnabled (boolean)
├── hasCompletedOnboarding (boolean)
└── subscriptionStatus (string: "free" | "premium")
```

**Storage:** AsyncStorage, key: `@regent_user`

**Notes:**
- `id` from Google OAuth (sub claim)
- `primaryCurrency` defaults to GBP (or device region)
- `hasFaceIDEnabled` toggleable in Settings
- `subscriptionStatus` synced with RevenueCat

---

## Asset

**Purpose:** Represent any item that adds to net worth.

**Structure:**
```
Asset
├── id (string, unique, UUID)
├── name (string, user-defined)
├── category (string: "cash" | "property" | "investments" | "other")
├── value (number, in primary currency)
├── currency (string: "GBP" | "USD" | "EUR")
├── source (string: "manual" | "truelayer" | "twelvedata")
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── metadata (object, optional)
│   ├── accountId (string, if TrueLayer)
│   ├── bankName (string, if TrueLayer)
│   ├── ticker (string, if stock)
│   ├── quantity (number, if stock)
│   ├── lastPrice (number, if stock)
│   ├── lastPriceUpdate (timestamp, if stock)
│   └── truelayerRefreshToken (string, encrypted, if TrueLayer)
└── isConnected (boolean, true if TrueLayer/stock)
```

**Storage:** AsyncStorage, key: `@regent_assets` (array)

**Notes:**
- `value` always stored in user's primary currency (converted if needed)
- `metadata.ticker` uppercase, validated against Twelve Data
- `metadata.quantity` decimal allowed (for fractional shares)
- `metadata.lastPrice` cached, refreshed every 15 min
- `metadata.truelayerRefreshToken` stored in SecureStore, not AsyncStorage

---

## Liability

**Purpose:** Represent any debt that reduces net worth.

**Structure:**
```
Liability
├── id (string, unique, UUID)
├── name (string, user-defined)
├── category (string: "mortgage" | "loan" | "creditCard" | "other")
├── amount (number, in primary currency)
├── currency (string: "GBP" | "USD" | "EUR")
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

**Storage:** AsyncStorage, key: `@regent_liabilities` (array)

**Notes:**
- `amount` always positive (not negative)
- No external sources in MVP (all manual)

---

## Authentication State

**Purpose:** Secure PIN storage.

**Structure:**
```
AuthState
├── pinHash (string, bcrypt hashed)
├── hasFaceIDPermission (boolean)
└── failedAttempts (number)
```

**Storage:** SecureStore (encrypted), key: `@regent_auth`

**Notes:**
- Never store raw PIN
- `failedAttempts` resets on success, locks after 3 failures
- `hasFaceIDPermission` synced with iOS system permissions

---

## Net Worth Calculation

**Purpose:** Derived data (not stored).

**Calculation:**
```
Net Worth = (Sum of all Asset values) - (Sum of all Liability amounts)
```

**Real-Time Update Triggers:**
- Asset added/edited/deleted
- Liability added/edited/deleted
- Stock price refresh
- TrueLayer balance refresh
- Currency conversion

**Display Rules:**
- Show as integer (no decimals) for visual clarity
- Color code:
  - Positive: Dark gray (not green, too celebratory)
  - Negative: Dark gray (not red, no alarm)
- Change indicator:
  - Compare to 30 days ago (stored snapshot)
  - Show: "+£3,200 this month" or "-£500 this month"
  - Green/red for change only, not net worth itself

---

## Chart Data

**Purpose:** Visualization of asset/liability breakdown.

**Asset Chart Data Structure:**
```
AssetChartData
├── categories (array)
│   ├── name (string: "Cash", "Property", etc.)
│   ├── value (number, sum of assets in category)
│   ├── percentage (number, 0-100)
│   └── color (string, hex code)
└── total (number)
```

**Calculation:**
- Group assets by category
- Sum values per category
- Calculate percentages
- Sort by value (largest first)

**Liability Chart Data Structure:**
- Same structure as Asset Chart

**Display:**
- Horizontal stacked bar chart
- Each segment proportional to percentage
- Smooth animations on data change

---

## App State

**Purpose:** Runtime state management (not persisted).

**Structure:**
```
AppState
├── isLoading (boolean)
├── isRefreshing (boolean)
├── activeScreen (string)
├── modalVisible (boolean)
├── selectedAsset (Asset | null)
├── selectedLiability (Liability | null)
└── errorMessage (string | null)
```

**Management:** React Context API

**Notes:**
- `isLoading` for initial data load
- `isRefreshing` for pull-to-refresh
- `errorMessage` for toast notifications

---

## Subscription State

**Purpose:** RevenueCat entitlements.

**Structure:**
```
SubscriptionState
├── isActive (boolean)
├── productId (string: "annual")
├── expiresAt (timestamp)
├── isInTrialPeriod (boolean)
└── willRenew (boolean)
```

**Storage:** Cached in AsyncStorage, key: `@regent_subscription`

**Source of Truth:** RevenueCat API (always validate on app launch)

**Free Tier Limits:**
- Max 3 assets
- Max 2 liabilities
- No TrueLayer connections
- No stock tracking
- Manual entry only

**Premium Tier:**
- Unlimited everything
- Live stock prices
- Bank connections
- Priority support

---

## Data Relationships

**Visual Hierarchy:**
```
User (1)
├── Assets (many)
│   └── Metadata (conditional)
└── Liabilities (many)

Net Worth = f(Assets, Liabilities)
Charts = f(Assets, Liabilities)
```

**Data Flow:**
```
User Action → Update AsyncStorage → Update React State → Re-render UI
External API → Update Asset Metadata → Recalculate Net Worth → Update UI
```

---

## Data Migration Strategy

**Purpose:** Handle app updates without breaking existing user data.

**Approach:**
- Store schema version: `@regent_version`
- On app launch, check version
- If outdated → Run migration scripts
- Example: v1 → v2 (add currency field to assets)

**Migration Script Logic (Conceptual):**
1. Read `@regent_version`
2. If v1 → Add `currency: "GBP"` to all assets
3. Update `@regent_version` to v2
4. Continue app launch

---

# 6. DESIGN SYSTEM

## Core Principles

1. **Restrained Modernism:** Clean lines, ample whitespace, no ornamentation
2. **Muted Warmth:** Soft colors, never stark or cold
3. **Typography Hierarchy:** Font size and weight convey importance, not color
4. **Subtle Depth:** Shadows and gradients suggest layers without being heavy
5. **Professional Discretion:** No bright colors, no playful elements

---

## Color Palette

### Primary Colors

**Background:**
- `bg-primary`: #F8F9FA (Off-white, slight gray tint)
- `bg-card`: #FFFFFF (Pure white for cards)
- `bg-overlay`: rgba(0, 0, 0, 0.6) (Modal overlays)

**Text:**
- `text-primary`: #2C3E50 (Dark gray, almost black)
- `text-secondary`: #95A5A6 (Medium gray)
- `text-tertiary`: #BDC3C7 (Light gray)
- `text-inverse`: #FFFFFF (White, for dark backgrounds)

**Accent:**
- `accent-blue`: #4A90E2 (Primary CTA, links)
- `accent-green`: #7ED321 (Positive indicators, success states)
- `accent-red`: #D0021B (Negative indicators, delete actions)
- `accent-orange`: #F5A623 (Warnings, attention)

### Category Colors (Assets/Liabilities)

**Assets:**
- `category-cash`: #4A90E2 (Blue)
- `category-property`: #7ED321 (Green)
- `category-investments`: #9013FE (Purple)
- `category-other`: #9B9B9B (Gray)

**Liabilities:**
- `category-mortgage`: #2C3E50 (Dark blue)
- `category-loan`: #F5A623 (Orange)
- `category-creditCard`: #D0021B (Red)
- `category-other-liability`: #9B9B9B (Gray)

### Gradients

**Cityscape Overlay (Sign-Up/Auth Screens):**
- Gradient: Linear, top to bottom
- Start: rgba(0, 0, 0, 0.7)
- End: rgba(0, 0, 0, 0.3)

**Card Subtle Glow (Optional):**
- Gradient: Radial, center outward
- Start: rgba(74, 144, 226, 0.05)
- End: rgba(74, 144, 226, 0)

---

## Typography

### Font Families

**Primary (Sans-Serif):** SF Pro (iOS native)
- Use for: Body text, buttons, labels, UI elements

**Secondary (Serif):** Playfair Display (or similar elegant serif)
- Use for: Logo, large numbers (net worth display)

### Font Sizes

**Display (Numbers):**
- `display-large`: 56pt (Net worth on Home Screen)
- `display-medium`: 32pt (Paywall pricing)

**Headings:**
- `heading-1`: 32pt (Screen titles)
- `heading-2`: 24pt (Section headers)
- `heading-3`: 20pt (Card headers)

**Body:**
- `body-large`: 18pt (Important text, CTAs)
- `body-regular`: 16pt (Default body text)
- `body-small`: 14pt (Labels, secondary text)
- `body-tiny`: 12pt (Footnotes, disclaimers)

### Font Weights

- `light`: 300 (Taglines, subtle text)
- `regular`: 400 (Default)
- `medium`: 500 (Emphasis, labels)
- `semibold`: 600 (Buttons, important info)
- `bold`: 700 (Headings, large numbers)

### Line Heights

- Display: 1.1 (tight, for large numbers)
- Headings: 1.2
- Body: 1.5 (comfortable reading)

### Letter Spacing

- Uppercase labels: +0.5pt (subtle tracking)
- Body text: 0 (default)
- Large numbers: -1pt (tighter, more elegant)

---

## Spacing Scale

**Base Unit:** 4pt

**Scale:**
- `space-xs`: 4pt
- `space-sm`: 8pt
- `space-md`: 12pt
- `space-lg`: 16pt
- `space-xl`: 24pt
- `space-2xl`: 32pt
- `space-3xl`: 48pt

**Usage Guidelines:**
- Card padding: `space-xl` (24pt)
- Between cards: `space-lg` (16pt)
- Between form fields: `space-md` (12pt)
- Button padding: `space-lg` vertical, `space-xl` horizontal
- Screen margins: `space-xl` (20pt horizontal)

---

## Borders & Radii

**Border Widths:**
- `border-thin`: 1pt (Subtle separators)
- `border-medium`: 2pt (Active state underlines)
- `border-thick`: 3pt (Tab indicators)

**Border Radius:**
- `radius-sm`: 8pt (Small buttons, badges)
- `radius-md`: 12pt (Buttons, input fields)
- `radius-lg`: 16pt (Cards)
- `radius-full`: 9999pt (Circles, pills)

**Border Colors:**
- `border-light`: #E0E0E0 (Subtle separators)
- `border-medium`: #BDC3C7 (Form field borders)
- `border-dark`: #95A5A6 (Active/focus states)

---

## Shadows

**Card Shadow:**
- X: 0, Y: 2pt, Blur: 8pt, Spread: 0
- Color: rgba(0, 0, 0, 0.08)

**Modal Shadow:**
- X: 0, Y: 4pt, Blur: 16pt, Spread: 0
- Color: rgba(0, 0, 0, 0.12)

**Button Hover (Optional, if web):**
- X: 0, Y: 1pt, Blur: 4pt, Spread: 0
- Color: rgba(0, 0, 0, 0.1)

---

## Components

### Button Styles

**Primary Button:**
- Background: `accent-blue`
- Text: `text-inverse` (white)
- Padding: 16pt vertical, 24pt horizontal
- Border Radius: `radius-md`
- Font: `body-large`, `semibold`
- Shadow: Card shadow (optional)

**Secondary Button:**
- Background: Transparent
- Text: `accent-blue`
- Border: 1pt solid `accent-blue`
- Same padding/radius as Primary

**Destructive Button:**
- Background: `accent-red`
- Text: `text-inverse`
- Same structure as Primary

**Text Button:**
- Background: Transparent
- Text: `accent-blue`, underlined
- No border, no padding

### Input Field Styles

**Text Input:**
- Background: `bg-card` (white)
- Border: Bottom only, 1pt, `border-light`
- Focus Border: `accent-blue`, 2pt
- Padding: 12pt vertical
- Font: `body-regular`
- Placeholder: `text-tertiary`

**Currency Input:**
- Same as Text Input, but:
  - Font: `display-medium` (larger, centered)
  - Align: Center
  - Currency symbol: Prefix, same font size

**Dropdown (Picker):**
- iOS native style
- Background: `bg-card`
- Border: 1pt solid `border-light`
- Radius: `radius-md`
- Chevron (›) on right

### Card Styles

**Standard Card:**
- Background: `bg-card`
- Border Radius: `radius-lg`
- Padding: `space-xl`
- Shadow: Card shadow
- Margin: `space-lg` between cards

**Header Within Card:**
- Label: `body-small`, `text-secondary`, uppercase
- Value: `heading-3`, `text-primary`, bold

### Chart Styles

**Horizontal Bar Chart:**
- Height: 12pt
- Border Radius: `radius-full`
- No borders between segments (seamless)
- Segments: Category colors
- Background: `border-light` (if chart not full width)

**Legend:**
- Dot: 8pt circle, category color
- Label: `body-small`, `text-secondary`
- Spacing: 12pt between items

---

## Iconography

**Style:** Outlined (not filled), 2pt stroke

**Size:**
- Small: 16pt
- Medium: 24pt
- Large: 32pt
- Extra Large: 48pt (Face ID icon)

**Color:**
- Default: `text-secondary`
- Active: `accent-blue`
- Destructive: `accent-red`

**Icons Needed (Use SF Symbols on iOS):**
- Settings: gear
- Add: plus.circle
- Edit: pencil
- Delete: trash
- Refresh: arrow.clockwise
- Face ID: faceid
- Checkmark: checkmark.circle
- Bank: building.columns
- Stock: chart.line.uptrend.xyaxis
- Cash: banknote
- Property: house
- Mortgage: house.fill
- Loan: car
- Credit Card: creditcard

---

## Animations

**Principles:**
- Subtle, never jarring
- Fast (200-300ms typical)
- Ease-in-out curves
- Purposeful (convey state change)

**Types:**

**Modal Entry:**
- Slide up from bottom
- Duration: 300ms
- Easing: Ease-out

**Card Tap (Expand):**
- Scale from tap point
- Duration: 250ms
- Easing: Ease-in-out

**Number Counter (Net Worth Change):**
- Count up/down animation
- Duration: 600ms
- Easing: Linear

**Chart Update:**
- Bar segments grow/shrink
- Duration: 400ms
- Easing: Ease-in-out

**Delete Action:**
- Swipe left → red button appears (instant)
- On delete → fade out + slide left
- Duration: 250ms

**Loading Spinner:**
- Circular, indefinite rotation
- Size: 24pt
- Color: `accent-blue`

---

## Accessibility

**Principles:**
- Support Dynamic Type (iOS text size settings)
- Minimum tap target: 44pt × 44pt
- Color contrast: WCAG AA (4.5:1 for text)
- VoiceOver labels on all interactive elements

**Implementation:**
- All buttons: `accessibilityLabel`
- All inputs: `accessibilityHint`
- All icons: `accessibilityRole`
- Net worth: `accessibilityLabel="Net worth, £127,456"`

---

## Cityscape Image Guidelines

**Source:** Use Unsplash or similar high-quality stock images

**Criteria:**
- Muted colors (desaturated by 20-30%)
- NYC or London skylines preferred
- Time of day: Dusk, dawn, or overcast (not bright midday)
- No people in frame
- Focus: Wide shot, skyline recognizable but not dominant

**Suggested Searches:**
- "New York skyline dusk"
- "London financial district muted"
- "City skyline minimalist"

**Treatment:**
- Apply gradient overlay (as specified in Gradients section)
- Reduce opacity to 80% if too dominant
- Blur slightly (optional, for depth)

---

# 7. INTEGRATIONS

## Integration 1: Google OAuth

**Purpose:** User authentication, profile data.

### Setup

**Google Cloud Console:**
1. Create project: "Regent App"
2. Enable APIs: Google Sign-In API
3. Create OAuth 2.0 credentials:
   - Application type: iOS
   - Bundle ID: `com.regent.app` (or your bundle ID)
4. Configure OAuth consent screen:
   - App name: Regent
   - User support email: [your email]
   - Scopes: email, profile
5. Get Client ID (format: `xxxx.apps.googleusercontent.com`)

### Implementation Requirements

**Library:** `@react-native-google-signin/google-signin`

**Configuration:**
- Client ID from Google Cloud Console
- iOS URL scheme: `com.googleusercontent.apps.xxxx`

**Flow:**
1. User taps "Sign in with Google" button
2. App calls Google Sign-In SDK
3. iOS native sheet appears (Google account picker)
4. User selects account, grants permissions
5. SDK returns: `idToken`, `user` object
6. App extracts:
   - `user.id` (unique identifier)
   - `user.email`
   - `user.name`
   - `user.photo` (profile picture URL)
7. Store in AsyncStorage as User Profile
8. Navigate to Face ID setup

**Error Handling:**
- User cancels → Show toast: "Sign-in cancelled"
- Network error → Show alert: "No internet connection"
- Invalid credentials → Show alert: "Unable to sign in. Try again."

**Security:**
- Validate `idToken` on device (optional: backend validation later)
- Store `idToken` in SecureStore (for future API calls)
- Refresh token if expired (SDK handles automatically)

### API Endpoints (Conceptual)

**No backend needed for MVP**, but future API:
- POST `/auth/google` (send idToken, receive JWT)

### Testing

**Sandbox Mode:**
- Use personal Google account for testing
- Test scenarios:
  - First-time sign-in
  - Returning user
  - Multiple accounts
  - Account switched on device

---

## Integration 2: Face ID (Expo Local Authentication)

**Purpose:** Biometric authentication for returning users.

### Setup

**iOS Configuration:**
- Add `NSFaceIDUsageDescription` to `app.json`:
  - Text: "Regent uses Face ID to securely access your financial data."

**Capabilities:**
- Face ID permission requested on first use (iOS system prompt)

### Implementation Requirements

**Library:** `expo-local-authentication`

**Flow:**

**Setup (First-Time User):**
1. After Google sign-in, check if device supports Face ID:
   - `LocalAuthentication.hasHardwareAsync()`
   - `LocalAuthentication.isEnrolledAsync()`
2. If supported → Request permission:
   - `LocalAuthentication.authenticateAsync()`
   - iOS shows system alert: "Allow Face ID?"
3. User grants → Store `hasFaceIDEnabled: true`
4. Prompt user to create PIN (backup method)

**Login (Returning User):**
1. App launch → Auth Screen
2. Immediately trigger Face ID:
   - `LocalAuthentication.authenticateAsync()`
   - Reason: "Authenticate to access Regent"
3. Face ID success → Navigate to Home Screen
4. Face ID failure → Show "Use PIN" button

**Fallback to PIN:**
- After 2 Face ID failures → Show PIN entry
- User enters 4-digit PIN
- Validate against hashed PIN in SecureStore
- Correct → Home Screen
- Incorrect → "Try again" (max 3 attempts)
- After 3 failed attempts → Lock for 1 minute

### Security

**PIN Storage:**
- Never store raw PIN
- Hash PIN using bcrypt (or similar)
- Store hash in SecureStore: `@regent_auth`

**Biometric Data:**
- App never accesses actual biometric data (iOS handles)
- Only receives success/failure boolean

### Testing

**Scenarios:**
- Face ID success (immediate)
- Face ID failure (show PIN)
- Face ID unavailable (mask on, etc.)
- Device doesn't support Face ID → PIN only

---

## Integration 3: TrueLayer (Bank Connection)

**Purpose:** Read-only access to UK bank account balances.

### Setup

**TrueLayer Console:**
1. Sign up at truelayer.com/signup
2. Create app: "Regent"
3. Get credentials:
   - Client ID
   - Client Secret
4. Configure:
   - Redirect URI: `regent://auth/truelayer`
   - Permissions: `accounts` (NOT `investments`)
   - Environment: Sandbox (for testing), Production (for launch)
5. Enable banks: Barclays, HSBC, Lloyds, Santander, etc.

### Implementation Requirements

**Library:** Standard OAuth 2.0 (no native SDK, use WebView)

**Flow:**

**Connection:**
1. User taps "Connect Bank" in Add Asset modal
2. User selects bank (e.g., Barclays)
3. App opens TrueLayer OAuth URL in WebView:
   - `https://auth.truelayer.com/?client_id=xxx&scope=accounts&redirect_uri=regent://auth/truelayer`
4. User logs into bank (official bank interface, TrueLayer proxies)
5. User grants permission: "Allow Regent to view account balances?"
6. TrueLayer redirects to: `regent://auth/truelayer?code=xxx`
7. App captures `code`, exchanges for access token:
   - POST `https://auth.truelayer.com/connect/token`
   - Body: `client_id`, `client_secret`, `code`, `grant_type=authorization_code`
8. TrueLayer returns:
   - `access_token` (short-lived, 1 hour)
   - `refresh_token` (long-lived, 90 days)
9. App fetches accounts:
   - GET `https://api.truelayer.com/data/v1/accounts`
   - Headers: `Authorization: Bearer {access_token}`
10. TrueLayer returns array of accounts:
    ```
    [
      {
        "account_id": "abc123",
        "display_name": "Current Account",
        "account_type": "TRANSACTION",
        "currency": "GBP",
        "balance": {
          "available": 8456.32,
          "current": 8456.32
        }
      }
    ]
    ```
11. For each account, create Asset:
    - Name: "Barclays Current Account"
    - Category: Cash
    - Value: £8,456.32
    - Metadata: `accountId`, `bankName`, `refreshToken`
12. Store `refresh_token` in SecureStore (encrypted)

**Refresh:**
- Every 24 hours (or on user pull-to-refresh)
- Use `refresh_token` to get new `access_token`
- Fetch updated balances
- Update Asset values in AsyncStorage

**Disconnection:**
- User deletes connected account Asset → Remove `refresh_token`
- User can reconnect anytime (new OAuth flow)

### Security

**Tokens:**
- `access_token`: Never store (fetch fresh each time)
- `refresh_token`: Store in SecureStore (encrypted)

**Permissions:**
- Only request `accounts` scope
- NEVER request `investments` or `transactions` (avoid FCA regulation)

**Compliance:**
- Add disclaimer: "Regent is for informational purposes only. We do not provide financial advice."
- Terms of Service: Clarify read-only access, no investment management

### Error Handling

- Bank login fails → Show: "Unable to connect. Try again."
- TrueLayer API down → Show: "Service unavailable. Try later."
- Token expired → Prompt to reconnect
- Account not found → Show: "No accounts found at this bank."

### Testing

**Sandbox Mode:**
- TrueLayer provides test banks: "Mock Bank"
- Test credentials: Username `john`, Password `doe`
- Returns dummy account data

**Test Scenarios:**
- Connect single account
- Connect multiple accounts from one bank
- Connect accounts from multiple banks
- Refresh balances
- Token expiry
- Disconnection

---

## Integration 4: Twelve Data (Stock Prices)

**Purpose:** Live stock/ETF price data.

### Setup

**Twelve Data:**
1. Sign up at twelvedata.com
2. Get API key (free tier: 800 requests/day)
3. Test endpoint: `https://api.twelvedata.com/price?symbol=AAPL&apikey=xxx`

### Implementation Requirements

**Library:** Axios (or fetch)

**Endpoints:**

**Get Current Price:**
- URL: `https://api.twelvedata.com/price?symbol={TICKER}&apikey={API_KEY}`
- Method: GET
- Response:
  ```
  {
    "price": "185.23"
  }
  ```

**Get Quote (More Details):**
- URL: `https://api.twelvedata.com/quote?symbol={TICKER}&apikey={API_KEY}`
- Method: GET
- Response:
  ```
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "exchange": "NASDAQ",
    "currency": "USD",
    "close": "185.23",
    "datetime": "2026-01-05"
  }
  ```

**Supported Tickers:**
- US stocks: `AAPL`, `MSFT`, `GOOGL`, etc.
- UK stocks: `VUSA.L`, `VWRL.L` (London Stock Exchange, `.L` suffix)
- ETFs: `SPY`, `VOO`, `VTI`, etc.

### Flow

**Adding Stock Asset:**
1. User enters ticker: "AAPL"
2. App calls `/quote?symbol=AAPL`
3. If valid → Display: "Apple Inc. • $185.23"
4. User enters quantity: 50
5. App calculates value: 50 × $185.23 = $9,261.50
6. User confirms → Asset created with:
   - Name: "Apple Inc. (AAPL)"
   - Value: $9,261.50 (converted to user's currency if needed)
   - Metadata: `ticker`, `quantity`, `lastPrice`, `lastPriceUpdate`

**Price Refresh:**
- Every 15 minutes (during market hours)
- On app launch (if last update > 15 min ago)
- On user pull-to-refresh
- Process:
  1. Fetch all assets where `source = "twelvedata"`
  2. For each, call `/price?symbol={ticker}`
  3. Update `lastPrice` in metadata
  4. Recalculate value: `quantity × lastPrice`
  5. Update Asset value
  6. Recalculate net worth

**Market Hours:**
- US stocks: Mon-Fri, 9:30 AM - 4:00 PM ET
- UK stocks: Mon-Fri, 8:00 AM - 4:30 PM GMT
- Outside hours → Show "Market Closed" badge, use last closing price

### Rate Limiting

**Free Tier:** 800 requests/day
- ~33 requests/hour
- If user has 10 stock positions → 10 requests per refresh
- Refresh every 15 min → 4 refreshes/hour → 40 requests/hour
- Safe for free tier

**Premium Tier ($29/mo):** 3,000 requests/day

**Handling:**
- Cache prices locally (AsyncStorage)
- Only refresh if stale (> 15 min)
- If rate limit hit → Use cached prices, show warning: "Price updates paused. Limit reached."

### Error Handling

- Invalid ticker → "Ticker not found. Check spelling."
- API down → Use cached price, show "Price may be outdated"
- Rate limit → Use cached price, show "Update limit reached"
- Network error → Use cached price, show "No internet connection"

### Currency Conversion

**Problem:** User in GBP, stock priced in USD.

**Solution:**
1. Fetch stock price in native currency (USD)
2. Fetch exchange rate (e.g., GBP/USD = 1.27)
3. Convert: $9,261.50 ÷ 1.27 = £7,292
4. Store converted value in Asset
5. Display in user's currency

**Exchange Rate Source:**
- Use free API: `exchangerate-api.com`
- Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
- Returns all rates (GBP, EUR, etc.)
- Cache for 24 hours (rates don't change minute-to-minute)

### Testing

**Test Tickers:**
- AAPL (Apple)
- MSFT (Microsoft)
- VUSA.L (Vanguard S&P 500 ETF, London)
- Invalid: ZZZZ (should return error)

**Test Scenarios:**
- Add stock, see live price
- Refresh after 15 minutes
- Refresh during market close
- Invalid ticker
- Rate limit exceeded

---

## Integration 5: RevenueCat (Subscriptions)

**Purpose:** Manage in-app subscriptions, replace StoreKit 2.

### Setup

**RevenueCat Console:**
1. Sign up at revenuecat.com
2. Create project: "Regent"
3. Create iOS app:
   - Bundle ID: `com.regent.app`
   - App Store Connect API Key (upload from App Store Connect)
4. Create products:
   - Product ID: `regent_annual`
5. Create entitlement: `premium`
6. Link products to entitlement
7. Get API key (public key for SDK)

**App Store Connect:**
1. Create in-app purchases:
   - Type: Auto-renewable subscription
   - Product ID: `regent_annual`
   - Price: £149/year
   - Free trial: 7 days
2. Submit for review (required before testing)

### Implementation Requirements

**Library:** `react-native-purchases` (RevenueCat SDK)

**Configuration:**
- Public API key from RevenueCat
- Initialize SDK on app launch:
  ```
  Purchases.configure({ apiKey: "xxx" })
  ```

### Flow

**Paywall Trigger:**
- User tries to add 4th asset (free tier limit: 3)
- Paywall modal appears

**Purchase:**
1. User taps "Start 7-Day Free Trial"
2. App fetches offerings from RevenueCat:
   - `Purchases.getOfferings()`
3. RevenueCat returns annual product (£149/year)
4. App initiates purchase:
   - `Purchases.purchasePackage(annualPackage)`
5. iOS shows native subscription confirmation sheet (Face ID/PIN)
6. User confirms
7. RevenueCat validates receipt with Apple
8. RevenueCat returns customer info:
   ```
   {
     "entitlements": {
       "premium": {
         "isActive": true,
         "expiresDate": "2027-01-12"
       }
     }
   }
   ```
9. App grants access (user is now Premium)
10. Paywall closes

**Entitlement Check:**
- On app launch, check:
  ```
  const customerInfo = await Purchases.getCustomerInfo()
  const isPremium = customerInfo.entitlements.active.premium !== undefined
  ```
- If Premium → Allow unlimited assets/liabilities
- If Free → Enforce limits

**Free Trial:**
- 7 days, auto-converts to paid unless cancelled
- RevenueCat handles trial logic (no manual code)
- After trial → User charged £149 (annual subscription)

**Subscription Management:**
- User manages in iOS Settings → Subscriptions
- Cancel, change plan, etc. (Apple handles)
- RevenueCat syncs entitlement status

**Restore Purchases:**
- User taps "Restore Purchases" in Settings
- App calls: `Purchases.restoreTransactions()`
- RevenueCat checks Apple receipt
- If valid subscription found → Grant Premium entitlement
- Show alert: "Subscription restored" or "No subscription found"

### Testing

**Sandbox Testing:**
- Create sandbox Apple ID (App Store Connect → Users and Access)
- Sign in on device (Settings → App Store → Sandbox Account)
- Purchase subscriptions (no real charge)
- Test scenarios:
  - Free trial start
  - Trial conversion to paid
  - Subscription cancellation
  - Restore purchases
  - Multiple devices (entitlement syncs)

**Webhook (Future):**
- RevenueCat sends webhook events (renewal, cancellation, etc.)
- No backend needed for MVP (SDK handles sync)

### Error Handling

- Purchase cancelled → Show toast: "Purchase cancelled"
- Payment method issue → iOS shows alert (Apple handles)
- Network error → Show: "Unable to connect. Try again."
- Already subscribed → Skip purchase, grant access

---

## Integration 6: AsyncStorage & SecureStore

**Purpose:** Local data persistence.

### AsyncStorage

**Use Cases:**
- User profile
- Assets array
- Liabilities array
- App preferences (currency, etc.)
- Cached data (exchange rates, stock prices)

**Library:** `@react-native-async-storage/async-storage`

**API:**
- Set: `AsyncStorage.setItem(key, value)`
- Get: `AsyncStorage.getItem(key)`
- Remove: `AsyncStorage.removeItem(key)`
- Clear all: `AsyncStorage.clear()`

**Storage Keys:**
- `@regent_user` (User Profile object, JSON string)
- `@regent_assets` (Assets array, JSON string)
- `@regent_liabilities` (Liabilities array, JSON string)
- `@regent_subscription` (RevenueCat entitlements, cached)
- `@regent_exchange_rates` (Currency conversion rates)
- `@regent_version` (Schema version for migrations)

**Data Format:**
- Always JSON.stringify before storing
- JSON.parse after retrieving

**Error Handling:**
- Storage full → Show alert: "Device storage full"
- Read error → Use defaults (empty arrays)

### SecureStore

**Use Cases:**
- PIN hash (bcrypt)
- TrueLayer refresh tokens
- Google OAuth idToken

**Library:** `expo-secure-store`

**API:**
- Set: `SecureStore.setItemAsync(key, value)`
- Get: `SecureStore.getItemAsync(key)`
- Delete: `SecureStore.deleteItemAsync(key)`

**Storage Keys:**
- `@regent_auth` (PIN hash + failed attempts)
- `@regent_truelayer_tokens` (Refresh tokens, per bank)
- `@regent_google_token` (idToken for future API calls)

**Security:**
- Encrypted at rest (iOS Keychain)
- Requires device unlock (passcode/biometric)

**Error Handling:**
- Keychain unavailable → Fallback to AsyncStorage (less secure, warn user)

---

## Integration Summary

| Integration | Purpose | Library | API/SDK | Data Stored |
|-------------|---------|---------|---------|-------------|
| Google OAuth | Authentication | @react-native-google-signin | Google Cloud | User profile, idToken |
| Face ID | Biometric auth | expo-local-authentication | iOS LocalAuthentication | PIN hash (SecureStore) |
| TrueLayer | Bank balances | OAuth WebView | TrueLayer API | Refresh tokens (SecureStore) |
| Twelve Data | Stock prices | Axios | Twelve Data API | Cached prices (AsyncStorage) |
| RevenueCat | Subscriptions | react-native-purchases | RevenueCat SDK | Entitlements (cached) |
| AsyncStorage | Local storage | @react-native-async-storage | N/A | User data, assets, liabilities |
| SecureStore | Encrypted storage | expo-secure-store | iOS Keychain | PIN, tokens |

---

# 8. BUILD PRIORITIES

## Priority Framework

**P0 (Must Have - Core MVP):** Cannot launch without these.  
**P1 (Should Have - Polish):** Enhances experience, launch-ready with these.  
**P2 (Nice to Have - Future):** Post-launch features, not MVP-critical.

---

## P0: Core MVP Features

**Authentication:**
- ✅ Google OAuth sign-in
- ✅ Face ID authentication
- ✅ PIN fallback (4-digit)
- ✅ PIN setup on first login
- ✅ Basic error handling (network, permissions)

**Data Models:**
- ✅ User profile structure
- ✅ Asset structure (manual entry)
- ✅ Liability structure (manual entry)
- ✅ AsyncStorage implementation
- ✅ SecureStore for PIN

**Home Screen:**
- ✅ Net Worth card (total display)
- ✅ Assets card (list, no chart yet)
- ✅ Liabilities card (list, no chart yet)
- ✅ Add Asset button (opens modal)
- ✅ Add Liability button (opens modal)

**Add Asset/Liability:**
- ✅ Manual entry form (name, category, value)
- ✅ Validation (required fields, positive values)
- ✅ Save to AsyncStorage
- ✅ Update Home Screen immediately

**Edit/Delete:**
- ✅ Edit existing asset/liability
- ✅ Delete with confirmation
- ✅ Update net worth on change

**Currency:**
- ✅ Currency selection (GBP, USD, EUR)
- ✅ Display currency symbol throughout app
- ✅ Basic currency conversion (hardcoded rates acceptable for MVP)

**Navigation:**
- ✅ Sign-Up → Auth → Home flow
- ✅ Modal open/close (Add Asset/Liability)
- ✅ Basic Settings screen (logout only)

**Data Persistence:**
- ✅ Auto-save on every action
- ✅ Load data on app launch
- ✅ Handle app backgrounding/foregrounding

---

## P1: Polish & Full Features

**Charts:**
- ✅ Horizontal bar chart (Assets breakdown)
- ✅ Horizontal bar chart (Liabilities breakdown)
- ✅ Real-time chart updates (smooth animations)
- ✅ Category color coding

**Stock Tracking:**
- ✅ Stock/ETF toggle in Add Asset
- ✅ Ticker input with validation
- ✅ Twelve Data API integration
- ✅ Live price fetching
- ✅ Auto-refresh every 15 minutes
- ✅ Market hours detection
- ✅ Quantity × Price calculation
- ✅ Currency conversion for stocks

**Bank Connection:**
- ✅ TrueLayer OAuth flow
- ✅ Bank list (UK banks)
- ✅ Account balance fetching
- ✅ Auto-create Assets from accounts
- ✅ Refresh token storage (SecureStore)
- ✅ Balance refresh (24-hour cycle)
- ✅ Manual refresh (pull-to-refresh)

**Subscriptions:**
- ✅ RevenueCat SDK integration
- ✅ Paywall modal (triggered at 4th asset)
- ✅ Free tier limits (3 assets, 2 liabilities, no connections)
- ✅ Premium entitlement check
- ✅ Purchase flow (7-day trial)
- ✅ Restore purchases
- ✅ Subscription status display (Settings)

**Settings Screen:**
- ✅ User profile display (Google photo, name, email)
- ✅ Currency switcher
- ✅ Face ID toggle (enable/disable)
- ✅ Change PIN
- ✅ Subscription management
- ✅ Logout

**Design Polish:**
- ✅ Cityscape backgrounds (Sign-Up, Auth screens)
- ✅ Card shadows and depth
- ✅ Smooth animations (modal slides, number counters)
- ✅ Loading states (spinners, skeletons)
- ✅ Error states (toasts, alerts)
- ✅ Empty states (prompts to add data)

**Net Worth Insights:**
- ✅ Net worth change indicator ("+ £3,200 this month")
- ✅ Calculate change from 30-day snapshot
- ✅ Color-coded change (green up, red down)

**Detailed Views:**
- ✅ Assets detail screen (full list)
- ✅ Liabilities detail screen (full list)
- ✅ Grouped by category
- ✅ Swipe-to-delete

**Testing & Bug Fixes:**
- ✅ Test all user flows
- ✅ Handle edge cases (negative net worth, no data, etc.)
- ✅ Error handling (API failures, network issues)
- ✅ Rate limiting (Twelve Data)

---

## P2: Post-Launch Features

**Advanced Analytics:**
- ❌ Net worth over time (line chart)
- ❌ Asset allocation pie chart
- ❌ Historical snapshots (monthly)
- ❌ Export to CSV

**More Integrations:**
- ❌ Additional banks (beyond UK)
- ❌ Cryptocurrency tracking (Coinbase API)
- ❌ Property value estimates (Zoopla API)

**Smart Features:**
- ❌ Automatic asset categorization (ML)
- ❌ Bill reminders (credit card due dates)
- ❌ Goal setting ("Save £50k by 2027")
- ❌ Spending insights (if we add transactions - careful re: FCA)

**Social/Sharing:**
- ❌ Export snapshot as image
- ❌ Share net worth progress (anonymized)

**Backend (Future):**
- ❌ Cloud sync (multi-device)
- ❌ Secure backend for data backup
- ❌ Account recovery (if device lost)

**Multi-Currency:**
- ❌ Support multiple currencies simultaneously (not just primary)
- ❌ Real-time exchange rate updates

**Dark Mode:**
- ❌ Dark theme option
- ❌ Follow system appearance

**Notifications:**
- ❌ Daily/weekly net worth summary
- ❌ Stock price alerts

**Widgets:**
- ❌ iOS home screen widget (net worth glance)

---

## Critical Path (What to Build First)

**Week 1: Foundation**
1. Project setup (Expo, TypeScript, folder structure)
2. Design system (colors, typography, spacing as constants)
3. Google OAuth (Sign-Up Screen + auth flow)
4. Face ID + PIN (Auth Screen)
5. Basic navigation (Sign-Up → Auth → Home)

**Week 2: Core Functionality**
1. User profile storage (AsyncStorage)
2. Home Screen layout (three cards, empty state)
3. Add Asset modal (manual entry only)
4. Add Liability modal
5. Display assets/liabilities in cards (list view, no charts)
6. Net worth calculation and display

**Week 3: Data & Charts**
1. Edit/Delete flows
2. AsyncStorage persistence (save on every action)
3. Horizontal bar charts (Assets/Liabilities breakdown)
4. Currency selection (Settings)
5. Currency conversion (basic)

**Week 4: Integrations & Polish**
1. Twelve Data integration (stock tracking)
2. TrueLayer integration (bank connection)
3. RevenueCat integration (subscriptions)
4. Settings screen (full)
5. Animations and polish
6. Testing & bug fixes

**Week 5: Launch Prep**
1. TestFlight build
2. Beta testing with friends/family
3. Collect feedback
4. Final polish
5. App Store submission

---

## What NOT to Build (MVP)

**Avoid These:**
- ❌ Backend/cloud sync (local-only for now)
- ❌ Transaction tracking (risks FCA regulation)
- ❌ Investment performance analysis (too complex, risky)
- ❌ Social features (not core value prop)
- ❌ Budgeting tools (scope creep)
- ❌ Bill payment integration (out of scope)
- ❌ Financial advice/coaching (not our positioning)
- ❌ Gamification (streaks, badges, etc. - against brand)

**Why:**
- MVP should prove core value: **clarity on net worth**
- Every extra feature delays launch
- Regent's strength is restraint and focus

---

## Feature Gating (Free vs Premium)

**Free Tier (Max Limits):**
- 3 assets (manual entry only)
- 2 liabilities
- No bank connections
- No stock tracking
- Basic net worth calculation

**Premium Tier (£149/year):**
- Unlimited assets
- Unlimited liabilities
- Bank connections (TrueLayer)
- Stock tracking (live prices)
- Priority support (email)

**Why This Gating:**
- Free tier proves value (try net worth tracking)
- Premium unlocks convenience (automation via banks, live stocks)
- Clear upgrade incentive
- Aligns with target market (willing to pay for quality)

---

## Success Metrics (Post-Launch)

**Key Metrics to Track:**
1. **Sign-ups:** How many users download and complete onboarding?
2. **Activation:** % of users who add at least 1 asset
3. **Engagement:** % of users who return weekly
4. **Conversion:** % of free users who upgrade to Premium
5. **Retention:** % of Premium users who renew after trial
6. **Net Worth Tracked:** Median net worth of users (anonymized)

**Tools:**
- RevenueCat dashboard (subscription metrics)
- Expo Analytics (basic usage)
- App Store Connect (downloads, ratings)

**Target (First 3 Months):**
- 500 sign-ups
- 40% activation rate (200 users add assets)
- 10% conversion to Premium (50 paying users)
- £2,500/year revenue (50 × £149)

---

# 9. REFERENCE

## Figma to React Native Conversion Guide

**Key Differences:**

| Web (React) | React Native | Notes |
|-------------|--------------|-------|
| `<div>` | `<View>` | Container component |
| `<span>`, `<p>` | `<Text>` | Text must be in `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Button>` | Pressable elements |
| `<input>` | `<TextInput>` | Text inputs |
| `<img>` | `<Image>` | Images |
| CSS classes | StyleSheet | Inline styles or StyleSheet object |
| `onClick` | `onPress` | Event handler |
| Flexbox | Flexbox (default) | Same layout system |
| `px` units | Number (dp) | No units, just numbers |
| `:hover` | N/A (iOS) | Use `Pressable` with `pressed` state |

**Example:**
```
// Web (Figma Make output)
<div className="card" onClick={handleClick}>
  <p className="text">Hello</p>
</div>

// React Native
<TouchableOpacity style={styles.card} onPress={handleClick}>
  <Text style={styles.text}>Hello</Text>
</TouchableOpacity>
```

**Styling:**
- Tailwind → React Native StyleSheet
- No string-based styles in RN
- Use `StyleSheet.create()` for performance

---

## Common Pitfalls & Solutions

### Pitfall 1: Text Outside `<Text>`
**Problem:** In React Native, all text must be inside `<Text>` component.
```
// ❌ Wrong
<View>Hello World</View>

// ✅ Correct
<View>
  <Text>Hello World</Text>
</View>
```

### Pitfall 2: Inline Styles vs StyleSheet
**Problem:** Inline styles work but are less performant.
```
// ⚠️ Acceptable but not ideal
<View style={{ padding: 20, backgroundColor: '#FFF' }}>

// ✅ Better
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
  },
});
<View style={styles.container}>
```

### Pitfall 3: Absolute Positioning
**Problem:** Overuse of absolute positioning breaks responsive design.
**Solution:** Use Flexbox for layout, absolute positioning sparingly.

### Pitfall 4: Image Sources
**Problem:** Images require explicit dimensions in RN.
```
// ❌ Wrong (no size)
<Image source={{ uri: 'https://...' }} />

// ✅ Correct
<Image 
  source={{ uri: 'https://...' }} 
  style={{ width: 100, height: 100 }}
/>
```

### Pitfall 5: ScrollView Performance
**Problem:** Large lists in `<ScrollView>` lag.
**Solution:** Use `<FlatList>` for long lists (virtualizes off-screen items).

---

## TypeScript Patterns (for Reference)

**Note:** No code in this spec, but describe patterns Cursor should follow.

**Type Definitions:**
- Define types for User, Asset, Liability, etc.
- Use interfaces for object shapes
- Use union types for categories (e.g., `"cash" | "property"`)
- Use enums for constants (e.g., `Currency`)

**State Management:**
- Use React Context for global state (user, assets, liabilities)
- Use `useState` for local component state
- Use `useEffect` for side effects (API calls, data loading)

**Async Operations:**
- Use `async/await` for API calls
- Handle errors with `try/catch`
- Show loading states (spinners)

---

## Glossary

**Terms:**

- **Net Worth:** Total assets minus total liabilities.
- **Asset:** Anything owned with monetary value (cash, property, stocks).
- **Liability:** Any debt owed (mortgage, loan, credit card balance).
- **Ticker:** Stock symbol (e.g., AAPL for Apple).
- **OAuth:** Open standard for access delegation (used by Google, TrueLayer).
- **Face ID:** Apple's facial recognition biometric authentication.
- **PIN:** Personal Identification Number (4-digit backup for Face ID).
- **RevenueCat:** Third-party subscription management platform.
- **Entitlement:** RevenueCat term for subscription status (e.g., "premium").
- **TrueLayer:** Open banking platform for UK bank connections.
- **Twelve Data:** Stock market data API provider.
- **AsyncStorage:** React Native local storage (unencrypted).
- **SecureStore:** Expo's encrypted storage (uses iOS Keychain).
- **Paywall:** Screen prompting user to subscribe (upgrade from free to premium).
- **Free Tier:** Limited version of app (3 assets, 2 liabilities).
- **Premium Tier:** Paid subscription (unlimited, all features).
- **Sandbox:** Test environment (for TrueLayer, App Store, etc.).
- **Bundle ID:** Unique identifier for iOS app (e.g., `com.regent.app`).
- **TestFlight:** Apple's beta testing platform.
- **FCA:** Financial Conduct Authority (UK regulator).

---

## Compliance Notes

**Regulatory Considerations:**

**Why Regent Avoids FCA Regulation:**
- We do NOT connect directly to investment accounts
- TrueLayer only accesses bank account balances (not investment data)
- Users manually enter stock holdings (quantity + ticker)
- We fetch live prices (Twelve Data) but do NOT manage investments
- App is "for informational purposes only"

**Disclaimer (Include in App):**
- "Regent provides financial information for personal tracking purposes only. We do not provide investment advice, manage assets, or execute trades. Consult a qualified financial advisor for personalized advice."

**Terms of Service (Key Points):**
- Data stored locally on user's device
- No cloud storage of financial data (MVP)
- Read-only access to bank accounts (via TrueLayer)
- User responsible for accuracy of manual entries
- No guarantees on stock price accuracy (rely on Twelve Data)

**Privacy Policy (Key Points):**
- Google OAuth collects: email, name, profile photo
- TrueLayer collects: bank account balances (with user permission)
- No data shared with third parties (except auth/API providers)
- No analytics tracking (beyond RevenueCat subscription data)
- Data not used for advertising

**Future Considerations:**
- If adding transaction tracking → May trigger FCA regulation
- If offering investment advice → Requires FCA authorization
- If managing money on behalf of users → Full regulation applies
- For MVP: Stay read-only, informational, user-controlled

---

## Troubleshooting Guide

**Common Issues (for Cursor/You):**

### Issue: Face ID Not Working
**Symptoms:** Face ID prompt doesn't appear, or always fails.
**Solutions:**
- Check `NSFaceIDUsageDescription` in `app.json`
- Verify device supports Face ID (simulator doesn't fully support)
- Test on physical iPhone with Face ID enrolled
- Check iOS permissions (Settings → Regent → Face ID)

### Issue: TrueLayer Redirect Not Working
**Symptoms:** After bank login, app doesn't redirect back.
**Solutions:**
- Verify redirect URI matches TrueLayer console (`regent://auth/truelayer`)
- Check `app.json` for URL scheme configuration
- Test deep link with `npx uri-scheme open regent://auth/truelayer --ios`

### Issue: Stock Prices Not Updating
**Symptoms:** Prices are stale, or show "0.00".
**Solutions:**
- Check Twelve Data API key (valid, not rate-limited)
- Verify ticker format (US: `AAPL`, UK: `VUSA.L`)
- Check network connection
- Look for API errors in console logs

### Issue: Subscription Not Working
**Symptoms:** Purchase completes, but user still sees paywall.
**Solutions:**
- Check RevenueCat entitlements (`Purchases.getCustomerInfo()`)
- Verify products are linked to "premium" entitlement
- Test with sandbox Apple ID (not production account)
- Check RevenueCat dashboard for webhook errors

### Issue: Data Not Persisting
**Symptoms:** Assets disappear after closing app.
**Solutions:**
- Check AsyncStorage keys (correct `@regent_` prefix)
- Verify `AsyncStorage.setItem()` called after every change
- Check for errors in AsyncStorage (device storage full?)
- Test with console logs (`AsyncStorage.getItem()` returns expected data)

### Issue: Net Worth Calculation Wrong
**Symptoms:** Net worth doesn't match assets - liabilities.
**Solutions:**
- Check currency conversion (all values in same currency?)
- Verify asset/liability values are numbers (not strings)
- Look for negative assets or liabilities (should be positive)
- Recalculate on every data change (ensure state updates)

---

## Cursor-Specific Tips

**For Cursor AI Building This:**

**Start Here:**
1. Read this entire spec (don't skip sections)
2. Set up Expo project (`npx create-expo-app`)
3. Create folder structure: `/screens`, `/components`, `/utils`, `/types`
4. Define types first (User, Asset, Liability in `/types`)
5. Build design system constants (`/utils/design.ts`)
6. Build authentication flow (Google OAuth → Face ID → Home)
7. Build data layer (AsyncStorage helpers)
8. Build Home Screen (empty state)
9. Build Add Asset/Liability modals
10. Integrate APIs (Twelve Data, TrueLayer, RevenueCat)
11. Polish (animations, error handling, loading states)
12. Test on physical device (Face ID, deep links don't work in simulator)

**Key Files to Create:**
- `/screens/SignUpScreen.tsx` (Google OAuth)
- `/screens/AuthScreen.tsx` (Face ID/PIN)
- `/screens/HomeScreen.tsx` (Main dashboard)
- `/screens/SettingsScreen.tsx`
- `/components/AddAssetModal.tsx`
- `/components/AddLiabilityModal.tsx`
- `/components/NetWorthCard.tsx`
- `/components/AssetsCard.tsx`
- `/components/LiabilitiesCard.tsx`
- `/components/PaywallModal.tsx`
- `/utils/storage.ts` (AsyncStorage helpers)
- `/utils/api.ts` (API calls: Google, TrueLayer, Twelve Data)
- `/utils/calculations.ts` (Net worth, currency conversion)
- `/types/index.ts` (All TypeScript types)
- `/constants/design.ts` (Colors, fonts, spacing)

**Testing Checklist:**
- [ ] Google OAuth sign-in works
- [ ] Face ID prompts on auth screen
- [ ] PIN entry works as fallback
- [ ] Add asset (manual) saves and displays
- [ ] Add liability saves and displays
- [ ] Net worth calculates correctly (assets - liabilities)
- [ ] Edit asset updates values
- [ ] Delete asset removes from list
- [ ] Currency selection changes symbols
- [ ] Stock ticker validation works (Twelve Data)
- [ ] Stock price fetches and displays
- [ ] Bank connection (TrueLayer) opens browser
- [ ] TrueLayer redirects back to app
- [ ] Connected account appears as asset
- [ ] Subscription paywall appears at 4th asset
- [ ] Purchase flow completes (sandbox)
- [ ] Premium entitlement unlocks features
- [ ] Restore purchases works
- [ ] Data persists after app close
- [ ] App loads data on reopen
- [ ] Pull-to-refresh updates prices
- [ ] Charts display correctly
- [ ] Animations are smooth
- [ ] Error messages appear for failures
- [ ] Settings screen displays user info
- [ ] Logout clears data and returns to sign-up

**Common Cursor Mistakes to Avoid:**
- Don't use web-only libraries (DOM manipulation, etc.)
- Don't assume all React patterns work in RN (e.g., portals limited)
- Don't forget to test on physical device (Face ID, deep links)
- Don't skip error handling (APIs fail, networks drop)
- Don't over-engineer (MVP first, polish later)
- Don't ignore AsyncStorage limits (5-10MB safe, more risky)
- Don't hardcode credentials (use `.env` files)
