import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';

/**
 * Auth guard component
 * Redirects user based on authentication and subscription state
 * 
 * Flow:
 * 1. Not authenticated → Sign-up screen (/)
 * 2. Authenticated + hasn't started trial → Paywall (/paywall)
 * 3. Authenticated + started trial + no PIN → Auth screen (/auth)
 * 4. Authenticated + started trial + has PIN → Home (/home)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasStartedTrial, isLoading } = useData();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for data to load before making routing decisions
    // This prevents flash of sign-up screen when user is already authenticated
    if (isLoading) {
      console.log('⏳ AuthGuard waiting for data to load...');
      return;
    }

    const currentPath = segments.join('/') || 'index';
    
    // Public routes (no auth required)
    const publicRoutes = ['index', 'auth/callback'];
    const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));

    // Protected routes that require both auth AND trial started
    const protectedRoutes = ['home', 'settings', 'assets-detail', 'liabilities-detail'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.includes(route));

    console.log('🛡️ AuthGuard check:', { 
      currentPath, 
      isAuthenticated, 
      hasStartedTrial,
      isPublicRoute,
      isProtectedRoute,
      isLoading 
    });

    // STEP 1: Not authenticated → redirect to sign-up
    if (!isAuthenticated && !isPublicRoute) {
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
      return;
    }

    // STEP 2: Authenticated but on sign-up page → check subscription status
    if (isAuthenticated && currentPath === 'index') {
      if (!hasStartedTrial) {
        console.log('💳 Authenticated but no trial, redirecting to paywall');
        router.replace('/paywall');
      } else {
        console.log('🔓 Authenticated with trial, redirecting to auth');
        router.replace('/auth');
      }
      return;
    }

    // STEP 3: Authenticated but hasn't started trial → redirect to paywall
    if (isAuthenticated && !hasStartedTrial && currentPath !== 'paywall' && !isPublicRoute) {
      console.log('💳 No trial started, redirecting to paywall');
      router.replace('/paywall');
      return;
    }

    // STEP 4: On paywall but already started trial → redirect to auth
    if (isAuthenticated && hasStartedTrial && currentPath === 'paywall') {
      console.log('✅ Trial already started, redirecting to auth');
      router.replace('/auth');
      return;
    }
  }, [isAuthenticated, hasStartedTrial, segments, isLoading]);

  // Show blank screen while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Root layout with providers and auth guard
 * 
 * NOTE: Auth listener removed from here to eliminate dual-listener race condition
 * All auth state management now handled by DataContext (single source of truth)
 * Navigation is handled by AuthGuard based on isAuthenticated state
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
