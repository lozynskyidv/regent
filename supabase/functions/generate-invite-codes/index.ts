/**
 * Supabase Edge Function: Generate Invite Codes
 * 
 * This function generates 5 unique invite codes for a user after signup.
 * Codes are random 6-character alphanumeric strings (no confusing chars like 0/O, 1/I).
 * 
 * @requires Authorization header with valid JWT
 * @returns { success: boolean, codes: string[], invites_remaining: number }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Characters to use in codes (excludes confusing chars: 0/O, 1/I, L)
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const CODES_PER_USER = 5

/**
 * Generate a random invite code in format RGNT-XXXXXX
 * Excludes confusing characters (0/O, 1/I/L) for better UX
 */
function generateRandomCode(): string {
  const random = Array.from({ length: CODE_LENGTH }, () => 
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join('')
  return `RGNT-${random}`
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // STEP 1: Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ Missing Authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create admin client with service_role key (needed to insert codes)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      console.error('❌ Authentication failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`🎟️ Generating ${CODES_PER_USER} invite codes for user: ${user.id}`)

    // STEP 2: Check if user already has codes
    const { data: existingCodes, error: checkError } = await supabaseAdmin
      .from('invite_codes')
      .select('code')
      .eq('created_by_user_id', user.id)

    if (checkError) {
      console.error('❌ Error checking existing codes:', checkError)
      throw new Error('Failed to check existing codes')
    }

    if (existingCodes && existingCodes.length > 0) {
      console.log(`⚠️ User already has ${existingCodes.length} codes`)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'User already has invite codes',
          existing_codes: existingCodes.map(c => c.code),
          invites_remaining: CODES_PER_USER - existingCodes.length
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // STEP 3: Generate unique codes
    const generatedCodes: string[] = []
    const maxAttempts = 50 // Prevent infinite loop

    while (generatedCodes.length < CODES_PER_USER) {
      const code = generateRandomCode()
      
      // Check if code already exists in database
      const { data: existing } = await supabaseAdmin
        .from('invite_codes')
        .select('code')
        .eq('code', code)
        .single()

      // If code doesn't exist, add it to our list
      if (!existing && !generatedCodes.includes(code)) {
        generatedCodes.push(code)
      }

      // Safety check to prevent infinite loop
      if (generatedCodes.length === 0 && maxAttempts === 0) {
        throw new Error('Failed to generate unique codes after max attempts')
      }
    }

    console.log(`✅ Generated ${generatedCodes.length} unique codes:`, generatedCodes)

    // STEP 4: Insert codes into database
    const codesToInsert = generatedCodes.map(code => ({
      code,
      created_by_user_id: user.id,
      is_active: true,
      created_at: new Date().toISOString()
    }))

    const { error: insertError } = await supabaseAdmin
      .from('invite_codes')
      .insert(codesToInsert)

    if (insertError) {
      console.error('❌ Error inserting codes:', insertError)
      throw new Error(`Failed to insert codes: ${insertError.message}`)
    }

    console.log(`✅ Successfully inserted ${generatedCodes.length} codes`)

    // STEP 5: Update user's invites_remaining count (if users table exists)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ invites_remaining: CODES_PER_USER })
      .eq('id', user.id)

    if (updateError) {
      console.warn(`⚠️ Could not update invites_remaining: ${updateError.message}`)
      // Don't fail - users table might not exist yet or column might not be added
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        codes: generatedCodes,
        invites_remaining: CODES_PER_USER,
        message: `Generated ${CODES_PER_USER} invite codes successfully`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Generate codes error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        details: 'Failed to generate invite codes. Please try again.',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
