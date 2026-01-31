# Subscription "Not Available" Error - Fix Guide

**Date:** January 31, 2026  
**Error:** "Subscription not available" on paywall screen  
**Root Cause:** Missing or incomplete product configuration

---

## Why This Happens

The error `"⚠️ No packages available"` means RevenueCat can't find any subscription products. This happens when:

1. ❌ **No product created in App Store Connect**, OR
2. ❌ **Product not configured in RevenueCat dashboard**, OR
3. ❌ **Product not submitted for review in App Store Connect**, OR
4. ❌ **Offering not created in RevenueCat**

---

## Step-by-Step Fix

### Step 1: Create In-App Purchase in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app: **WorthView** (com.dmy.networth)
3. Click **Features** → **In-App Purchases**
4. Click **"+"** to create new in-app purchase

**Settings:**
- **Type:** Auto-Renewable Subscription
- **Reference Name:** WorthView Annual
- **Product ID:** `worthview_annual` (or `com.dmy.networth.annual`)
- **Subscription Group:** Create new: "WorthView Subscriptions"

**Pricing:**
- **Price:** £49.99/year (Tier selection)
- **Free Trial:** 7 days

**Subscription Duration:** 1 Year

**Localization (English UK):**
- **Display Name:** WorthView Premium
- **Description:** Track unlimited assets and liabilities with live investment prices and cloud backup.

5. Click **Save**
6. **IMPORTANT:** Click **"Submit for Review"** 
   - You MUST submit the IAP for review before it works (even in TestFlight)
   - Add screenshots if required
   - Fill in review notes

---

### Step 2: Configure Product in RevenueCat

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Select your project
3. Go to **Products** tab
4. Click **"+ Add Product"**

**Settings:**
- **Product ID:** `worthview_annual` (MUST match App Store Connect)
- **Store:** App Store
- **Type:** Subscription

5. Click **Save**

---

### Step 3: Create Entitlement in RevenueCat

1. In RevenueCat, go to **Entitlements** tab
2. Click **"+ New Entitlement"**
3. **Identifier:** `premium`
4. **Products:** Select `worthview_annual`
5. Click **Save**

---

### Step 4: Create Offering in RevenueCat

1. In RevenueCat, go to **Offerings** tab
2. You should see **"Current"** offering (default)
3. Click **"Current"** to edit
4. Click **"+ Add Package"**

**Settings:**
- **Package Type:** Annual
- **Product:** Select `worthview_annual`
- **Identifier:** `$rc_annual` (default is fine)

5. Click **Save**
6. **Make sure "Current" offering is set as default** (toggle should be ON)

---

### Step 5: Verify Configuration

**In RevenueCat Dashboard:**

Check **Overview** tab:
- ✅ API Key shows: `appl_YsKPtpcVpohFQoThbTiytPNKxPB` (already correct in code)
- ✅ Products: 1 product configured
- ✅ Entitlements: "premium" exists
- ✅ Offerings: "Current" has annual package

**In App Store Connect:**

Check **In-App Purchases**:
- ✅ Status: "Waiting for Review" or "Ready to Submit"
- ✅ Product ID: `worthview_annual`
- ✅ Price: £49.99/year
- ✅ Trial: 7 days

---

## Product ID Options

You have two options for Product ID:

### Option 1: Simple ID (Recommended)
```
worthview_annual
```

### Option 2: Reverse Domain
```
com.dmy.networth.annual
```

**Choose ONE** and use it consistently in:
- App Store Connect → Product ID
- RevenueCat → Product ID

---

## Testing Before Approval

**Important:** In-app purchases don't work in TestFlight until they're approved by Apple.

**Workaround for Testing:**
1. Submit the IAP for review in App Store Connect
2. While waiting, you can:
   - Test restore purchases (won't find anything)
   - See the paywall UI
   - Click subscribe button (will fail until approved)

**Once IAP is approved:**
- Use Sandbox test account for testing
- Subscriptions are FREE in sandbox
- Subscription immediately activates

---

## Creating Sandbox Test Account

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **Users and Access** → **Sandbox Testers**
3. Click **"+"** to add tester
4. **Email:** Use a REAL email you have access to (e.g., your personal email + sandbox)
   - Example: `youremail+sandbox@gmail.com`
5. **Password:** Create strong password
6. **Region:** United Kingdom

**To Test:**
1. On iPhone, go to **Settings** → **App Store** → **Sandbox Account**
2. Sign in with sandbox account
3. Open WorthView from TestFlight
4. Add 3+ assets to trigger paywall
5. Tap "Start Free Trial"
6. Confirm with Face ID (FREE in sandbox!)
7. Subscription activates immediately

---

## Error Messages Explained

### "⚠️ No packages available"
**Cause:** RevenueCat can't find offering/products  
**Fix:** Complete Steps 1-4 above

### "Subscription package not available"
**Cause:** App can't find annual package in offerings  
**Fix:** Create offering with annual package (Step 4)

### "Cannot connect to iTunes Store"
**Cause:** IAP not submitted for review yet  
**Fix:** Submit IAP for review in App Store Connect

### "This In-App Purchase has already been bought"
**Cause:** Already subscribed (good!)  
**Fix:** None needed - subscription is active

---

## Current Configuration

**App Config:**
- Bundle ID: `com.dmy.networth`
- RevenueCat Key: `appl_YsKPtpcVpohFQoThbTiytPNKxPB` ✅

**What's Missing:**
- [ ] In-App Purchase in App Store Connect
- [ ] Product in RevenueCat
- [ ] Entitlement in RevenueCat
- [ ] Offering in RevenueCat

---

## Quick Checklist

Before testing subscriptions:

- [ ] IAP created in App Store Connect (`worthview_annual`)
- [ ] IAP submitted for review
- [ ] Product added in RevenueCat (`worthview_annual`)
- [ ] Entitlement created (`premium`)
- [ ] Offering created with annual package
- [ ] Sandbox test account created
- [ ] App rebuilt and submitted to TestFlight (if product ID changed)

---

## Need Help?

**RevenueCat Docs:**
- Setup: https://docs.revenuecat.com/docs/getting-started
- Testing: https://docs.revenuecat.com/docs/sandbox

**Apple Docs:**
- IAP Setup: https://help.apple.com/app-store-connect/#/devae49fb316
- Sandbox Testing: https://help.apple.com/app-store-connect/#/dev8b997bee1

---

**Next:** Complete Steps 1-4, then rebuild app (Build 7) if you changed the product ID.
