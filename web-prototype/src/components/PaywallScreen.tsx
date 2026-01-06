import { Check } from 'lucide-react';

interface PaywallScreenProps {
  daysRemaining?: number;
  onSubscribe: () => void;
  onRestorePurchases: () => void;
}

export function PaywallScreen({ daysRemaining, onSubscribe, onRestorePurchases }: PaywallScreenProps) {
  const isTrialActive = daysRemaining !== undefined && daysRemaining > 0;

  return (
    <div 
      className="min-h-screen w-full bg-background flex flex-col"
      style={{
        paddingTop: 'max(env(safe-area-inset-top) + 48px, 48px)',
        paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)'
      }}
    >
      {/* Content - Centered */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full">
        
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 
            className="mb-3"
            style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)'
            }}
          >
            Regent
          </h1>
          <p 
            style={{
              fontSize: '1.125rem',
              color: 'var(--muted-foreground)',
              fontWeight: 300,
              letterSpacing: '-0.01em'
            }}
          >
            Financial clarity for discerning professionals
          </p>
        </div>

        {/* Trial Status */}
        {isTrialActive && (
          <div 
            className="mb-8 p-4 rounded-xl border text-center"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)'
              }}
            >
              {daysRemaining === 1 
                ? '1 day remaining in your trial' 
                : `${daysRemaining} days remaining in your trial`}
            </p>
          </div>
        )}

        {/* Trial Expired Message */}
        {!isTrialActive && (
          <div 
            className="mb-8 p-5 rounded-xl border text-center"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <p 
              className="mb-2"
              style={{
                fontSize: '1.0625rem',
                fontWeight: 500,
                color: 'var(--foreground)'
              }}
            >
              Your trial has ended
            </p>
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5
              }}
            >
              Subscribe to continue managing your net worth with confidence
            </p>
          </div>
        )}

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          {[
            'Real-time portfolio tracking with live market data',
            'Secure bank account sync via TrueLayer',
            'Complete financial clarity across all assets',
            'Privacy-first architecture with no data sharing',
            'Designed for mass affluent professionals'
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div 
                className="flex-shrink-0 rounded-full p-1 mt-0.5"
                style={{
                  backgroundColor: 'rgba(100, 116, 139, 0.1)'
                }}
              >
                <Check 
                  size={16} 
                  strokeWidth={2.5}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
              <p 
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--foreground)',
                  lineHeight: 1.5
                }}
              >
                {benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div 
          className="p-6 rounded-xl border text-center mb-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)'
          }}
        >
          <p 
            className="mb-1"
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500
            }}
          >
            Annual Subscription
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span 
              style={{
                fontSize: '3rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--foreground)'
              }}
            >
              £149
            </span>
            <span 
              style={{
                fontSize: '1.125rem',
                color: 'var(--muted-foreground)',
                fontWeight: 400
              }}
            >
              /year
            </span>
          </div>
          <p 
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)'
            }}
          >
            Cancel anytime in Settings
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={onSubscribe}
          className="w-full rounded-xl transition-all active:scale-[0.98] mb-4"
          style={{
            height: '56px',
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: 'var(--primary)',
            color: 'var(--background)',
            letterSpacing: '-0.01em'
          }}
        >
          {isTrialActive ? 'Subscribe Now' : 'Continue with Regent'}
        </button>

        {/* Restore Purchases */}
        <button
          onClick={onRestorePurchases}
          className="w-full transition-all active:scale-95"
          style={{
            height: '48px',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--muted-foreground)'
          }}
        >
          Restore Purchases
        </button>

        {/* Fine Print */}
        <div className="mt-8 text-center">
          <p 
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            Payment will be charged to your Apple ID account at confirmation of purchase. 
            Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
          </p>
        </div>
      </div>
    </div>
  );
}
