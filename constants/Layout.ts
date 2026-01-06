/**
 * Design System: Layout
 * Border radius, shadows, dimensions
 */

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8, // Android
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
} as const;

export const Layout = {
  // Screen padding
  screenHorizontal: 24,
  screenTop: 64,
  screenBottom: 48,
  
  // Card dimensions
  cardPadding: 24,
  cardGap: 16,
  
  // Button heights
  buttonHeight: 56,
  buttonHeightSmall: 48,
  
  // Input heights
  inputHeight: 56,
  
  // Safe area insets (for iPhone notch)
  safeAreaTop: 44,
  safeAreaBottom: 34,
} as const;
