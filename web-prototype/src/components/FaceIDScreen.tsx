import { useState } from 'react';

export function FaceIDScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [showPIN, setShowPIN] = useState(false);
  const [pin, setPin] = useState('');

  const handleFaceID = () => {
    // Simulate Face ID authentication
    setTimeout(() => {
      onAuthenticate();
    }, 800);
  };

  const handlePINSubmit = (value: string) => {
    if (value.length === 4) {
      setTimeout(() => {
        onAuthenticate();
      }, 300);
    }
  };

  const handlePINChange = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      handlePINSubmit(newPin);
    }
  };

  const handlePINDelete = () => {
    setPin(pin.slice(0, -1));
  };

  if (showPIN) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Title */}
          <h2 
            className="mb-2"
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Enter PIN
          </h2>

          {/* Subtitle */}
          <p 
            className="text-center mb-12"
            style={{
              fontSize: '1rem',
              color: 'var(--muted-foreground)'
            }}
          >
            Enter your 4-digit PIN to continue
          </p>

          {/* PIN dots */}
          <div className="flex gap-4 mb-16">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 transition-all"
                style={{
                  borderColor: i < pin.length ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: i < pin.length ? 'var(--primary)' : 'transparent'
                }}
              />
            ))}
          </div>

          {/* Number pad */}
          <div className="w-full max-w-xs">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePINChange(num.toString())}
                  className="aspect-square rounded-full flex items-center justify-center transition-colors active:bg-secondary"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 400
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div />
              <button
                onClick={() => handlePINChange('0')}
                className="aspect-square rounded-full flex items-center justify-center transition-colors active:bg-secondary"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 400
                }}
              >
                0
              </button>
              <button
                onClick={handlePINDelete}
                className="aspect-square rounded-full flex items-center justify-center transition-colors active:bg-secondary"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  color: 'var(--muted-foreground)'
                }}
              >
                ←
              </button>
            </div>
          </div>

          {/* Back to Face ID */}
          <button
            onClick={() => setShowPIN(false)}
            className="mt-12 transition-opacity active:opacity-70"
            style={{
              fontSize: '1rem',
              color: 'var(--muted-foreground)'
            }}
          >
            Use Face ID instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Face ID Visual - Simple circular pattern */}
        <div 
          className="mb-8 rounded-full bg-secondary flex items-center justify-center relative"
          style={{
            width: '120px',
            height: '120px'
          }}
        >
          {/* Concentric circles representing face scanning */}
          <div 
            className="absolute rounded-full border-2"
            style={{
              width: '70px',
              height: '70px',
              borderColor: 'var(--primary)',
              opacity: 0.3
            }}
          />
          <div 
            className="absolute rounded-full border-2"
            style={{
              width: '50px',
              height: '50px',
              borderColor: 'var(--primary)',
              opacity: 0.5
            }}
          />
          <div 
            className="absolute rounded-full"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>

        {/* Title */}
        <h2 
          className="mb-2"
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--foreground)'
          }}
        >
          Use Face ID to access
        </h2>

        {/* Subtitle */}
        <p 
          className="text-center mb-12"
          style={{
            fontSize: '1rem',
            color: 'var(--muted-foreground)'
          }}
        >
          Confirm your identity to view your data
        </p>

        {/* Face ID button */}
        <button
          onClick={handleFaceID}
          className="w-full bg-primary text-primary-foreground rounded-xl px-6 h-14 transition-opacity active:opacity-70"
          style={{
            fontSize: '1.0625rem',
            fontWeight: 500
          }}
        >
          Authenticate
        </button>

        {/* PIN fallback */}
        <button
          onClick={() => setShowPIN(true)}
          className="mt-6 transition-opacity active:opacity-70"
          style={{
            fontSize: '1rem',
            color: 'var(--muted-foreground)'
          }}
        >
          Use PIN instead
        </button>
      </div>
    </div>
  );
}