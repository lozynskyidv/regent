import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function AuthScreen() {
  const router = useRouter();
  const [showPIN, setShowPIN] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleFaceID = async () => {
    try {
      // Check if device supports biometrics
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setShowPIN(true);
        return;
      }

      // Attempt Face ID authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Regent',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Navigate to home screen
        router.replace('/home');
      } else {
        setShowPIN(true);
      }
    } catch (err) {
      console.error('Face ID error:', err);
      setShowPIN(true);
    }
  };

  const handlePINDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');

      // Auto-validate when 4 digits entered
      if (newPin.length === 4) {
        validatePIN(newPin);
      }
    }
  };

  const handlePINDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const validatePIN = (pinToValidate: string) => {
    // TODO: Validate against stored PIN hash in SecureStore
    // For now, accept any 4-digit PIN for testing
    console.log('PIN entered:', pinToValidate);
    
    // Mock validation - in production, check against SecureStore hash
    // For demo, any PIN works
    setTimeout(() => {
      router.replace('/home');
    }, 300);
  };

  if (showPIN) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Enter PIN</Text>
          <Text style={styles.subtitle}>Enter your 4-digit PIN to continue</Text>

          {/* PIN Dots */}
          <View style={styles.pinDotsContainer}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < pin.length && styles.pinDotFilled,
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

          {/* Back to Face ID */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              setShowPIN(false);
              setPin('');
              setError('');
            }}
            activeOpacity={0.6}
          >
            <Text style={styles.linkText}>Use Face ID instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Face ID Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Face ID Icon */}
        <View style={styles.faceIDContainer}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            {/* Outer circle */}
            <Circle
              cx="60"
              cy="60"
              r="50"
              stroke={Colors.primary}
              strokeWidth="2"
              fill="none"
              opacity={0.3}
            />
            {/* Middle circle */}
            <Circle
              cx="60"
              cy="60"
              r="35"
              stroke={Colors.primary}
              strokeWidth="2"
              fill="none"
              opacity={0.5}
            />
            {/* Inner dot */}
            <Circle
              cx="60"
              cy="60"
              r="8"
              fill={Colors.primary}
            />
          </Svg>
        </View>

        {/* Title */}
        <Text style={styles.title}>Use Face ID to access</Text>
        <Text style={styles.subtitle}>Confirm your identity to view your data</Text>

        {/* Face ID Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleFaceID}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Authenticate</Text>
        </TouchableOpacity>

        {/* PIN Fallback */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setShowPIN(true)}
          activeOpacity={0.6}
        >
          <Text style={styles.linkText}>Use PIN instead</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
