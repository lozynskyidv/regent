/**
 * Global Data Context
 * Manages assets, liabilities, and user data in memory
 * Persists to AsyncStorage on every change
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Asset, Liability, User, Currency } from '../types';
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
  
  // Auth
  supabaseUser: SupabaseAuthUser | null;
  isAuthenticated: boolean;
  isAuthProcessing: boolean; // Global lock to prevent concurrent auth operations
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState<SupabaseAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false); // Global auth lock

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
        console.log('🔐 Auth session:', session ? 'Active' : 'None');
      });

      // Listen for auth changes
      // SINGLE auth listener - eliminates dual-listener race condition
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔐 Auth event:', event);
          setSupabaseUser(session?.user ?? null);
          setIsAuthenticated(!!session);
          
          if (event === 'SIGNED_IN' && session) {
            console.log('✅ OAuth success - syncing profile');
            // Sync user profile to Supabase
            await syncUserProfile(session.user);
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
      
      const [loadedAssets, loadedLiabilities, loadedUser, preferences] = await Promise.all([
        loadAssets(),
        loadLiabilities(),
        loadUser(),
        loadPreferences(),
      ]);
      
      setAssets(loadedAssets);
      setLiabilities(loadedLiabilities);
      setUserState(loadedUser);
      setPrimaryCurrency(preferences.primaryCurrency);
      
      console.log('✅ Data loaded successfully');
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
  // ASSET ACTIONS
  // ============================================

  const addAsset = async (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAsset: Asset = {
        ...assetData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedAssets = [...assets, newAsset];
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
      console.log('✅ Asset added to context:', newAsset.name);
    } catch (err) {
      console.error('❌ Error adding asset:', err);
      throw err;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedAssets = assets.map((asset) => {
        if (asset.id === id) {
          return {
            ...asset,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return asset;
      });
      
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
      console.log('✅ Asset updated in context:', id);
    } catch (err) {
      console.error('❌ Error updating asset:', err);
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const updatedAssets = assets.filter((asset) => asset.id !== id);
      await saveAssets(updatedAssets);
      setAssets(updatedAssets);
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
      const newLiability: Liability = {
        ...liabilityData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedLiabilities = [...liabilities, newLiability];
      await saveLiabilities(updatedLiabilities);
      setLiabilities(updatedLiabilities);
      console.log('✅ Liability added to context:', newLiability.name);
    } catch (err) {
      console.error('❌ Error adding liability:', err);
      throw err;
    }
  };

  const updateLiability = async (id: string, updates: Partial<Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedLiabilities = liabilities.map((liability) => {
        if (liability.id === id) {
          return {
            ...liability,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return liability;
      });
      
      await saveLiabilities(updatedLiabilities);
      setLiabilities(updatedLiabilities);
      console.log('✅ Liability updated in context:', id);
    } catch (err) {
      console.error('❌ Error updating liability:', err);
      throw err;
    }
  };

  const deleteLiability = async (id: string) => {
    try {
      const updatedLiabilities = liabilities.filter((liability) => liability.id !== id);
      await saveLiabilities(updatedLiabilities);
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
  // AUTH ACTIONS
  // ============================================

  /**
   * Sync user profile to Supabase database
   * Called after successful OAuth sign-in
   */
  const syncUserProfile = async (authUser: SupabaseAuthUser) => {
    try {
      const supabase = getSupabaseClient();
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error other than "not found"
        throw fetchError;
      }

      if (!existingUser) {
        // Create new user record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
            photo_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
            primary_currency: 'GBP',
            last_login_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
        console.log('✅ User profile created in Supabase');
      } else {
        // Update last login
        const { error: updateError } = await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', authUser.id);

        if (updateError) throw updateError;
        console.log('✅ User profile updated in Supabase');
      }
    } catch (err) {
      console.error('❌ Error syncing user profile:', err);
      // Non-critical error, don't throw
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
      
      // STEP 5: Clear local React state (triggers AuthGuard redirect)
      console.log('🔐 DataContext: Clearing local auth state (will trigger redirect)...');
      setSupabaseUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Signed out successfully - Fresh client ready for next sign-in');
    } catch (err) {
      console.error('❌ Sign out error:', err);
      // Even if there's an error, clear local state to unblock UI
      setSupabaseUser(null);
      setIsAuthenticated(false);
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
   * Delete account
   * Removes user from Supabase and wipes ALL local data
   */
  const deleteAccount = async () => {
    try {
      if (!supabaseUser) {
        throw new Error('No user to delete');
      }

      const supabase = getSupabaseClient();

      // Delete backups from Supabase
      await supabase
        .from('backups')
        .delete()
        .eq('user_id', supabaseUser.id);

      // Delete user from Supabase
      await supabase
        .from('users')
        .delete()
        .eq('id', supabaseUser.id);

      // Clear all local data
      await clearAllData();
      await SecureStore.deleteItemAsync('regent_pin_hash');

      // Sign out
      await supabase.auth.signOut();

      // Clear state
      setAssets([]);
      setLiabilities([]);
      setUserState(null);
      setSupabaseUser(null);
      setIsAuthenticated(false);

      console.log('✅ Account deleted successfully');
    } catch (err) {
      console.error('❌ Error deleting account:', err);
      throw err;
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
    
    // Auth
    supabaseUser,
    isAuthenticated,
    isAuthProcessing,
    
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
