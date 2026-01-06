import { ChevronLeft, Plus, ChevronRight } from 'lucide-react';
import { SwipeableItem } from './SwipeableItem';

interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'bank' | 'portfolio' | 'property' | 'other';
  metadata?: any;
}

interface AssetsDetailScreenProps {
  assets: Asset[];
  totalValue: number;
  onBack: () => void;
  onAddAsset: () => void;
  onDeleteAsset: (id: string) => void;
  onEditAsset?: (asset: Asset) => void;
  onViewPortfolio?: (asset: Asset) => void;
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

export function AssetsDetailScreen({ 
  assets, 
  totalValue, 
  onBack, 
  onAddAsset, 
  onDeleteAsset,
  onEditAsset,
  onViewPortfolio,
  currency = 'GBP'
}: AssetsDetailScreenProps) {

  const handleAssetClick = (asset: Asset) => {
    if (asset.type === 'portfolio' && onViewPortfolio) {
      onViewPortfolio(asset);
    }
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
          
          <button
            onClick={onAddAsset}
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
            Assets
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

      {/* Assets List */}
      <div 
        className="px-6 py-6"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom) + 48px, 48px)'
        }}
      >
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <p 
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted-foreground)'
              }}
            >
              No assets yet. Tap + to add your first asset.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <SwipeableItem
                key={asset.id}
                onDelete={() => onDeleteAsset(asset.id)}
                onEdit={onEditAsset ? () => onEditAsset(asset) : undefined}
                showEdit={asset.type === 'property' || asset.type === 'other'}
              >
                <div
                  onClick={() => handleAssetClick(asset)}
                  className={`p-4 rounded-xl border bg-card ${
                    asset.type === 'portfolio' ? 'active:scale-[0.98] cursor-pointer hover:bg-secondary/50' : ''
                  }`}
                  style={{
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 
                          style={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'var(--foreground)'
                          }}
                        >
                          {asset.name}
                        </h3>
                        {asset.type === 'portfolio' && (
                          <ChevronRight 
                            size={16} 
                            strokeWidth={2}
                            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
                          />
                        )}
                      </div>
                      
                      {/* Metadata - lighter and more subtle */}
                      {(asset.metadata?.lastSynced || asset.metadata?.holdingsCount) && (
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {asset.metadata?.lastSynced && (
                            <p 
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--muted-foreground)',
                                opacity: 0.6
                              }}
                            >
                              Synced {asset.metadata.lastSynced}
                            </p>
                          )}
                          {asset.metadata?.lastSynced && asset.metadata?.holdingsCount && (
                            <span style={{ color: 'var(--muted-foreground)', opacity: 0.25, fontSize: '0.8125rem' }}>•</span>
                          )}
                          {asset.type === 'portfolio' && asset.metadata?.holdingsCount && (
                            <p 
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--muted-foreground)',
                                opacity: 0.6
                              }}
                            >
                              {asset.metadata.holdingsCount} {asset.metadata.holdingsCount === 1 ? 'holding' : 'holdings'}
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
                        {formatCurrency(asset.value, currency)}
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