# WorthView App Store Icons

This folder contains the WorthView logo/icon components for generating app store icons.

## What's Included

- `WorthViewIcon.tsx` - React component that generates the WorthView "WV" monogram logo
- `IconShowcase.tsx` - Interactive showcase page to preview and download icons at different sizes

## Logo Specifications

- **Background:** #1A1A1A (Brand Black)
- **Text:** #FAFAFA (Brand White) 
- **Monogram:** WV
- **Font Weight:** 300 (Light)
- **Letter Spacing:** -2px
- **Corner Radius:** 26px (at 120px size, scales proportionally)

## Required Sizes for App Store

- **1024×1024px** - App Store listing (required)
- **512×512px** - App Store secondary
- **180×180px** - iPhone App Icon
- **120×120px** - iPhone App Icon (2x)
- **87×87px** - iPhone Settings Icon
- **80×80px** - iPhone Spotlight Icon (2x)
- **60×60px** - iPhone Spotlight Icon

## How to Generate Icons

### Option 1: Using the IconShowcase Component
1. Run the Figma prototype (`Designmvpforregentapp` repo)
2. Navigate to the icon showcase page
3. Right-click on each icon size and "Save image as..." SVG
4. Convert SVG to PNG using online tools (CloudConvert, etc.) or Figma

### Option 2: Manual Export from Code
1. Copy `WorthViewIcon.tsx` into a React project
2. Render at the desired size
3. Use browser dev tools to export the SVG
4. Convert to PNG at exact dimensions

## Converting SVG to PNG

**Important:** iOS app icons must NOT have transparency. Make sure to export with a solid background.

Tools you can use:
- **CloudConvert** (online, free)
- **Figma** - Import SVG, export as PNG at specific sizes
- **Adobe Illustrator** - File > Export > Export for Screens
- **Sketch** - Insert SVG, export as PNG

## Usage in App

For the actual iOS app, copy the generated PNGs to:
```
/Users/dmytrolozynskyi/Documents/Regent App/WorthView/assets/
```

And reference them in `app.json`:
```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```
