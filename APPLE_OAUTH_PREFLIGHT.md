# Apple OAuth Pre-Flight Checklist

**Before you start the Apple Developer configuration, verify these prerequisites.**

---

## ✅ Prerequisites Checklist

### **1. Apple Developer Account**
- [ ] I have an Apple ID
- [ ] I am enrolled in Apple Developer Program ($99/year)
  - If not: https://developer.apple.com/programs/enroll/
- [ ] I can access https://developer.apple.com/account

---

### **2. Supabase Access**
- [ ] I can access Supabase Dashboard
- [ ] I have admin/owner permissions on the project
- [ ] I know my Supabase project ID
  - Find it: Dashboard → Settings → API → Project URL
  - Format: `https://YOUR_PROJECT_ID.supabase.co`
  - Example: `abcdefghijklmnop`

---

### **3. App Configuration**
- [ ] App bundle identifier is `com.regent.app` (verify in `app.json`)
- [ ] URL scheme is `regent` (verify in `app.json`)
- [ ] Code is on latest version (just fixed `redirectTo` parameter)

**Quick Verification:**
```bash
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
grep -A2 "bundleIdentifier" app.json
grep -A2 "scheme" app.json
```

Expected output:
```json
"bundleIdentifier": "com.regent.app",
...
"scheme": "regent",
```

---

### **4. Environment Ready**
- [ ] I can build and run the app locally
- [ ] Google OAuth is working (already tested)
- [ ] I have 15-20 minutes of uninterrupted time

**Quick Test:**
```bash
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
npm start
```

Should open Expo Dev Tools without errors.

---

### **5. Tools Ready**
- [ ] I have a text editor ready (for copying .p8 key)
- [ ] I have a secure place to save credentials (password manager recommended)
- [ ] I have two browser tabs open:
  - Tab 1: https://developer.apple.com/account
  - Tab 2: Supabase Dashboard → Authentication → Providers

---

## 🎯 What You'll Create

During the setup, you'll generate these values. **Save them all:**

| Item | Example | Where to Save |
|------|---------|---------------|
| **App ID** | `com.regent.app` | Apple Developer (already exists) |
| **Services ID** | `com.regent.app.auth` | Password manager + Supabase |
| **Team ID** | `XYZ789ABC1` | Password manager + Supabase |
| **Key ID** | `ABC123DEF4` | Password manager + Supabase |
| **Private Key (.p8)** | File download | Secure folder + Supabase |

**⚠️ CRITICAL:** Download `.p8` file immediately when offered. You only get ONE chance!

---

## 🚀 Ready to Start?

If all checkboxes above are ✅, proceed to:

### **Next Step:** Open `APPLE_OAUTH_SETUP.md`

Follow the step-by-step guide. Should take 15-20 minutes total.

---

## 🆘 Not Ready Yet?

### **Need Apple Developer Account?**
1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with Apple ID
3. Pay $99/year enrollment fee
4. Wait ~48 hours for approval
5. Return to this checklist

### **Can't Access Supabase?**
- Contact project owner for admin access
- Or set up your own Supabase project for testing

### **App Won't Build?**
```bash
# Try clearing cache and reinstalling
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
rm -rf node_modules
npm install
npx expo start --clear
```

### **Google OAuth Not Working?**
- Fix Google OAuth first (it's the reference implementation)
- Apple OAuth follows the same pattern
- Check `utils/supabase.ts` for configuration issues

---

## 💡 Tips for Smooth Setup

1. **Do it in one sitting** - Don't pause halfway through
2. **Use copy-paste** - Avoid manual typing of IDs/keys
3. **Double-check formats** - Especially return URLs
4. **Save everything** - You'll need these values again
5. **Test immediately** - Verify each step before moving on

---

## 📋 Quick Command Reference

```bash
# Navigate to project
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent

# Start development server
npm start

# Clear cache if needed
npx expo start --clear

# Check bundle identifier
grep "bundleIdentifier" app.json

# Check URL scheme
grep "scheme" app.json

# View Supabase config (if using .env)
cat .env | grep SUPABASE
```

---

## ✅ Pre-Flight Complete?

**If all checks pass, you're ready!**

👉 **Next:** Open `APPLE_OAUTH_SETUP.md` and follow Step 1

**Estimated Time:** 15-20 minutes  
**Difficulty:** Easy (just configuration)  
**Reward:** App Store compliant OAuth ✨

---

**Questions before starting?** Check:
- `APPLE_OAUTH_SETUP.md` - Detailed guide
- `APPLE_OAUTH_QUICK_REFERENCE.md` - Quick lookup
- `APPLE_OAUTH_PRIORITIES.md` - Why this matters
