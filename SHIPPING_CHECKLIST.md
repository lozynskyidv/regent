# Shipping Checklist - Regent to TestFlight

**Current Status:** Ready to build and ship to TestFlight  
**Date:** January 30, 2026

---

## 🚀 Phase 1: Ship to TestFlight (NOW)

### ✅ Prerequisites Complete
- [x] Bundle ID set to generic: `com.dmy.networth`
- [x] All TrueLayer references removed (legal compliance)
- [x] Pricing updated to £49/year
- [x] Dependencies installed (react-native-worklets)
- [x] EAS CLI installed
- [x] Project has EAS configuration

### 📦 Step 1: Build for TestFlight
```bash
# 1. Login to EAS (if not already)
eas login

# 2. Build for TestFlight (internal distribution)
eas build --platform ios --profile preview

# This will:
# - Create iOS build with Bundle ID: com.dmy.networth
# - Use profile "preview" (no Apple Store submission yet)
# - Generate .ipa file for TestFlight
```

**Expected time:** 15-20 minutes for build to complete

### 📱 Step 2: Submit to TestFlight
```bash
# After build completes, submit to TestFlight
eas submit --platform ios --latest

# This will:
# - Upload to App Store Connect
# - Make available in TestFlight
# - No public release (beta only)
```

### 👥 Step 3: Add Beta Testers
1. Go to App Store Connect
2. Navigate to TestFlight tab
3. Add internal testers (Apple ID emails)
4. They receive TestFlight invite email
5. Install TestFlight app → Install your app

---

## 🔧 Phase 2: Polish & Production Ready (AFTER TestFlight)

### 1. Apple OAuth Setup
**Prerequisites:**
- [ ] Apple Developer enrollment approved
- [ ] App created in App Store Connect

**Steps:**
```bash
1. Apple Developer Console → Create Service ID
2. Configure redirect URI: com.dmy.networth://oauth
3. Supabase Dashboard → Enable Apple provider
4. Add Service ID and key
5. Test sign-in flow
```
**Time:** 5-10 minutes

### 2. Email Verification
**Currently:** Disabled for Expo Go testing  
**Action:** Re-enable in Supabase Dashboard
```
Supabase → Authentication → Providers → Email
Enable "Confirm email" toggle
```

### 3. RevenueCat Production Keys
**Currently:** Using test keys  
**Action:** Replace with production keys
```typescript
// utils/useRevenueCat.ts
const REVENUECAT_IOS_API_KEY = 'test_PoLKzvEYygTGhoNcJtPPQnbVZEs';
// Replace with: 'appl_YOUR_PRODUCTION_KEY'
```

### 4. App Store Connect Product
**Create In-App Purchase:**
- Type: Auto-Renewable Subscription
- Product ID: `com.dmy.networth.premium.annual`
- Price: £49/year (Tier 49)
- Free Trial: 7 days
- Link to RevenueCat

### 5. Build for Production
```bash
# Build for App Store submission
eas build --platform ios --profile production

# Submit for App Store review
eas submit --platform ios --latest
```

---

## 📋 Pre-Launch Checklist

### App Store Listing
- [ ] App name (can be "Regent" or new name)
- [ ] Subtitle
- [ ] Description
- [ ] Keywords
- [ ] Screenshots (iPhone)
- [ ] Privacy policy URL
- [ ] Support URL

### Testing
- [ ] Face ID works in standalone build
- [ ] Purchase flow works with real Apple ID
- [ ] Restore purchases works
- [ ] Sign out → Sign in (different user)
- [ ] Portfolio prices fetch correctly
- [ ] Performance chart renders smoothly

### Legal/Compliance
- [x] No TrueLayer/bank sync promises
- [x] Accurate pricing (£49/year)
- [x] Honest benefit claims (local storage)
- [ ] Privacy policy published
- [ ] Terms of service published

---

## 🎯 Current Next Step: Build for TestFlight

Run this command to start:
```bash
eas build --platform ios --profile preview
```

**What happens:**
1. EAS uploads code to cloud
2. Builds iOS app remotely
3. Generates .ipa file
4. You get download link
5. Submit to TestFlight
6. Invite beta testers
7. Get feedback
8. Iterate

**No App Store review needed for TestFlight** - you can ship to beta testers immediately!

---

## 💡 Notes

- TestFlight allows 10,000 beta testers
- Builds expire after 90 days
- Can upload new builds anytime
- Beta testers get automatic updates
- Collect feedback before public launch

---

**Ready to ship!** 🚀
