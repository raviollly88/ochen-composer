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
    title: 'Журналистика и писательство',
    description: 'Открытый блокнот, настольная лампа в фоне и ручка перед разворотом (референс студии)',
    prompt: 'журналистика автор статья текст репортаж рукопись писательство',
    palette: 'purple'
  },
  {
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, монета на переднем плане и фоновая лампа (эталон студии)',
    prompt: 'личные финансы деньги кошелек бюджет инвестиции сбережения',
    palette: 'peach'
  },
  {
    title: 'Конспекты и IT-продуктивность',
    description: 'Открытый блокнот, смартфон на развороте и фоновая лампа',
    prompt: 'конспекты учеба продуктивность фокус приложение мобилка',
    palette: 'peach'
  },
  {
    title: 'Музыка и отдых',
    description: 'Наушники на первом плане и ваза с цветами в фоне (эталон студии)',
    prompt: 'музыка отдых релакс треки подкаст ваза цветы звук',
    palette: 'mint'
  },
  {
    title: 'IT-стартап и продукт',
    description: 'Смартфон с мобильным приложением и пазлы сборки архитектуры',
    prompt: 'стартап технологии приложение код сборка пазл разработка',
    palette: 'mint'
  },
  {
    title: 'Рабочее пространство и документы',
    description: 'Папка документов, ручка для подписи и настольная лампа в фоне',
    prompt: 'документы папка договор подпись работа офис регламент',
    palette: 'purple'
  }
];

/**
 * Natural companion pairings for each primary object when fewer than 3 objects are matched.
 * Strictly adheres to Studio Ochen's reference compositions.
 */
export const NATURAL_COMPANIONS: Record<string, { bg: string; accent: string }> = {
  notebook: { bg: 'lamp', accent: 'pen' },
  wallet: { bg: 'lamp', accent: 'coin' },
  phone: { bg: 'lamp', accent: 'puzzle' },
  headphones: { bg: 'flowers', accent: 'puzzle' },
  folder: { bg: 'lamp', accent: 'pen' },
  lamp: { bg: 'folder', accent: 'pen' },
  flowers: { bg: 'lamp', accent: 'puzzle' },
  pen: { bg: 'lamp', accent: 'notebook' },
  coin: { bg: 'lamp', accent: 'wallet' },
  puzzle: { bg: 'flowers', accent: 'phone' }
};

/**
 * Rich Russian & English semantic keyword map with broad root-stem coverage.
 */
const RICH_SEMANTIC_KEYWORDS: Record<string, string[]> = {
  notebook: [
    'журнал', 'писател', 'автор', 'книг', 'блокнот', 'конспект', 'стать', 'текст',
    'заметк', 'рукопис', 'чтени', 'библиот', 'учеб', 'лекци', 'диплом', 'реферат',
    'дневник', 'сценар', 'публикац', 'литератур', 'тетрад', 'запис', 'копирайт',
    'редактор', 'пресса', 'медиа', 'издательств', 'поэзи', 'стих', 'эссе', 'книжк',
    'book', 'notebook', 'notes', 'write', 'author', 'article', 'essay', 'journal'
  ],
  pen: [
    'ручк', 'стилус', 'подпис', 'автограф', 'писат', 'чернил', 'перо', 'договор',
    'контракт', 'соглашен', 'бланк', 'роспис', 'канцеляр', 'карандаш',
    'pen', 'pencil', 'stylus', 'signature', 'sign', 'ink'
  ],
  phone: [
    'телефон', 'смартфон', 'айфон', 'мобил', 'приложен', 'звонок', 'чат', 'мессенджер',
    'экран', 'интерфейс', 'девайс', 'связ', 'гаджет', 'соцсет',
    'ios', 'android', 'app', 'ui', 'ux', 'phone', 'mobile', 'screen', 'device'
  ],
  puzzle: [
    'пазл', 'архитектур', 'модул', 'компонент', 'логик', 'алгоритм', 'стратеги',
    'иде', 'сборк', 'решен', 'задач', 'структур', 'концепт', 'схем', 'систем',
    'интеграц', 'кусоч', 'пазлы', 'головоломк', 'составн', 'конструктор',
    'puzzle', 'logic', 'architecture', 'module', 'component', 'piece'
  ],
  wallet: [
    'кошелек', 'деньг', 'финанс', 'бюджет', 'оплат', 'счет', 'наличн', 'зарплат',
    'доход', 'расход', 'эконом', 'портмоне', 'трат', 'карт', 'банк', 'платеж',
    'капитал', 'сбережен', 'деньж', 'рубл', 'доллар', 'евро', 'кеш', 'валют',
    'wallet', 'money', 'finance', 'budget', 'cash', 'payment', 'salary', 'wealth'
  ],
  coin: [
    'монет', 'крипт', 'биткоин', 'токен', 'инвестиц', 'процент', 'вклад', 'сейф',
    'защит', 'безопасн', 'замок', 'криптовалют', 'блокчейн', 'накоплен', 'копейк',
    'coin', 'crypto', 'token', 'bitcoin', 'investment', 'savings', 'lock', 'security'
  ],
  headphones: [
    'наушник', 'музык', 'звук', 'аудио', 'подкаст', 'трек', 'ритм', 'бит', 'релакс',
    'отдых', 'фокус', 'концентрац', 'тишин', 'мелоди', 'плейлист', 'слушат', 'акустик',
    'гарнитур', 'песн', 'вокал', 'радио', 'голос',
    'headphones', 'music', 'sound', 'audio', 'podcast', 'beats', 'track', 'relax'
  ],
  lamp: [
    'ламп', 'свет', 'освещен', 'рабоч', 'стол', 'вечер', 'уют', 'кабинет', 'деск',
    'дизайн', 'светильник', 'ночник', 'комнат', 'рабочее мест', 'офис',
    'lamp', 'light', 'desk', 'workspace', 'evening', 'cozy', 'interior'
  ],
  flowers: [
    'цвет', 'ваз', 'тюльпан', 'букет', 'флористик', 'весн', 'природ', 'красот',
    'подарок', 'праздник', 'настроен', 'декор', 'уют', 'жизн', 'любов', 'эстетик',
    'растени', 'комнатн', 'зелен', 'лепест',
    'flowers', 'vase', 'bouquet', 'tulips', 'spring', 'gift', 'nature', 'beauty'
  ],
  folder: [
    'папк', 'документ', 'бумаг', 'дело', 'отчет', 'архив', 'файл', 'проект',
    'документац', 'бухгалтер', 'юриспруденц', 'прав', 'закон', 'регламент', 'досье',
    'делопроизводств', 'папка с файл', 'канцеляри',
    'folder', 'document', 'documents', 'archive', 'report', 'files', 'legal', 'case'
  ]
};

/**
 * Deterministic string hash for consistent results.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Adjusts all items when the canvas format changes to ensure they remain centered and contained.
 */
export function fitAndCenterScene(
  items: CanvasItem[],
  format: CanvasFormat,
  padding: number = 50
): CanvasItem[] {
  if (items.length === 0) return items;
  const cfg = FORMATS[format];
  const W = cfg.width;
  const H = cfg.height;

  const minX = Math.min(...items.map(it => it.x));
  const maxX = Math.max(...items.map(it => it.x));
  const minY = Math.min(...items.map(it => it.y));
  const maxY = Math.max(...items.map(it => it.y));

  const curW = maxX - minX || 100;
  const curH = maxY - minY || 100;
  const curCx = (minX + maxX) / 2;
  const curCy = (minY + maxY) / 2;

  const targetW = W - padding * 2;
  const targetH = H - padding * 2;
  const scaleRatio = Math.min(1.0, targetW / curW, targetH / curH);

  return items.map(it => ({
    ...it,
    x: Math.round(W / 2 + (it.x - curCx) * scaleRatio),
    y: Math.round(H / 2 + (it.y - curCy) * scaleRatio),
    scale: Number((it.scale * scaleRatio).toFixed(4))
  }));
}

/**
 * Computes tight, balanced isometric anchor coordinates for the group
 * ensuring exact relative proportions and zero clipping.
 */
export function buildIsometricScene(
  heroKey: string,
  bgKey: string | null,
  accentKey: string | null,
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): CanvasItem[] {
  const formatConfig = FORMATS[format];
  const W = formatConfig.width;
  const H = formatConfig.height;

  // Canonical base dimensions from user's authentic SVGs
  const DIMS: Record<string, { w: number; h: number }> = {
    notebook: { w: 1446, h: 977 },
    folder: { w: 1241, h: 659 },
    lamp: { w: 946, h: 1129 },
    headphones: { w: 889, h: 692 },
    flowers: { w: 591, h: 748 },
    phone: { w: 797, h: 462 },
    wallet: { w: 631, h: 397 },
    puzzle: { w: 545, h: 314 },
    pen: { w: 509, h: 286 },
    coin: { w: 287, h: 189 }
  };

  // Base offsets relative to Hero center (0, 0) on the 30-degree isometric plane
  let bgOffset = { x: -260, y: -220 };
  let accentOffset = { x: 0, y: 0 };
  let accentRot = 0;

  if (heroKey === 'notebook') {
    // User Mockup Image 2: Pen lying right along notebook's bottom-left edge!
    if (accentKey === 'pen') {
      accentOffset = { x: -180, y: 240 };
      accentRot = 0;
    } else if (accentKey === 'phone') {
      // Phone sits on the right page
      accentOffset = { x: 120, y: -50 };
    } else if (accentKey === 'puzzle') {
      accentOffset = { x: 100, y: 50 };
    }

    if (bgKey === 'lamp') {
      // User Mockup Image 2: Lamp stands behind the book to the top-left
      bgOffset = { x: -320, y: -240 };
    } else if (bgKey === 'flowers') {
      bgOffset = { x: 320, y: -220 };
    } else if (bgKey === 'folder') {
      bgOffset = { x: -280, y: -220 };
    }
  } else if (heroKey === 'wallet') {
    // Studio Reference Image 3: Coin placed on desk to the right along 30 deg line
    if (accentKey === 'coin') {
      accentOffset = { x: 230, y: -120 };
    } else if (accentKey === 'pen') {
      accentOffset = { x: -160, y: 180 };
    }

    if (bgKey === 'lamp') {
      // Studio Reference Image 3: Lamp stands behind wallet
      bgOffset = { x: -160, y: -220 };
    } else if (bgKey === 'folder') {
      bgOffset = { x: -140, y: -220 };
    }
  } else if (heroKey === 'phone') {
    if (accentKey === 'puzzle') {
      // Puzzle rests directly on phone screen
      accentOffset = { x: 10, y: -10 };
    } else if (accentKey === 'coin') {
      accentOffset = { x: 200, y: 80 };
    }

    if (bgKey === 'lamp') {
      bgOffset = { x: 260, y: -80 };
    } else if (bgKey === 'flowers') {
      bgOffset = { x: 0, y: -260 };
    } else if (bgKey === 'folder') {
      bgOffset = { x: -200, y: -180 };
    }
  } else if (heroKey === 'headphones') {
    if (accentKey === 'puzzle') {
      accentOffset = { x: 40, y: 150 };
    } else if (accentKey === 'pen') {
      accentOffset = { x: 220, y: 130 };
    }

    if (bgKey === 'lamp') {
      bgOffset = { x: 280, y: -120 };
    } else if (bgKey === 'flowers') {
      bgOffset = { x: 0, y: -250 };
    }
  } else if (heroKey === 'folder') {
    if (accentKey === 'pen') {
      accentOffset = { x: -140, y: 220 };
    } else if (accentKey === 'coin') {
      accentOffset = { x: 220, y: 120 };
    }

    if (bgKey === 'lamp') {
      bgOffset = { x: -280, y: -220 };
    } else if (bgKey === 'flowers') {
      bgOffset = { x: 280, y: -200 };
    }
  }

  const rawPlaced: Array<{
    type: string;
    x: number;
    y: number;
    rot: number;
    state: 'main' | 'bg';
    w: number;
    h: number;
    zIndex: number;
  }> = [];

  // Background Item (zIndex 1)
  if (bgKey && DIMS[bgKey]) {
    rawPlaced.push({
      type: bgKey,
      x: bgOffset.x,
      y: bgOffset.y,
      rot: 0,
      state: 'bg',
      w: DIMS[bgKey].w,
      h: DIMS[bgKey].h,
      zIndex: 1
    });
  }

  // Hero Item (zIndex 2)
  if (DIMS[heroKey]) {
    rawPlaced.push({
      type: heroKey,
      x: 0,
      y: 0,
      rot: 0,
      state: 'main',
      w: DIMS[heroKey].w,
      h: DIMS[heroKey].h,
      zIndex: 2
    });
  }

  // Accent Item (zIndex 3)
  if (accentKey && DIMS[accentKey]) {
    rawPlaced.push({
      type: accentKey,
      x: accentOffset.x,
      y: accentOffset.y,
      rot: accentRot,
      state: 'main',
      w: DIMS[accentKey].w,
      h: DIMS[accentKey].h,
      zIndex: 3
    });
  }

  // Calculate group bounding box
  const minX = Math.min(...rawPlaced.map(it => it.x - it.w / 2));
  const maxX = Math.max(...rawPlaced.map(it => it.x + it.w / 2));
  const minY = Math.min(...rawPlaced.map(it => it.y - it.h / 2));
  const maxY = Math.max(...rawPlaced.map(it => it.y + it.h / 2));

  const grpW = maxX - minX;
  const grpH = maxY - minY;
  const grpCx = (minX + maxX) / 2;
  const grpCy = (minY + maxY) / 2;

  // Scale target depending on canvas format
  let targetCoverage = 0.72;
  if (format === '16:9') targetCoverage = 0.68;
  if (format === '9:16') targetCoverage = 0.70;

  const targetW = W * targetCoverage;
  const targetH = H * targetCoverage;

  // All objects share the EXACT same scale factor to preserve 100% relative proportions!
  let groupScale = Math.min(targetW / grpW, targetH / grpH);

  // When Size S is selected, use 1.0 (Size S assets have w/h already divided by 2)
  if (detailSize === 'S') {
    groupScale *= 2.0; // Because Size S assets are 50% smaller in objects.json
  }

  const now = Date.now();
  const finalItems: CanvasItem[] = rawPlaced.map((it, idx) => {
    // Center of canvas
    const finalX = Math.round(W / 2 + (it.x - grpCx) * (detailSize === 'S' ? groupScale * 0.5 : groupScale));
    const finalY = Math.round(H / 2 + (it.y - grpCy) * (detailSize === 'S' ? groupScale * 0.5 : groupScale));

    return {
      id: `${it.type}-${it.state}-${now}-${idx}`,
      objectType: it.type,
      size: detailSize,
      state: it.state,
      x: finalX,
      y: finalY,
      scale: Number(groupScale.toFixed(4)),
      rotation: it.rot,
      zIndex: it.zIndex
    };
  });

  return finalItems;
}

/**
 * Dynamically analyzes ANY user prompt, extracts semantic keywords,
 * ranks all 10 objects, and produces a laconic 2-3 object composition.
 */
export function generateCompositionFromPrompt(
  prompt: string,
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): AICompositionResult {
  const pLower = prompt.toLowerCase().trim();

  // 1. Semantic scoring across all 10 library objects with rich stem dictionary
  const scores: Record<string, { score: number; matchedWords: string[] }> = {};

  for (const [key, stems] of Object.entries(RICH_SEMANTIC_KEYWORDS)) {
    scores[key] = { score: 0, matchedWords: [] };

    // Check direct object name or Russian label
    const meta = OBJECT_CATALOG[key];
    if (pLower.includes(key) || (meta && pLower.includes(meta.labelRu.toLowerCase()))) {
      scores[key].score += 25;
      scores[key].matchedWords.push(meta?.labelRu || key);
    }

    // Check rich stems
    for (const stem of stems) {
      if (pLower.includes(stem)) {
        scores[key].score += 10;
        if (!scores[key].matchedWords.includes(stem)) {
          scores[key].matchedWords.push(stem);
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

    // Primary candidates for hero role
    const primaryCandidates = matchedKeys.filter(k =>
      ['notebook', 'wallet', 'phone', 'headphones', 'folder'].includes(k)
    );

    if (primaryCandidates.length > 0) {
      heroKey = primaryCandidates[0];
    } else {
      heroKey = matchedKeys[0];
    }

    // Assign background object
    const hasLamp = matchedKeys.includes('lamp');
    const hasFlowers = matchedKeys.includes('flowers');
    const hasFolder = matchedKeys.includes('folder');

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

    // GUARANTEE: Always 2 to 3 objects via natural companion pairings!
    if (!bgKey && !accentKey) {
      const companions = NATURAL_COMPANIONS[heroKey] || { bg: 'lamp', accent: 'pen' };
      bgKey = companions.bg;
      accentKey = companions.accent;
    } else if (!bgKey) {
      const companions = NATURAL_COMPANIONS[heroKey] || { bg: 'lamp', accent: 'pen' };
      bgKey = companions.bg;
    }
  } else {
    // Unknown or abstract prompt: categorize intelligently
    const hash = hashString(pLower || 'default');
    const defaultPresets = [
      { hero: 'notebook', bg: 'lamp', accent: 'pen' },    // Writing & desk (Universal fallback!)
      { hero: 'wallet', bg: 'lamp', accent: 'coin' },      // Finance & commerce
      { hero: 'phone', bg: 'lamp', accent: 'puzzle' },     // Tech & digital
      { hero: 'headphones', bg: 'flowers', accent: 'puzzle' } // Creative & audio
    ];
    const picked = defaultPresets[hash % defaultPresets.length];
    heroKey = picked.hero;
    bgKey = picked.bg;
    accentKey = picked.accent;
  }

  // Determine palette dynamically
  let recPalette: PaletteId = 'purple';
  if (
    pLower.includes('персик') ||
    pLower.includes('тепл') ||
    pLower.includes('деньг') ||
    pLower.includes('финанс') ||
    pLower.includes('банк') ||
    pLower.includes('кошел') ||
    pLower.includes('инвест') ||
    heroKey === 'wallet'
  ) {
    recPalette = 'peach';
  } else if (
    pLower.includes('мят') ||
    pLower.includes('свеж') ||
    pLower.includes('технолог') ||
    pLower.includes('стартап') ||
    pLower.includes('код') ||
    pLower.includes('музык') ||
    pLower.includes('звук') ||
    pLower.includes('аудио') ||
    heroKey === 'headphones'
  ) {
    recPalette = 'mint';
  }

  // Build the aligned isometric scene
  const finalItems = buildIsometricScene(heroKey, bgKey, accentKey, format, detailSize);

  const heroLabel = OBJECT_CATALOG[heroKey]?.labelRu || heroKey;
  const bgLabel = bgKey ? OBJECT_CATALOG[bgKey]?.labelRu : null;
  const accentLabel = accentKey ? OBJECT_CATALOG[accentKey]?.labelRu : null;

  let rationaleText = '';
  if (allDetectedTags.length > 0) {
    rationaleText = `Смысловые теги: <${allDetectedTags.slice(0, 4).join(', ')}>. `;
  }
  rationaleText += `Главный объект: ${heroLabel} (фокус сцены).`;
  if (bgLabel) {
    rationaleText += ` В глубине: ${bgLabel} (монохром в тоне палитры).`;
  }
  if (accentLabel) {
    rationaleText += ` Добавлен акцент: ${accentLabel}.`;
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
  const validKeys = componentNames.filter(name => OBJECT_CATALOG[name]);
  if (validKeys.length === 0) return [];

  // If 1 item selected: automatically pair it with a natural companion (2-3 items total)
  if (validKeys.length === 1) {
    const hero = validKeys[0];
    const companions = NATURAL_COMPANIONS[hero] || { bg: 'lamp', accent: 'pen' };
    return buildIsometricScene(hero, companions.bg, companions.accent, format, detailSize);
  }

  // If 2 items selected: 1 Background + 1 Hero
  if (validKeys.length === 2) {
    const bgTypes = ['lamp', 'flowers', 'folder'];
    const isFirstBg = bgTypes.includes(validKeys[0]) && !bgTypes.includes(validKeys[1]);
    const bg = isFirstBg ? validKeys[0] : validKeys[1];
    const hero = isFirstBg ? validKeys[1] : validKeys[0];
    return buildIsometricScene(hero, bg, null, format, detailSize);
  }

  // If 3+ items: Keep 3 items (Hero, Background, Accent)
  const bgTypes = ['lamp', 'flowers', 'folder'];
  const bgCandidate = validKeys.find(k => bgTypes.includes(k)) || validKeys[1];
  const accentCandidate = validKeys.find(k => ['coin', 'pen', 'puzzle', 'phone'].includes(k) && k !== bgCandidate) || validKeys[2];
  const heroCandidate = validKeys.find(k => k !== bgCandidate && k !== accentCandidate) || validKeys[0];

  return buildIsometricScene(heroCandidate, bgCandidate, accentCandidate, format, detailSize);
}
