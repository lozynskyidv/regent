/**
 * Design System: Spacing
 * Consistent spacing scale for margins, padding, gaps
 */

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export type SpacingKey = keyof typeof Spacing;
