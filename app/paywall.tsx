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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';

export default function PaywallScreen() {
  const router = useRouter();
  const { startTrial } = useData();
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  const handleStartTrial = async () => {
    try {
      setIsStartingTrial(true);
      
      // Save trial started flag to AsyncStorage
      await startTrial();
      
      // Small delay for UX (feels more intentional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to auth (PIN setup)
      router.replace('/auth');
    } catch (error) {
      console.error('❌ Error starting trial:', error);
      setIsStartingTrial(false);
    }
  };

  const handleRestorePurchases = () => {
    // TODO: Implement RevenueCat restore purchases
    console.log('🔄 Restore purchases tapped (placeholder)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Regent</Text>
          <Text style={styles.tagline}>
            Financial clarity for discerning professionals
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkIconContainer}>
                <Check
                  size={16}
                  color={Colors.foreground}
                  strokeWidth={2.5}
                />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>Annual Subscription</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>£149</Text>
            <Text style={styles.pricePeriod}>/year</Text>
          </View>
          <Text style={styles.pricingSubtext}>
            Includes free 14-day trial • Cancel anytime
          </Text>
        </View>

        {/* Start Trial Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            isStartingTrial && styles.startButtonDisabled,
          ]}
          onPress={handleStartTrial}
          disabled={isStartingTrial}
          activeOpacity={0.8}
        >
          {isStartingTrial ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.startButtonText}>Start 14-Day Free Trial</Text>
          )}
        </TouchableOpacity>

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isStartingTrial}
          activeOpacity={0.6}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal Fine Print */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            Payment will be charged to your Apple ID account at confirmation of purchase. 
            Subscription automatically renews unless cancelled at least 24 hours before the 
            end of the current period. Your account will be charged for renewal within 24 hours 
            prior to the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BENEFITS = [
  'Real-time portfolio tracking with live market data',
  'Secure bank account sync via TrueLayer',
  'Complete financial clarity across all assets',
  'Privacy-first architecture with no data sharing',
  'Designed for mass affluent professionals',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['2xl'],
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
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

  // Benefits
  benefitsContainer: {
    marginBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: Colors.foreground,
    lineHeight: 22.5,
    letterSpacing: -0.15,
  },

  // Pricing Card
  pricingCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  pricingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.foreground,
    letterSpacing: -0.96,
  },
  pricePeriod: {
    fontSize: 18,
    color: Colors.mutedForeground,
    fontWeight: '400',
    marginLeft: 4,
  },
  pricingSubtext: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },

  // Start Trial Button
  startButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
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
    fontSize: 17,
    fontWeight: '500',
    color: Colors.white,
    letterSpacing: -0.17,
  },

  // Restore Button
  restoreButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
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
    fontSize: 11,
    color: Colors.mutedForeground,
    lineHeight: 16.5,
    textAlign: 'center',
    opacity: 0.8,
  },
});
