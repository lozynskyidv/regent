import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Platform, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import Svg, { Path } from 'react-native-svg';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants';
import { getSupabaseClient } from '../utils/supabase';
import { useData } from '../contexts/DataContext';
import SignUpEmailModal from '../components/SignUpEmailModal';
import SignInEmailModal from '../components/SignInEmailModal';

// Required for Expo web browser
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthProcessing } = useData(); // Global auth lock
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  const [isSignUpEmailVisible, setIsSignUpEmailVisible] = useState(false);
  const [isSignInEmailVisible, setIsSignInEmailVisible] = useState(false);

  // Get the proper redirect URI for this platform (must be inside component to work correctly)
  // In dev: exp://localhost:8081/--/auth/callback
  // In production: worthview://auth/callback
  const redirectUri = makeRedirectUri({
    path: 'auth/callback',
  });

  // Log the redirect URI for debugging
  console.log('🔗 Redirect URI:', redirectUri);

  const handleGoogleSignIn = async () => {
    // Check if auth is already processing (e.g. sign out in progress)
    if (isAuthProcessing) {
      console.log('⏸️ Auth operation in progress, please wait...');
      Alert.alert('Please Wait', 'An authentication operation is in progress. Please try again in a moment.');
      return;
    }
    
    try {
      setIsLoadingGoogle(true);
      console.log('🔐 Starting Google OAuth...');
      console.log('🔗 Using redirect URI:', redirectUri);
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri, // Use Expo's proper redirect URI
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      // Open the OAuth URL in browser
      if (data?.url) {
        console.log('🌐 Opening browser for OAuth...');
        console.log('📍 OAuth URL:', data.url);
        
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri // Use the same redirect URI
        );
        
        console.log('📱 Browser result:', result);
        
        if (result.type === 'success' && result.url) {
          console.log('✅ Redirect URL:', result.url);
          
          // Parse the URL to extract tokens
          const url = new URL(result.url);
          
          // Check for tokens in URL params (Supabase returns them here)
          let access_token = url.searchParams.get('access_token');
          let refresh_token = url.searchParams.get('refresh_token');
          
          // If not in params, check hash fragment (alternative OAuth flow)
          if (!access_token && url.hash) {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            access_token = hashParams.get('access_token');
            refresh_token = hashParams.get('refresh_token');
          }
          
          if (access_token && refresh_token) {
            console.log('🔑 Setting session with tokens');
            console.log('📊 Token lengths:', { access: access_token.length, refresh: refresh_token.length });
            console.log('⏱️ Calling supabase.auth.setSession...');
            
            const setSessionStart = Date.now();
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            const setSessionDuration = Date.now() - setSessionStart;
            
            console.log('✅ setSession returned successfully!');
            console.log('⏱️ setSession took:', setSessionDuration, 'ms');
            console.log('🎯 Waiting for auth state to settle...');
            
            // Small delay to let auth listener complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('✅ Session set successfully! Auth flow complete.');
          } else {
            console.error('❌ No tokens found in redirect URL');
            console.error('URL params:', Array.from(url.searchParams.entries()));
            console.error('URL hash:', url.hash);
            throw new Error('No authentication tokens received');
          }
        } else if (result.type === 'cancel') {
          console.log('❌ User cancelled OAuth');
          Alert.alert('Cancelled', 'Sign in was cancelled.');
        } else {
          console.log('⚠️ Unexpected result:', result);
        }
      }
    } catch (err) {
      console.error('❌ Google sign-in error:', err);
      Alert.alert(
        'Sign In Failed',
        'Could not sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleAppleSignIn = async () => {
    // Check if auth is already processing (e.g. sign out in progress)
    if (isAuthProcessing) {
      console.log('⏸️ Auth operation in progress, please wait...');
      Alert.alert('Please Wait', 'An authentication operation is in progress. Please try again in a moment.');
      return;
    }
    
    try {
      setIsLoadingApple(true);
      console.log('🍎 Starting Native Apple Sign In...');
      
      // Use native Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      console.log('✅ Apple credential received');
      console.log('📊 Identity token length:', credential.identityToken?.length);
      
      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }
      
      // Sign in to Supabase with Apple identity token
      const supabase = getSupabaseClient();
      console.log('🔑 Signing in to Supabase with Apple token...');
      
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        // Nonce is optional for native iOS Apple Sign In
      });
      
      if (error) {
        console.error('❌ Supabase sign-in error:', error);
        console.error('📋 Error details:', JSON.stringify(error, null, 2));
        console.error('🔍 Error message:', error.message);
        console.error('🔍 Error status:', error.status);
        throw error;
      }
      
      console.log('✅ Supabase session created');
      console.log('👤 User ID:', data.user?.id);
      console.log('📧 Email:', data.user?.email);
      
      // Small delay to let auth listener complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Apple Sign In complete!');
      
    } catch (err: any) {
      console.error('❌ Apple sign-in error:', err);
      
      // Handle user cancellation gracefully
      if (err.code === 'ERR_REQUEST_CANCELED') {
        console.log('ℹ️ User cancelled Apple Sign In');
        return; // Don't show error alert for cancellation
      }
      
      // Provide more helpful error message
      const errorMsg = err.message || 'Could not sign in with Apple. Please try again.';
      Alert.alert(
        'Sign In Failed',
        errorMsg,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingApple(false);
    }
  };

  const handleEmailSignUp = () => {
    setIsSignUpEmailVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Hero Section with Cityscape */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1200&auto=format&fit=crop' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        {/* Gradient overlay */}
        <View style={styles.heroOverlay} />
        
        {/* Branding */}
        <View style={styles.heroContent}>
          <Text style={styles.logo}>WorthView</Text>
          <Text style={styles.tagline}>
            Everything you own and owe, in one place
          </Text>
        </View>
      </View>

      {/* Bottom Section with Sign-in Options */}
      <View style={styles.bottomSection}>
        <View style={styles.contentWrapper}>
          {/* Sign-in Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Apple Sign In (Primary) */}
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleAppleSignIn}
              activeOpacity={0.8}
              disabled={isLoadingGoogle || isLoadingApple || isAuthProcessing}
            >
              <View style={styles.buttonContent}>
                {isLoadingApple ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <AppleIcon />
                    <Text style={styles.buttonTextPrimary}>Continue with Apple</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Google Sign In */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              disabled={isLoadingGoogle || isLoadingApple || isAuthProcessing}
            >
              <View style={styles.buttonContent}>
                {isLoadingGoogle ? (
                  <ActivityIndicator color={Colors.foreground} />
                ) : (
                  <>
                    <GoogleIcon />
                    <Text style={styles.buttonTextSecondary}>Continue with Google</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Email Sign Up */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleEmailSignUp}
              activeOpacity={0.8}
              disabled={isLoadingGoogle || isLoadingApple || isAuthProcessing}
            >
              <View style={styles.buttonContent}>
                <EmailIcon />
                <Text style={styles.buttonTextSecondary}>Continue with Email</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Already have account link */}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsSignInEmailVisible(true)}
            activeOpacity={0.6}
            disabled={isLoadingGoogle || isLoadingApple || isAuthProcessing}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkTextBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Legal Text */}
        <View style={[styles.legalContainer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
          <Text style={styles.legalText}>
            <Text style={styles.legalLink}>Terms of Service</Text>
            {' • '}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>

      {/* Email Modals */}
      <SignUpEmailModal
        visible={isSignUpEmailVisible}
        onClose={() => setIsSignUpEmailVisible(false)}
        onSwitchToSignIn={() => setIsSignInEmailVisible(true)}
      />
      <SignInEmailModal
        visible={isSignInEmailVisible}
        onClose={() => setIsSignInEmailVisible(false)}
        onSwitchToSignUp={() => setIsSignUpEmailVisible(true)}
      />
    </View>
  );
}

// Apple Icon (SVG)
function AppleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.white}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </Svg>
  );
}

// Google Icon (SVG)
function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </Svg>
  );
}

// Email Icon (SVG)
function EmailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.foreground} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <Path d="M22 6l-10 7L2 6"/>
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section (extends behind status bar)
  heroContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)', // Darker for better text contrast
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logo: {
    fontSize: 40,
    fontWeight: '500',
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 25,
    letterSpacing: -0.2,
    maxWidth: 300,
  },
  
  // Bottom Section
  bottomSection: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  contentWrapper: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  
  // Buttons (ADDED SHADOWS)
  buttonsContainer: {
    width: '100%',
    gap: 14,
    marginBottom: Spacing.lg,
  },
  button: {
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.black,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3, // Android
  },
  buttonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1, // Android
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextPrimary: {
    ...Typography.button,
    fontSize: 17,
    color: Colors.white,
  },
  buttonTextSecondary: {
    ...Typography.button,
    fontSize: 17,
    color: Colors.foreground,
  },
  
  // Link
  linkContainer: {
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: 15,
    color: Colors.mutedForeground,
    fontWeight: '500',
  },
  linkTextBold: {
    color: Colors.foreground,
  },
  
  // Legal
  legalContainer: {
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.mutedForeground,
    opacity: 0.8,
    textAlign: 'center',
  },
  legalLink: {
    color: Colors.foreground,
  },
});
