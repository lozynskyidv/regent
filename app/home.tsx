import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Colors, Spacing } from '../constants';
import { useData } from '../contexts/DataContext';
import { useModals } from '../contexts/ModalContext';
import NetWorthCard from '../components/NetWorthCard';
import AssetsCard from '../components/AssetsCard';
import LiabilitiesCard from '../components/LiabilitiesCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user, assets, liabilities, netWorth, isLoading } = useData();
  const { openAddAssetFlow, openAddLiabilityFlow } = useModals();
  
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update timestamp when data changes
  useEffect(() => {
    setLastUpdated(new Date());
  }, [assets, liabilities]);

  // Format display name as "J. Rothschild"
  const formatDisplayName = (fullName: string): string => {
    if (!fullName || !fullName.trim()) return 'User';
    
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstInitial = firstName.charAt(0).toUpperCase();
    
    return `${firstInitial}. ${lastName}`;
  };

  // Get time ago text
  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000 / 60);
    if (diff < 1) return 'just now';
    if (diff === 1) return '1m ago';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours === 1) return '1h ago';
    return `${hours}h ago`;
  };

  // Calculate totals
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          {/* User Name */}
          <Text style={styles.userName}>
            {formatDisplayName(user?.name || 'Test User')}
          </Text>
          
          {/* Settings Icon */}
          <TouchableOpacity 
            style={styles.settingsButton}
            activeOpacity={0.6}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color={Colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        {/* Page Title */}
        <Text style={styles.pageTitle}>Overview</Text>
        
        {/* Timestamp */}
        <Text style={styles.timestamp}>Updated {getTimeAgo()}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Net Worth Card */}
        <View style={{ marginBottom: Spacing.lg }}>
          <NetWorthCard 
            netWorth={netWorth} 
            currency={user?.primaryCurrency || 'GBP'} 
          />
        </View>

        {/* Assets Card */}
        <AssetsCard
          assets={assets}
          totalAssets={totalAssets}
          currency={user?.primaryCurrency || 'GBP'}
          onAddAsset={openAddAssetFlow}
          onNavigateToDetail={() => router.push('/assets-detail')}
        />

        {/* Liabilities Card */}
        <LiabilitiesCard
          liabilities={liabilities}
          totalLiabilities={totalLiabilities}
          currency={user?.primaryCurrency || 'GBP'}
          onAddLiability={openAddLiabilityFlow}
          onNavigateToDetail={() => router.push('/liabilities-detail')}
        />

        {/* Bottom Spacer */}
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mutedForeground,
    letterSpacing: 0.42, // 0.03em
  },
  settingsButton: {
    padding: 6,
    marginRight: -6,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: Colors.foreground,
    letterSpacing: -0.64,
    marginTop: Spacing.xs,
  },
  timestamp: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md, // 16px between Assets/Liabilities
  },
});
