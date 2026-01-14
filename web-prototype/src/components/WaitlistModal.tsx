import { X } from 'lucide-react';
import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WAITLIST MODAL
 * 
 * Simple email capture for users without invite code
 * Clean, minimal, premium positioning
 */
export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call (in production: POST to Supabase or your backend)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    setSubmitted(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 300);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="bg-card rounded-2xl w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
          style={{
            pointerEvents: 'auto',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg transition-all hover:bg-secondary active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={20} strokeWidth={2} />
          </button>

          {/* Content */}
          <div style={{ padding: 'var(--spacing-xl)' }}>
            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <h2 
                    className="mb-2"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      color: 'var(--foreground)'
                    }}
                  >
                    Join Waitlist
                  </h2>
                  <p 
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--muted-foreground)',
                      lineHeight: 1.5
                    }}
                  >
                    Enter your email and we'll notify you when invites become available.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email input */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    required
                    autoFocus
                    className="w-full rounded-xl transition-all mb-8"
                    style={{
                      fontSize: '1rem',
                      padding: '16px 20px',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={!email.trim() || isSubmitting}
                    className="w-full rounded-xl transition-all active:scale-[0.98]"
                    style={{
                      height: '52px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      backgroundColor: (!email.trim() || isSubmitting) ? 'var(--secondary)' : 'var(--foreground)',
                      color: (!email.trim() || isSubmitting) ? 'var(--foreground)' : 'var(--background)',
                      cursor: (!email.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
                      opacity: (!email.trim() || isSubmitting) ? 0.4 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div 
                          className="animate-spin rounded-full border-2 border-current border-t-transparent"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--foreground)' }}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="var(--background)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 
                  className="mb-2"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}
                >
                  You're on the list
                </h3>
                <p 
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.5
                  }}
                >
                  We'll notify you when invites become available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        input::placeholder {
          color: var(--muted-foreground);
          opacity: 0.5;
        }
      `}</style>
    </>
  );
}