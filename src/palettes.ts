export interface Palette {
  id: string;
  name: string;
  nameRu: string;
  bgPrimary: string;
  bgMedium?: string;
  bgDark: string;
  bgLight?: string;
  accentYellow?: string;
  accentCoral?: string;
  accentPale?: string;
  accentColors: string[];
  outlineColor: string;
}

/**
 * Official Studio Ochen palette specifications extracted directly from the guide (e924d3b8.pdf Page 0):
 * - Purple Mist: Base purple with yellow/coral/pale pink accents
 * - Warm Peach: Warm peach with yellow/turquoise/pale mint accents
 * - Fresh Mint: Fresh cyan with lavender-pink/indigo-blue/soft sky-blue accents
 */
export const DEFAULT_PALETTES: Record<string, Palette> = {
  purple: {
    id: 'purple',
    name: 'Purple Mist',
    nameRu: 'Фиолетовая',
    bgPrimary: '#d6cdf4',
    bgMedium: '#aa9aef',
    bgDark: '#7764d6',
    bgLight: '#ece7fb',
    accentYellow: '#f9ebaf',
    accentCoral: '#f9a3aa',
    accentPale: '#ffe2e1',
    accentColors: ['#f9ebaf', '#f9a3aa', '#aa9aef', '#ffe2e1'],
    outlineColor: '#181816'
  },
  peach: {
    id: 'peach',
    name: 'Warm Peach',
    nameRu: 'Персиковая',
    bgPrimary: '#fdd6b8',
    bgMedium: '#f9c895',
    bgDark: '#d17431',
    bgLight: '#ffefe3',
    accentYellow: '#f9ebaf',
    accentCoral: '#80dada',
    accentPale: '#bdebeb',
    accentColors: ['#f9ebaf', '#80dada', '#f9c895', '#bdebeb'],
    outlineColor: '#181816'
  },
  mint: {
    id: 'mint',
    name: 'Fresh Mint',
    nameRu: 'Мятная',
    bgPrimary: '#bdeaea',
    bgMedium: '#7fdada',
    bgDark: '#59bdbd',
    bgLight: '#e4f7f7',
    accentYellow: '#ffd3f1',
    accentCoral: '#6d7bfb',
    accentPale: '#b6c6fd',
    accentColors: ['#ffd3f1', '#6d7bfb', '#7fdada', '#b6c6fd'],
    outlineColor: '#181816'
  }
};

/**
 * Backward compatibility alias
 */
export const PALETTES = DEFAULT_PALETTES;

/**
 * Recolors an SVG fill color according to the active palette.
 * Strictly adheres to Studio Ochen's color specification:
 * - Background colors adapt to selected theme.
 * - Monochrome objects map dark/light fills to theme dark/light.
 * - Outlines (#181816) and neutral highlights (#ffffff) remain pure.
 * - Object accents recolor dynamically:
 *   Coral Pink (#f9a3aa) -> Turquoise (#80dada) in Peach, Indigo (#6d7bfb) in Mint!
 *   Pale Pink (#ffe2e1) -> Pale Mint (#bdebeb) in Peach, Sky Blue (#b6c6fd) in Mint!
 *   Yellow (#f9ebaf) -> stays yellow in Peach, becomes Lavender-Pink (#ffd3f1) in Mint!
 */
export function adaptColorToPalette(
  fill: string,
  palette: Palette,
  isMonochrome: boolean
): string {
  if (!fill) return fill;
  const f = fill.toLowerCase();

  // Preserve pure black/dark outline and pure white highlights
  if (f === '#181816' || f === '#181817' || f === '#000000' || f === '#ffffff') {
    return fill;
  }

  // 1. Monochrome objects (background depth): use shades of the active background palette
  if (isMonochrome) {
    if (
      [
        '#d6cdf4', '#d7cdf5', '#fdd6b8', '#fdd7b9', '#bdeaea', '#beebeb',
        '#ffe2e1', '#ffe3e1', '#bdebeb', '#b6c6fd', '#fce4a6', '#f9ebaf', '#f9ecb0'
      ].includes(f)
    ) {
      return palette.bgPrimary;
    }
    if (
      [
        '#aa9aef', '#aa9bf0', '#f9c895', '#fac896', '#7fdada', '#80dada',
        '#f9a3aa', '#f48c8c'
      ].includes(f)
    ) {
      return palette.bgMedium || palette.bgPrimary;
    }
    return palette.bgDark;
  }

  // 2. MAIN (Color) objects:
  // Background tones inside main objects
  if (['#d6cdf4', '#d7cdf5', '#fdd6b8', '#fdd7b9', '#bdeaea', '#beebeb'].includes(f)) {
    return palette.bgPrimary;
  }
  if (['#aa9aef', '#aa9bf0', '#f9c895', '#fac896', '#7fdada', '#80dada'].includes(f)) {
    return palette.bgMedium || palette.bgPrimary;
  }
  if (['#7764d6', '#7864d7', '#d17431', '#d27532', '#59bdbd', '#5abebe'].includes(f)) {
    return palette.bgDark;
  }

  // Object Accents:
  // Yellow / Cream
  if (['#f9ebaf', '#fce4a6', '#f9ecb0'].includes(f)) {
    return palette.accentYellow || palette.accentColors?.[0] || '#f9ebaf';
  }
  // Coral Pink -> Turquoise in Peach, Indigo in Mint!
  if (['#f9a3aa', '#f48c8c', '#f28585', '#6d7bfb', '#80dada'].includes(f)) {
    return palette.accentCoral || palette.accentColors?.[1] || '#f9a3aa';
  }
  // Pale Pink -> Pale Mint in Peach, Sky Blue in Mint!
  if (['#ffe2e1', '#ffe3e1', '#ffd4f2', '#ffd3f1', '#fbe6e6', '#fac8d4', '#bdebeb', '#b6c6fd'].includes(f)) {
    return palette.accentPale || palette.accentColors?.[3] || '#ffe2e1';
  }

  return fill;
}
