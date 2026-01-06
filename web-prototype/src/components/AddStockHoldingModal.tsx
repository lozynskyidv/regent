import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddStockHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (holding: { symbol: string; name: string; shares: number; currentPrice: number }) => void;
  initialData?: { symbol: string; name: string; shares: number; currentPrice: number } | null;
}

export function AddStockHoldingModal({ isOpen, onClose, onAdd, initialData }: AddStockHoldingModalProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setSymbol(initialData.symbol);
      setName(initialData.name);
      setShares(initialData.shares.toString());
      setCurrentPrice(initialData.currentPrice.toString());
    } else {
      setSymbol('');
      setName('');
      setShares('');
      setCurrentPrice('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericShares = parseFloat(shares.replace(/[^0-9.-]/g, ''));
    const numericPrice = parseFloat(currentPrice.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(numericShares) || numericShares <= 0 || 
        isNaN(numericPrice) || numericPrice <= 0 || 
        !symbol.trim() || !name.trim()) {
      return;
    }

    onAdd({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      shares: numericShares,
      currentPrice: numericPrice
    });

    // Reset form
    setSymbol('');
    setName('');
    setShares('');
    setCurrentPrice('');
  };

  const formatNumberInput = (input: string) => {
    const numeric = input.replace(/[^0-9.]/g, '');
    const parts = numeric.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numeric;
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value);
    setShares(formatted);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value);
    setCurrentPrice(formatted);
  };

  const calculateTotal = () => {
    const numericShares = parseFloat(shares.replace(/[^0-9.-]/g, ''));
    const numericPrice = parseFloat(currentPrice.replace(/[^0-9.-]/g, ''));
    
    if (!isNaN(numericShares) && !isNaN(numericPrice)) {
      const total = numericShares * numericPrice;
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(total);
    }
    return '£0';
  };

  if (!isOpen) return null;

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
            {initialData ? 'Edit Holding' : 'Add Stock'}
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Form */}
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
            
            {/* Ticker Symbol Input */}
            <div>
              <label 
                htmlFor="symbol"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Ticker Symbol
              </label>
              <input
                id="symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL"
                className="w-full px-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  fontSize: '1rem',
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  textTransform: 'uppercase'
                }}
              />
            </div>

            {/* Stock Name Input */}
            <div>
              <label 
                htmlFor="name"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Stock Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Apple Inc."
                className="w-full px-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  fontSize: '1rem',
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Shares Input */}
            <div>
              <label 
                htmlFor="shares"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Number of Shares
              </label>
              <input
                id="shares"
                type="text"
                inputMode="decimal"
                value={shares}
                onChange={handleSharesChange}
                placeholder="0"
                className="w-full px-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  fontSize: '1rem',
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Current Price Input */}
            <div>
              <label 
                htmlFor="price"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Current Price per Share
              </label>
              <div className="relative">
                <span 
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground)',
                    fontWeight: 500
                  }}
                >
                  £
                </span>
                <input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  value={currentPrice}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  style={{
                    fontSize: '1rem',
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>

            {/* Total Value Preview */}
            {shares && currentPrice && (
              <div 
                className="p-4 rounded-xl border"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)'
                }}
              >
                <div className="flex items-center justify-between">
                  <p 
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--muted-foreground)',
                      fontWeight: 500
                    }}
                  >
                    Total Value
                  </p>
                  <p 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}
                  >
                    {calculateTotal()}
                  </p>
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
                Stock prices can be updated automatically via Twelve Data for live market tracking, or manually if you prefer.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!symbol.trim() || !name.trim() || !shares || !currentPrice || 
                       parseFloat(shares) <= 0 || parseFloat(currentPrice) <= 0}
              className="w-full px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                height: '56px',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: 'var(--primary)',
                color: 'var(--background)'
              }}
            >
              {initialData ? 'Update Holding' : 'Add to Portfolio'}
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
      `}</style>
    </>
  );
}
