import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';

/**
 * Auth guard component
 * Redirects user based on authentication state
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useData();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const currentPath = segments.join('/') || 'index';
    
    // Public routes (no auth required)
    const publicRoutes = ['index', 'auth/callback'];
    const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));

    if (!isAuthenticated && !isPublicRoute) {
      // User not authenticated, redirect to sign-up
      console.log('🔒 Not authenticated, redirecting to sign-up');
      router.replace('/');
    } else if (isAuthenticated && currentPath === 'index') {
      // User authenticated but on sign-up page, redirect to auth (PIN/Face ID)
      console.log('🔓 Authenticated, redirecting to PIN/Face ID');
      router.replace('/auth');
    }
  }, [isAuthenticated, segments]);

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
