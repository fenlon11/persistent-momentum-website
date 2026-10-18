import brand from '@/tokens/design-tokens.json';
import site from '@/tokens/site-tokens.json';

// Token values for code that cannot read CSS variables: SVG chart props (recharts) and the
// next/og image renderer. Everything else uses the CSS variables in app/globals.css.
const p = brand.color.palette;

export const tokensVersion = brand.version;

export const palette = {
  deepNavy: p.deepNavy.hex,
  royalBlue: p.royalBlue.hex,
  electricBlue: p.electricBlue.hex,
  iceBlue: p.iceBlue.hex,
  glowWhite: p.glowWhite.hex,
  trueWhite: p.trueWhite.hex,
  midGray: p.midGray.hex,
};

export const siteColors = site.color;
