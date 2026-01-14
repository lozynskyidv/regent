# Quick Deployment Guide - Invite System

**Time Required:** 10-15 minutes  
**Prerequisites:** Supabase CLI installed and logged in

---

## Step 1: Deploy Database Migration (2 minutes)

```bash
cd /Users/dmytrolozynskyi/Documents/Regent\ App/regent

# Push migration to Supabase
supabase db push
```

**What this does:**
- Creates `invite_codes` table
- Adds `invites_remaining` column to `users` table
- Seeds 10 founder codes
- Sets up RLS policies

**Expected output:**
```
✓ Applying migration 001_create_invite_codes.sql...
✓ Migration applied successfully
```

---

## Step 2: Deploy Edge Functions (5 minutes)

```bash
# Deploy all 3 functions
supabase functions deploy validate-invite
supabase functions deploy generate-invite-codes
supabase functions deploy mark-invite-used
```

**Expected output for each:**
```
✓ Deployed function validate-invite
URL: https://[project-id].supabase.co/functions/v1/validate-invite
```

**Save these URLs** - you'll need them for debugging.

---

## Step 3: Verify Deployment (3 minutes)

### Check Database

```bash
# Open Supabase Studio
supabase studio
```

Navigate to **Table Editor** → `invite_codes`  
**Expected:** 10 rows with codes `RGNT-F0UND1` through `RGNT-F0UNDA`

### Test Edge Function

```bash
# Test validate-invite function
curl -X POST \
  https://[project-id].supabase.co/functions/v1/validate-invite \
  -H "Content-Type: application/json" \
  -d '{"code": "RGNT-F0UND1"}'
```

**Expected response:**
```json
{
  "valid": true,
  "code_id": "uuid-here",
  "code": "RGNT-F0UND1"
}
```

---

## Step 4: Test in App (5 minutes)

```bash
# Start Expo
npm start

# Press 'i' for iOS simulator
```

### Test Flow

1. **App opens to invite code screen** ✓
2. **Enter `RGNT-F0UND1`** → Should proceed to signup
3. **Sign up with Google/Email** → Should create account
4. **Complete Face ID setup** → Should reach home screen
5. **Check home screen** → Should see "Share Invite" card with "5 left"

### Verify in Database

```sql
-- Check code was marked as used
SELECT * FROM invite_codes WHERE code = 'RGNT-F0UND1';
-- used_by_user_id should be populated

-- Check new codes were generated
SELECT * FROM invite_codes WHERE created_by_user_id = '<your-user-id>';
-- Should see 5 codes

-- Check invites remaining
SELECT email, invites_remaining FROM users WHERE id = '<your-user-id>';
-- Should be 5
```

---

## Step 5: Distribute Founder Codes

### Available Codes

```
RGNT-F0UND1
RGNT-F0UND2
RGNT-F0UND3
RGNT-F0UND4
RGNT-F0UND5
RGNT-F0UND6
RGNT-F0UND7
RGNT-F0UND8
RGNT-F0UND9
RGNT-F0UNDA
```

### Distribution Strategy

**Option 1: Direct Message**
```
Hey [Name],

You're invited to join Regent - exclusive net worth tracking for professionals.

Your invite code: RGNT-F0UND1

Download: [App Store link when live]

Regent is invite-only during private beta. You'll get 5 invites to share.

- [Your name]
```

**Option 2: Email**
- Subject: "Your exclusive Regent invite"
- Include code prominently
- Explain what Regent is
- Mention they'll get 5 invites to share

**Option 3: In-Person**
- Show them the app
- Give them a code
- Help them sign up on the spot

---

## Troubleshooting

### Issue: Migration fails

**Error:** `relation "users" does not exist`  
**Solution:** Users table might not exist yet. Create it first or modify migration to handle this.

```sql
-- Check if users table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
);
```

### Issue: Edge Function deployment fails

**Error:** `Failed to deploy function`  
**Solution:** Check you're logged in to correct project

```bash
supabase projects list
supabase link --project-ref [your-project-id]
```

### Issue: Code validation returns 404

**Error:** `Function not found`  
**Solution:** Verify function deployed successfully

```bash
supabase functions list
```

Should show:
- validate-invite
- generate-invite-codes
- mark-invite-used
- delete-account (existing)

### Issue: App shows "Invalid code" for valid code

**Possible causes:**
1. Edge Function not deployed
2. Database migration not applied
3. Code already used
4. Network error

**Debug:**
```bash
# Check Edge Function logs
supabase functions logs validate-invite --tail

# Check database
SELECT * FROM invite_codes WHERE code = 'RGNT-F0UND1';
```

---

## Rollback (If Needed)

### Rollback Migration

```bash
# Revert to previous migration
supabase db reset
```

**⚠️ WARNING:** This deletes ALL data. Only use in development.

### Disable Invite System

If you need to temporarily disable:

```sql
-- Deactivate all codes
UPDATE invite_codes SET is_active = FALSE;
```

To re-enable:

```sql
UPDATE invite_codes SET is_active = TRUE;
```

---

## Monitoring

### Check Invite Usage

```sql
-- Total codes generated
SELECT COUNT(*) FROM invite_codes;

-- Total codes used
SELECT COUNT(*) FROM invite_codes WHERE used_by_user_id IS NOT NULL;

-- Codes remaining
SELECT COUNT(*) FROM invite_codes WHERE used_by_user_id IS NULL AND is_active = TRUE;

-- Recent signups
SELECT 
  u.email,
  ic.code,
  ic.used_at
FROM users u
JOIN invite_codes ic ON ic.used_by_user_id = u.id
ORDER BY ic.used_at DESC
LIMIT 10;
```

### Monitor Edge Function Performance

```bash
# Real-time logs
supabase functions logs validate-invite --tail

# Check for errors
supabase functions logs validate-invite | grep ERROR
```

---

## Success Criteria

✅ **Deployment Successful If:**
1. Migration applied (10 founder codes in database)
2. 3 Edge Functions deployed
3. Test code validates successfully
4. Can complete full signup flow
5. New user receives 5 invite codes
6. Share Invite card appears on home screen

---

## Next Steps After Deployment

1. **Test with real device** (not just simulator)
2. **Share 1-2 founder codes** with trusted friends
3. **Monitor database** for first signups
4. **Check Edge Function logs** for errors
5. **Iterate based on feedback**

---

## Support

**Issues?** Check:
1. `INVITE_SYSTEM_IMPLEMENTATION.md` - Full documentation
2. Supabase Dashboard - Database & Function logs
3. Expo logs - Frontend errors
4. `supabase/functions/*/index.ts` - Edge Function code

---

**Ready to launch!** 🚀
