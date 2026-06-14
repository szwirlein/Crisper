// Botanical design system — shared tokens for the Crisper app.
// Derived from the "Shopping List — Modern (Botanical)" Paper design:
// a white, card-free surface with hairline dividers, editorial typography,
// and a single moss-green accent.

export const colors = {
  // Surfaces
  background: '#ffffff',
  inputBackground: '#f5f5f5',

  // Text
  text: '#0a0a0a',
  textMuted: '#8a8a8a',
  textDisabled: '#aaaaaa',

  // Lines & controls
  border: '#f0f0f0',
  checkboxBorder: '#cccccc',

  // Brand
  accent: '#4e7c5f',
  accentText: '#ffffff',
} as const;

export const spacing = {
  screenX: 24,
  rowY: 14,
} as const;

export const radius = {
  input: 12,
  button: 14,
} as const;

// Editorial type scale. Sizes in px, letterSpacing/lineHeight tuned to the design.
export const typography = {
  // Large editorial screen title (wraps to two lines like the design).
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
    color: colors.text,
  },
  // Big green metric (e.g. items remaining / recipe count).
  counter: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.accent,
  },
  // Uppercase, wide-tracked section + meta labels.
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  },
  // Default body / list item text.
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  // Recipe row title.
  rowTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    color: colors.text,
  },
} as const;

export const theme = { colors, spacing, radius, typography };
export default theme;
