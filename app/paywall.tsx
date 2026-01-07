/**
 * Paywall Screen
 * Appears after sign-up, before PIN setup
 * User must tap "Start 14-Day Free Trial" to proceed
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { useRevenueCatContext } from '../contexts/RevenueCatContext';

export default function PaywallScreen() {
  const router = useRouter();
  const { packages, purchasePackage, restorePurchases, isLoading: isLoadingPurchases } = useRevenueCatContext();
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleStartTrial = async () => {
    try {
      setIsStartingTrial(true);
      
      // Check if packages are loaded
      if (packages.length === 0) {
        Alert.alert(
          'Not Available',
          'Subscription packages are not available yet. Please try again in a moment.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Purchase the first package (annual subscription with 14-day trial)
      const annualPackage = packages[0];
      console.log('💳 Starting purchase for:', annualPackage.identifier);
      
      await purchasePackage(annualPackage);
      
      console.log('✅ Trial started successfully!');
      
      // Small delay for UX (feels more intentional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to auth (PIN setup)
      router.replace('/auth');
    } catch (error: any) {
      console.error('❌ Error starting trial:', error);
      
      // Don't show alert if user cancelled
      if (error.message === 'USER_CANCELLED') {
        console.log('User cancelled purchase');
      } else {
        Alert.alert(
          'Purchase Failed',
          'Could not start your free trial. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await restorePurchases();
      
      // Check if user has active subscription
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert(
          'Success',
          'Your subscription has been restored!',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/auth'),
            },
          ]
        );
      } else {
        Alert.alert(
          'No Subscription Found',
          'We couldn\'t find any active subscriptions for this account.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Error restoring purchases:', error);
      Alert.alert(
        'Restore Failed',
        'Could not restore your purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  // Calculate trial end date (14 days from now)
  const getTrialEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1, justifyContent: 'center' }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Regent</Text>
          <Text style={styles.tagline}>
            Financial clarity for discerning professionals
          </Text>
        </View>

        {/* Trial Offer Card - Contains Price + Trial Info */}
        <View style={styles.trialCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>£149</Text>
            <Text style={styles.pricePeriod}>/year</Text>
          </View>
          <Text style={styles.trialText}>
            Includes free 14-day trial — cancel anytime
          </Text>
          <Text style={styles.trialSubtext}>
            You won't be charged until {getTrialEndDate()}
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkIconContainer}>
                <Check
                  size={12}
                  color={Colors.foreground}
                  strokeWidth={2.5}
                />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Card - REMOVED, now part of trial card */}

        {/* Start Trial Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            (isStartingTrial || isLoadingPurchases) && styles.startButtonDisabled,
          ]}
          onPress={handleStartTrial}
          disabled={isStartingTrial || isLoadingPurchases}
          activeOpacity={0.8}
        >
          {isStartingTrial || isLoadingPurchases ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.startButtonText}>Start Free Trial</Text>
          )}
        </TouchableOpacity>

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isStartingTrial || isRestoring || isLoadingPurchases}
          activeOpacity={0.6}
        >
          {isRestoring ? (
            <ActivityIndicator color={Colors.mutedForeground} />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        {/* Legal Fine Print */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            Payment will be charged to your Apple ID account at the confirmation of purchase. 
            Subscription automatically renews unless it is cancelled at least 24 hours before 
            the end of the current period. Your account will be charged for renewal within 
            24 hours prior to the end of the current period. You can manage and cancel your 
            subscriptions by going to your account settings on the App Store after purchase.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BENEFITS = [
  'Real-time portfolio tracking with live market data',
  'Secure bank account sync via TrueLayer',
  'Privacy-first architecture with no data sharing',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24, // px-6 (not xl which is 32px)
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24, // mb-6
  },
  logo: {
    fontSize: 40,
    fontWeight: '300',
    color: Colors.foreground,
    letterSpacing: -0.8,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.mutedForeground,
    textAlign: 'center',
    letterSpacing: -0.18,
    lineHeight: 27,
  },

  // Trial Offer Card (contains price + trial info)
  trialCard: {
    backgroundColor: Colors.card,
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20, // p-5
    alignItems: 'center',
    marginBottom: 20, // mb-5
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12, // mb-3
  },
  priceAmount: {
    fontSize: 48, // 3rem
    fontWeight: '300',
    color: Colors.foreground,
    letterSpacing: -0.96, // -0.02em
  },
  pricePeriod: {
    fontSize: 18, // 1.125rem
    color: Colors.mutedForeground,
    fontWeight: '400',
    marginLeft: 4,
  },
  trialText: {
    fontSize: 15, // 0.9375rem
    fontWeight: '400',
    color: Colors.foreground,
    textAlign: 'center',
    lineHeight: 22.5, // 1.5
    marginBottom: 10, // mb-2.5
  },
  trialSubtext: {
    fontSize: 13, // 0.8125rem
    color: Colors.mutedForeground,
    opacity: 0.8,
    textAlign: 'center',
  },

  // Benefits
  benefitsContainer: {
    marginBottom: 20, // mb-5
    gap: 10, // space-y-2.5
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10, // gap-2.5
  },
  checkIconContainer: {
    padding: 2, // p-0.5
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4, // mt-1
  },
  benefitText: {
    flex: 1,
    fontSize: 13, // 0.8125rem
    color: Colors.foreground,
    lineHeight: 18.2, // 1.4
    letterSpacing: -0.13,
  },

  // Start Trial Button
  startButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // mb-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 16, // 1rem
    fontWeight: '500',
    color: Colors.white,
    letterSpacing: -0.16, // -0.01em
  },

  // Restore Button
  restoreButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // mb-5
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.mutedForeground,
  },

  // Legal
  legalContainer: {
    paddingTop: Spacing.lg,
  },
  legalText: {
    fontSize: 11, // 0.6875rem
    color: Colors.mutedForeground,
    lineHeight: 17.6, // 1.6
    textAlign: 'center',
    opacity: 0.8,
  },
});
