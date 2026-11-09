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
 * Adjusts all items when the canvas format changes to ensure natural proportions along the 30-degree isometric axes.
 */
export function fitAndCenterScene(
  items: CanvasItem[],
  format: CanvasFormat
): CanvasItem[] {
  if (items.length === 0) return items;
  const cfg = FORMATS[format];
  const W = cfg.width;
  const H = cfg.height;
  const cx = W / 2;
  const cy = H / 2;

  // Center of current items
  const curCx = items.reduce((sum, it) => sum + it.x, 0) / items.length;
  const curCy = items.reduce((sum, it) => sum + it.y, 0) / items.length;

  // Format base scale & spread factors
  let targetScale = 0.82;
  let sx = 1.0;
  let sy = 1.0;

  if (format === '16:9') {
    targetScale = 0.68;
    sx = 1.15;
    sy = 0.72;
  } else if (format === '9:16') {
    targetScale = 0.78;
    sx = 0.85;
    sy = 1.25;
  } else if (format === '4:3') {
    targetScale = 0.78;
    sx = 0.95;
    sy = 0.85;
  }

  const avgScale = items.reduce((sum, it) => sum + it.scale, 0) / items.length;
  const scaleRatio = targetScale / (avgScale || 0.82);

  return items.map(it => ({
    ...it,
    x: Math.round(cx + (it.x - curCx) * sx),
    y: Math.round(cy + (it.y - curCy) * sy),
    scale: Number((it.scale * scaleRatio).toFixed(4))
  }));
}

/**
 * Builds authentic Studio Ochen isometric desk compositions.
 * Implements the 6 iconic studio layout archetypes:
 * 1. Notebook + Phone (book bleeding top/left, phone resting on right page)
 * 2. Wallet + Coin + Folder (folder bleeding top-right, wallet foreground, coin on desk)
 * 3. Flowers + Headphones (flowers bleeding top-left, headphones foreground focus)
 * 4. Lamp + Wallet + Coin (lamp bleeding top, wallet foreground, coin along 30 deg axis)
 * 5. Notebook + Puzzle + Pen (notebook bleeding top-right, puzzle on left page, pen foreground)
 * 6. Phone + Puzzle (phone lower-left, puzzle upper-right)
 *
 * Elements are scaled at authentic desktop scale (~0.80..0.85) without artificial bounding-box squashing.
 * Background objects naturally bleed over card borders, creating a high-end editorial isometric framing.
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
  const cx = W / 2;
  const cy = H / 2;

  // Format-specific scale and aspect spread
  let s = 0.82;
  let sx = 1.0;
  let sy = 1.0;

  if (format === '16:9') {
    s = 0.68;
    sx = 1.15;
    sy = 0.72;
  } else if (format === '9:16') {
    s = 0.78;
    sx = 0.85;
    sy = 1.25;
  } else if (format === '4:3') {
    s = 0.78;
    sx = 0.95;
    sy = 0.85;
  }

  interface PlacedRaw {
    type: string;
    state: 'main' | 'bg';
    x: number;
    y: number;
    scale: number;
    rot: number;
    zIndex: number;
  }

  const placed: PlacedRaw[] = [];

  // ARCHETYPE 1: Notebook
  if (heroKey === 'notebook' || bgKey === 'notebook') {
    const isHeroNotebook = heroKey === 'notebook';

    if (accentKey === 'phone' || (!accentKey && heroKey === 'notebook' && bgKey === 'phone')) {
      // Studio Card 2: Book bleeding top-left + Phone on right page
      placed.push({
        type: 'notebook',
        state: isHeroNotebook ? 'main' : 'bg',
        x: Math.round(cx - 80 * sx),
        y: Math.round(cy - 20 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx + 120 * sx),
        y: Math.round(cy - 80 * sy),
        scale: Number((s * 0.85).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (bgKey === 'lamp') {
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 220 * sx),
          y: Math.round(cy - 240 * sy),
          scale: Number((s * 1.03).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
    } else if (accentKey === 'puzzle' || bgKey === 'notebook') {
      // Studio Card 6: Book bleeding top-right + Puzzle on left page + Pen foreground
      placed.push({
        type: 'notebook',
        state: isHeroNotebook ? 'main' : 'bg',
        x: Math.round(cx + 120 * sx),
        y: Math.round(cy - 80 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'puzzle',
        state: 'main',
        x: Math.round(cx - 40 * sx),
        y: Math.round(cy - 120 * sy),
        scale: Number((s * 0.91).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      const penOrAccent = accentKey === 'pen' || heroKey === 'pen' ? 'pen' : (accentKey || 'pen');
      placed.push({
        type: penOrAccent,
        state: 'main',
        x: Math.round(cx - 60 * sx),
        y: Math.round(cy + 200 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else {
      // Notebook + Pen in foreground + optional Lamp behind
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx + 20 * sx),
        y: Math.round(cy - 20 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      const penAccent = accentKey || 'pen';
      placed.push({
        type: penAccent,
        state: 'main',
        x: Math.round(cx - 160 * sx),
        y: Math.round(cy + 220 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
      if (bgKey === 'lamp') {
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 220 * sx),
          y: Math.round(cy - 240 * sy),
          scale: Number((s * 1.03).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      } else if (bgKey === 'flowers') {
        placed.push({
          type: 'flowers',
          state: 'bg',
          x: Math.round(cx - 240 * sx),
          y: Math.round(cy - 220 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
    }

  // ARCHETYPE 2: Wallet
  } else if (heroKey === 'wallet') {
    if (bgKey === 'folder') {
      // Studio Card 3: Folder bleeding top-right + Wallet + Coin
      placed.push({
        type: 'folder',
        state: 'main',
        x: Math.round(cx + 180 * sx),
        y: Math.round(cy - 120 * sy),
        scale: Number((s * 0.95).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 140 * sx),
        y: Math.round(cy + 140 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      placed.push({
        type: accentKey || 'coin',
        state: 'main',
        x: Math.round(cx + 100 * sx),
        y: Math.round(cy + 160 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else if (bgKey === 'lamp') {
      // Studio Card 5: Lamp bleeding top + Wallet + Coin
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 120 * sx),
        y: Math.round(cy - 180 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx + 40 * sx),
        y: Math.round(cy + 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      placed.push({
        type: accentKey || 'coin',
        state: 'main',
        x: Math.round(cx + 180 * sx),
        y: Math.round(cy + 50 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else {
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 40 * sx),
        y: Math.round(cy + 120 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      placed.push({
        type: accentKey || 'coin',
        state: 'main',
        x: Math.round(cx + 160 * sx),
        y: Math.round(cy - 10 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy - 180 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 1
        });
      }
    }

  // ARCHETYPE 3: Headphones
  } else if (heroKey === 'headphones') {
    if (bgKey === 'flowers' || !bgKey) {
      // Studio Card 4: Flowers bleeding top-left + Headphones foreground
      placed.push({
        type: 'flowers',
        state: 'bg',
        x: Math.round(cx - 240 * sx),
        y: Math.round(cy - 200 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'headphones',
        state: 'main',
        x: Math.round(cx + 40 * sx),
        y: Math.round(cy + 140 * sy),
        scale: Number((s * 1.07).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey === 'puzzle') {
        placed.push({
          type: 'puzzle',
          state: 'main',
          x: Math.round(cx - 40 * sx),
          y: Math.round(cy + 180 * sy),
          scale: Number((s * 0.9).toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else if (bgKey === 'lamp') {
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 160 * sx),
        y: Math.round(cy - 180 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'headphones',
        state: 'main',
        x: Math.round(cx + 80 * sx),
        y: Math.round(cy + 140 * sy),
        scale: Number((s * 1.07).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 40 * sx),
          y: Math.round(cy + 180 * sy),
          scale: Number((s * 0.9).toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else {
      placed.push({
        type: 'headphones',
        state: 'main',
        x: Math.round(cx),
        y: Math.round(cy + 80 * sy),
        scale: Number((s * 1.07).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 180 * sx),
          y: Math.round(cy - 180 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 1
        });
      }
    }

  // ARCHETYPE 4: Phone
  } else if (heroKey === 'phone') {
    if (accentKey === 'puzzle' || !accentKey) {
      // Studio Card 1: Phone lower-left + Puzzle upper-right
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx - 100 * sx),
        y: Math.round(cy + 120 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      placed.push({
        type: 'puzzle',
        state: 'main',
        x: Math.round(cx + 180 * sx),
        y: Math.round(cy - 140 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      if (bgKey === 'lamp') {
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 220 * sx),
          y: Math.round(cy - 220 * sy),
          scale: Number((s * 1.03).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      } else if (bgKey === 'flowers') {
        placed.push({
          type: 'flowers',
          state: 'bg',
          x: Math.round(cx - 220 * sx),
          y: Math.round(cy - 200 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
    } else {
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx - 80 * sx),
        y: Math.round(cy + 100 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx + 180 * sx),
          y: Math.round(cy - 80 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 200 * sx),
          y: Math.round(cy - 200 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 1
        });
      }
    }

  // ARCHETYPE 5: Folder
  } else if (heroKey === 'folder') {
    placed.push({
      type: 'folder',
      state: 'main',
      x: Math.round(cx + 160 * sx),
      y: Math.round(cy - 80 * sy),
      scale: Number((s * 0.98).toFixed(4)),
      rot: 0,
      zIndex: 1
    });
    if (accentKey === 'pen') {
      placed.push({
        type: 'pen',
        state: 'main',
        x: Math.round(cx - 160 * sx),
        y: Math.round(cy + 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else if (accentKey === 'coin') {
      placed.push({
        type: 'coin',
        state: 'main',
        x: Math.round(cx - 120 * sx),
        y: Math.round(cy + 160 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else if (accentKey === 'wallet') {
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 140 * sx),
        y: Math.round(cy + 140 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    }
    if (bgKey === 'lamp') {
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 200 * sx),
        y: Math.round(cy - 220 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
    }

  // ARCHETYPE 6: Lamp (as Hero)
  } else if (heroKey === 'lamp') {
    placed.push({
      type: 'lamp',
      state: 'main',
      x: Math.round(cx - 80 * sx),
      y: Math.round(cy - 40 * sy),
      scale: Number(s.toFixed(4)),
      rot: 0,
      zIndex: 1
    });
    const lampAccent = accentKey || (bgKey === 'pen' ? 'pen' : 'wallet');
    placed.push({
      type: lampAccent,
      state: 'main',
      x: Math.round(cx + 140 * sx),
      y: Math.round(cy + 180 * sy),
      scale: Number(s.toFixed(4)),
      rot: 0,
      zIndex: 2
    });
    if (bgKey && bgKey !== lampAccent) {
      placed.push({
        type: bgKey,
        state: 'bg',
        x: Math.round(cx + 160 * sx),
        y: Math.round(cy - 120 * sy),
        scale: Number((s * 0.9).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
    }

  // Fallback for other combinations
  } else {
    placed.push({
      type: heroKey,
      state: 'main',
      x: Math.round(cx),
      y: Math.round(cy + 80 * sy),
      scale: Number(s.toFixed(4)),
      rot: 0,
      zIndex: 2
    });
    if (bgKey) {
      placed.push({
        type: bgKey,
        state: 'bg',
        x: Math.round(cx - 180 * sx),
        y: Math.round(cy - 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 1
      });
    }
    if (accentKey) {
      placed.push({
        type: accentKey,
        state: 'main',
        x: Math.round(cx + 160 * sx),
        y: Math.round(cy + 140 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    }
  }

  const now = Date.now();
  return placed.map((it, idx) => ({
    id: `${it.type}-${it.state}-${now}-${idx}`,
    objectType: it.type,
    size: detailSize,
    state: it.state,
    x: it.x,
    y: it.y,
    scale: it.scale,
    rotation: it.rot,
    zIndex: it.zIndex
  }));
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
