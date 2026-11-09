export interface Palette {
  id: string;
  name: string;
  nameRu: string;
  bgPrimary: string;
  bgLight: string;
  bgDark: string;
  accentColors: string[];
  outlineColor: string;
}

export const DEFAULT_PALETTES: Record<string, Palette> = {
  purple: {
    id: 'purple',
    name: 'Purple Mist',
    nameRu: 'Фиолетовая',
    bgPrimary: '#d7cdf5',
    bgLight: '#ece7fb',
    bgDark: '#7864d7',
    accentColors: ['#f9ecb0', '#f9a3aa', '#aa9bf0', '#b6c6fe'],
    outlineColor: '#181817'
  },
  peach: {
    id: 'peach',
    name: 'Warm Peach',
    nameRu: 'Персиковая',
    bgPrimary: '#fdd7b9',
    bgLight: '#ffefe3',
    bgDark: '#d27532',
    accentColors: ['#f9ecb0', '#fac896', '#f9a3aa', '#5abebe'],
    outlineColor: '#181817'
  },
  mint: {
    id: 'mint',
    name: 'Fresh Mint',
    nameRu: 'Мятная',
    bgPrimary: '#beebeb',
    bgLight: '#e4f7f7',
    bgDark: '#5abebe',
    accentColors: ['#f9ecb0', '#80dada', '#f9a3aa', '#aa9bf0'],
    outlineColor: '#181817'
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
 * - Outlines (#181817) and neutral highlights (#ffffff) remain pure.
 */
export function adaptColorToPalette(
  fill: string,
  palette: Palette,
  isMonochrome: boolean
): string {
  if (!fill) return fill;
  const f = fill.toLowerCase();
  
  // Preserve pure black/dark outline and pure white
  if (f === '#181817' || f === '#000000' || f === '#ffffff') {
    return fill;
  }
  
  if (isMonochrome) {
    // Monochrome objects use shades of the active background palette
    if (
      f === '#d7cdf5' ||
      f === '#fdd7b9' ||
      f === '#beebeb' ||
      f === '#aa9bf0' ||
      f === '#fac896' ||
      f === '#80dada'
    ) {
      return palette.bgPrimary;
    }
    if (
      f === '#7864d7' ||
      f === '#d27532' ||
      f === '#5abebe' ||
      f === '#6d7bfc'
    ) {
      return palette.bgDark;
    }
    return palette.bgDark;
  }
  
  // For main (color) objects:
  if (f === '#d7cdf5' || f === '#fdd7b9' || f === '#beebeb') {
    return palette.bgPrimary;
  }
  if (f === '#7864d7' || f === '#d27532' || f === '#5abebe') {
    return palette.bgDark;
  }
  
  return fill;
}
