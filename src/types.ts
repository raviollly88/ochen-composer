export type CanvasFormat = '16:9' | '1:1' | '9:16' | '4:3';
export type DetailSize = 'L' | 'S';
export type ObjectState = 'main' | 'bg';
export type PaletteId = string;

export interface FormatConfig {
  id: CanvasFormat;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const FORMATS: Record<CanvasFormat, FormatConfig> = {
  '16:9': { id: '16:9', label: '16:9 Баннер', width: 960, height: 540, aspectRatio: '16/9' },
  '1:1': { id: '1:1', label: '1:1 Квадрат', width: 720, height: 720, aspectRatio: '1/1' },
  '9:16': { id: '9:16', label: '9:16 Вертикальный', width: 540, height: 960, aspectRatio: '9/16' },
  '4:3': { id: '4:3', label: '4:3 Карточка', width: 800, height: 600, aspectRatio: '4/3' },
};

export interface SVGPath {
  d: string;
  fill: string;
  eo?: boolean;
  op?: number;
}

export interface AssetMeta {
  id: string; // e.g. phone-L-main
  object: string; // e.g. phone
  size: DetailSize;
  state: ObjectState;
  w: number;
  h: number;
  ox?: number;
  oy?: number;
  paths: SVGPath[];
}

export interface ObjectInfo {
  type: string;
  labelRu: string;
  tags: string[];
  defaultRole: 'primary' | 'secondary' | 'accent' | 'background';
}

export const OBJECT_CATALOG: Record<string, ObjectInfo> = {
  phone: {
    type: 'phone',
    labelRu: 'Смартфон',
    tags: ['технологии', 'it', 'связь', 'онлайн', 'приложение', 'гаджет', 'интернет', 'стартап', 'финансы'],
    defaultRole: 'primary'
  },
  notebook: {
    type: 'notebook',
    labelRu: 'Открытый блокнот',
    tags: ['учеба', 'конспекты', 'книга', 'план', 'образование', 'чтение', 'знания', 'заметки', 'продуктивность'],
    defaultRole: 'primary'
  },
  headphones: {
    type: 'headphones',
    labelRu: 'Наушники',
    tags: ['музыка', 'звук', 'аудио', 'подкаст', 'фокус', 'концентрация', 'отдых', 'вебинар', 'созвон'],
    defaultRole: 'secondary'
  },
  folder: {
    type: 'folder',
    labelRu: 'Папка документов',
    tags: ['документы', 'бизнес', 'файлы', 'договор', 'работа', 'архив', 'отчет', 'управление', 'офис'],
    defaultRole: 'secondary'
  },
  wallet: {
    type: 'wallet',
    labelRu: 'Кошелек',
    tags: ['деньги', 'финансы', 'оплата', 'бюджет', 'накопления', 'карта', 'банк', 'инвестиции'],
    defaultRole: 'primary'
  },
  coin: {
    type: 'coin',
    labelRu: 'Монеты',
    tags: ['монеты', 'деньги', 'крипта', 'инвестиции', 'прибыль', 'цена', 'доход', 'золото', 'кэш'],
    defaultRole: 'accent'
  },
  puzzle: {
    type: 'puzzle',
    labelRu: 'Пазлы',
    tags: ['логика', 'решение', 'команда', 'интеграция', 'сборка', 'архитектура', 'идея', 'стратегия', 'пазл'],
    defaultRole: 'accent'
  },
  lamp: {
    type: 'lamp',
    labelRu: 'Настольная лампа',
    tags: ['свет', 'идея', 'инсайт', 'ночь', 'работа', 'уют', 'рабочее место', 'озарение', 'вдохновение'],
    defaultRole: 'secondary'
  },
  flowers: {
    type: 'flowers',
    labelRu: 'Ваза с цветами',
    tags: ['творчество', 'дизайн', 'красота', 'уют', 'декор', 'искусство', 'настроение', 'весна'],
    defaultRole: 'accent'
  },
  pen: {
    type: 'pen',
    labelRu: 'Ручка / Стилус',
    tags: ['письмо', 'подпись', 'дизайн', 'автор', 'создание', 'контент', 'инструмент', 'заметка'],
    defaultRole: 'accent'
  }
};

export interface CanvasItem {
  id: string; // unique instance ID
  objectType: string;
  size: DetailSize;
  state: ObjectState;
  x: number;
  y: number;
  scale: number;
  rotation: number; // degrees
  zIndex: number;
}
