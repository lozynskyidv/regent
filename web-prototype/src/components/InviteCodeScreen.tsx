import { useState } from 'react';
import { ArrowRight, Key } from 'lucide-react';
import { WaitlistModal } from './WaitlistModal';

interface InviteCodeScreenProps {
  onCodeSubmit: (code: string) => void;
  error?: string;
  isValidating?: boolean;
}

/**
 * INVITE CODE ENTRY SCREEN
 * 
 * First screen after landing page
 * Users enter their exclusive invite code (e.g., RGNT1234)
 * Validates code before allowing signup
 * 
 * Design: Minimal, prestigious, banking restraint
 * Premium positioning: No hand-holding, maximum exclusivity
 * 
 * React Native implementation:
 * - Use TextInput with autoCapitalize="characters"
 * - Use ActivityIndicator for loading state
 * - Consider using react-native-otp-textinput for better UX
 */
export function InviteCodeScreen({ onCodeSubmit, error, isValidating }: InviteCodeScreenProps) {
  const [code, setCode] = useState('');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onCodeSubmit(code.trim().toUpperCase());
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: 'var(--background)',
        paddingTop: '60px'
      }}
    >
      {/* Status Bar Space */}
      <div style={{ height: '44px' }} />

      {/* Regent Wordmark + Descriptor */}
      <div className="px-6 mb-16">
        <h1 
          className="mb-2"
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)'
          }}
        >
          Regent
        </h1>
        <p 
          style={{
            fontSize: '0.9375rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.4
          }}
        >
          Private wealth tracking
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col">
        {/* Header */}
        <div className="mb-12">
          {/* Title */}
          <h2 
            className="mb-3"
            style={{
              fontSize: '2rem',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'var(--foreground)',
              lineHeight: 1.15
            }}
          >
            Enter your invite
          </h2>

          {/* Subtitle - more context */}
          <p 
            style={{
              fontSize: '1.0625rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            Track your complete financial picture.<br />
            Available by invitation only.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div>
            {/* Label */}
            <label 
              htmlFor="invite-code"
              className="block mb-4"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Invite Code
            </label>

            {/* Input */}
            <input
              id="invite-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="RGNT-XXXX-XXXX"
              disabled={isValidating}
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              className="w-full rounded-xl transition-all"
              style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                padding: '18px 20px',
                backgroundColor: 'var(--card)',
                border: error ? '2px solid #EF4444' : '2px solid var(--border)',
                color: 'var(--foreground)',
                fontFamily: 'monospace',
                textAlign: 'center',
                opacity: isValidating ? 0.6 : 1
              }}
            />

            {/* Error Message Only */}
            {error && (
              <p 
                className="mt-4"
                style={{
                  fontSize: '0.875rem',
                  color: '#EF4444',
                  lineHeight: 1.4
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!code.trim() || isValidating}
            className="w-full rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              height: '56px',
              fontSize: '1rem',
              fontWeight: 500,
              backgroundColor: (!code.trim() || isValidating) ? 'var(--muted)' : 'var(--foreground)',
              color: (!code.trim() || isValidating) ? 'var(--muted-foreground)' : 'var(--background)',
              opacity: isValidating ? 0.6 : 1,
              cursor: (!code.trim() || isValidating) ? 'not-allowed' : 'pointer',
              marginBottom: '32px'
            }}
          >
            {isValidating ? (
              <>
                <div 
                  className="animate-spin rounded-full border-2 border-current border-t-transparent"
                  style={{ width: '16px', height: '16px' }}
                />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={20} strokeWidth={2} />
              </>
            )}
          </button>

          {/* Exclusivity Disclaimer */}
          <div 
            className="text-center pb-8"
            style={{
              paddingTop: '24px'
            }}
          >
            <p 
              style={{ 
                fontSize: '0.8125rem', 
                color: 'var(--muted-foreground)', 
                lineHeight: 1.5,
                marginBottom: '16px'
              }}
            >
              Invites are shared between members.
            </p>
            
            {/* Waitlist CTA */}
            <button
              type="button"
              onClick={() => setIsWaitlistModalOpen(true)}
              className="transition-all"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--foreground)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              No invitation code? Join waitlist
            </button>
          </div>
        </form>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}