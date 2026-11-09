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
  '16:9': { id: '16:9', label: '16:9 Баннер', width: 1200, height: 675, aspectRatio: '16/9' },
  '1:1': { id: '1:1', label: '1:1 Квадрат', width: 1000, height: 1000, aspectRatio: '1/1' },
  '9:16': { id: '9:16', label: '9:16 Вертикальный', width: 675, height: 1200, aspectRatio: '9/16' },
  '4:3': { id: '4:3', label: '4:3 Карточка', width: 1000, height: 750, aspectRatio: '4/3' },
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
    tags: [
      'смартфон', 'телефон', 'айфон', 'мобильн', 'приложен', 'экран', 'гаджет',
      'связь', 'соцсет', 'чат', 'мессенджер', 'онлайн', 'созвон', 'цифров',
      'it', 'стартап', 'веб', 'технолог', 'разработк', 'интернет', 'программир',
      'тестирован', 'ios', 'android', 'app', 'ui', 'ux', 'код'
    ],
    defaultRole: 'primary'
  },
  notebook: {
    type: 'notebook',
    labelRu: 'Открытый блокнот',
    tags: [
      'блокнот', 'книг', 'тетрад', 'конспект', 'учеб', 'лекци', 'заметк',
      'читать', 'знани', 'образован', 'студент', 'школ', 'урок', 'план',
      'дневник', 'писат', 'стать', 'текст', 'литератур', 'курс', 'обучен',
      'экзамен', 'наука', 'мысли', 'страниц', 'продуктивност'
    ],
    defaultRole: 'primary'
  },
  headphones: {
    type: 'headphones',
    labelRu: 'Наушники',
    tags: [
      'наушник', 'музык', 'звук', 'аудио', 'подкаст', 'трек', 'слушат',
      'бит', 'песн', 'концерт', 'отдых', 'релакс', 'медитац', 'фокус',
      'концентрац', 'плейлист', 'радио', 'голос', 'стрим', 'созвон',
      'гарнитур', 'вайб', 'chill', 'audio', 'sound'
    ],
    defaultRole: 'primary'
  },
  folder: {
    type: 'folder',
    labelRu: 'Папка документов',
    tags: [
      'папк', 'документ', 'договор', 'контракт', 'файл', 'отчет', 'архив',
      'дело', 'бумаг', 'бизнес', 'офис', 'юрист', 'бухгалтер', 'сделк',
      'подпис', 'проект', 'менеджмент', 'задач', 'планирован', 'структур',
      'досье', 'папка', 'управлени'
    ],
    defaultRole: 'secondary'
  },
  wallet: {
    type: 'wallet',
    labelRu: 'Кошелек',
    tags: [
      'кошелек', 'деньги', 'финанс', 'оплат', 'купюр', 'карт', 'банк',
      'бюджет', 'накоплен', 'копить', 'трат', 'расход', 'доход', 'кэш',
      'капитал', 'зарплат', 'сбережен', 'портмоне', 'покупк', 'платеж',
      'баланс', 'сбережения'
    ],
    defaultRole: 'primary'
  },
  coin: {
    type: 'coin',
    labelRu: 'Монеты',
    tags: [
      'монет', 'крипт', 'биткоин', 'инвестиц', 'прибыль', 'цена', 'валют',
      'курс', 'золот', 'кэшбек', 'процент', 'дивиденд', 'рост', 'акци',
      'стейкинг', 'токен', 'счет', 'копейк', 'богатств', 'доллар', 'рубл',
      'деньги', 'капитал'
    ],
    defaultRole: 'accent'
  },
  puzzle: {
    type: 'puzzle',
    labelRu: 'Пазлы',
    tags: [
      'пазл', 'логик', 'головоломк', 'сборк', 'архитектур', 'интеграц',
      'команд', 'решен', 'иде', 'структур', 'деталь', 'кусоч', 'систем',
      'стратеги', 'алгоритм', 'анализ', 'модул', 'конструктор', 'пазлы'
    ],
    defaultRole: 'accent'
  },
  lamp: {
    type: 'lamp',
    labelRu: 'Настольная лампа',
    tags: [
      'ламп', 'свет', 'ночь', 'инсайт', 'озарен', 'иде', 'рабоч', 'стол',
      'уют', 'вечер', 'светильник', 'мысль', 'вдохновен', 'фокус',
      'лаборатор', 'поиск', 'открыти', 'темнот', 'лампа'
    ],
    defaultRole: 'secondary'
  },
  flowers: {
    type: 'flowers',
    labelRu: 'Ваза с цветами',
    tags: [
      'цвет', 'ваз', 'растени', 'творчеств', 'дизайн', 'красот', 'уют',
      'весна', 'природ', 'декор', 'искусств', 'эстетик', 'настроени',
      'вдохновен', 'гармони', 'дом', 'жизнь', 'букет', 'радост',
      'флористик', 'интерьер'
    ],
    defaultRole: 'secondary'
  },
  pen: {
    type: 'pen',
    labelRu: 'Ручка / Стилус',
    tags: [
      'ручк', 'стилус', 'писать', 'подпис', 'автор', 'рисова', 'скетч',
      'чернил', 'карандаш', 'правк', 'редактор', 'договор', 'заметка',
      'почерк', 'инструмент', 'график', 'ручка'
    ],
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
