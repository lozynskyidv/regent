# Apple OAuth - Implementation Priorities

**Status:** 🟡 Code Fixed, Needs Configuration  
**Updated:** January 14, 2026  
**Blocking:** App Store Submission

---

## ✅ What I Just Fixed

### **Issue: Missing `redirectTo` parameter in Apple OAuth**

**What was wrong:**
- Google OAuth had `redirectTo: redirectUri` ✅
- Apple OAuth was missing this parameter ❌
- This would cause redirect failures after authentication

**What I fixed:**
```typescript
// Before (lines 147-152)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    skipBrowserRedirect: true,
  },
});

// After (FIXED)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: redirectUri,  // ← ADDED THIS
    skipBrowserRedirect: true,
  },
});
```

**Also fixed:**
- Added debug logging to Apple OAuth (matches Google implementation)
- Updated `WebBrowser.openAuthSessionAsync` to use explicit `redirectUri` (was `undefined`)

---

## 🎯 Priority Breakdown

### **Priority 1: Code Review** ✅ DONE
- [x] Review Apple OAuth implementation
- [x] Compare with working Google OAuth flow
- [x] Fix missing `redirectTo` parameter
- [x] Add consistent debug logging
- [x] Ensure redirect URI is properly used

**Result:** Apple OAuth code now matches Google OAuth pattern (which is tested and working)

---

### **Priority 2: Apple Developer Configuration** 🔴 REQUIRED
**Time:** 15 minutes  
**Blocker:** Cannot test Apple OAuth without this

**Steps:**
1. Create App ID with `com.regent.app` bundle identifier
2. Create Services ID (e.g., `com.regent.app.auth`)
3. Configure domains and return URLs
4. Create and download private key (.p8 file)
5. Note Team ID and Key ID

**Guide:** See `APPLE_OAUTH_SETUP.md` for detailed step-by-step

---

### **Priority 3: Supabase Configuration** 🔴 REQUIRED
**Time:** 5 minutes  
**Dependencies:** Needs Priority 2 completed first

**Steps:**
1. Enable Apple provider in Supabase Dashboard
2. Enter Services ID from Apple Developer
3. Enter Team ID (from Apple Developer top-right)
4. Enter Key ID (from private key creation)
5. Paste entire private key contents (.p8 file)

**Guide:** See `APPLE_OAUTH_SETUP.md` Step 5

---

### **Priority 4: Testing** 🟡 AFTER CONFIGURATION
**Time:** 10-15 minutes  

**Test Cases:**
1. **New User Sign-Up:**
   - Tap "Continue with Apple" button
   - Complete Apple OAuth in browser
   - Redirects back to app
   - Shows invite code screen (if not validated)
   - Shows PIN setup screen (after invite validation)
   - Can access home screen

2. **Returning User Sign-In:**
   - Tap "Continue with Apple" button
   - Already signed in to Apple → Quick redirect
   - Shows PIN entry screen (not PIN setup)
   - Can access home screen after correct PIN

3. **Error Cases:**
   - User cancels OAuth → Shows "Cancelled" alert
   - Network failure → Shows "Sign In Failed" alert
   - Invalid configuration → Console shows clear error

4. **Cross-Platform:**
   - Test in Expo Go (development)
   - Test in TestFlight build (production)

**Verification:**
```bash
# Check console logs for these indicators:
✅ "🔐 Starting Apple OAuth..."
✅ "🌐 Opening browser for OAuth..."
✅ "✅ Session set successfully!"

❌ "Invalid client" → Check Services ID
❌ "Invalid redirect URI" → Check Return URL
❌ "Invalid private key" → Re-download .p8 file
```

---

### **Priority 5: Documentation Update** 🟢 NICE TO HAVE
**Time:** 5 minutes  

**Update these files:**
1. `README.md` - Remove Apple OAuth from "Next Up" section
2. `PROJECT_CONTEXT.md` - Update P1 priorities
3. `DEPLOYMENT_GUIDE.md` - Add Apple OAuth verification step
4. Mark task as complete in project tracking

---

## 🚨 Why This is Critical

### **App Store Requirement (4.8 Sign in with Apple)**
> Apps that use a third-party or social login service must also offer Sign in with Apple as an equivalent option.

**Translation:**
- Google OAuth exists in app ✅
- Apple OAuth must exist too ❌ ← **YOU ARE HERE**
- Without this: **App Store WILL REJECT** ❌

---

## 📊 Risk Assessment

### **If Not Implemented:**
- ❌ Cannot submit to App Store (automatic rejection)
- ❌ Cannot distribute via TestFlight (requires App Store Connect)
- ❌ Violates Apple guidelines
- ❌ Blocks all future P1 priorities (stock tracking, bank connections)

### **If Implemented:**
- ✅ App Store compliant
- ✅ Better user experience (iOS users prefer Apple OAuth)
- ✅ Unblocks TestFlight distribution
- ✅ Enables focus on P1 features

---

## 🎯 Recommended Action Plan

**Today (15-20 minutes total):**
1. Open Apple Developer account (if not already enrolled)
2. Follow `APPLE_OAUTH_SETUP.md` step-by-step
3. Configure Supabase with Apple credentials
4. Test new user sign-up flow
5. Test returning user sign-in flow

**After Configuration:**
1. Update documentation (mark complete)
2. Move to Priority #2: Invite system edge case testing
3. Or move to Priority #3: Stock tracking implementation

---

## 📚 Resources

| Document | Purpose |
|----------|---------|
| `APPLE_OAUTH_SETUP.md` | Detailed step-by-step configuration guide |
| `APPLE_OAUTH_QUICK_REFERENCE.md` | Quick lookup for IDs, formats, common errors |
| This file | Priority breakdown and action plan |

**Code Location:** `app/index.tsx` lines 134-217  
**Apple Developer:** https://developer.apple.com/account  
**Supabase Dashboard:** Authentication → Providers → Apple

---

## 💡 Pro Tips

1. **Do it in one sitting:** Keep Apple Developer and Supabase tabs open side-by-side
2. **Download .p8 immediately:** You only get ONE chance to download the private key
3. **Save credentials:** Store Team ID, Key ID, Services ID in password manager
4. **Test in Expo Go first:** Faster iteration than building standalone app
5. **Check console logs:** All debug info is there (look for 🔐 and ❌ emojis)

---

## ✅ Definition of Done

- [ ] Apple Developer App ID created
- [ ] Apple Developer Services ID created and configured
- [ ] Private key (.p8) downloaded and saved
- [ ] Supabase Apple provider enabled and configured
- [ ] New user sign-up works (Apple OAuth → Invite → PIN → Home)
- [ ] Returning user sign-in works (Apple OAuth → PIN → Home)
- [ ] Error handling tested (cancel, network failure)
- [ ] Console shows no errors
- [ ] Documentation updated
- [ ] Task marked complete in README.md

---

**Current Status:** Code is ready ✅, configuration needed 🔴

**Next Steps:** Start with Step 1 in `APPLE_OAUTH_SETUP.md`
