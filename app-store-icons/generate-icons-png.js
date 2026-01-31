/**
 * Generate App Store Icons (SVG to PNG)
 * 
 * This script creates all required iOS app icon sizes as PNG files.
 * Run: node generate-icons-png.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG template for WorthView icon (with no rounded corners for PNG)
const generateSVG = () => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background (NO rounded corners - iOS adds them automatically) -->
  <rect width="1024" height="1024" fill="#1A1A1A" />
  
  <!-- WV Monogram -->
  <text
    x="512"
    y="666"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
    font-size="444"
    font-weight="300"
    fill="#FAFAFA"
    text-anchor="middle"
    letter-spacing="-17"
  >WV</text>
</svg>`;

// App Store icon sizes required
const iconSizes = [
  { name: 'icon', size: 1024, description: 'App Store & iOS (primary)' },
  { name: 'adaptive-icon', size: 1024, description: 'Android adaptive icon' },
  { name: 'splash-icon', size: 1024, description: 'Splash screen' },
  { name: 'favicon', size: 192, description: 'Website favicon (high-res)' },
];

// Create output directory
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Base SVG
const baseSVG = generateSVG();
const svgBuffer = Buffer.from(baseSVG);

console.log('🎨 Generating WorthView Icons as PNG...\n');

// Generate PNG files
async function generateIcons() {
  for (const { name, size, description } of iconSizes) {
    try {
      const filename = `${name}.png`;
      const filepath = path.join(outputDir, filename);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(filepath);
      
      console.log(`✅ ${filename} (${size}×${size}px) - ${description}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}.png:`, error.message);
    }
  }
  
  console.log('\n📝 PNG files generated in: app-store-icons/output/\n');
  console.log('📋 Next Steps:');
  console.log('1. Copy files to main app:');
  console.log('   cp output/icon.png ../assets/icon.png');
  console.log('   cp output/adaptive-icon.png ../assets/adaptive-icon.png');
  console.log('   cp output/splash-icon.png ../assets/splash-icon.png');
  console.log('');
  console.log('2. Copy favicon to website:');
  console.log('   cp output/favicon.png ../../worthview-website/public/favicon.ico');
  console.log('');
  console.log('✨ All icons ready for production!');
}

generateIcons().catch(console.error);
