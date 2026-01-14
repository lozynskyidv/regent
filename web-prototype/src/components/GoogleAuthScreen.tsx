import { useState } from 'react';
import { Check } from 'lucide-react';

interface GoogleAuthScreenProps {
  invitedBy: string; // Name of person who invited
  onContinue: () => void; // After successful OAuth
  validatedCode: string; // The code they entered
}

/**
 * GOOGLE OAUTH SCREEN
 * 
 * Shown AFTER invite code is validated
 * User sees who invited them (social proof)
 * Completes Google sign-in to create account
 * 
 * React Native Implementation:
 * - Use expo-auth-session for Google OAuth
 * - Use Supabase signInWithIdToken
 * - Call mark-code-used Edge Function after OAuth
 */
export function GoogleAuthScreen({ 
  invitedBy, 
  onContinue,
  validatedCode 
}: GoogleAuthScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    
    // DESIGN ONLY - Replace with actual OAuth in React Native:
    // 1. const result = await GoogleSignIn.signInAsync({ clientId: ... })
    // 2. const { data } = await supabase.auth.signInWithIdToken({ provider: 'google', token: result.idToken })
    // 3. await fetch(SUPABASE_URL/functions/v1/mark-code-used, { code: validatedCode, user_id: data.user.id })
    // 4. Navigate to main app
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAuthenticating(false);
    onContinue();
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        
        {/* Social Proof Badge */}
        <div 
          className="mb-8 p-4 rounded-xl border text-center"
          style={{
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Check size={16} style={{ color: 'var(--background)' }} strokeWidth={3} />
            </div>
          </div>
          <p 
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.5
            }}
          >
            You've been invited by
          </p>
          <p 
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginTop: '4px',
              letterSpacing: '-0.01em'
            }}
          >
            {invitedBy}
          </p>
        </div>

        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--foreground)',
              letterSpacing: '-0.03em',
              marginBottom: '12px'
            }}
          >
            Welcome to Regent
          </h1>
          <p 
            style={{
              fontSize: '0.9375rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.6
            }}
          >
            Sign in with Google to activate your private beta access
          </p>
        </div>

        {/* Value Props - Compact */}
        <div className="mb-8 space-y-3">
          {[
            'Real-time portfolio tracking',
            'Secure UK bank connections',
            'Privacy-first architecture'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Check size={12} style={{ color: 'var(--background)' }} strokeWidth={3} />
              </div>
              <p 
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--foreground)',
                  lineHeight: 1.4
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isAuthenticating}
          className="w-full rounded-xl transition-all active:scale-[0.98] mb-4 flex items-center justify-center gap-3"
          style={{
            height: '56px',
            backgroundColor: 'var(--primary)',
            color: 'var(--background)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            opacity: isAuthenticating ? 0.6 : 1
          }}
        >
          {isAuthenticating ? (
            'Signing in...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="currentColor"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="currentColor"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="currentColor"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="currentColor"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Privacy/Trust Signal */}
        <p 
          className="text-center"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.5
          }}
        >
          We'll never share your data or send spam.
          <br />
          Your financial information is encrypted end-to-end.
        </p>

        {/* Code Reference (for debugging/support) */}
        <div 
          className="mt-8 text-center p-3 rounded-lg"
          style={{
            backgroundColor: 'var(--muted)',
            border: '1px solid var(--border)'
          }}
        >
          <p 
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              marginBottom: '4px'
            }}
          >
            Your invite code
          </p>
          <p 
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}
          >
            {validatedCode}
          </p>
        </div>

      </div>
    </div>
  );
}
