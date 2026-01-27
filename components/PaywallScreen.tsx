/**
 * Paywall Screen Component
 * Shows subscription offer with 7-day free trial at £49/year
 * Displays during trial and after trial expires
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';

interface PaywallScreenProps {
  daysRemaining?: number;
  onSubscribe: () => void;
  onRestorePurchases: () => void;
  isProcessing?: boolean;
}

export default function PaywallScreen({ 
  daysRemaining, 
  onSubscribe, 
  onRestorePurchases,
  isProcessing = false 
}: PaywallScreenProps) {
  const isTrialActive = daysRemaining !== undefined && daysRemaining > 0;

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

        {/* Trial Status */}
        {isTrialActive && (
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>
              {daysRemaining === 1 
                ? '1 day remaining in your trial' 
                : `${daysRemaining} days remaining in your trial`}
            </Text>
          </View>
        )}

        {/* Trial Expired Message */}
        {!isTrialActive && (
          <View style={styles.expiredCard}>
            <Text style={styles.expiredTitle}>Your trial has ended</Text>
            <Text style={styles.expiredSubtitle}>
              Subscribe to continue managing your net worth with confidence
            </Text>
          </View>
        )}

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {[
            'Real-time portfolio tracking with live market data',
            'Secure bank account sync via TrueLayer',
            'Complete financial clarity across all assets',
            'Privacy-first architecture with no data sharing',
            'Designed for mass affluent professionals'
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkContainer}>
                <Check size={16} color={Colors.foreground} strokeWidth={2.5} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>ANNUAL SUBSCRIPTION</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>£149</Text>
            <Text style={styles.pricePeriod}>/year</Text>
          </View>
          <Text style={styles.pricingSubtext}>
            Cancel anytime in Settings
          </Text>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, isProcessing && styles.subscribeButtonDisabled]}
          onPress={onSubscribe}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <Text style={styles.subscribeButtonText}>
              {isTrialActive ? 'Subscribe Now' : 'Continue with Regent'}
            </Text>
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
          Payment will be charged to your Apple ID account at confirmation of purchase. 
          Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['2xl'],
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -0.8,
    color: Colors.foreground,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: 18,
    color: Colors.mutedForeground,
    fontWeight: '300',
    letterSpacing: -0.18,
    textAlign: 'center',
  },
  
  // Status Cards
  statusCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  
  expiredCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  expiredTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  expiredSubtitle: {
    fontSize: 15,
    color: Colors.mutedForeground,
    lineHeight: 22.5,
    textAlign: 'center',
  },
  
  // Benefits
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: Colors.foreground,
    lineHeight: 22.5,
  },
  
  // Pricing
  pricingCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 12,
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -0.96,
    color: Colors.foreground,
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
  },
  
  // Buttons
  subscribeButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.background,
    letterSpacing: -0.16,
  },
  
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
