import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Holding {
  id: string;
  ticker: string;
  quantity: number;
  currentPrice: number;
}

interface AddManualPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (portfolio: { name: string; holdings: Holding[]; totalValue: number }) => void;
}

export function AddManualPortfolioModal({ isOpen, onClose, onAdd }: AddManualPortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState('');
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', ticker: '', quantity: 0, currentPrice: 0 }
  ]);

  // Mock function - in production would call Twelve Data API
  const fetchStockPrice = async (ticker: string): Promise<number> => {
    // Simulate API call with mock prices
    const mockPrices: { [key: string]: number } = {
      'AAPL': 150.00,
      'MSFT': 280.00,
      'GOOGL': 95.00,
      'AMZN': 120.00,
      'TSLA': 180.00,
      'VOO': 400.00,
      'VTI': 220.00,
      'VWRL': 80.00,
      'SPY': 410.00,
      'QQQ': 350.00
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockPrices[ticker.toUpperCase()] || 100.00;
  };

  const handleTickerChange = async (id: string, ticker: string) => {
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, ticker: ticker.toUpperCase() } : h
    ));

    // Fetch price when ticker is valid (2+ characters)
    if (ticker.trim().length >= 2) {
      const price = await fetchStockPrice(ticker);
      setHoldings(prev => prev.map(h => 
        h.id === id ? { ...h, currentPrice: price } : h
      ));
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, quantity } : h
    ));
  };

  const addHolding = () => {
    setHoldings([
      ...holdings,
      { id: Date.now().toString(), ticker: '', quantity: 0, currentPrice: 0 }
    ]);
  };

  const removeHolding = (id: string) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter(h => h.id !== id));
    }
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, h) => total + (h.quantity * h.currentPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validHoldings = holdings.filter(h => h.ticker && h.quantity > 0 && h.currentPrice > 0);
    
    if (!portfolioName.trim() || validHoldings.length === 0) {
      return;
    }

    onAdd({
      name: portfolioName.trim(),
      holdings: validHoldings,
      totalValue: calculateTotalValue()
    });

    // Reset form
    setPortfolioName('');
    setHoldings([{ id: '1', ticker: '', quantity: 0, currentPrice: 0 }]);
  };

  if (!isOpen) return null;

  const totalValue = calculateTotalValue();
  const isValid = portfolioName.trim() && holdings.some(h => h.ticker && h.quantity > 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-2xl flex flex-col sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[393px]"
        style={{
          maxHeight: '85vh',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header - Fixed */}
        <div 
          className="flex items-center justify-between px-6 border-b flex-shrink-0"
          style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            borderColor: 'var(--border)'
          }}
        >
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-lg transition-all active:scale-95"
            style={{ color: 'var(--foreground)' }}
          >
            <X size={24} strokeWidth={2} />
          </button>
          
          <h2 
            style={{
              fontSize: '1.0625rem',
              fontWeight: 500,
              letterSpacing: '-0.01em'
            }}
          >
            Add Portfolio
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Form - Scrollable */}
        <form 
          onSubmit={handleSubmit} 
          className="flex-1 overflow-y-auto"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-6 py-6 space-y-6"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)'
            }}
          >
            
            {/* Portfolio Name */}
            <div>
              <label 
                htmlFor="portfolioName"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Portfolio Name
              </label>
              <input
                id="portfolioName"
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g., Vanguard ISA"
                className="w-full px-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  fontSize: '1rem',
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Holdings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label 
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}
                >
                  Holdings
                </label>
                <button
                  type="button"
                  onClick={addHolding}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--primary)',
                    backgroundColor: 'var(--secondary)'
                  }}
                >
                  <Plus size={16} strokeWidth={2} />
                  Add Stock
                </button>
              </div>

              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div 
                    key={holding.id}
                    className="p-4 rounded-xl border"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--card)'
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <label 
                          className="block mb-2"
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'var(--muted-foreground)'
                          }}
                        >
                          Ticker Symbol
                        </label>
                        <input
                          type="text"
                          value={holding.ticker}
                          onChange={(e) => handleTickerChange(holding.id, e.target.value)}
                          placeholder="AAPL"
                          className="w-full px-3 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                          style={{
                            fontSize: '0.9375rem',
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)',
                            textTransform: 'uppercase'
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <label 
                          className="block mb-2"
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'var(--muted-foreground)'
                          }}
                        >
                          Shares
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={holding.quantity || ''}
                          onChange={(e) => handleQuantityChange(holding.id, parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-3 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                          style={{
                            fontSize: '0.9375rem',
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                        />
                      </div>

                      {holdings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHolding(holding.id)}
                          className="p-2 mt-7 rounded-lg transition-all active:scale-95"
                          style={{
                            color: 'var(--destructive)'
                          }}
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      )}
                    </div>

                    {/* Price and Value */}
                    {holding.currentPrice > 0 && (
                      <div 
                        className="pt-3 border-t"
                        style={{
                          borderColor: 'var(--border)'
                        }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: 'var(--muted-foreground)' }}>
                            Current Price: £{holding.currentPrice.toFixed(2)}
                          </span>
                          <span style={{ 
                            color: 'var(--foreground)',
                            fontWeight: 500
                          }}>
                            Value: £{(holding.quantity * holding.currentPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Value */}
            {totalValue > 0 && (
              <div 
                className="p-4 rounded-xl border"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--secondary)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span 
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}
                  >
                    Total Portfolio Value
                  </span>
                  <span 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}
                  >
                    £{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div 
              className="p-4 rounded-xl border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.5
                }}
              >
                Stock prices update automatically using live market data. Update your share quantities manually when you buy or sell.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                height: '56px',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: 'var(--primary)',
                color: 'var(--background)'
              }}
            >
              Create Portfolio
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%);
          }
          to { 
            transform: translateY(0);
          }
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}