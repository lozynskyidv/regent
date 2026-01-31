#!/bin/bash

# Submit the latest WorthView build to TestFlight
# This submits build 4545a96d (Jan 31, 10:20 PM) to App Store Connect

echo "🚀 Submitting latest build to TestFlight..."
echo ""
echo "Build: 4545a96d-da51-4315-8e1c-499772c2e078"
echo "Date: Jan 31, 2026 10:20 PM"
echo "Version: 1.0.0"
echo ""

cd "/Users/dmytrolozynskyi/Documents/Regent App/WorthView"

# Submit the specific build ID
eas submit --platform ios --id 4545a96d-da51-4315-8e1c-499772c2e078

echo ""
echo "✅ Submission complete!"
echo ""
echo "Next steps:"
echo "1. Wait 15-30 minutes for TestFlight processing"
echo "2. Check App Store Connect: https://appstoreconnect.apple.com/apps/6758517452/testflight/ios"
echo "3. Test on your device"
echo "4. Reply to Apple's review team with demo credentials"
