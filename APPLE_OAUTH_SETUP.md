# Apple OAuth Setup Guide - Regent

**Last Updated:** January 14, 2026  
**Status:** ⚠️ Needs Configuration  
**Code Status:** ✅ Fully Implemented

---

## 🎯 Overview

Apple OAuth is **100% implemented in code** but needs Apple Developer + Supabase configuration. This is an **App Store requirement** - Apple will reject apps with Google OAuth but no Apple OAuth.

**Estimated Time:** 15-20 minutes  
**Difficulty:** Easy (just configuration, no coding)

---

## ✅ What's Already Done

- ✅ Client-side OAuth flow (`app/index.tsx`)
- ✅ URL scheme (`regent://` in `app.json`)
- ✅ Bundle identifier (`com.regent.app`)
- ✅ Button UI (Apple as primary CTA)
- ✅ Token handling (same as Google OAuth)
- ✅ Error handling and loading states

---

## 📋 Step-by-Step Configuration

### **Step 1: Apple Developer Account** (5 minutes)

1. **Go to:** https://developer.apple.com/account
2. **Sign in** with your Apple ID
3. **Enroll** in Apple Developer Program if not already enrolled
   - Cost: $99/year
   - Required for App Store distribution anyway

---

### **Step 2: Create App ID** (3 minutes)

1. **Navigate to:** Certificates, Identifiers & Profiles → Identifiers
2. **Click** the "+" button
3. **Select:** App IDs → Continue
4. **Configure:**
   - Description: `Regent iOS App`
   - Bundle ID: `com.regent.app` (MUST match `app.json`)
   - Capabilities: Enable **Sign in with Apple**
5. **Click** Continue → Register

---

### **Step 3: Create Services ID** (5 minutes)

This is what Supabase needs for OAuth.

1. **Navigate to:** Certificates, Identifiers & Profiles → Identifiers
2. **Click** the "+" button
3. **Select:** Services IDs → Continue
4. **Configure:**
   - Description: `Regent OAuth Service`
   - Identifier: `com.regent.app.auth` (can be anything, but follow convention)
   - Check: **Sign in with Apple**
5. **Click** Configure next to "Sign in with Apple"
6. **Configure domains:**
   - Primary App ID: Select `com.regent.app` (from Step 2)
   - Domains and Subdomains: `<YOUR_SUPABASE_PROJECT_ID>.supabase.co`
     - Example: `abcdefghijklmnop.supabase.co`
     - Find this in Supabase Dashboard → Project Settings → API
   - Return URLs: `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`
     - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
7. **Click** Save → Continue → Register

---

### **Step 4: Create Private Key** (2 minutes)

1. **Navigate to:** Certificates, Identifiers & Profiles → Keys
2. **Click** the "+" button
3. **Configure:**
   - Key Name: `Regent Apple OAuth Key`
   - Check: **Sign in with Apple**
4. **Click** Configure next to "Sign in with Apple"
5. **Select:** Primary App ID: `com.regent.app`
6. **Click** Save → Continue → Register
7. **Download** the key file (`.p8` file)
   - ⚠️ **IMPORTANT:** You can only download this ONCE
   - Save it somewhere safe (you'll need it for Supabase)
8. **Note down:**
   - Key ID (shown on the page, format: `ABC123DEF4`)
   - Team ID (top right corner, format: `XYZ789ABC1`)

---

### **Step 5: Configure Supabase** (5 minutes)

1. **Go to:** Supabase Dashboard → Authentication → Providers
2. **Find** Apple provider → Enable
3. **Configure:**
   - **Services ID:** `com.regent.app.auth` (from Step 3)
   - **Team ID:** (from Step 4, format: `XYZ789ABC1`)
   - **Key ID:** (from Step 4, format: `ABC123DEF4`)
   - **Private Key:** Open the `.p8` file you downloaded and paste the entire contents
     - Should look like:
       ```
       -----BEGIN PRIVATE KEY-----
       MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
       -----END PRIVATE KEY-----
       ```
4. **Click** Save

---

### **Step 6: Test the Integration** (5 minutes)

1. **Clear app data:**
   ```bash
   # In Expo Go or simulator
   # Settings → Apps → Regent → Clear Data
   # Or reinstall the app
   ```

2. **Run the app:**
   ```bash
   cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
   npm start
   ```

3. **Test Apple Sign In:**
   - Tap "Continue with Apple" button
   - Should open Apple OAuth page
   - Sign in with Apple ID
   - Should redirect back to app
   - Should see PIN setup screen (new user) or PIN entry (returning user)

4. **Check console logs:**
   - Look for: `🔐 Starting Apple OAuth...`
   - Should see: `✅ Session set successfully!`
   - No errors about missing configuration

---

## 🐛 Troubleshooting

### **Error: "Invalid client"**
- **Cause:** Services ID doesn't match Supabase configuration
- **Fix:** Double-check Services ID in Supabase matches `com.regent.app.auth`

### **Error: "Invalid redirect URI"**
- **Cause:** Return URL in Apple Developer doesn't match Supabase
- **Fix:** Ensure format is exactly: `https://<PROJECT_ID>.supabase.co/auth/v1/callback`

### **Error: "Invalid private key"**
- **Cause:** Private key not copied correctly
- **Fix:** Re-download `.p8` file, copy entire contents including header/footer

### **Browser doesn't redirect back to app**
- **Cause:** URL scheme not registered properly
- **Fix:** Rebuild app with `npx expo start --clear`

### **Nothing happens when tapping button**
- **Cause:** Apple provider not enabled in Supabase
- **Fix:** Check Supabase Dashboard → Authentication → Providers → Apple is ON

---

## 📝 Configuration Summary Checklist

Use this to verify everything is set up correctly:

- [ ] **Apple Developer Account** enrolled ($99/year)
- [ ] **App ID** created with bundle ID `com.regent.app`
- [ ] **Services ID** created (e.g., `com.regent.app.auth`)
- [ ] **Domains configured** in Services ID:
  - Domain: `<YOUR_PROJECT_ID>.supabase.co`
  - Return URL: `https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/callback`
- [ ] **Private Key** downloaded and saved (`.p8` file)
- [ ] **Key ID** noted (format: `ABC123DEF4`)
- [ ] **Team ID** noted (format: `XYZ789ABC1`)
- [ ] **Supabase Apple provider** enabled with:
  - Services ID
  - Team ID
  - Key ID
  - Private Key (entire `.p8` contents)
- [ ] **Tested** sign-in flow (works end-to-end)

---

## 🚨 App Store Requirements

**Why Apple OAuth is mandatory:**

According to App Store Review Guidelines **4.8 Sign in with Apple**:
> Apps that use a third-party or social login service (such as Facebook, Google, Twitter, LinkedIn, Amazon, or WeChat) to set up or authenticate the user's primary account with the app must also offer Sign in with Apple as an equivalent option.

**Translation:** If you have Google OAuth (which Regent does), you MUST have Apple OAuth or your app will be **rejected**.

---

## 📚 Reference

- **Code location:** `app/index.tsx` (lines 134-217)
- **Apple Developer:** https://developer.apple.com/account
- **Supabase Docs:** https://supabase.com/docs/guides/auth/social-login/auth-apple
- **URL Scheme:** `regent://` (configured in `app.json`)

---

## 🎯 Next Steps After Setup

Once Apple OAuth is working:

1. **Test thoroughly:**
   - New user sign-up flow
   - Returning user sign-in flow
   - Error handling (user cancels, network fails)

2. **Update documentation:**
   - Mark this task as complete in `README.md`
   - Update `PROJECT_CONTEXT.md` P1 priorities

3. **Move to P1 Priority #2:**
   - Invite system edge case testing
   - Or stock tracking implementation

---

**Need help?** Reach out with:
- Screenshots of Apple Developer configuration
- Supabase logs from Authentication → Logs
- Console logs from app (look for 🔐 and ❌ emojis)
