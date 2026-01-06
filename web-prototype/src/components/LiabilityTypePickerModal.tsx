import { X, Home, CreditCard, Building2, MoreHorizontal } from 'lucide-react';

interface LiabilityTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'mortgage' | 'creditcard' | 'loan' | 'other') => void;
}

export function LiabilityTypePickerModal({ isOpen, onClose, onSelectType }: LiabilityTypePickerModalProps) {
  if (!isOpen) return null;

  const liabilityTypes = [
    {
      id: 'mortgage' as const,
      icon: Home,
      title: 'Mortgage',
      description: 'Property loans and mortgages',
      color: 'var(--foreground)'
    },
    {
      id: 'creditcard' as const,
      icon: CreditCard,
      title: 'Credit Cards',
      description: 'Auto-sync via TrueLayer',
      color: 'var(--foreground)'
    },
    {
      id: 'loan' as const,
      icon: Building2,
      title: 'Loans',
      description: 'Personal, car, or student loans',
      color: 'var(--foreground)'
    },
    {
      id: 'other' as const,
      icon: MoreHorizontal,
      title: 'Other Liability',
      description: 'Any other debt or obligation',
      color: 'var(--foreground)'
    }
  ];

  const handleSelect = (type: typeof liabilityTypes[number]['id']) => {
    onSelectType(type);
    onClose();
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
            Add Liability
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Liability Types - Scrollable */}
        <div 
          className="px-6 py-6 space-y-3 overflow-y-auto flex-1"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {liabilityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className="w-full p-4 rounded-xl border transition-all active:scale-[0.98] hover:bg-secondary/50"
              style={{
                borderColor: 'var(--border)',
                textAlign: 'left'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--secondary)'
                  }}
                >
                  <type.icon 
                    size={24} 
                    strokeWidth={2}
                    style={{ color: type.color }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p 
                    className="mb-0.5"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}
                  >
                    {type.title}
                  </p>
                  <p 
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    {type.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
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
