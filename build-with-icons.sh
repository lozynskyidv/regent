#!/bin/bash

# Build WorthView with proper icons and auto-submit to TestFlight
# Build 6 - With regenerated WV monogram icons

echo "🚀 Building WorthView Build 6 with proper icons..."
echo ""
echo "Build Number: 6"
echo "Version: 1.0.0"
echo "Icons: Fresh WV monogram (regenerated)"
echo ""

cd "/Users/dmytrolozynskyi/Documents/Regent App/WorthView"

# Build and auto-submit
eas build --platform ios --profile production --auto-submit

echo ""
echo "✅ Build started!"
echo ""
echo "Expected timeline:"
echo "- Build: ~10-15 minutes"
echo "- Auto-submit: ~5 minutes"  
echo "- TestFlight processing: ~15-30 minutes"
echo ""
echo "You'll see Build 6 with the WV icon in TestFlight in ~30-45 minutes"
