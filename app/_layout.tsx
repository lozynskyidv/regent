import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from '../contexts/DataContext';
import { ModalProvider } from '../contexts/ModalContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <ModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              presentation: 'card',
            }}
          />
        </ModalProvider>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
