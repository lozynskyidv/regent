import { useState } from 'react';
import { Check } from 'lucide-react';

interface SubscriptionAuthScreenProps {
  onAuthorize: () => void;
  onRestorePurchases: () => void;
}

export function SubscriptionAuthScreen({ onAuthorize, onRestorePurchases }: SubscriptionAuthScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthorize = () => {
    setIsAuthenticating(true);
    
    // Simulate Face ID double-click authorization
    setTimeout(() => {
      setIsAuthenticating(false);
      onAuthorize();
    }, 2000);
  };

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
        <div className="text-center mb-6">
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

        {/* Trial Offer */}
        <div 
          className="mb-5 p-5 rounded-xl border text-center"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)'
          }}
        >
          <div className="flex items-baseline justify-center gap-1 mb-3">
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
            className="mb-2.5"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--foreground)',
              lineHeight: 1.5,
              fontWeight: 400
            }}
          >
            Includes free 14-day trial — cancel anytime
          </p>

          <p 
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              opacity: 0.8
            }}
          >
            You won't be charged until January 15, 2026
          </p>
        </div>

        {/* Benefits - Top 3 only */}
        <div className="space-y-2.5 mb-5">
          {[
            'Real-time portfolio tracking with live market data',
            'Secure bank account sync via TrueLayer',
            'Privacy-first architecture with no data sharing'
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <div 
                className="flex-shrink-0 rounded-full p-0.5 mt-1"
                style={{
                  backgroundColor: 'rgba(100, 116, 139, 0.1)'
                }}
              >
                <Check 
                  size={12} 
                  strokeWidth={2.5}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
              <p 
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--foreground)',
                  lineHeight: 1.4
                }}
              >
                {benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Authorization Section */}
        {isAuthenticating ? (
          <div className="mb-5">
            {/* Authenticating State */}
            <div 
              className="p-6 rounded-xl border text-center"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              {/* Face ID Icon Animation */}
              <div className="mb-4 flex justify-center">
                <div 
                  className="rounded-full animate-pulse"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'rgb(59, 130, 246)' }}
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
              </div>

              <p 
                className="mb-2"
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Authenticating with Face ID
              </p>
              <p 
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)'
                }}
              >
                Please wait...
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-5">
            {/* Authorization Button */}
            <button
              onClick={handleAuthorize}
              className="w-full rounded-xl transition-all active:scale-[0.98] mb-3"
              style={{
                height: '56px',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: 'var(--primary)',
                color: 'var(--background)',
                letterSpacing: '-0.01em'
              }}
            >
              Start Free Trial
            </button>

            {/* Face ID Instruction */}
            <div 
              className="p-3 rounded-xl border text-center"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'rgba(100, 116, 139, 0.05)'
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <p 
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--muted-foreground)'
                  }}
                >
                  Authorize with Face ID
                </p>
              </div>
              <p 
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.4
                }}
              >
                Double-click the side button to confirm
              </p>
            </div>
          </div>
        )}

        {/* Restore Purchases */}
        <button
          onClick={onRestorePurchases}
          disabled={isAuthenticating}
          className="w-full transition-all active:scale-95 mb-5"
          style={{
            height: '48px',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--muted-foreground)',
            opacity: isAuthenticating ? 0.4 : 1
          }}
        >
          Restore Purchases
        </button>

        {/* Fine Print */}
        <div className="text-center">
          <p 
            style={{
              fontSize: '0.6875rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.6,
              opacity: 0.8
            }}
          >
            Payment will be charged to your Apple ID account at the confirmation of purchase. 
            Subscription automatically renews unless it is cancelled at least 24 hours before 
            the end of the current period. Your account will be charged for renewal within 
            24 hours prior to the end of the current period. You can manage and cancel your 
            subscriptions by going to your account settings on the App Store after purchase.
          </p>
        </div>
      </div>
    </div>
  );
}