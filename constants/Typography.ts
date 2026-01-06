/**
 * Design System: Typography
 * Font sizes, weights, line heights, letter spacing
 */

export const FontSizes = {
  // Display (large numbers like net worth)
  displayLarge: 56,
  displayMedium: 48,
  
  // Headings
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  
  // Body text
  bodyLarge: 18,
  bodyRegular: 16,
  bodySmall: 14,
  bodyTiny: 12,
  
  // Labels
  label: 15,
  labelSmall: 13,
  caption: 11,
} as const;

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const LineHeights = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.6,
};

export const LetterSpacing = {
  tight: -1.6,
  normal: 0,
  wide: 0.5,
};

// Typography presets (combine size, weight, line height)
export const Typography = {
  // Display styles (for net worth, large numbers)
  displayLarge: {
    fontSize: FontSizes.displayLarge,
    fontWeight: FontWeights.light,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSizes.displayLarge * LineHeights.tight,
  },
  
  // Heading styles
  h1: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.medium,
    letterSpacing: -0.64,
    lineHeight: FontSizes.h1 * LineHeights.snug,
  },
  h2: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.medium,
    letterSpacing: -0.24,
    lineHeight: FontSizes.h2 * LineHeights.snug,
  },
  h3: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h3 * LineHeights.normal,
  },
  
  // Body styles
  bodyLarge: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodyLarge * LineHeights.normal,
  },
  body: {
    fontSize: FontSizes.bodyRegular,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodyRegular * LineHeights.relaxed,
  },
  bodySmall: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
  },
  
  // Label styles
  label: {
    fontSize: FontSizes.label,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.label * LineHeights.normal,
  },
  labelUppercase: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    textTransform: 'uppercase' as const,
  },
  
  // Button styles
  button: {
    fontSize: FontSizes.bodyRegular,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodyRegular * LineHeights.normal,
  },
  buttonLarge: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodyLarge * LineHeights.normal,
  },
} as const;
