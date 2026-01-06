/**
 * Supabase Client Configuration
 * Handles authentication and user management
 * Financial data (assets/liabilities) stays in AsyncStorage (local-only)
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
// TODO: Add these to your .env file or app.json extra config
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Custom storage adapter for Supabase session
 * Uses AsyncStorage instead of SecureStore to avoid 2048-byte size limit on iOS
 * 
 * IMPORTANT: SecureStore has a 2048-byte limit on iOS, but Supabase session tokens
 * are typically 3000-4000 bytes. This causes "Value being stored in SecureStore is 
 * larger than 2048 bytes" warnings and incomplete writes, leading to auth race conditions.
 * 
 * AsyncStorage has no size limit and is perfectly fine for session tokens since:
 * 1. Tokens are already encrypted by Supabase (JWT)
 * 2. Tokens are short-lived (1 hour) and auto-refresh
 * 3. We still use SecureStore for truly sensitive data (PIN hashes)
 */
const AsyncStorageAdapter = {
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  },
};

/**
 * Supabase client instance
 * Used for authentication only - financial data stays local
 * 
 * IMPORTANT: Client can be reinitialized to clear corrupted state
 * Use getSupabaseClient() to access current client
 * Use reinitializeSupabaseClient() to create fresh client after sign-out
 */
let supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for mobile OAuth
  },
});

/**
 * Get current Supabase client instance
 * Always use this instead of importing 'supabase' directly
 */
export function getSupabaseClient() {
  return supabaseClient;
}

/**
 * Callback to notify when client is reinitialized
 * Used by DataContext to re-register auth listeners
 */
let onClientReinitializedCallback: (() => void) | null = null;

export function setOnClientReinitialized(callback: (() => void) | null) {
  onClientReinitializedCallback = callback;
}

/**
 * Reinitialize Supabase client with fresh state
 * Call this after sign-out to eliminate accumulated corruption
 * 
 * Why this is necessary:
 * - signOut() clears session from AsyncStorage
 * - But client's in-memory state (refresh timers, listeners, cache) persists
 * - After 2-3 cycles, accumulated state causes corruption
 * - Fresh client = truly clean slate
 * 
 * IMPORTANT: After reinitialization, auth listeners must be re-registered
 * This is handled automatically via the onClientReinitialized callback
 * 
 * @returns New Supabase client instance
 */
export function reinitializeSupabaseClient() {
  console.log('🔄 Reinitializing Supabase client (clearing corrupted state)...');
  
  // Create entirely new client instance
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  
  console.log('✅ Supabase client reinitialized - fresh state ready');
  
  // Notify listeners that client was reinitialized
  if (onClientReinitializedCallback) {
    console.log('📡 Notifying DataContext to re-register auth listener...');
    onClientReinitializedCallback();
  }
  
  return supabaseClient;
}

/**
 * Export for backward compatibility
 * Existing code can still use 'supabase' import
 */
export const supabase = getSupabaseClient();

/**
 * Database types (auto-generated from Supabase schema)
 */
export interface SupabaseUser {
  id: string;
  email: string;
  name: string | null;
  photo_url: string | null;
  primary_currency: 'GBP' | 'USD' | 'EUR';
  created_at: string;
  last_login_at: string;
}

export interface SupabaseBackup {
  id: string;
  user_id: string;
  encrypted_data: string;
  updated_at: string;
}
