import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants';

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignIn = (method: 'apple' | 'google' | 'email') => {
    console.log(`Sign in with ${method}`);
    // TODO: Implement real authentication
    // For now, navigate directly to Face ID screen
    router.push('/auth');
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
          <Text style={styles.logo}>Regent</Text>
          <Text style={styles.tagline}>
            Financial clarity for discerning professionals
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
              onPress={() => handleSignIn('apple')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <AppleIcon />
                <Text style={styles.buttonTextPrimary}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>

            {/* Google Sign In */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => handleSignIn('google')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <GoogleIcon />
                <Text style={styles.buttonTextSecondary}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            {/* Email Sign In */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => handleSignIn('email')}
              activeOpacity={0.8}
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
            onPress={() => handleSignIn('apple')}
            activeOpacity={0.6}
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
