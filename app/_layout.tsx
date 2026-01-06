import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';
import { supabase } from '../utils/supabase';

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
 */
export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Handle OAuth success only (SIGNED_IN event)
    // SIGNED_OUT is handled by AuthGuard automatically
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ OAuth success, navigating to auth screen');
          router.replace('/auth');
        }
        // Note: SIGNED_OUT navigation handled by AuthGuard
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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
