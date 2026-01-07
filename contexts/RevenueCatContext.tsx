/**
 * RevenueCat Context
 * Provides subscription state to entire app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useRevenueCat } from '../utils/useRevenueCat';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

interface RevenueCatContextType {
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
  isLoading: boolean;
  isPremium: boolean;
  isInTrial: boolean;
  trialEndDate: Date | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  logOut: () => Promise<void>;
  logIn: (userId: string) => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export function RevenueCatProvider({ children }: { children: ReactNode }) {
  const revenueCat = useRevenueCat();

  return (
    <RevenueCatContext.Provider value={revenueCat}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCatContext() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCatContext must be used within RevenueCatProvider');
  }
  return context;
}
