# Apple OAuth & RevenueCat - Final Integration Checklist ✅

## Status: READY TO TEST

All keys have been configured. Follow this checklist to verify everything works.

---

## ✅ **What's Already Done**

### 1. Apple Developer Console
- ✅ Bundle ID: `com.dmy.networth`
- ✅ App ID created with Sign in with Apple capability
- ✅ Services ID: `com.dmy.networth.auth`
- ✅ Sign in with Apple Key created (Key ID: `ZRLCPBBJ4T`)
- ✅ Team ID: `GG45LXKPLR`

### 2. Supabase Configuration
- ✅ Apple OAuth JWT generated and configured:
  ```
  Client ID: com.dmy.networth.auth
  Secret Key: [JWT token provided]
  Team ID: GG45LXKPLR
  Key ID: ZRLCPBBJ4T
  ```

### 3. RevenueCat Configuration
- ✅ Production iOS SDK key configured: `appl_YsKPtpcVpohFQoThbTiytPNKxPB`
- ✅ App Store Connect API key uploaded to RevenueCat
- ✅ Product configured: £49/year subscription

### 4. App Code
- ✅ Apple Sign In implemented in `app/index.tsx`
- ✅ RevenueCat production key updated in `utils/useRevenueCat.ts`
- ✅ Bundle ID updated in `app.json`
- ✅ OAuth redirect URI: `regent://auth/callback`

---

## 🔧 **Final Supabase Configuration Steps**

Before testing, verify these in **Supabase Dashboard**:

### 1. Enable Apple Provider
1. Go to **Authentication** → **Providers**
2. Find **Apple** in the list
3. Click **Enable**
4. Fill in the form:
   - **Enabled**: Toggle ON
   - **Client ID**: `com.dmy.networth.auth`
   - **Secret Key (JWT)**: *(paste the JWT token we generated)*
   - **Additional Scopes**: Leave empty (default: name, email)
5. Click **Save**

### 2. Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Add these **Redirect URLs**:
   ```
   regent://auth/callback
   exp://localhost:8081/--/auth/callback
   ```
   - First one is for production (TestFlight/App Store)
   - Second one is for Expo development

3. **Site URL**: Set to `https://jkseowelliyafkoizjzx.supabase.co`

4. Click **Save**

### 3. Verify Anon Key (IMPORTANT)
Your `.env` file has:
```
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DYJ5qKoBw4x1pYiQRvC_EA_BB_pauNe
```

⚠️ **This key looks truncated!** A proper Supabase anon key should be ~300 characters long.

**To get the correct key:**
1. Go to **Project Settings** → **API**
2. Find **Project API keys**
3. Copy the **anon/public** key (the long one)
4. Replace the value in `.env`

---

## 🧪 **Testing Apple OAuth**

### Test in Development (Expo Go won't work - need actual build)

1. **Build for TestFlight:**
   ```bash
   eas build --platform ios
   ```

2. **Submit to TestFlight:**
   ```bash
   eas submit --platform ios
   ```

3. **Test on Device:**
   - Install from TestFlight
   - Tap "Continue with Apple"
   - Should open Apple Sign In page
   - After signing in, should redirect back to app
   - Should create PIN/Face ID
   - Should reach home screen

### Expected Flow:
```
Tap Apple Sign In 
  → Opens Safari/ASWebAuthSession
  → Apple login page
  → User approves
  → Redirects to regent://auth/callback
  → App receives tokens
  → App sets Supabase session
  → Navigates to /auth (PIN setup)
  → Navigates to /home
```

### Debugging:
Check console logs for:
- `🔐 Starting Apple OAuth...`
- `🌐 Opening browser for OAuth...`
- `✅ Redirect URL:` (should have tokens)
- `🔑 Setting session with tokens`
- `✅ Session set successfully!`

---

## 🧪 **Testing RevenueCat**

1. **Test Subscription Flow:**
   - Open app
   - Add your first asset (triggers paywall after 3 assets in free trial)
   - OR navigate to Settings → Subscription
   - Tap "Start Free Trial"
   - Should show App Store subscription sheet (£49/year)
   - Complete purchase (use sandbox test account)

2. **Verify Subscription:**
   - Go to RevenueCat dashboard
   - Check **Customers** tab
   - Your user ID should appear with active subscription

### Expected Flow:
```
Trigger Paywall
  → Shows "£49/year" offer
  → Tap "Start Free Trial"
  → Apple payment sheet appears
  → Complete purchase
  → RevenueCat confirms entitlement
  → isPremium = true
  → Paywall dismisses
```

---

## 🚨 **Common Issues & Fixes**

### Issue: "Apple Sign In Failed"
- **Fix**: Check Supabase redirect URLs are correct
- **Fix**: Verify JWT token is still valid (expires after 6 months)
- **Fix**: Ensure Apple OAuth is **Enabled** in Supabase

### Issue: "Wrong API Key" (RevenueCat)
- **Fix**: This means you're using test keys. Already fixed with production key.

### Issue: "No tokens found in redirect URL"
- **Fix**: Check `.env` anon key is correct (see above)
- **Fix**: Verify Supabase project URL is correct

### Issue: App crashes on sign in
- **Fix**: Check console logs for errors
- **Fix**: Verify bundle ID matches everywhere

---

## 📱 **Build for Production**

Once testing passes:

### 1. Build Production App
```bash
eas build --platform ios --profile production
```

### 2. Submit to App Store
```bash
eas submit --platform ios
```

### 3. App Store Connect Setup
- Upload app screenshots
- Write app description
- Set pricing (Free with in-app purchase)
- Submit for review

---

## 📋 **Quick Action Items**

Before you test:
- [ ] Fix Supabase anon key in `.env` (get full key from dashboard)
- [ ] Enable Apple OAuth in Supabase Authentication → Providers
- [ ] Add redirect URLs in Supabase Authentication → URL Configuration
- [ ] Build and submit to TestFlight
- [ ] Test Apple Sign In on real device
- [ ] Test RevenueCat subscription purchase

---

## 🎉 **You're Ready!**

Everything is configured. Just need to:
1. Fix the Supabase anon key
2. Enable Apple OAuth in Supabase dashboard
3. Build and test!

Let me know if you hit any issues! 🚀
