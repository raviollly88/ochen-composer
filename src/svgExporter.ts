import type { CanvasFormat, CanvasItem, AssetMeta } from './types';
import { FORMATS } from './types';
import type { Palette } from './palettes';
import { adaptColorToPalette } from './palettes';
import { getBackgroundDecorSVG } from './components/BackgroundDecor';

export function buildStandaloneSVG(
  items: CanvasItem[],
  format: CanvasFormat,
  palette: Palette,
  assetMap: Record<string, AssetMeta>,
  showDecor: boolean = true
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
    `    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">`,
    `      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>`,
    `    </filter>`,
    `    <clipPath id="card-frame-clip">`,
    `      <rect width="${W}" height="${H}" rx="20"/>`,
    `    </clipPath>`,
    `  </defs>`,
    `  <!-- Canvas Background -->`,
    `  <rect width="${W}" height="${H}" rx="20" fill="${palette.bgPrimary}"/>`,
    `  <g clip-path="url(#card-frame-clip)">`
  ];

  if (showDecor) {
    lines.push(getBackgroundDecorSVG(W, H, palette));
  }

  lines.push(`    <!-- Composition Elements -->`);
  lines.push(`    <g id="composition-layer" filter="url(#card-shadow)">`);

  for (const item of sortedItems) {
    const itemSize = item.size || 'L';
    const assetId = `${item.objectType}-${itemSize}-${item.state}`;
    const asset = assetMap[assetId] || assetMap[`${item.objectType}-L-${item.state}`] || assetMap[`${item.objectType}-L-main`];
    if (!asset) continue;

    // In SVG, translate to item.x, item.y and scale/rotate around center
    const ox = asset.w / 2;
    const oy = asset.h / 2;

    lines.push(`      <!-- Object: ${item.objectType} (${item.state}) -->`);
    lines.push(`      <g transform="translate(${item.x}, ${item.y}) rotate(${item.rotation}) scale(${item.scale}) translate(-${ox}, -${oy})">`);

    const isMonochrome = item.state === 'bg';
    for (const p of asset.paths) {
      const fill = adaptColorToPalette(p.fill, palette, isMonochrome);
      const eo = p.eo ? ` fill-rule="evenodd"` : '';
      const op = p.op && p.op < 1 ? ` fill-opacity="${p.op}"` : '';
      lines.push(`        <path d="${p.d}" fill="${fill}"${eo}${op}/>`);
    }

    lines.push(`      </g>`);
  }

  lines.push(`    </g>`);
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
