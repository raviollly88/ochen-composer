import type { CanvasFormat, CanvasItem, DetailSize, PaletteId } from './types';
import { FORMATS, OBJECT_CATALOG } from './types';

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
    description: 'Открытый блокнот, смартфон на странице и стилус перед закладкой',
    prompt: 'конспекты учеба продуктивность блокнот лекции знания фокус',
    palette: 'purple'
  },
  {
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, папка документов и монеты на переднем плане',
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
    description: 'Настольная лампа в фоне, папка документов и ручка для подписи',
    prompt: 'рабочее место офис организация лампа документы отчет порядок',
    palette: 'purple'
  }
];

// Helper to calculate deterministic hash for fallback differentiation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Dynamically analyzes ANY user prompt, extracts semantic keywords,
 * ranks all 10 objects, and produces a laconic 1-3 object composition.
 */
export function generateCompositionFromPrompt(
  prompt: string,
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
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

    // Check direct object name
    if (pLower.includes(key) || pLower.includes(meta.labelRu.toLowerCase())) {
      scores[key].score += 15;
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

  // Sort objects by score descending
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1].score - a[1].score);

  const matched = sorted.filter(([_, s]) => s.score > 0);
  const allDetectedTags = Array.from(
    new Set(sorted.flatMap(([_, s]) => s.matchedWords))
  );

  let heroKey = '';
  let bgKey: string | null = null;
  let accentKey: string | null = null;

  if (matched.length > 0) {
    heroKey = matched[0][0];

    // Select complementary background item
    if (matched.length > 1) {
      const second = matched[1][0];
      if (['lamp', 'flowers', 'folder', 'notebook'].includes(second)) {
        bgKey = second;
      } else if (['coin', 'pen', 'puzzle'].includes(second)) {
        accentKey = second;
      } else {
        bgKey = second;
      }
    }

    // Select accent item if 3rd matched or by natural affinity
    if (matched.length > 2) {
      const third = matched[2][0];
      if (['coin', 'pen', 'puzzle'].includes(third) && !accentKey) {
        accentKey = third;
      } else if (!bgKey) {
        bgKey = third;
      }
    }
  } else {
    // If prompt is completely novel or unique words not in dictionary,
    // use deterministic hash to select distinct harmonious combinations for different prompts!
    const hash = hashString(pLower || 'default');
    const heroPool = ['headphones', 'phone', 'notebook', 'wallet', 'folder', 'lamp'];
    const bgPool = ['flowers', 'lamp', 'folder', 'notebook'];
    const accentPool = ['coin', 'pen', 'puzzle'];

    heroKey = heroPool[hash % heroPool.length];
    bgKey = bgPool[(hash >> 2) % bgPool.length];
    if (bgKey === heroKey) bgKey = 'flowers';
    if (hash % 2 === 0) {
      accentKey = accentPool[(hash >> 4) % accentPool.length];
    }
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

  // 2. Procedural Laconic Isometric Layout
  // Studio Ochen style: 1 hero in foreground, 0-1 background in depth, 0-1 accent
  const items: CanvasItem[] = [];
  const now = Date.now();

  // Positioning by aspect ratio
  if (format === '16:9') {
    // Wide banner: Hero on right/center, Background on upper-left
    if (bgKey) {
      items.push({
        id: `item-${now}-bg`,
        objectType: bgKey,
        size: detailSize,
        state: 'bg',
        x: cx - 220,
        y: cy - 70,
        scale: 0.32,
        rotation: 0,
        zIndex: 5
      });
    }

    // Hero object
    const heroScale = heroKey === 'headphones' ? 0.44 : (heroKey === 'notebook' ? 0.38 : 0.36);
    const heroX = bgKey ? cx + 70 : cx;
    const heroY = bgKey ? cy + 40 : cy;
    items.push({
      id: `item-${now}-hero`,
      objectType: heroKey,
      size: detailSize,
      state: 'main',
      x: heroX,
      y: heroY,
      scale: heroScale,
      rotation: 0,
      zIndex: 20
    });

    // Special case: if hero is notebook and secondary is phone, place phone ON the page
    if (heroKey === 'notebook' && bgKey === 'phone') {
      const phoneItem = items.find(it => it.objectType === 'phone');
      if (phoneItem) {
        phoneItem.state = 'main';
        phoneItem.x = heroX + 130;
        phoneItem.y = heroY - 40;
        phoneItem.scale = 0.28;
        phoneItem.zIndex = 25;
      }
    }

    // Accent object
    if (accentKey) {
      items.push({
        id: `item-${now}-accent`,
        objectType: accentKey,
        size: 'S',
        state: 'main',
        x: heroX - 40,
        y: heroY + 110,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    }
  } else if (format === '1:1') {
    // Square format: exactly as in studio sample with Headphones + Flowers
    if (bgKey) {
      items.push({
        id: `item-${now}-bg`,
        objectType: bgKey,
        size: detailSize,
        state: 'bg',
        x: cx - 130,
        y: cy - 110,
        scale: 0.32,
        rotation: 0,
        zIndex: 5
      });
    }

    const heroScale = heroKey === 'headphones' ? 0.46 : (heroKey === 'notebook' ? 0.38 : 0.38);
    const heroX = bgKey ? cx + 50 : cx;
    const heroY = bgKey ? cy + 50 : cy + 10;
    items.push({
      id: `item-${now}-hero`,
      objectType: heroKey,
      size: detailSize,
      state: 'main',
      x: heroX,
      y: heroY,
      scale: heroScale,
      rotation: 0,
      zIndex: 20
    });

    if (heroKey === 'notebook' && bgKey === 'phone') {
      const phoneItem = items.find(it => it.objectType === 'phone');
      if (phoneItem) {
        phoneItem.state = 'main';
        phoneItem.x = heroX + 110;
        phoneItem.y = heroY - 40;
        phoneItem.scale = 0.26;
        phoneItem.zIndex = 25;
      }
    }

    if (accentKey) {
      items.push({
        id: `item-${now}-accent`,
        objectType: accentKey,
        size: 'S',
        state: 'main',
        x: heroX - 70,
        y: heroY + 110,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    }
  } else if (format === '9:16') {
    // Vertical Stories format
    if (bgKey) {
      items.push({
        id: `item-${now}-bg`,
        objectType: bgKey,
        size: detailSize,
        state: 'bg',
        x: cx,
        y: cy - 190,
        scale: 0.30,
        rotation: 0,
        zIndex: 5
      });
    }

    const heroScale = heroKey === 'headphones' ? 0.42 : 0.36;
    items.push({
      id: `item-${now}-hero`,
      objectType: heroKey,
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy + 30,
      scale: heroScale,
      rotation: 0,
      zIndex: 20
    });

    if (accentKey) {
      items.push({
        id: `item-${now}-accent`,
        objectType: accentKey,
        size: 'S',
        state: 'main',
        x: cx + 40,
        y: cy + 200,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    }
  } else {
    // 4:3 Card
    if (bgKey) {
      items.push({
        id: `item-${now}-bg`,
        objectType: bgKey,
        size: detailSize,
        state: 'bg',
        x: cx - 160,
        y: cy - 80,
        scale: 0.30,
        rotation: 0,
        zIndex: 5
      });
    }

    const heroScale = heroKey === 'headphones' ? 0.44 : 0.36;
    items.push({
      id: `item-${now}-hero`,
      objectType: heroKey,
      size: detailSize,
      state: 'main',
      x: bgKey ? cx + 50 : cx,
      y: bgKey ? cy + 40 : cy,
      scale: heroScale,
      rotation: 0,
      zIndex: 20
    });

    if (accentKey) {
      items.push({
        id: `item-${now}-accent`,
        objectType: accentKey,
        size: 'S',
        state: 'main',
        x: cx - 50,
        y: cy + 120,
        scale: 0.38,
        rotation: 0,
        zIndex: 30
      });
    }
  }

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
    items,
    rationale: rationaleText
  };
}

/**
 * Scenario 2: Groups manually selected components into a clean, laconic composition.
 */
export function generateCompositionFromComponents(
  componentNames: string[],
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): CanvasItem[] {
  const formatConfig = FORMATS[format];
  const cx = Math.round(formatConfig.width / 2);
  const cy = Math.round(formatConfig.height / 2);

  const validKeys = componentNames.filter(name => OBJECT_CATALOG[name]);
  if (validKeys.length === 0) return [];

  const items: CanvasItem[] = [];
  const now = Date.now();

  // If 1 item: large centered hero
  if (validKeys.length === 1) {
    items.push({
      id: `item-batch-${now}-0`,
      objectType: validKeys[0],
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy,
      scale: 0.42,
      rotation: 0,
      zIndex: 20
    });
    return items;
  }

  // If 2 items: 1 Hero + 1 Background (like studio sample)
  if (validKeys.length === 2) {
    const bgTypes = ['flowers', 'lamp', 'folder'];
    const isFirstBg = bgTypes.includes(validKeys[0]) && !bgTypes.includes(validKeys[1]);
    const bg = isFirstBg ? validKeys[0] : validKeys[1];
    const hero = isFirstBg ? validKeys[1] : validKeys[0];

    items.push({
      id: `item-batch-${now}-bg`,
      objectType: bg,
      size: detailSize,
      state: 'bg',
      x: cx - 140,
      y: cy - 90,
      scale: 0.32,
      rotation: 0,
      zIndex: 5
    });

    items.push({
      id: `item-batch-${now}-hero`,
      objectType: hero,
      size: detailSize,
      state: 'main',
      x: cx + 50,
      y: cy + 40,
      scale: 0.40,
      rotation: 0,
      zIndex: 20
    });
    return items;
  }

  // If 3+ items: Keep it laconic (max 3 items!)
  const hero = validKeys[0];
  const bg = validKeys[1];
  const accent = validKeys[2];

  items.push({
    id: `item-batch-${now}-bg`,
    objectType: bg,
    size: detailSize,
    state: 'bg',
    x: cx - 150,
    y: cy - 80,
    scale: 0.30,
    rotation: 0,
    zIndex: 5
  });

  items.push({
    id: `item-batch-${now}-hero`,
    objectType: hero,
    size: detailSize,
    state: 'main',
    x: cx + 40,
    y: cy + 30,
    scale: 0.38,
    rotation: 0,
    zIndex: 20
  });

  items.push({
    id: `item-batch-${now}-accent`,
    objectType: accent,
    size: 'S',
    state: 'main',
    x: cx - 60,
    y: cy + 120,
    scale: 0.38,
    rotation: 0,
    zIndex: 30
  });

  return items;
}
