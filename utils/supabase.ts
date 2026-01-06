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
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for mobile OAuth
  },
});

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
