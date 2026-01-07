/**
 * RevenueCat Hook
 * Manages subscription state and purchases
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { 
  LOG_LEVEL, 
  CustomerInfo, 
  PurchasesPackage,
  PurchasesError,
} from 'react-native-purchases';

// RevenueCat API keys (test keys from dashboard)
const REVENUECAT_IOS_API_KEY = 'test_PoLKzvEYygTGhoNcJtPPQnbVZEs';
const REVENUECAT_ANDROID_API_KEY = 'test_PoLKzvEYygTGhoNcJtPPQnbVZEs';

interface UseRevenueCatReturn {
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

export function useRevenueCat(): UseRevenueCatReturn {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIdentifying, setIsIdentifying] = useState(false);

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      console.log('💳 Initializing RevenueCat...');
      
      // Set log level for debugging
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      // Configure with platform-specific API key
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
      }

      console.log('✅ RevenueCat configured');

      // Get customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      console.log('📊 Customer info:', {
        isPremium: info.entitlements.active['premium'] !== undefined,
        activeSubscriptions: Object.keys(info.entitlements.active),
      });

      // Get available packages (offerings)
      const offerings = await Purchases.getOfferings();
      console.log('📦 Offerings:', offerings);
      
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
        console.log('✅ Packages loaded:', offerings.current.availablePackages.length);
      } else {
        console.warn('⚠️ No packages available. Make sure you configured products in RevenueCat dashboard.');
      }
    } catch (error) {
      console.error('❌ RevenueCat init error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage): Promise<CustomerInfo> => {
    try {
      console.log('💰 Purchasing package:', pkg.identifier);
      
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      
      console.log('✅ Purchase successful!');
      console.log('📊 New customer info:', {
        isPremium: info.entitlements.active['premium'] !== undefined,
        activeSubscriptions: Object.keys(info.entitlements.active),
      });
      
      return info;
    } catch (error) {
      const purchaseError = error as PurchasesError;
      
      // Don't throw error if user cancelled
      if (purchaseError.userCancelled) {
        console.log('❌ User cancelled purchase');
        throw new Error('USER_CANCELLED');
      }
      
      console.error('❌ Purchase error:', purchaseError);
      throw error;
    }
  };

  const restorePurchases = async (): Promise<CustomerInfo> => {
    try {
      console.log('🔄 Restoring purchases...');
      
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      
      console.log('✅ Purchases restored');
      console.log('📊 Customer info:', {
        isPremium: info.entitlements.active['premium'] !== undefined,
        activeSubscriptions: Object.keys(info.entitlements.active),
      });
      
      return info;
    } catch (error) {
      console.error('❌ Restore error:', error);
      throw error;
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      console.log('🔓 Logging out from RevenueCat...');
      
      await Purchases.logOut();
      
      // Reset local state
      setCustomerInfo(null);
      setPackages([]);
      
      console.log('✅ RevenueCat logged out - customer info cleared');
      
      // Reinitialize to prepare for next user
      console.log('🔄 Reinitializing RevenueCat for next user...');
      await initializePurchases();
      console.log('✅ RevenueCat reinitialized');
    } catch (error) {
      console.error('❌ RevenueCat logout error:', error);
      // Don't throw - we still want to continue with sign out even if this fails
    }
  };

  const logIn = async (userId: string): Promise<void> => {
    try {
      console.log('🔐 Checking if RevenueCat user identification needed...');
      
      // FAST PATH: Check immediately if user is already identified
      // This happens BEFORE any waiting or async calls
      if (customerInfo?.originalAppUserId === userId) {
        console.log('✅ User already identified to RevenueCat - skipping logIn (fast path)');
        return; // Exit immediately - no loading state needed!
      }
      
      // SLOW PATH: Need to identify user
      setIsIdentifying(true);
      
      // Wait for initialization to complete to avoid race condition
      if (isLoading) {
        console.log('⏳ Waiting for RevenueCat initialization to complete...');
        // Wait up to 2 seconds for initialization
        let attempts = 0;
        while (isLoading && attempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        if (isLoading) {
          console.warn('⚠️ RevenueCat still initializing after 2s, proceeding anyway');
        }
      }
      
      // Double-check after waiting (in case initialization completed)
      if (customerInfo?.originalAppUserId === userId) {
        console.log('✅ User already identified to RevenueCat - skipping logIn (after wait)');
        return;
      }
      
      console.log('📋 Current RevenueCat user ID:', customerInfo?.originalAppUserId);
      console.log('📋 Target user ID:', userId);
      console.log('🔐 User ID mismatch - logging in to RevenueCat...');
      
      // Identify the user to RevenueCat
      const { customerInfo: info } = await Purchases.logIn(userId);
      setCustomerInfo(info);
      
      console.log('✅ RevenueCat user identified');
      console.log('📊 Customer info restored:', {
        isPremium: info.entitlements.active['premium'] !== undefined,
        activeSubscriptions: info.activeSubscriptions,
      });
    } catch (error) {
      console.error('❌ RevenueCat login error:', error);
      // Don't throw - we still want to continue even if this fails
    } finally {
      setIsIdentifying(false);
    }
  };

  // Check if user has premium entitlement
  // FALLBACK: Also check for any active subscriptions if entitlement not configured yet
  const hasPremiumEntitlement = customerInfo?.entitlements.active['premium'] !== undefined;
  const hasActiveSubscription = customerInfo?.activeSubscriptions && customerInfo.activeSubscriptions.length > 0;
  const isPremium = hasPremiumEntitlement || hasActiveSubscription;
  
  // Check if user is in trial period
  const isInTrial = customerInfo?.entitlements.active['premium']?.periodType === 'trial';
  
  // Get trial end date
  const trialEndDate = customerInfo?.entitlements.active['premium']?.expirationDate 
    ? new Date(customerInfo.entitlements.active['premium'].expirationDate)
    : null;
  
  // Log subscription status for debugging
  if (customerInfo) {
    console.log('🔐 Subscription status:', {
      hasPremiumEntitlement,
      hasActiveSubscription,
      isPremium,
      activeSubscriptions: customerInfo.activeSubscriptions,
      entitlements: Object.keys(customerInfo.entitlements.active),
    });
  }

  return {
    customerInfo,
    packages,
    isLoading, // Don't include isIdentifying - let identification happen in background
    isPremium,
    isInTrial,
    trialEndDate,
    purchasePackage,
    restorePurchases,
    logOut,
    logIn,
  };
}
