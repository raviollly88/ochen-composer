import type { CanvasFormat, CanvasItem, DetailSize, PaletteId } from './types';
import { FORMATS, OBJECT_CATALOG } from './types';

export interface AICompositionResult {
  title: string;
  matchedTheme: string;
  recommendedPalette: PaletteId;
  items: CanvasItem[];
  rationale: string;
}

// Preset themes for quick 1-click test demonstrations
export const PRESET_THEMES = [
  {
    title: 'Учеба и продуктивность',
    description: 'Конспекты, аудиолекции и фокус на знаниях',
    prompt: 'онлайн учеба конспекты фокус подготовка к экзаменам'
  },
  {
    title: 'Личные финансы и инвестиции',
    description: 'Управление бюджетом, мобильный банк и накопления',
    prompt: 'финансы деньги инвестиции накопления кошелек бюджет'
  },
  {
    title: 'Запуск IT-стартапа',
    description: 'Технологии, поиск решений и сборка продукта',
    prompt: 'стартап технологии приложение разработка команда пазл'
  },
  {
    title: 'Рабочее место и организация',
    description: 'Офис, документы, светлая рабочая атмосфера',
    prompt: 'работа офис документы отчет лампа планирование'
  },
  {
    title: 'Творчество и контент',
    description: 'Дизайн, вдохновение и авторские проекты',
    prompt: 'творчество дизайн цветы стилус красота вдохновение'
  }
];

/**
 * Analyzes a text prompt/metaphor and selects appropriate objects, states, and coordinates.
 */
export function generateCompositionFromPrompt(
  prompt: string,
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): AICompositionResult {
  const pLower = prompt.toLowerCase();
  const formatConfig = FORMATS[format];
  const W = formatConfig.width;
  const H = formatConfig.height;

  // 1. Semantic scoring of objects
  const scores: Record<string, number> = {};
  for (const [key, meta] of Object.entries(OBJECT_CATALOG)) {
    let score = 0;
    if (pLower.includes(key) || pLower.includes(meta.labelRu.toLowerCase())) {
      score += 10;
    }
    for (const tag of meta.tags) {
      if (pLower.includes(tag)) {
        score += 4;
      }
    }
    scores[key] = score;
  }

  // Fallbacks if prompt is generic or doesn't match specific tags
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let selectedKeys = sorted.filter(([_, s]) => s > 0).map(([k]) => k);

  if (selectedKeys.length === 0) {
    selectedKeys = ['phone', 'notebook', 'headphones', 'coin'];
  } else if (selectedKeys.length === 1) {
    const first = selectedKeys[0];
    if (first === 'phone') selectedKeys.push('coin', 'headphones', 'puzzle');
    else if (first === 'notebook') selectedKeys.push('pen', 'lamp', 'headphones');
    else if (first === 'wallet' || first === 'coin') selectedKeys.push('phone', 'folder');
    else selectedKeys.push('notebook', 'phone', 'pen');
  } else if (selectedKeys.length < 3) {
    selectedKeys.push('puzzle', 'pen');
  }

  const finalKeys = selectedKeys.slice(0, Math.min(selectedKeys.length, 4));

  let recPalette: PaletteId = 'purple';
  if (pLower.includes('деньги') || pLower.includes('финанс') || pLower.includes('стартап') || pLower.includes('банк')) {
    recPalette = 'peach';
  } else if (pLower.includes('природ') || pLower.includes('свеж') || pLower.includes('эколог') || pLower.includes('технолог')) {
    recPalette = 'mint';
  }

  const items: CanvasItem[] = [];
  const cx = W / 2;
  const cy = H / 2;

  if (format === '16:9') {
    items.push({
      id: `item-${Date.now()}-1`,
      objectType: finalKeys[0],
      size: detailSize,
      state: 'main',
      x: cx - 20,
      y: cy + 10,
      scale: 0.28,
      rotation: 0,
      zIndex: 20
    });

    if (finalKeys[1]) {
      items.push({
        id: `item-${Date.now()}-2`,
        objectType: finalKeys[1],
        size: detailSize,
        state: 'main',
        x: cx + 220,
        y: cy - 40,
        scale: 0.24,
        rotation: 0,
        zIndex: 15
      });
    }

    if (finalKeys[2]) {
      items.push({
        id: `item-${Date.now()}-3`,
        objectType: finalKeys[2],
        size: detailSize,
        state: 'bg',
        x: cx - 240,
        y: cy - 30,
        scale: 0.25,
        rotation: 0,
        zIndex: 10
      });
    }

    if (finalKeys[3]) {
      items.push({
        id: `item-${Date.now()}-4`,
        objectType: finalKeys[3],
        size: 'S',
        state: 'main',
        x: cx + 120,
        y: cy + 120,
        scale: 0.35,
        rotation: 0,
        zIndex: 25
      });
    }
  } else if (format === '1:1') {
    items.push({
      id: `item-${Date.now()}-1`,
      objectType: finalKeys[0],
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy + 30,
      scale: 0.32,
      rotation: 0,
      zIndex: 20
    });

    if (finalKeys[1]) {
      items.push({
        id: `item-${Date.now()}-2`,
        objectType: finalKeys[1],
        size: detailSize,
        state: 'bg',
        x: cx - 140,
        y: cy - 100,
        scale: 0.28,
        rotation: 0,
        zIndex: 10
      });
    }

    if (finalKeys[2]) {
      items.push({
        id: `item-${Date.now()}-3`,
        objectType: finalKeys[2],
        size: detailSize,
        state: 'main',
        x: cx + 150,
        y: cy - 40,
        scale: 0.26,
        rotation: 0,
        zIndex: 15
      });
    }

    if (finalKeys[3]) {
      items.push({
        id: `item-${Date.now()}-4`,
        objectType: finalKeys[3],
        size: 'S',
        state: 'main',
        x: cx - 40,
        y: cy + 150,
        scale: 0.38,
        rotation: 0,
        zIndex: 25
      });
    }
  } else if (format === '9:16') {
    items.push({
      id: `item-${Date.now()}-1`,
      objectType: finalKeys[0],
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy - 60,
      scale: 0.28,
      rotation: 0,
      zIndex: 20
    });

    if (finalKeys[1]) {
      items.push({
        id: `item-${Date.now()}-2`,
        objectType: finalKeys[1],
        size: detailSize,
        state: 'main',
        x: cx - 80,
        y: cy + 180,
        scale: 0.26,
        rotation: 0,
        zIndex: 25
      });
    }

    if (finalKeys[2]) {
      items.push({
        id: `item-${Date.now()}-3`,
        objectType: finalKeys[2],
        size: detailSize,
        state: 'bg',
        x: cx + 80,
        y: cy - 260,
        scale: 0.25,
        rotation: 0,
        zIndex: 10
      });
    }

    if (finalKeys[3]) {
      items.push({
        id: `item-${Date.now()}-4`,
        objectType: finalKeys[3],
        size: 'S',
        state: 'bg',
        x: cx + 100,
        y: cy + 70,
        scale: 0.35,
        rotation: 0,
        zIndex: 15
      });
    }
  } else {
    items.push({
      id: `item-${Date.now()}-1`,
      objectType: finalKeys[0],
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy + 20,
      scale: 0.30,
      rotation: 0,
      zIndex: 20
    });

    if (finalKeys[1]) {
      items.push({
        id: `item-${Date.now()}-2`,
        objectType: finalKeys[1],
        size: detailSize,
        state: 'main',
        x: cx + 160,
        y: cy - 70,
        scale: 0.26,
        rotation: 0,
        zIndex: 15
      });
    }

    if (finalKeys[2]) {
      items.push({
        id: `item-${Date.now()}-3`,
        objectType: finalKeys[2],
        size: detailSize,
        state: 'bg',
        x: cx - 170,
        y: cy - 60,
        scale: 0.26,
        rotation: 0,
        zIndex: 10
      });
    }

    if (finalKeys[3]) {
      items.push({
        id: `item-${Date.now()}-4`,
        objectType: finalKeys[3],
        size: 'S',
        state: 'main',
        x: cx + 60,
        y: cy + 130,
        scale: 0.36,
        rotation: 0,
        zIndex: 25
      });
    }
  }

  return {
    title: prompt,
    matchedTheme: finalKeys.map(k => OBJECT_CATALOG[k]?.labelRu || k).join(' + '),
    recommendedPalette: recPalette,
    items,
    rationale: `Семантический анализатор выделил ключевые образы: ${finalKeys.map(k => OBJECT_CATALOG[k]?.labelRu).join(', ')}. Выстроена сбалансированная изометрическая композиция с чередованием главных и фоновых объектов.`
  };
}

/**
 * Scenario 2: Builds an isometric composition from manually provided object names/keys.
 */
export function generateCompositionFromComponents(
  componentNames: string[],
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): CanvasItem[] {
  const formatConfig = FORMATS[format];
  const cx = formatConfig.width / 2;
  const cy = formatConfig.height / 2;

  const validKeys = componentNames.filter(name => OBJECT_CATALOG[name]);
  if (validKeys.length === 0) return [];

  const items: CanvasItem[] = [];
  const count = validKeys.length;

  validKeys.forEach((key, index) => {
    const offsetStep = 140;
    const centerIdx = (count - 1) / 2;
    const diff = index - centerIdx;

    const x = cx + diff * offsetStep;
    const y = cy + diff * (offsetStep * 0.45);

    items.push({
      id: `item-manual-${Date.now()}-${index}`,
      objectType: key,
      size: detailSize,
      state: index === 0 ? 'main' : (index % 2 === 1 ? 'main' : 'bg'),
      x: Math.round(x),
      y: Math.round(y),
      scale: 0.26,
      rotation: 0,
      zIndex: 10 + index * 5
    });
  });

  return items;
}
