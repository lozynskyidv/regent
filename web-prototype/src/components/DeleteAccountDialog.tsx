import { AlertTriangle } from 'lucide-react';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountDialog({ 
  isOpen, 
  confirmText,
  onConfirmTextChange,
  onConfirm, 
  onCancel
}: DeleteAccountDialogProps) {
  if (!isOpen) return null;

  const isValid = confirmText === 'DELETE';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onCancel}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Dialog */}
      <div 
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[380px] mx-4"
        style={{ 
          transform: 'translate(-50%, -50%)',
          animation: 'scaleIn 0.2s ease-out' 
        }}
      >
        <div 
          className="bg-card rounded-2xl border shadow-2xl"
          style={{
            borderColor: 'var(--border)',
            padding: 'var(--spacing-xl)'
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div 
              className="p-3 rounded-full"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }}
            >
              <AlertTriangle 
                size={24} 
                strokeWidth={2}
                style={{ color: 'rgb(239, 68, 68)' }}
              />
            </div>
          </div>

          {/* Title */}
          <h3 
            className="text-center mb-2"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Delete Account
          </h3>

          {/* Message */}
          <p 
            className="text-center mb-4"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            This will permanently delete all your data. This action cannot be undone.
          </p>

          {/* Input */}
          <div className="mb-6">
            <p
              className="mb-2"
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
                textAlign: 'center'
              }}
            >
              Type <strong style={{ color: 'var(--foreground)' }}>DELETE</strong> to confirm
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => onConfirmTextChange(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-3 rounded-xl border transition-all"
              style={{
                fontSize: '1rem',
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                textAlign: 'center',
                fontWeight: 500
              }}
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border transition-all active:scale-95"
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isValid}
              className="flex-1 px-4 py-3 rounded-xl transition-all active:scale-95"
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: isValid ? 'rgb(239, 68, 68)' : 'var(--secondary)',
                color: isValid ? 'white' : 'var(--muted-foreground)',
                opacity: isValid ? 1 : 0.5,
                cursor: isValid ? 'pointer' : 'not-allowed'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}