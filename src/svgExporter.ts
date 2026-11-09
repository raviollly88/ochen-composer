import type { CanvasFormat, CanvasItem, AssetMeta } from './types';
import { FORMATS } from './types';
import type { Palette } from './palettes';
import { adaptColorToPalette } from './palettes';

export function buildStandaloneSVG(
  items: CanvasItem[],
  format: CanvasFormat,
  palette: Palette,
  assetMap: Record<string, AssetMeta>
): string {
  const cfg = FORMATS[format];
  const W = cfg.width;
  const H = cfg.height;

  // Sort by zIndex
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
    `  <defs>`,
    `    <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">`,
    `      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>`,
    `    </filter>`,
    `  </defs>`,
    `  <!-- Canvas Background -->`,
    `  <rect width="${W}" height="${H}" rx="24" fill="${palette.bgPrimary}"/>`,
    `  <!-- Composition Elements -->`,
    `  <g id="composition-layer">`
  ];

  for (const item of sortedItems) {
    const assetId = `${item.objectType}-${item.size}-${item.state}`;
    const asset = assetMap[assetId];
    if (!asset) continue;

    // In SVG, translate to item.x, item.y and scale/rotate around center
    const ox = asset.w / 2;
    const oy = asset.h / 2;

    lines.push(`    <!-- Object: ${item.objectType} (${item.state}) -->`);
    lines.push(`    <g transform="translate(${item.x}, ${item.y}) rotate(${item.rotation}) scale(${item.scale}) translate(-${ox}, -${oy})">`);

    const isMonochrome = item.state === 'bg';
    for (const p of asset.paths) {
      const fill = adaptColorToPalette(p.fill, palette, isMonochrome);
      const eo = p.eo ? ` fill-rule="evenodd"` : '';
      const op = p.op && p.op < 1 ? ` fill-opacity="${p.op}"` : '';
      lines.push(`      <path d="${p.d}" fill="${fill}"${eo}${op}/>`);
    }

    lines.push(`    </g>`);
  }

  lines.push(`  </g>`);
  lines.push(`</svg>`);

  return lines.join('\n');
}

export function downloadSVG(svgContent: string, filename: string = 'ochen-composition.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
