/**
 * Paywall Screen Component
 * Shows subscription offer with 7-day free trial at £49/year
 * Matches web prototype design exactly
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';

interface PaywallScreenProps {
  trialEndDate?: string; // ISO date string for when trial ends
  onSubscribe: () => void;
  onRestorePurchases: () => void;
  isProcessing?: boolean;
}

export default function PaywallScreen({ 
  trialEndDate,
  onSubscribe, 
  onRestorePurchases,
  isProcessing = false 
}: PaywallScreenProps) {
  // Calculate trial end date if not provided (7 days from now)
  const calculateTrialEndDate = () => {
    if (trialEndDate) {
      return trialEndDate;
    }
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toISOString();
  };

  // Format trial end date (e.g., "January 15, 2026")
  const formatTrialEndDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const displayTrialEndDate = calculateTrialEndDate();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>Regent</Text>
          <Text style={styles.tagline}>
            Financial clarity for discerning professionals
          </Text>
        </View>

        {/* Pricing Card (at top) */}
        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>£49</Text>
            <Text style={styles.pricePeriod}>/year</Text>
          </View>
          <Text style={styles.trialInfo}>
            Includes free 7-day trial — cancel anytime
          </Text>
          <Text style={styles.chargeDate}>
            You won't be charged until {formatTrialEndDate(displayTrialEndDate)}
          </Text>
        </View>

        {/* Benefits (only 3) */}
        <View style={styles.benefitsContainer}>
          {[
            'Real-time portfolio tracking with live market data',
            'Secure bank account sync via TrueLayer',
            'Privacy-first architecture with no data sharing'
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Check size={16} color={Colors.foreground} strokeWidth={2.5} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Start Free Trial Button */}
        <TouchableOpacity
          style={[styles.trialButton, isProcessing && styles.trialButtonDisabled]}
          onPress={onSubscribe}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.trialButtonText}>Start Free Trial</Text>
          )}
        </TouchableOpacity>

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={onRestorePurchases}
          disabled={isProcessing}
          activeOpacity={0.6}
        >
          <Text style={[styles.restoreButtonText, isProcessing && styles.restoreButtonTextDisabled]}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Fine Print */}
        <Text style={styles.finePrint}>
          Payment will be charged to your Apple ID account at the confirmation of purchase. 
          Subscription automatically renews unless it is cancelled at least 24 hours before the end of the 
          current period. Your account will be charged for renewal within 24 hours prior to the end of the 
          current period. You can manage and cancel your subscriptions by going to your account settings on 
          the App Store after purchase.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -0.8,
    color: Colors.foreground,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: Colors.mutedForeground,
    fontWeight: '300',
    letterSpacing: -0.18,
    textAlign: 'center',
  },
  
  // Pricing Card (at top, in white card)
  pricingCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -0.96,
    color: Colors.foreground,
  },
  pricePeriod: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.mutedForeground,
    marginLeft: 4,
  },
  trialInfo: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: 4,
  },
  chargeDate: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
  
  // Benefits (only 3)
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: Colors.foreground,
    lineHeight: 22.5,
    marginLeft: 12,
  },
  
  // Start Free Trial Button
  trialButton: {
    backgroundColor: Colors.foreground,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  trialButtonDisabled: {
    opacity: 0.6,
  },
  trialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.background,
    letterSpacing: -0.16,
  },
  
  // Restore Purchases
  restoreButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.mutedForeground,
  },
  restoreButtonTextDisabled: {
    opacity: 0.4,
  },
  
  // Fine Print
  finePrint: {
    fontSize: 12,
    color: Colors.mutedForeground,
    lineHeight: 18,
    textAlign: 'center',
  },
});
