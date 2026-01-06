/**
 * Global Data Context
 * Manages assets, liabilities, and user data in memory
 * Persists to AsyncStorage on every change
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
} from '../utils/storage';
import { generateId } from '../utils/generateId';

// ============================================
// TYPES
// ============================================

interface DataContextType {
  // Data
  assets: Asset[];
  liabilities: Liability[];
  user: User | null;
  primaryCurrency: Currency;
  
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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>('GBP');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  // CONTEXT VALUE
  // ============================================

  const value: DataContextType = {
    // Data
    assets,
    liabilities,
    user,
    primaryCurrency,
    
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
