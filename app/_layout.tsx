import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';
import { RevenueCatProvider, useRevenueCatContext } from '../contexts/RevenueCatContext';

/**
 * Auth guard component
 * Redirects user based on authentication and subscription state
 * 
 * Flow:
 * 1. Not authenticated → Sign-up screen (/)
 * 2. Authenticated + no premium subscription → Paywall (/paywall)
 * 3. Authenticated + premium + no PIN → Auth screen (/auth)
 * 4. Authenticated + premium + has PIN → Home (/home)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useData();
  const { isPremium, isLoading: isLoadingSubscription } = useRevenueCatContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for data to load before making routing decisions
    // This prevents flash of sign-up screen when user is already authenticated
    if (isLoading || isLoadingSubscription) {
      console.log('⏳ AuthGuard waiting for data to load...', { isLoading, isLoadingSubscription });
      return;
    }

    const currentPath = segments.join('/') || 'index';
    
    // Public routes (no auth required)
    const publicRoutes = ['index', 'auth/callback'];
    const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));

    // Protected routes that require both auth AND premium subscription
    const protectedRoutes = ['home', 'settings', 'assets-detail', 'liabilities-detail'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.includes(route));

    console.log('🛡️ AuthGuard check:', { 
      currentPath, 
      isAuthenticated, 
      isPremium,
      isPublicRoute,
      isProtectedRoute,
      isLoading,
      isLoadingSubscription,
    });

    // STEP 1: Not authenticated → redirect to sign-up
    if (!isAuthenticated && !isPublicRoute) {
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
      return;
    }

    // STEP 2: Authenticated but on sign-up page → check subscription status
    if (isAuthenticated && currentPath === 'index') {
      if (!isPremium) {
        console.log('💳 Authenticated but no subscription, redirecting to paywall');
        router.replace('/paywall');
      } else {
        console.log('🔓 Authenticated with subscription, redirecting to auth');
        router.replace('/auth');
      }
      return;
    }

    // STEP 3: Authenticated but no premium subscription → redirect to paywall
    if (isAuthenticated && !isPremium && currentPath !== 'paywall' && !isPublicRoute) {
      console.log('💳 No premium subscription, redirecting to paywall');
      router.replace('/paywall');
      return;
    }

    // STEP 4: On paywall but already has premium → redirect to auth
    if (isAuthenticated && isPremium && currentPath === 'paywall') {
      console.log('✅ Premium subscription active, redirecting to auth');
      router.replace('/auth');
      return;
    }
  }, [isAuthenticated, isPremium, segments, isLoading, isLoadingSubscription]);

  // Show blank screen while loading to prevent flash
  if (isLoading || isLoadingSubscription) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Root layout with providers and auth guard
 * 
 * NOTE: Auth listener removed from here to eliminate dual-listener race condition
 * All auth state management now handled by DataContext (single source of truth)
 * Navigation is handled by AuthGuard based on isAuthenticated and isPremium state
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <RevenueCatProvider>
          <AuthGuard>
            <ModalProvider>
              <Slot />
            </ModalProvider>
          </AuthGuard>
        </RevenueCatProvider>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
