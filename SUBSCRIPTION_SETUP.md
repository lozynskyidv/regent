# Subscription System Setup - £149/year with 7-day trial

**Version:** v0.9.7 (Subscription Model)  
**Date:** January 27, 2026  
**Status:** ✅ Implementation Complete - Configuration Required

---

## ✅ What Was Implemented

### **Phase 1: Removed Invite System**
- ✅ Deleted `ShareInviteCard` component
- ✅ Removed `invite-code.tsx` screen
- ✅ Cleaned up invite validation from `AuthGuard` in `_layout.tsx`
- ✅ Simplified auth flow (no more invite code checks)

### **Phase 2: Created Subscription Foundation**
- ✅ Created `PaywallScreen.tsx` component (beautiful UI matching web prototype)
- ✅ Created `/paywall` route with RevenueCat integration
- ✅ Added `SubscriptionState` type to `DataContext`
- ✅ Updated auth flow to redirect to `/paywall` after PIN entry

### **Phase 3: RevenueCat Integration**
- ✅ Installed `react-native-purchases` SDK (v7.x)
- ✅ Integrated existing `useRevenueCat.ts` hook
- ✅ Implemented purchase flow in paywall screen
- ✅ Implemented restore purchases flow
- ✅ Auto-navigation to home when subscription is active

---

## 🔧 What You Need to Configure

### **1. RevenueCat Dashboard Setup**

**Current Status:** Using test API keys

**Steps:**
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create a new app (or use existing)
3. Navigate to **API Keys** section
4. Copy your production iOS API key
5. Update in `/utils/useRevenueCat.ts`:

```typescript
// REPLACE THESE TEST KEYS:
const REVENUECAT_IOS_API_KEY = 'test_PoLKzvEYygTGhoNcJtPPQnbVZEs';

// WITH YOUR PRODUCTION KEY:
const REVENUECAT_IOS_API_KEY = 'appl_YOUR_PRODUCTION_KEY_HERE';
```

### **2. App Store Connect Setup**

1. **Create In-App Purchase Product:**
   - Type: **Auto-Renewable Subscription**
   - Product ID: `regent_premium_annual` (or your choice)
   - Duration: **1 Year**
   - Price: **£149.00** (Tier 149)
   - Free Trial: **7 Days**

2. **Subscription Group:**
   - Name: "Regent Premium"
   - Add your annual subscription to this group

3. **Submit for Review:**
   - Add screenshots
   - Add subscription information
   - Submit with your app

### **3. RevenueCat Product Configuration**

1. Go to RevenueCat Dashboard → **Products**
2. Click **+ New**
3. Add your App Store product:
   - **Product ID:** `regent_premium_annual`
   - **Platform:** iOS
4. Go to **Entitlements**
5. Create entitlement named `premium`
6. Attach your product to `premium` entitlement
7. Go to **Offerings**
8. Create offering (e.g., "default")
9. Add package:
   - **Type:** Annual
   - **Product:** regent_premium_annual
   - **Identifier:** `annual`

---

## 🧪 Testing

### **Test the Flow:**

1. **Sign Up & Auth:**
   ```
   Open app → Sign up → Enter PIN → Redirected to paywall ✅
   ```

2. **Paywall Screen:**
   ```
   - Shows "£149/year"
   - Shows "Cancel anytime in Settings"
   - Shows 5 benefits (including TrueLayer)
   - "Continue with Regent" button
   - "Restore Purchases" button
   ```

3. **Purchase Flow:**
   ```
   Tap "Start Free Trial" → Apple Pay sheet → Confirm with Face ID → Success → Navigate to home ✅
   ```

4. **Already Subscribed:**
   ```
   Sign in → Enter PIN → Auto-navigate to home (skip paywall) ✅
   ```

### **Test Restore Purchases:**

1. Delete app
2. Reinstall
3. Sign in with same Apple ID
4. Enter PIN
5. On paywall, tap "Restore Purchases"
6. Should navigate to home with active subscription

---

## 🎯 User Flow Diagram

```
┌─────────────┐
│  Sign Up    │
│  (Email/    │
│   Google)   │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Auth       │
│  (Face ID   │
│   or PIN)   │
└──────┬──────┘
       │
       v
┌─────────────┐      YES (active)
│  Paywall    ├──────────────────> Home Screen
│  Screen     │
└──────┬──────┘
       │ NO (trial expired
       │  or no subscription)
       v
┌─────────────┐
│ Subscribe   │
│ or          │
│ Restore     │
└──────┬──────┘
       │
       v
    Home Screen
```

---

## 📊 Unit Economics

**Pricing:** £149/year  
**Trial:** 7 days free  

**Monthly Breakdown:**
- Revenue: £149/year = **£12.42/month per user**
- Costs:
  - Twelve Data API: £1.58/month (amortized)
  - Supabase: £0.20/month
  - RevenueCat: **FREE** (under 2,500 subscribers)
  - TrueLayer (if implemented): £9/month (daily auto-sync)
  - **Total Cost:** £10.78/month per user

**Gross Margin:** £1.64/month per user = **13% margin**

---

## 🚨 Important Notes

### **1. RevenueCat Configuration is REQUIRED**
The app will show the paywall but purchase will fail until you:
- Add production API keys
- Configure products in RevenueCat dashboard
- Create In-App Purchase in App Store Connect

### **2. Testing with Sandbox**
- Use sandbox test accounts from App Store Connect
- Sandbox subscriptions auto-renew every few minutes (not real time)
- Always test restore purchases before releasing

### **3. Privacy Policy**
Update your privacy policy to include:
- Apple In-App Purchase usage
- RevenueCat (third-party subscription processor)
- Subscription auto-renewal terms

### **4. App Store Review**
Include screenshots showing:
- Subscription screen with pricing
- Free trial clearly stated
- Cancellation instructions
- Restore purchases button

---

## 🎨 UI Components

### **PaywallScreen.tsx**
Beautiful subscription screen with:
- Large "£149" pricing display
- "Cancel anytime in Settings" messaging
- 5 key benefits with checkmarks (including TrueLayer)
- Primary CTA button ("Continue with Regent")
- Restore purchases link
- Fine print (Apple requirements)

**Design:** 100% matches web prototype (clean, minimal, premium feel)

---

## 🔗 Next Steps

1. **Configure RevenueCat** (15 minutes)
   - Create account/project
   - Add API keys
   - Configure products & entitlements

2. **Setup App Store Connect** (30 minutes)
   - Create In-App Purchase
   - Set pricing (£49/year)
   - Configure 7-day trial
   - Submit for review

3. **Test End-to-End** (15 minutes)
   - Sandbox account
   - Purchase flow
   - Restore purchases
   - Subscription status

4. **Update Documentation** (5 minutes)
   - Privacy policy
   - Terms of service
   - App Store description

---

## 💡 Pro Tips

1. **Free Trial Optimization:**
   - 7 days is good, but consider A/B testing 14 days
   - Send reminder notification on Day 5

2. **Pricing Optimization:**
   - Current: £149/year
   - Consider monthly option (£14.99/month = £179.88/year)

3. **Conversion Tracking:**
   - Log events: `trial_started`, `trial_converted`, `purchase_cancelled`
   - Track conversion rate: Trial → Paid

4. **Retention:**
   - Email Day 1, 3, 5 with tips
   - Offer discount for annual renewals

---

**Status:** ✅ Ready for RevenueCat configuration  
**Last Updated:** January 27, 2026  
**Next Milestone:** App Store submission with IAP
