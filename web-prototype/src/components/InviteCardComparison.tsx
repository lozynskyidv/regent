import { ArrowRight, Share2 } from 'lucide-react';

/**
 * INVITE CARD COMPARISON
 * 
 * Shows 3 different design approaches for the "Share Regent" invite card
 * that appears under the Net Worth card on the home screen.
 * 
 * Options:
 * 1. Minimal Inline Banner - Single line, subtle
 * 2. Compact Status Card - Same visual weight as other cards
 * 3. Border-Only Ghost Card - Dashed border, maximum restraint
 */

export function InviteCardComparison() {
  const invitesRemaining = 5;

  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        backgroundColor: 'var(--background)',
        paddingTop: '80px'
      }}
    >
      {/* Mock Net Worth Card (for context) */}
      <div 
        className="rounded-2xl p-6 mb-6"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)'
        }}
      >
        <p 
          style={{ 
            fontSize: '0.8125rem',
            color: 'var(--muted-foreground)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600
          }}
        >
          Net Worth
        </p>
        <p 
          style={{ 
            fontSize: '2.5rem',
            fontWeight: 500,
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}
        >
          £247,350
        </p>
        <p 
          style={{ 
            fontSize: '0.875rem',
            color: '#10B981',
            marginTop: '8px'
          }}
        >
          ↑ £12,450 (5.3%) this month
        </p>
      </div>

      {/* OPTION 1: Minimal Inline Banner */}
      <div className="mb-12">
        <h3 
          className="mb-3"
          style={{ 
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600
          }}
        >
          Option 1: Minimal Inline Banner
        </h3>
        
        <button
          className="w-full rounded-xl flex items-center justify-between px-4 transition-all active:scale-[0.99]"
          style={{
            height: '48px',
            backgroundColor: 'rgba(var(--card-rgb, 255, 255, 255), 0.4)',
            border: '1px solid var(--border)',
            cursor: 'pointer'
          }}
          onClick={() => console.log('Share invite - Option 1')}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1rem' }}>🔑</span>
            <span 
              style={{ 
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                fontWeight: 500
              }}
            >
              {invitesRemaining} invites remaining
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span 
              style={{ 
                fontSize: '0.9375rem',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
            >
              Share
            </span>
            <ArrowRight size={16} strokeWidth={2} />
          </div>
        </button>
      </div>

      {/* OPTION 2: Compact Status Card */}
      <div className="mb-12">
        <h3 
          className="mb-3"
          style={{ 
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600
          }}
        >
          Option 2: Compact Status Card
        </h3>
        
        <div 
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)'
          }}
        >
          <p 
            className="mb-2"
            style={{ 
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)',
              letterSpacing: '-0.01em'
            }}
          >
            Share Regent
          </p>
          <p 
            className="mb-6"
            style={{ 
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            {invitesRemaining} invites remaining
          </p>
          
          <button
            className="w-full rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              height: '48px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              cursor: 'pointer'
            }}
            onClick={() => console.log('Share invite - Option 2')}
          >
            <Share2 size={18} strokeWidth={2} />
            <span>Share Invite</span>
          </button>
        </div>
      </div>

      {/* OPTION 3: Border-Only Ghost Card */}
      <div className="mb-12">
        <h3 
          className="mb-3"
          style={{ 
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600
          }}
        >
          Option 3: Border-Only Ghost Card
        </h3>
        
        <button
          className="w-full rounded-2xl flex items-center justify-between px-6 transition-all active:scale-[0.99]"
          style={{
            height: '64px',
            backgroundColor: 'transparent',
            border: '1.5px dashed var(--border)',
            cursor: 'pointer'
          }}
          onClick={() => console.log('Share invite - Option 3')}
        >
          <div className="flex items-center gap-3">
            <span 
              style={{ 
                fontSize: '0.9375rem',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
            >
              {invitesRemaining} invites
            </span>
            <span 
              style={{ 
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)'
              }}
            >
              •
            </span>
            <span 
              style={{ 
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                fontWeight: 500
              }}
            >
              Share Regent
            </span>
          </div>
          <ArrowRight 
            size={18} 
            strokeWidth={2}
            style={{ color: 'var(--foreground)' }}
          />
        </button>
      </div>

      {/* Implementation Notes */}
      <div 
        className="rounded-xl p-4 mt-8"
        style={{
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--border)'
        }}
      >
        <p 
          className="mb-2"
          style={{ 
            fontSize: '0.75rem',
            color: 'var(--foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600
          }}
        >
          Implementation Notes
        </p>
        <ul 
          style={{ 
            fontSize: '0.8125rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.6,
            paddingLeft: '20px'
          }}
        >
          <li>All use existing color tokens (no custom colors)</li>
          <li>All have touch-friendly tap targets (min 48px height)</li>
          <li>Option 1: Most compact (48px height)</li>
          <li>Option 2: Most consistent with card pattern (~140px height)</li>
          <li>Option 3: Most minimal/restrained (64px height)</li>
        </ul>
      </div>
    </div>
  );
}
