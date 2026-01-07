# Regent - Premium Net Worth Tracking

**Version:** 0.3.0 (P0 MVP Complete ✅)  
**Platform:** iOS only (React Native + Expo)  
**Target:** Mass Affluent Professionals (£100k-£1m net worth)

---

## 🚀 Quick Start

**New to this project?**  
1. Read **`PROJECT_CONTEXT.md`** ← **START HERE** (2-3 pages, 80/20 essentials)
2. For full product spec: **`REGENT_CURSOR_SPEC.md`** (3000+ lines, use only when needed)
3. Start building!

---

## 📦 Installation

```bash
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
npm install
npm start  # or: npm run ios
```

**Clear cache if needed:**
```bash
npx expo start --clear
```


## 🛠️ Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript 5.9
- **React:** 19.1.0 (locked for compatibility)
- **Navigation:** Expo Router (file-based, `<Slot />` only)
- **State:** React Context API
- **Storage:** AsyncStorage (data) + SecureStore (sensitive)
- **Icons:** Lucide React Native 0.562.0
- **Gestures:** react-native-gesture-handler 2.30.0

---

## 📱 Current Features (P0 MVP Complete)

✅ **Authentication:** Google OAuth, Face ID/PIN, Supabase Auth  
✅ **Paywall:** 14-day free trial, shown after sign-up  
✅ **Home Screen:** Net Worth, Assets, Liabilities cards  
✅ **CRUD:** Add/Edit/Delete assets & liabilities  
✅ **Detail Screens:** Full lists with swipe gestures  
✅ **Modals:** 2-step flow (type picker → specific form)  
✅ **Settings:** Currency switcher, Sign Out, GDPR-compliant Delete Account  
✅ **Charts:** Horizontal bar charts (category breakdown)  
✅ **Data:** AsyncStorage persistence (auto-save), encrypted cloud backups

---

## 🎯 Recent Additions

### **Paywall & Trial Management**
- 14-day free trial flow (sign up → paywall → start trial)
- Trial state persistence in AsyncStorage
- AuthGuard routing based on trial status
- Clean UX with no screen flashes

### **GDPR-Compliant Account Deletion**
- Complete data erasure (cloud + local)
- Supabase Edge Function with admin privileges
- Deletes: auth user, user profile, backups, local data, PIN
- Token state management for reliable deletion
- Comprehensive error handling with timeouts

### **OAuth Improvements**
- Token state management (stored in React state)
- Non-blocking profile sync (background operation)
- Comprehensive timeout handling (prevents infinite loading)
- Detailed diagnostic logging with timestamps

---

## 🔜 Next Up (P1 Features)

❌ Stock tracking (Twelve Data API)  
❌ Bank connections (TrueLayer OAuth)  
❌ Subscriptions (RevenueCat integration)  
❌ Performance chart (net worth over time)  
❌ TestFlight beta

---

## 🎨 Design System

All design constants live in **`/constants/`**:
- `Colors.ts` - Muted, premium palette
- `Typography.ts` - Font sizes, weights, line heights
- `Spacing.ts` - 4pt base scale (xs to 3xl)
- `Layout.ts` - Border radius, shadows

**Brand:** "Uber modernism + JPM restraint" - no gamification, no bright colors, no fluff.

---

## 📂 Project Structure

```
app/                  # Screens (Expo Router)
components/           # Modals, Cards, Swipeable Items
contexts/             # DataContext, ModalContext
utils/                # storage.ts, generateId.ts
constants/            # Design system
types/                # TypeScript interfaces
web-prototype/        # Reference only (NOT for production)
```

---

## ⚠️ Critical Constraints

**iOS Only:** Test on physical device (Face ID, gestures)  
**Local Storage Only:** No backend, no cloud sync (MVP)  
**React 19 Issues:** Always use `<Slot />`, never `<Stack>` with `screenOptions`  
**Gestures:** Requires `GestureHandlerRootView` at app root

---

## 🐛 Known Issues

**Face ID in Expo Go:** Shows passcode (Expo Go limitation, works in standalone build)  
**Currency:** Symbol-only change (no conversion yet)

---

## 📚 Documentation

| Doc | Purpose | When to Use |
|-----|---------|-------------|
| **`PROJECT_CONTEXT.md`** | Self-sufficient quick reference | **Start here, use 95% of the time** |
| **`REGENT_CURSOR_SPEC.md`** | Complete product specification | Complex integrations only (TrueLayer, RevenueCat, etc.) |
| **Git History** | Build history & decisions | `git log --oneline` for past changes |

---

## 🚀 Development Workflow

**Start a new feature:**
1. Check `PROJECT_CONTEXT.md` for patterns
2. Create component/screen in appropriate folder
3. Use design constants from `/constants/`
4. Update `DataContext` if touching global state
5. Test on physical iPhone (Face ID, gestures)

**Adding a modal:**
1. Create component in `/components/`
2. Register in `ModalContext.tsx`
3. Use `useModals()` hook to open

**Data operations:**
1. Update via `DataContext` methods
2. AsyncStorage auto-saves
3. UI re-renders automatically

---

## 🧪 Testing Checklist

- [ ] Works on physical iPhone (Face ID, gestures)
- [ ] Data persists after app close
- [ ] Empty states display correctly
- [ ] Error states show helpful messages
- [ ] Animations are smooth (60fps)
- [ ] No console errors/warnings

---

## 📞 For Questions

**Product Decisions:** See `REGENT_CURSOR_SPEC.md` sections 1-4  
**Technical Patterns:** See `PROJECT_CONTEXT.md` "Development Patterns"  
**Build History:** Run `git log --oneline` or check commit messages

---

**Built with restraint for discerning professionals.** 🎯
