import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface SettingsScreenProps {
  onBack: () => void;
  subscriptionActive: boolean;
  onToggleSubscription: (active: boolean) => void;
  daysRemaining: number;
  currency: 'GBP' | 'USD' | 'EUR';
  onCurrencyChange: (currency: 'GBP' | 'USD' | 'EUR') => void;
}

export function SettingsScreen({ 
  onBack, 
  subscriptionActive, 
  onToggleSubscription,
  daysRemaining,
  currency,
  onCurrencyChange
}: SettingsScreenProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showCurrencyWarning, setShowCurrencyWarning] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<'GBP' | 'USD' | 'EUR' | null>(null);
  
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    if (deleteConfirmText === 'DELETE') {
      // Clear all data
      localStorage.clear();
      // Reload the app to reset state
      window.location.reload();
    }
  };
  
  const handleCurrencyClick = (newCurrency: 'GBP' | 'USD' | 'EUR') => {
    if (newCurrency === currency) return;
    setPendingCurrency(newCurrency);
    setShowCurrencyWarning(true);
  };
  
  const confirmCurrencyChange = () => {
    if (pendingCurrency) {
      onCurrencyChange(pendingCurrency);
    }
    setShowCurrencyWarning(false);
    setPendingCurrency(null);
  };
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <div 
        className="px-6 border-b sticky top-0 bg-background z-10"
        style={{
          paddingTop: 'max(env(safe-area-inset-top) + 12px, 48px)',
          paddingBottom: '16px',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg transition-all active:scale-95 hover:bg-secondary"
            style={{ color: 'var(--foreground)' }}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          
          <div style={{ width: '40px' }} />
        </div>

        <div>
          <h1 
            style={{
              fontSize: '2rem',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)'
            }}
          >
            Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div 
        className="px-6 py-6 space-y-6"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom) + 48px, 48px)'
        }}
      >
        {/* Subscription Status */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Subscription
          </h2>
          
          <div 
            className="p-5 rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Status
              </p>
              <span 
                className="px-3 py-1 rounded-full"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  backgroundColor: subscriptionActive 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : daysRemaining > 0 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  color: subscriptionActive 
                    ? 'rgb(34, 197, 94)' 
                    : daysRemaining > 0 
                    ? 'rgb(59, 130, 246)' 
                    : 'rgb(239, 68, 68)'
                }}
              >
                {subscriptionActive 
                  ? 'Active' 
                  : daysRemaining > 0 
                  ? `Trial (${daysRemaining}d left)` 
                  : 'Expired'}
              </span>
            </div>

            {subscriptionActive ? (
              <>
                <p 
                  className="mb-1"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.5
                  }}
                >
                  Annual plan • £149/year
                </p>
                <p 
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.5
                  }}
                >
                  Renews on January 1, 2027
                </p>
              </>
            ) : daysRemaining > 0 ? (
              <p 
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.5
                }}
              >
                {daysRemaining === 1 
                  ? '1 day remaining in your free trial' 
                  : `${daysRemaining} days remaining in your free trial`}
              </p>
            ) : (
              <p 
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.5
                }}
              >
                Your trial has ended. Subscribe to continue.
              </p>
            )}
          </div>
        </div>

        {/* Currency */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Currency
          </h2>
          
          <div className="flex gap-3">
            {(['GBP', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyClick(curr)}
                className="flex-1 p-4 rounded-xl border transition-all active:scale-[0.98]"
                style={{
                  borderColor: currency === curr ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: currency === curr ? 'rgba(59, 130, 246, 0.05)' : 'var(--card)',
                  borderWidth: currency === curr ? '2px' : '1px'
                }}
              >
                <p 
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '4px'
                  }}
                >
                  {curr === 'GBP' ? '£' : curr === 'USD' ? '$' : '€'}
                </p>
                <p 
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: currency === curr ? 600 : 500,
                    color: currency === curr ? 'var(--primary)' : 'var(--foreground)'
                  }}
                >
                  {curr}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Testing Controls */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Testing Controls
          </h2>
          
          <div 
            className="p-5 rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p 
                  className="mb-1"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}
                >
                  Simulate Active Subscription
                </p>
                <p 
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.4
                  }}
                >
                  For testing the app experience
                </p>
              </div>
              
              <button
                onClick={() => onToggleSubscription(!subscriptionActive)}
                className="relative rounded-full transition-all"
                style={{
                  width: '51px',
                  height: '31px',
                  backgroundColor: subscriptionActive ? 'var(--primary)' : 'rgb(229, 231, 235)',
                  flexShrink: 0
                }}
              >
                <div
                  className="absolute top-0.5 rounded-full bg-white transition-all shadow-sm"
                  style={{
                    width: '27px',
                    height: '27px',
                    left: subscriptionActive ? '22px' : '2px'
                  }}
                />
              </button>
            </div>

            <p 
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.5
              }}
            >
              Note: In production, this will be managed by StoreKit 2 automatically. Toggle off to test the paywall screen.
            </p>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Account
          </h2>
          
          <div className="space-y-3">
            <button 
              className="w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98]"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Privacy & Security
              </p>
            </button>

            <button 
              className="w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98]"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Connected Accounts
              </p>
            </button>

            <button 
              className="w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98]"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Help & Support
              </p>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            About
          </h2>
          
          <div 
            className="p-5 rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <div className="mb-3">
              <p 
                className="mb-1"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)'
                }}
              >
                Version
              </p>
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                1.0.0 (Beta)
              </p>
            </div>

            <div>
              <p 
                className="mb-1"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)'
                }}
              >
                Build
              </p>
              <p 
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                2026.01.01
              </p>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Data & Privacy
          </h2>
          
          <button
            onClick={handleDeleteAccount}
            className="w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98]"
            style={{
              borderColor: 'rgba(239, 68, 68, 0.3)',
              backgroundColor: 'var(--card)'
            }}
          >
            <p 
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'rgb(239, 68, 68)'
              }}
            >
              Delete Account
            </p>
            <p 
              className="mt-1"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.4
              }}
            >
              Permanently delete your account and all data
            </p>
          </button>
        </div>

        {/* Contact & Feedback */}
        <div>
          <h2 
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Contact & Feedback
          </h2>
          
          <button
            onClick={() => window.location.href = 'mailto:feedback@regent.app?subject=Regent App Feedback'}
            className="w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98]"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          >
            <p 
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--foreground)'
              }}
            >
              Send Feedback
            </p>
            <p 
              className="mt-1"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.4
              }}
            >
              We'd love to hear from you
            </p>
          </button>
        </div>
      </div>

      {/* Currency Change Warning */}
      <ConfirmDialog
        isOpen={showCurrencyWarning}
        title="Change Currency?"
        message={`This changes the currency symbol only. All values will display as ${pendingCurrency || ''} without conversion.`}
        confirmText="Change"
        cancelText="Cancel"
        onConfirm={confirmCurrencyChange}
        onCancel={() => {
          setShowCurrencyWarning(false);
          setPendingCurrency(null);
        }}
      />

      {/* Confirm Delete Dialog */}
      <DeleteAccountDialog
        isOpen={showDeleteConfirm}
        confirmText={deleteConfirmText}
        onConfirmTextChange={setDeleteConfirmText}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmText('');
        }}
      />
    </div>
  );
}