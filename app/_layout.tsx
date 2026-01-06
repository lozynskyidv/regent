import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from '../contexts/DataContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <Slot />
      </DataProvider>
    </GestureHandlerRootView>
  );
}
