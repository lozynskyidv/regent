import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddOtherLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (liability: { name: string; value: number }) => void;
  initialData?: { name: string; value: number } | null;
}

export function AddOtherLiabilityModal({ isOpen, onClose, onAdd, initialData }: AddOtherLiabilityModalProps) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setValue(initialData.value.toString());
    } else {
      setName('');
      setValue('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseFloat(value.replace(/,/g, ''));
    
    if (!name || isNaN(numValue) || numValue <= 0) {
      return;
    }

    onAdd({
      name,
      value: numValue
    });

    // Reset form
    setName('');
    setValue('');
  };

  const formatNumberInput = (inputValue: string) => {
    const num = inputValue.replace(/,/g, '');
    if (!num) return '';
    return parseFloat(num).toLocaleString('en-GB');
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
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-2xl flex flex-col sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[393px]"
        style={{
          maxHeight: '85vh',
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
            Add Other Liability
          </h2>
          
          <button
            onClick={handleSubmit}
            disabled={!name || !value}
            className="transition-all active:scale-95 disabled:opacity-40"
            style={{
              fontSize: '1.0625rem',
              fontWeight: 500,
              color: 'var(--primary)'
            }}
          >
            Add
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div 
            className="px-6 py-6 space-y-6"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)'
            }}
          >
            {/* Description */}
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5
              }}
            >
              Add any other debt or financial obligation not covered by the standard categories.
            </p>

            {/* Name */}
            <div>
              <label 
                htmlFor="name"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Description
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Business Debt"
                className="w-full px-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  height: '56px',
                  fontSize: '1rem',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Value */}
            <div>
              <label 
                htmlFor="value"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Outstanding Amount
              </label>
              <div className="relative">
                <span 
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  £
                </span>
                <input
                  id="value"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^\d]/g, '');
                    setValue(inputValue ? formatNumberInput(inputValue) : '');
                  }}
                  placeholder="0"
                  className="w-full pl-8 pr-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  style={{
                    height: '56px',
                    fontSize: '1rem',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>

            {/* Info note */}
            <div 
              className="p-4 rounded-xl border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--secondary)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.5
                }}
              >
                This liability will be manually tracked. Consider using specific categories for automatic updates via TrueLayer.
              </p>
            </div>
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