/**
 * Global Data Context
 * Manages assets, liabilities, and user data in memory
 * Persists to AsyncStorage on every change
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset, Liability, User, Currency, NetWorthSnapshot } from '../types';
import {
  loadAssets,
  saveAssets,
  loadLiabilities,
  saveLiabilities,
  loadUser,
  saveUser,
  loadPreferences,
  savePreferences,
  Preferences,
  clearAllData,
  loadSubscription,
  saveSubscription,
  SubscriptionState as StorageSubscriptionState,
  loadLastDataSync,
  saveLastDataSync,
  loadSnapshots,
  saveSnapshots,
} from '../utils/storage';
import { generateId } from '../utils/generateId';
import { getSupabaseClient, reinitializeSupabaseClient, setOnClientReinitialized } from '../utils/supabase';
import { deriveKeyFromPIN, encryptData, decryptData } from '../utils/encryption';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// ============================================
// TYPES
// ============================================

interface DataContextType {
  // Data
  assets: Asset[];
  liabilities: Liability[];
  user: User | null;
  primaryCurrency: Currency;
  lastDataSync: Date | null;
  snapshots: NetWorthSnapshot[];
  
  // Auth
  supabaseUser: SupabaseAuthUser | null;
  isAuthenticated: boolean;
  isAuthProcessing: boolean; // Global lock to prevent concurrent auth operations
  
  // Subscription
  hasStartedTrial: boolean;
  
  // Computed
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  
  // Actions - Assets
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  // Actions - Liabilities
  addLiability: (liability: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLiability: (id: string, updates: Partial<Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  
  // Actions - User
  setUser: (user: User) => Promise<void>;
  
  // Actions - Preferences
  setCurrency: (currency: Currency) => Promise<void>;
  
  // Actions - Subscription
  startTrial: () => Promise<void>;
  
  // Actions - Timestamp
  updateLastDataSync: () => Promise<void>;
  
  // Actions - Auth & Backup
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  backupData: (pin: string) => Promise<void>;
  restoreData: (pin: string) => Promise<void>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

// ============================================
// CONTEXT
// ============================================

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function DataProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>('GBP');
  const [lastDataSync, setLastDataSync] = useState<Date | null>(null);
  const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState<SupabaseAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false); // Global auth lock
  const [accessToken, setAccessToken] = useState<string | null>(null); // Store access token for reliable deletion
  
  // Subscription state
  const [hasStartedTrial, setHasStartedTrial] = useState(false);

  // Check Supabase auth session on mount and register auth listener
  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    // Function to register auth listener
    const registerAuthListener = () => {
      const supabase = getSupabaseClient();
      
      console.log('📡 Registering auth listener...');
      
      // Unsubscribe from old listener if it exists
      if (authListener) {
        console.log('🔌 Unsubscribing from old auth listener...');
        authListener.subscription.unsubscribe();
      }
      
      // Get current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSupabaseUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        setAccessToken(session?.access_token ?? null); // Store token
        console.log('🔐 Auth session:', session ? 'Active' : 'None');
      });

      // Listen for auth changes
      // SINGLE auth listener - eliminates dual-listener race condition
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔐 Auth event:', event);
          setSupabaseUser(session?.user ?? null);
          setIsAuthenticated(!!session);
          setAccessToken(session?.access_token ?? null); // Store token on every auth change
          
          if (event === 'SIGNED_IN' && session) {
            console.log('✅ OAuth success - syncing profile');
            console.log('🔑 Access token stored (length:', session.access_token?.length, ')');
            
            // CRITICAL FIX: Don't await profile sync - let it run in background
            // This prevents auth flow from being blocked if profile sync hangs
            syncUserProfile(session.user).catch(err => {
              console.error('❌ Background profile sync failed:', err?.message || err);
              // Error is logged but doesn't block auth flow
            });
            
            // Navigation handled by AuthGuard (prevents duplicate navigation race condition)
          }
        }
      );
      
      authListener = listener;
      console.log('✅ Auth listener registered');
    };
    
    // Register listener on mount
    registerAuthListener();
    
    // Set callback for client reinitialization
    // This ensures listener is re-registered after sign-out
    setOnClientReinitialized(() => {
      console.log('🔄 Client reinitialized - re-registering auth listener...');
      registerAuthListener();
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
      setOnClientReinitialized(null);
    };
  }, []);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      console.log('📦 Loading data from AsyncStorage...');
      
      const [loadedAssets, loadedLiabilities, loadedUser, preferences, subscription, lastSync, loadedSnapshots] = await Promise.all([
        loadAssets(),
        loadLiabilities(),
        loadUser(),
        loadPreferences(),
        loadSubscription(),
        loadLastDataSync(),
        loadSnapshots(),
      ]);
      
      setAssets(loadedAssets);
      setLiabilities(loadedLiabilities);
      setUserState(loadedUser);
      setPrimaryCurrency(preferences.primaryCurrency);
      setHasStartedTrial(subscription.hasStartedTrial);
      setLastDataSync(lastSync);
      setSnapshots(loadedSnapshots);
      
      // Update timestamp on app open (if we have data)
      if (loadedAssets.length > 0 || loadedLiabilities.length > 0) {
        const now = new Date();
        setLastDataSync(now);
        await saveLastDataSync(now);
        console.log('✅ Data sync timestamp updated on app open');
      }
      
      console.log('✅ Data loaded successfully');
      console.log('📊 Subscription state:', subscription);
      console.log('📈 Snapshots loaded:', loadedSnapshots.length);
      console.log('🕐 Last data sync:', lastSync?.toISOString() || 'Never');
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  // ============================================
  // DAILY SNAPSHOT CREATION (Performance Chart)
  // ============================================

  useEffect(() => {
    const createDailySnapshot = async () => {
      // Only create snapshots if we have data
      if (assets.length === 0 && liabilities.length === 0) {
        return;
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

      // Check if we already have a snapshot for today
      const hasToday = snapshots.some(s => 
        s.timestamp.startsWith(today)
      );

      if (!hasToday) {
        const newSnapshot: NetWorthSnapshot = {
          id: generateId(),
          netWorth,
          totalAssets,
          totalLiabilities,
          timestamp: now.toISOString(),
        };

        const updatedSnapshots = [...snapshots, newSnapshot];
        await saveSnapshots(updatedSnapshots);
        setSnapshots(updatedSnapshots);
        console.log('📸 Daily snapshot created:', {
          netWorth: newSnapshot.netWorth,
          date: today
        });
      }
    };

    createDailySnapshot();
  }, [assets, liabilities]); // Run when data changes

  // ============================================
  // ASSET ACTIONS
  // ============================================

  const addAsset = async (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      const newAsset: Asset = {
        ...assetData,
        id: generateId(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      
      const updatedAssets = [...assets, newAsset];
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      
      console.log('✅ Asset added to context:', newAsset.name);
    } catch (err) {
      console.error('❌ Error adding asset:', err);
      throw err;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const now = new Date();
      const updatedAssets = assets.map((asset) => {
        if (asset.id === id) {
          return {
            ...asset,
            ...updates,
            updatedAt: now.toISOString(),
          };
        }
        return asset;
      });
      
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      
      console.log('✅ Asset updated in context:', id);
    } catch (err) {
      console.error('❌ Error updating asset:', err);
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const now = new Date();
      const updatedAssets = assets.filter((asset) => asset.id !== id);
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      
      console.log('✅ Asset deleted from context:', id);
    } catch (err) {
      console.error('❌ Error deleting asset:', err);
      throw err;
    }
  };

  // ============================================
  // LIABILITY ACTIONS
  // ============================================

  const addLiability = async (liabilityData: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      const newLiability: Liability = {
        ...liabilityData,
        id: generateId(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      
      const updatedLiabilities = [...liabilities, newLiability];
      await saveLiabilities(updatedLiabilities);
      setLiabilities(updatedLiabilities);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      
      console.log('✅ Liability added to context:', newLiability.name);
    } catch (err) {
      console.error('❌ Error adding liability:', err);
      throw err;
    }
  };

  const updateLiability = async (id: string, updates: Partial<Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const now = new Date();
      const updatedLiabilities = liabilities.map((liability) => {
        if (liability.id === id) {
          return {
            ...liability,
            ...updates,
            updatedAt: now.toISOString(),
          };
        }
        return liability;
      });
      
      await saveLiabilities(updatedLiabilities);
      setLiabilities(updatedLiabilities);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      
      console.log('✅ Liability updated in context:', id);
    } catch (err) {
      console.error('❌ Error updating liability:', err);
      throw err;
    }
  };

  const deleteLiability = async (id: string) => {
    try {
      const now = new Date();
      const updatedLiabilities = liabilities.filter((liability) => liability.id !== id);
      await saveLiabilities(updatedLiabilities);
      
      // Update last data sync timestamp
      setLastDataSync(now);
      await saveLastDataSync(now);
      setLiabilities(updatedLiabilities);
      console.log('✅ Liability deleted from context:', id);
    } catch (err) {
      console.error('❌ Error deleting liability:', err);
      throw err;
    }
  };

  // ============================================
  // USER ACTIONS
  // ============================================

  const setUser = async (newUser: User) => {
    try {
      await saveUser(newUser);
      setUserState(newUser);
      console.log('✅ User saved to context:', newUser.email);
    } catch (err) {
      console.error('❌ Error saving user:', err);
      throw err;
    }
  };

  // ============================================
  // PREFERENCES ACTIONS
  // ============================================

  const setCurrency = async (currency: Currency) => {
    try {
      const preferences: Preferences = { primaryCurrency: currency };
      await savePreferences(preferences);
      setPrimaryCurrency(currency);
      console.log('✅ Currency updated:', currency);
    } catch (err) {
      console.error('❌ Error updating currency:', err);
      throw err;
    }
  };

  // ============================================
  // SUBSCRIPTION ACTIONS
  // ============================================

  /**
   * Start trial
   * Called when user taps "Start 14-Day Free Trial" on paywall
   * Sets hasStartedTrial = true to unlock app access
   */
  const startTrial = async () => {
    try {
      const subscription: StorageSubscriptionState = {
        hasStartedTrial: true,
        trialStartDate: new Date().toISOString(),
      };
      
      await saveSubscription(subscription);
      setHasStartedTrial(true);
      
      console.log('✅ Trial started successfully');
    } catch (err) {
      console.error('❌ Error starting trial:', err);
      throw err;
    }
  };

  // ============================================
  // TIMESTAMP ACTIONS
  // ============================================

  /**
   * Update last data sync timestamp
   * Called manually (e.g., after pull-to-refresh)
   */
  const updateLastDataSync = async () => {
    try {
      const now = new Date();
      setLastDataSync(now);
      await saveLastDataSync(now);
      console.log('✅ Last data sync updated');
    } catch (err) {
      console.error('❌ Error updating last data sync:', err);
      throw err;
    }
  };

  // ============================================
  // AUTH ACTIONS
  // ============================================

  /**
   * Sync user profile to Supabase database
   * Called after successful OAuth sign-in
   */
  const syncUserProfile = async (authUser: SupabaseAuthUser) => {
    try {
      console.log('🔄 Syncing user profile to database...');
      const supabase = getSupabaseClient();
      
      // Add 5-second timeout to prevent infinite hanging
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('User profile fetch timeout after 5 seconds')), 5000)
      );
      
      const { data: existingUser, error: fetchError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error other than "not found"
        throw fetchError;
      }

      if (!existingUser) {
        console.log('📝 Creating new user profile in database...');
        
        // Create new user record with timeout
        const insertPromise = supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
            photo_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
            primary_currency: 'GBP',
            last_login_at: new Date().toISOString(),
            invites_remaining: 5, // New users get 5 invites
          });
        
        const insertTimeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('User profile insert timeout after 5 seconds')), 5000)
        );
        
        const { error: insertError } = await Promise.race([
          insertPromise,
          insertTimeoutPromise
        ]) as any;

        if (insertError) throw insertError;
        console.log('✅ User profile created in Supabase');
        
        // STEP 2: Mark invite code as used (if user signed up with a code)
        try {
          const inviteCodeId = await AsyncStorage.getItem('@regent_invite_code_id');
          if (inviteCodeId) {
            console.log('🎟️ Marking invite code as used:', inviteCodeId);
            const { error: markError } = await supabase.functions.invoke('mark-invite-used', {
              body: { code_id: inviteCodeId }
            });
            
            if (markError) {
              console.warn('⚠️ Could not mark invite code as used:', markError);
            } else {
              console.log('✅ Invite code marked as used');
              // Keep invite code in storage to maintain hasValidatedInvite state
              // Only remove the code_id since it's been used
              await AsyncStorage.removeItem('@regent_invite_code_id');
            }
          }
        } catch (err) {
          console.warn('⚠️ Error marking invite code as used:', err);
          // Non-critical - don't block signup
        }
        
        // STEP 3: Generate 5 invite codes for new user
        try {
          console.log('🎟️ Generating invite codes for new user...');
          const { data: codesData, error: codesError } = await supabase.functions.invoke('generate-invite-codes');
          
          if (codesError) {
            console.warn('⚠️ Could not generate invite codes:', codesError);
          } else {
            console.log('✅ Generated invite codes:', codesData?.codes);
          }
        } catch (err) {
          console.warn('⚠️ Error generating invite codes:', err);
          // Non-critical - don't block signup
        }
      } else {
        console.log('🔄 Updating existing user profile...');
        
        // Update last login with timeout
        const updatePromise = supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', authUser.id);
        
        const updateTimeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('User profile update timeout after 5 seconds')), 5000)
        );
        
        const { error: updateError } = await Promise.race([
          updatePromise,
          updateTimeoutPromise
        ]) as any;

        if (updateError) throw updateError;
        console.log('✅ User profile updated in Supabase');
      }
    } catch (err: any) {
      console.error('❌ Error syncing user profile:', err?.message || err);
      // CRITICAL: Non-critical error, don't throw
      // User can still use the app even if profile sync fails
      // This prevents auth flow from being blocked
    }
  };

  /**
   * Sign out user
   * Clears Supabase session but keeps PIN and financial data
   * User will need to re-enter PIN on next app launch
   * 
   * CRITICAL FIX v5: Reinitialize Supabase Client
   * - signOut() clears session from AsyncStorage
   * - Nuclear cleanup removes ALL Supabase keys
   * - Reinitialize client to eliminate in-memory corruption
   * - This provides truly clean slate for next sign-in
   */
  const signOut = async () => {
    console.log('🔐 DataContext: Starting sign out...');
    
    // Set auth processing lock to block other auth operations
    setIsAuthProcessing(true);
    
    // CRITICAL: Clear auth state IMMEDIATELY to prevent AuthGuard flash
    console.log('🔄 Clearing auth state immediately...');
    setSupabaseUser(null);
    setIsAuthenticated(false);
    setAccessToken(null);
    console.log('✅ Auth state cleared - user now appears unauthenticated');
    
    try {
      const supabase = getSupabaseClient();
      
      // STEP 1: Call Supabase signOut and wait for completion
      console.log('🔐 DataContext: Calling Supabase signOut...');
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(resolve, 3000) // 3s timeout
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('✅ Supabase signOut completed');
      
      // STEP 2: Nuclear AsyncStorage cleanup - remove ALL Supabase keys
      // This prevents accumulation that causes getSession() to slow down over cycles
      console.log('🧹 Nuclear cleanup: Removing ALL Supabase keys from AsyncStorage...');
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('📋 All AsyncStorage keys before cleanup:', allKeys);
        
        const supabaseKeys = allKeys.filter(key => 
          key.startsWith('sb-') || 
          key.includes('auth-token') ||
          key.includes('supabase.auth')
        );
        
        if (supabaseKeys.length > 0) {
          console.log(`🗑️ Removing ${supabaseKeys.length} Supabase keys from AsyncStorage:`, supabaseKeys);
          await AsyncStorage.multiRemove(supabaseKeys);
          console.log('✅ AsyncStorage cleaned');
        } else {
          console.log('✅ AsyncStorage already clean');
        }
        
        // Verify PIN is still in SecureStore (should NOT be affected by AsyncStorage cleanup)
        const pinHash = await SecureStore.getItemAsync('regent_pin_hash');
        console.log('🔑 PIN hash in SecureStore after cleanup:', pinHash ? 'EXISTS ✅' : 'MISSING ❌');
      } catch (cleanupError) {
        console.warn('⚠️ AsyncStorage cleanup failed (non-critical):', cleanupError);
      }
      
      // STEP 3: REINITIALIZE SUPABASE CLIENT (NEW!)
      // This eliminates in-memory corruption (refresh timers, listeners, cache)
      // Provides truly clean slate - addresses root cause of auth race condition
      console.log('🔄 Reinitializing Supabase client to clear in-memory state...');
      reinitializeSupabaseClient();
      console.log('✅ Supabase client reinitialized - all corruption cleared');
      
      // STEP 4: Mandatory cooldown to let AsyncStorage settle
      console.log('⏳ Auth cooldown: Waiting 1000ms for AsyncStorage to settle...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Signed out successfully - Fresh client ready for next sign-in');
    } catch (err) {
      console.error('❌ Sign out error:', err);
      // Auth state already cleared at the start, just throw the error
      throw err;
    } finally {
      // Always release the lock, even if there's an error
      setIsAuthProcessing(false);
      console.log('🔓 Auth lock released');
    }
    
    // NOTE: We do NOT delete the PIN here
    // PIN is tied to the device, not the Supabase session
    // User will use the same PIN when they sign back in
  };

  /**
   * Delete account (GDPR-compliant)
   * Calls Supabase Edge Function to delete ALL user data:
   * - Supabase Auth user (email, name, metadata) - GDPR Article 17
   * - User profile (users table)
   * - Encrypted backups (backups table)
   * - Local data (AsyncStorage + SecureStore)
   * 
   * This is a complete, irreversible deletion per GDPR requirements.
   */
  const deleteAccount = async () => {
    const startTime = Date.now();
    const log = (msg: string) => console.log(`[${Date.now() - startTime}ms] ${msg}`);
    
    setIsAuthProcessing(true);
    
    try {
      log('🗑️ DELETE ACCOUNT: Started');
      
      if (!supabaseUser) {
        throw new Error('No user to delete');
      }

      log(`👤 User: ${supabaseUser.email}`);
      log(`🆔 User ID: ${supabaseUser.id}`);

      // Use stored access token (no getSession call needed!)
      log('🔑 Using stored access token...');
      if (!accessToken) {
        log('❌ No access token in state');
        throw new Error('No active session. Please sign in again.');
      }
      log(`✅ Token ready (length: ${accessToken.length})`);
      
      log('🗑️ Initiating GDPR-compliant account deletion...');
      
      const supabase = getSupabaseClient();

      // Call Edge Function (handles all cloud deletion with admin privileges)
      const functionUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`;
      log(`🌐 Calling Edge Function: ${functionUrl}`);

      // Create AbortController for timeout (prevents infinite hanging)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        log('⏱️ Request timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout

      try {
        log('📡 Sending DELETE request to Edge Function...');
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal, // Enable timeout cancellation
        });

        clearTimeout(timeoutId);
        log(`📥 Response received: status=${response.status} ok=${response.ok}`);

        const result = await response.json();
        log(`📦 Response body: ${JSON.stringify(result)}`);

        if (!response.ok) {
          log(`❌ Edge Function error: ${JSON.stringify(result)}`);
          throw new Error(result.error || 'Failed to delete account from cloud');
        }

        log('✅ Cloud data deleted successfully');
        log(`📝 Deleted at: ${result.deleted_at}`);

      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        log(`❌ Fetch error: ${fetchError.name} - ${fetchError.message}`);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        
        // Re-throw other fetch errors
        throw fetchError;
      }

      // CRITICAL: Clear invite codes FIRST (before changing auth state)
      // This ensures AuthGuard redirects to invite screen, not sign-up
      log('🎟️ Clearing invite codes from AsyncStorage...');
      try {
        await AsyncStorage.multiRemove(['@regent_invite_code', '@regent_invite_code_id']);
        log('✅ Invite codes cleared');
      } catch (err) {
        log('⚠️ Error clearing invite codes:', err);
      }

      // CRITICAL: Clear React state SECOND to trigger AuthGuard re-check
      // This immediately marks user as unauthenticated before async operations
      log('🔄 Clearing React state immediately...');
      setAssets([]);
      setLiabilities([]);
      setUserState(null);
      setSupabaseUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
      setHasStartedTrial(false);
      log('✅ React state cleared - user now appears unauthenticated');

      // CRITICAL: Sign out from Supabase to clear the session
      // This prevents the user from being in a "zombie state" (authenticated but account deleted)
      log('🔓 Signing out from Supabase to clear session...');
      
      // Add timeout to signOut (it can hang too!)
      const signOutPromise = supabase.auth.signOut();
      const signOutTimeout = new Promise((resolve) => 
        setTimeout(() => {
          log('⚠️ signOut timed out after 3 seconds, continuing anyway...');
          resolve(null);
        }, 3000)
      );
      
      await Promise.race([signOutPromise, signOutTimeout]);
      log('✅ Supabase session cleared (or timed out)');

      // Clear all local data (after cloud deletion succeeds)
      log('🧹 Clearing local data...');
      await clearAllData();
      log('✅ AsyncStorage data cleared');
      
      // Delete PIN from SecureStore with verification
      log('🔑 Deleting PIN from SecureStore...');
      try {
        await SecureStore.deleteItemAsync('regent_pin_hash');
        
        // Verify PIN is actually gone
        const pinCheck = await SecureStore.getItemAsync('regent_pin_hash');
        if (pinCheck) {
          log('⚠️ PIN still exists after deletion, retrying...');
          await SecureStore.deleteItemAsync('regent_pin_hash');
          const secondCheck = await SecureStore.getItemAsync('regent_pin_hash');
          if (secondCheck) {
            log('❌ PIN deletion failed after retry');
          } else {
            log('✅ PIN deleted after retry');
          }
        } else {
          log('✅ PIN verified deleted');
        }
      } catch (pinError) {
        log('❌ Error deleting PIN:', pinError);
      }
      
      // Verify trial state is cleared from AsyncStorage
      log('🔍 Verifying trial state cleared...');
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const trialCheck = await AsyncStorage.getItem('regent_subscription');
        if (trialCheck) {
          log('⚠️ Trial state still exists, force deleting...');
          await AsyncStorage.removeItem('regent_subscription');
          log('✅ Trial state force deleted');
        } else {
          log('✅ Trial state verified cleared');
        }
      } catch (trialError) {
        log('❌ Error verifying trial state:', trialError);
      }
      
      log('✅ Local data cleared and verified');

      log('✅ Account deletion completed successfully (GDPR compliant)');
      
      // Show success message
      log('🎉 Showing success alert to user');
      Alert.alert(
        'Account Deleted',
        'Your account and all personal data have been permanently deleted.',
        [{ text: 'OK' }]
      );

      log(`✅ TOTAL TIME: ${Date.now() - startTime}ms`);

    } catch (err: any) {
      log(`❌ ERROR in deleteAccount: ${err?.name || 'Unknown'} - ${err?.message || 'Unknown'}`);
      log(`❌ Error stack: ${err?.stack || 'No stack'}`);
      
      // Provide helpful error message based on error type
      const errorMessage = err?.message?.includes('timeout')
        ? 'The request timed out. Please check your internet connection and try again.'
        : err?.message?.includes('Network') || err?.message?.includes('network')
        ? 'Network error. Please check your internet connection.'
        : err?.message?.includes('session')
        ? 'Your session has expired. Please sign in again.'
        : 'Could not delete your account. Please try again or contact support.';
      
      log(`🚨 Showing error alert: ${errorMessage}`);
      Alert.alert(
        'Deletion Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      throw err;
    } finally {
      // CRITICAL: Always release the lock, even if there's an error
      setIsAuthProcessing(false);
      log('🔓 Auth lock released');
      log(`⏱️ DELETE ACCOUNT: Finished in ${Date.now() - startTime}ms`);
    }
  };

  // ============================================
  // BACKUP/RESTORE ACTIONS
  // ============================================

  /**
   * Backup financial data to Supabase (encrypted)
   * Data is encrypted with PIN-derived key before upload
   */
  const backupData = async (pin: string) => {
    try {
      if (!supabaseUser) {
        throw new Error('Not authenticated');
      }

      const supabase = getSupabaseClient();

      // Prepare backup data
      const backupPayload = {
        assets,
        liabilities,
        preferences: { primaryCurrency },
        version: '1.0',
        timestamp: new Date().toISOString(),
      };

      // Derive encryption key from PIN
      const encryptionKey = await deriveKeyFromPIN(pin, supabaseUser.id);

      // Encrypt data
      const encryptedData = await encryptData(
        JSON.stringify(backupPayload),
        encryptionKey
      );

      // Upload to Supabase
      const { error } = await supabase
        .from('backups')
        .upsert({
          user_id: supabaseUser.id,
          encrypted_data: encryptedData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log('✅ Data backed up successfully');
      Alert.alert('Success', 'Your data has been backed up securely.');
    } catch (err) {
      console.error('❌ Backup error:', err);
      Alert.alert('Error', 'Failed to backup data. Please try again.');
      throw err;
    }
  };

  /**
   * Restore financial data from Supabase backup
   * Data is decrypted with PIN-derived key after download
   */
  const restoreData = async (pin: string) => {
    try {
      if (!supabaseUser) {
        throw new Error('Not authenticated');
      }

      const supabase = getSupabaseClient();

      // Download backup from Supabase
      const { data: backup, error } = await supabase
        .from('backups')
        .select('encrypted_data')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('No backup found for this account');
        }
        throw error;
      }

      if (!backup) {
        throw new Error('No backup found');
      }

      // Derive encryption key from PIN
      const encryptionKey = await deriveKeyFromPIN(pin, supabaseUser.id);

      // Decrypt data
      const decryptedData = await decryptData(
        backup.encrypted_data,
        encryptionKey
      );

      const restored = JSON.parse(decryptedData);

      // Restore to state
      setAssets(restored.assets || []);
      setLiabilities(restored.liabilities || []);
      setPrimaryCurrency(restored.preferences?.primaryCurrency || 'GBP');

      // Save to AsyncStorage
      await saveAssets(restored.assets || []);
      await saveLiabilities(restored.liabilities || []);
      await savePreferences(restored.preferences || { primaryCurrency: 'GBP' });

      console.log('✅ Data restored successfully');
      Alert.alert('Success', 'Your data has been restored successfully.');
    } catch (err) {
      console.error('❌ Restore error:', err);
      if (err instanceof Error) {
        if (err.message.includes('No backup found')) {
          Alert.alert('No Backup', 'No backup found for this account.');
        } else if (err.message.includes('decrypt')) {
          Alert.alert('Wrong PIN', 'Failed to decrypt data. Please check your PIN.');
        } else {
          Alert.alert('Error', 'Failed to restore data. Please try again.');
        }
      }
      throw err;
    }
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: DataContextType = {
    // Data
    assets,
    liabilities,
    user,
    primaryCurrency,
    lastDataSync,
    snapshots,
    
    // Auth
    supabaseUser,
    isAuthenticated,
    isAuthProcessing,
    
    // Subscription
    hasStartedTrial,
    
    // Computed
    netWorth,
    totalAssets,
    totalLiabilities,
    
    // Actions
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    setUser,
    setCurrency,
    startTrial,
    updateLastDataSync,
    signOut,
    deleteAccount,
    backupData,
    restoreData,
    
    // State
    isLoading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
