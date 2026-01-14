/**
 * Settings Screen
 * Currency, preferences, account management
 * Matches web prototype structure with smart progressive disclosure
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, Linking, LayoutAnimation, Platform, UIManager, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Upload, Download, Cloud } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area insets immediately
  const { primaryCurrency, setCurrency, signOut, deleteAccount, backupData, restoreData, supabaseUser, isAuthProcessing } = useData();
  const [faceIDEnabled, setFaceIDEnabled] = useState(true); // Mock state for now
  const [pendingCurrency, setPendingCurrency] = useState<'GBP' | 'USD' | 'EUR' | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // PIN modal state
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinModalAction, setPinModalAction] = useState<'backup' | 'restore' | null>(null);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Smooth layout animation on mount
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.create(
      300, // Duration: 300ms
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity
    ));
  }, []);

  // Cleanup: Reset signing out state if component unmounts
  useEffect(() => {
    return () => {
      if (isSigningOut) {
        console.log('👤 Settings: Component unmounting, resetting sign out state');
      }
    };
  }, [isSigningOut]);

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

  const handleBackup = () => {
    setPinModalAction('backup');
    setShowPINModal(true);
  };

  const handleRestore = () => {
    setPinModalAction('restore');
    setShowPINModal(true);
  };

  const handlePINSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN.');
      return;
    }

    setIsProcessing(true);

    try {
      if (pinModalAction === 'backup') {
        await backupData(pin);
      } else if (pinModalAction === 'restore') {
        await restoreData(pin);
      }

      // Success - close modal
      setShowPINModal(false);
      setPin('');
      setPinModalAction(null);
    } catch (error) {
      // Error alerts are handled in DataContext
      console.error('PIN action error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = () => {
    if (isSigningOut || isAuthProcessing) {
      console.log('⏭️ Sign out already in progress, ignoring tap');
      return;
    }
    
    // Set loading state BEFORE showing alert to prevent double-taps
    setIsSigningOut(true);
    
    Alert.alert(
      'Sign Out',
      'Your financial data will remain on this device. Sign in again to access it.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            // User cancelled, reset loading state
            console.log('👤 Settings: Sign out cancelled');
            setIsSigningOut(false);
          }
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('👤 Settings: Starting sign out...');
              
              // Sign out from Supabase
              await signOut();
              console.log('👤 Settings: Sign out completed');
              // Navigation handled automatically by AuthGuard
              // Don't reset isSigningOut here - component will unmount on navigation
            } catch (error) {
              console.error('👤 Settings: Sign out error:', error);
              setIsSigningOut(false);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      {
        onDismiss: () => {
          // Alert dismissed by tapping outside, reset loading state
          console.log('👤 Settings: Alert dismissed');
          setIsSigningOut(false);
        }
      }
    );
  };

  const handleDeleteAccount = () => {
    console.log('🗑️ Settings: Delete Account button tapped');
    
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and ALL data (cloud backups and local). This action cannot be undone.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('❌ Settings: Delete cancelled (first alert)')
        },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            console.log('⚠️ Settings: First confirmation accepted, showing second alert');
            
            // Second confirmation
            Alert.alert(
              'Are You Absolutely Sure?',
              'This will erase your account, all backups, assets, liabilities, and settings. This is permanent and irreversible.',
              [
                { 
                  text: 'Cancel', 
                  style: 'cancel',
                  onPress: () => console.log('❌ Settings: Delete cancelled (second alert)')
                },
                {
                  text: 'Yes, Delete All Data',
                  style: 'destructive',
                  onPress: async () => {
                    console.log('🗑️ Settings: Final confirmation - calling deleteAccount()');
                    try {
                      await deleteAccount();
                      console.log('✅ Settings: deleteAccount() completed successfully');
                      // Navigation handled automatically by AuthGuard
                    } catch (error) {
                      console.error('❌ Settings: deleteAccount() failed:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
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

        {/* Data & Backup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Backup</Text>
          
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.backupRow}
              onPress={handleBackup}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Upload size={20} color={Colors.primary} />
              </View>
              <View style={styles.backupContent}>
                <Text style={styles.backupLabel}>Backup Data</Text>
                <Text style={styles.backupDescription}>
                  Securely backup your financial data
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.backupRow}
              onPress={handleRestore}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Download size={20} color={Colors.primary} />
              </View>
              <View style={styles.backupContent}>
                <Text style={styles.backupLabel}>Restore Data</Text>
                <Text style={styles.backupDescription}>
                  Restore from a previous backup
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionNote}>
            <Cloud size={12} color={Colors.mutedForeground} /> Your data is encrypted with your PIN before backup. Only you can decrypt it.
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <View style={styles.accountInfoRow}>
              <Text style={styles.accountLabel}>Email</Text>
              <Text style={styles.accountValue}>{supabaseUser?.email || 'Not signed in'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.accountButton, 
              { marginTop: Spacing.md },
              isSigningOut && styles.accountButtonDisabled
            ]}
            onPress={handleSignOut}
            activeOpacity={0.7}
            disabled={isSigningOut}
          >
            <Text style={[
              styles.accountButtonText,
              isSigningOut && styles.accountButtonTextDisabled
            ]}>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
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

      {/* PIN Modal */}
      <Modal
        visible={showPINModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowPINModal(false);
          setPin('');
          setPinModalAction(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {pinModalAction === 'backup' ? 'Backup Data' : 'Restore Data'}
            </Text>
            <Text style={styles.modalDescription}>
              Enter your 4-digit PIN to {pinModalAction === 'backup' ? 'encrypt and backup' : 'decrypt and restore'} your data
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              autoFocus
              editable={!isProcessing}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowPINModal(false);
                  setPin('');
                  setPinModalAction(null);
                }}
                disabled={isProcessing}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handlePINSubmit}
                disabled={pin.length !== 4 || isProcessing}
              >
                <Text style={styles.modalButtonTextConfirm}>
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full-Screen Loading Overlay During Auth Operations */}
      {isAuthProcessing && (
        <View style={styles.authOverlay}>
          <View style={styles.authOverlayContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.authOverlayText}>
              {isSigningOut ? 'Signing out...' : 'Deleting account...'}
            </Text>
          </View>
        </View>
      )}
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

  // Backup/Restore Rows
  backupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  backupContent: {
    flex: 1,
  },
  backupLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 2,
  },
  backupDescription: {
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },

  // Account Info
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  accountValue: {
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
  accountButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.secondary,
  },
  accountButtonTextDisabled: {
    color: Colors.mutedForeground,
  },

  // PIN Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.foreground,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  pinInput: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
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

  // Auth Processing Overlay
  authOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  authOverlayContent: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  authOverlayText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
    marginTop: Spacing.md,
  },
});
