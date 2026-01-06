# Regent App - Setup Guide

This guide will walk you through setting up authentication and backup functionality for the Regent app.

## 📋 What's Been Built

✅ **Completed (Week 1):**
- ✅ Supabase client utility (`utils/supabase.ts`)
- ✅ Encryption utilities (`utils/encryption.ts`)
- ✅ OAuth integration in sign-up screen (`app/index.tsx`)
- ✅ DataContext with Supabase auth + backup/restore (`contexts/DataContext.tsx`)
- ✅ Auth guards in layout (`app/_layout.tsx`)
- ✅ PIN/Face ID validation with first-time setup (`app/auth.tsx`)
- ✅ Settings screen with backup/restore/signout/delete (`app/settings.tsx`)

⏳ **Remaining (Week 2):**
- ⏳ Supabase database setup (see below)
- ⏳ OAuth provider configuration
- ⏳ Environment variables
- ⏳ RevenueCat integration
- ⏳ Paywall screen

---

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Set project details:
   - **Name:** `regent-app` (or your preferred name)
   - **Database Password:** Generate a strong password (save it securely)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
5. Click "Create new project" (takes ~2 minutes)

---

## 🗄️ Step 2: Create Database Schema

Once your project is ready:

### 2.1 Create Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Paste and run this SQL:

```sql
-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  photo_url TEXT,
  primary_currency TEXT DEFAULT 'GBP',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read/update their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- BACKUPS TABLE
-- ============================================

CREATE TABLE backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  encrypted_data TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only manage their own backups
CREATE POLICY "Users can manage own backups"
  ON backups FOR ALL
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_backups_user_id ON backups(user_id);

-- ============================================
-- DONE!
-- ============================================
```

4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

### 2.2 Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see two tables:
   - `users`
   - `backups`

---

## 🔐 Step 3: Configure OAuth Providers

### 3.1 Google OAuth

#### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen (if not done):
   - User Type: External
   - App name: "Regent"
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through all steps
6. Create OAuth client ID:
   - Application type: **iOS**
   - Name: "Regent iOS"
   - Bundle ID: `com.regent.app` (or your bundle ID from `app.json`)
7. Click "Create"
8. **Save your Client ID** (you'll need this)

#### B. Configure in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find "Google" and click to expand
3. Enable "Google enabled"
4. Paste your **Client ID** from Google
5. For **Client Secret**:
   - Go back to Google Cloud Console
   - Click on your OAuth 2.0 Client ID
   - You'll see the Client Secret there
6. Paste the **Client Secret** in Supabase
7. **Authorized redirect URIs** - Add this URL:
   ```
   https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback
   ```
   (Replace `[YOUR_PROJECT_ID]` with your Supabase project ID from the URL)
8. Also add this to Google Cloud Console:
   - Go back to your OAuth credentials in Google
   - Add the same redirect URI
9. Click "Save" in Supabase

### 3.2 Apple OAuth (Optional - More Complex)

Apple OAuth requires:
- Apple Developer account ($99/year)
- App ID configuration
- Services ID creation
- Key generation

**For MVP, you can skip Apple OAuth and just use Google.** Remove the Apple button from `app/index.tsx` or leave it with a "Coming Soon" alert.

If you want to set it up, follow [Supabase's Apple OAuth guide](https://supabase.com/docs/guides/auth/social-login/auth-apple).

---

## 🔑 Step 4: Get Supabase API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Find two keys:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. **Keep these safe** - you'll need them next

---

## 📝 Step 5: Add Environment Variables

### Option A: Using `.env` file (Recommended)

1. Create a `.env` file in the project root:

```bash
# In your terminal
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
touch .env
```

2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace with your actual values from Step 4

### Option B: Using `app.json` (Alternative)

If `.env` doesn't work, add to `app.json`:

```json
{
  "expo": {
    ...
    "extra": {
      "SUPABASE_URL": "https://your-project-id.supabase.co",
      "SUPABASE_ANON_KEY": "your-anon-key-here"
    }
  }
}
```

Then update `utils/supabase.ts`:

```typescript
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || '';
```

---

## 🔗 Step 6: Configure Deep Linking

For OAuth redirects to work, you need to configure deep linking:

1. Open `app.json`
2. Add/update the `scheme` field:

```json
{
  "expo": {
    "scheme": "regent",
    ...
  }
}
```

3. For iOS, also add:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.regent.app",
      "associatedDomains": [
        "applinks:your-project-id.supabase.co"
      ]
    }
  }
}
```

(Replace `your-project-id` with your Supabase project ID)

---

## ✅ Step 7: Test Authentication

### 7.1 Start the App

```bash
npm start
# or
npx expo start
```

Press `i` for iOS simulator

### 7.2 Test Sign-Up Flow

1. App opens to sign-up screen
2. Tap "Continue with Google"
3. OAuth browser opens
4. Sign in with Google
5. Redirected back to app
6. Auth screen appears - create 4-digit PIN
7. Confirm PIN
8. Navigated to Home screen

### 7.3 Test PIN/Face ID

1. Close app (swipe up on simulator)
2. Reopen app
3. Should go directly to Auth screen (PIN/Face ID)
4. Enter your 4-digit PIN
5. Navigate to Home

### 7.4 Test Backup/Restore

1. Add some test assets in the Home screen
2. Go to Settings
3. Tap "Backup Data"
4. Enter your 4-digit PIN
5. See "Success" alert
6. Go to Supabase dashboard → Table Editor → `backups`
7. You should see an encrypted backup (gibberish text - that's correct!)

8. To test restore:
   - Delete some assets locally
   - Go to Settings → "Restore Data"
   - Enter PIN
   - Assets should reappear

### 7.5 Test Sign Out

1. Settings → Sign Out
2. Confirm
3. Redirected to sign-up screen
4. Data remains on device (sign in again to access)

### 7.6 Test Delete Account

⚠️ **Warning:** This is permanent!

1. Settings → Delete Account
2. Double confirmation
3. Account deleted from Supabase
4. All local data wiped
5. Redirected to sign-up screen

---

## 🐛 Troubleshooting

### "Invalid Supabase URL" Error

- Check your `.env` file has correct URL
- Restart Metro bundler: `npx expo start --clear`
- Make sure URL starts with `https://`

### OAuth Redirect Not Working

- Check `app.json` has correct `scheme: "regent"`
- Verify redirect URI in Google Cloud Console matches Supabase
- iOS: Check bundle identifier matches

### "Failed to decrypt data" Error

- You're entering wrong PIN for restore
- Or backup was created with different Supabase user ID
- Backups are tied to specific user accounts

### Tables Not Showing in Supabase

- Make sure SQL ran successfully
- Refresh Table Editor page
- Check PostgreSQL logs in Supabase dashboard

---

## 📱 Next Steps (Week 2)

Once authentication works, proceed to:

1. **RevenueCat Integration**
   - Create RevenueCat account
   - Configure iOS product ($149/year, 14-day trial)
   - Install SDK
   - Build paywall screen

2. **Testing & Polish**
   - TestFlight beta build
   - User testing
   - Bug fixes

---

## 📚 Helpful Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Expo OAuth Guide](https://docs.expo.dev/guides/authentication/)
- [React Native Purchases (RevenueCat)](https://www.revenuecat.com/docs/getting-started)

---

## 🆘 Need Help?

If you run into issues:

1. Check Supabase dashboard → **Logs** for errors
2. Check React Native debugger console
3. Verify all environment variables are set correctly
4. Make sure you ran the SQL schema creation
5. Test OAuth redirect URL in browser first

---

**Good luck! You've built the core authentication system. 🎉**
