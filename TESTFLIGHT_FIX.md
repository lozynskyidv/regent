# TestFlight Issues - Diagnosis & Fix

**Date:** January 31, 2026  
**Current Build Number:** 5 (in app.json)  
**Status:** Ready to rebuild and submit

---

## Issues Identified

### 1. ✅ "Regent (db85be)" Display Name
**Status:** NOT an issue - this is the EAS project identifier
- The slug "regent" is internal to Expo/EAS only
- The app displays as "WorthView" on user devices (verified in app.json: `"name": "WorthView"`)
- "db85be" is the short project ID from EAS
- Users never see this - it only appears in App Store Connect backend

### 2. ❌ Only 1 Build in TestFlight
**Root Cause:** All recent builds show "Build number 1" in EAS
- You built 5+ times on Jan 30-31
- Each build completed successfully
- **BUT**: None were automatically submitted to TestFlight
- All builds are stuck at build number "1" despite app.json showing 2, 3, 4

**Why This Happened:**
- EAS builds don't auto-submit to TestFlight by default
- `eas.json` has empty submit config: `"submit": { "production": {} }`
- Each build needs manual submission with `eas submit`

### 3. ✅ Demo Account Credentials
**Status:** Already fixed
- Email: dmy@gmail.com
- Password: 5Q69q25q
- Account exists in Supabase
- Works for email/password sign-in

### 4. ✅ App Icons
**Status:** Already working
- Icon file exists: `/assets/icon.png` (1024x1024 PNG)
- WorthView logo properly configured
- Icons are in the builds, just not visible in TestFlight yet because builds weren't submitted

---

## Solution: Submit Existing Builds to TestFlight

You have **5 successful production builds** that were never submitted to TestFlight:

| Build ID | Date | Status | Build # |
|----------|------|--------|---------|
| 4545a96d | Jan 31, 10:20 PM | ✅ Finished | 1 |
| 0057521c | Jan 31, 10:12 PM | ✅ Finished | 1 |
| cdf946d7 | Jan 31, 9:52 PM | ✅ Finished | 1 |
| 22a8b560 | Jan 31, 7:59 PM | ✅ Finished | 1 |
| 49fa5e71 | Jan 30, 1:45 PM | ✅ Finished | 1 |

**Latest Build:** `4545a96d-da51-4315-8e1c-499772c2e078` (most recent)

---

## How to Fix

### Option 1: Submit Latest Build (Fastest)

Submit the most recent build that's already compiled:

```bash
cd "/Users/dmytrolozynskyi/Documents/Regent App/WorthView"

# Submit the latest build (4545a96d)
eas submit --platform ios --id 4545a96d-da51-4315-8e1c-499772c2e078
```

**Expected:**
- Takes 5-10 minutes
- Uploads to App Store Connect
- Appears in TestFlight within 15-30 minutes
- Apple can review it

### Option 2: Build New Version with Auto-Submit

Update eas.json to auto-submit future builds:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6758517452"
      }
    }
  }
}
```

Then build:

```bash
eas build --platform ios --profile production --auto-submit
```

---

## Why TestFlight Shows "Regent (db85be)"

This is **normal** and **not visible to end users**:

1. **Where it appears:** Only in App Store Connect backend
2. **What users see:** "WorthView" (from `app.json` → `"name": "WorthView"`)
3. **Why it happens:** EAS uses the slug "regent" + project ID "db85be" for internal tracking
4. **Fix needed:** None - this doesn't affect the actual app

To verify the app name is correct, check your physical device home screen after installing from TestFlight - it will show "WorthView".

---

## Commands to Run Now

### Step 1: Submit Latest Build
```bash
cd "/Users/dmytrolozynskyi/Documents/Regent App/WorthView"
eas submit --platform ios --id 4545a96d-da51-4315-8e1c-499772c2e078
```

This will prompt you to:
1. Confirm Apple credentials
2. Upload to App Store Connect
3. Wait for processing

### Step 2: Monitor Progress
Check App Store Connect:
- https://appstoreconnect.apple.com/apps/6758517452/testflight/ios

You should see:
- New build appears (Build 1, Version 1.0.0)
- Processing status → Ready to Submit
- TestFlight beta available

### Step 3: Respond to Apple Review
Once the build is in TestFlight:

1. Go to App Store Connect → TestFlight
2. Click on the build
3. Verify it shows icons and app name correctly
4. Reply to Apple's rejection message:

```
Hello,

Thank you for your feedback. The issues have been resolved:

✅ Demo account is active and working:
   Email: dmy@gmail.com
   Password: 5Q69q25q

✅ The latest build with all features and icons has been submitted to TestFlight

✅ The app displays as "WorthView" throughout the interface

Please let me know if you need additional information.

Best regards,
Dmytro
```

---

## About Build Numbers

**Current Issue:** All builds show "Build number: 1"

**Why:** app.json has `"buildNumber": "5"` but EAS isn't reading it correctly

**Solution for Next Time:**
- Use `appVersionSource: "local"` in eas.json to read from app.json
- Or manually increment in EAS: `eas build --platform ios --auto-increment-version`

**For Now:** Just submit the existing build - Apple only cares that it works, not the build number sequence.

---

## Timeline

**Right Now:** Run `eas submit` command
**5-10 minutes:** Submission completes
**15-30 minutes:** TestFlight processing finishes
**1-2 hours:** Test on your device to confirm
**Then:** Reply to Apple's review team

---

## Next Build (After This Fix)

For your next build, to avoid this issue:

1. Update eas.json:
```json
{
  "cli": {
    "appVersionSource": "local"
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6758517452"
      }
    }
  }
}
```

2. Then build + submit in one command:
```bash
eas build --platform ios --auto-submit
```

---

**Action Required:** Run the submit command above to push your latest build to TestFlight! 🚀
