import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { hashPIN, verifyPIN } from '../utils/encryption';
import { useData } from '../contexts/DataContext';
import { getSupabaseClient } from '../utils/supabase';

type OnboardingStage = 'face_id_prompt' | 'pin_setup' | 'pin_entry' | null;

export default function AuthScreen() {
  const router = useRouter();
  const { isAuthenticated } = useData();
  const [stage, setStage] = useState<OnboardingStage>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isConfirmingPIN, setIsConfirmingPIN] = useState(false);
  const [storedPinHash, setStoredPinHash] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isBiometricInProgress, setIsBiometricInProgress] = useState(false);
  const [hasCheckedSetup, setHasCheckedSetup] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(false);

  // Check if user is authenticated and has PIN set up
  useEffect(() => {
    if (!hasCheckedSetup && !isCheckingSetup) {
      checkSetupStatus();
    }
  }, []);

  const checkSetupStatus = async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingSetup) {
      console.log('⏭️ Setup check already in progress, skipping...');
      return;
    }
    
    setIsCheckingSetup(true);
    
    try {
      // Use isAuthenticated from DataContext instead of calling getSession()
      // This avoids issues with reinitialized Supabase client
      console.log('🔍 Verifying authentication status...');
      console.log('📡 isAuthenticated from context:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to sign-up');
        router.replace('/');
        return;
      }
      
      console.log('✅ Session verified');

      // Check biometric availability
      console.log('🔍 Checking biometric hardware...');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('📱 Biometric available:', hasHardware && isEnrolled);
      setBiometricAvailable(hasHardware && isEnrolled);

      // Check if PIN is already set up
      console.log('🔍 Checking for existing PIN in SecureStore...');
      const pinHash = await SecureStore.getItemAsync('regent_pin_hash');
      console.log('🔑 PIN hash check result:', pinHash ? `EXISTS (${pinHash.substring(0, 20)}...)` : 'NOT FOUND');
      setStoredPinHash(pinHash);
      
      if (!pinHash) {
        // NEW USER: Onboarding flow
        console.log('📝 New user - starting onboarding (no PIN found)');
        if (hasHardware && isEnrolled) {
          // Show Face ID prompt first
          console.log('🎯 Setting stage to: face_id_prompt');
          setStage('face_id_prompt');
        } else {
          // No biometric available, go straight to PIN setup
          console.log('🎯 Setting stage to: pin_setup');
          setStage('pin_setup');
        }
      } else {
        // RETURNING USER: Authentication flow
        console.log('✅ Returning user - authenticating (PIN found)');
        console.log('🎯 Setting stage to: pin_entry');
        setStage('pin_entry');
        // Auto-trigger biometric if available
        if (hasHardware && isEnrolled) {
          handleBiometricAuth();
        }
      }
      
      console.log('✅ Setup check completed');
      setHasCheckedSetup(true);
    } catch (err) {
      console.error('❌ Error checking setup status:', err);
      console.error('❌ Error details:', JSON.stringify(err));
      // Set to PIN setup as fallback
      console.log('⚠️ Fallback: Setting stage to pin_setup due to error');
      setStage('pin_setup');
      setHasCheckedSetup(true);
    } finally {
      setIsCheckingSetup(false);
    }
  };

  const handleBiometricAuth = async () => {
    // Prevent multiple simultaneous biometric auth attempts
    if (isBiometricInProgress) {
      console.log('⏭️ Biometric auth already in progress, skipping...');
      return;
    }

    try {
      setIsBiometricInProgress(true);
      console.log('🔐 Attempting biometric authentication...');

      // Attempt biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Regent',
        cancelLabel: 'Use PIN instead',
        disableDeviceFallback: true,
      });

      console.log('Auth result:', result);

      if (result.success) {
        console.log('✅ Biometric auth successful');
        router.replace('/home');
      } else {
        console.log('❌ Biometric auth failed/cancelled');
        // User will use PIN instead (already showing)
      }
    } catch (err) {
      console.error('Biometric auth error:', err);
      // Fallback to PIN (already showing)
    } finally {
      setIsBiometricInProgress(false);
    }
  };

  const handleEnableFaceID = async () => {
    if (isBiometricInProgress) return;

    try {
      setIsBiometricInProgress(true);
      console.log('🔐 Requesting biometric permission...');

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Face ID to quickly access Regent',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });

      if (result.success) {
        console.log('✅ Face ID enabled successfully');
        Alert.alert('Face ID Enabled', 'You can now use Face ID to access Regent.');
      }
    } catch (err) {
      console.error('Face ID setup error:', err);
    } finally {
      setIsBiometricInProgress(false);
      // Always proceed to PIN setup (mandatory)
      setStage('pin_setup');
    }
  };

  const handleSkipFaceID = () => {
    console.log('⏭️ User skipped Face ID setup');
    setStage('pin_setup');
  };

  const handlePINDigit = (digit: string) => {
    const isPINSetup = stage === 'pin_setup';
    
    if (isConfirmingPIN) {
      // Confirming PIN (first-time setup)
      if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + digit;
        setConfirmPin(newConfirmPin);
        setError('');

        if (newConfirmPin.length === 4) {
          validatePINSetup(pin, newConfirmPin);
        }
      }
    } else {
      // Entering PIN (first-time setup or login)
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        setError('');

        if (newPin.length === 4) {
          if (isPINSetup) {
            // First time - move to confirm step
            setIsConfirmingPIN(true);
          } else {
            // Login - validate against stored hash
            validatePIN(newPin);
          }
        }
      }
    }
  };

  const handlePINDelete = () => {
    if (isConfirmingPIN) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
    setError('');
  };

  const validatePINSetup = async (originalPin: string, confirmedPin: string) => {
    try {
      if (originalPin !== confirmedPin) {
        setError('PINs do not match. Try again.');
        setPin('');
        setConfirmPin('');
        setIsConfirmingPIN(false);
        return;
      }

      // Hash and store PIN
      const pinHash = await hashPIN(originalPin);
      await SecureStore.setItemAsync('regent_pin_hash', pinHash);

      console.log('✅ PIN created successfully');
      
      // Navigate to home
      setTimeout(() => {
        router.replace('/home');
      }, 300);
    } catch (err) {
      console.error('❌ Error setting up PIN:', err);
      setError('Failed to set up PIN. Try again.');
      setPin('');
      setConfirmPin('');
      setIsConfirmingPIN(false);
    }
  };

  const validatePIN = async (pinToValidate: string) => {
    try {
      if (!storedPinHash) {
        setError('No PIN found. Please set up PIN.');
        return;
      }

      // Verify PIN against stored hash
      const isValid = await verifyPIN(pinToValidate, storedPinHash);

      if (isValid) {
        console.log('✅ PIN validated successfully');
        setTimeout(() => {
          router.replace('/home');
        }, 300);
      } else {
        setError('Incorrect PIN. Try again.');
        setPin('');
      }
    } catch (err) {
      console.error('❌ Error validating PIN:', err);
      setError('Failed to validate PIN. Try again.');
      setPin('');
    }
  };

  // ============================================
  // SCREEN: Loading (Checking Setup Status)
  // ============================================
  if (stage === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // SCREEN: Face ID Prompt (New User Onboarding)
  // ============================================
  if (stage === 'face_id_prompt') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.content}>
          {/* Face ID Icon */}
          <View style={styles.faceIDContainer}>
            <Svg width={120} height={120} viewBox="0 0 120 120">
              <Circle cx="60" cy="60" r="50" stroke={Colors.primary} strokeWidth="2" fill="none" opacity={0.3} />
              <Circle cx="60" cy="60" r="35" stroke={Colors.primary} strokeWidth="2" fill="none" opacity={0.5} />
              <Circle cx="60" cy="60" r="8" fill={Colors.primary} />
            </Svg>
          </View>

          {/* Title */}
          <Text style={styles.title}>Secure Your Financial Data</Text>
          <Text style={styles.subtitle}>
            Enable Face ID for quick and secure access to your net worth
          </Text>

          {/* Enable Face ID Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEnableFaceID}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Enable Face ID</Text>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleSkipFaceID}
            activeOpacity={0.6}
          >
            <Text style={styles.linkText}>Set up later</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // SCREEN: PIN Setup/Entry
  // ============================================
  if (stage === 'pin_setup' || stage === 'pin_entry') {
    const isPINSetup = stage === 'pin_setup';
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>
            {isPINSetup 
              ? (isConfirmingPIN ? 'Confirm PIN' : 'Create Backup PIN')
              : 'Enter PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {isPINSetup
              ? (isConfirmingPIN ? 'Re-enter your 4-digit PIN' : 'Required for data encryption and backup')
              : 'Enter your 4-digit PIN to continue'}
          </Text>

          {/* PIN Dots */}
          <View style={styles.pinDotsContainer}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < (isConfirmingPIN ? confirmPin.length : pin.length) && styles.pinDotFilled,
                ]}
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Number Pad */}
          <View style={styles.keypad}>
            <View style={styles.keypadRow}>
              {[1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handlePINDigit(num.toString())}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              {[4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handlePINDigit(num.toString())}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              {[7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handlePINDigit(num.toString())}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              <View style={styles.keypadButton} />
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => handlePINDigit('0')}
                activeOpacity={0.6}
              >
                <Text style={styles.keypadButtonText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={handlePINDelete}
                activeOpacity={0.6}
              >
                <Text style={styles.keypadButtonTextDelete}>←</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back to Face ID (only show for returning users with biometric) */}
          {!isPINSetup && biometricAvailable && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setPin('');
                setError('');
                handleBiometricAuth();
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.linkText}>Use Face ID instead</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Fallback (should never reach here)
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  
  // Face ID Screen
  faceIDContainer: {
    marginBottom: Spacing['2xl'],
  },
  
  // Text
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    maxWidth: 280,
  },
  
  // Primary Button
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    ...Typography.button,
    fontSize: 17,
    color: Colors.white,
  },
  
  // Link Button
  linkButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: 16,
    color: Colors.mutedForeground,
    fontWeight: '500',
  },
  
  // Loading
  loadingText: {
    fontSize: 16,
    color: Colors.mutedForeground,
    marginTop: Spacing.lg,
  },
  
  // PIN Entry
  pinDotsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: Spacing['2xl'],
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  
  // Error
  errorText: {
    fontSize: 14,
    color: Colors.destructive,
    marginBottom: Spacing.md,
  },
  
  // Keypad
  keypad: {
    width: '100%',
    maxWidth: 300,
    marginBottom: Spacing.xl,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  keypadButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.foreground,
  },
  keypadButtonTextDelete: {
    fontSize: 28,
    fontWeight: '400',
    color: Colors.mutedForeground,
  },
});
