/**
 * Settings Screen
 * Subscription status, currency, preferences, account management
 * Matches web prototype structure with smart progressive disclosure
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';
import { clearAllData } from '../utils/storage';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area insets immediately
  const { primaryCurrency, setCurrency } = useData();
  const [faceIDEnabled, setFaceIDEnabled] = useState(true); // Mock state for now
  const [pendingCurrency, setPendingCurrency] = useState<'GBP' | 'USD' | 'EUR' | null>(null);
  
  // Free trial state (accurate - all users start with 7-day trial)
  const trialDaysRemaining = 7;
  const isTrialActive = trialDaysRemaining > 0;

  // Smooth layout animation on mount
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.create(
      300, // Duration: 300ms
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity
    ));
  }, []);

  const handleCurrencyChange = (newCurrency: 'GBP' | 'USD' | 'EUR') => {
    if (newCurrency === primaryCurrency) return;
    
    // Show warning about symbol-only change
    setPendingCurrency(newCurrency);
    Alert.alert(
      'Change Currency Symbol',
      'This will only change the currency symbol displayed throughout the app. Your asset and liability values will remain unchanged (no conversion).',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setPendingCurrency(null) },
        {
          text: 'Change Symbol',
          onPress: async () => {
            try {
              await setCurrency(newCurrency);
              setPendingCurrency(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to update currency. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? All your data is stored locally on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data from this device. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              'Are You Absolutely Sure?',
              'This will erase all your assets, liabilities, and settings. This is permanent.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete All Data',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await clearAllData();
                      router.replace('/');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to delete data. Please try again.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <ChevronLeft size={24} color={Colors.foreground} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <View style={styles.card}>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subscriptionLabel}>Status</Text>
              <View style={[styles.badge, isTrialActive && styles.badgeTrial]}>
                <Text style={[styles.badgeText, isTrialActive && styles.badgeTextTrial]}>
                  {isTrialActive ? `Trial (${trialDaysRemaining}d left)` : 'Expired'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.subscriptionDescription}>
              {isTrialActive 
                ? `${trialDaysRemaining === 1 ? '1 day' : `${trialDaysRemaining} days`} remaining in your free trial`
                : 'Your trial has ended. Subscribe to continue.'}
            </Text>
          </View>
        </View>

        {/* Currency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          
          <View style={styles.currencyRow}>
            {(['GBP', 'USD', 'EUR'] as const).map((currency) => (
              <TouchableOpacity
                key={currency}
                onPress={() => handleCurrencyChange(currency)}
                style={[
                  styles.currencyButton,
                  primaryCurrency === currency && styles.currencyButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>
                  {currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€'}
                </Text>
                <Text
                  style={[
                    styles.currencyCode,
                    primaryCurrency === currency && styles.currencyCodeActive,
                  ]}
                >
                  {currency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionNote}>
            Note: Changing currency only updates the symbol. Your values remain unchanged.
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Face ID</Text>
                <Text style={styles.settingDescription}>
                  Use Face ID to unlock Regent
                </Text>
              </View>
              <Switch
                value={faceIDEnabled}
                onValueChange={setFaceIDEnabled}
                trackColor={{ false: '#E5E7EB', true: Colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0 (Beta)</Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutRowLast]}>
              <Text style={styles.aboutLabel}>Build</Text>
              <Text style={styles.aboutValue}>2026.01.06</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.accountButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.accountButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
            <Text style={styles.deleteDescription}>
              Permanently delete your account and all data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact & Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Feedback</Text>
          
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => Linking.openURL('mailto:support@regent.app?subject=Regent%20App%20Feedback')}
            activeOpacity={0.7}
          >
            <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            <Text style={styles.feedbackButtonDescription}>
              We'd love to hear from you
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  headerContent: {},
  headerTitle: {
    fontSize: 32, // 2rem
    fontWeight: '500',
    letterSpacing: -0.64, // -0.02em
    color: Colors.foreground,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },

  // Sections
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18, // 1.125rem
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  sectionNote: {
    fontSize: 12,
    color: Colors.mutedForeground,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },

  // Subscription Card
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  subscriptionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  badgeTrial: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(239, 68, 68)',
  },
  badgeTextTrial: {
    color: 'rgb(59, 130, 246)',
  },
  subscriptionDescription: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
  },

  // Currency Selector
  currencyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  currencyButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  currencyButtonActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  currencySymbol: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },
  currencyCodeActive: {
    fontWeight: '600',
    color: Colors.primary,
  },

  // Card
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },

  // Setting Row
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },

  // About Rows
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aboutRowLast: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  aboutLabel: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },

  // Account Button
  accountButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  accountButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },

  // Feedback Button
  feedbackButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  feedbackButtonDescription: {
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },

  // Delete Button
  deleteButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: Colors.card,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgb(239, 68, 68)',
    marginBottom: 4,
  },
  deleteDescription: {
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
});
