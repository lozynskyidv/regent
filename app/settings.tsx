/**
 * Settings Screen
 * User profile, currency selection, Face ID toggle, logout
 * Matches web prototype design
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';
import { clearAllData } from '../utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, primaryCurrency, setCurrency } = useData();
  const [faceIDEnabled, setFaceIDEnabled] = useState(true); // Mock state for now
  const [pendingCurrency, setPendingCurrency] = useState<'GBP' | 'USD' | 'EUR' | null>(null);

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
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
            </View>
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
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
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

        {/* Bottom Spacer */}
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
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

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.mutedForeground,
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

  // Sign Out Button
  signOutButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
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
