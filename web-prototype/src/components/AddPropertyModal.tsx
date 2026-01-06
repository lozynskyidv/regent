import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (property: { name: string; value: number }) => void;
  initialData?: { name: string; value: number } | null;
}

export function AddPropertyModal({ isOpen, onClose, onAdd, initialData }: AddPropertyModalProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue) || numericValue <= 0 || !name.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      value: numericValue
    });

    // Reset form
    setName('');
    setValue('');
  };

  const formatValueInput = (input: string) => {
    const numeric = input.replace(/[^0-9.]/g, '');
    const parts = numeric.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numeric;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValueInput(e.target.value);
    setValue(formatted);
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
            Add Property
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
            
            {/* Name Input */}
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
                Property Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., London Flat"
                className="w-full px-4 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  fontSize: '1rem',
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Value Input */}
            <div>
              <label 
                htmlFor="value"
                className="block mb-3"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Current Valuation
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
                  id="value"
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={handleValueChange}
                  placeholder="0"
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
                Property values are updated manually. You can edit the valuation anytime from your assets list.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim() || !value || parseFloat(value) <= 0}
              className="w-full px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                height: '56px',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: 'var(--primary)',
                color: 'var(--background)'
              }}
            >
              Add Property
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