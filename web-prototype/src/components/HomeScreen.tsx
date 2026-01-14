import { useState, useEffect } from 'react';
import { ChevronRight, Plus, Settings as SettingsIcon } from 'lucide-react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AssetTypePickerModal } from './AssetTypePickerModal';
import { ConnectBankModal } from './ConnectBankModal';
import { AddManualPortfolioModal } from './AddManualPortfolioModal';
import { AddPropertyModal } from './AddPropertyModal';
import { AddOtherAssetModal } from './AddOtherAssetModal';
import { LiabilityTypePickerModal } from './LiabilityTypePickerModal';
import { AddMortgageModal } from './AddMortgageModal';
import { ConnectCreditCardModal } from './ConnectCreditCardModal';
import { AddLoanModal } from './AddLoanModal';
import { AddOtherLiabilityModal } from './AddOtherLiabilityModal';
import { AssetsDetailScreen } from './AssetsDetailScreen';
import { LiabilitiesDetailScreen } from './LiabilitiesDetailScreen';
import { PortfolioDetailScreen } from './PortfolioDetailScreen';
import { ConfirmDialog } from './ConfirmDialog';
import { PaywallScreen } from './PaywallScreen';
import { SettingsScreen } from './SettingsScreen';
import { ShareInviteCard } from './ShareInviteCard';

// Types
interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'bank' | 'portfolio' | 'property' | 'other';
  metadata?: any;
}

interface Liability {
  id: string;
  name: string;
  value: number;
  type: 'mortgage' | 'creditcard' | 'loan' | 'other';
  metadata?: any;
}

type View = 'overview' | 'assets-detail' | 'liabilities-detail' | 'portfolio-detail' | 'settings';

// Demo data for showcase mode (£480k net worth persona - James Rothschild)
// This will be loaded when ?demo=true URL parameter is present
const DEMO_ASSETS: Asset[] = [
  { 
    id: '1', 
    name: 'Investment Portfolio', 
    value: 380000, 
    type: 'portfolio',
    metadata: {
      holdingsCount: 12,
      lastSynced: '2m ago',
      holdings: [
        { symbol: 'VUSA', name: 'Vanguard S&P 500 ETF', shares: 1200, currentPrice: 75.50, totalValue: 90600, change: 2.5 },
        { symbol: 'VWRL', name: 'Vanguard FTSE All-World', shares: 2000, currentPrice: 94.25, totalValue: 188500, change: 1.8 },
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, currentPrice: 180.40, totalValue: 27060, change: -0.5 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 200, currentPrice: 370.20, totalValue: 74040, change: 3.2 }
      ]
    }
  },
  { id: '2', name: 'Primary Residence', value: 145000, type: 'property' },
  { id: '3', name: 'Barclays Current Account', value: 95000, type: 'bank', metadata: { lastSynced: 'Just now' } }
];

const DEMO_LIABILITIES: Liability[] = [
  { 
    id: '1', 
    name: 'Halifax Mortgage', 
    value: 135000, 
    type: 'mortgage',
    metadata: {
      interestRate: '3.5',
      monthlyPayment: '1,850'
    }
  },
  { 
    id: '2', 
    name: 'Personal Loan - Santander', 
    value: 5000, 
    type: 'loan',
    metadata: {
      interestRate: '5.5',
      monthlyPayment: '420'
    }
  }
];

// New users start with empty state
const initialAssets: Asset[] = [];
const initialLiabilities: Liability[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function detectCurrency(): 'GBP' | 'USD' | 'EUR' {
  // Default to GBP for UK-focused app (£100k-£1m net worth target audience)
  // Users can manually change in Settings if needed
  return 'GBP';
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

function AnimatedNumber({ value, duration = 500, currency = 'GBP' }: { value: number; duration?: number; currency?: 'GBP' | 'USD' | 'EUR' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;

      setDisplayValue(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return <>{formatCurrency(displayValue, currency)}</>;
}

function Card({ 
  children, 
  className = '',
  onClick,
  style: customStyle
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl transition-all active:scale-[0.98] ${className}`}
      style={{
        padding: 'var(--spacing-xl)',
        border: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        ...customStyle
      }}
    >
      {children}
    </div>
  );
}

export function HomeScreen() {
  const [animationKey, setAnimationKey] = useState(0);
  const [lastUpdated] = useState(new Date());
  
  // Initialize assets and liabilities from localStorage
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('regent_assets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved assets:', e);
        return initialAssets;
      }
    }
    return initialAssets;
  });
  
  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem('regent_liabilities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved liabilities:', e);
        return initialLiabilities;
      }
    }
    return initialLiabilities;
  });
  
  // Chart time range state
  const [chartTimeRange, setChartTimeRange] = useState<'1M' | '3M' | 'YTD' | '1Y'>('1Y');
  
  // User name state - default to persona name for prototype
  const [userName] = useState(() => {
    return localStorage.getItem('regent_user_name') || 'James Rothschild';
  });
  
  const [invitesRemaining] = useState(5); // In production, fetch from Supabase
  
  // Generate user's invite code based on their name
  const [userCode] = useState(() => {
    // In production: Fetch from Supabase or generate on backend
    // Format: RGNT-[FIRSTNAME]-[4CHARS]
    const firstName = userName.split(' ')[0].toUpperCase();
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RGNT-${firstName}-${randomChars}`;
  });
  
  // Invite card visibility state - hide for current session when "Remind me later" is clicked
  const [inviteCardHidden, setInviteCardHidden] = useState(() => {
    // Check sessionStorage to see if card was dismissed this session
    return sessionStorage.getItem('regent_invite_card_hidden') === 'true';
  });
  
  // Currency state - auto-detect on first load, then use saved preference
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>(() => {
    const saved = localStorage.getItem('regent_currency');
    if (saved && (saved === 'GBP' || saved === 'USD' || saved === 'EUR')) {
      return saved as 'GBP' | 'USD' | 'EUR';
    }
    const detected = detectCurrency();
    localStorage.setItem('regent_currency', detected);
    return detected;
  });
  
  // Persist assets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('regent_assets', JSON.stringify(assets));
  }, [assets]);
  
  // Persist liabilities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('regent_liabilities', JSON.stringify(liabilities));
  }, [liabilities]);
  
  // Track when first asset was added
  useEffect(() => {
    if (assets.length > 0 && !localStorage.getItem('regent_first_asset_date')) {
      // Set current date as the baseline for performance tracking
      localStorage.setItem('regent_first_asset_date', new Date().toISOString());
    }
  }, [assets.length]);
  
  // Share invite handler
  const handleShareInvite = () => {
    // In production: Open share sheet with invite code/link
    console.log('Share invite clicked');
    // For React Native: Use Share API
    // await Share.share({ message: 'Join me on Regent...', url: '...' });
  };

  // Remind later handler - hides card for current session, reappears on next app open
  const handleRemindLater = () => {
    setInviteCardHidden(true);
    sessionStorage.setItem('regent_invite_card_hidden', 'true');
  };
  
  // Calculate days since first asset
  const getDaysSinceFirstAsset = (): number => {
    const firstAssetDate = localStorage.getItem('regent_first_asset_date');
    if (!firstAssetDate) return 0;
    
    const startDate = new Date(firstAssetDate);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysSinceFirstAsset = getDaysSinceFirstAsset();
  const shouldShowPerformance = daysSinceFirstAsset >= 1;
  
  // Check if empty state
  const isEmpty = assets.length === 0 && liabilities.length === 0;
  
  // Check if it's Day 1 (first day with assets)
  const isDay1 = daysSinceFirstAsset === 0 && assets.length > 0;
  
  // Format name as "J. Rockefeller"
  const formatDisplayName = (fullName: string): string => {
    if (!fullName.trim()) return '';
    
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0]; // Single name, just return it
    }
    
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstInitial = firstName.charAt(0).toUpperCase();
    
    // Handle titles (Dr., Mr., Mrs., etc.)
    if (firstName.match(/^(dr|mr|mrs|ms|prof)\.?$/i)) {
      return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()}. ${lastName}`;
    }
    
    return `${firstInitial}. ${lastName}`;
  };
  
  // Subscription state
  const [subscriptionActive, setSubscriptionActive] = useState(() => {
    const stored = localStorage.getItem('regent_subscription_active');
    return stored === 'true';
  });
  
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(() => {
    const trialStart = localStorage.getItem('regent_trial_start');
    if (!trialStart) {
      // First time user - start trial
      const now = new Date().toISOString();
      localStorage.setItem('regent_trial_start', now);
      return 14;
    }
    
    const startDate = new Date(trialStart);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 14 - daysPassed);
  });
  
  // Navigation state
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedPortfolio, setSelectedPortfolio] = useState<Asset | null>(null);
  
  // Modal states
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isOtherAssetModalOpen, setIsOtherAssetModalOpen] = useState(false);
  const [isLiabilityTypePickerOpen, setIsLiabilityTypePickerOpen] = useState(false);
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState(false);
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isOtherLiabilityModalOpen, setIsOtherLiabilityModalOpen] = useState(false);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'asset' | 'liability'; id: string; name: string } | null>(null);

  // Edit state
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  
  // Calculate totals
  const assetsTotal = assets.reduce((sum, asset) => sum + asset.value, 0);
  const liabilitiesTotal = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = assetsTotal - liabilitiesTotal;

  // Generate historical net worth data based on time range
  const generateChartData = (timeRange: '1M' | '3M' | 'YTD' | '1Y') => {
    const now = new Date();
    const data = [];
    
    if (timeRange === '1M') {
      // Last 30 days - daily data points
      const daysAgo = 30;
      const startValue = netWorth * 0.97; // Started 3% lower
      
      for (let i = daysAgo; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' });
        
        const progress = (daysAgo - i) / daysAgo;
        const baseValue = startValue + (netWorth - startValue) * progress;
        const volatility = baseValue * (Math.random() * 0.02 - 0.01);
        const value = i === 0 ? netWorth : Math.round(baseValue + volatility);
        
        data.push({
          label: `${day} ${month}`,
          value: value
        });
      }
    } else if (timeRange === '3M') {
      // Last 3 months - weekly data points
      const weeksAgo = 12;
      const startValue = netWorth * 0.94; // Started 6% lower
      
      for (let i = weeksAgo; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' });
        
        const progress = (weeksAgo - i) / weeksAgo;
        const baseValue = startValue + (netWorth - startValue) * progress;
        const volatility = baseValue * (Math.random() * 0.03 - 0.015);
        const value = i === 0 ? netWorth : Math.round(baseValue + volatility);
        
        data.push({
          label: `${day} ${month}`,
          value: value
        });
      }
    } else if (timeRange === 'YTD') {
      // Year to date - monthly data points
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const monthsSinceStart = now.getMonth() + 1;
      const startValue = netWorth * 0.875; // Started 12.5% lower (our 14.3% growth)
      
      for (let i = 0; i <= monthsSinceStart; i++) {
        const date = new Date(now.getFullYear(), i, 1);
        const month = date.toLocaleString('en-GB', { month: 'short' });
        
        const progress = i / monthsSinceStart;
        const baseValue = startValue + (netWorth - startValue) * progress;
        const volatility = baseValue * (Math.random() * 0.04 - 0.02);
        const value = i === monthsSinceStart ? netWorth : Math.round(baseValue + volatility);
        
        data.push({
          label: month,
          value: value
        });
      }
    } else {
      // 1Y - Last 12 months - monthly data points
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = now.getMonth();
      const startValue = netWorth * 0.875; // Started 12.5% lower
      
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const progress = (12 - i) / 12;
        const baseValue = startValue + (netWorth - startValue) * progress;
        const volatility = baseValue * (Math.random() * 0.05 - 0.025);
        const value = i === 0 ? netWorth : Math.round(baseValue + volatility);
        
        data.push({
          label: months[monthIndex],
          value: value
        });
      }
    }
    
    return data;
  };

  const chartData = generateChartData(chartTimeRange);
  
  // Calculate performance metrics from chart data
  const firstValue = chartData[0].value;
  const lastValue = chartData[chartData.length - 1].value;
  const performanceChange = lastValue - firstValue;
  const performancePercent = ((performanceChange / firstValue) * 100).toFixed(1);
  const isPositive = performanceChange >= 0;
  
  // Get time period label
  const getTimePeriodLabel = () => {
    if (chartTimeRange === '1M') return 'This month';
    if (chartTimeRange === '3M') return 'Last 3 months';
    if (chartTimeRange === 'YTD') return 'This year';
    return 'This year';
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              marginBottom: '2px'
            }}
          >
            {payload[0].payload.label}
          </p>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000 / 60);
    if (diff < 1) return 'just now';
    if (diff === 1) return '1m ago';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours === 1) return '1h ago';
    return `${hours}h ago`;
  };

  // Asset handlers
  const handleTypeSelect = (type: 'bank' | 'portfolio' | 'property' | 'other') => {
    if (type === 'bank') {
      setIsBankModalOpen(true);
    } else if (type === 'portfolio') {
      setIsPortfolioModalOpen(true);
    } else if (type === 'property') {
      setIsPropertyModalOpen(true);
    } else if (type === 'other') {
      setIsOtherAssetModalOpen(true);
    }
  };

  const handleBankConnect = () => {
    const newAsset: Asset = {
      id: generateId(),
      name: 'NatWest Savings Account',
      value: 15000,
      type: 'bank',
      metadata: { lastSynced: 'Just now' }
    };
    
    setAssets(prev => [...prev, newAsset].sort((a, b) => b.value - a.value));
    setIsBankModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handlePortfolioAdd = (portfolio: { name: string; holdings: any[]; totalValue: number }) => {
    // Transform holdings from modal format to portfolio detail format
    const transformedHoldings = portfolio.holdings.map(h => ({
      symbol: h.ticker,
      name: h.ticker, // We'll use ticker as name for now (could enhance with company name lookup)
      shares: h.quantity,
      currentPrice: h.currentPrice,
      totalValue: h.quantity * h.currentPrice,
      change: 0
    }));
    
    const newAsset: Asset = {
      id: generateId(),
      name: portfolio.name,
      value: portfolio.totalValue,
      type: 'portfolio',
      metadata: {
        holdingsCount: transformedHoldings.length,
        lastSynced: 'Just now',
        holdings: transformedHoldings
      }
    };
    
    setAssets(prev => [...prev, newAsset].sort((a, b) => b.value - a.value));
    setIsPortfolioModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handlePropertyAdd = (property: { name: string; value: number }) => {
    const newAsset: Asset = {
      id: generateId(),
      name: property.name,
      value: property.value,
      type: 'property'
    };
    
    setAssets(prev => [...prev, newAsset].sort((a, b) => b.value - a.value));
    setIsPropertyModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleOtherAssetAdd = (asset: { name: string; value: number }) => {
    const newAsset: Asset = {
      id: generateId(),
      name: asset.name,
      value: asset.value,
      type: 'other'
    };
    
    setAssets(prev => [...prev, newAsset].sort((a, b) => b.value - a.value));
    setIsOtherAssetModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  // Liability handlers
  const handleLiabilityTypeSelect = (type: 'mortgage' | 'creditcard' | 'loan' | 'other') => {
    if (type === 'mortgage') {
      setIsMortgageModalOpen(true);
    } else if (type === 'creditcard') {
      setIsCreditCardModalOpen(true);
    } else if (type === 'loan') {
      setIsLoanModalOpen(true);
    } else if (type === 'other') {
      setIsOtherLiabilityModalOpen(true);
    }
  };

  const handleMortgageAdd = (mortgage: { name: string; value: number; details?: any }) => {
    const newLiability: Liability = {
      id: generateId(),
      name: mortgage.name,
      value: mortgage.value,
      type: 'mortgage',
      metadata: mortgage.details
    };
    
    setLiabilities(prev => [...prev, newLiability].sort((a, b) => b.value - a.value));
    setIsMortgageModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleCreditCardConnect = () => {
    const newLiability: Liability = {
      id: generateId(),
      name: 'Amex Platinum',
      value: 8500,
      type: 'creditcard',
      metadata: { lastSynced: 'Just now' }
    };
    
    setLiabilities(prev => [...prev, newLiability].sort((a, b) => b.value - a.value));
    setIsCreditCardModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleLoanAdd = (loan: { name: string; value: number; details?: any }) => {
    const newLiability: Liability = {
      id: generateId(),
      name: loan.name,
      value: loan.value,
      type: 'loan',
      metadata: loan.details
    };
    
    setLiabilities(prev => [...prev, newLiability].sort((a, b) => b.value - a.value));
    setIsLoanModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleOtherLiabilityAdd = (liability: { name: string; value: number }) => {
    const newLiability: Liability = {
      id: generateId(),
      name: liability.name,
      value: liability.value,
      type: 'other'
    };
    
    setLiabilities(prev => [...prev, newLiability].sort((a, b) => b.value - a.value));
    setIsOtherLiabilityModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  // Edit handlers
  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    // Open appropriate modal based on asset type
    if (asset.type === 'property') {
      setIsPropertyModalOpen(true);
    } else if (asset.type === 'other') {
      setIsOtherAssetModalOpen(true);
    }
    // Note: Bank accounts and portfolios can't be edited (they sync automatically)
  };

  const handleEditLiability = (liability: Liability) => {
    setEditingLiability(liability);
    // Open appropriate modal based on liability type
    if (liability.type === 'mortgage') {
      setIsMortgageModalOpen(true);
    } else if (liability.type === 'loan') {
      setIsLoanModalOpen(true);
    } else if (liability.type === 'other') {
      setIsOtherLiabilityModalOpen(true);
    }
    // Note: Credit cards can't be edited (they sync automatically)
  };

  const handlePropertyUpdate = (property: { name: string; value: number }) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => 
        a.id === editingAsset.id 
          ? { ...a, name: property.name, value: property.value }
          : a
      ).sort((a, b) => b.value - a.value));
      setEditingAsset(null);
    } else {
      handlePropertyAdd(property);
    }
    setIsPropertyModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleOtherAssetUpdate = (asset: { name: string; value: number }) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => 
        a.id === editingAsset.id 
          ? { ...a, name: asset.name, value: asset.value }
          : a
      ).sort((a, b) => b.value - a.value));
      setEditingAsset(null);
    } else {
      handleOtherAssetAdd(asset);
    }
    setIsOtherAssetModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleMortgageUpdate = (mortgage: { name: string; value: number; details?: any }) => {
    if (editingLiability) {
      setLiabilities(prev => prev.map(l => 
        l.id === editingLiability.id 
          ? { ...l, name: mortgage.name, value: mortgage.value, metadata: mortgage.details }
          : l
      ).sort((a, b) => b.value - a.value));
      setEditingLiability(null);
    } else {
      handleMortgageAdd(mortgage);
    }
    setIsMortgageModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleLoanUpdate = (loan: { name: string; value: number; details?: any }) => {
    if (editingLiability) {
      setLiabilities(prev => prev.map(l => 
        l.id === editingLiability.id 
          ? { ...l, name: loan.name, value: loan.value, metadata: loan.details }
          : l
      ).sort((a, b) => b.value - a.value));
      setEditingLiability(null);
    } else {
      handleLoanAdd(loan);
    }
    setIsLoanModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  const handleOtherLiabilityUpdate = (liability: { name: string; value: number }) => {
    if (editingLiability) {
      setLiabilities(prev => prev.map(l => 
        l.id === editingLiability.id 
          ? { ...l, name: liability.name, value: liability.value }
          : l
      ).sort((a, b) => b.value - a.value));
      setEditingLiability(null);
    } else {
      handleOtherLiabilityAdd(liability);
    }
    setIsOtherLiabilityModalOpen(false);
    setAnimationKey(prev => prev + 1);
  };

  // Delete handlers
  const handleDeleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      setDeleteConfirm({ type: 'asset', id, name: asset.name });
    }
  };

  const handleDeleteLiability = (id: string) => {
    const liability = liabilities.find(l => l.id === id);
    if (liability) {
      setDeleteConfirm({ type: 'liability', id, name: liability.name });
    }
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'asset') {
      setAssets(prev => prev.filter(a => a.id !== deleteConfirm.id));
    } else {
      setLiabilities(prev => prev.filter(l => l.id !== deleteConfirm.id));
    }

    setDeleteConfirm(null);
    setAnimationKey(prev => prev + 1);
  };

  // Navigation helpers
  const openAssetPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTypePickerOpen(true);
  };

  const openLiabilityPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiabilityTypePickerOpen(true);
  };

  const handleViewPortfolio = (asset: Asset) => {
    setSelectedPortfolio(asset);
    setCurrentView('portfolio-detail');
  };

  // Subscription handlers
  const handleToggleSubscription = (active: boolean) => {
    setSubscriptionActive(active);
    localStorage.setItem('regent_subscription_active', active.toString());
  };

  const handleSubscribe = () => {
    // Mock subscription purchase
    setSubscriptionActive(true);
    localStorage.setItem('regent_subscription_active', 'true');
    alert('Subscription activated! (This is a mock - StoreKit 2 will handle this in production)');
  };

  const handleRestorePurchases = () => {
    // Mock restore
    alert('Checking for purchases... (This is a mock - StoreKit 2 will handle this in production)');
  };

  // Check if user should see paywall (trial expired and no active subscription)
  const shouldShowPaywall = !subscriptionActive && trialDaysRemaining === 0;

  // Render based on current view
  if (currentView === 'assets-detail') {
    return (
      <>
        <AssetsDetailScreen
          assets={assets}
          totalValue={assetsTotal}
          onBack={() => setCurrentView('overview')}
          onAddAsset={() => setIsTypePickerOpen(true)}
          onDeleteAsset={handleDeleteAsset}
          onViewPortfolio={handleViewPortfolio}
          onEditAsset={handleEditAsset}
          currency={currency}
        />
        {/* Modals still accessible from detail view */}
        <AssetTypePickerModal
          isOpen={isTypePickerOpen}
          onClose={() => setIsTypePickerOpen(false)}
          onSelectType={handleTypeSelect}
        />
        <ConnectBankModal
          isOpen={isBankModalOpen}
          onClose={() => setIsBankModalOpen(false)}
          onConnect={handleBankConnect}
        />
        <AddManualPortfolioModal
          isOpen={isPortfolioModalOpen}
          onClose={() => setIsPortfolioModalOpen(false)}
          onAdd={handlePortfolioAdd}
        />
        <AddPropertyModal
          isOpen={isPropertyModalOpen}
          onClose={() => {
            setIsPropertyModalOpen(false);
            setEditingAsset(null);
          }}
          onAdd={handlePropertyUpdate}
          initialData={editingAsset ? { name: editingAsset.name, value: editingAsset.value } : null}
        />
        <AddOtherAssetModal
          isOpen={isOtherAssetModalOpen}
          onClose={() => {
            setIsOtherAssetModalOpen(false);
            setEditingAsset(null);
          }}
          onAdd={handleOtherAssetUpdate}
          initialData={editingAsset ? { name: editingAsset.name, value: editingAsset.value } : null}
        />
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Asset?"
          message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      </>
    );
  }

  if (currentView === 'liabilities-detail') {
    return (
      <>
        <LiabilitiesDetailScreen
          liabilities={liabilities}
          totalValue={liabilitiesTotal}
          onBack={() => setCurrentView('overview')}
          onAddLiability={() => setIsLiabilityTypePickerOpen(true)}
          onDeleteLiability={handleDeleteLiability}
          onEditLiability={handleEditLiability}
          currency={currency}
        />
        {/* Modals still accessible from detail view */}
        <LiabilityTypePickerModal
          isOpen={isLiabilityTypePickerOpen}
          onClose={() => setIsLiabilityTypePickerOpen(false)}
          onSelectType={handleLiabilityTypeSelect}
        />
        <AddMortgageModal
          isOpen={isMortgageModalOpen}
          onClose={() => {
            setIsMortgageModalOpen(false);
            setEditingLiability(null);
          }}
          onAdd={handleMortgageUpdate}
          initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value, details: editingLiability.metadata } : null}
        />
        <ConnectCreditCardModal
          isOpen={isCreditCardModalOpen}
          onClose={() => setIsCreditCardModalOpen(false)}
          onConnect={handleCreditCardConnect}
        />
        <AddLoanModal
          isOpen={isLoanModalOpen}
          onClose={() => {
            setIsLoanModalOpen(false);
            setEditingLiability(null);
          }}
          onAdd={handleLoanUpdate}
          initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value, details: editingLiability.metadata } : null}
        />
        <AddOtherLiabilityModal
          isOpen={isOtherLiabilityModalOpen}
          onClose={() => {
            setIsOtherLiabilityModalOpen(false);
            setEditingLiability(null);
          }}
          onAdd={handleOtherLiabilityUpdate}
          initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value } : null}
        />
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Liability?"
          message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      </>
    );
  }

  if (currentView === 'portfolio-detail' && selectedPortfolio) {
    const handleUpdatePortfolioHoldings = (updatedHoldings: any[]) => {
      const newTotal = updatedHoldings.reduce((sum, h) => {
        const value = h.totalValue || 0;
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      
      setAssets(prev => prev.map(asset => 
        asset.id === selectedPortfolio.id
          ? {
              ...asset,
              value: newTotal,
              metadata: {
                ...asset.metadata,
                holdings: updatedHoldings,
                holdingsCount: updatedHoldings.length
              }
            }
          : asset
      ).sort((a, b) => b.value - a.value));
      
      setAnimationKey(prev => prev + 1);
    };

    return (
      <PortfolioDetailScreen
        portfolioName={selectedPortfolio.name}
        totalValue={selectedPortfolio.value}
        holdings={selectedPortfolio.metadata?.holdings || []}
        onBack={() => setCurrentView('assets-detail')}
        onUpdateHoldings={handleUpdatePortfolioHoldings}
        currency={currency}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setCurrentView('overview')}
        subscriptionActive={subscriptionActive}
        onToggleSubscription={handleToggleSubscription}
        daysRemaining={trialDaysRemaining}
        currency={currency}
        onCurrencyChange={(newCurrency) => {
          setCurrency(newCurrency);
          localStorage.setItem('regent_currency', newCurrency);
        }}
      />
    );
  }

  // Show paywall if trial expired and no subscription
  if (shouldShowPaywall) {
    return (
      <PaywallScreen
        daysRemaining={trialDaysRemaining}
        onSubscribe={handleSubscribe}
        onRestorePurchases={handleRestorePurchases}
      />
    );
  }

  // Overview screen
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header with settings icon */}
      <div 
        className="px-6 pt-16"
        style={{
          paddingTop: 'max(env(safe-area-inset-top) + 24px, 64px)'
        }}
      >
        <div className="flex items-start justify-between mb-1">
          {/* User name - always show for visual balance */}
          {userName && (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
                fontWeight: 500,
                letterSpacing: '0.03em'
              }}
            >
              {formatDisplayName(userName)}
            </p>
          )}
          
          {/* Settings Icon */}
          <button
            onClick={() => setCurrentView('settings')}
            className="p-1.5 -mr-1.5 rounded-lg transition-all hover:bg-secondary active:scale-95"
            style={{
              color: 'var(--muted-foreground)'
            }}
          >
            <SettingsIcon size={20} strokeWidth={2} />
          </button>
        </div>
        
        {/* Dynamic Title */}
        <h1 
          style={{
            fontSize: '2rem',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            marginTop: '8px'
          }}
        >
          {isEmpty ? `Welcome, ${userName.split(' ')[0]}` : 'Overview'}
        </h1>
      </div>

      {/* Subtle timestamp - Only show when there's data */}
      {!isEmpty && (
        <div className="px-6 pt-2 pb-6">
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              opacity: 0.7
            }}
          >
            Updated {getTimeAgo()}
          </p>
        </div>
      )}
      
      {/* Breathing room for empty state */}
      {isEmpty && <div className="pb-6" />}

      {/* Cards */}
      <div 
        className="px-6 pb-12"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom) + 48px, 48px)'
        }}
      >
        {isEmpty ? (
          /* Empty State */
          <Card 
            style={{ 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)',
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {/* Hero Photo Section */}
            <div
              style={{
                position: 'relative',
                height: '200px',
                backgroundImage: `url('https://images.unsplash.com/photo-1665399320433-803b7515621a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOWUMlMjBza3lsaW5lJTIwc3Vuc2V0JTIwZ29sZGVuJTIwaG91cnxlbnwxfHx8fDE3NjczOTE3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 'var(--spacing-xl)',
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem'
              }}
            >
              {/* Dark gradient overlay for text readability */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
                  zIndex: 0,
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '1rem'
                }}
              />
              
              {/* Text content */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#ffffff',
                    textAlign: 'left',
                    marginBottom: '6px'
                  }}
                >
                  Let's build your financial picture
                </h2>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'left',
                    lineHeight: 1.5
                  }}
                >
                  Add your first asset to begin
                </p>
              </div>
            </div>
            
            {/* CTA Section */}
            <div 
              className="flex flex-col items-center"
              style={{ 
                padding: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-2xl)'
              }}
            >
              {/* Single primary CTA */}
              <button
                onClick={() => setIsTypePickerOpen(true)}
                className="w-full max-w-xs rounded-xl px-6 py-3.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  backgroundColor: '#1a1a1a',
                  color: 'var(--background)'
                }}
              >
                <Plus size={20} strokeWidth={2} />
                Add Your First Asset
              </button>
              
              {/* Helper text */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                  marginTop: '12px',
                  opacity: 0.9
                }}
              >
                Add accounts, investments, property, or cash
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Net Worth Card - Primary (Dominant) */}
            <Card className="mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)' }}>
              <div className="flex flex-col" style={{ paddingTop: 'var(--spacing-md)', paddingBottom: 'var(--spacing-lg)' }}>
                <p 
                  className="mb-4"
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--muted-foreground)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Net Worth
                </p>
                <div 
                  key={animationKey}
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: 'var(--foreground)'
                  }}
                >
                  <AnimatedNumber value={netWorth} duration={500} currency={currency} />
                </div>
              </div>
            </Card>

            {/* Share Invite Card - Positioned under Net Worth */}
            {/* Only show if: 1) Card not dismissed this session AND 2) User has invites remaining */}
            {!inviteCardHidden && invitesRemaining > 0 && (
              <ShareInviteCard 
                invitesRemaining={invitesRemaining}
                userCode={userCode}
                userName={userName}
                onRemindLater={handleRemindLater}
              />
            )}

            {/* Performance Card - Chart or Day 1 Placeholder */}
            {(shouldShowPerformance || isDay1) && (
              <Card className="mb-6">
                <div className="flex flex-col">
                  {isDay1 ? (
                    /* Day 1: Single point with guidance */
                    <>
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <p 
                            className="mb-2"
                            style={{
                              fontSize: '0.9375rem',
                              color: 'var(--muted-foreground)',
                              fontWeight: 500
                            }}
                          >
                            Performance
                          </p>
                          <p 
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 400,
                              letterSpacing: '-0.01em',
                              color: 'var(--foreground)'
                            }}
                          >
                            {formatCurrency(netWorth, currency)}
                          </p>
                        </div>
                      </div>

                      {/* Single data point chart */}
                      <div 
                        style={{ 
                          height: '150px', 
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          marginBottom: '16px'
                        }}
                      >
                        {/* Single dot representing today's value */}
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'rgb(100, 116, 139)',
                            boxShadow: '0 0 0 4px rgba(100, 116, 139, 0.15)'
                          }}
                        />
                      </div>

                      {/* Guidance message */}
                      <div
                        className="text-center"
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--secondary)'
                        }}
                      >
                        <p
                          style={{
                            fontSize: '0.9375rem',
                            color: 'var(--foreground)',
                            fontWeight: 500,
                            marginBottom: '4px'
                          }}
                        >
                          Your performance tracking begins today
                        </p>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--muted-foreground)',
                            lineHeight: 1.5
                          }}
                        >
                          Check back tomorrow to see your first trend
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Day 2+: Full chart with metrics */
                    <>
                      {/* Header with metrics */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <p 
                            className="mb-2"
                            style={{
                              fontSize: '0.9375rem',
                              color: 'var(--muted-foreground)',
                              fontWeight: 500
                            }}
                          >
                            Performance
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span 
                              style={{
                                fontSize: '1.25rem',
                                fontWeight: 500,
                                color: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                                letterSpacing: '-0.01em'
                              }}
                            >
                              {isPositive ? '↑' : '↓'} {formatCurrency(performanceChange, currency)}
                            </span>
                            <span 
                              style={{
                                fontSize: '0.9375rem',
                                color: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                                fontWeight: 500
                              }}
                            >
                              ({performancePercent}%)
                            </span>
                          </div>
                          <p 
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--muted-foreground)',
                              marginTop: '4px'
                            }}
                          >
                            {getTimePeriodLabel()}
                          </p>
                        </div>
                      </div>

                      {/* Chart */}
                      <div 
                        style={{ 
                          height: '150px', 
                          width: '100%', 
                          marginLeft: '-12px', 
                          marginRight: '-12px', 
                          marginBottom: '16px',
                          outline: 'none',
                          position: 'relative'
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <ResponsiveContainer width="100%" height={150} minWidth={0}>
                          <LineChart data={chartData}>
                            <defs>
                              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(100, 116, 139)" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="rgb(100, 116, 139)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <YAxis 
                              domain={['dataMin', 'dataMax']}
                              hide={true}
                            />
                            <Tooltip 
                              content={<CustomTooltip />}
                              cursor={{ 
                                stroke: 'rgb(100, 116, 139)', 
                                strokeWidth: 1, 
                                strokeDasharray: '3 3',
                                strokeOpacity: 0.5
                              }}
                            />
                            <Line 
                              type="monotone"
                              dataKey="value"
                              stroke="rgb(100, 116, 139)"
                              strokeWidth={2.5}
                              dot={false}
                              activeDot={{ 
                                r: 5, 
                                fill: 'rgb(100, 116, 139)',
                                stroke: 'var(--card)',
                                strokeWidth: 2
                              }}
                              fill="url(#performanceGradient)"
                              fillOpacity={1}
                              isAnimationActive={true}
                              animationDuration={1000}
                              animationEasing="ease-out"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Time range selector */}
                      <div className="flex items-center justify-center gap-1">
                        {(['1M', '3M', 'YTD', '1Y'] as const).map((range) => (
                          <button
                            key={range}
                            onClick={() => setChartTimeRange(range)}
                            className="px-3 py-1.5 rounded-lg transition-all"
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: chartTimeRange === range ? 'var(--foreground)' : 'var(--muted-foreground)',
                              backgroundColor: chartTimeRange === range ? 'var(--secondary)' : 'transparent',
                              opacity: chartTimeRange === range ? 1 : 0.6
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
            
            {/* Secondary cards container */}
            <div className="space-y-4">
              {/* Assets Card - Secondary */}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p 
                      className="mb-1"
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--muted-foreground)',
                        fontWeight: 500
                      }}
                    >
                      Assets
                    </p>
                    <p 
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        color: 'var(--foreground)'
                      }}
                    >
                      {formatCurrency(assetsTotal, currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openAssetPicker}
                      className="p-1.5 rounded-lg transition-all hover:bg-secondary active:scale-95"
                      style={{
                        color: 'var(--muted-foreground)',
                        opacity: 0.7
                      }}
                    >
                      <Plus 
                        size={18} 
                        strokeWidth={2}
                      />
                    </button>
                    <button
                      onClick={() => setCurrentView('assets-detail')}
                      className="p-1.5 -mr-1.5 rounded-lg transition-all hover:bg-secondary active:scale-95"
                      style={{
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      <ChevronRight 
                        size={20} 
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Category list - Show top 3 */}
                <div className="space-y-3">
                  {assets.slice(0, 3).map((asset) => (
                    <div 
                      key={asset.id}
                      className="flex items-center justify-between"
                    >
                      <span 
                        style={{
                          fontSize: '1rem',
                          color: 'var(--foreground)'
                        }}
                      >
                        {asset.name}
                      </span>
                      <span 
                        style={{
                          fontSize: '1rem',
                          color: 'var(--foreground)',
                          fontWeight: 400
                        }}
                      >
                        {formatCurrency(asset.value, currency)}
                      </span>
                    </div>
                  ))}
                  {assets.length > 3 && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                      +{assets.length - 3} more
                    </p>
                  )}
                </div>
              </Card>

              {/* Liabilities Card - Secondary */}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p 
                      className="mb-1"
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--muted-foreground)',
                        fontWeight: 500
                      }}
                    >
                      Liabilities
                    </p>
                    <p 
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        color: 'var(--foreground)'
                      }}
                    >
                      {formatCurrency(liabilitiesTotal, currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openLiabilityPicker}
                      className="p-1.5 rounded-lg transition-all hover:bg-secondary active:scale-95"
                      style={{
                        color: 'var(--muted-foreground)',
                        opacity: 0.7
                      }}
                    >
                      <Plus 
                        size={18} 
                        strokeWidth={2}
                      />
                    </button>
                    <button
                      onClick={() => setCurrentView('liabilities-detail')}
                      className="p-1.5 -mr-1.5 rounded-lg transition-all hover:bg-secondary active:scale-95"
                      style={{
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      <ChevronRight 
                        size={20} 
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Category list - Show top 3 */}
                <div className="space-y-3">
                  {liabilities.slice(0, 3).map((liability) => (
                    <div 
                      key={liability.id}
                      className="flex items-center justify-between"
                    >
                      <span 
                        style={{
                          fontSize: '1rem',
                          color: 'var(--foreground)'
                        }}
                      >
                        {liability.name}
                      </span>
                      <span 
                        style={{
                          fontSize: '1rem',
                          color: 'var(--foreground)',
                          fontWeight: 400
                        }}
                      >
                        {formatCurrency(liability.value, currency)}
                      </span>
                    </div>
                  ))}
                  {liabilities.length > 3 && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                      +{liabilities.length - 3} more
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AssetTypePickerModal
        isOpen={isTypePickerOpen}
        onClose={() => setIsTypePickerOpen(false)}
        onSelectType={handleTypeSelect}
      />
      
      <ConnectBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onConnect={handleBankConnect}
      />
      
      <AddManualPortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onAdd={handlePortfolioAdd}
      />
      
      <AddPropertyModal
        isOpen={isPropertyModalOpen}
        onClose={() => {
          setIsPropertyModalOpen(false);
          setEditingAsset(null);
        }}
        onAdd={handlePropertyUpdate}
        initialData={editingAsset ? { name: editingAsset.name, value: editingAsset.value } : null}
      />
      
      <AddOtherAssetModal
        isOpen={isOtherAssetModalOpen}
        onClose={() => {
          setIsOtherAssetModalOpen(false);
          setEditingAsset(null);
        }}
        onAdd={handleOtherAssetUpdate}
        initialData={editingAsset ? { name: editingAsset.name, value: editingAsset.value } : null}
      />
      
      <LiabilityTypePickerModal
        isOpen={isLiabilityTypePickerOpen}
        onClose={() => setIsLiabilityTypePickerOpen(false)}
        onSelectType={handleLiabilityTypeSelect}
      />
      
      <AddMortgageModal
        isOpen={isMortgageModalOpen}
        onClose={() => {
          setIsMortgageModalOpen(false);
          setEditingLiability(null);
        }}
        onAdd={handleMortgageUpdate}
        initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value, details: editingLiability.metadata } : null}
      />
      
      <ConnectCreditCardModal
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
        onConnect={handleCreditCardConnect}
      />
      
      <AddLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => {
          setIsLoanModalOpen(false);
          setEditingLiability(null);
        }}
        onAdd={handleLoanUpdate}
        initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value, details: editingLiability.metadata } : null}
      />
      
      <AddOtherLiabilityModal
        isOpen={isOtherLiabilityModalOpen}
        onClose={() => {
          setIsOtherLiabilityModalOpen(false);
          setEditingLiability(null);
        }}
        onAdd={handleOtherLiabilityUpdate}
        initialData={editingLiability ? { name: editingLiability.name, value: editingLiability.value } : null}
      />
    </div>
  );
}