# App Store Submission Checklist

**Last Updated:** January 30, 2026  
**Target Launch:** TBD  
**Current Status:** TestFlight Build 1.0.0 (1) submitted

---

## ✅ Progress Tracker

**Overall Completion:** 0/47 items

### Quick Status:
- [ ] Branding & Visual Identity (0/8)
- [ ] App Store Screenshots & Media (0/8)
- [ ] App Store Metadata & Copy (0/10)
- [ ] Legal & Support Requirements (0/6)
- [ ] Technical Requirements (0/9)
- [ ] Pre-Submission Testing (0/6)

---

## 🎨 1. BRANDING & VISUAL IDENTITY (0/8)

### App Name
- [ ] **Finalize app name** (currently "WorthView")
  - Check App Store availability (search for exact name)
  - Verify trademark availability (USPTO search)
  - Ensure name fits in 30 characters max
  - Consider SEO keywords ("net worth", "wealth", "tracker")
  
- [ ] **Reserve app name in App Store Connect**
  - Create new app listing
  - Lock in the name (prevents others from taking it)

### Logo & Icon Design

- [ ] **Design primary logo**
  - Vector format (SVG or AI)
  - Works in full color
  - Works in monochrome (black/white)
  - Scalable from 16px to 1024px
  - Matches "Uber modernism + JPM restraint" aesthetic
  - No gradients (Apple design guidelines)
  
- [ ] **Create app icon (1024x1024px)**
  - PNG format, no transparency
  - No rounded corners (iOS adds them automatically)
  - Must fill entire square (no padding/margins)
  - Test at multiple sizes (20px, 29px, 40px, 60px, 76px, 83.5px, 1024px)
  - Consider using https://www.appicon.co/ for size generation
  
- [ ] **Design alternative icon variants** (optional)
  - Light mode optimized
  - Dark mode optimized
  - macOS version (if planning Mac Catalyst)
  
- [ ] **Export icon assets**
  - Use Xcode or online tool to generate all required sizes
  - Update `app.json` with new icon path
  - Replace `/assets/icon.png` with final design
  
- [ ] **Update splash screen** (optional)
  - Match icon design language
  - Replace `/assets/splash-icon.png`
  
- [ ] **Update adaptive icon** (Android prep, optional)
  - Replace `/assets/adaptive-icon.png`

---

## 📱 2. APP STORE SCREENSHOTS & MEDIA (0/8)

### Required Screenshot Sizes (Minimum 2 Required)

- [ ] **6.7" Display (iPhone 15 Pro Max, 14 Pro Max, 13 Pro Max, 12 Pro Max)**
  - Resolution: 1290 x 2796 pixels
  - Minimum: 3 screenshots
  - Maximum: 10 screenshots
  - **PRIORITY:** This is the default shown on App Store

- [ ] **6.5" Display (iPhone 11 Pro Max, XS Max)**
  - Resolution: 1242 x 2688 pixels
  - Required if not providing 6.7"
  - Minimum: 3 screenshots

### Screenshot Content Strategy

- [ ] **Screenshot 1: Empty State / Onboarding**
  - Show "Welcome, John" hero card with NYC skyline
  - "Add Your First Asset" CTA button visible
  - Demonstrates beautiful design immediately

- [ ] **Screenshot 2: Net Worth Hero Card**
  - Show large net worth value (use impressive example: £480,000)
  - Performance chart with upward trend
  - Time range selector visible (1M, 3M, 6M, 1Y, All)
  - Interactive chart with indicator dot

- [ ] **Screenshot 3: Assets Overview**
  - Show diverse asset types (Stocks, Crypto, Property, Bank)
  - Live prices displayed
  - Category breakdown chart visible

- [ ] **Screenshot 4: Portfolio Detail**
  - Show investment portfolio with multiple holdings
  - Live stock prices (AAPL, MSFT, GOOGL examples)
  - "Updated just now" timestamp

- [ ] **Screenshot 5: Paywall Screen**
  - £49/year pricing clearly visible
  - 7-day free trial highlighted
  - 3 key benefits listed
  - "Continue with Regent" CTA

### Screenshot Design Polish

- [ ] **Add text overlays (optional but recommended)**
  - Large headline on each screenshot
  - Example: "Track Your Net Worth" / "Live Investment Prices" / "Premium Design"
  - Use SF Pro Display font (iOS native)
  - Keep text minimal and readable

- [ ] **Use device frames (optional)**
  - Tools: https://www.screely.com/ or https://screenshot.rocks/
  - Adds professional polish
  - Shows app in context of physical iPhone

### App Preview Video (Optional but Recommended)

- [ ] **Record 30-second app preview video**
  - Show: Sign in → Add asset → See net worth → Pull to refresh → Interact with chart
  - No sound required (most users watch muted)
  - Max file size: 500MB
  - Portrait orientation only
  - Resolution: Same as screenshots

---

## 📝 3. APP STORE METADATA & COPY (0/10)

### Required Text Fields

- [ ] **App Name (30 characters max)**
  - Current: "WorthView"
  - Consider: "WorthView - Net Worth Tracker" (30 chars)
  - Or: "WorthView Wealth Tracker" (24 chars)

- [ ] **Subtitle (30 characters max)**
  - Examples:
    - "See everything you own" (21 chars)
    - "Your complete net worth" (23 chars)
    - "All assets, one place" (21 chars)
  - Appears below app name in search results

- [ ] **Promotional Text (170 characters max, editable anytime)**
  - One-sentence pitch shown above description
  - Example: "Everything you own and owe, in one place. Track stocks, crypto, property, and all your assets. £49/year with 7-day free trial."

- [ ] **Description (4000 characters max)**
  - **Opening hook** (first 2-3 lines visible without "more")
  - **Key features** (bullet list)
  - **Target audience** (anyone tracking their net worth)
  - **Privacy & security** (local-first, encrypted)
  - **Pricing transparency** (£49/year, 7-day trial)
  - **Call to action**
  
  Template structure:
  ```
  [Hook: One sentence problem/solution]
  
  WorthView helps you track your complete net worth in one simple app. See everything you own and owe at a glance.
  
  KEY FEATURES:
  • Track stocks, crypto, ETFs, and commodities with live prices
  • Add property, bank accounts, and all your assets
  • See your complete financial picture
  • Interactive performance charts
  • Face ID security
  • Private and encrypted
  
  DESIGNED FOR PRIVACY:
  • Your data stays on your device
  • No bank connections required
  • You control everything
  
  SUBSCRIPTION:
  £49/year with 7-day free trial
  
  Simple, clear, and private net worth tracking.
  ```

- [ ] **Keywords (100 characters max, comma-separated)**
  - Research competitors' keywords using App Store search
  - High-value keywords: "net worth", "wealth", "portfolio", "investment", "assets"
  - Example: "net worth,wealth tracker,portfolio,investment,assets,liabilities,financial,stocks,crypto,money"
  - Use https://www.apptweak.com/ or https://www.apptopia.com/ for keyword research (optional)

- [ ] **What's New (4000 characters max)**
  - Version 1.0.0 release notes
  - Highlight: "Initial release with full feature set"
  - List major features as bullet points

### Category Selection

- [ ] **Primary Category**
  - Recommended: **Finance** (most relevant)
  - Alternative: **Productivity** (if positioning as tool)

- [ ] **Secondary Category (optional)**
  - Consider: **Business** or **Lifestyle**

### Age Rating

- [ ] **Complete Age Rating Questionnaire**
  - Answer all questions truthfully
  - Expected rating: **4+** (no mature content)
  - Financial apps typically require no warnings

### Copyright & Version

- [ ] **Copyright text**
  - Format: "© 2026 [Your Name/Company]"
  - Or: "© 2026 WorthView App"

- [ ] **Version number**
  - Current: 1.0.0
  - Build number: 1

---

## ⚖️ 4. LEGAL & SUPPORT REQUIREMENTS (0/6)

### Privacy Policy (REQUIRED)

- [ ] **Create comprehensive privacy policy**
  - Must cover:
    - Data collection (email, name, financial data)
    - Third-party services (Supabase, RevenueCat, Twelve Data API)
    - Data storage (local + cloud backups)
    - Face ID / biometric data usage
    - User rights (GDPR Article 17 - deletion)
    - Cookies/tracking (if applicable)
  - Host on public URL (not in-app)
  - Recommended tools:
    - https://www.termsfeed.com/privacy-policy-generator/ (paid)
    - https://www.privacypolicies.com/ (paid)
    - https://www.freeprivacypolicy.com/ (free with watermark)
  - **Template sections:**
    1. Information We Collect
    2. How We Use Your Information
    3. Data Storage & Security
    4. Third-Party Services
    5. Your Rights (GDPR)
    6. Contact Information

- [ ] **Privacy policy URL in App Store Connect**
  - Must be publicly accessible
  - Must not require login
  - Example: https://worthview.app/privacy or https://yourname.github.io/worthview-privacy

### Support URL (REQUIRED)

- [ ] **Create support page/email**
  - Options:
    - Simple webpage: FAQ + contact email
    - Help center: https://www.intercom.com/ (paid)
    - GitHub Pages: Free static site
    - Simple email: support@worthview.app (just provide mailto: link)
  - Must be publicly accessible
  - Example: https://worthview.app/support or mailto:support@worthview.app

- [ ] **Support email/contact method**
  - Set up dedicated support email
  - Or use personal email if solo founder

### Marketing URL (Optional)

- [ ] **Create marketing/landing page**
  - Simple one-pager explaining app
  - Example: https://worthview.app
  - Can use free tools:
    - GitHub Pages
    - Vercel
    - Netlify
    - Carrd.co (paid, $19/year)

### Terms of Service (Recommended)

- [ ] **Create terms of service**
  - Subscription terms (£49/year, auto-renewal, cancellation)
  - Prohibited use cases
  - Limitation of liability
  - Dispute resolution
  - Can use same generator as privacy policy

### App Store License Agreement

- [ ] **Review Standard Apple EULA**
  - Default covers most apps
  - Custom EULA only needed for special terms

---

## 🔧 5. TECHNICAL REQUIREMENTS (0/9)

### App Store Connect Configuration

- [ ] **Complete all required fields in App Store Connect**
  - App Information
  - Pricing and Availability
  - App Privacy (privacy questionnaire)
  - Age Rating
  - App Review Information

### In-App Purchase Configuration

- [ ] **Verify RevenueCat product is live**
  - Product ID: `premium` (confirm in RevenueCat dashboard)
  - Price: £49/year
  - Trial: 7 days
  - Status: "Ready to Submit"

- [ ] **Link RevenueCat to App Store Connect**
  - Verify App Store Connect API key uploaded to RevenueCat
  - Test purchase in sandbox mode
  - Confirm entitlements grant correctly

### App Review Information

- [ ] **Create demo account for App Review**
  - Email: reviewer@worthview.app (or similar)
  - Password: Provide to Apple
  - Pre-populate with sample data (assets, liabilities, charts)
  - Ensure subscription is active (or provide test IAP credentials)

- [ ] **Write App Review Notes**
  - Explain subscription model (£49/year, 7-day trial)
  - Explain demo account credentials
  - Mention any special features (Face ID, live prices)
  - Note: "Financial data is manually entered, no bank connections"
  - Clarify: "Live prices via Twelve Data API (read-only)"

### Build Configuration

- [ ] **Increment version/build number**
  - If resubmitting after rejection
  - Version: 1.0.0 → 1.0.1 (if changes made)
  - Build: 1 → 2, 3, etc.

- [ ] **Verify app.json configuration**
  - Bundle identifier: `com.dmy.networth`
  - Version: `1.0.0`
  - Icon, splash screen paths correct
  - Orientation: Portrait only (locked)

- [ ] **Check for debug code**
  - Remove console.log statements (or use production-safe logger)
  - Remove test data generators (or hide behind debug flag)
  - Verify no development URLs hardcoded

### Production Keys Verification

- [ ] **Confirm all production keys active**
  - ✅ RevenueCat production iOS SDK key: `appl_YsKPtpcVpohFQoThbTiytPNKxPB`
  - ✅ Apple OAuth JWT configured in Supabase
  - Supabase production URL (not staging)
  - Twelve Data API key (verify quota limits)

- [ ] **Test all API integrations**
  - Supabase auth (Google, Apple, Email)
  - RevenueCat purchase flow
  - Twelve Data price fetching
  - Cloud backup save/restore

---

## 🧪 6. PRE-SUBMISSION TESTING (0/6)

### Critical User Flows

- [ ] **Test complete onboarding flow**
  - Sign up with Apple Sign In
  - Set up Face ID/PIN
  - See paywall
  - Add first asset (trigger 7-second timer)
  - Paywall appears after delay
  - Complete purchase (sandbox)
  - Access home screen

- [ ] **Test subscription scenarios**
  - New purchase (7-day trial → paid)
  - Restore purchases (different device)
  - Cancel subscription
  - Resubscribe after cancellation

- [ ] **Test data persistence**
  - Add assets/liabilities
  - Close app completely
  - Reopen → verify data persists
  - Pull to refresh → prices update

- [ ] **Test account lifecycle**
  - Sign out → sign back in
  - Delete account → data fully cleared
  - Create new account → starts fresh

### Device Testing

- [ ] **Test on multiple device sizes**
  - iPhone 15 Pro Max (6.7")
  - iPhone SE (4.7" - smallest screen)
  - Verify layouts don't break
  - Safe area insets correct

- [ ] **Test Face ID on physical device**
  - Won't work in Simulator
  - Test both enable and authenticate flows
  - Test PIN fallback

---

## 📋 7. SUBMISSION WORKFLOW (Reference)

### Step-by-Step Submission

1. **Log in to App Store Connect** (https://appstoreconnect.apple.com/)
2. **Navigate to your app** (currently shows TestFlight build)
3. **Click "+ Version or Platform"** → "iOS"
4. **Enter version number** (1.0.0)
5. **Add screenshots** (upload for 6.7" display minimum)
6. **Fill out all metadata** (name, subtitle, description, keywords)
7. **Add privacy policy & support URLs**
8. **Complete privacy questionnaire**
9. **Set age rating** (complete questionnaire)
10. **Add App Review Information** (demo account + notes)
11. **Select build** (choose TestFlight build 1.0.0 (1))
12. **Submit for review**

### Expected Timeline

- **App Review:** 24-48 hours typically (can be up to 7 days)
- **Rejections:** 40% of first submissions get rejected (common issues below)
- **Resubmission:** Usually reviewed faster (12-24 hours)

### Common Rejection Reasons (Avoid These)

- Missing privacy policy or inaccessible URL
- In-app purchase not configured correctly
- App crashes on launch
- Missing demo account credentials
- Face ID permission not explained (already handled in app.json)
- Screenshots don't match actual app
- Misleading app description

---

## 🎯 QUICK START: Minimum Viable Submission (Do This First)

If you want to submit ASAP, focus on these **absolute essentials**:

### Phase 1: Branding (1-2 days)
1. [ ] Finalize app name
2. [ ] Design app icon (1024x1024px)
3. [ ] Generate icon assets

### Phase 2: Screenshots (1 day)
1. [ ] Capture 3 screenshots on iPhone 15 Pro Max simulator
2. [ ] Screenshot 1: Empty state onboarding
3. [ ] Screenshot 2: Net worth card with chart
4. [ ] Screenshot 3: Assets overview

### Phase 3: Legal (1-2 days)
1. [ ] Generate privacy policy (use free generator)
2. [ ] Host on GitHub Pages or similar
3. [ ] Set up support email (can be personal email)

### Phase 4: Metadata (2-3 hours)
1. [ ] Write app description (500 words minimum)
2. [ ] Choose keywords
3. [ ] Write promotional text

### Phase 5: Technical (1-2 hours)
1. [ ] Create demo account with sample data
2. [ ] Write app review notes
3. [ ] Verify production keys

### Phase 6: Submit (30 minutes)
1. [ ] Upload everything to App Store Connect
2. [ ] Complete privacy questionnaire
3. [ ] Click "Submit for Review"

**Total Estimated Time:** 5-7 days (if working solo)

---

## 🆘 RESOURCES & TOOLS

### Design Tools
- **App Icon Generator:** https://www.appicon.co/ (free)
- **Screenshot Mockups:** https://screenshot.rocks/ (free)
- **Screenshot Frames:** https://www.screely.com/ (free)
- **Logo Design:** Figma (free), Canva (freemium), Adobe Illustrator (paid)

### Legal Tools
- **Privacy Policy:** https://www.freeprivacypolicy.com/ (free)
- **Terms Generator:** https://www.termsfeed.com/ (paid but thorough)

### Hosting (for privacy policy/support page)
- **GitHub Pages:** https://pages.github.com/ (free)
- **Vercel:** https://vercel.com/ (free tier)
- **Netlify:** https://www.netlify.com/ (free tier)

### App Store Optimization (ASO)
- **Keyword Research:** https://www.apptopia.com/ (freemium)
- **Competitor Analysis:** https://www.apptweak.com/ (paid)

### Apple Documentation
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Screenshot Specifications:** https://help.apple.com/app-store-connect/#/devd274dd925
- **Metadata Best Practices:** https://developer.apple.com/app-store/product-page/

---

## 📊 PROGRESS TRACKING

Update this section as you complete items:

**Last Updated:** January 30, 2026

### Completed Milestones:
- ✅ TestFlight build submitted (Build 1.0.0 (1))
- ✅ RevenueCat production keys configured
- ✅ Apple OAuth configured
- [ ] Branding finalized
- [ ] Screenshots created
- [ ] Legal pages published
- [ ] Metadata written
- [ ] App Store submission completed
- [ ] App approved and live

### Blockers:
- None currently

### Next Session Goals:
1. Finalize app name
2. Design app icon
3. Start screenshot creation

---

**Good luck with your submission!** 🚀
