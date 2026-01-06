# Regent App - Quick Start

## ⚡ Setup in 5 Steps (30 minutes)

### 1. Create Supabase Project (5 min)
```
1. Go to supabase.com → Sign up
2. Create new project
3. Wait for setup (~2 min)
```

### 2. Run Database Schema (2 min)
```
1. Supabase dashboard → SQL Editor
2. Copy SQL from SETUP_GUIDE.md (Step 2)
3. Click "Run"
```

### 3. Setup Google OAuth (10 min)
```
1. Google Cloud Console → Create project
2. APIs & Services → Credentials → OAuth client ID
3. Application type: iOS
4. Copy Client ID + Secret
5. Add to Supabase → Authentication → Providers → Google
6. Add redirect URI: https://[project-id].supabase.co/auth/v1/callback
```

### 4. Add Environment Variables (2 min)
```bash
# Create .env file
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent
touch .env

# Add these lines (replace with your values):
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx
```

Get values from: Supabase → Settings → API

### 5. Test the App (10 min)
```bash
npm start
# Press 'i' for iOS

# Then test:
1. Sign up with Google ✓
2. Create PIN ✓
3. Add test asset ✓
4. Backup data ✓
5. Restore data ✓
```

---

## 🎯 What Works Now

✅ Google OAuth sign-up/sign-in  
✅ PIN/Face ID authentication  
✅ Encrypted cloud backups  
✅ Data restore  
✅ Sign out  
✅ Delete account  
✅ All existing features (assets, liabilities, CRUD, charts)

---

## 📋 What's Next (Week 2)

❌ RevenueCat integration  
❌ Paywall screen  
❌ Subscription flow  
❌ TestFlight build

---

## 🆘 Troubleshooting

### "Supabase URL is invalid"
```bash
# Restart Metro bundler
npx expo start --clear
```

### OAuth redirect doesn't work
```json
// Check app.json has:
{
  "expo": {
    "scheme": "regent"
  }
}
```

### Tables not in Supabase
- SQL Editor → Run the schema again
- Refresh page

---

## 📁 Key Files

- `SETUP_GUIDE.md` - Detailed setup instructions
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Technical documentation
- `utils/supabase.ts` - Supabase client
- `utils/encryption.ts` - Backup encryption
- `contexts/DataContext.tsx` - Auth + backup logic

---

## 🔗 Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Setup Guide](./SETUP_GUIDE.md)

---

**Ready to go? Start with Step 1!** 🚀
