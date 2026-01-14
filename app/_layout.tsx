import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Auth guard component
 * Redirects user based on authentication and invite validation state
 * 
 * NEW FLOW (Invite-Only):
 * 1. No invite code validated → Invite code screen (/invite-code)
 * 2. Invite validated + not authenticated → Sign-up screen (/)
 * 3. Authenticated + no PIN → Auth screen (/auth)
 * 4. Authenticated + has PIN → Home (/home)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useData();
  const segments = useSegments();
  const router = useRouter();
  const [hasValidatedInvite, setHasValidatedInvite] = useState<boolean | null>(null);

  // Check if user has validated an invite code
  useEffect(() => {
    const checkInviteValidation = async () => {
      try {
        const inviteCode = await AsyncStorage.getItem('@regent_invite_code');
        setHasValidatedInvite(!!inviteCode);
        console.log('🎟️ Invite validation check:', { hasValidatedInvite: !!inviteCode });
      } catch (err) {
        console.error('❌ Error checking invite validation:', err);
        setHasValidatedInvite(false);
      }
    };

    checkInviteValidation();
  }, [segments]); // Re-check when route changes

  useEffect(() => {
    // Wait for data to load before making routing decisions
    if (isLoading || hasValidatedInvite === null) {
      console.log('⏳ AuthGuard waiting for data to load...', { isLoading, hasValidatedInvite });
      return;
    }

    const currentPath = segments.join('/') || 'index';
    
    // Public routes (no auth required)
    const publicRoutes = ['index', 'invite-code', 'auth/callback'];
    const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));

    // Protected routes that require authentication
    const protectedRoutes = ['home', 'settings', 'assets-detail', 'liabilities-detail'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.includes(route));

    console.log('🛡️ AuthGuard check:', { 
      currentPath, 
      isAuthenticated,
      hasValidatedInvite,
      isPublicRoute,
      isProtectedRoute,
      isLoading,
    });

    // STEP 1: No invite validated AND not authenticated → redirect to invite code screen
    // (Authenticated users have already used their invite, so skip this check)
    if (!hasValidatedInvite && !isAuthenticated && currentPath !== 'invite-code') {
      console.log('🎟️ No invite validated, redirecting to invite code screen');
      router.replace('/invite-code');
      return;
    }

    // STEP 2: Has invite but not authenticated → allow sign-up
    if (hasValidatedInvite && !isAuthenticated && !isPublicRoute) {
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
      return;
    }

    // STEP 3: Authenticated but on sign-up page → redirect to auth
    if (isAuthenticated && currentPath === 'index') {
      console.log('🔓 Authenticated, redirecting to auth');
      router.replace('/auth');
      return;
    }

    // STEP 4: Not authenticated but trying to access protected route → redirect to sign-up
    if (!isAuthenticated && isProtectedRoute) {
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
      return;
    }
  }, [isAuthenticated, hasValidatedInvite, segments, isLoading]);

  // Show blank screen while loading to prevent flash
  if (isLoading || hasValidatedInvite === null) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Root layout with providers and auth guard
 * 
 * NOTE: Removed RevenueCatProvider - app is now invite-only (no subscription)
 * All auth state management handled by DataContext (single source of truth)
 * Navigation is handled by AuthGuard based on isAuthenticated and invite validation
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <AuthGuard>
          <ModalProvider>
            <Slot />
          </ModalProvider>
        </AuthGuard>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
