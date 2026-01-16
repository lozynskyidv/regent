/**
 * Supabase Edge Function: fetch-asset-prices
 * 
 * Fetches real-time prices for stocks, crypto, commodities, and ETFs.
 * Uses Twelve Data API as the primary provider.
 * Implements caching via `asset_prices` table to minimize API calls.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Twelve Data API Configuration
const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

// Cache duration in minutes (optimized for free tier without batch requests)
const CACHE_DURATION = {
  stock: 60,     // Stocks: 1 hour
  crypto: 30,    // Crypto: 30 minutes
  commodity: 60, // Commodities: 1 hour
  etf: 60,       // ETFs: 1 hour
};

interface AssetPrice {
  symbol: string;
  price: number;
  currency: string;
  asset_type: string;
  exchange?: string;
  name?: string;
  change_percent?: number;
  updated_at: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 fetch-asset-prices invoked');

    // 1. Validate API key
    if (!TWELVE_DATA_API_KEY) {
      console.error('❌ TWELVE_DATA_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // 2. Parse request body
    const { symbols, forceRefresh = false } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: symbols array required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`📊 Fetching prices for ${symbols.length} symbols:`, symbols);
    console.log(`🔄 Force refresh: ${forceRefresh}`);

    // 3. Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const pricesToFetch: string[] = [];
    const cachedPrices: { [symbol: string]: AssetPrice } = {};

    // 4. Check cache for each symbol (unless forceRefresh is true)
    if (!forceRefresh) {
      for (const symbol of symbols) {
        const { data: cachedPrice, error } = await supabase
          .from('asset_prices')
          .select('*')
          .eq('symbol', symbol)
          .single();

        if (cachedPrice && !error) {
          const lastUpdated = new Date(cachedPrice.updated_at).getTime();
          const now = new Date().getTime();
          const ageMinutes = (now - lastUpdated) / (1000 * 60);

          const assetType = cachedPrice.asset_type as keyof typeof CACHE_DURATION;
          const cacheDuration = CACHE_DURATION[assetType] || 60; // Default to 1 hour

          if (ageMinutes < cacheDuration) {
            console.log(`✅ Using cached price for ${symbol} (age: ${ageMinutes.toFixed(1)}min)`);
            cachedPrices[symbol] = cachedPrice;
            continue; // Use cached price
          } else {
            console.log(`⏰ Cache expired for ${symbol} (age: ${ageMinutes.toFixed(1)}min, max: ${cacheDuration}min)`);
          }
        }
        
        pricesToFetch.push(symbol); // Need to fetch from API
      }
    } else {
      pricesToFetch.push(...symbols); // Force refresh all
    }

    console.log(`📡 Need to fetch from API: ${pricesToFetch.length} symbols`);

    // 5. Fetch from Twelve Data API (no batch on free tier, fetch individually)
    const fetchedPrices: { [symbol: string]: AssetPrice } = {};
    
    for (const symbol of pricesToFetch) {
      try {
        const url = `${TWELVE_DATA_BASE_URL}/price?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
        console.log(`🔍 Fetching ${symbol} from Twelve Data...`);
        
        const response = await fetch(url);
        const data = await response.json();

        console.log(`📦 Twelve Data response for ${symbol}:`, JSON.stringify(data));

        if (response.ok && data.price) {
          const newPrice: AssetPrice = {
            symbol: symbol,
            price: parseFloat(data.price),
            currency: data.currency || 'USD',
            asset_type: data.instrument_type || 'stock', // Default to stock
            exchange: data.exchange,
            name: data.name,
            change_percent: data.percent_change ? parseFloat(data.percent_change) : undefined,
            updated_at: new Date().toISOString(),
          };
          
          fetchedPrices[symbol] = newPrice;
          console.log(`✅ Fetched price for ${symbol}: ${newPrice.price} ${newPrice.currency}`);

          // Upsert into cache
          const { error: upsertError } = await supabase
            .from('asset_prices')
            .upsert(newPrice, { onConflict: 'symbol' });

          if (upsertError) {
            console.error(`⚠️ Failed to cache ${symbol}:`, upsertError);
          } else {
            console.log(`💾 Cached price for ${symbol}`);
          }
        } else {
          console.warn(`⚠️ Failed to fetch price for ${symbol}:`, data.message || data.status || 'Unknown error');
          
          // Try to use stale cache if API fails
          const { data: staleCache } = await supabase
            .from('asset_prices')
            .select('*')
            .eq('symbol', symbol)
            .single();
          
          if (staleCache) {
            console.log(`🔄 Using stale cache for ${symbol}`);
            fetchedPrices[symbol] = staleCache;
          }
        }
      } catch (apiError: any) {
        console.error(`❌ API fetch error for ${symbol}:`, apiError.message);
        
        // Try to use stale cache if API fails
        const { data: staleCache } = await supabase
          .from('asset_prices')
          .select('*')
          .eq('symbol', symbol)
          .single();
        
        if (staleCache) {
          console.log(`🔄 Using stale cache for ${symbol} after error`);
          fetchedPrices[symbol] = staleCache;
        }
      }
    }

    // 6. Combine cached and fetched prices
    const finalPrices = { ...cachedPrices, ...fetchedPrices };
    
    console.log(`✅ Returning ${Object.keys(finalPrices).length} prices`);
    console.log('📊 Final prices:', JSON.stringify(finalPrices));

    return new Response(
      JSON.stringify(finalPrices),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('❌ Fatal error in fetch-asset-prices:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
