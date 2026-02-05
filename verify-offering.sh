#!/bin/bash

# Quick check to see which offering is serving packages

API_KEY="appl_YsKPtpcVpohFQoThbTiytPNKxPB"

echo "🔍 Checking current offering..."
echo ""

curl -X GET "https://api.revenuecat.com/v1/subscribers/test_user/offerings" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq '.current_offering_id, .offerings[] | select(.identifier == .current_offering_id) // select(.packages | length > 0)'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Should show: packages array with worthview_annual"
echo ""
