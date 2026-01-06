import { X, Building2, Shield } from 'lucide-react';

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function ConnectBankModal({ isOpen, onClose, onConnect }: ConnectBankModalProps) {
  if (!isOpen) return null;

  const handleConnect = () => {
    // In production, this would initiate TrueLayer OAuth flow
    console.log('Initiating TrueLayer connection...');
    onConnect();
  };

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
            Connect Bank
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Content - Scrollable */}
        <div 
          className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          
          {/* TrueLayer Logo/Icon */}
          <div className="flex justify-center py-4">
            <div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--secondary)'
              }}
            >
              <Building2 
                size={48} 
                strokeWidth={1.5}
                style={{ color: 'var(--foreground)' }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="text-center space-y-2">
            <h3 
              style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                color: 'var(--foreground)'
              }}
            >
              Secure Bank Connection
            </h3>
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5
              }}
            >
              Connect your bank accounts via TrueLayer to automatically sync balances and keep your net worth up to date.
            </p>
          </div>

          {/* Security Features */}
          <div 
            className="p-4 rounded-xl border space-y-3"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <div className="flex items-start gap-3">
              <Shield 
                size={20} 
                strokeWidth={2}
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'var(--primary)' }}
              />
              <div>
                <p 
                  className="mb-1"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}
                >
                  Bank-level security
                </p>
                <p 
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.4
                  }}
                >
                  TrueLayer is FCA regulated and uses read-only access. Regent never sees your credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield 
                size={20} 
                strokeWidth={2}
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'var(--primary)' }}
              />
              <div>
                <p 
                  className="mb-1"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}
                >
                  Automatic updates
                </p>
                <p 
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.4
                  }}
                >
                  Your account balances sync automatically, keeping your net worth accurate without manual updates.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Banks */}
          <div>
            <p 
              className="mb-3"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--muted-foreground)',
                textAlign: 'center'
              }}
            >
              Supports all major UK banks
            </p>
            <div 
              className="flex items-center justify-center gap-4 py-3 rounded-xl"
              style={{
                backgroundColor: 'var(--secondary)'
              }}
            >
              {['Barclays', 'HSBC', 'Lloyds', 'NatWest'].map(bank => (
                <span 
                  key={bank}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--muted-foreground)'
                  }}
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            className="w-full px-6 rounded-xl transition-all active:scale-[0.98]"
            style={{
              height: '56px',
              fontSize: '1rem',
              fontWeight: 500,
              backgroundColor: 'var(--primary)',
              color: 'var(--background)'
            }}
          >
            Connect with TrueLayer
          </button>

          {/* Skip Option */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg transition-all active:scale-[0.98]"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}
          >
            Skip for now
          </button>
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