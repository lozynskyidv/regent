import { CheckCircle2, Copy, Share2, X } from 'lucide-react';
import { useState } from 'react';

interface InviteSuccessModalProps {
  isOpen: boolean;
  code: string;
  onClose: () => void;
}

/**
 * INVITE SUCCESS MODAL
 * 
 * Shows after successfully generating an invite code
 * Provides copy and share functionality
 * 
 * For React Native developers:
 * - Use React Native Modal component
 * - Replace with Animated.View for smooth transitions
 * - Use Clipboard.setString() for copy
 * - Use Share.share() for native share
 * - Style with StyleSheet
 */
export function InviteSuccessModal({ isOpen, code, onClose }: InviteSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    // Fallback copy method for environments where Clipboard API is blocked
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      
      document.body.removeChild(textArea);
    };

    // Try modern Clipboard API first, fallback to execCommand
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // If Clipboard API fails, use fallback
          fallbackCopy(code);
        });
    } else {
      fallbackCopy(code);
    }
  };

  const handleShare = () => {
    // In React Native, use:
    // Share.share({ 
    //   message: `Join Regent with my invite code: ${code}\n\nRegent is an invite-only net worth tracker for professionals.`,
    //   title: 'Invite to Regent'
    // })
    if (navigator.share) {
      navigator.share({
        text: `Join Regent with my invite code: ${code}\n\nRegent is an invite-only net worth tracker for professionals.`,
        title: 'Invite to Regent'
      }).catch(err => {
        // If share fails, fallback to copy
        console.log('Share failed, copying instead:', err);
        handleCopy();
      });
    } else {
      // Fallback: just copy the code
      handleCopy();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
      >
        <div 
          className="w-full max-w-md rounded-2xl border pointer-events-auto"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)'
                }}
              >
                <CheckCircle2 
                  size={24} 
                  strokeWidth={2}
                  style={{ color: 'rgb(34, 197, 94)' }}
                />
              </div>

              <button
                onClick={onClose}
                className="p-2 -mr-2 -mt-2 rounded-lg transition-all active:scale-95 hover:bg-secondary"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <h2 
              className="mb-2"
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--foreground)',
                letterSpacing: '-0.01em'
              }}
            >
              Invite Code Generated
            </h2>
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5
              }}
            >
              Share this code with a trusted friend. It expires in 30 days.
            </p>
          </div>

          {/* Code Display */}
          <div className="px-6 pb-6">
            <div 
              className="p-5 rounded-xl border mb-4"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <p 
                className="mb-2 text-center"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Your Invite Code
              </p>
              <code
                className="block text-center"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--foreground)',
                  letterSpacing: '0.05em',
                  lineHeight: 1.2
                }}
              >
                {code}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
                style={{
                  height: '52px',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  backgroundColor: copied 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'var(--primary)',
                  color: copied 
                    ? 'rgb(34, 197, 94)' 
                    : 'var(--background)'
                }}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} strokeWidth={2} />
                    Copy Code
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
                style={{
                  height: '52px',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--primary)'
                }}
              >
                <Share2 size={18} strokeWidth={2} />
                Share
              </button>
            </div>

            {/* Info */}
            <div 
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.05)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.5,
                  textAlign: 'center'
                }}
              >
                You can view all your codes in Settings → Invite Friends
              </p>
            </div>
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
      `}</style>
    </>
  );
}