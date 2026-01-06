/**
 * Design System: Colors
 * Ported from web prototype CSS variables
 */

export const Colors = {
  // Base colors
  background: '#FAFAFA',
  foreground: '#1A1A1A',
  
  // Card colors
  card: '#FFFFFF',
  cardForeground: '#1A1A1A',
  
  // Primary (dark for buttons/CTAs)
  primary: '#1A1A1A',
  primaryForeground: '#FFFFFF',
  
  // Secondary (light backgrounds)
  secondary: '#F5F5F5',
  secondaryForeground: '#1A1A1A',
  
  // Muted (subtle backgrounds and text)
  muted: '#F5F5F5',
  mutedForeground: '#6B6B6B',
  
  // Accent
  accent: '#E8E8E8',
  accentForeground: '#1A1A1A',
  
  // Semantic colors
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  success: '#16A34A',
  successForeground: '#FFFFFF',
  
  // Borders and inputs
  border: 'rgba(0, 0, 0, 0.08)',
  input: 'transparent',
  inputBackground: '#F5F5F5',
  
  // Ring (focus states)
  ring: 'rgba(26, 26, 26, 0.2)',
  
  // Chart colors (for performance graphs)
  chart1: '#64748B',
  chart2: '#94A3B8',
  chart3: '#CBD5E1',
  chart4: '#E2E8F0',
  chart5: '#F1F5F9',
  
  // Utility colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Opacity variants (for overlays)
  blackOverlay: 'rgba(0, 0, 0, 0.6)',
  whiteOverlay: 'rgba(255, 255, 255, 0.9)',
} as const;

export type ColorKey = keyof typeof Colors;
