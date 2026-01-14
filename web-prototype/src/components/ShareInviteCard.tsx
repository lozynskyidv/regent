import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareInviteCardProps {
  invitesRemaining: number;
  userCode: string;
  onRemindLater?: () => void;
}

/**
 * INVITE CODE CARD
 * 
 * Positioned under Net Worth card on HomeScreen
 * Shows user's ability to share invite with one tap
 * 
 * Design Philosophy:
 * - Clear action-oriented header
 * - Value prop: WHY invite (status, referrer attribution)
 * - Scarcity signal (invites remaining)
 * - Single dominant CTA (native share)
 * 
 * Code format: RGNT-[FIRSTNAME]-[4CHARS]
 */
export function ShareInviteCard({ invitesRemaining, userCode, onRemindLater }: ShareInviteCardProps) {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    // Design prototype: Just show visual feedback (Option C)
    // In production: This would trigger native share sheet or clipboard
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div 
      className="rounded-2xl mb-6"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div className="flex flex-col" style={{ padding: 'var(--spacing-lg)' }}>
        
        {/* Header with scarcity badge */}
        <div className="flex items-center justify-between mb-3">
          <p 
            style={{ 
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}
          >
            Invite New Members
          </p>
          <div 
            className="px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border)'
            }}
          >
            <span 
              style={{ 
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--muted-foreground)',
                letterSpacing: '0.02em'
              }}
            >
              {invitesRemaining} left
            </span>
          </div>
        </div>

        {/* Value prop / incentive copy */}
        <p 
          className="mb-5"
          style={{ 
            fontSize: '0.875rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.5,
            letterSpacing: '0.005em'
          }}
        >
          Share your exclusive invite code. Your name will appear as their referrer.
        </p>

        {/* Primary CTA: Share invite button */}
        <button
          onClick={handleShare}
          className="w-full transition-all active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--foreground)',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '10px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <span 
            style={{ 
              fontSize: '0.9375rem',
              color: 'var(--foreground)',
              letterSpacing: '0.01em',
              fontWeight: 500,
            }}
          >
            {shared ? 'Shared ✓' : 'Share Invite'}
          </span>
        </button>

        {/* Remind later */}
        {onRemindLater && (
          <button
            onClick={onRemindLater}
            className="w-full mt-4 transition-opacity hover:opacity-100"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              opacity: 0.5,
              letterSpacing: '0.01em',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            Remind me later
          </button>
        )}
      </div>
    </div>
  );
}