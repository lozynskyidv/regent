# Apple OAuth - Quick Reference Card

**⏱️ Total Time:** 15-20 minutes  
**💰 Cost:** $0 (Apple Developer account already required for App Store)  
**🔧 Code Changes:** None needed (already implemented)

---

## 🚀 Quick Start (5 Steps)

### 1️⃣ **Create App ID** (3 min)
- Go to: https://developer.apple.com/account → Identifiers
- Bundle ID: `com.regent.app`
- Enable: Sign in with Apple

### 2️⃣ **Create Services ID** (5 min)
- Identifier: `com.regent.app.auth`
- Domain: `<YOUR_SUPABASE_PROJECT_ID>.supabase.co`
- Return URL: `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`

### 3️⃣ **Create Private Key** (2 min)
- Download `.p8` file (you can only do this ONCE!)
- Note: Key ID + Team ID

### 4️⃣ **Configure Supabase** (5 min)
- Enable Apple provider
- Paste: Services ID, Team ID, Key ID, Private Key

### 5️⃣ **Test** (5 min)
- Tap "Continue with Apple"
- Sign in → Should redirect to PIN setup ✅

---

## 📋 What You Need to Copy

| Item | Where to Find | Example Format | Where to Paste |
|------|---------------|----------------|----------------|
| **Services ID** | Apple Developer → Services ID you created | `com.regent.app.auth` | Supabase |
| **Team ID** | Apple Developer → Top right corner | `XYZ789ABC1` (10 chars) | Supabase |
| **Key ID** | Apple Developer → After creating key | `ABC123DEF4` (10 chars) | Supabase |
| **Private Key** | `.p8` file you downloaded | `-----BEGIN PRIVATE KEY-----\n...` | Supabase |
| **Supabase Project ID** | Supabase Dashboard → Settings → API | `abcdefghijklmnop` | Apple Developer |

---

## ⚠️ Common Mistakes

1. **Wrong Return URL format**
   - ❌ Bad: `http://...` or `...auth/callback`
   - ✅ Good: `https://<PROJECT_ID>.supabase.co/auth/v1/callback`

2. **Private key not copied fully**
   - Must include `-----BEGIN PRIVATE KEY-----` header
   - Must include `-----END PRIVATE KEY-----` footer
   - Copy entire file contents, not just middle part

3. **Services ID doesn't match**
   - Apple Developer Services ID: `com.regent.app.auth`
   - Supabase Services ID field: Must be EXACTLY the same

4. **Wrong bundle identifier**
   - Must be: `com.regent.app` (matches `app.json`)
   - Cannot change after App ID is created

---

## 🎯 Success Checklist

After configuration, verify:

- [ ] Apple Sign In button appears (already does)
- [ ] Tapping button opens Apple OAuth page
- [ ] Can sign in with Apple ID
- [ ] Redirects back to app (not stuck in browser)
- [ ] Shows PIN setup screen (new user)
- [ ] No console errors (check for ❌ emojis)

---

## 🆘 Quick Troubleshooting

| Error | Quick Fix |
|-------|-----------|
| "Invalid client" | Check Services ID matches exactly |
| "Invalid redirect URI" | Check Return URL format in Apple Developer |
| "Invalid private key" | Re-download `.p8`, copy entire contents |
| Button does nothing | Enable Apple provider in Supabase |
| Doesn't redirect back | Run `npx expo start --clear` |

---

## 🔗 Quick Links

- **Apple Developer:** https://developer.apple.com/account
- **Full Guide:** `APPLE_OAUTH_SETUP.md` (detailed step-by-step)
- **Code Location:** `app/index.tsx` (lines 134-217)
- **Supabase Docs:** https://supabase.com/docs/guides/auth/social-login/auth-apple

---

**Pro Tip:** Do this in one sitting. Keep the Apple Developer tab and Supabase tab open side-by-side for easy copy-pasting. Download the `.p8` file immediately when offered (you only get one chance!).
