/**
 * Core TypeScript Types
 * Data models for Regent app
 */

// Currency types
export type Currency = 'GBP' | 'USD' | 'EUR';

// Asset types
export type AssetType = 'bank' | 'portfolio' | 'property' | 'other';

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: AssetType;
  currency: Currency;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  metadata?: {
    // For bank accounts (TrueLayer)
    accountId?: string;
    bankName?: string;
    lastSynced?: string;
    
    // For portfolios (stocks/ETFs)
    ticker?: string;
    quantity?: number;
    lastPrice?: number;
    lastPriceUpdate?: string;
    holdings?: StockHolding[];
    holdingsCount?: number;
    
    // For properties
    address?: string;
    
    // Generic
    notes?: string;
  };
}

export interface StockHolding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  change: number; // Percentage
}

// Liability types
export type LiabilityType = 'mortgage' | 'creditcard' | 'loan' | 'other';

export interface Liability {
  id: string;
  name: string;
  value: number; // Amount owed (always positive)
  type: LiabilityType;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    interestRate?: string;
    monthlyPayment?: string;
    notes?: string;
  };
}

// User profile
export interface User {
  id: string;
  email: string;
  name: string;
  profilePhotoUrl?: string;
  primaryCurrency: Currency;
  createdAt: string;
  lastLoginAt: string;
  hasFaceIDEnabled: boolean;
  hasCompletedOnboarding: boolean;
}

// Subscription state (Minimal MVP - Approach 1)
export interface SubscriptionState {
  hasStartedTrial: boolean; // Simple boolean - true after user taps "Start Trial"
  trialStartDate?: string; // ISO timestamp when trial started (for future use)
  // Future fields for Approach 2/3:
  // trialDaysRemaining: number;
  // expiresAt?: string;
  // productId?: string;
  // isActive: boolean;
}

// Auth state
export interface AuthState {
  isAuthenticated: boolean;
  hasFaceID: boolean;
  hasPIN: boolean;
}
