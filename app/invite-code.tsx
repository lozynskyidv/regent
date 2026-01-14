import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { getSupabaseClient } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * INVITE CODE ENTRY SCREEN
 * 
 * First screen after app launch (before signup)
 * Users enter their exclusive invite code (e.g., RGNT-A1B2C3)
 * Validates code via Supabase Edge Function before allowing signup
 * 
 * Flow: Invite Code → Sign Up → Face ID → Home
 */
export default function InviteCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleCodeChange = (text: string) => {
    // Auto-uppercase and remove spaces
    const formatted = text.toUpperCase().replace(/\s/g, '');
    setCode(formatted);
    setError(''); // Clear error on input
  };

  const validateInviteCode = async () => {
    if (!code.trim()) {
      setError('Please enter an invite code');
      return;
    }

    // Basic format check (RGNT-XXXXXX)
    const codeRegex = /^RGNT-[A-Z0-9]{6}$/;
    if (!codeRegex.test(code)) {
      setError('Invalid format. Expected: RGNT-XXXXXX');
      return;
    }

    try {
      setIsValidating(true);
      setError('');
      Keyboard.dismiss();

      console.log('🔍 Validating invite code:', code);

      const supabase = getSupabaseClient();
      
      // Call Edge Function to validate code
      const { data, error: functionError } = await supabase.functions.invoke('validate-invite', {
        body: { code }
      });

      // Edge Function returns error responses with proper messages
      // Check data first (it may contain error info even when functionError exists)
      if (!data?.valid) {
        const errorMessage = data?.error || 'Invalid invite code. Please try again.';
        console.log('❌ Invalid code:', errorMessage);
        setError(errorMessage);
        return;
      }

      // If we have a function error but no data, it's a network/connection issue
      if (functionError) {
        console.error('❌ Connection error:', functionError);
        setError('Unable to connect. Please check your internet connection.');
        return;
      }

      // Code is valid! Store it for use during signup
      console.log('✅ Code is valid:', data.code);
      await AsyncStorage.setItem('@regent_invite_code_id', data.code_id);
      await AsyncStorage.setItem('@regent_invite_code', data.code);

      // Navigate to sign-up screen
      router.replace('/');
      
    } catch (err) {
      console.error('❌ Validation error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleWaitlist = () => {
    Alert.alert(
      'Join Waitlist',
      'Enter your email to be notified when new invites are available.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            // TODO: Implement waitlist modal
            Alert.alert('Coming Soon', 'Waitlist feature will be available soon.');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Regent</Text>
        <Text style={styles.descriptor}>Private wealth tracking</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter your invite</Text>
          <Text style={styles.subtitle}>
            Track your complete financial picture.{'\n'}
            Available by invitation only.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Label */}
          <Text style={styles.label}>INVITE CODE</Text>

          {/* Input */}
          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : null,
              isValidating ? styles.inputDisabled : null
            ]}
            value={code}
            onChangeText={handleCodeChange}
            placeholder="RGNT-XXXXXX"
            placeholderTextColor={Colors.mutedForeground}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            editable={!isValidating}
            maxLength={11} // RGNT-XXXXXX = 11 chars
            textAlign="center"
            returnKeyType="done"
            onSubmitEditing={validateInviteCode}
          />

          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!code.trim() || isValidating) && styles.buttonDisabled
            ]}
            onPress={validateInviteCode}
            disabled={!code.trim() || isValidating}
            activeOpacity={0.8}
          >
            {isValidating ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Waitlist Link */}
          <TouchableOpacity
            style={styles.waitlistButton}
            onPress={handleWaitlist}
            activeOpacity={0.6}
            disabled={isValidating}
          >
            <Text style={styles.waitlistText}>
              Don't have a code?{' '}
              <Text style={styles.waitlistTextBold}>Join waitlist</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <Text style={styles.footerText}>
          Regent is invite-only during private beta
        </Text>
      </View>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    marginBottom: Spacing['3xl'],
  },
  logo: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.5,
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  descriptor: {
    fontSize: 15,
    color: Colors.mutedForeground,
    lineHeight: 21,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleContainer: {
    marginBottom: Spacing['3xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    letterSpacing: -0.8,
    color: Colors.foreground,
    lineHeight: 37,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.mutedForeground,
    lineHeight: 25,
  },
  
  // Form
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.foreground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  input: {
    height: 64,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: Colors.foreground,
    paddingHorizontal: Spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  
  // Button
  button: {
    height: 64,
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.button,
    fontSize: 17,
    color: Colors.white,
  },
  
  // Waitlist
  waitlistButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  waitlistText: {
    fontSize: 15,
    color: Colors.mutedForeground,
    fontWeight: '500',
  },
  waitlistTextBold: {
    color: Colors.foreground,
  },
  
  // Footer
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.mutedForeground,
    opacity: 0.7,
    textAlign: 'center',
  },
});
