// ══════════════════════════════════════════════════
// FILE: src/theme/typography.ts
// PURPOSE: SF Pro system font scale — Sachlichkeit typographic system
// ══════════════════════════════════════════════════

import type { TextStyle } from 'react-native';

export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

export const Typography = {
  display: {
    fontSize: 34,
    fontWeight: FontWeight.bold,
    lineHeight: 34 * 1.2,
    letterSpacing: 0,
  } satisfies TextStyle,
  title1: {
    fontSize: 28,
    fontWeight: FontWeight.semibold,
    lineHeight: 28 * 1.2,
    letterSpacing: 0,
  } satisfies TextStyle,
  title2: {
    fontSize: 22,
    fontWeight: FontWeight.semibold,
    lineHeight: 22 * 1.2,
    letterSpacing: 0,
  } satisfies TextStyle,
  title3: {
    fontSize: 18,
    fontWeight: FontWeight.semibold,
    lineHeight: 18 * 1.2,
    letterSpacing: 0,
  } satisfies TextStyle,
  headline: {
    fontSize: 17,
    fontWeight: FontWeight.semibold,
    lineHeight: 17 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  body: {
    fontSize: 17,
    fontWeight: FontWeight.regular,
    lineHeight: 17 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  callout: {
    fontSize: 16,
    fontWeight: FontWeight.regular,
    lineHeight: 16 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  subhead: {
    fontSize: 15,
    fontWeight: FontWeight.regular,
    lineHeight: 15 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  footnote: {
    fontSize: 13,
    fontWeight: FontWeight.regular,
    lineHeight: 13 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  caption1: {
    fontSize: 12,
    fontWeight: FontWeight.regular,
    lineHeight: 12 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
  caption2: {
    fontSize: 11,
    fontWeight: FontWeight.regular,
    lineHeight: 11 * 1.4,
    letterSpacing: 0,
  } satisfies TextStyle,
} as const;

export type TypographyKey = keyof typeof Typography;
