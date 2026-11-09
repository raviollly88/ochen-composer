import type { CanvasFormat, CanvasItem, AssetMeta } from './types';
import { FORMATS } from './types';
import type { Palette } from './palettes';
import { adaptColorToPalette } from './palettes';

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
  const cx = W / 2;
  const cy = H / 2;
  const strokeColor = palette.bgDark;

  // Sort by zIndex
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
    `  <defs>`,
    `    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">`,
    `      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>`,
    `    </filter>`,
    `  </defs>`,
    `  <!-- Canvas Background -->`,
    `  <rect width="${W}" height="${H}" rx="20" fill="${palette.bgPrimary}"/>`
  ];

  if (showDecor) {
    lines.push(`  <!-- Studio Ochen Background Decorative Scratches & Accents -->`);
    lines.push(`  <g id="background-decor">`);
    lines.push(`    <line x1="${cx - 380}" y1="${cy + 80}" x2="${cx - 60}" y2="${cy - 105}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>`);
    lines.push(`    <line x1="${cx - 260}" y1="${cy - 160}" x2="${cx - 150}" y2="${cy - 223}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>`);
    lines.push(`    <line x1="${cx + 120}" y1="${cy + 170}" x2="${cx + 200}" y2="${cy + 124}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>`);
    lines.push(`    <ellipse cx="${cx - 140}" cy="${cy - 40}" rx="90" ry="42" fill="${strokeColor}" opacity="0.12"/>`);
    lines.push(`    <!-- Signature Corner Pills -->`);
    lines.push(`    <g transform="translate(75, ${H - 65})">`);
    lines.push(`      <ellipse cx="20" cy="22" rx="28" ry="14" fill="${strokeColor}" opacity="0.65"/>`);
    lines.push(`      <ellipse cx="44" cy="10" rx="28" ry="14" fill="#ffffff" opacity="0.95"/>`);
    lines.push(`    </g>`);
    lines.push(`  </g>`);
  }

  lines.push(`  <!-- Composition Elements -->`);
  lines.push(`  <g id="composition-layer" filter="url(#card-shadow)">`);

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
