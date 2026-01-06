export function SignUpScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Top Hero Section: Bright daytime NYC Skyline - matches home screen aesthetic */}
      <div 
        className="relative w-full flex-shrink-0"
        style={{
          height: '32vh',
          minHeight: '220px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1551022029-db03b649e34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBOWUMlMjBza3lsaW5lJTIwZGF5dGltZSUyMGJsdWUlMjBza3l8ZW58MXx8fHwxNzY3NDcxNTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem'
        }}
      >
        {/* Subtle gradient for text readability on bright daytime image */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.25))',
            borderBottomLeftRadius: '2rem',
            borderBottomRightRadius: '2rem'
          }}
        />
        
        {/* Regent branding */}
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <h1 className="text-[2.5rem] tracking-tight mb-2" style={{ fontWeight: 500, color: '#ffffff' }}>
            Regent
          </h1>
          <p 
            className="text-center max-w-xs"
            style={{ 
              fontSize: '1.0625rem',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 300,
              letterSpacing: '-0.01em'
            }}
          >
            Financial clarity for discerning professionals
          </p>
        </div>
      </div>

      {/* Bottom Content Section: Vertically centered with legal anchored to bottom */}
      <div className="flex-1 bg-background flex flex-col px-6 pt-8">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center pt-6">
          {/* Sign-in buttons */}
          <div className="w-full space-y-3.5 mb-5">
            {/* Apple Sign In (Primary) */}
            <button
              onClick={onContinue}
              className="w-full rounded-xl px-6 h-16 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              style={{
                fontSize: '1.0625rem',
                fontWeight: 500,
                backgroundColor: '#000000',
                color: '#ffffff'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Google Sign In */}
            <button
              onClick={onContinue}
              className="w-full rounded-xl px-6 h-16 transition-all active:scale-[0.98] border flex items-center justify-center gap-3"
              style={{
                fontSize: '1.0625rem',
                fontWeight: 500,
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Email Sign In */}
            <button
              onClick={onContinue}
              className="w-full rounded-xl px-6 h-16 transition-all active:scale-[0.98] border flex items-center justify-center gap-3"
              style={{
                fontSize: '1.0625rem',
                fontWeight: 500,
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m2 7 10 6 10-6"/>
              </svg>
              Continue with Email
            </button>
          </div>

          {/* Already have account link */}
          <button
            onClick={onContinue}
            className="transition-opacity active:opacity-60"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              fontWeight: 500
            }}
          >
            Already have an account? <span style={{ color: 'var(--foreground)' }}>Sign in</span>
          </button>
        </div>

        {/* Legal Text - Natural flow at bottom */}
        <div className="w-full pb-8 px-6 mt-8">
          <p 
            className="text-center"
            style={{
              fontSize: '0.6875rem',
              lineHeight: 1.5,
              color: 'var(--muted-foreground)',
              opacity: 0.8
            }}
          >
            <button 
              className="underline active:opacity-60"
              style={{ color: 'var(--foreground)' }}
            >
              Terms of Service
            </button>
            {' • '}
            <button 
              className="underline active:opacity-60"
              style={{ color: 'var(--foreground)' }}
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}