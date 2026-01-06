/**
 * Supabase Client Configuration
 * Handles authentication and user management
 * Financial data (assets/liabilities) stays in AsyncStorage (local-only)
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supabase configuration
// TODO: Add these to your .env file or app.json extra config
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Custom storage adapter for Supabase session
 * Uses SecureStore (iOS Keychain) instead of AsyncStorage for better security
 */
const SecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

/**
 * Supabase client instance
 * Used for authentication only - financial data stays local
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SecureStoreAdapter,
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
