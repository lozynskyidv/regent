import { Check, Shield, Lock, TrendingUp, Smartphone, Database, ChevronRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Logo */}
              <h1 className="mb-8" style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#1A1A1A' }}>
                Regent
              </h1>

              {/* Headline */}
              <h2 
                className="mb-6 leading-tight"
                style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '-0.03em', color: '#1A1A1A' }}
              >
                Your net worth,<br />crystallized.
              </h2>

              {/* Subheadline */}
              <p 
                className="mb-10 leading-relaxed"
                style={{ fontSize: '1.125rem', color: '#6B6B6B', lineHeight: 1.6 }}
              >
                Private wealth tracking for professionals. Your data never leaves your device.
              </p>

              {/* CTA Button */}
              <button 
                className="bg-black text-white px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 mb-4"
                style={{ fontSize: '1rem', fontWeight: 500 }}
              >
                Download on the App Store
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Trust Badge */}
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                14-day free trial · No credit card required
              </p>
            </div>

            {/* Right Column - iPhone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl" />
              
              {/* iPhone Frame */}
              <div className="relative" style={{ width: '280px', height: '570px' }}>
                {/* iPhone Bezel */}
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl" style={{ padding: '12px' }}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black w-32 h-7 rounded-b-3xl z-20" />
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-[#FAFAFA] rounded-[2.5rem] overflow-hidden">
                    {/* NYC Cityscape Header */}
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1694408614917-561080671282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmUlMjBldmVuaW5nfGVufDF8fHx8MTc2NzYzMTkwMHww&ixlib=rb-4.1.0&q=80&w=1080)',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0" style={{ filter: 'grayscale(20%)' }} />
                      
                      {/* Status Bar */}
                      <div className="relative z-10 px-6 pt-3 flex justify-between items-center text-white" style={{ fontSize: '0.688rem' }}>
                        <span>9:41</span>
                        <div className="flex gap-1 items-center">
                          <div className="w-4 h-3 border border-white rounded-sm" />
                        </div>
                      </div>
                      
                      {/* Header Title */}
                      <div className="absolute bottom-4 left-6">
                        <h3 className="text-white" style={{ fontSize: '1.25rem', fontWeight: 500 }}>Home</h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-4 py-6 space-y-4">
                      {/* Net Worth Card */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <p style={{ fontSize: '0.813rem', color: '#6B6B6B', marginBottom: '0.5rem' }}>Net Worth</p>
                        <div style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
                          £247,450
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <span style={{ fontSize: '0.813rem', color: '#00A86B' }}>+£12,340</span>
                          <span style={{ fontSize: '0.813rem', color: '#6B6B6B' }}>(5.28%)</span>
                        </div>
                      </div>

                      {/* Assets Card */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <p style={{ fontSize: '0.813rem', color: '#6B6B6B', marginBottom: '0.5rem' }}>Total Assets</p>
                        <div style={{ fontSize: '1.5rem', fontWeight: 300, color: '#1A1A1A' }}>
                          £312,680
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span style={{ fontSize: '0.75rem', color: '#1A1A1A' }}>Investments</span>
                            <span style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>£185,420</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span style={{ fontSize: '0.75rem', color: '#1A1A1A' }}>Cash</span>
                            <span style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>£127,260</span>
                          </div>
                        </div>
                      </div>

                      {/* Liabilities Card (partial) */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <p style={{ fontSize: '0.813rem', color: '#6B6B6B', marginBottom: '0.5rem' }}>Total Liabilities</p>
                        <div style={{ fontSize: '1.5rem', fontWeight: 300, color: '#1A1A1A' }}>
                          £65,230
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-black/5 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Lock className="w-5 h-5 text-black/60" />
              <span style={{ fontSize: '0.875rem', color: '#1A1A1A' }}>Encrypted locally</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Shield className="w-5 h-5 text-black/60" />
              <span style={{ fontSize: '0.875rem', color: '#1A1A1A' }}>FCA-compliant</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Database className="w-5 h-5 text-black/60" />
              <span style={{ fontSize: '0.875rem', color: '#1A1A1A' }}>No data sharing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 
            className="text-center mb-4"
            style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#1A1A1A' }}
          >
            Clarity, not coaching.
          </h3>
          <p 
            className="text-center mb-16 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem', color: '#6B6B6B', lineHeight: 1.6 }}
          >
            Regent gives you a complete view of your financial position. No advice. No gamification. Just the numbers.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-black/8">
              <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                See everything
              </h4>
              <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                Net worth at a glance. Assets and liabilities organized by category. Live portfolio tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-black/8">
              <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-black" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                Stay private
              </h4>
              <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                Local-first architecture. Your financial data never touches our servers. Face ID protection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-black/8">
              <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-black" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                Live updates
              </h4>
              <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                Connect UK bank accounts. Track investment portfolios with real-time market prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 
            className="text-center mb-16"
            style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#1A1A1A' }}
          >
            How it works
          </h3>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-block bg-black/5 text-black rounded-full w-8 h-8 flex items-center justify-center mb-4" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  1
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                  Connect your accounts
                </h4>
                <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                  Securely link UK bank accounts via TrueLayer. Your credentials are never stored.
                </p>
              </div>
              <div className="flex-1 bg-[#FAFAFA] rounded-xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-black/20 mx-auto mb-4" />
                  <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>Bank connection screenshot</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="inline-block bg-black/5 text-black rounded-full w-8 h-8 flex items-center justify-center mb-4" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  2
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                  Add your investments
                </h4>
                <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                  Manually enter portfolio holdings. We fetch live prices from global markets.
                </p>
              </div>
              <div className="flex-1 bg-[#FAFAFA] rounded-xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-black/20 mx-auto mb-4" />
                  <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>Portfolio screenshot</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-block bg-black/5 text-black rounded-full w-8 h-8 flex items-center justify-center mb-4" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  3
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '0.75rem' }}>
                  See your worth, instantly
                </h4>
                <p style={{ fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.6 }}>
                  Your complete financial picture, updated in real-time. Pull to refresh anytime.
                </p>
              </div>
              <div className="flex-1 bg-[#FAFAFA] rounded-xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '0.5rem' }}>£247,450</div>
                  <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>Net worth display</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 
            className="text-center mb-4"
            style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#1A1A1A' }}
          >
            Simple, transparent pricing
          </h3>
          <p 
            className="text-center mb-12"
            style={{ fontSize: '1.125rem', color: '#6B6B6B' }}
          >
            14-day free trial. Cancel anytime.
          </p>

          <div className="flex justify-center">
            {/* Annual Only */}
            <div className="bg-white rounded-xl p-10 max-w-md w-full border border-black/8">
              <div className="text-center">
                <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6B6B6B', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Annual Subscription
                </h4>
                <div className="mb-2">
                  <span style={{ fontSize: '3.5rem', fontWeight: 300, color: '#1A1A1A', letterSpacing: '-0.03em' }}>£149</span>
                  <span style={{ fontSize: '1.125rem', color: '#6B6B6B', fontWeight: 400 }}>/year</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6B6B6B', marginBottom: '2.5rem' }}>
                  £12.42 per month
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-1 mt-0.5" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
                      <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.938rem', color: '#1A1A1A' }}>Unlimited accounts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-1 mt-0.5" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
                      <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.938rem', color: '#1A1A1A' }}>Live market prices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-1 mt-0.5" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
                      <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.938rem', color: '#1A1A1A' }}>Bank connections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-1 mt-0.5" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
                      <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.938rem', color: '#1A1A1A' }}>Priority support</span>
                  </li>
                </ul>
                <button className="w-full bg-black text-white px-6 py-3 rounded-xl transition-all hover:scale-105" style={{ fontSize: '1rem', fontWeight: 500 }}>
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 
            className="mb-6"
            style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '-0.03em', color: '#1A1A1A' }}
          >
            You've earned clarity.
          </h3>
          <p 
            className="mb-8"
            style={{ fontSize: '1.125rem', color: '#6B6B6B', lineHeight: 1.6 }}
          >
            Join thousands of professionals who chose discretion over delusion.
          </p>
          <button 
            className="bg-black text-white px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
            style={{ fontSize: '1rem', fontWeight: 500 }}
          >
            Download on the App Store
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h5 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1A1A1A' }}>Regent</h5>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>Made in London</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-black/60 hover:text-black transition-colors" style={{ fontSize: '0.875rem' }}>
                Privacy
              </a>
              <a href="#" className="text-black/60 hover:text-black transition-colors" style={{ fontSize: '0.875rem' }}>
                Terms
              </a>
              <a href="#" className="text-black/60 hover:text-black transition-colors" style={{ fontSize: '0.875rem' }}>
                Contact
              </a>
            </div>
          </div>
          <div className="text-center mt-8">
            <p style={{ fontSize: '0.813rem', color: '#6B6B6B' }}>© 2026 Regent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}