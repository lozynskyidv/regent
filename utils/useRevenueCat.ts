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
}

export function useRevenueCat(): UseRevenueCatReturn {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Check if user has premium entitlement
  const isPremium = customerInfo?.entitlements.active['premium'] !== undefined;
  
  // Check if user is in trial period
  const isInTrial = customerInfo?.entitlements.active['premium']?.periodType === 'trial';
  
  // Get trial end date
  const trialEndDate = customerInfo?.entitlements.active['premium']?.expirationDate 
    ? new Date(customerInfo.entitlements.active['premium'].expirationDate)
    : null;

  return {
    customerInfo,
    packages,
    isLoading,
    isPremium,
    isInTrial,
    trialEndDate,
    purchasePackage,
    restorePurchases,
  };
}
