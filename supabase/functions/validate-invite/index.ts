/**
 * Supabase Edge Function: Validate Invite Code
 * 
 * This function validates invite codes for the invite-only system.
 * It checks if a code exists, is active, and hasn't been used yet.
 * 
 * @param code - The invite code to validate (e.g., "RGNT-A1B2C3")
 * @returns { valid: boolean, code_id?: string, error?: string }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Missing or invalid code parameter' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Normalize code (uppercase, trim whitespace)
    const normalizedCode = code.trim().toUpperCase()

    // Basic format validation (RGNT-XXXXXX)
    const codeRegex = /^RGNT-[A-Z0-9]{6}$/
    if (!codeRegex.test(normalizedCode)) {
      console.log(`❌ Invalid code format: ${normalizedCode}`)
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid code format. Expected format: RGNT-XXXXXX' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client (using anon key - RLS policies handle security)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    console.log(`🔍 Validating invite code: ${normalizedCode}`)

    // Query database for code
    const { data, error } = await supabase
      .from('invite_codes')
      .select('id, code, is_active, used_by_user_id, used_at')
      .eq('code', normalizedCode)
      .single()

    // Code doesn't exist
    if (error || !data) {
      console.log(`❌ Code not found: ${normalizedCode}`)
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid invite code. Please check and try again.' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Code exists but is inactive
    if (!data.is_active) {
      console.log(`❌ Code is inactive: ${normalizedCode}`)
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This invite code has been deactivated.' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Code exists but has already been used
    if (data.used_by_user_id) {
      console.log(`❌ Code already used: ${normalizedCode} (used at: ${data.used_at})`)
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This invite code has already been used.' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Code is valid!
    console.log(`✅ Code is valid: ${normalizedCode} (ID: ${data.id})`)
    return new Response(
      JSON.stringify({ 
        valid: true, 
        code_id: data.id,
        code: normalizedCode
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Validation error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: 'Internal server error. Please try again.',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
