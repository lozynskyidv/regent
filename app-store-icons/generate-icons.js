/**
 * Generate App Store Icons
 * 
 * This script creates all required iOS app icon sizes from the SVG design.
 * Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// SVG template for WorthView icon
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with rounded corners -->
  <rect width="120" height="120" rx="26" fill="#1A1A1A" />
  
  <!-- WV Monogram -->
  <text
    x="60"
    y="78"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    font-size="52"
    font-weight="300"
    fill="#FAFAFA"
    text-anchor="middle"
    letter-spacing="-2"
  >WV</text>
</svg>`;

// App Store icon sizes required
const iconSizes = [
  { name: 'app-store-1024', size: 1024, description: 'App Store listing (required)' },
  { name: 'icon-180', size: 180, description: 'iPhone App Icon @3x' },
  { name: 'icon-120', size: 120, description: 'iPhone App Icon @2x' },
  { name: 'icon-87', size: 87, description: 'iPhone Settings @3x' },
  { name: 'icon-80', size: 80, description: 'iPhone Spotlight @2x' },
  { name: 'icon-60', size: 60, description: 'iPhone Spotlight @1x' },
  { name: 'icon-58', size: 58, description: 'iPhone Settings @2x' },
  { name: 'icon-40', size: 40, description: 'iPhone Spotlight @1x' },
  { name: 'icon-29', size: 29, description: 'iPhone Settings @1x' },
  { name: 'favicon-32', size: 32, description: 'Website favicon' },
  { name: 'favicon-16', size: 16, description: 'Website favicon small' },
];

// Create output directory
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('🎨 Generating WorthView Icons...\n');

// Generate SVG files
iconSizes.forEach(({ name, size, description }) => {
  const svg = generateSVG(size);
  const filename = `${name}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ ${filename} (${size}×${size}px) - ${description}`);
});

console.log('\n📝 SVG files generated in: app-store-icons/output/\n');
console.log('📋 Next Steps:');
console.log('1. Convert SVG files to PNG using one of these methods:');
console.log('   - Online: https://cloudconvert.com/svg-to-png (batch convert)');
console.log('   - macOS Preview: Open SVG → Export as PNG at original size');
console.log('   - Command line: Install librsvg and use rsvg-convert\n');
console.log('2. After converting to PNG:');
console.log('   - Copy icon-1024.png to assets/icon.png (main app icon)');
console.log('   - Copy favicon-32.png to worthview-website/public/favicon.ico');
console.log('   - iOS will auto-generate other sizes from 1024×1024\n');
console.log('💡 Tip: For App Store submission, use the 1024×1024 PNG');
