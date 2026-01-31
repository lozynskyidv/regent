import { WorthViewIcon } from './WorthViewIcon';

export function IconShowcase() {
  const sizes = [
    { size: 1024, label: 'App Store (1024x1024)' },
    { size: 512, label: 'App Store (512x512)' },
    { size: 180, label: 'iPhone (180x180)' },
    { size: 120, label: 'iPhone (120x120)' },
    { size: 87, label: 'iPhone (87x87)' },
    { size: 80, label: 'iPhone (80x80)' },
    { size: 60, label: 'iPhone (60x60)' },
  ];

  const downloadSVG = (size: number) => {
    const svg = document.getElementById(`icon-${size}`)?.outerHTML;
    if (!svg) return;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worthview-icon-${size}x${size}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light mb-2" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>
          WorthView Icons
        </h1>
        <p className="text-lg mb-12" style={{ color: '#6B6B6B' }}>
          Right-click and "Save image as..." or click Download SVG button
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sizes.map(({ size, label }) => (
            <div key={size} className="bg-white border border-black/8 rounded-2xl p-8 flex flex-col items-center">
              <div id={`icon-${size}`} className="mb-4">
                <WorthViewIcon size={size} />
              </div>
              <p className="text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                {label}
              </p>
              <p className="text-xs mb-4" style={{ color: '#6B6B6B' }}>
                {size}×{size}px
              </p>
              <button
                onClick={() => downloadSVG(size)}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
              >
                Download SVG
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[#FAFAFA] rounded-2xl">
          <h2 className="text-2xl font-light mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            Design Specs
          </h2>
          <div className="space-y-2 text-sm" style={{ color: '#6B6B6B' }}>
            <p><strong style={{ color: '#1A1A1A' }}>Background:</strong> #1A1A1A (Brand Black)</p>
            <p><strong style={{ color: '#1A1A1A' }}>Text:</strong> #FAFAFA (Brand White)</p>
            <p><strong style={{ color: '#1A1A1A' }}>Font Weight:</strong> 300 (Light)</p>
            <p><strong style={{ color: '#1A1A1A' }}>Letter Spacing:</strong> -2px</p>
            <p><strong style={{ color: '#1A1A1A' }}>Corner Radius:</strong> 26px (at 120px size)</p>
          </div>
        </div>

        <div className="mt-8 p-8 bg-white border border-black/8 rounded-2xl">
          <h2 className="text-2xl font-light mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            Converting to PNG
          </h2>
          <p className="text-sm mb-4" style={{ color: '#6B6B6B', lineHeight: 1.6 }}>
            To convert SVG to PNG at exact sizes for App Store submission:
          </p>
          <ol className="space-y-2 text-sm list-decimal list-inside" style={{ color: '#6B6B6B' }}>
            <li>Download the SVG file above</li>
            <li>Use online tools like CloudConvert, or design software like Figma/Sketch/Adobe Illustrator</li>
            <li>Export at 1024×1024px for App Store submission</li>
            <li>Ensure no transparency for iOS app icons</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
