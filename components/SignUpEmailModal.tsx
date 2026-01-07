/**
 * Sign Up with Email Modal
 * Email/password registration with name input
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { getSupabaseClient } from '../utils/supabase';
import { makeRedirectUri } from 'expo-auth-session';

interface SignUpEmailModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpEmailModal({ visible, onClose, onSwitchToSignIn }: SignUpEmailModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectUri = makeRedirectUri({
    path: 'auth/callback',
  });

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('📧 Starting email sign-up...');
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
          },
          // DEVELOPMENT: Email verification disabled for Expo Go testing
          // Re-enable this in production by removing emailConfirm: false
          emailRedirectTo: redirectUri,
        },
      });

      if (error) {
        console.error('❌ Sign-up error:', error);
        
        // Handle specific errors
        if (error.message.includes('already registered')) {
          Alert.alert(
            'Account Exists',
            'This email is already registered. Please sign in instead.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign In', onPress: () => {
                handleClose();
                onSwitchToSignIn();
              }},
            ]
          );
        } else {
          Alert.alert('Sign Up Failed', error.message);
        }
        return;
      }

      console.log('✅ Sign-up successful!');
      console.log('👤 User created:', data.user?.email);

      // Check if email confirmation is required
      if (data.user && !data.user.confirmed_at) {
        console.log('📧 Email verification required');
        // Show success message
        Alert.alert(
          'Check Your Email',
          `We've sent a verification link to ${email}. Please check your email and click the link to verify your account.`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                handleClose();
              }
            }
          ]
        );
      } else {
        console.log('✅ Email auto-confirmed (verification disabled)');
        // Auto-confirmed - user can sign in immediately
        handleClose();
        // Small delay to let auth state settle
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (err) {
      console.error('❌ Sign-up error:', err);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={Colors.foreground} />
              </TouchableOpacity>
              <Text style={styles.title}>Create Account</Text>
              <View style={styles.closeButton} />
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your full name"
                    placeholderTextColor={Colors.mutedForeground}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.mutedForeground}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 8 characters"
                    placeholderTextColor={Colors.mutedForeground}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password-new"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.mutedForeground} />
                    ) : (
                      <Eye size={20} color={Colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <TouchableOpacity
                style={styles.switchLink}
                onPress={() => {
                  handleClose();
                  onSwitchToSignIn();
                }}
                disabled={isSubmitting}
              >
                <Text style={styles.switchLinkText}>
                  Already have an account? <Text style={styles.switchLinkBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.foreground,
  },

  // Form
  form: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.label,
    color: Colors.foreground,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },

  // Submit Button
  submitButton: {
    backgroundColor: Colors.black,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.button,
    fontSize: 17,
    color: Colors.white,
  },

  // Switch Link
  switchLink: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  switchLinkText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  switchLinkBold: {
    fontWeight: '600',
    color: Colors.foreground,
  },
});
