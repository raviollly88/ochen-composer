import type { CanvasFormat, CanvasItem, DetailSize, PaletteId } from './types';
import { FORMATS, OBJECT_CATALOG } from './types';
import rawObjects from './data/objects.json';

export interface AICompositionResult {
  title: string;
  matchedTheme: string;
  recommendedPalette: PaletteId;
  items: CanvasItem[];
  rationale: string;
}

export interface PresetTheme {
  title: string;
  description: string;
  prompt: string;
  palette: PaletteId;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    title: 'Музыка и отдых',
    description: 'Наушники на первом плане и ваза с цветами в фоне (эталон студии)',
    prompt: 'музыка звук аудио подкаст релакс отдых плейлист вайб',
    palette: 'purple'
  },
  {
    title: 'Конспекты и продуктивность',
    description: 'Открытый блокнот, смартфон на странице и ручка перед закладкой',
    prompt: 'конспекты учеба продуктивность блокнот лекции знания фокус',
    palette: 'purple'
  },
  {
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, папка документов и монета на переднем плане',
    prompt: 'финансы деньги кошелек бюджет сбережения банк инвестиции',
    palette: 'peach'
  },
  {
    title: 'IT-стартап и продукт',
    description: 'Смартфон с мобильным приложением и пазлы сборки архитектуры',
    prompt: 'стартап технологии приложение код сборка пазл команда разработка',
    palette: 'mint'
  },
  {
    title: 'Рабочее пространство',
    description: 'Настольная лампа в фоне, открытый блокнот и ручка для подписи',
    prompt: 'рабочее место офис организация лампа документы отчет порядок',
    palette: 'purple'
  }
];

// Map asset dimensions for boundary calculations
const assetDimensions: Record<string, { w: number; h: number }> = {};
for (const obj of rawObjects as { id: string; w: number; h: number }[]) {
  assetDimensions[obj.id] = { w: obj.w, h: obj.h };
}

/**
 * Natural pairings from studio design guidelines:
 * Guarantees every single subject always has an aesthetically harmonious
 * background companion and/or foreground detail (2 to 3 objects total).
 */
const NATURAL_COMPANIONS: Record<string, { bg: string; accent: string }> = {
  notebook: { bg: 'lamp', accent: 'pen' },
  phone: { bg: 'flowers', accent: 'puzzle' },
  headphones: { bg: 'flowers', accent: 'puzzle' },
  wallet: { bg: 'folder', accent: 'coin' },
  folder: { bg: 'lamp', accent: 'wallet' },
  lamp: { bg: 'folder', accent: 'pen' },
  flowers: { bg: 'folder', accent: 'headphones' },
  puzzle: { bg: 'flowers', accent: 'phone' },
  coin: { bg: 'folder', accent: 'wallet' },
  pen: { bg: 'lamp', accent: 'notebook' },
};

// Deterministic string hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Automatically fits and centers all items within the canvas safe bounds,
 * preserving exact relative proportions and preventing any clipping across all formats.
 */
export function fitAndCenterScene(
  items: CanvasItem[],
  format: CanvasFormat,
  margin: number = 50
): CanvasItem[] {
  if (items.length === 0) return items;
  const cfg = FORMATS[format];
  const W = cfg.width;
  const H = cfg.height;
  const cx = W / 2;
  const cy = H / 2;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const it of items) {
    const assetId = `${it.objectType}-${it.size}-${it.state}`;
    const dims = assetDimensions[assetId] || { w: 500, h: 400 };
    const w = dims.w * it.scale;
    const h = dims.h * it.scale;
    minX = Math.min(minX, it.x - w / 2);
    minY = Math.min(minY, it.y - h / 2);
    maxX = Math.max(maxX, it.x + w / 2);
    maxY = Math.max(maxY, it.y + h / 2);
  }

  const totalW = maxX - minX;
  const totalH = maxY - minY;
  const maxAllowedW = W - 2 * margin;
  const maxAllowedH = H - 2 * margin;

  let scaleFactor = 1.0;
  if (totalW > maxAllowedW || totalH > maxAllowedH) {
    scaleFactor = Math.min(maxAllowedW / totalW, maxAllowedH / totalH);
  }

  const compCenterX = (minX + maxX) / 2;
  const compCenterY = (minY + maxY) / 2;

  return items.map(it => ({
    ...it,
    scale: Math.round(it.scale * scaleFactor * 1000) / 1000,
    x: Math.round(cx + (it.x - compCenterX) * scaleFactor),
    y: Math.round(cy + (it.y - compCenterY) * scaleFactor),
  }));
}

/**
 * Dynamically analyzes ANY user prompt, extracts semantic keywords,
 * ranks all 10 objects, and produces a laconic 2-3 object composition.
 */
export function generateCompositionFromPrompt(
  prompt: string,
  format: CanvasFormat,
  _detailSize: DetailSize = 'L'
): AICompositionResult {
  const pLower = prompt.toLowerCase().trim();
  const formatConfig = FORMATS[format];
  const W = formatConfig.width;
  const H = formatConfig.height;
  const cx = Math.round(W / 2);
  const cy = Math.round(H / 2);

  // 1. Semantic scoring across all 10 library objects
  const scores: Record<string, { score: number; matchedWords: string[] }> = {};
  for (const [key, meta] of Object.entries(OBJECT_CATALOG)) {
    scores[key] = { score: 0, matchedWords: [] };

    // Check direct object name or Russian label
    if (pLower.includes(key) || pLower.includes(meta.labelRu.toLowerCase())) {
      scores[key].score += 20;
      scores[key].matchedWords.push(meta.labelRu);
    }

    // Check tags / stems
    for (const tag of meta.tags) {
      if (pLower.includes(tag)) {
        scores[key].score += 8;
        if (!scores[key].matchedWords.includes(tag)) {
          scores[key].matchedWords.push(tag);
        }
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
  const matched = sorted.filter(([_, s]) => s.score > 0);
  const allDetectedTags = Array.from(
    new Set(sorted.flatMap(([_, s]) => s.matchedWords))
  );

  let heroKey = '';
  let bgKey: string | null = null;
  let accentKey: string | null = null;

  if (matched.length > 0) {
    const matchedKeys = matched.map(([k]) => k);

    // If lamp is matched together with a primary subject, lamp should be background!
    const hasLamp = matchedKeys.includes('lamp');
    const hasFlowers = matchedKeys.includes('flowers');
    const hasFolder = matchedKeys.includes('folder');

    // Find primary subject candidates
    const primaryCandidates = matchedKeys.filter(k =>
      ['notebook', 'headphones', 'wallet', 'phone'].includes(k)
    );

    if (primaryCandidates.length > 0) {
      heroKey = primaryCandidates[0];
    } else {
      heroKey = matchedKeys[0];
    }

    // Assign background object
    if (hasLamp && heroKey !== 'lamp') {
      bgKey = 'lamp';
    } else if (hasFlowers && heroKey !== 'flowers') {
      bgKey = 'flowers';
    } else if (hasFolder && heroKey !== 'folder') {
      bgKey = 'folder';
    } else if (matchedKeys.length > 1) {
      const second = matchedKeys.find(k => k !== heroKey);
      if (second && ['lamp', 'flowers', 'folder', 'notebook'].includes(second)) {
        bgKey = second;
      }
    }

    // Assign accent object
    const accentCandidate = matchedKeys.find(k =>
      ['coin', 'pen', 'puzzle'].includes(k) && k !== heroKey && k !== bgKey
    );
    if (accentCandidate) {
      accentKey = accentCandidate;
    } else if (heroKey === 'notebook' && matchedKeys.includes('phone')) {
      accentKey = 'phone';
    }

    // GUARANTEE: Never only 1 object! Always 2 to 3 objects!
    if (!bgKey && !accentKey) {
      const companions = NATURAL_COMPANIONS[heroKey] || { bg: 'flowers', accent: 'puzzle' };
      bgKey = companions.bg;
      accentKey = companions.accent;
    } else if (!bgKey) {
      const companions = NATURAL_COMPANIONS[heroKey] || { bg: 'flowers', accent: 'puzzle' };
      bgKey = companions.bg;
    }
  } else {
    // Novel / unknown prompt: use deterministic hash to select distinct harmonious presets
    const hash = hashString(pLower || 'default');
    const presets = [
      { hero: 'headphones', bg: 'flowers', accent: 'puzzle' },
      { hero: 'notebook', bg: 'lamp', accent: 'pen' },
      { hero: 'wallet', bg: 'folder', accent: 'coin' },
      { hero: 'phone', bg: 'flowers', accent: 'puzzle' },
    ];
    const picked = presets[hash % presets.length];
    heroKey = picked.hero;
    bgKey = picked.bg;
    accentKey = picked.accent;
  }

  // Determine palette dynamically
  let recPalette: PaletteId = 'purple';
  if (
    pLower.includes('деньги') ||
    pLower.includes('финанс') ||
    pLower.includes('банк') ||
    pLower.includes('бюджет') ||
    pLower.includes('кошелек') ||
    pLower.includes('инвест') ||
    pLower.includes('монет') ||
    pLower.includes('золот') ||
    pLower.includes('тепл') ||
    pLower.includes('персик') ||
    heroKey === 'wallet' ||
    heroKey === 'coin'
  ) {
    recPalette = 'peach';
  } else if (
    pLower.includes('стартап') ||
    pLower.includes('технолог') ||
    pLower.includes('приложен') ||
    pLower.includes('код') ||
    pLower.includes('сборк') ||
    pLower.includes('пазл') ||
    pLower.includes('свеж') ||
    pLower.includes('мят') ||
    pLower.includes('природ') ||
    heroKey === 'puzzle'
  ) {
    recPalette = 'mint';
  }

  // 2. Select appropriate asset detail size (L vs S) to match studio proportions
  // S is used for background items and items resting on other items to avoid clipping
  const rawItems: CanvasItem[] = [];
  const now = Date.now();

  // Background Item (depth)
  if (bgKey) {
    const bgDetailSize: DetailSize =
      ['lamp', 'folder', 'flowers', 'notebook'].includes(bgKey) ? 'S' : 'S';

    let bgX = cx - 120;
    let bgY = cy - 140;

    if (format === '16:9') {
      bgX = cx - 260;
      bgY = cy - 70;
    } else if (format === '9:16') {
      bgX = cx;
      bgY = cy - 220;
    } else if (format === '4:3') {
      bgX = cx - 160;
      bgY = cy - 90;
    }

    rawItems.push({
      id: `item-${now}-bg`,
      objectType: bgKey,
      size: bgDetailSize,
      state: 'bg',
      x: bgX,
      y: bgY,
      scale: 0.90,
      rotation: 0,
      zIndex: 5
    });
  }

  // Hero Item (foreground subject)
  const heroDetailSize: DetailSize =
    heroKey === 'notebook' && (bgKey || accentKey) ? 'S' : 'L';

  let heroX = bgKey ? cx + 50 : cx;
  let heroY = bgKey ? cy + 50 : cy;

  if (format === '16:9') {
    heroX = bgKey ? cx + 90 : cx;
    heroY = bgKey ? cy + 40 : cy;
  } else if (format === '9:16') {
    heroX = cx;
    heroY = bgKey ? cy + 50 : cy;
  } else if (format === '4:3') {
    heroX = bgKey ? cx + 60 : cx;
    heroY = bgKey ? cy + 40 : cy;
  }

  rawItems.push({
    id: `item-${now}-hero`,
    objectType: heroKey,
    size: heroDetailSize,
    state: 'main',
    x: heroX,
    y: heroY,
    scale: 0.90,
    rotation: 0,
    zIndex: 20
  });

  // Accent / Companion Item
  if (accentKey) {
    if (heroKey === 'notebook' && accentKey === 'phone') {
      // Special studio case: phone rests on the right page of the notebook
      rawItems.push({
        id: `item-${now}-accent`,
        objectType: 'phone',
        size: 'S',
        state: 'main',
        x: heroX + 130,
        y: heroY - 30,
        scale: 0.85,
        rotation: 0,
        zIndex: 25
      });
    } else {
      let accX = heroX - 70;
      let accY = heroY + 150;

      if (format === '16:9') {
        accX = heroX - 50;
        accY = heroY + 140;
      } else if (format === '9:16') {
        accX = cx - 30;
        accY = heroY + 240;
      } else if (format === '4:3') {
        accX = heroX - 50;
        accY = heroY + 140;
      }

      rawItems.push({
        id: `item-${now}-accent`,
        objectType: accentKey,
        size: 'S',
        state: 'main',
        x: accX,
        y: accY,
        scale: 0.95,
        rotation: 0,
        zIndex: 30
      });
    }
  }

  // 3. Auto-fit and center: strictly eliminates all clipping across any screen/format
  const finalItems = fitAndCenterScene(rawItems, format, 50);

  // Construct transparent rationale
  const heroLabel = OBJECT_CATALOG[heroKey]?.labelRu || heroKey;
  const bgLabel = bgKey ? OBJECT_CATALOG[bgKey]?.labelRu : null;
  const accentLabel = accentKey ? OBJECT_CATALOG[accentKey]?.labelRu : null;

  let rationaleText = '';
  if (allDetectedTags.length > 0) {
    rationaleText = `Выделены ключевые понятия: «${allDetectedTags.slice(0, 4).join(', ')}». `;
  }
  rationaleText += `Главный объект: ${heroLabel} (полноцветный фокус сцены).`;
  if (bgLabel) {
    rationaleText += ` В глубине добавлен фон: ${bgLabel} (монохром в тоне палитры).`;
  }
  if (accentLabel) {
    rationaleText += ` Добавлена деталь: ${accentLabel}.`;
  }

  return {
    title: prompt,
    matchedTheme: [heroLabel, bgLabel, accentLabel].filter(Boolean).join(' + '),
    recommendedPalette: recPalette,
    items: finalItems,
    rationale: rationaleText
  };
}

/**
 * Scenario 2: Groups manually selected components into a clean, laconic composition (2-3 items).
 */
export function generateCompositionFromComponents(
  componentNames: string[],
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): CanvasItem[] {
  const cfg = FORMATS[format];
  const cx = Math.round(cfg.width / 2);
  const cy = Math.round(cfg.height / 2);

  const validKeys = componentNames.filter(name => OBJECT_CATALOG[name]);
  if (validKeys.length === 0) return [];

  const items: CanvasItem[] = [];
  const now = Date.now();

  // If 1 item selected: automatically pair it with a natural companion (2 items total)
  if (validKeys.length === 1) {
    const hero = validKeys[0];
    const companions = NATURAL_COMPANIONS[hero] || { bg: 'flowers', accent: 'puzzle' };
    const bg = companions.bg;

    items.push({
      id: `item-batch-${now}-bg`,
      objectType: bg,
      size: ['lamp', 'folder', 'flowers', 'notebook'].includes(bg) ? 'S' : detailSize,
      state: 'bg',
      x: cx - 120,
      y: cy - 140,
      scale: 0.90,
      rotation: 0,
      zIndex: 5
    });

    items.push({
      id: `item-batch-${now}-hero`,
      objectType: hero,
      size: hero === 'notebook' ? 'S' : detailSize,
      state: 'main',
      x: cx + 50,
      y: cy + 50,
      scale: 0.90,
      rotation: 0,
      zIndex: 20
    });

    return fitAndCenterScene(items, format, 50);
  }

  // If 2 items selected: 1 Background + 1 Hero
  if (validKeys.length === 2) {
    const bgTypes = ['lamp', 'flowers', 'folder'];
    const isFirstBg = bgTypes.includes(validKeys[0]) && !bgTypes.includes(validKeys[1]);
    const bg = isFirstBg ? validKeys[0] : validKeys[1];
    const hero = isFirstBg ? validKeys[1] : validKeys[0];

    items.push({
      id: `item-batch-${now}-bg`,
      objectType: bg,
      size: ['lamp', 'folder', 'flowers', 'notebook'].includes(bg) ? 'S' : detailSize,
      state: 'bg',
      x: cx - 120,
      y: cy - 140,
      scale: 0.90,
      rotation: 0,
      zIndex: 5
    });

    items.push({
      id: `item-batch-${now}-hero`,
      objectType: hero,
      size: hero === 'notebook' ? 'S' : detailSize,
      state: 'main',
      x: cx + 50,
      y: cy + 50,
      scale: 0.90,
      rotation: 0,
      zIndex: 20
    });

    return fitAndCenterScene(items, format, 50);
  }

  // If 3+ items: Keep 3 items (Hero, Background, Accent)
  const bgTypes = ['lamp', 'flowers', 'folder'];
  const bgCandidate = validKeys.find(k => bgTypes.includes(k)) || validKeys[1];
  const accentCandidate = validKeys.find(k => ['coin', 'pen', 'puzzle'].includes(k) && k !== bgCandidate) || validKeys[2];
  const heroCandidate = validKeys.find(k => k !== bgCandidate && k !== accentCandidate) || validKeys[0];

  items.push({
    id: `item-batch-${now}-bg`,
    objectType: bgCandidate,
    size: ['lamp', 'folder', 'flowers', 'notebook'].includes(bgCandidate) ? 'S' : detailSize,
    state: 'bg',
    x: cx - 120,
    y: cy - 140,
    scale: 0.90,
    rotation: 0,
    zIndex: 5
  });

  items.push({
    id: `item-batch-${now}-hero`,
    objectType: heroCandidate,
    size: heroCandidate === 'notebook' ? 'S' : detailSize,
    state: 'main',
    x: cx + 50,
    y: cy + 50,
    scale: 0.90,
    rotation: 0,
    zIndex: 20
  });

  items.push({
    id: `item-batch-${now}-accent`,
    objectType: accentCandidate,
    size: 'S',
    state: 'main',
    x: cx - 70,
    y: cy + 150,
    scale: 0.95,
    rotation: 0,
    zIndex: 30
  });

  return fitAndCenterScene(items, format, 50);
}
