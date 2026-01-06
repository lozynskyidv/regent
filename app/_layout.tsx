import { Slot } from 'expo-router';
import { DataProvider } from '../contexts/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <Slot />
    </DataProvider>
  );
}
