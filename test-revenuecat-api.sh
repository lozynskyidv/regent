#!/bin/bash

# Test RevenueCat API to verify offerings are configured
# This will show if your products, entitlements, and offerings are set up correctly

API_KEY="appl_YsKPtpcVpohFQoThbTiytPNKxPB"

echo "🧪 Testing RevenueCat API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📦 Fetching offerings..."
curl -X GET "https://api.revenuecat.com/v1/subscribers/test_user/offerings" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ If you see packages above, your setup is correct!"
echo "❌ If you see 'offerings: []', you need to complete Step 2"
echo ""
