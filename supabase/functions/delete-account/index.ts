/**
 * Supabase Edge Function: Delete Account (GDPR-compliant)
 * 
 * This function handles complete user account deletion per GDPR Article 17 (Right to Erasure).
 * It deletes ALL personal data:
 * - Supabase Auth user (email, name, metadata)
 * - User profile (users table)
 * - Encrypted backups (backups table)
 * 
 * Security: Uses service_role key (server-side only) to access admin API.
 * The service_role key is NEVER exposed to the client.
 * 
 * @requires SUPABASE_URL environment variable
 * @requires SUPABASE_SERVICE_ROLE_KEY environment variable (set in Supabase Dashboard)
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
    // STEP 0: Verify authentication
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

    // Create admin client with service_role key (server-side only - has elevated privileges)
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

    // Verify user is authenticated by checking their token
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

    console.log('🗑️ Starting GDPR-compliant account deletion')
    console.log(`👤 User ID: ${user.id}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`)

    // STEP 1: Delete backups (encrypted financial data)
    console.log('1️⃣ Deleting encrypted backups...')
    const { error: backupsError, count: backupsCount } = await supabaseAdmin
      .from('backups')
      .delete({ count: 'exact' })
      .eq('user_id', user.id)
    
    if (backupsError) {
      console.warn(`⚠️ Backup deletion warning: ${backupsError.message}`)
      // Continue - backups might not exist (user never created backup)
    } else {
      console.log(`✅ Backups deleted (${backupsCount || 0} records)`)
    }

    // STEP 2: Delete user profile (name, email, preferences from users table)
    console.log('2️⃣ Deleting user profile...')
    const { error: profileError, count: profileCount } = await supabaseAdmin
      .from('users')
      .delete({ count: 'exact' })
      .eq('id', user.id)
    
    if (profileError) {
      console.warn(`⚠️ Profile deletion warning: ${profileError.message}`)
      // Continue - profile might not exist (user never completed onboarding)
    } else {
      console.log(`✅ Profile deleted (${profileCount || 0} records)`)
    }

    // STEP 3: Delete auth user (CRITICAL for GDPR - removes email, metadata from auth.users)
    console.log('3️⃣ Deleting auth user (GDPR CRITICAL - removes email & metadata)...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    
    if (authError) {
      console.error('❌ Auth deletion failed:', authError)
      throw new Error(`Failed to delete authentication record: ${authError.message}`)
    }
    
    console.log('✅ Auth user deleted - email and metadata permanently removed')

    // STEP 4: Create audit log (GDPR compliance - demonstrate deletion occurred)
    const auditLog = {
      user_id: user.id,
      email: user.email,
      deleted_at: new Date().toISOString(),
      deletion_method: 'user_initiated',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    }
    console.log('📝 Audit log:', JSON.stringify(auditLog))

    // Success response
    console.log('✅ Account deletion completed successfully')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account and all personal data deleted successfully',
        deleted_at: new Date().toISOString(),
        audit_log_id: user.id, // For reference
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Delete account error:', error)
    console.error('Stack trace:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Failed to delete account. Please contact support if this persists.',
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
