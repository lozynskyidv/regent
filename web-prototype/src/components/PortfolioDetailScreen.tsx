import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { SwipeableItem } from './SwipeableItem';
import { AddStockHoldingModal } from './AddStockHoldingModal';
import { ConfirmDialog } from './ConfirmDialog';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  change?: number; // percentage change
}

interface PortfolioDetailScreenProps {
  portfolioName: string;
  totalValue: number;
  holdings: Holding[];
  onBack: () => void;
  onUpdateHoldings?: (holdings: Holding[]) => void;
  currency?: 'GBP' | 'USD' | 'EUR';
}

function formatCurrency(value: number, currency: 'GBP' | 'USD' | 'EUR' = 'GBP'): string {
  // Use locale that matches currency to get clean symbol without prefix
  const locale = currency === 'USD' ? 'en-US' : 'en-GB';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatPrice(value: number, currency: 'GBP' | 'USD' | 'EUR' = 'GBP'): string {
  // Use locale that matches currency to get clean symbol without prefix
  const locale = currency === 'USD' ? 'en-US' : 'en-GB';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function PortfolioDetailScreen({ 
  portfolioName, 
  totalValue, 
  holdings: initialHoldings,
  onBack,
  onUpdateHoldings,
  currency = 'GBP'
}: PortfolioDetailScreenProps) {
  // Sanitize holdings only on initial mount
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    return initialHoldings.map(h => {
      const validShares = typeof h.shares === 'number' && !isNaN(h.shares) && h.shares > 0 ? h.shares : 0;
      const validPrice = typeof h.currentPrice === 'number' && !isNaN(h.currentPrice) && h.currentPrice > 0 ? h.currentPrice : 0;
      
      // If we have valid data, recalculate totalValue to fix any corruption
      if (validShares > 0 && validPrice > 0) {
        return {
          ...h,
          shares: validShares,
          currentPrice: validPrice,
          totalValue: validShares * validPrice
        };
      }
      
      // Return as-is if invalid (will be filtered in calculatedTotal)
      return h;
    }).filter(h => {
      // Only keep holdings with valid shares and price
      return typeof h.shares === 'number' && h.shares > 0 && 
             typeof h.currentPrice === 'number' && h.currentPrice > 0;
    });
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ index: number; name: string } | null>(null);

  const calculatedTotal = holdings.reduce((sum, h) => {
    const value = h.totalValue || 0;
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const handleAddHolding = (holding: { symbol: string; name: string; shares: number; currentPrice: number }) => {
    // Validate incoming data
    const validShares = typeof holding.shares === 'number' && !isNaN(holding.shares) && holding.shares > 0 ? holding.shares : 0;
    const validPrice = typeof holding.currentPrice === 'number' && !isNaN(holding.currentPrice) && holding.currentPrice > 0 ? holding.currentPrice : 0;
    const validTotalValue = validShares * validPrice;
    
    // Don't add if invalid data
    if (validShares === 0 || validPrice === 0) {
      console.error('Invalid holding data:', holding);
      return;
    }
    
    const newHolding: Holding = {
      symbol: holding.symbol,
      name: holding.name,
      shares: validShares,
      currentPrice: validPrice,
      totalValue: validTotalValue,
      change: 0
    };

    const updatedHoldings = editingHolding 
      ? holdings.map(h => h.symbol === editingHolding.symbol ? newHolding : h)
      : [...holdings, newHolding];

    setHoldings(updatedHoldings);
    if (onUpdateHoldings) {
      onUpdateHoldings(updatedHoldings);
    }
    setEditingHolding(null);
    setIsAddModalOpen(false);
  };

  const handleEditHolding = (holding: Holding) => {
    setEditingHolding(holding);
    setIsAddModalOpen(true);
  };

  const handleDeleteHolding = (index: number) => {
    const holding = holdings[index];
    setDeleteConfirm({ index, name: `${holding.symbol} - ${holding.name}` });
  };

  const confirmDelete = () => {
    if (deleteConfirm === null) return;

    const updatedHoldings = holdings.filter((_, i) => i !== deleteConfirm.index);
    setHoldings(updatedHoldings);
    if (onUpdateHoldings) {
      onUpdateHoldings(updatedHoldings);
    }
    setDeleteConfirm(null);
  };
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <div 
        className="px-6 border-b sticky top-0 bg-background z-10"
        style={{
          paddingTop: 'max(env(safe-area-inset-top) + 12px, 48px)',
          paddingBottom: '16px',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg transition-all active:scale-95 hover:bg-secondary"
            style={{ color: 'var(--foreground)' }}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          
          <button
            onClick={() => {
              setEditingHolding(null);
              setIsAddModalOpen(true);
            }}
            className="p-2 -mr-2 rounded-lg transition-all active:scale-95 hover:bg-secondary"
            style={{ color: 'var(--foreground)' }}
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        </div>

        <div>
          <p 
            className="mb-2"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              fontWeight: 500
            }}
          >
            {portfolioName}
          </p>
          <h1 
            style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)'
            }}
          >
            {formatCurrency(calculatedTotal, currency)}
          </h1>
          <p 
            className="mt-2"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)'
            }}
          >
            {holdings.length} {holdings.length === 1 ? 'holding' : 'holdings'}
          </p>
        </div>
      </div>

      {/* Holdings List */}
      <div 
        className="px-6 py-6"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom) + 48px, 48px)'
        }}
      >
        {holdings.length === 0 ? (
          <div className="text-center py-12">
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                marginBottom: '16px'
              }}
            >
              No holdings in this portfolio.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-xl transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--background)',
                fontSize: '0.9375rem',
                fontWeight: 500
              }}
            >
              Add Your First Stock
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {holdings.map((holding, index) => (
              <SwipeableItem
                key={`${holding.symbol}-${index}`}
                onDelete={() => handleDeleteHolding(index)}
                onEdit={() => handleEditHolding(holding)}
                showEdit={true}
              >
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--card)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 
                          style={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'var(--foreground)'
                          }}
                        >
                          {holding.symbol}
                        </h3>
                        {holding.change !== undefined && (
                          <div 
                            className="flex items-center gap-1 px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: holding.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            {holding.change >= 0 ? (
                              <TrendingUp size={12} style={{ color: 'rgb(34, 197, 94)' }} />
                            ) : (
                              <TrendingDown size={12} style={{ color: 'rgb(239, 68, 68)' }} />
                            )}
                            <span 
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: holding.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                              }}
                            >
                              {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <p 
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--muted-foreground)'
                        }}
                      >
                        {holding.name}
                      </p>
                    </div>

                    <p 
                      className="text-right"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'var(--foreground)'
                      }}
                    >
                      {formatCurrency(holding.totalValue, currency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p 
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--muted-foreground)',
                          marginBottom: '2px'
                        }}
                      >
                        Shares
                      </p>
                      <p 
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--foreground)'
                        }}
                      >
                        {holding.shares?.toLocaleString('en-GB') ?? '0'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p 
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--muted-foreground)',
                          marginBottom: '2px'
                        }}
                      >
                        Price
                      </p>
                      <p 
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'var(--foreground)'
                        }}
                      >
                        {formatPrice(holding.currentPrice ?? 0, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        )}

        {/* Live Data Indicator */}
        {holdings.length > 0 && (
          <div className="mt-6 text-center">
            <p 
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)'
              }}
            >
              Prices via Twelve Data • Updated in real-time
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddStockHoldingModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHolding(null);
        }}
        onAdd={handleAddHolding}
        initialData={editingHolding}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Holding?"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}