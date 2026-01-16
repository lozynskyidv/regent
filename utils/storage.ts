/**
 * AsyncStorage utilities for local data persistence
 * All data is stored on-device only (no backend)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset, Liability, User } from '../types';

// Storage keys (no @ prefix - not needed for AsyncStorage)
const STORAGE_KEYS = {
  ASSETS: 'regent_assets',
  LIABILITIES: 'regent_liabilities',
  USER: 'regent_user',
  PREFERENCES: 'regent_preferences',
  SUBSCRIPTION: 'regent_subscription',
  LAST_DATA_SYNC: 'regent_last_data_sync',
} as const;

// ============================================
// ASSETS
// ============================================

export async function saveAssets(assets: Asset[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(assets);
    await AsyncStorage.setItem(STORAGE_KEYS.ASSETS, jsonValue);
    console.log('✅ Assets saved:', assets.length);
  } catch (error) {
    console.error('❌ Error saving assets:', error);
    throw error;
  }
}

export async function loadAssets(): Promise<Asset[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ASSETS);
    if (jsonValue === null) {
      console.log('📭 No assets found in storage');
      return [];
    }
    const assets = JSON.parse(jsonValue) as Asset[];
    console.log('✅ Assets loaded:', assets.length);
    return assets;
  } catch (error) {
    console.error('❌ Error loading assets:', error);
    return [];
  }
}

export async function addAsset(asset: Asset): Promise<void> {
  try {
    const assets = await loadAssets();
    assets.push(asset);
    await saveAssets(assets);
    console.log('✅ Asset added:', asset.name);
  } catch (error) {
    console.error('❌ Error adding asset:', error);
    throw error;
  }
}

export async function updateAsset(updatedAsset: Asset): Promise<void> {
  try {
    const assets = await loadAssets();
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index !== -1) {
      assets[index] = updatedAsset;
      await saveAssets(assets);
      console.log('✅ Asset updated:', updatedAsset.name);
    } else {
      throw new Error(`Asset not found: ${updatedAsset.id}`);
    }
  } catch (error) {
    console.error('❌ Error updating asset:', error);
    throw error;
  }
}

export async function deleteAsset(assetId: string): Promise<void> {
  try {
    const assets = await loadAssets();
    const filtered = assets.filter((a) => a.id !== assetId);
    await saveAssets(filtered);
    console.log('✅ Asset deleted:', assetId);
  } catch (error) {
    console.error('❌ Error deleting asset:', error);
    throw error;
  }
}

// ============================================
// LIABILITIES
// ============================================

export async function saveLiabilities(liabilities: Liability[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(liabilities);
    await AsyncStorage.setItem(STORAGE_KEYS.LIABILITIES, jsonValue);
    console.log('✅ Liabilities saved:', liabilities.length);
  } catch (error) {
    console.error('❌ Error saving liabilities:', error);
    throw error;
  }
}

export async function loadLiabilities(): Promise<Liability[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LIABILITIES);
    if (jsonValue === null) {
      console.log('📭 No liabilities found in storage');
      return [];
    }
    const liabilities = JSON.parse(jsonValue) as Liability[];
    console.log('✅ Liabilities loaded:', liabilities.length);
    return liabilities;
  } catch (error) {
    console.error('❌ Error loading liabilities:', error);
    return [];
  }
}

export async function addLiability(liability: Liability): Promise<void> {
  try {
    const liabilities = await loadLiabilities();
    liabilities.push(liability);
    await saveLiabilities(liabilities);
    console.log('✅ Liability added:', liability.name);
  } catch (error) {
    console.error('❌ Error adding liability:', error);
    throw error;
  }
}

export async function updateLiability(updatedLiability: Liability): Promise<void> {
  try {
    const liabilities = await loadLiabilities();
    const index = liabilities.findIndex((l) => l.id === updatedLiability.id);
    if (index !== -1) {
      liabilities[index] = updatedLiability;
      await saveLiabilities(liabilities);
      console.log('✅ Liability updated:', updatedLiability.name);
    } else {
      throw new Error(`Liability not found: ${updatedLiability.id}`);
    }
  } catch (error) {
    console.error('❌ Error updating liability:', error);
    throw error;
  }
}

export async function deleteLiability(liabilityId: string): Promise<void> {
  try {
    const liabilities = await loadLiabilities();
    const filtered = liabilities.filter((l) => l.id !== liabilityId);
    await saveLiabilities(filtered);
    console.log('✅ Liability deleted:', liabilityId);
  } catch (error) {
    console.error('❌ Error deleting liability:', error);
    throw error;
  }
}

// ============================================
// USER
// ============================================

export async function saveUser(user: User): Promise<void> {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, jsonValue);
    console.log('✅ User saved:', user.email);
  } catch (error) {
    console.error('❌ Error saving user:', error);
    throw error;
  }
}

export async function loadUser(): Promise<User | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (jsonValue === null) {
      console.log('📭 No user found in storage');
      return null;
    }
    const user = JSON.parse(jsonValue) as User;
    console.log('✅ User loaded:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Error loading user:', error);
    return null;
  }
}

// ============================================
// PREFERENCES
// ============================================

export interface Preferences {
  primaryCurrency: 'GBP' | 'USD' | 'EUR';
  theme?: 'light' | 'dark';
}

export async function savePreferences(preferences: Preferences): Promise<void> {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, jsonValue);
    console.log('✅ Preferences saved');
  } catch (error) {
    console.error('❌ Error saving preferences:', error);
    throw error;
  }
}

export async function loadPreferences(): Promise<Preferences> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (jsonValue === null) {
      // Default preferences
      const defaultPrefs: Preferences = { primaryCurrency: 'GBP' };
      console.log('📭 No preferences found, using defaults');
      return defaultPrefs;
    }
    const preferences = JSON.parse(jsonValue) as Preferences;
    console.log('✅ Preferences loaded');
    return preferences;
  } catch (error) {
    console.error('❌ Error loading preferences:', error);
    return { primaryCurrency: 'GBP' };
  }
}

// ============================================
// UTILITIES
// ============================================

// ============================================
// SUBSCRIPTION
// ============================================

export interface SubscriptionState {
  hasStartedTrial: boolean;
  trialStartDate?: string;
}

export async function saveSubscription(subscription: SubscriptionState): Promise<void> {
  try {
    const jsonValue = JSON.stringify(subscription);
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, jsonValue);
    console.log('✅ Subscription saved');
  } catch (error) {
    console.error('❌ Error saving subscription:', error);
    throw error;
  }
}

export async function loadSubscription(): Promise<SubscriptionState> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (jsonValue === null) {
      // Default: user hasn't started trial yet
      const defaultState: SubscriptionState = { hasStartedTrial: false };
      console.log('📭 No subscription found, using defaults');
      return defaultState;
    }
    const subscription = JSON.parse(jsonValue) as SubscriptionState;
    console.log('✅ Subscription loaded:', subscription);
    return subscription;
  } catch (error) {
    console.error('❌ Error loading subscription:', error);
    return { hasStartedTrial: false };
  }
}

// ============================================
// LAST DATA SYNC TIMESTAMP
// ============================================

/**
 * Save the last time data was synced/updated
 * Used for "Updated X ago" timestamp on home screen
 */
export async function saveLastDataSync(timestamp: Date = new Date()): Promise<void> {
  try {
    const isoString = timestamp.toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_DATA_SYNC, isoString);
    console.log('✅ Last data sync saved:', isoString);
  } catch (error) {
    console.error('❌ Error saving last data sync:', error);
    throw error;
  }
}

/**
 * Load the last data sync timestamp
 * Returns null if never synced before
 */
export async function loadLastDataSync(): Promise<Date | null> {
  try {
    const isoString = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DATA_SYNC);
    if (isoString === null) {
      console.log('📭 No last data sync found');
      return null;
    }
    const date = new Date(isoString);
    console.log('✅ Last data sync loaded:', date.toISOString());
    return date;
  } catch (error) {
    console.error('❌ Error loading last data sync:', error);
    return null;
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Clear all app data (use for logout or reset)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ASSETS,
      STORAGE_KEYS.LIABILITIES,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.SUBSCRIPTION,
      STORAGE_KEYS.LAST_DATA_SYNC,
      '@regent_invite_code',      // Clear invite validation for fresh start
      '@regent_invite_code_id',   // Clear invite code ID
    ]);
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}
