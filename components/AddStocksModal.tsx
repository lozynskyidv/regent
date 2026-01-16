/**
 * Add Stocks Modal
 * Track stock holdings with live price fetching
 * Supports: AAPL, MSFT, TSLA, GOOGL, NVDA, etc.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useData } from '../contexts/DataContext';
import { getSupabaseClient } from '../utils/supabase';
import SymbolSearchInput from './SymbolSearchInput';
import { POPULAR_STOCKS } from '../constants/PopularSymbols';

interface AddStocksModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Holding {
  id: string;
  ticker: string;
  quantity: string;
  currentPrice: number;
  isLoadingPrice: boolean;
  priceError?: string;
}

export default function AddStocksModal({ visible, onClose }: AddStocksModalProps) {
  const { addAsset, primaryCurrency } = useData();
  
  const [portfolioName, setPortfolioName] = useState('');
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', ticker: '', quantity: '', currentPrice: 0, isLoadingPrice: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setPortfolioName('');
    setHoldings([{ id: '1', ticker: '', quantity: '', currentPrice: 0, isLoadingPrice: false }]);
    onClose();
  };

  // Fetch price from Twelve Data via Supabase Edge Function
  const fetchPrice = async (ticker: string, holdingId: string) => {
    if (ticker.trim().length < 2) return;

    // Set loading state
    setHoldings(prev =>
      prev.map(h =>
        h.id === holdingId ? { ...h, isLoadingPrice: true, priceError: undefined } : h
      )
    );

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('fetch-asset-prices', {
        body: { symbols: [ticker.toUpperCase()], forceRefresh: true },
      });

      if (error) throw error;

      const priceData = data[ticker.toUpperCase()];
      if (priceData && priceData.price) {
        setHoldings(prev =>
          prev.map(h =>
            h.id === holdingId
              ? { ...h, currentPrice: priceData.price, isLoadingPrice: false, priceError: undefined }
              : h
          )
        );
      } else {
        throw new Error('Price not found');
      }
    } catch (error: any) {
      // Log as info, not error (invalid tickers are expected user behavior)
      console.log(`⚠️ Could not fetch price for ${ticker}:`, error.message);
      setHoldings(prev =>
        prev.map(h =>
          h.id === holdingId
            ? {
                ...h,
                isLoadingPrice: false,
                priceError: 'Price not found',
                currentPrice: 0,
              }
            : h
        )
      );
    }
  };

  // Debounced ticker change handler
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    holdings.forEach(holding => {
      // Only fetch if: ticker exists, not loading, no price yet, and no previous error
      if (holding.ticker.trim().length >= 2 && !holding.isLoadingPrice && holding.currentPrice === 0 && !holding.priceError) {
        const timer = setTimeout(() => {
          fetchPrice(holding.ticker, holding.id);
        }, 800); // 800ms debounce
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [holdings]);

  const handleTickerChange = (id: string, ticker: string) => {
    const formatted = ticker.toUpperCase().trim();
    setHoldings(prev =>
      prev.map(h =>
        h.id === id ? { ...h, ticker: formatted, currentPrice: 0, priceError: undefined } : h
      )
    );
  };

  const handleQuantityChange = (id: string, quantity: string) => {
    // Allow only numbers and decimal point
    const formatted = quantity.replace(/[^0-9.]/g, '');
    setHoldings(prev => prev.map(h => (h.id === id ? { ...h, quantity: formatted } : h)));
  };

  const addHolding = () => {
    setHoldings([
      ...holdings,
      {
        id: Date.now().toString(),
        ticker: '',
        quantity: '',
        currentPrice: 0,
        isLoadingPrice: false,
      },
    ]);
  };

  const removeHolding = (id: string) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter(h => h.id !== id));
    }
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, h) => {
      const qty = parseFloat(h.quantity) || 0;
      return total + qty * h.currentPrice;
    }, 0);
  };

  const handleSubmit = async () => {
    // Validation
    if (!portfolioName.trim()) {
      Alert.alert('Error', 'Please enter a name for your stocks');
      return;
    }

    const validHoldings = holdings.filter(
      h => h.ticker && parseFloat(h.quantity) > 0 && h.currentPrice > 0
    );

    if (validHoldings.length === 0) {
      Alert.alert('Error', 'Please add at least one valid stock with a ticker and quantity');
      return;
    }

    try {
      setIsSubmitting(true);

      const totalValue = calculateTotalValue();

      // Convert holdings to metadata format
      const holdingsMetadata = validHoldings.map(h => ({
        symbol: h.ticker,
        shares: parseFloat(h.quantity),
        currentPrice: h.currentPrice,
        totalValue: parseFloat(h.quantity) * h.currentPrice,
      }));

      await addAsset({
        name: portfolioName.trim(),
        type: 'stocks',
        value: totalValue,
        currency: 'USD', // Always USD for investments (API returns USD prices)
        metadata: {
          holdings: holdingsMetadata,
          holdingsCount: validHoldings.length,
          lastPriceUpdate: new Date().toISOString(),
        },
      });

      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add stocks. Please try again.');
      console.error('Add stocks error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrencySymbol = () => {
    switch (primaryCurrency) {
      case 'GBP':
        return '£';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return '£';
    }
  };

  const totalValue = calculateTotalValue();
  const isValid = portfolioName.trim() && holdings.some(h => h.ticker && parseFloat(h.quantity) > 0 && h.currentPrice > 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.6}>
              <X size={24} color={Colors.foreground} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Stocks</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form - Scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Portfolio Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={portfolioName}
                onChangeText={setPortfolioName}
                placeholder="e.g., Tech Stocks, Growth Portfolio"
                placeholderTextColor={Colors.mutedForeground}
                autoFocus
              />
            </View>

            {/* Holdings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stocks</Text>

              {holdings.map((holding, index) => (
                <View key={holding.id} style={styles.holdingCard}>
                  {/* Row 1: Ticker & Delete */}
                  <View style={styles.holdingRow}>
                    <View style={styles.holdingField}>
                      <Text style={styles.holdingLabel}>Ticker</Text>
                      <SymbolSearchInput
                        value={holding.ticker}
                        onChangeText={text => handleTickerChange(holding.id, text)}
                        placeholder="Search: AAPL, MSFT..."
                        symbols={POPULAR_STOCKS}
                      />
                    </View>

                    {holdings.length > 1 && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeHolding(holding.id)}
                        activeOpacity={0.6}
                      >
                        <Trash2 size={18} color={Colors.destructive} strokeWidth={2} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Row 2: Quantity */}
                  <View style={styles.holdingField}>
                    <Text style={styles.holdingLabel}>Shares</Text>
                    <TextInput
                      style={styles.holdingInput}
                      value={holding.quantity}
                      onChangeText={text => handleQuantityChange(holding.id, text)}
                      placeholder="100"
                      placeholderTextColor={Colors.mutedForeground}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  {/* Row 3: Price Display */}
                  {holding.isLoadingPrice ? (
                    <View style={styles.priceRow}>
                      <ActivityIndicator size="small" color={Colors.primary} />
                      <Text style={styles.priceLoading}>Fetching price...</Text>
                    </View>
                  ) : holding.priceError ? (
                    <Text style={styles.priceError}>{holding.priceError}</Text>
                  ) : holding.currentPrice > 0 ? (
                    <View style={styles.priceDisplay}>
                      <Text style={styles.priceLabel}>Current Price:</Text>
                      <Text style={styles.priceValue}>
                        $
                        {holding.currentPrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  ) : null}

                  {/* Row 4: Holding Value */}
                  {holding.currentPrice > 0 && parseFloat(holding.quantity) > 0 && (
                    <View style={styles.valueDisplay}>
                      <Text style={styles.valueLabel}>Value:</Text>
                      <Text style={styles.valueAmount}>
                        $
                        {(parseFloat(holding.quantity) * holding.currentPrice).toLocaleString(
                          'en-GB',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Add Holding Button */}
              <TouchableOpacity style={styles.addHoldingButton} onPress={addHolding} activeOpacity={0.7}>
                <Plus size={16} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.addHoldingText}>Add Stock</Text>
              </TouchableOpacity>
            </View>

            {/* Total Value Display */}
            {totalValue > 0 && (
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Value (USD)</Text>
                <Text style={styles.totalValue}>
                  $
                  {totalValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Supported Stocks</Text>
              <Text style={styles.infoText}>
                US stocks: AAPL, MSFT, TSLA, GOOGL, NVDA, AMZN, META, etc. Prices update via pull-to-refresh on home screen.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding Stocks...' : 'Add Stocks'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.foreground,
    letterSpacing: -0.17,
  },
  headerSpacer: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },

  // Form Fields
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 4,
  },
  input: {
    height: 56,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Holdings Section
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },
  holdingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    gap: Spacing.md,
  },
  holdingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  holdingField: {
    flex: 1,
    gap: Spacing.xs,
  },
  holdingLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.mutedForeground,
  },
  holdingInput: {
    height: 48,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priceLoading: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  priceError: {
    fontSize: 13,
    color: Colors.destructive,
  },
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
  },
  valueDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  valueLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.foreground,
  },
  valueAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  addHoldingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 48,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.background,
  },
  addHoldingText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primary,
  },

  // Total Value
  totalCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mutedForeground,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: -0.56,
  },

  // Info Box
  infoBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
  },

  // Submit Button
  submitButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
  },
});
