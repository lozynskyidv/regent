import { ChevronLeft, Plus } from 'lucide-react';
import { SwipeableItem } from './SwipeableItem';

interface Liability {
  id: string;
  name: string;
  value: number;
  type: 'mortgage' | 'creditcard' | 'loan' | 'other';
  metadata?: any;
}

interface LiabilitiesDetailScreenProps {
  liabilities: Liability[];
  totalValue: number;
  onBack: () => void;
  onAddLiability: () => void;
  onDeleteLiability: (id: string) => void;
  onEditLiability?: (liability: Liability) => void;
  currency?: 'GBP' | 'USD' | 'EUR';
}

function formatCurrency(value: number, currency: 'GBP' | 'USD' | 'EUR' = 'GBP'): string {
  // Use locale that matches currency to get clean symbol without prefix
  const locale = currency === 'USD' ? 'en-US' : 'en-GB';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function LiabilitiesDetailScreen({ 
  liabilities, 
  totalValue, 
  onBack, 
  onAddLiability, 
  onDeleteLiability,
  onEditLiability,
  currency = 'GBP'
}: LiabilitiesDetailScreenProps) {

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
          
          <button
            onClick={onAddLiability}
            className="p-2 -mr-2 rounded-lg transition-all active:scale-95 hover:bg-secondary"
            style={{ color: 'var(--primary)' }}
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        </div>

        <div>
          <p 
            className="mb-2"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              fontWeight: 500
            }}
          >
            Liabilities
          </p>
          <h1 
            style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)'
            }}
          >
            {formatCurrency(totalValue, currency)}
          </h1>
        </div>
      </div>

      {/* Liabilities List */}
      <div 
        className="px-6 py-6"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom) + 48px, 48px)'
        }}
      >
        {liabilities.length === 0 ? (
          <div className="text-center py-12">
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)'
              }}
            >
              No liabilities yet. Tap + to add a liability.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {liabilities.map((liability) => (
              <SwipeableItem
                key={liability.id}
                onDelete={() => onDeleteLiability(liability.id)}
                onEdit={onEditLiability ? () => onEditLiability(liability) : undefined}
                showEdit={liability.type === 'mortgage' || liability.type === 'loan' || liability.type === 'other'}
              >
                <div
                  className="p-4 rounded-xl border bg-card"
                  style={{
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="mb-1"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--foreground)'
                        }}
                      >
                        {liability.name}
                      </h3>
                      
                      {/* Metadata - lighter and more subtle */}
                      {(liability.metadata?.interestRate || liability.metadata?.monthlyPayment || liability.metadata?.lastSynced) && (
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {liability.metadata?.interestRate && (
                            <p 
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--muted-foreground)',
                                opacity: 0.6
                              }}
                            >
                              {liability.metadata.interestRate}% APR
                            </p>
                          )}
                          {liability.metadata?.interestRate && liability.metadata?.monthlyPayment && (
                            <span style={{ color: 'var(--muted-foreground)', opacity: 0.25, fontSize: '0.8125rem' }}>•</span>
                          )}
                          {liability.metadata?.monthlyPayment && (
                            <p 
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--muted-foreground)',
                                opacity: 0.6
                              }}
                            >
                              {formatCurrency(parseFloat(liability.metadata.monthlyPayment.replace(/,/g, '')), currency)}/mo
                            </p>
                          )}
                          {(liability.metadata?.interestRate || liability.metadata?.monthlyPayment) && liability.metadata?.lastSynced && (
                            <span style={{ color: 'var(--muted-foreground)', opacity: 0.25, fontSize: '0.8125rem' }}>•</span>
                          )}
                          {liability.metadata?.lastSynced && (
                            <p 
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--muted-foreground)',
                                opacity: 0.6
                              }}
                            >
                              Synced {liability.metadata.lastSynced}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <p 
                        style={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--foreground)'
                        }}
                      >
                        {formatCurrency(liability.value, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}