# Website + Icons Setup Summary

This document explains how the WorthView website and app store icons were set up.

---

## Website Overview

**Live:** https://worthview.app  
**Repo:** https://github.com/lozynskyidv/worthview-website  
**Tech:** React + Vite + Tailwind CSS  
**Deployment:** Netlify (auto-deploy from GitHub)

### Key Features Built
1. **Sticky Header Navigation** - Stays at top with backdrop blur
2. **Mobile Menu** - Hamburger menu with dropdown (useState)
3. **Hero Section** - Optimized to fit above-the-fold on MacBook
4. **Smooth Scroll** - Click nav links to smoothly scroll to sections
5. **Responsive Design** - Mobile-first, desktop-optimized
6. **WorthView Logo** - WV monogram (48px hero, 32px header)

### How Deployment Works
```
Developer pushes to GitHub main branch
    ↓
Netlify webhook detects push
    ↓
Runs: npm run build
    ↓
Deploys dist/ to CDN
    ↓
Live at worthview.app in ~2 minutes
```

### Important Files
- **LandingPage.tsx** - Main page component (header, hero, features, pricing)
- **WorthViewIcon.tsx** - Logo SVG component
- **app-screenshot.png** - Must be real PNG with RGBA (not JPEG!)
- **DEVELOPMENT_GUIDE.md** - Complete development documentation

---

## App Store Icons

Located in this folder (`/app-store-icons/`):

### Files
- **WorthViewIcon.tsx** - React SVG component for logo
- **IconShowcase.tsx** - Interactive page to preview and download icons
- **README.md** - Export instructions

### Logo Specs
- **Design:** "WV" monogram on black rounded square
- **Background:** #1A1A1A (black)
- **Text:** #FAFAFA (white)
- **Font Weight:** 300 (light)
- **Letter Spacing:** -2px
- **Border Radius:** 26px (scales proportionally)

### Required Sizes for App Store
- 1024×1024 - App Store listing (required)
- 512×512 - App Store secondary
- 180×180 - iPhone App Icon
- 120×120 - iPhone App Icon (2x)
- 87×87 - iPhone Settings Icon
- 80×80 - iPhone Spotlight Icon (2x)
- 60×60 - iPhone Spotlight Icon

### How to Generate Icons

**Option 1: Use IconShowcase Component**
1. Run Figma prototype
2. Right-click each icon size → Save as SVG
3. Convert SVG to PNG using CloudConvert/Figma
4. Ensure no transparency (iOS requirement)

**Option 2: Export from WorthViewIcon.tsx**
1. Render component at desired size
2. Use browser dev tools to export SVG
3. Convert to PNG at exact dimensions

---

## Quick Reference

### Website Locations
- **Live Site:** worthview.app
- **Local Repo:** `/Users/dmytrolozynskyi/Documents/Regent App/worthview-website/`
- **GitHub:** github.com/lozynskyidv/worthview-website
- **Netlify:** app.netlify.com (auto-deploy)
- **Domain:** Namecheap (DNS → Netlify nameservers)

### App Locations
- **Local Repo:** `/Users/dmytrolozynskyi/Documents/Regent App/WorthView/`
- **GitHub:** github.com/lozynskyidv/regent
- **TestFlight:** appstoreconnect.apple.com
- **Icons Folder:** `/app-store-icons/` (this folder)

### Documentation
- **Website README:** `worthview-website/README.md`
- **Website Dev Guide:** `worthview-website/DEVELOPMENT_GUIDE.md`
- **App README:** `WorthView/README.md`
- **App Context:** `WorthView/PROJECT_CONTEXT.md`
- **Icons README:** `WorthView/app-store-icons/README.md` (this folder)

---

## Common Issues

### Website: Black Background on Screenshot
**Cause:** macOS saved JPEG as .png  
**Fix:** Verify with `file app-screenshot.png`, export real PNG from Figma

### Website: Hero Too Tall on MacBook
**Fix:** Already optimized (py-8 md:py-12, smaller headline, tighter spacing)

### Website: Mobile Menu Not Working
**Fix:** Ensure useState imported, Menu/X icons from lucide-react

### Icons: Can't Export at Exact Size
**Fix:** Use CloudConvert to convert SVG → PNG at specific dimensions

---

## Next Steps for Developers

### To Update Website
1. Clone repo: `git clone git@github.com:lozynskyidv/worthview-website.git`
2. Install: `npm install`
3. Run: `npm run dev`
4. Edit: `src/components/LandingPage.tsx`
5. Test: `npm run build`
6. Push to `main` branch → auto-deploys

### To Generate New Icons
1. Edit `WorthViewIcon.tsx` in this folder
2. Use IconShowcase component to preview
3. Export SVGs at each required size
4. Convert to PNG (no transparency for iOS)
5. Add to `WorthView/assets/` folder
6. Update `app.json` with new icon paths

### To Add App Store Link
1. Get App Store URL after approval
2. Update all "Download" buttons in LandingPage.tsx:
   ```tsx
   <button onClick={() => window.open('https://apps.apple.com/...', '_blank')}>
     Download on the App Store
   </button>
   ```
3. Push to GitHub → auto-deploys

---

## Architecture Overview

```
WorthView Project
├── iOS App (React Native + Expo)
│   ├── /Users/.../WorthView/
│   ├── GitHub: lozynskyidv/regent
│   └── Deploy: EAS Build → TestFlight → App Store
│
├── Website (React + Vite + Tailwind)
│   ├── /Users/.../worthview-website/
│   ├── GitHub: lozynskyidv/worthview-website
│   └── Deploy: Git push → Netlify → worthview.app
│
└── App Store Icons
    ├── /Users/.../WorthView/app-store-icons/
    └── Components: WorthViewIcon.tsx, IconShowcase.tsx
```

---

**Last Updated:** January 31, 2026  
**Status:** Production Ready ✅  
**Next Milestone:** App Store submission with live download link
