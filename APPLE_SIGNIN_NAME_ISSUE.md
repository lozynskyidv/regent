# Apple Sign In Name Issue - Complete Documentation

**Status:** ❌ **UNRESOLVED** (as of Build 14, Feb 9, 2026)  
**Impact:** CRITICAL - Blocking App Store submission  
**Issue:** App displays "User" instead of actual user name from Apple account

---

## Problem Statement

When users sign in with Apple, the app should display their real name (e.g., "J. Rothschild" or "D. Lozynskyi"). Instead, it always shows "User" as a placeholder, making the app feel impersonal and broken.

---

## Root Cause Analysis

### Confirmed Facts:
1. ✅ **Apple IS sending the name** - Dev logs show `givenName: "Dmytro", familyName: "Lozynskyi"`
2. ✅ **Our extraction code works** - Successfully extracts and combines to "Dmytro Lozynskyi"
3. ❌ **Name not reaching database** - Supabase `users` table shows blank "Display name" column
4. ❌ **Name not in user metadata** - `supabaseUser.user_metadata` missing `full_name` field

### The Race Condition:
```
Sign In Flow:
1. signInWithIdToken() completes
2. Auth listener fires IMMEDIATELY → calls syncUserProfile()
3. syncUserProfile() reads user_metadata → EMPTY at this point
4. Creates database record with name: null
5. Our code tries to update metadata → TOO LATE, record already created
```

---

## All Attempts to Fix (Builds 10-14)

### Build 10 (Feb 6, 2026) - Basic Metadata Update
**Approach:** Extract name from Apple credential, call `updateUser()` after sign-in

**Code:**
```typescript
const fullName = `${credential.fullName.givenName} ${credential.fullName.familyName}`;
await supabase.auth.updateUser({
  data: { full_name: fullName }
});
```

**Result:** ❌ **FAILED** - Name never appeared  
**Why:** updateUser() called after syncUserProfile() already ran

---

### Build 11 (Feb 6, 2026) - Extensive Diagnostic Logging
**Approach:** Add comprehensive logging to see what Apple actually sends

**Code:**
```typescript
console.log('👤 Full name object:', JSON.stringify(credential.fullName, null, 2));
console.log('🔍 givenName:', givenName);
console.log('🔍 familyName:', familyName);
console.log('✅ Full name extracted:', fullName);
```

**Result:** ✅ **Confirmed name extraction works**  
**Finding:** Apple DOES send name on first authorization, extraction code works perfectly

---

### Build 12 (Feb 7, 2026) - Debug View in Settings
**Approach:** Add UI to display raw user_metadata to see what's stored

**Code:**
```typescript
{supabaseUser && (
  <Text>{JSON.stringify(supabaseUser.user_metadata, null, 2)}</Text>
)}
```

**Result:** ❌ **Showed empty metadata** - Confirmed name not being stored  
**Finding:** The updateUser() call wasn't persisting to the session

---

### Build 13 (Feb 7, 2026) - Direct Database Update
**Approach:** Bypass auth metadata, write directly to users table

**Code:**
```typescript
await supabase.auth.updateUser({ data: { full_name: fullName } });
await supabase.from('users').upsert({
  id: data.user.id,
  name: fullName,  // Direct database write
  ...
});
```

**Result:** ❌ **FAILED** - Still showed "User"  
**Why:** syncUserProfile() still ran first with empty metadata, our upsert came too late

---

### Build 14 (Feb 9, 2026) - Pass Name During Sign-In
**Approach:** Use `options.data` parameter in signInWithIdToken() to set metadata atomically

**Code:**
```typescript
await supabase.auth.signInWithIdToken({
  provider: 'apple',
  token: credential.identityToken,
  options: {
    data: {
      full_name: fullName,
      given_name: credential.fullName?.givenName,
      family_name: credential.fullName?.familyName,
    }
  }
});
```

**Result:** ❌ **FAILED** - Still showed "User"  
**Why:** UNKNOWN - This should work per Supabase docs, metadata should be available immediately

---

## Technical Details

### Where Name is Read:
**File:** `app/home.tsx` (Line 255-262)
```typescript
const getUserFullName = (): string => {
  const fullName = 
    supabaseUser?.user_metadata?.full_name ||  // ← Always undefined
    supabaseUser?.user_metadata?.name ||        // ← Always undefined
    user?.name ||                                // ← Local user, usually null
    'User';                                      // ← Fallback (always used)
  return fullName;
};
```

### Where Name Should Be Set:
**File:** `contexts/DataContext.tsx` (Line 618)
```typescript
name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null
```

This runs in `syncUserProfile()` which is called from auth listener:
```typescript
// Line 166-186 DataContext.tsx
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    // Runs in background, doesn't wait
    syncUserProfile(session.user).catch(err => {...});
  }
});
```

### The Timing Issue:
```
T+0ms: signInWithIdToken() called
T+100ms: Sign-in succeeds, returns user object
T+101ms: Auth listener fires (SIGNED_IN event)
T+102ms: syncUserProfile() starts, reads user_metadata
T+103ms: user_metadata is empty/stale
T+104ms: Creates database record with name: null
T+105ms: Our updateUser() call starts (in app/index.tsx)
T+200ms: updateUser() completes, metadata updated
T+201ms: TOO LATE - database already has null name
```

---

## Apple's Name Limitation

**Critical Constraint:** Apple only provides the user's full name during the **FIRST** authorization between a user's Apple ID and an app's Bundle ID. This is permanent and cannot be reset by:
- Deleting the app
- Deleting the user account
- "Stop Using Apple ID" in Settings (doesn't fully revoke)

The only way to get Apple to send the name again:
1. Different Apple ID
2. Different app Bundle ID
3. System-level revocation (unreliable)

This means once a user signed in during Builds 7-9 (before name extraction code existed), Apple will never send their name again for this app.

---

## Attempted Solutions Not Tried Yet

### Solution A: Block Auth Listener
**Approach:** Don't background syncUserProfile(), WAIT for it:
```typescript
if (event === 'SIGNED_IN' && session) {
  await syncUserProfile(session.user);  // Block until complete
}
```
**Risk:** Could slow down sign-in, might cause other race conditions

### Solution B: Manual Profile Input
**Approach:** Show "Welcome! What's your name?" screen on first sign-in if name is missing
**Pros:** 
- Always works, no Apple limitations
- User control over display name
- Industry standard (Instagram, Twitter, etc.)
**Cons:** Extra step for users

### Solution C: Delay syncUserProfile
**Approach:** Add artificial delay before syncing profile:
```typescript
await new Promise(resolve => setTimeout(resolve, 500));
await syncUserProfile(session.user);
```
**Risk:** Hacky, unreliable, could still race

---

## Impact Assessment

### User Experience:
- **Poor first impression** - "User" makes app feel broken/impersonal
- **No personalization** - Can't greet user by name
- **Confusing** - Users expect their Apple name to appear

### App Store Review:
- **Likely rejection** - Reviewers will see "User" with their test accounts
- **Poor quality signal** - Looks like incomplete authentication
- **Already rejected once** - Second rejection looks worse

### Business Impact:
- **Blocks launch** - Cannot ship with this bug
- **Wastes time** - Multiple build cycles (10→11→12→13→14) with no fix
- **Erodes confidence** - Major feature not working

---

## Recommended Next Steps

### Option 1: Manual Name Input (RECOMMENDED)
Implement a welcome screen asking for name if missing:
```typescript
if (getUserFullName() === 'User') {
  router.push('/welcome-name');  // Ask user to enter name
}
```
**Time:** ~30 minutes  
**Reliability:** 100%  
**User Impact:** Minimal (one extra screen)

### Option 2: Test Solution A (Block Auth Listener)
Modify DataContext to await syncUserProfile():
```typescript
if (event === 'SIGNED_IN' && session) {
  await syncUserProfile(session.user);
}
```
**Time:** ~5 minutes  
**Reliability:** Unknown (might work, might cause other issues)  
**Risk:** Medium

### Option 3: Deep Dive Debugging
Add extensive logging in DataContext to see exact timing:
```typescript
console.log('[T+0] signInWithIdToken called');
console.log('[T+100] Auth listener fired');
console.log('[T+101] syncUserProfile started');
console.log('[T+102] user_metadata:', user.user_metadata);
```
**Time:** ~2 hours  
**Reliability:** Might reveal the issue, might not  
**Risk:** High time investment, uncertain outcome

---

## Conclusion

After 5 builds (10→14) and multiple days of debugging, the Apple Sign In name issue remains unresolved. The root cause is a race condition between auth state changes and profile synchronization. 

**The most pragmatic solution is Option 1 (Manual Name Input)** - it's guaranteed to work, takes minimal time, and is standard practice in professional apps.

---

**Last Updated:** Feb 9, 2026  
**Builds Affected:** 10, 11, 12, 13, 14  
**Status:** ❌ UNRESOLVED
