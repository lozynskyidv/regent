import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';

/**
 * Auth guard component
 * Redirects user based on authentication state
 * 
 * AUTH FLOW (£49/year subscription):
 * 1. Not authenticated → Sign-up screen (/)
 * 2. Authenticated + no PIN → Auth screen (/auth)
 * 3. Authenticated + has PIN → Paywall (if trial expired) or Home (/home)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useData();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for data to load before making routing decisions
    if (isLoading) {
      console.log('⏳ AuthGuard waiting for data to load...');
      return;
    }

    const currentPath = segments.join('/') || 'index';
    
    // Public routes (no auth required)
    const publicRoutes = ['index', 'auth/callback'];
    const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));

    // Protected routes that require authentication
    const protectedRoutes = ['home', 'settings', 'assets-detail', 'liabilities-detail', 'paywall'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.includes(route));

    console.log('🛡️ AuthGuard check:', { 
      currentPath, 
      isAuthenticated,
      isPublicRoute,
      isProtectedRoute,
      isLoading,
    });

    // STEP 1: Authenticated but on sign-up page → redirect to auth
    if (isAuthenticated && currentPath === 'index') {
      console.log('🔓 Authenticated, redirecting to auth');
      router.replace('/auth');
      return;
    }

    // STEP 2: Not authenticated but trying to access protected route → redirect to sign-up
    if (!isAuthenticated && isProtectedRoute) {
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
      return;
    }
  }, [isAuthenticated, segments, isLoading]);

  // Show blank screen while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Root layout with providers and auth guard
 * 
 * NOTE: £49/year subscription model with 7-day free trial
 * All auth state management handled by DataContext (single source of truth)
 * Navigation is handled by AuthGuard based on isAuthenticated state
 * Subscription state managed by RevenueCat (to be added)
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
