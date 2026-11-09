import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawObjects = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/objects.json'), 'utf8'));

const assetMap = {};
for (const obj of rawObjects) {
  assetMap[obj.id] = obj;
}

const PALETTES = {
  purple: {
    id: 'purple',
    name: 'Purple Mist',
    bgPrimary: '#d7cdf5',
    bgDark: '#7864d7'
  },
  peach: {
    id: 'peach',
    name: 'Warm Peach',
    bgPrimary: '#fdd7b9',
    bgDark: '#d27532'
  },
  mint: {
    id: 'mint',
    name: 'Fresh Mint',
    bgPrimary: '#beebeb',
    bgDark: '#5abebe'
  }
};

const FORMATS = {
  '16:9': { width: 960, height: 540 },
  '1:1': { width: 720, height: 720 },
  '9:16': { width: 540, height: 960 },
  '4:3': { width: 800, height: 600 }
};

function adaptColor(fill, palette, isMonochrome) {
  if (!fill) return fill;
  const f = fill.toLowerCase();
  if (f === '#181817' || f === '#000000' || f === '#ffffff') return fill;

  if (isMonochrome) {
    if (['#d7cdf5', '#fdd7b9', '#beebeb', '#aa9bf0', '#fac896', '#80dada'].includes(f)) {
      return palette.bgPrimary;
    }
    return palette.bgDark;
  }

  if (['#d7cdf5', '#fdd7b9', '#beebeb'].includes(f)) return palette.bgPrimary;
  if (['#7864d7', '#d27532', '#5abebe'].includes(f)) return palette.bgDark;

  return fill;
}

function buildSVG(items, formatKey, paletteKey) {
  const cfg = FORMATS[formatKey];
  const pal = PALETTES[paletteKey];
  const W = cfg.width;
  const H = cfg.height;

  const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
    `  <defs>`,
    `    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">`,
    `      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>`,
    `    </filter>`,
    `  </defs>`,
    `  <rect width="${W}" height="${H}" rx="24" fill="${pal.bgPrimary}"/>`,
    `  <g id="composition" filter="url(#shadow)">`
  ];

  for (const item of sorted) {
    const assetId = `${item.objectType}-${item.size}-${item.state}`;
    const asset = assetMap[assetId];
    if (!asset) continue;

    const ox = asset.w / 2;
    const oy = asset.h / 2;

    lines.push(`    <!-- ${item.objectType} (${item.state}) -->`);
    lines.push(`    <g transform="translate(${item.x}, ${item.y}) rotate(${item.rotation || 0}) scale(${item.scale}) translate(-${ox}, -${oy})">`);

    const isMono = item.state === 'bg';
    for (const p of asset.paths) {
      const fill = adaptColor(p.fill, pal, isMono);
      const eo = p.eo ? ' fill-rule="evenodd"' : '';
      const op = p.op && p.op < 1 ? ` fill-opacity="${p.op}"` : '';
      lines.push(`      <path d="${p.d}" fill="${fill}"${eo}${op}/>`);
    }
    lines.push(`    </g>`);
  }

  lines.push(`  </g>`);
  lines.push(`</svg>`);
  return lines.join('\n');
}

const outDir = path.join(__dirname, '../public/samples');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Composition 1: 16:9 Banner - "Учеба и продуктивность" (Purple Mist)
const sample1 = [
  { objectType: 'notebook', size: 'L', state: 'main', x: 440, y: 280, scale: 0.28, zIndex: 20 },
  { objectType: 'phone', size: 'L', state: 'main', x: 680, y: 230, scale: 0.24, zIndex: 25 },
  { objectType: 'lamp', size: 'L', state: 'bg', x: 220, y: 190, scale: 0.26, zIndex: 10 },
  { objectType: 'pen', size: 'S', state: 'main', x: 500, y: 390, scale: 0.36, zIndex: 30 },
  { objectType: 'headphones', size: 'S', state: 'bg', x: 740, y: 350, scale: 0.32, zIndex: 15 }
];
fs.writeFileSync(path.join(outDir, 'sample-1-education-16x9.svg'), buildSVG(sample1, '16:9', 'purple'), 'utf8');

// Composition 2: 1:1 Square - "Личные финансы и инвестиции" (Warm Peach)
const sample2 = [
  { objectType: 'wallet', size: 'L', state: 'main', x: 340, y: 380, scale: 0.32, zIndex: 25 },
  { objectType: 'phone', size: 'L', state: 'main', x: 490, y: 270, scale: 0.28, zIndex: 20 },
  { objectType: 'coin', size: 'S', state: 'main', x: 240, y: 470, scale: 0.40, zIndex: 30 },
  { objectType: 'folder', size: 'L', state: 'bg', x: 220, y: 260, scale: 0.26, zIndex: 10 },
  { objectType: 'coin', size: 'S', state: 'bg', x: 530, y: 460, scale: 0.30, zIndex: 15 }
];
fs.writeFileSync(path.join(outDir, 'sample-2-finances-1x1.svg'), buildSVG(sample2, '1:1', 'peach'), 'utf8');

// Composition 3: 9:16 Story - "Запуск IT-стартапа" (Fresh Mint)
const sample3 = [
  { objectType: 'phone', size: 'L', state: 'main', x: 270, y: 420, scale: 0.30, zIndex: 20 },
  { objectType: 'puzzle', size: 'L', state: 'main', x: 200, y: 640, scale: 0.28, zIndex: 25 },
  { objectType: 'folder', size: 'L', state: 'bg', x: 350, y: 210, scale: 0.26, zIndex: 10 },
  { objectType: 'lamp', size: 'S', state: 'bg', x: 370, y: 530, scale: 0.34, zIndex: 15 },
  { objectType: 'coin', size: 'S', state: 'main', x: 340, y: 730, scale: 0.38, zIndex: 30 }
];
fs.writeFileSync(path.join(outDir, 'sample-3-startup-9x16.svg'), buildSVG(sample3, '9:16', 'mint'), 'utf8');

console.log('Successfully generated 3 pristine sample SVGs in public/samples/');
