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
    title: 'Конспекты и продуктивность',
    description: 'Открытый блокнот, смартфон на странице, настольная лампа и стилус',
    prompt: 'конспекты учеба продуктивность блокнот лекции знания фокус',
    palette: 'purple'
  },
  {
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, папка документов, монеты и онлайн-банк',
    prompt: 'финансы деньги кошелек бюджет инвестиции сбережения банк монеты',
    palette: 'peach'
  },
  {
    title: 'Запуск IT-стартапа',
    description: 'Смартфон с пазлами сборки продукта, наушники для созвонов и инвестиции',
    prompt: 'стартап технологии приложение код сборка пазл команда разработка',
    palette: 'mint'
  },
  {
    title: 'Рабочее место и организация',
    description: 'Настольная лампа, папка договоров, открытый блокнот и ручка',
    prompt: 'рабочее место офис организация лампа документы порядок отчет',
    palette: 'purple'
  },
  {
    title: 'Творчество и авторский дизайн',
    description: 'Ваза с цветами, стилус для рисования, смартфон и блокнот идей',
    prompt: 'творчество дизайн цветы искусство вдохновение автор проект',
    palette: 'peach'
  }
];

/**
 * Calculates harmonious isometric coordinates inspired by Studio Ochen reference compositions.
 * Prevents overlap collisions and eliminates awkward empty spaces.
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
  const cx = Math.round(W / 2);
  const cy = Math.round(H / 2);

  // 1. Determine palette
  let recPalette: PaletteId = 'purple';
  if (
    pLower.includes('деньги') ||
    pLower.includes('финанс') ||
    pLower.includes('банк') ||
    pLower.includes('бюджет') ||
    pLower.includes('кошелек') ||
    pLower.includes('инвестиц') ||
    pLower.includes('монет')
  ) {
    recPalette = 'peach';
  } else if (
    pLower.includes('стартап') ||
    pLower.includes('технолог') ||
    pLower.includes('приложен') ||
    pLower.includes('ит') ||
    pLower.includes('пазл') ||
    pLower.includes('свеж') ||
    pLower.includes('мят')
  ) {
    recPalette = 'mint';
  }

  const items: CanvasItem[] = [];
  let rationale = '';
  const now = Date.now();

  // SCENARIO A: Finance / Budget
  if (
    pLower.includes('финанс') ||
    pLower.includes('деньги') ||
    pLower.includes('кошелек') ||
    pLower.includes('бюджет') ||
    pLower.includes('инвест')
  ) {
    if (format === '16:9') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'folder',
        size: detailSize,
        state: 'bg',
        x: cx - 180,
        y: cy - 30,
        scale: 0.32,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'wallet',
        size: detailSize,
        state: 'main',
        x: cx + 10,
        y: cy + 40,
        scale: 0.36,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 220,
        y: cy - 40,
        scale: 0.30,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx - 100,
        y: cy + 120,
        scale: 0.42,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-5`,
        objectType: 'coin',
        size: 'S',
        state: 'bg',
        x: cx + 140,
        y: cy + 110,
        scale: 0.34,
        rotation: 0,
        zIndex: 18
      });
    } else if (format === '1:1') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'folder',
        size: detailSize,
        state: 'bg',
        x: cx - 110,
        y: cy - 80,
        scale: 0.30,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'wallet',
        size: detailSize,
        state: 'main',
        x: cx - 10,
        y: cy + 30,
        scale: 0.38,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 140,
        y: cy - 60,
        scale: 0.28,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx - 90,
        y: cy + 120,
        scale: 0.42,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-5`,
        objectType: 'coin',
        size: 'S',
        state: 'bg',
        x: cx + 90,
        y: cy + 110,
        scale: 0.34,
        rotation: 0,
        zIndex: 18
      });
    } else if (format === '9:16') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'folder',
        size: detailSize,
        state: 'bg',
        x: cx + 20,
        y: cy - 200,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx,
        y: cy - 40,
        scale: 0.32,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'wallet',
        size: detailSize,
        state: 'main',
        x: cx - 40,
        y: cy + 140,
        scale: 0.36,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx + 70,
        y: cy + 240,
        scale: 0.42,
        rotation: 0,
        zIndex: 25
      });
    } else {
      // 4:3
      items.push({
        id: `item-${now}-1`,
        objectType: 'folder',
        size: detailSize,
        state: 'bg',
        x: cx - 120,
        y: cy - 60,
        scale: 0.30,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'wallet',
        size: detailSize,
        state: 'main',
        x: cx - 10,
        y: cy + 30,
        scale: 0.36,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 150,
        y: cy - 50,
        scale: 0.28,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx - 100,
        y: cy + 120,
        scale: 0.40,
        rotation: 0,
        zIndex: 25
      });
    }
    rationale = 'Сформирован финансовый кластер: папка отчетов на заднем плане, кошелек в центре внимания, смартфон мобильного банка и золотые монеты на переднем плане.';
  }
  // SCENARIO B: Startup / IT / Tech
  else if (
    pLower.includes('стартап') ||
    pLower.includes('технолог') ||
    pLower.includes('приложен') ||
    pLower.includes('ит') ||
    pLower.includes('пазл') ||
    pLower.includes('продукт')
  ) {
    if (format === '16:9') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'headphones',
        size: detailSize,
        state: 'bg',
        x: cx - 220,
        y: cy - 20,
        scale: 0.30,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 10,
        y: cy + 20,
        scale: 0.34,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'puzzle',
        size: detailSize,
        state: 'main',
        x: cx + 180,
        y: cy - 60,
        scale: 0.32,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx + 110,
        y: cy + 120,
        scale: 0.38,
        rotation: 0,
        zIndex: 30
      });
    } else if (format === '1:1') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx - 20,
        y: cy + 20,
        scale: 0.36,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'puzzle',
        size: detailSize,
        state: 'main',
        x: cx + 110,
        y: cy - 70,
        scale: 0.34,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'headphones',
        size: detailSize,
        state: 'bg',
        x: cx - 130,
        y: cy - 70,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx + 60,
        y: cy + 110,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    } else if (format === '9:16') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'headphones',
        size: detailSize,
        state: 'bg',
        x: cx,
        y: cy - 190,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx,
        y: cy - 10,
        scale: 0.34,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'puzzle',
        size: detailSize,
        state: 'main',
        x: cx - 50,
        y: cy + 150,
        scale: 0.32,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx + 70,
        y: cy + 220,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    } else {
      // 4:3
      items.push({
        id: `item-${now}-1`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx - 10,
        y: cy + 20,
        scale: 0.34,
        rotation: 0,
        zIndex: 20
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'puzzle',
        size: detailSize,
        state: 'main',
        x: cx + 130,
        y: cy - 60,
        scale: 0.32,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'headphones',
        size: detailSize,
        state: 'bg',
        x: cx - 140,
        y: cy - 60,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'coin',
        size: 'S',
        state: 'main',
        x: cx + 60,
        y: cy + 110,
        scale: 0.38,
        rotation: 0,
        zIndex: 30
      });
    }
    rationale = 'Собрана композиция технологического продукта: мобильное приложение в центре, элементы пазла сборки архитектуры и наушники команды.';
  }
  // SCENARIO C: Education / Notes / Default
  else {
    // Official Studio reference: Open Notebook + Phone resting on right page + Pen in front + Lamp behind
    if (format === '16:9') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'lamp',
        size: detailSize,
        state: 'bg',
        x: cx - 240,
        y: cy - 70,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'notebook',
        size: detailSize,
        state: 'main',
        x: cx - 20,
        y: cy + 30,
        scale: 0.34,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 140,
        y: cy - 30,
        scale: 0.26,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'pen',
        size: 'S',
        state: 'main',
        x: cx + 10,
        y: cy + 130,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
      items.push({
        id: `item-${now}-5`,
        objectType: 'headphones',
        size: 'S',
        state: 'bg',
        x: cx + 260,
        y: cy + 50,
        scale: 0.32,
        rotation: 0,
        zIndex: 10
      });
    } else if (format === '1:1') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'lamp',
        size: detailSize,
        state: 'bg',
        x: cx - 130,
        y: cy - 100,
        scale: 0.26,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'notebook',
        size: detailSize,
        state: 'main',
        x: cx - 10,
        y: cy + 20,
        scale: 0.32,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 120,
        y: cy - 30,
        scale: 0.25,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'pen',
        size: 'S',
        state: 'main',
        x: cx + 10,
        y: cy + 120,
        scale: 0.40,
        rotation: 0,
        zIndex: 30
      });
    } else if (format === '9:16') {
      items.push({
        id: `item-${now}-1`,
        objectType: 'lamp',
        size: detailSize,
        state: 'bg',
        x: cx,
        y: cy - 200,
        scale: 0.28,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'notebook',
        size: detailSize,
        state: 'main',
        x: cx,
        y: cy - 10,
        scale: 0.32,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 100,
        y: cy - 60,
        scale: 0.24,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'pen',
        size: 'S',
        state: 'main',
        x: cx + 10,
        y: cy + 110,
        scale: 0.38,
        rotation: 0,
        zIndex: 30
      });
      items.push({
        id: `item-${now}-5`,
        objectType: 'headphones',
        size: 'S',
        state: 'bg',
        x: cx,
        y: cy + 230,
        scale: 0.32,
        rotation: 0,
        zIndex: 10
      });
    } else {
      // 4:3
      items.push({
        id: `item-${now}-1`,
        objectType: 'lamp',
        size: detailSize,
        state: 'bg',
        x: cx - 180,
        y: cy - 70,
        scale: 0.26,
        rotation: 0,
        zIndex: 5
      });
      items.push({
        id: `item-${now}-2`,
        objectType: 'notebook',
        size: detailSize,
        state: 'main',
        x: cx - 10,
        y: cy + 20,
        scale: 0.32,
        rotation: 0,
        zIndex: 15
      });
      items.push({
        id: `item-${now}-3`,
        objectType: 'phone',
        size: detailSize,
        state: 'main',
        x: cx + 120,
        y: cy - 30,
        scale: 0.25,
        rotation: 0,
        zIndex: 25
      });
      items.push({
        id: `item-${now}-4`,
        objectType: 'pen',
        size: 'S',
        state: 'main',
        x: cx + 10,
        y: cy + 120,
        scale: 0.38,
        rotation: 0,
        zIndex: 30
      });
    }
    rationale = 'Собрана эталонная композиция рабочего места: открытый блокнот в центре, смартфон с конспектом на странице, стилус на первом плане и настольная лампа в фоне.';
  }

  return {
    title: prompt,
    matchedTheme: items.map(it => OBJECT_CATALOG[it.objectType]?.labelRu || it.objectType).join(' + '),
    recommendedPalette: recPalette,
    items,
    rationale
  };
}

/**
 * Scenario 2: Groups manually selected components into a coherent, balanced isometric cluster.
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

  // If 1 item: center it
  if (validKeys.length === 1) {
    items.push({
      id: `item-batch-${now}-0`,
      objectType: validKeys[0],
      size: detailSize,
      state: 'main',
      x: cx,
      y: cy,
      scale: 0.36,
      rotation: 0,
      zIndex: 20
    });
    return items;
  }

  // If 2 items: primary at center, secondary adjacent along isometric diagonal
  if (validKeys.length === 2) {
    items.push({
      id: `item-batch-${now}-0`,
      objectType: validKeys[0],
      size: detailSize,
      state: 'main',
      x: cx - 60,
      y: cy + 20,
      scale: 0.34,
      rotation: 0,
      zIndex: 20
    });
    items.push({
      id: `item-batch-${now}-1`,
      objectType: validKeys[1],
      size: detailSize,
      state: validKeys[1] === 'lamp' || validKeys[1] === 'flowers' ? 'bg' : 'main',
      x: cx + 90,
      y: cy - 40,
      scale: 0.30,
      rotation: 0,
      zIndex: 15
    });
    return items;
  }

  // If 3+ items: compose into a tight desk cluster
  // Order: background items (lamp, flowers, folder) in back, main hero in center, accessories (coin, pen, puzzle) in front
  const bgTypes = ['lamp', 'flowers', 'folder'];
  const frontTypes = ['coin', 'pen', 'puzzle'];

  const sortedKeys = [...validKeys].sort((a, b) => {
    const aIsBg = bgTypes.includes(a) ? -1 : (frontTypes.includes(a) ? 1 : 0);
    const bIsBg = bgTypes.includes(b) ? -1 : (frontTypes.includes(b) ? 1 : 0);
    return aIsBg - bIsBg;
  });

  sortedKeys.forEach((key, index) => {
    let x = cx;
    let y = cy;
    let z = 20;
    let st: 'main' | 'bg' = 'main';
    let sc = 0.32;

    if (index === 0 && bgTypes.includes(key)) {
      // Back item
      x = cx - 120;
      y = cy - 80;
      z = 5;
      st = 'bg';
      sc = 0.28;
    } else if (index === 1 || (index === 0 && !bgTypes.includes(key))) {
      // Main hero
      x = cx - 10;
      y = cy + 10;
      z = 20;
      st = 'main';
      sc = 0.36;
    } else if (index === 2) {
      // Right flank
      x = cx + 130;
      y = cy - 30;
      z = 25;
      st = 'main';
      sc = 0.30;
    } else {
      // Foreground accessory
      x = cx + (index % 2 === 0 ? -70 : 60);
      y = cy + 110;
      z = 30 + index;
      st = 'main';
      sc = 0.38;
    }

    items.push({
      id: `item-batch-${now}-${index}`,
      objectType: key,
      size: detailSize,
      state: st,
      x,
      y,
      scale: sc,
      rotation: 0,
      zIndex: z
    });
  });

  return items;
}
