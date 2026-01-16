-- Migration: Create asset_prices table for caching live prices
-- Purpose: Cache stock/crypto/commodity prices to minimize API calls to Twelve Data
-- Free tier: 800 calls/day → caching essential for scaling

-- Asset prices cache table
CREATE TABLE IF NOT EXISTS public.asset_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE, -- e.g., 'AAPL', 'BTC/USD', 'XAU/USD'
  price NUMERIC(20, 8) NOT NULL, -- Current price (8 decimals for crypto precision)
  currency TEXT NOT NULL DEFAULT 'USD', -- Price currency (USD, GBP, EUR)
  asset_type TEXT NOT NULL, -- 'stock', 'crypto', 'commodity', 'etf'
  exchange TEXT, -- Exchange identifier (e.g., 'NASDAQ', 'NYSE', 'Binance')
  name TEXT, -- Display name (e.g., 'Apple Inc.', 'Bitcoin')
  change_percent NUMERIC(10, 4), -- 24h/daily change percentage
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast symbol lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_asset_prices_symbol ON public.asset_prices(symbol);

-- Index for finding stale prices that need refresh
CREATE INDEX IF NOT EXISTS idx_asset_prices_updated_at ON public.asset_prices(updated_at);

-- Index for querying by asset type
CREATE INDEX IF NOT EXISTS idx_asset_prices_type ON public.asset_prices(asset_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.asset_prices ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read cached prices (public data)
CREATE POLICY "Public read access for asset prices"
  ON public.asset_prices
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert/update prices (via Edge Function)
-- This prevents clients from polluting the cache
CREATE POLICY "Service role can insert/update asset prices"
  ON public.asset_prices
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE public.asset_prices IS 'Caches live asset prices from Twelve Data API to minimize API calls. Updated every 5-15 minutes depending on asset type.';
COMMENT ON COLUMN public.asset_prices.symbol IS 'Ticker symbol or trading pair (e.g., AAPL, BTC/USD, XAU/USD)';
COMMENT ON COLUMN public.asset_prices.price IS 'Current price in the specified currency. 8 decimal precision for crypto.';
COMMENT ON COLUMN public.asset_prices.change_percent IS 'Price change percentage over last 24h (crypto) or trading day (stocks)';
