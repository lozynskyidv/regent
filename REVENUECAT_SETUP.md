# RevenueCat Integration Guide

## ✅ What's Implemented

The app now uses RevenueCat for subscription management instead of local trial tracking.

### Features:
- ✅ **Purchase Flow:** Users can start 14-day free trial from paywall
- ✅ **Restore Purchases:** Users can restore subscriptions on new devices
- ✅ **Subscription Status:** App checks RevenueCat for premium entitlement
- ✅ **AuthGuard Integration:** Routes users based on subscription status
- ✅ **Trial Management:** RevenueCat handles trial expiry automatically

---

## 📋 Next Steps (Required for Production)

### 1. Configure App Store Connect Product

You need to create the actual subscription product in App Store Connect:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **Features** → **In-App Purchases**
4. Click **+** to create new subscription
5. Configure:
   - **Type:** Auto-Renewable Subscription
   - **Reference Name:** Regent Premium Annual
   - **Product ID:** `regent_annual_149` (must match RevenueCat)
   - **Subscription Group:** Create new group "Regent Premium"
   - **Duration:** 1 Year
   - **Price:** £149/year (Tier 39)
   - **Free Trial:** 14 days
   - **Localization:** Add English description

6. Submit for review (required before testing)

---

### 2. Configure RevenueCat Dashboard

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Select your project: **Regent**
3. Go to **Products** tab
4. Click **+ New**
5. Add product:
   - **Identifier:** `regent_annual_149`
   - **Type:** Subscription
   - **Store:** App Store
   - **Store Product ID:** `regent_annual_149` (same as App Store Connect)

6. Go to **Entitlements** tab
7. Create entitlement:
   - **Identifier:** `premium`
   - **Attach Product:** `regent_annual_149`

8. Go to **Offerings** tab
9. Create offering:
   - **Identifier:** `default`
   - **Add Package:** Annual (`regent_annual_149`)

---

### 3. Replace Test API Keys with Production Keys

**Current:** Using test keys (sandbox only)
**Production:** Need to replace with live keys

1. In RevenueCat dashboard, go to **API Keys**
2. Copy your **Production iOS API key**
3. Update `utils/useRevenueCat.ts`:

```typescript
// Replace these test keys:
const REVENUECAT_IOS_API_KEY = 'test_PoLKzvEYygTGhoNcJtPPQnbVZEs';

// With your production key:
const REVENUECAT_IOS_API_KEY = 'your_production_key_here';
```

**⚠️ IMPORTANT:** Never commit production keys to git. Use environment variables:

```typescript
// Better approach (use .env):
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!;
```

---

### 4. Testing with Sandbox

Before going live, test with App Store sandbox:

1. Create sandbox tester in App Store Connect:
   - Go to **Users and Access** → **Sandbox Testers**
   - Click **+** to add tester
   - Use a fake email (e.g., `test@regent.app`)

2. On your iPhone:
   - Sign out of App Store
   - Don't sign in yet (sandbox prompt will appear during purchase)

3. Build and run app:
   ```bash
   npx expo run:ios
   ```

4. Test flow:
   - Sign up with Google/Apple
   - Tap "Start Free Trial"
   - Sign in with sandbox tester when prompted
   - Verify trial starts (no charge)
   - Check RevenueCat dashboard for customer

5. Test restore:
   - Delete app
   - Reinstall
   - Sign in
   - Tap "Restore Purchases"
   - Verify subscription restored

---

## 🔍 How It Works

### Architecture

```
User Taps "Start Free Trial"
         ↓
RevenueCat SDK → App Store
         ↓
Purchase Successful
         ↓
RevenueCat grants "premium" entitlement
         ↓
AuthGuard checks isPremium
         ↓
User redirected to /auth (PIN setup)
         ↓
User accesses full app
```

### Key Files

- **`utils/useRevenueCat.ts`** - RevenueCat hook (SDK wrapper)
- **`contexts/RevenueCatContext.tsx`** - Provides subscription state to app
- **`app/_layout.tsx`** - AuthGuard checks `isPremium` for routing
- **`app/paywall.tsx`** - Purchase UI (calls RevenueCat SDK)

### Subscription States

| State | isPremium | isInTrial | User Access |
|-------|-----------|-----------|-------------|
| No subscription | `false` | `false` | Paywall only |
| Trial active | `true` | `true` | Full app access |
| Trial expired (unpaid) | `false` | `false` | Paywall only |
| Paid subscription | `true` | `false` | Full app access |

---

## 💰 Pricing & Fees

### RevenueCat Fees
- **Free tier:** Up to $2.5k MRR (~13 paying users)
- **Paid tier:** 1% of revenue after $2.5k MRR

### Apple Fees
- **30%** of all revenue (first year)
- **15%** after first year (if user renews)

### Example Costs (100 users @ £149/year = £14,900/year)
- Apple: £4,470 (30%)
- RevenueCat: £149 (1%)
- Net: £10,281 (69%)

---

## 🐛 Troubleshooting

### "No packages available"
**Cause:** RevenueCat hasn't synced with App Store Connect
**Fix:** 
1. Check product ID matches exactly in both places
2. Wait 5-10 minutes for sync
3. Check RevenueCat dashboard for errors

### "Purchase failed"
**Cause:** App Store Connect product not approved
**Fix:** Submit product for review in App Store Connect

### "Restore failed"
**Cause:** No active subscription for this Apple ID
**Fix:** User needs to purchase first (or use correct Apple ID)

### "Sandbox not working"
**Cause:** Using production API key with sandbox tester
**Fix:** Use test API keys for sandbox testing

---

## 📚 Resources

- [RevenueCat Docs](https://docs.revenuecat.com)
- [React Native SDK](https://docs.revenuecat.com/docs/reactnative)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [Sandbox Testing](https://docs.revenuecat.com/docs/sandbox)

---

## ✅ Production Checklist

Before launching:

- [ ] Create subscription product in App Store Connect
- [ ] Configure product in RevenueCat dashboard
- [ ] Create "premium" entitlement in RevenueCat
- [ ] Create "default" offering with annual package
- [ ] Replace test API keys with production keys
- [ ] Test purchase flow with sandbox tester
- [ ] Test restore purchases
- [ ] Test trial expiry (fast-forward time in sandbox)
- [ ] Verify subscription shows in App Store Connect
- [ ] Verify customer appears in RevenueCat dashboard
- [ ] Submit app for App Store review

---

**Status:** ✅ SDK integrated, ready for App Store Connect configuration
