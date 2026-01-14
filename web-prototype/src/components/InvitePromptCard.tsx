import { Users, Sparkles, TrendingUp, Trophy, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

type PromptTrigger = 'first_asset' | 'first_view' | 'net_worth_up' | '7_day_streak';

interface InvitePromptCardProps {
  trigger: PromptTrigger;
  invitesRemaining: number;
  onInvite: () => void;
  onDismiss: () => void;
  visible?: boolean;
}

/**
 * CONTEXTUAL INVITE PROMPT CARD
 * 
 * Shows at peak engagement moments to drive viral growth
 * 
 * Triggers:
 * - first_asset: After user adds first asset (HIGHEST CONVERSION)
 * - first_view: After first net worth view
 * - net_worth_up: After net worth increases
 * - 7_day_streak: After 7 consecutive days
 * 
 * For React Native:
 * - Use Animated.View for entrance animation
 * - Use AsyncStorage for tracking which prompts shown
 * - Replace with TouchableOpacity
 */
export function InvitePromptCard({ 
  trigger, 
  invitesRemaining, 
  onInvite, 
  onDismiss,
  visible = true
}: InvitePromptCardProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const content = {
    first_asset: {
      Icon: Users,
      title: 'Share Regent',
      subtitle: 'Invite colleagues who value clarity'
    },
    first_view: {
      Icon: Sparkles,
      title: 'Share Regent',
      subtitle: 'Invite colleagues who value clarity'
    },
    net_worth_up: {
      Icon: TrendingUp,
      title: 'Share Regent',
      subtitle: 'Invite colleagues who value clarity'
    },
    '7_day_streak': {
      Icon: Trophy,
      title: 'Share Regent',
      subtitle: 'Invite colleagues who value clarity'
    }
  };

  const { Icon, title, subtitle } = content[trigger];

  return (
    <div 
      className="mx-6 mb-8 rounded-xl border transition-all relative"
      style={{
        background: 'linear-gradient(180deg, rgba(250, 250, 250, 0.4) 0%, rgba(250, 250, 250, 0.2) 100%)',
        borderColor: 'var(--border)',
        borderLeftWidth: '2px',
        borderLeftColor: 'rgba(180, 160, 120, 0.3)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
    >
      {/* Close Button - Larger and more visible */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 rounded-full transition-all active:scale-95"
        style={{ 
          color: 'var(--muted-foreground)',
          zIndex: 2,
          padding: '6px',
          opacity: 0.5,
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.5';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <X size={16} strokeWidth={2} />
      </button>

      <div className="px-5 py-4">
        {/* Header - More compact, lighter hierarchy */}
        <div className="mb-3 flex items-start justify-between" style={{ paddingRight: '24px' }}>
          <div>
            <h3 
              style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'var(--foreground)',
                lineHeight: 1.3,
                marginBottom: '4px'
              }}
            >
              {title}
            </h3>
            <p 
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.4
              }}
            >
              {subtitle}
            </p>
          </div>
          
          {/* Beta badge - premium touch */}
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(180, 160, 120, 0.8)',
              backgroundColor: 'rgba(180, 160, 120, 0.1)',
              padding: '3px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            Beta
          </span>
        </div>

        {/* Invite count - Prominent badge/pill style */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'rgba(180, 160, 120, 0.9)',
            backgroundColor: 'rgba(180, 160, 120, 0.12)',
            padding: '4px 10px',
            borderRadius: '6px',
            marginBottom: '14px',
            letterSpacing: '0.01em',
            border: '1px solid rgba(180, 160, 120, 0.2)'
          }}
        >
          {invitesRemaining} {invitesRemaining === 1 ? 'invite' : 'invites'} remaining
        </div>

        {/* Button - Ghost/outline style */}
        <button
          onClick={onInvite}
          className="w-full rounded-lg transition-all active:scale-[0.98]"
          style={{
            height: '40px',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            border: '1.5px solid var(--border)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            e.currentTarget.style.borderColor = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          Share Invite
        </button>
      </div>
    </div>
  );
}