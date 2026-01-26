import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Plus } from 'lucide-react-native';
import { Colors, Spacing } from '../constants';
import { BorderRadius } from '../constants/Layout';
import { useData } from '../contexts/DataContext';
import { useModals } from '../contexts/ModalContext';
import NetWorthCard from '../components/NetWorthCard';
import AssetsCard from '../components/AssetsCard';
import LiabilitiesCard from '../components/LiabilitiesCard';
import ShareInviteCard from '../components/ShareInviteCard';
import { PerformanceChart } from '../components/PerformanceChart';
import { LinearGradient } from 'expo-linear-gradient';
import { getSupabaseClient } from '../utils/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const { user, supabaseUser, assets, liabilities, netWorth, primaryCurrency, isLoading, updateAsset, lastDataSync, updateLastDataSync, snapshots } = useData();
  const { openAddAssetFlow, openAddLiabilityFlow } = useModals();
  
  const [refreshing, setRefreshing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Refresh portfolio prices (pull-to-refresh)
  const refreshPortfolioPrices = async () => {
    console.log('🔄 Pull-to-refresh: Starting price refresh...');
    setRefreshing(true);

    try {
      // Get all investment assets (stocks, crypto, ETFs, commodities, legacy portfolio)
      const investmentAssets = assets.filter(a => 
        ['portfolio', 'stocks', 'crypto', 'etf', 'commodities'].includes(a.type)
      );
      
      if (investmentAssets.length === 0) {
        console.log('✅ No investments to refresh');
        setRefreshing(false);
        await updateLastDataSync();
        setAnimationKey(prev => prev + 1); // Trigger animation even with no investments
        return;
      }

      // Extract all unique symbols from all investments
      const allSymbols = new Set<string>();
      investmentAssets.forEach(investment => {
        investment.metadata?.holdings?.forEach(holding => {
          allSymbols.add(holding.symbol);
        });
      });

      const symbols = Array.from(allSymbols);
      console.log(`🔄 Fetching prices for ${symbols.length} symbols:`, symbols);

      // Fetch fresh prices from Supabase Edge Function
      const supabase = getSupabaseClient();
      const { data: prices, error } = await supabase.functions.invoke('fetch-asset-prices', {
        body: { symbols, forceRefresh: false }, // Use cache if fresh (< 1 hour)
      });

      if (error) throw error;

      console.log('✅ Prices fetched:', prices);

      // Update each investment with fresh prices
      for (const investment of investmentAssets) {
        const updatedHoldings = investment.metadata?.holdings?.map(holding => {
          const priceData = prices[holding.symbol];
          if (priceData && priceData.price) {
            return {
              ...holding,
              currentPrice: priceData.price,
              totalValue: holding.shares * priceData.price,
            };
          }
          return holding;
        });

        // Calculate new total value
        const newTotalValue = updatedHoldings?.reduce((sum, h) => sum + h.totalValue, 0) || 0;

        // Update the investment asset
        await updateAsset(investment.id, {
          value: newTotalValue,
          metadata: {
            ...investment.metadata,
            holdings: updatedHoldings,
            lastPriceUpdate: new Date().toISOString(),
          },
        });
      }

      // Update timestamp and trigger animation
      await updateLastDataSync();
      setAnimationKey(prev => prev + 1); // Trigger animation after price refresh
      console.log('✅ Pull-to-refresh: Complete!');

    } catch (error) {
      console.error('❌ Pull-to-refresh error:', error);
      // Don't show error alert - silently fail and use cached data
    } finally {
      setRefreshing(false);
    }
  };

  // Get user's full name from Supabase user metadata or local user
  const getUserFullName = (): string => {
    // Priority: Supabase user metadata (most reliable) → local user → fallback
    const fullName = 
      supabaseUser?.user_metadata?.full_name || 
      supabaseUser?.user_metadata?.name || 
      user?.name || 
      'User';
    return fullName;
  };

  // Get user's first name only
  const getUserFirstName = (): string => {
    const fullName = getUserFullName();
    return fullName.split(' ')[0];
  };

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

  /**
   * Format timestamp with hybrid relative/absolute time
   * < 1 min: "Updated just now"
   * 1-59 min: "Updated 15m ago"
   * 1-23 hours: "Updated 3h ago"
   * >= 24 hours: "Updated yesterday at 4:26 PM" or "Updated Jan 15 at 4:26 PM"
   */
  const getTimeAgo = () => {
    if (!lastDataSync) return 'Updated just now';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastDataSync.getTime()) / 1000);
    
    // Less than 1 minute
    if (diff < 60) return 'Updated just now';
    
    const minutes = Math.floor(diff / 60);
    
    // 1-59 minutes
    if (minutes < 60) {
      return minutes === 1 ? 'Updated 1m ago' : `Updated ${minutes}m ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    
    // 1-23 hours
    if (hours < 24) {
      return hours === 1 ? 'Updated 1h ago' : `Updated ${hours}h ago`;
    }
    
    // 24+ hours - show absolute time
    const syncDate = new Date(lastDataSync);
    const timeString = syncDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = syncDate.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Updated yesterday at ${timeString}`;
    }
    
    // Older than yesterday - show date
    const dateString = syncDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return `Updated ${dateString} at ${timeString}`;
  };

  // Calculate totals
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);

  // Check if empty state (no assets and no liabilities)
  const isEmpty = assets.length === 0 && liabilities.length === 0;

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
          {/* User Name - Formatted as "J. Rothschild" */}
          <Text style={styles.userName}>
            {formatDisplayName(getUserFullName())}
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
        
        {/* Dynamic Page Title - "Welcome, [FirstName]" when empty, "Overview" when has data */}
        <Text style={styles.pageTitle}>
          {isEmpty ? `Welcome, ${getUserFirstName()}` : 'Overview'}
        </Text>
        
        {/* Timestamp - Only show when NOT empty */}
        {!isEmpty && (
          <Text style={styles.timestamp}>{getTimeAgo()}</Text>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPortfolioPrices}
            tintColor={Colors.primary}
            title="Updating prices..."
            titleColor={Colors.mutedForeground}
          />
        }
      >
        {isEmpty ? (
          /* ===== EMPTY STATE - 100% Match to Web Prototype ===== */
          <View style={styles.emptyStateCard}>
            {/* Hero Image Section with Gradient Overlay */}
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1665399320433-803b7515621a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOWUMlMjBza3lsaW5lJTIwc3Vuc2V0JTIwZ29sZGVuJTIwaG91cnxlbnwxfHx8fDE3NjczOTE3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080' }}
              style={styles.heroSection}
              imageStyle={styles.heroImage}
            >
              {/* Dark gradient overlay for text readability */}
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)']}
                style={styles.heroGradient}
              />
              
              {/* Text content overlaid on image */}
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>
                  Let's build your financial picture
                </Text>
                <Text style={styles.heroSubtitle}>
                  Add your first asset to begin
                </Text>
              </View>
            </ImageBackground>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              {/* Primary CTA Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={openAddAssetFlow}
                activeOpacity={0.8}
              >
                <Plus size={20} color={Colors.background} strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Add Your First Asset</Text>
              </TouchableOpacity>

              {/* Helper text */}
              <Text style={styles.helperText}>
                Add accounts, investments, property, or cash
              </Text>
            </View>
          </View>
        ) : (
          /* ===== NORMAL STATE - Show all cards ===== */
          <>
            {/* Net Worth Card */}
            <View style={{ marginBottom: Spacing.lg }}>
              <NetWorthCard 
                key={animationKey}
                netWorth={netWorth} 
                currency={primaryCurrency}
                snapshots={snapshots}
              />
            </View>

            {/* Performance Chart - Position after Net Worth, before Share Invite */}
            <PerformanceChart
              snapshots={snapshots}
              currentNetWorth={netWorth}
              currency={primaryCurrency}
              onChartTouchStart={() => setScrollEnabled(false)}
              onChartTouchEnd={() => setScrollEnabled(true)}
            />

            {/* Share Invite Card - Positioned after Performance Chart */}
            {supabaseUser?.id && (
              <ShareInviteCard userId={supabaseUser.id} />
            )}

            {/* Assets Card */}
            <AssetsCard
              assets={assets}
              totalAssets={totalAssets}
              currency={primaryCurrency}
              onAddAsset={openAddAssetFlow}
              onNavigateToDetail={() => router.push('/assets-detail')}
            />

            {/* Liabilities Card */}
            <LiabilitiesCard
              liabilities={liabilities}
              totalLiabilities={totalLiabilities}
              currency={primaryCurrency}
              onAddLiability={openAddLiabilityFlow}
              onNavigateToDetail={() => router.push('/liabilities-detail')}
            />

            {/* Bottom Spacer */}
            <View style={{ height: Spacing['2xl'] }} />
          </>
        )}
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

  // ===== Empty State Styles (100% Match to Web Prototype) =====
  emptyStateCard: {
    backgroundColor: Colors.secondary, // Subtle background
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  // Hero Section (Image with gradient overlay)
  heroSection: {
    height: 200,
    justifyContent: 'flex-end',
    padding: Spacing.xl,
  },
  heroImage: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  heroTextContainer: {
    zIndex: 1,
    width: '100%',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.24, // -0.01em
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22.5, // 1.5 * 15
  },

  // CTA Section
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a', // Dark button (matches web)
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.background, // White text
  },
  helperText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginTop: 12,
    opacity: 0.9,
  },
});
