# Regent Invite System Implementation Guide

## Overview

Regent has pivoted from a **£149/year subscription model with RevenueCat** to an **invite-only private beta** model. This document explains the rationale, current implementation, and recommended backend approaches.

---

## Why We Changed

### Previous Model: Paid Subscription
- Required FCA regulation compliance (expensive, time-consuming)
- RevenueCat paywall on app launch
- High barrier to user acquisition
- Premium positioning through price

### New Model: Invite-Only Beta
- **Avoids FCA regulatory costs** during MVP phase
- **Maintains premium positioning** through exclusivity (not price)
- **Built-in viral growth**: Each user gets 5 invites to share
- **No ad spend required**: Organic growth through invite mechanics
- **Perfect for CV/portfolio**: Shows product thinking + regulatory awareness

---

## Current Frontend Implementation

### Flow Architecture

```
Landing Page
    ↓
Invite Code Screen ← User enters code (e.g., "RGNT1234")
    ↓ (validates code)
Google Sign-Up Screen
    ↓
Face ID Setup
    ↓
Home Screen
    ↓
Share Invite Card (when invites > 0)
    - Shows remaining invites (5/5, 4/5, etc.)
    - "Share Invite" button
    - "Remind me later" option
    - Card disappears when 0 invites remain
```

### Key Files

- `/components/InviteCodeScreen.tsx` - Invite code entry (first screen after landing)
- `/components/HomeScreen.tsx` - Main dashboard with net worth cards
- `/components/ShareInviteCard.tsx` - Invite sharing UI component
- `/components/WaitlistModal.tsx` - Email capture for users without codes
- `/App.tsx` - Screen routing and mock validation logic

### Current Validation Logic (Mock)

```typescript
// App.tsx - Line 26-27
// Mock validation - accept any code starting with "RGNT"
if (code.startsWith('RGNT')) {
  localStorage.setItem('regent_invite_validated', 'true');
  setCurrentScreen('signup');
} else {
  setInviteError('Invalid invite code. Please check and try again.');
}
```

**Valid codes:** `RGNT1234`, `RGNT5678`, `RGNTTEST` (any string starting with "RGNT")

---

## Backend Implementation Options

All approaches assume **Supabase + React Native Expo** stack.

---

### Option 1: Simple UUID-Based Codes (Recommended for MVP)

**Best for:** Quick launch, minimal complexity, good tracking

#### Database Schema

```sql
-- Invite codes table
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by_user_id UUID REFERENCES auth.users(id),
  used_by_user_id UUID REFERENCES auth.users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Users table extension
ALTER TABLE auth.users ADD COLUMN invites_remaining INTEGER DEFAULT 5;

-- Index for fast lookups
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_used_by ON invite_codes(used_by_user_id);
```

#### Flow

1. **Seed initial codes**: Admin manually generates first batch (e.g., `RGNT0001`, `RGNT0002`)
2. **User enters code**: App calls Supabase function to validate
3. **Code validation**: 
   - Check if code exists
   - Check if `is_active = true`
   - Check if `used_by_user_id IS NULL`
4. **On signup**: Mark code as used, decrease creator's `invites_remaining`
5. **Generate new codes**: When user shares, create new codes in DB

#### Supabase Edge Function (Validation)

```typescript
// supabase/functions/validate-invite/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const { code } = await req.json()
  const supabase = createClient(...)

  const { data, error } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .is('used_by_user_id', null)
    .single()

  if (error || !data) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 })
  }

  return new Response(JSON.stringify({ valid: true, code_id: data.id }), { status: 200 })
})
```

#### React Native Implementation

```typescript
// services/inviteService.ts
import { supabase } from './supabase'

export async function validateInviteCode(code: string) {
  const { data, error } = await supabase.functions.invoke('validate-invite', {
    body: { code }
  })
  return { valid: data?.valid, codeId: data?.code_id }
}

export async function markCodeAsUsed(codeId: string, userId: string) {
  await supabase
    .from('invite_codes')
    .update({ used_by_user_id: userId, used_at: new Date().toISOString() })
    .eq('id', codeId)
}

export async function generateUserInviteCodes(userId: string, count: number = 5) {
  const codes = []
  for (let i = 0; i < count; i++) {
    const code = `RGNT${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    codes.push({ code, created_by_user_id: userId })
  }
  await supabase.from('invite_codes').insert(codes)
}
```

**Pros:**
- ✅ Simple, battle-tested approach
- ✅ Easy to debug and audit
- ✅ Full tracking of invite chain
- ✅ Can later add analytics (who invited whom, conversion rates)

**Cons:**
- ❌ Codes are guessable (though unlikely with random strings)
- ❌ Requires Edge Function or RLS policies

---

### Option 2: Referral Link System (Best UX)

**Best for:** Seamless sharing experience, modern feel

#### Database Schema

```sql
-- Referral links table
CREATE TABLE referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  link_token TEXT UNIQUE NOT NULL,
  uses_remaining INTEGER DEFAULT 5,
  total_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Referral redemptions table
CREATE TABLE referral_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id UUID REFERENCES referral_links(id),
  referred_user_id UUID REFERENCES auth.users(id),
  redeemed_at TIMESTAMP DEFAULT NOW()
);
```

#### Flow

1. **Generate link on signup**: `regent://invite/abc123xyz` or `regent.app/invite/abc123xyz`
2. **User shares link**: Native share sheet (Expo Sharing API)
3. **New user clicks link**: Deep link opens app with token
4. **Validate token**: Check if link exists and has uses remaining
5. **Complete signup**: Decrement `uses_remaining`, log redemption

#### React Native Implementation

```typescript
// App.tsx - Handle deep links
import * as Linking from 'expo-linking'
import { useEffect } from 'react'

useEffect(() => {
  // Handle incoming deep links
  const handleDeepLink = (event: { url: string }) => {
    const { path, queryParams } = Linking.parse(event.url)
    if (path === 'invite') {
      const token = queryParams?.token
      validateReferralToken(token)
    }
  }

  Linking.addEventListener('url', handleDeepLink)

  // Check if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url })
  })
}, [])

// Share invite function
import * as Sharing from 'expo-sharing'

async function shareInvite(token: string) {
  const url = `https://regent.app/invite/${token}`
  const message = `Join me on Regent - exclusive net worth tracking for professionals.\n\n${url}`
  
  await Sharing.shareAsync(url, {
    dialogTitle: 'Share Regent Invite',
    mimeType: 'text/plain',
  })
}
```

**Pros:**
- ✅ Best UX - one tap to share
- ✅ Works with iOS/Android native sharing
- ✅ Can track which links are most effective
- ✅ Professional feel (modern apps use links, not codes)

**Cons:**
- ❌ More complex initial setup (deep linking config)
- ❌ Need to handle web→app handoff
- ❌ Requires domain/universal links setup

---

### Option 3: Hybrid (Code + Link)

**Best for:** Maximum flexibility and coverage

Combines both approaches:
- **Primary**: Referral links (best UX)
- **Fallback**: Manual codes (for edge cases where links don't work)

#### Implementation

Same schema as Options 1 + 2, with shared validation logic:

```typescript
export async function validateInvite(input: string) {
  // Try as referral link token first
  const linkResult = await validateReferralToken(input)
  if (linkResult.valid) return linkResult

  // Fallback to code validation
  return await validateInviteCode(input)
}
```

**Pros:**
- ✅ Best of both worlds
- ✅ Works even if deep linking fails
- ✅ Professional (link) + reliable (code)

**Cons:**
- ❌ Most complex implementation
- ❌ Two systems to maintain

---

## Recommendation

### For MVP Launch: **Option 1 (UUID-Based Codes)**

**Reasoning:**
1. ✅ **Ship fast**: Simplest backend, no deep linking config
2. ✅ **Reliable**: No dependency on universal links setup
3. ✅ **Debuggable**: Easy to manually check codes in Supabase dashboard
4. ✅ **Proven**: Used by Clubhouse, ProductHunt early days

**Migration path:** Can always add referral links later (Option 3) without breaking existing codes.

---

## Implementation Checklist

### Phase 1: MVP Backend (Option 1)
- [ ] Create Supabase tables (`invite_codes`, extend `auth.users`)
- [ ] Seed initial admin codes (`RGNT0001`–`RGNT0100`)
- [ ] Create Edge Function for validation
- [ ] Create Edge Function for code generation
- [ ] Set up Row Level Security (RLS) policies
- [ ] Replace `App.tsx` mock validation with Supabase calls
- [ ] Test full flow: code entry → signup → home screen → share

### Phase 2: Analytics & Admin
- [ ] Admin dashboard to view invite chain
- [ ] Track conversion rates (code shared → code used)
- [ ] Monitor abuse (same user generating multiple accounts)
- [ ] Email notifications when someone uses your invite

### Phase 3: Enhanced UX (Optional)
- [ ] Upgrade to Option 3 (add referral links)
- [ ] Add copy-to-clipboard for codes
- [ ] Show invite history on profile screen
- [ ] Gamification (badges for referring 10+ users)

---

## Security Considerations

1. **Rate limiting**: Prevent brute-force code guessing
2. **One code per user**: Prevent multi-account abuse
3. **Email verification**: Require verified email before granting invites
4. **Fraud detection**: Flag suspicious patterns (e.g., 10 signups from same IP)
5. **Code expiration**: Optional - make codes expire after 30 days

---

## Testing Strategy

### Unit Tests
- Code validation logic
- Invite count decrementing
- Edge cases (invalid codes, expired codes, used codes)

### Integration Tests
- Full signup flow with valid code
- Error handling for invalid codes
- Invite generation after signup

### Manual QA Checklist
- [ ] Enter valid code → proceeds to signup
- [ ] Enter invalid code → shows error message
- [ ] Complete signup → invites_remaining = 5
- [ ] Share invite → new code generated
- [ ] Share 5 invites → card disappears
- [ ] "Remind me later" → card hidden until next session
- [ ] Waitlist modal → email captured

---

## Questions?

For implementation help, see:
- [Supabase Edge Functions docs](https://supabase.com/docs/guides/functions)
- [Expo Linking docs](https://docs.expo.dev/guides/linking/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

**Current Status:** Frontend complete (mock validation), ready for backend integration.
