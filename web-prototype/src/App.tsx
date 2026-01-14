import { useState } from 'react';
import { SignUpScreen } from './components/SignUpScreen';
import { FaceIDScreen } from './components/FaceIDScreen';
import { SubscriptionAuthScreen } from './components/SubscriptionAuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { LandingPage } from './components/LandingPage';
import { InviteCodeScreen } from './components/InviteCodeScreen';
import { InviteCardComparison } from './components/InviteCardComparison';

type Screen = 'landing' | 'invite-code' | 'signup' | 'faceid' | 'subscription' | 'home' | 'invite-comparison';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showNav, setShowNav] = useState(true);
  const [inviteError, setInviteError] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  // Invite code validation (design only - replace with Supabase in production)
  const handleCodeSubmit = async (code: string) => {
    setIsValidatingCode(true);
    setInviteError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - accept any code starting with "RGNT"
    if (code.startsWith('RGNT')) {
      localStorage.setItem('regent_invite_validated', 'true');
      setCurrentScreen('signup');
    } else {
      setInviteError('Invalid invite code. Please check and try again.');
    }

    setIsValidatingCode(false);
  };

  // Navigate to request access screen
  const handleRequestAccess = () => {
    setCurrentScreen('requestAccess');
  };

  // Request access success callback
  const handleRequestSuccess = () => {
    // In production, this would be called after email is sent
    console.log('Request access email sent');
  };

  const handleSubscriptionAuthorize = () => {
    // Mark subscription as authorized
    localStorage.setItem('regent_subscription_active', 'true');
    setCurrentScreen('home');
  };

  const handleRestorePurchases = () => {
    // Mock restore - in production, StoreKit would check for existing subscription
    const hasExistingSubscription = localStorage.getItem('regent_subscription_active') === 'true';
    
    if (hasExistingSubscription) {
      alert('Subscription restored successfully!');
      setCurrentScreen('home');
    } else {
      alert('No existing subscription found.');
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Render screens */}
      {currentScreen === 'landing' && <LandingPage />}
      
      {/* iPhone frame wrapper - responsive (for app screens only) */}
      {currentScreen !== 'landing' && (
        <div className="mx-auto max-w-md min-h-screen">
          {currentScreen === 'invite-code' && (
            <InviteCodeScreen 
              onCodeSubmit={handleCodeSubmit} 
              error={inviteError} 
              isValidating={isValidatingCode} 
            />
          )}
          {currentScreen === 'signup' && (
            <SignUpScreen onContinue={() => setCurrentScreen('faceid')} />
          )}
          {currentScreen === 'faceid' && (
            <FaceIDScreen onAuthenticate={() => setCurrentScreen('subscription')} />
          )}
          {currentScreen === 'subscription' && (
            <SubscriptionAuthScreen 
              onAuthorize={handleSubscriptionAuthorize}
              onRestorePurchases={handleRestorePurchases}
            />
          )}
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'invite-comparison' && <InviteCardComparison />}
        </div>
      )}

      {/* Screen navigation helper (design prototype only) */}
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2"
        style={{ zIndex: 9999 }}
      >
        {/* Navigation panel */}
        {showNav && (
          <div className="bg-black/90 backdrop-blur-md rounded-xl p-3 flex flex-row gap-2 shadow-xl">
            <button
              onClick={() => setCurrentScreen('landing')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'landing' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Landing
            </button>
            <button
              onClick={() => setCurrentScreen('invite-code')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'invite-code' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Invite Code
            </button>
            <button
              onClick={() => setCurrentScreen('signup')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'signup' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setCurrentScreen('faceid')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'faceid' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Face ID
            </button>
            <button
              onClick={() => setCurrentScreen('subscription')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'subscription' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Subscribe
            </button>
            <button
              onClick={() => setCurrentScreen('home')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'home' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentScreen('invite-comparison')}
              className={`px-3 py-2 rounded-lg transition-all text-xs ${
                currentScreen === 'invite-comparison' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Invite Comparison
            </button>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setShowNav(!showNav)}
          className="bg-black/60 text-white px-3 py-2 rounded-lg backdrop-blur-sm transition-opacity hover:opacity-100 mx-auto"
          style={{ fontSize: '0.75rem', opacity: 0.5 }}
        >
          {showNav ? '✕' : '☰'}
        </button>
      </div>
    </div>
  );
}