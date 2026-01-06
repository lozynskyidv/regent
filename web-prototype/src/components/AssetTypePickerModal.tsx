import { X, Building2, TrendingUp, Home, Plus } from 'lucide-react';

interface AssetTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'bank' | 'portfolio' | 'property' | 'other') => void;
}

export function AssetTypePickerModal({ isOpen, onClose, onSelectType }: AssetTypePickerModalProps) {
  if (!isOpen) return null;

  const assetTypes = [
    {
      id: 'bank' as const,
      icon: Building2,
      title: 'Bank Account',
      description: 'Connect via TrueLayer for auto-sync',
      badge: 'Live sync'
    },
    {
      id: 'portfolio' as const,
      icon: TrendingUp,
      title: 'Investment Portfolio',
      description: 'Track stocks with live prices',
      badge: 'Live prices'
    },
    {
      id: 'property' as const,
      icon: Home,
      title: 'Property',
      description: 'Manual valuation',
      badge: null
    },
    {
      id: 'other' as const,
      icon: Plus,
      title: 'Other Asset',
      description: 'Manual entry',
      badge: null
    }
  ];

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
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[393px] flex flex-col"
        style={{
          maxHeight: '75vh',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
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
            Add Asset
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Asset Types - Scrollable */}
        <div 
          className="px-6 py-6 space-y-3 overflow-y-auto flex-1"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {assetTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => {
                  onSelectType(type.id);
                  onClose();
                }}
                className="w-full p-5 rounded-xl border transition-all active:scale-[0.98] text-left"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="p-2.5 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: 'var(--secondary)'
                    }}
                  >
                    <Icon 
                      size={22} 
                      strokeWidth={2}
                      style={{ color: 'var(--foreground)' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        style={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--foreground)'
                        }}
                      >
                        {type.title}
                      </h3>
                      {type.badge && (
                        <span 
                          className="px-2 py-0.5 rounded"
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: 'var(--primary)',
                            color: 'var(--background)',
                            opacity: 0.9
                          }}
                        >
                          {type.badge}
                        </span>
                      )}
                    </div>
                    <p 
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--muted-foreground)',
                        lineHeight: 1.4
                      }}
                    >
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
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