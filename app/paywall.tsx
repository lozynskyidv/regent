/**
 * Paywall Screen Route
 * Shows subscription offer after successful auth
 * Integrates with RevenueCat for £49/year subscription + 7-day trial
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import PaywallScreen from '../components/PaywallScreen';
import { useData } from '../contexts/DataContext';
import { useRevenueCat } from '../utils/useRevenueCat';

export default function Paywall() {
  const router = useRouter();
  const { subscriptionState, supabaseUser } = useData();
  const { isPremium, isInTrial, trialEndDate, packages, purchasePackage, restorePurchases, logIn } = useRevenueCat();
  const [isProcessing, setIsProcessing] = useState(false);

  // Identify user to RevenueCat on mount
  useEffect(() => {
    if (supabaseUser?.id) {
      logIn(supabaseUser.id);
    }
  }, [supabaseUser?.id]);

  // Check if user already has premium access
  useEffect(() => {
    if (isPremium && !isInTrial) {
      console.log('✅ User has active subscription, navigating to home');
      router.replace('/home');
    }
  }, [isPremium, isInTrial]);

  // Calculate days remaining from RevenueCat
  const daysRemaining = trialEndDate
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : subscriptionState?.daysRemaining;

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      console.log('🛒 Starting subscription purchase...');

      // Get the annual package (£49/year)
      const annualPackage = packages.find(pkg => 
        pkg.product.identifier.includes('annual') || 
        pkg.packageType === 'ANNUAL'
      );

      if (!annualPackage) {
        Alert.alert('Error', 'Subscription package not available. Please contact support.');
        return;
      }

      console.log('📦 Purchasing package:', annualPackage.identifier);
      
      await purchasePackage(annualPackage);
      
      console.log('✅ Purchase successful, navigating to home');
      Alert.alert('Success', 'Welcome to Regent Premium!');
      router.replace('/home');
      
    } catch (error: any) {
      console.error('❌ Subscription error:', error);
      
      if (error.message === 'USER_CANCELLED') {
        console.log('User cancelled purchase');
        return;
      }
      
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsProcessing(true);
      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await restorePurchases();
      
      // Check if user has premium access after restore
      const hasPremium = customerInfo.entitlements.active['premium'] !== undefined ||
                        (customerInfo.activeSubscriptions && customerInfo.activeSubscriptions.length > 0);
      
      if (hasPremium) {
        Alert.alert('Success', 'Purchases restored successfully!');
        router.replace('/home');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases for this account.');
      }
      
    } catch (error) {
      console.error('❌ Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaywallScreen
      daysRemaining={daysRemaining}
      onSubscribe={handleSubscribe}
      onRestorePurchases={handleRestorePurchases}
      isProcessing={isProcessing}
    />
  );
}
