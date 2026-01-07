/**
 * Sign In with Email Modal
 * Email/password authentication
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
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { getSupabaseClient } from '../utils/supabase';

interface SignInEmailModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInEmailModal({ visible, onClose, onSwitchToSignUp }: SignInEmailModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
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
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('🔐 Starting email sign-in...');
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('❌ Sign-in error:', error);
        
        // Handle specific errors
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert(
            'Sign In Failed',
            'Invalid email or password. Please try again.'
          );
        } else if (error.message.includes('Email not confirmed')) {
          Alert.alert(
            'Email Not Verified',
            'Please check your email and click the verification link before signing in.'
          );
        } else if (error.message.includes('User not found')) {
          Alert.alert(
            'Account Not Found',
            'No account found with this email. Would you like to create one?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Up', onPress: () => {
                handleClose();
                onSwitchToSignUp();
              }},
            ]
          );
        } else {
          Alert.alert('Sign In Failed', error.message);
        }
        return;
      }

      console.log('✅ Sign-in successful!');
      console.log('👤 User:', data.user?.email);
      
      // Small delay to let auth state settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      handleClose();
      // AuthGuard in _layout.tsx will handle navigation

    } catch (err) {
      console.error('❌ Sign-in error:', err);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
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
              <Text style={styles.title}>Sign In</Text>
              <View style={styles.closeButton} />
            </View>

            {/* Form */}
            <View style={styles.form}>
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
                    placeholder="Your password"
                    placeholderTextColor={Colors.mutedForeground}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
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
                  <Text style={styles.submitButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={styles.switchLink}
                onPress={() => {
                  handleClose();
                  onSwitchToSignUp();
                }}
                disabled={isSubmitting}
              >
                <Text style={styles.switchLinkText}>
                  Don't have an account? <Text style={styles.switchLinkBold}>Sign Up</Text>
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
