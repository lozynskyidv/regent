/**
 * Supabase Edge Function: Mark Invite Code as Used
 * 
 * This function marks an invite code as used when a user completes signup.
 * It also decrements the creator's invites_remaining count.
 * 
 * @param code_id - The UUID of the invite code to mark as used
 * @requires Authorization header with valid JWT
 * @returns { success: boolean, message: string }
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

    // Parse request body
    const { code_id } = await req.json()

    if (!code_id) {
      return new Response(
        JSON.stringify({ error: 'Missing code_id parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create admin client with service_role key (needed to update codes)
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

    console.log(`✅ Marking invite code as used: ${code_id} by user: ${user.id}`)

    // STEP 2: Get the invite code details
    const { data: inviteCode, error: fetchError } = await supabaseAdmin
      .from('invite_codes')
      .select('id, code, created_by_user_id, used_by_user_id')
      .eq('id', code_id)
      .single()

    if (fetchError || !inviteCode) {
      console.error('❌ Invite code not found:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Invite code not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if code is already used
    if (inviteCode.used_by_user_id) {
      console.warn(`⚠️ Code already used: ${inviteCode.code}`)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'This invite code has already been used' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // STEP 3: Mark code as used
    const { error: updateError } = await supabaseAdmin
      .from('invite_codes')
      .update({ 
        used_by_user_id: user.id,
        used_at: new Date().toISOString()
      })
      .eq('id', code_id)

    if (updateError) {
      console.error('❌ Error marking code as used:', updateError)
      throw new Error(`Failed to mark code as used: ${updateError.message}`)
    }

    console.log(`✅ Code marked as used: ${inviteCode.code}`)

    // STEP 4: Decrement creator's invites_remaining (if they have a user record)
    if (inviteCode.created_by_user_id) {
      const { error: decrementError } = await supabaseAdmin
        .from('users')
        .update({ 
          invites_remaining: supabaseAdmin.rpc('decrement_invites', { user_id: inviteCode.created_by_user_id })
        })
        .eq('id', inviteCode.created_by_user_id)

      if (decrementError) {
        console.warn(`⚠️ Could not decrement invites_remaining: ${decrementError.message}`)
        // Don't fail - users table might not exist or function might not be defined
      } else {
        console.log(`✅ Decremented invites_remaining for creator: ${inviteCode.created_by_user_id}`)
      }
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Invite code marked as used successfully',
        code: inviteCode.code
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Mark invite used error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        details: 'Failed to mark invite code as used. Please try again.',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
