import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm, 
  onCancel,
  variant = 'default'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

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
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[340px] mx-4"
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
          {variant === 'destructive' && (
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
          )}

          {/* Title */}
          <h3 
            className="text-center mb-2"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p 
            className="text-center mb-6"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            {message}
          </p>

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
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl transition-all active:scale-95"
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: variant === 'destructive' ? 'rgb(239, 68, 68)' : 'var(--primary)',
                color: 'white'
              }}
            >
              {confirmText}
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