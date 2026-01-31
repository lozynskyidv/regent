# 🚀 Build & Ship to TestFlight

## ✅ **Everything is Ready!**

Your app is fully configured:
- ✅ Apple OAuth enabled in Supabase
- ✅ Redirect URLs configured in Supabase  
- ✅ RevenueCat production key installed
- ✅ Supabase anon key updated (full JWT)
- ✅ Bundle ID: `com.dmy.networth`

---

## 📱 **Build for TestFlight**

### **Step 1: Start the Build**

Run this command in your terminal:

```bash
cd "/Users/dmytrolozynskyi/Documents/Regent App/regent"
eas build --platform ios
```

**Important**: Don't use `--non-interactive`! You need interactive mode to verify credentials.

### **Step 2: During Build**

The build will ask you a few questions:

1. **"Select a build profile"**
   - Choose: `production` (or just press Enter)

2. **"Validate Apple credentials"**
   - It will check your Apple Developer account
   - Should be already configured from last time

3. **Build starts**
   - Takes ~10-15 minutes
   - You'll get a link to monitor progress

### **Step 3: Build Completes**

When done, you'll see:
```
✅ Build finished
📱 iOS build: https://expo.dev/...
```

---

## 🧪 **Submit to TestFlight**

### **Option 1: Automatic (Recommended)**

```bash
eas submit --platform ios
```

This will automatically:
- Upload the build to App Store Connect
- Submit to TestFlight for processing
- Takes ~5-10 minutes

### **Option 2: Manual**

1. Download the `.ipa` from the EAS build page
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Upload via Transporter app

---

## 🧪 **Test Your App**

### **1. Install TestFlight**
- Download from App Store if you don't have it

### **2. Wait for Processing**
- After submission, Apple processes the build (~5-30 minutes)
- You'll get an email when it's ready

### **3. Add Internal Testers**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → **TestFlight**
3. Add yourself (your Apple ID email)
4. You'll get a TestFlight invitation email

### **4. Install & Test**
- Open TestFlight on your iPhone
- Install "WorthView"
- Launch the app

---

## 🔍 **What to Test**

### **1. Apple Sign In**
```
✅ Tap "Continue with Apple"
✅ Opens Apple sign-in page
✅ Sign in with your Apple ID
✅ Redirects back to app
✅ Shows PIN setup screen
✅ Create 4-digit PIN
✅ Reaches home screen
```

### **2. Add Assets**
```
✅ Tap "Add Asset"
✅ Add 3+ assets (triggers paywall)
✅ Paywall appears automatically
```

### **3. RevenueCat Subscription**
```
✅ Paywall shows "£49/year"
✅ Shows "Start Free Trial" button
✅ Tap button → Apple payment sheet appears
✅ Complete purchase (Sandbox account)
✅ Subscription activates
✅ isPremium = true
✅ Can continue using app
```

### **4. Settings**
```
✅ Go to Settings
✅ See subscription status
✅ Can sign out
✅ Can delete account
```

---

## 🐛 **Troubleshooting**

### **Issue: "Build failed" (credentials)**
**Fix**: 
```bash
# Clear credentials and start fresh
eas credentials -p ios
# Then run build again
eas build --platform ios
```

### **Issue: Apple Sign In doesn't work**
**Fix**: Check Supabase dashboard
1. **Authentication → Providers → Apple**: Is it **Enabled**?
2. **Authentication → URL Configuration**: Are redirect URLs added?
   ```
   worthview://auth/callback
   exp://localhost:8081/--/auth/callback
   ```

### **Issue: RevenueCat shows "Wrong API Key"**
**Fix**: Already fixed! We updated to production key.

### **Issue: App crashes on launch**
**Fix**: Check console logs in Xcode or device logs

---

## 📊 **Monitor Your App**

### **EAS Dashboard**
- View builds: https://expo.dev/accounts/[your-account]/projects/worthview/builds
- Monitor build status, logs, crashes

### **RevenueCat Dashboard**
- View subscriptions: https://app.revenuecat.com
- Check customer activity, revenue

### **Supabase Dashboard**
- View users: https://supabase.com/dashboard/project/jkseowelliyafkoizjzx
- Check authentication logs

---

## 🎯 **Next: Production Release**

After TestFlight testing passes:

### **1. Prepare App Store Listing**
- App screenshots (required)
- App description
- Keywords
- Privacy policy URL
- Support URL

### **2. Submit for Review**
1. Go to App Store Connect
2. Create a new version
3. Fill in all metadata
4. Select the TestFlight build
5. Submit for review

### **3. Review Process**
- Takes 1-3 days typically
- Apple will test Apple Sign In and subscriptions
- If approved, you can release to App Store!

---

## ✅ **Ready to Build!**

Just run:
```bash
eas build --platform ios
```

And you're off! 🚀

---

## 📞 **Need Help?**

If you hit any issues:
1. Check the **Troubleshooting** section above
2. Check `APPLE_OAUTH_REVENUECAT_SETUP.md` for detailed config
3. Look at console logs for error messages

**Good luck!** 🎉
