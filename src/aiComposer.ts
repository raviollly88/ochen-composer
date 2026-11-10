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

export interface AIScenario {
  id: string;
  title: string;
  description: string;
  editorialConcept: string;
  visualMetaphor: string;
  hero: string;
  bg: string | null;
  accent: string | null;
  palette: PaletteId;
  paletteRationale: string;
  intentKeywords: string[];
  intentTags: string[];
  discriminators?: string[];
}

/**
 * 20 Distinct, finely-tuned semantic knowledge-base scenarios for Studio Ochen compositions.
 * Each scenario models an editorial publication topic with authentic visual metaphors,
 * strict 2-3 object limits, depth layering, and psychological palette pairings.
 */
export const AI_SCENARIOS: AIScenario[] = [
  // 1. Музыка и отдых (Headphones + Flowers)
  {
    id: 'music_relaxation',
    title: 'Музыка и отдых',
    description: 'Наушники на первом плане и ваза с цветами в мягком фокусе (эталон студии)',
    editorialConcept: 'Атмосфера звукового погружения, акустического комфорта и гармоничного отдыха',
    visualMetaphor: 'Беспроводные наушники как символ чистого звука на переднем плане перед вазой с весенними цветами',
    hero: 'headphones',
    bg: 'flowers',
    accent: null,
    palette: 'mint',
    paletteRationale: 'Мятная палитра Fresh Mint создает ощущение прохлады, чистоты звука и ментального расслабления',
    intentKeywords: [
      'музык', 'отдых', 'релакс', 'трек', 'звук', 'аудио', 'плейлист', 'мелоди', 'бит',
      'песн', 'ваз', 'цвет', 'наушник', 'акустик', 'гармони', 'релаксац', 'вайб',
      'слушат', 'композитор', 'радио', 'вокал', 'саундтрек', 'лаунж',
      'music', 'relax', 'sound', 'audio', 'tune', 'playlist', 'chill', 'headphones', 'flowers'
    ],
    intentTags: ['Аудиокультура', 'Звуковая терапия', 'Отдых и гармония', 'Музыкальный стриминг'],
    discriminators: ['музык', 'песн', 'трек', 'вайб', 'плейлист']
  },

  // 2. Личные финансы и бюджет (Wallet + Folder + Coin)
  {
    id: 'personal_finance',
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, папка документов в верхнем правом углу и монета на столе (эталон студии)',
    editorialConcept: 'Управление личными накоплениями, финансовая грамотность и осознанный учет бюджета',
    visualMetaphor: 'Кошелек как фокус материальных ресурсов на переднем плане, монета вдоль 30° оси и папка финансовой отчетности в фоне',
    hero: 'wallet',
    bg: 'folder',
    accent: 'coin',
    palette: 'peach',
    paletteRationale: 'Теплый персик Warm Peach передает материальную надежность, стабильность и осязаемость капитала',
    intentKeywords: [
      'финанс', 'бюджет', 'кошел', 'деньг', 'накоплен', 'сбережен', 'доход', 'расход',
      'зарплат', 'капитал', 'трат', 'эконом', 'счет', 'наличн', 'монет', 'банк',
      'кеш', 'подушк', 'рубл', 'доллар', 'евро', 'портмоне', 'платеж', 'баланс',
      'wallet', 'money', 'budget', 'finance', 'salary', 'savings', 'cash', 'income'
    ],
    intentTags: ['Личный бюджет', 'Финансовая грамотность', 'Управление капиталом', 'Сбережения'],
    discriminators: ['бюджет', 'кошел', 'деньг', 'зарплат', 'расход', 'доход', 'накоплен']
  },

  // 3. Журналистика и писательство (Notebook + Lamp + Pen)
  {
    id: 'journalism_writing',
    title: 'Журналистика и писательство',
    description: 'Открытый блокнот, настольная лампа в фоне и ручка перед разворотом (референс студии)',
    editorialConcept: 'Авторское ремесло, редакторская работа, написание публицистических статей и литературное творчество',
    visualMetaphor: 'Развернутый блокнот в свете настольной лампы и перьевая ручка у линии закладки',
    hero: 'notebook',
    bg: 'lamp',
    accent: 'pen',
    palette: 'purple',
    paletteRationale: 'Глубокий чернильно-пурпурный цвет Purple Mist отсылает к типографской краске и книжным переплетам',
    intentKeywords: [
      'журналист', 'писател', 'автор', 'стать', 'текст', 'рукопис', 'репортаж',
      'блокнот', 'ручк', 'перо', 'редакци', 'копирайт', 'эссе', 'книг', 'чернил',
      'публикац', 'пресса', 'издательств', 'сценар', 'поэзи', 'стих', 'заметк',
      'write', 'author', 'journalism', 'article', 'essay', 'notebook', 'pen', 'press'
    ],
    intentTags: ['Публицистика', 'Авторский текст', 'Редакторское ремесло', 'Литературное творчество'],
    discriminators: ['журналист', 'писател', 'репортаж', 'рукопис', 'автор', 'стать']
  },

  // 4. IT-стартап и разработка (Phone + Lamp + Puzzle)
  {
    id: 'it_startup_dev',
    title: 'IT-стартап и разработка',
    description: 'Смартфон в левом нижнем углу, модули пазла в правом верхнем и лампа в дальнем углу (референс пользователя)',
    editorialConcept: 'Создание технологического продукта, микросервисная архитектура и запуск инновационного SaaS',
    visualMetaphor: 'Смартфон продукта на переднем плане слева, модули пазла архитектуры в правом верхнем квадранте и лампа в дальнем верхнем углу',
    hero: 'phone',
    bg: 'lamp',
    accent: 'puzzle',
    palette: 'mint',
    paletteRationale: 'Свежий технологичный мятный оттенок подчеркивает инновации и гибкую цифровую экосистему',
    intentKeywords: [
      'стартап', 'технологи', 'приложен', 'код', 'разработк', 'программ', 'saas', 'дев',
      'архитектур', 'пазл', 'скрипт', 'инженер', 'сервис', 'бэкенд', 'фронтенд', 'деплой',
      'гит', 'коммит', 'релиз', 'баг', 'фич', 'api', 'интеграц', 'it', 'продукт',
      'startup', 'dev', 'code', 'software', 'tech', 'architecture', 'puzzle', 'engineer', 'product'
    ],
    intentTags: ['Software Engineering', 'Стартап-экосистема', 'Архитектура решений', 'Цифровые продукты'],
    discriminators: ['стартап', 'saas', 'код', 'разработк', 'архитектур', 'продукт']
  },

  // 5. Рабочее пространство и порядок (Notebook + Folder + Pen)
  {
    id: 'workspace_order',
    title: 'Рабочее пространство и порядок',
    description: 'Папка документов в фоне справа, открытый блокнот регламентов и перьевая ручка для визирования',
    editorialConcept: 'Организация рабочего стола, регламенты, корпоративное делопроизводство и структурный порядок',
    visualMetaphor: 'Папка документов в правом верхнем фоне, открытый блокнот нормативов и ручка для визирования на переднем плане',
    hero: 'notebook',
    bg: 'folder',
    accent: 'pen',
    palette: 'purple',
    paletteRationale: 'Строгая фиолетовая палитра задает тон собранности, структурности и деловой дисциплины',
    intentKeywords: [
      'папк', 'документ', 'офис', 'порядок', 'регламент', 'делопроизводств', 'дело',
      'архив', 'стол', 'кабинет', 'рабоч', 'подпис', 'ручк', 'канцеляр', 'досье',
      'бюрократи', 'отчет', 'структур', 'инструкци', 'согласован', 'блокнот',
      'workspace', 'office', 'folder', 'documents', 'desk', 'order', 'report', 'notebook'
    ],
    intentTags: ['Делопроизводство', 'Организация офиса', 'Рабочие процессы', 'Документооборот'],
    discriminators: ['делопроизводств', 'регламент', 'архив', 'канцеляр', 'документооборот', 'порядок']
  },

  // 6. Кибербезопасность и защита данных (Wallet + Coin + Puzzle)
  {
    id: 'cybersecurity',
    title: 'Кибербезопасность и защита данных',
    description: 'Защищенное хранилище, криптографический пазл и токен безопасности',
    editorialConcept: 'Информационная безопасность, защита персональных данных, шифрование и защита от киберугроз',
    visualMetaphor: 'Кошелек как защищенный периметр, составные блоки защитного пазла и токен аутентификации',
    hero: 'wallet',
    bg: 'puzzle',
    accent: 'coin',
    palette: 'purple',
    paletteRationale: 'Пурпурный оттенок символизирует надежность защитного периметра, конфиденциальность и устойчивость',
    intentKeywords: [
      'кибербезопасн', 'безопасн', 'защит', 'данн', 'парол', 'шифрован', 'утечк',
      'уязвимост', 'хакер', 'атак', 'периметр', 'токен', 'аутентификац', 'доступ',
      'приватност', 'vpn', 'брандмауэр', 'криптографи', 'secops',
      'security', 'cyber', 'privacy', 'protection', 'encryption', 'auth', 'hacker'
    ],
    intentTags: ['Информационная безопасность', 'Защита данных', 'Криптография', 'Киберугрозы'],
    discriminators: ['кибербезопасн', 'шифрован', 'утечк', 'уязвимост', 'хакер', 'парол']
  },

  // 7. Учеба, лекции и конспекты (Notebook + Pen + Phone)
  {
    id: 'education_lectures',
    title: 'Учеба, лекции и конспекты',
    description: 'Развернутый конспект со смартфоном и ручкой для академических записей',
    editorialConcept: 'Университетское образование, студенческие лекции, конспекты и подготовка к экзаменам',
    visualMetaphor: 'Открытый блокнот с записями, смартфон с учебными материалами и ручка для пометок',
    hero: 'notebook',
    bg: 'phone',
    accent: 'pen',
    palette: 'peach',
    paletteRationale: 'Персиковый колорит способствует длительной умственной концентрации и когнитивному комфорту',
    intentKeywords: [
      'учеб', 'лекци', 'конспект', 'сесси', 'экзамен', 'студент', 'университет',
      'вуз', 'школ', 'курс', 'тетрад', 'заметк', 'запис', 'диплом', 'реферат',
      'семинар', 'преподавател', 'шпоргалк', 'зачет', 'обучен',
      'education', 'study', 'lecture', 'notes', 'student', 'exam', 'university'
    ],
    intentTags: ['Академическое обучение', 'Студенческая жизнь', 'Конспектирование', 'Подготовка к экзаменам'],
    discriminators: ['сесси', 'экзамен', 'студент', 'лекци', 'конспект', 'вуз']
  },

  // 8. Юриспруденция и договоры (Folder + Notebook + Pen)
  {
    id: 'law_contracts',
    title: 'Юриспруденция и договоры',
    description: 'Материалы дела, свод нормативов и ручка для визирования контрактов',
    editorialConcept: 'Юридическая практика, экспертиза контрактов, судебные споры и правовые регламенты',
    visualMetaphor: 'Деловое досье, нормативный блокнот законов и ручка для визирования соглашений',
    hero: 'folder',
    bg: 'notebook',
    accent: 'pen',
    palette: 'purple',
    paletteRationale: 'Академический пурпур подчеркивает авторитет закона, точность формулировок и процессуальный статус',
    intentKeywords: [
      'юриспруденц', 'договор', 'контракт', 'прав', 'закон', 'юрист', 'адвокат',
      'суд', 'арбитраж', 'соглашен', 'иск', 'норматив', 'кодекс', 'неустойк',
      'сделк', 'правовой', 'нотариус', 'претензи', 'юридическ',
      'legal', 'law', 'contract', 'lawyer', 'court', 'agreement', 'justice'
    ],
    intentTags: ['Юридическая практика', 'Договорное право', 'Правовая экспертиза', 'Арбитраж'],
    discriminators: ['юрист', 'адвокат', 'суд', 'арбитраж', 'договор', 'контракт', 'иск']
  },

  // 9. Мобильные приложения и сервисы (Phone + Headphones + Puzzle)
  {
    id: 'mobile_apps',
    title: 'Мобильные приложения и сервисы',
    description: 'Смартфон с открытым сервисом, гарнитура связи и модульные блоки функционала',
    editorialConcept: 'Мобильный опыт пользователя, экосистема мобильных сервисов и поведение в приложениях',
    visualMetaphor: 'Смартфон с активным интерфейсом, аудионаушники стриминга и модульные виджеты UI',
    hero: 'phone',
    bg: 'headphones',
    accent: 'puzzle',
    palette: 'mint',
    paletteRationale: 'Мятный оттенок передает эргономику экранов современных девайсов и легкость взаимодействия',
    intentKeywords: [
      'мобил', 'приложен', 'смартфон', 'ios', 'android', 'интерфейс', 'ux', 'ui',
      'виджет', 'экран', 'сервис', 'аппк', 'фич', 'онбординг', 'экосистем',
      'девайс', 'гаджет', 'пуш', 'айфон',
      'mobile', 'app', 'smartphone', 'interface', 'features', 'ux', 'ui', 'device'
    ],
    intentTags: ['Мобильные сервисы', 'UI/UX дизайн', 'Экосистема приложений', 'Мобильный стек'],
    discriminators: ['мобильн', 'смартфон', 'ios', 'android', 'аппк', 'онбординг']
  },

  // 10. Инвестиции и крипта (Wallet + Folder + Coin)
  {
    id: 'crypto_investments',
    title: 'Инвестиции и крипта',
    description: 'Криптокошелек, папка инвестиционного портфеля и цифровая монета',
    editorialConcept: 'Рынок криптовалют, венчурные инвестиции, доходность активов и блокчейн-проекты',
    visualMetaphor: 'Криптокошелек, папка инвестиционного портфеля и цифровая монета на переднем плане',
    hero: 'wallet',
    bg: 'folder',
    accent: 'coin',
    palette: 'peach',
    paletteRationale: 'Золотисто-персиковая палитра символизирует финансовый рост, инвестиционный капитал и дивиденды',
    intentKeywords: [
      'крипт', 'биткоин', 'блокчейн', 'инвестиц', 'токен', 'монет', 'портфел',
      'актив', 'доходност', 'дивиденд', 'трейдинг', 'биржа', 'ethereum', 'btc',
      'стейкинг', 'defi', 'халвинг', 'криптовалют', 'фондов', 'акци',
      'crypto', 'bitcoin', 'investment', 'blockchain', 'portfolio', 'trading', 'token'
    ],
    intentTags: ['Криптоиндустрия', 'Инвестиционный портфель', 'Блокчейн-активы', 'Венчурные сделки'],
    discriminators: ['крипт', 'биткоин', 'блокчейн', 'инвестиц', 'дивиденд', 'токен', 'btc']
  },

  // 11. Диджитал-маркетинг и аналитика (Folder + Phone + Puzzle)
  {
    id: 'digital_marketing',
    title: 'Диджитал-маркетинг и аналитика',
    description: 'Смартфон рекламных кампаний, папка отчетов и кусочки воронки конверсии',
    editorialConcept: 'Интернет-маркетинг, воронки продаж, таргетированная реклама, сквозная аналитика и retention',
    visualMetaphor: 'Смартфон с рекламным дашбордом, папка маркетинговых отчетов и элементы воронки конверсии',
    hero: 'phone',
    bg: 'folder',
    accent: 'puzzle',
    palette: 'mint',
    paletteRationale: 'Динамичный мятный цвет ассоциируется с ростом трафика, конверсией и гибкими гипотезами',
    intentKeywords: [
      'маркетинг', 'реклам', 'трафик', 'воронк', 'конверси', 'таргет', 'аналитик',
      'лид', 'retention', 'метрик', 'кампани', 'roi', 'smm', 'продвижен',
      'контекст', 'клик', 'аудитори', 'сегментац',
      'marketing', 'traffic', 'funnel', 'conversion', 'analytics', 'growth', 'leads'
    ],
    intentTags: ['Digital Marketing', 'Сквозная аналитика', 'Воронки продаж', 'Трафик и конверсия'],
    discriminators: ['маркетинг', 'таргет', 'трафик', 'воронк', 'конверси', 'лид']
  },

  // 12. Путешествия и впечатления (Phone + Flowers + Headphones)
  {
    id: 'travel_impressions',
    title: 'Путешествия и впечатления',
    description: 'Наушники для дороги, свежие цветы и смартфон с билетами и маршрутом',
    editorialConcept: 'Туризм, поездки в новые страны, культурные открытия, дорожные заметки и вдохновение',
    visualMetaphor: 'Наушники для атмосферного дорожного плейлиста, свежие цветы и смартфон с билетами',
    hero: 'headphones',
    bg: 'flowers',
    accent: 'phone',
    palette: 'mint',
    paletteRationale: 'Свежий мятный цвет передает воздух дальних странствий, новизну впечатлений и свободу',
    intentKeywords: [
      'путешеств', 'туризм', 'поездк', 'отпуск', 'билет', 'маршрут', 'город',
      'отел', 'самолет', 'впечатлен', 'дорог', 'гид', 'экскурси', 'стран',
      'багаж', 'аэропорт', 'рейс', 'чемодан', 'виза', 'пляж', 'гор',
      'travel', 'trip', 'tour', 'vacation', 'journey', 'flight', 'destination'
    ],
    intentTags: ['Путешествия и туризм', 'Дорожные заметки', 'Культурные впечатления', 'Экспедиции'],
    discriminators: ['путешеств', 'туризм', 'отпуск', 'поездк', 'билет', 'отел', 'рейс']
  },

  // 13. Уют и домашняя атмосфера (Flowers + Notebook + Pen)
  {
    id: 'cozy_home',
    title: 'Уют и домашняя атмосфера',
    description: 'Личный дневник на столике, свежий весенний букет цветов и ручка для мыслей',
    editorialConcept: 'Домашний очаг, медленная жизнь (slow living), уютные вечера, декор и теплое пространство',
    visualMetaphor: 'Личный дневник на столе, весенний букет цветов в вазе и ручка для фиксации мыслей',
    hero: 'notebook',
    bg: 'flowers',
    accent: 'pen',
    palette: 'peach',
    paletteRationale: 'Персиковое тепло окутывает пространство уютом, согревает и создает атмосферу дома',
    intentKeywords: [
      'уют', 'дом', 'атмосфер', 'тепл', 'хюгге', 'интерьер', 'комфорт', 'вечер',
      'покой', 'камин', 'плед', 'свеч', 'ваз', 'цвет', 'тишин', 'семейн',
      'дизайн интерьер', 'декор', 'мебел', 'скандинавск',
      'cozy', 'home', 'interior', 'warm', 'hygge', 'comfort', 'peace', 'flowers'
    ],
    intentTags: ['Домашний уют', 'Хюгге и интерьер', 'Slow living', 'Гармония пространства'],
    discriminators: ['уют', 'хюгге', 'интерьер', 'плед', 'тепл', 'дом']
  },

  // 14. Логистика и цепочки поставок (Folder + Puzzle + Coin)
  {
    id: 'logistics_supply',
    title: 'Логистика и цепочки поставок',
    description: 'Папка транспортных накладных, звенья цепи поставок и расчет фрахта',
    editorialConcept: 'Управление цепочками поставок (Supply Chain), складской учет, транспортные хабы и оптимизация фрахта',
    visualMetaphor: 'Папка накладных документов, звенья логистической цепи и расчет себестоимости грузоперевозок',
    hero: 'folder',
    bg: 'puzzle',
    accent: 'coin',
    palette: 'purple',
    paletteRationale: 'Пурпурная палитра выражает стабильность логистических узлов и надежность контрактных связей',
    intentKeywords: [
      'логистик', 'поставк', 'склад', 'груз', 'доставк', 'цепочк', 'транспорт',
      'фура', 'таможн', 'фрахт', 'маршрутизац', 'хаб', 'перевозк', 'снабжен',
      'грузоперевозк', 'отгрузк', 'инвентаризац', 'порты',
      'supply', 'chain', 'logistics', 'warehouse', 'freight', 'cargo', 'delivery'
    ],
    intentTags: ['Цепочки поставок', 'Складская логистика', 'Грузоперевозки', 'Оптимизация логистики'],
    discriminators: ['логистик', 'склад', 'поставк', 'груз', 'доставк', 'фрахт']
  },

  // 15. Дизайн и креативное мышление (Puzzle + Notebook + Pen)
  {
    id: 'design_creative',
    title: 'Дизайн и креативное мышление',
    description: 'Эскизный блокнот, кусочки головоломки и инструмент отрисовки (Card 6 студии)',
    editorialConcept: 'Графический и продуктовый дизайн, генерация визуальных идей, дизайн-системы и проектирование',
    visualMetaphor: 'Эскизный блокнот, составные части визуального пазла и перьевая ручка для точной отрисовки',
    hero: 'notebook',
    bg: 'puzzle',
    accent: 'pen',
    palette: 'purple',
    paletteRationale: 'Творческий пурпур — канонический цвет графического искусства, формы и эстетики',
    intentKeywords: [
      'дизайн', 'креатив', 'айдентик', 'эскиз', 'визуал', 'прототип', 'композици',
      'стил', 'типографик', 'логотип', 'арт', 'концепт', 'иллюстрац', 'пазл',
      'скетч', 'макет', 'художник', 'figma', 'сетк', 'цветов', 'перо',
      'design', 'creative', 'visual', 'prototype', 'sketch', 'style', 'art', 'layout'
    ],
    intentTags: ['Графический дизайн', 'Креативное мышление', 'Айдентика брендов', 'Прототипирование'],
    discriminators: ['дизайн', 'креатив', 'айдентик', 'эскиз', 'прототип', 'логотип']
  },

  // 16. Наука и исследования (Notebook + Lamp + Puzzle)
  {
    id: 'science_research',
    title: 'Наука и исследования',
    description: 'Журнал исследований под светом лампы и несобранная модель гипотезы',
    editorialConcept: 'Фундаментальные научные исследования, академические гипотезы, доказательства и открытия',
    visualMetaphor: 'Журнал лабораторных исследований под лампой и сложная научная задача-пазл',
    hero: 'notebook',
    bg: 'lamp',
    accent: 'puzzle',
    palette: 'purple',
    paletteRationale: 'Сдержанный академический пурпур подчеркивает интеллектуальную строгость и глубину мысли',
    intentKeywords: [
      'наук', 'исследован', 'учен', 'лаборатор', 'гипотез', 'эксперимент', 'открыти',
      'диссертац', 'физик', 'биолог', 'математик', 'данн', 'теоретик', 'публикац',
      'академическ', 'формул', 'научн', 'институт',
      'science', 'research', 'experiment', 'laboratory', 'hypothesis', 'study', 'scientific'
    ],
    intentTags: ['Фундаментальная наука', 'Академические исследования', 'Эксперименты', 'Научные открытия'],
    discriminators: ['наук', 'исследован', 'лаборатор', 'гипотез', 'эксперимент', 'учен']
  },

  // 17. Электронная коммерция и ритейл (Phone + Wallet + Coin)
  {
    id: 'ecommerce_retail',
    title: 'Электронная коммерция и ритейл',
    description: 'Платежный кошелек, витрина маркетплейса на телефоне и монета покупки',
    editorialConcept: 'Электронная коммерция, онлайн-маркетплейсы, интернет-магазины и омниканальные продажи',
    visualMetaphor: 'Кошелек для онлайн-оплаты, витрина маркетплейса на смартфоне и монета успешной транзакции',
    hero: 'wallet',
    bg: 'phone',
    accent: 'coin',
    palette: 'peach',
    paletteRationale: 'Персиковая гамма создает доверительную атмосферу покупок, шопинга и комфорта сервиса',
    intentKeywords: [
      'коммерц', 'ритейл', 'магазин', 'маркетплейс', 'покупк', 'продаж', 'товар',
      'оплат', 'шопинг', 'чек', 'корзин', 'wildberries', 'ozon', 'заказ',
      'дропшиппинг', 'курьер', 'витрин', 'клиент', 'мерчант',
      'ecommerce', 'retail', 'shop', 'store', 'marketplace', 'buy', 'sale', 'cart'
    ],
    intentTags: ['Электронная коммерция', 'Маркетплейсы', 'Онлайн-продажи', 'Платежные шлюзы'],
    discriminators: ['ритейл', 'маркетплейс', 'шопинг', 'покупк', 'магазин', 'товар', 'корзин']
  },

  // 18. Менеджмент и планирование (Folder + Pen + Coin)
  {
    id: 'management_planning',
    title: 'Менеджмент и планирование',
    description: 'Папка дорожной карты проектов, ручка руководителя и монета бюджетирования',
    editorialConcept: 'Стратегический менеджмент, операционное планирование, распределение ресурсов и дедлайны',
    visualMetaphor: 'Папка дорожной карты проектов, перьевая ручка для визирования планов и монета бюджетирования задач',
    hero: 'folder',
    bg: 'pen',
    accent: 'coin',
    palette: 'purple',
    paletteRationale: 'Глубокий пурпур символизирует стратегическое лидерство, ответственность и выверенность решений',
    intentKeywords: [
      'менеджмент', 'управлен', 'планирован', 'руководител', 'лидерств', 'проект',
      'дедлайн', 'команд', 'задач', 'план', 'ресурс', 'okr', 'agile', 'стратеги',
      'делегирован', 'митинг', 'спринт', 'roadmap', 'директор',
      'management', 'planning', 'manager', 'leadership', 'project', 'strategy', 'deadline'
    ],
    intentTags: ['Операционный менеджмент', 'Управление проектами', 'Стратегическое планирование', 'Лидерство'],
    discriminators: ['менеджмент', 'управлен', 'планирован', 'дедлайн', 'лидерств', 'руководител']
  },

  // 19. Подкасты и медиа (Headphones + Lamp + Phone)
  {
    id: 'podcasts_media',
    title: 'Подкасты и медиа',
    description: 'Студийные мониторные наушники, свет лампы студии и смартфон записи (User Reference Image 2)',
    editorialConcept: 'Индустрия разговорных подкастов, радиоэфиры, студийная звукозапись и цифровой контент',
    visualMetaphor: 'Профессиональные мониторные наушники, свет студийной лампы в верхнем левом углу и смартфон записи в нижнем левом углу',
    hero: 'headphones',
    bg: 'lamp',
    accent: 'phone',
    palette: 'mint',
    paletteRationale: 'Современный мятный колорит придает композиции медийную выразительность и студийную чистоту',
    intentKeywords: [
      'подкаст', 'эфир', 'микрофон', 'радио', 'студи', 'запис', 'интервью',
      'ведущ', 'голос', 'выпуск', 'слушател', 'стрим', 'шоу', 'медиа',
      'спикер', 'диктор', 'контент', 'youtube', 'spotify',
      'podcast', 'stream', 'studio', 'mic', 'broadcast', 'interview', 'voice', 'episode'
    ],
    intentTags: ['Подкастинг', 'Студийная звукозапись', 'Разговорные медиа', 'Цифровое вещание'],
    discriminators: ['подкаст', 'интервью', 'микрофон', 'эфир', 'диктор', 'радио']
  },

  // 20. Саморазвитие и продуктивность (Notebook + Flowers + Pen)
  {
    id: 'self_development',
    title: 'Саморазвитие и продуктивность',
    description: 'Дневник утренних страниц, цветущие тюльпаны обновления и ручка для инсайтов',
    editorialConcept: 'Личностный рост, осознанность, трекинг полезных привычек, утренние ритуалы и ментальный баланс',
    visualMetaphor: 'Дневник утренних страниц, цветущие тюльпаны обновления и ручка для фиксации инсайтов',
    hero: 'notebook',
    bg: 'flowers',
    accent: 'pen',
    palette: 'peach',
    paletteRationale: 'Теплый персик транслирует бережное отношение к себе, гармонию и внутреннее вдохновение',
    intentKeywords: [
      'саморазвити', 'продуктивност', 'привычк', 'осознанност', 'мотиваци', 'цел',
      'рост', 'дневник', 'ментальн', 'гармони', 'утро', 'фокус', 'успех',
      'медитац', 'баланс', 'дисциплин', 'ритуал', 'вдохновен',
      'mindfulness', 'habits', 'productivity', 'goals', 'growth', 'motivation', 'focus'
    ],
    intentTags: ['Личностный рост', 'Осознанность и mindfulness', 'Трекинг привычек', 'Ментальное здоровье'],
    discriminators: ['саморазвити', 'осознанност', 'привычк', 'личностн', 'мотиваци']
  }
];

/**
 * 5 Visible Quick-Launch Presets displayed in the UI Sidebar.
 * The other 15 remain seamlessly accessible and dynamically selected by AI semantic similarity!
 */
export const PRESET_THEMES: PresetTheme[] = [
  {
    title: 'Музыка и отдых',
    description: 'Наушники на переднем плане и ваза с цветами в левом верхнем фоне',
    prompt: 'музыка отдых релакс треки звук гармония акустика ваза цветы',
    palette: 'mint'
  },
  {
    title: 'Конспекты и продуктивность',
    description: 'Открытый блокнот со смартфоном на странице и ручкой для пометок',
    prompt: 'конспекты учеба продуктивность блокнот записи лекции смартфон ручка',
    palette: 'peach'
  },
  {
    title: 'Личные финансы и бюджет',
    description: 'Кожаный кошелек, папка документов в верхнем правом фоне и монета',
    prompt: 'личные финансы деньги кошелек папка документов бюджет накопления монета',
    palette: 'peach'
  },
  {
    title: 'IT-стартап и продукт',
    description: 'Смартфон приложения, модули пазла и лампа в дальнем углу (референс)',
    prompt: 'стартап технологии приложение код сборка пазл разработка продукт saas',
    palette: 'mint'
  },
  {
    title: 'Рабочее пространство и порядок',
    description: 'Папка документов в фоне справа, открытый блокнот и ручка для подписи',
    prompt: 'документы папка договор подпись работа офис регламент порядок блокнот ручка',
    palette: 'purple'
  }
];

/**
 * Natural companion pairings for each primary object when fewer than 3 objects are matched.
 * Strictly adheres to Studio Ochen's reference compositions and breaks lamp monotony.
 */
export const NATURAL_COMPANIONS: Record<string, { bg: string | null; accent: string | null }> = {
  notebook: { bg: 'phone', accent: 'pen' },
  wallet: { bg: 'folder', accent: 'coin' },
  phone: { bg: null, accent: 'puzzle' },
  headphones: { bg: 'flowers', accent: null },
  folder: { bg: 'notebook', accent: 'pen' },
  lamp: { bg: null, accent: 'wallet' },
  flowers: { bg: null, accent: 'headphones' },
  pen: { bg: 'notebook', accent: null },
  coin: { bg: 'folder', accent: 'wallet' },
  puzzle: { bg: null, accent: 'phone' }
};

/**
 * Deterministic string hash for consistent fallback distributions.
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
 * Normalizes text, strips punctuation, and extracts tokens.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, ' ')
    .split(/[\s-]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1);
}

/**
 * Fast inflectional stemmer for Russian and English words.
 */
function stemWord(word: string): string {
  if (word.length <= 3) return word;

  const ruSuffixes = [
    /ический$/, /ческого$/, /ческая$/, /скими$/, /ский$/,
    /овать$/, /евать$/,
    /ация$/, /ации$/, /ацию$/, /ацией$/,
    /ение$/, /ения$/, /ению$/, /ением$/, /ении$/,
    /ость$/, /ости$/, /остью$/,
    /ство$/, /ства$/, /ству$/, /ством$/,
    /ный$/, /ная$/, /ное$/, /ные$/, /ных$/, /ным$/, /ной$/,
    /тый$/, /тая$/, /тое$/, /тые$/,
    /ами$/, /ями$/,
    /ов$/, /ев$/, /ей$/,
    /ом$/, /ем$/, /ам$/, /ям$/,
    /ах$/, /ях$/,
    /ой$/, /ей$/, /ий$/, /ый$/, /ая$/, /яя$/, /ое$/, /ее$/,
    /а$/, /е$/, /и$/, /о$/, /у$/, /ы$/, /я$/
  ];

  for (const re of ruSuffixes) {
    if (word.length > 5 && re.test(word)) {
      return word.replace(re, '');
    }
  }

  const enSuffixes = [/ing$/, /tion$/, /ment$/, /ness$/, /able$/, /ies$/, /es$/, /ed$/, /er$/, /al$/, /s$/];
  for (const re of enSuffixes) {
    if (word.length > 4 && re.test(word)) {
      return word.replace(re, '');
    }
  }

  return word;
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

interface PlacedRaw {
  type: string;
  state: 'main' | 'bg';
  x: number;
  y: number;
  scale: number;
  rot: number;
  zIndex: number;
}

/**
 * Builds authentic Studio Ochen isometric desk compositions.
 * Implements the iconic studio layout archetypes with 30-degree isometric grid alignment:
 * 1. Notebook archetype (User Image 3, Card 2, Card 6)
 * 2. Wallet archetype (Card 3, Card 5 with no lamp base collision)
 * 3. Headphones archetype (Card 4)
 * 4. Phone archetype (Card 1)
 * 5. Folder archetype
 * 6. Lamp / Floral / Modular archetypes
 *
 * Elements are scaled at authentic desktop scale (~0.80..1.08) without artificial squashing.
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

  const placed: PlacedRaw[] = [];

  // ARCHETYPE 1: Notebook
  if (heroKey === 'notebook') {
    if (accentKey === 'phone' || bgKey === 'phone') {
      // Studio Card 2: Book in background/center + Phone on right page
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx - 100 * sx),
        y: Math.round(cy - 20 * sy),
        scale: Number((s * 1.02).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx + 100 * sx),
        y: Math.round(cy - 60 * sy),
        scale: Number((s * 0.85).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      const third = bgKey !== 'phone' ? bgKey : accentKey !== 'phone' ? accentKey : null;
      if (third === 'lamp') {
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 230 * sx),
          y: Math.round(cy - 210 * sy),
          scale: Number((s * 1.03).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      } else if (third === 'pen') {
        placed.push({
          type: 'pen',
          state: 'main',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy + 280 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      } else if (third) {
        placed.push({
          type: third,
          state: 'bg',
          x: Math.round(cx - 230 * sx),
          y: Math.round(cy - 210 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
    } else if (accentKey === 'puzzle' || bgKey === 'puzzle') {
      // Studio Card 6 / Scenario 15 & 16: Book bleeding top-right + Puzzle on left page
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx + 160 * sx),
        y: Math.round(cy - 100 * sy),
        scale: Number((s * 1.02).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'puzzle',
        state: 'main',
        x: Math.round(cx - 20 * sx),
        y: Math.round(cy - 130 * sy),
        scale: Number((s * 0.92).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      const thirdKey = bgKey === 'puzzle' ? accentKey : bgKey;
      if (thirdKey === 'lamp') {
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 230 * sx),
          y: Math.round(cy - 210 * sy),
          scale: Number((s * 1.03).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      } else if (thirdKey === 'pen') {
        placed.push({
          type: 'pen',
          state: 'main',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy + 300 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      } else if (thirdKey) {
        placed.push({
          type: thirdKey,
          state: 'main',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy + 300 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else if (bgKey === 'lamp') {
      // User Reference Layout (Image 3): Lamp upper-left + Notebook lower-right foreground + Pen/Accent along lower edge
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 230 * sx),
        y: Math.round(cy - 220 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx + 270 * sx),
        y: Math.round(cy + 310 * sy),
        scale: Number((s * 1.02).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy + 360 * sy),
          scale: Number((accentKey === 'flowers' ? s * 0.88 : s).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    } else if (bgKey === 'folder') {
      // Workspace & Order: Folder bleeding top-right background + Notebook center-left foreground + Pen lower-right foreground
      placed.push({
        type: 'folder',
        state: 'bg',
        x: Math.round(cx + 220 * sx),
        y: Math.round(cy - 130 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx - 130 * sx),
        y: Math.round(cy + 110 * sy),
        scale: Number((s * 1.02).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx + 140 * sx),
          y: Math.round(cy + 270 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    } else {
      // Notebook + Accent in foreground + optional Flower/other bg
      placed.push({
        type: 'notebook',
        state: 'main',
        x: Math.round(cx + 270 * sx),
        y: Math.round(cy + 310 * sy),
        scale: Number((s * 1.02).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 160 * sx),
          y: Math.round(cy + 360 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 240 * sx),
          y: Math.round(cy - 200 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
    }

  // ARCHETYPE 2: Wallet
  } else if (heroKey === 'wallet') {
    if (bgKey === 'folder') {
      // Studio Card 3: Folder bleeding top-right + Wallet foreground-left + Coin foreground-right
      placed.push({
        type: 'folder',
        state: 'bg',
        x: Math.round(cx + 200 * sx),
        y: Math.round(cy - 120 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 200 * sx),
        y: Math.round(cy + 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx + 120 * sx),
          y: Math.round(cy + 240 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else if (bgKey === 'lamp') {
      // Studio Card 5: Lamp upper-left + Wallet lower-center + Coin right (no lamp base collision!)
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 300 * sx),
        y: Math.round(cy - 320 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 80 * sx),
        y: Math.round(cy + 190 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx + 160 * sx),
          y: Math.round(cy + 10 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else {
      placed.push({
        type: 'wallet',
        state: 'main',
        x: Math.round(cx - 160 * sx),
        y: Math.round(cy + 190 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx + 180 * sx),
          y: Math.round(cy + 220 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 230 * sx),
          y: Math.round(cy - 200 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 1
        });
      }
    }

  // ARCHETYPE 3: Headphones
  } else if (heroKey === 'headphones') {
    if (bgKey === 'lamp') {
      // User Reference Image 2: Lamp pushed to far upper-left background, Headphones in upper-right midground, Phone/Accent in lower-left foreground
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 330 * sx),
        y: Math.round(cy - 335 * sy),
        scale: Number((s * 0.98).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      placed.push({
        type: 'headphones',
        state: 'main',
        x: Math.round(cx + 180 * sx),
        y: Math.round(cy + 5 * sy),
        scale: Number((s * 1.12).toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 165 * sx),
          y: Math.round(cy + 305 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      }
    } else if (bgKey === 'flowers') {
      if (accentKey) {
        // Multi-item composition (e.g. Travel & Impressions): Flowers top-left background, Headphones upper-right midground, Accent (Phone) lower-left foreground
        placed.push({
          type: 'flowers',
          state: 'bg',
          x: Math.round(cx - 260 * sx),
          y: Math.round(cy - 220 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
        placed.push({
          type: 'headphones',
          state: 'main',
          x: Math.round(cx + 180 * sx),
          y: Math.round(cy + 5 * sy),
          scale: Number((s * 1.12).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 165 * sx),
          y: Math.round(cy + 305 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      } else {
        // Studio Card 4 canonical 2-item layout: Flowers bleeding top-left + Headphones foreground focus
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
          scale: Number((s * 1.08).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    } else if (bgKey) {
      if (accentKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 260 * sx),
          y: Math.round(cy - 220 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
        placed.push({
          type: 'headphones',
          state: 'main',
          x: Math.round(cx + 180 * sx),
          y: Math.round(cy + 5 * sy),
          scale: Number((s * 1.12).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 165 * sx),
          y: Math.round(cy + 305 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      } else {
        placed.push({
          type: bgKey,
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
          scale: Number((s * 1.08).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    } else {
      // bgKey is null (e.g. 2-item pairing Headphones + Phone/Accent, or single Headphones)
      if (accentKey) {
        placed.push({
          type: 'headphones',
          state: 'main',
          x: Math.round(cx + 180 * sx),
          y: Math.round(cy + 5 * sy),
          scale: Number((s * 1.12).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx - 165 * sx),
          y: Math.round(cy + 305 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 3
        });
      } else {
        placed.push({
          type: 'headphones',
          state: 'main',
          x: Math.round(cx + 40 * sx),
          y: Math.round(cy + 140 * sy),
          scale: Number((s * 1.08).toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    }

  // ARCHETYPE 4: Phone
  } else if (heroKey === 'phone') {
    if (bgKey === 'headphones' || accentKey === 'headphones') {
      // Scenario 9 & Phone+Headphones pairing: Harmonious triangle
      // Headphones in upper-right midground, Phone in lower-left foreground, third item in upper-left background
      const thirdKey = bgKey !== 'headphones' ? bgKey : accentKey !== 'headphones' ? accentKey : null;
      if (thirdKey) {
        placed.push({
          type: thirdKey,
          state: 'bg',
          x: Math.round(cx - 240 * sx),
          y: Math.round(cy - 220 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
      placed.push({
        type: 'headphones',
        state: bgKey === 'headphones' ? 'bg' : 'main',
        x: Math.round(cx + 180 * sx),
        y: Math.round(cy + 5 * sy),
        scale: Number((s * 1.12).toFixed(4)),
        rot: 0,
        zIndex: 1
      });
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx - 165 * sx),
        y: Math.round(cy + 305 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    } else if (accentKey === 'puzzle' || !accentKey) {
      if (bgKey === 'lamp') {
        // User Reference IT-Startup Layout (media_1794340128223_b966c98c.jpg):
        // Lamp in far upper-left background, Puzzle in upper-right midground, Phone in lower-left foreground
        placed.push({
          type: 'lamp',
          state: 'bg',
          x: Math.round(cx - 330 * sx),
          y: Math.round(cy - 330 * sy),
          scale: Number((s * 0.98).toFixed(4)),
          rot: 0,
          zIndex: 0
        });
        placed.push({
          type: 'puzzle',
          state: 'main',
          x: Math.round(cx + 190 * sx),
          y: Math.round(cy - 65 * sy),
          scale: Number((s * 1.04).toFixed(4)),
          rot: 0,
          zIndex: 1
        });
        placed.push({
          type: 'phone',
          state: 'main',
          x: Math.round(cx - 165 * sx),
          y: Math.round(cy + 305 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      } else {
        // Studio Card 1: Phone lower-left + Puzzle upper-right
        placed.push({
          type: 'phone',
          state: 'main',
          x: Math.round(cx - 120 * sx),
          y: Math.round(cy + 120 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 2
        });
        if (accentKey === 'puzzle') {
          placed.push({
            type: 'puzzle',
            state: 'main',
            x: Math.round(cx + 180 * sx),
            y: Math.round(cy - 140 * sy),
            scale: Number(s.toFixed(4)),
            rot: 0,
            zIndex: 1
          });
        }
        if (bgKey && bgKey !== 'puzzle') {
          placed.push({
            type: bgKey,
            state: 'bg',
            x: Math.round(cx - 230 * sx),
            y: Math.round(cy - 210 * sy),
            scale: Number(s.toFixed(4)),
            rot: 0,
            zIndex: 0
          });
        }
      }
    } else {
      placed.push({
        type: 'phone',
        state: 'main',
        x: Math.round(cx - 120 * sx),
        y: Math.round(cy + 120 * sy),
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
          x: Math.round(cx - 220 * sx),
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
      x: Math.round(cx + 240 * sx),
      y: Math.round(cy - 140 * sy),
      scale: Number((s * 1.02).toFixed(4)),
      rot: 0,
      zIndex: 1
    });

    const companions = [bgKey, accentKey].filter(Boolean) as string[];
    const hasPen = companions.includes('pen');
    const hasCoin = companions.includes('coin');
    const hasLamp = companions.includes('lamp');
    const hasNotebook = companions.includes('notebook');
    const hasPuzzle = companions.includes('puzzle');

    if (hasPen && hasCoin) {
      // Scenario 18: Management & Planning (Folder + Pen + Coin)
      placed.push({
        type: 'pen',
        state: 'main',
        x: Math.round(cx - 140 * sx),
        y: Math.round(cy + 220 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
      placed.push({
        type: 'coin',
        state: 'main',
        x: Math.round(cx + 160 * sx),
        y: Math.round(cy + 220 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 3
      });
    } else if (hasLamp) {
      // Scenario 5: Workspace & Order (Folder + Lamp + Pen)
      placed.push({
        type: 'lamp',
        state: 'bg',
        x: Math.round(cx - 240 * sx),
        y: Math.round(cy - 230 * sy),
        scale: Number((s * 1.03).toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      const third = companions.find(k => k !== 'lamp') || 'pen';
      placed.push({
        type: third,
        state: 'main',
        x: Math.round(cx),
        y: Math.round(cy + 280 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    } else if (hasNotebook) {
      // Scenario 8: Law & Contracts (Folder + Notebook + Pen)
      placed.push({
        type: 'notebook',
        state: 'bg',
        x: Math.round(cx - 220 * sx),
        y: Math.round(cy - 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      const third = companions.find(k => k !== 'notebook') || 'pen';
      placed.push({
        type: third,
        state: 'main',
        x: Math.round(cx),
        y: Math.round(cy + 280 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    } else if (hasPuzzle) {
      // Scenario 14: Logistics & Supply (Folder + Puzzle + Coin)
      placed.push({
        type: 'puzzle',
        state: 'bg',
        x: Math.round(cx - 220 * sx),
        y: Math.round(cy - 180 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 0
      });
      const third = companions.find(k => k !== 'puzzle') || 'coin';
      placed.push({
        type: third,
        state: 'main',
        x: Math.round(cx + 120 * sx),
        y: Math.round(cy + 240 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    } else {
      // General fallback
      if (bgKey) {
        placed.push({
          type: bgKey,
          state: 'bg',
          x: Math.round(cx - 220 * sx),
          y: Math.round(cy - 180 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 0
        });
      }
      if (accentKey) {
        placed.push({
          type: accentKey,
          state: 'main',
          x: Math.round(cx),
          y: Math.round(cy + 280 * sy),
          scale: Number(s.toFixed(4)),
          rot: 0,
          zIndex: 2
        });
      }
    }

  // ARCHETYPE 6: Lamp (as Hero)
  } else if (heroKey === 'lamp') {
    placed.push({
      type: 'lamp',
      state: 'main',
      x: Math.round(cx - 140 * sx),
      y: Math.round(cy - 80 * sy),
      scale: Number(s.toFixed(4)),
      rot: 0,
      zIndex: 1
    });
    if (accentKey) {
      placed.push({
        type: accentKey,
        state: 'main',
        x: Math.round(cx + 200 * sx),
        y: Math.round(cy + 280 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 2
      });
    }
    if (bgKey && bgKey !== accentKey) {
      placed.push({
        type: bgKey,
        state: 'bg',
        x: Math.round(cx + 220 * sx),
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
      x: Math.round(cx + 40 * sx),
      y: Math.round(cy + 160 * sy),
      scale: Number(s.toFixed(4)),
      rot: 0,
      zIndex: 2
    });
    if (bgKey) {
      placed.push({
        type: bgKey,
        state: 'bg',
        x: Math.round(cx - 220 * sx),
        y: Math.round(cy - 200 * sy),
        scale: Number(s.toFixed(4)),
        rot: 0,
        zIndex: 1
      });
    }
    if (accentKey) {
      placed.push({
        type: accentKey,
        state: 'main',
        x: Math.round(cx + 220 * sx),
        y: Math.round(cy - 40 * sy),
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
 * Generative Intelligence Semantic Scoring Engine.
 * Evaluates user prompt against 20 rich knowledge-base scenarios, extracts semantic markers,
 * matches highest-affinity concepts, and composes an authentic Studio Ochen scene.
 */
export function generateCompositionFromPrompt(
  prompt: string,
  format: CanvasFormat,
  detailSize: DetailSize = 'L'
): AICompositionResult {
  const pRaw = prompt.trim();
  const pLower = pRaw.toLowerCase();
  const tokens = tokenize(pLower);
  const stems = tokens.map(stemWord);

  // 1. Detect explicit mentions of library objects using Russian & English root map
  const OBJECT_ROOT_MAP: Record<string, string[]> = {
    phone: ['телефон', 'смартфон', 'айфон', 'phone', 'mobile'],
    notebook: ['блокнот', 'тетрад', 'книг', 'notebook', 'book'],
    headphones: ['наушник', 'гарнитур', 'headphones'],
    folder: ['папк', 'досье', 'folder'],
    wallet: ['кошел', 'портмоне', 'wallet'],
    coin: ['монет', 'копейк', 'криптомонет', 'coin'],
    puzzle: ['пазл', 'головоломк', 'puzzle'],
    lamp: ['ламп', 'светильник', 'lamp'],
    flowers: ['цветы', 'цветок', 'цветочки', 'цветочек', 'ваза', 'тюльпан', 'букет', 'flowers', 'flower', 'vase'],
    pen: ['ручк', 'стилус', 'перо', 'карандаш', 'pen']
  };

  const explicitObjects: string[] = [];
  for (const [key, roots] of Object.entries(OBJECT_ROOT_MAP)) {
    let matched = false;
    for (const r of roots) {
      if (tokens.some(t => t === r || t.startsWith(r))) {
        // Special guard: do not confuse flower words with color adjectives (цветовой, цветокоррекция)
        if (key === 'flowers') {
          const hasFlowerToken = tokens.some(t =>
            ['цветы', 'цветок', 'цветочки', 'цветочек', 'ваза', 'вазу', 'вазе', 'вазы', 'тюльпан', 'тюльпаны', 'букет', 'букеты', 'flowers', 'flower', 'vase'].includes(t)
          );
          if (!hasFlowerToken) continue;
        }
        matched = true;
        break;
      }
    }
    if (matched) {
      explicitObjects.push(key);
    }
  }

  // 2. Score across all 20 scenarios
  interface ScenarioScore {
    scenario: AIScenario;
    score: number;
    matchedKeywords: string[];
  }

  const scoredScenarios: ScenarioScore[] = AI_SCENARIOS.map(sc => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Title match (high weight)
    const titleTokens = tokenize(sc.title);
    for (const tt of titleTokens) {
      if (tokens.includes(tt)) {
        score += 28;
        matchedKeywords.push(tt);
      }
    }

    // Direct discriminator match (extra decisive weight, token/stem-boundary safe)
    if (sc.discriminators) {
      for (const disc of sc.discriminators) {
        const discLower = disc.toLowerCase();
        const matchesToken = tokens.some(t => t === discLower || t.startsWith(discLower) || stemWord(t) === discLower);
        if (matchesToken) {
          score += 24;
          if (!matchedKeywords.includes(discLower)) matchedKeywords.push(discLower);
        }
      }
    }

    // Keyword & stem matches
    for (const kw of sc.intentKeywords) {
      const kwLower = kw.toLowerCase();
      const kwStem = stemWord(kwLower);

      let matched = false;
      if (kwLower.includes(' ')) {
        // Multi-word phrase matching
        matched = pLower.includes(kwLower);
      } else {
        // Word-boundary token or stem match
        matched = tokens.some(t => t === kwLower || t.startsWith(kwLower) || stemWord(t) === kwStem);
      }

      if (matched) {
        score += 14;
        if (!matchedKeywords.includes(kwLower)) matchedKeywords.push(kwLower);
      }
    }

    // Intent tag overlap
    for (const tag of sc.intentTags) {
      const tagTokens = tokenize(tag);
      for (const tt of tagTokens) {
        if (tokens.includes(tt) || stems.includes(stemWord(tt))) {
          score += 6;
          if (!matchedKeywords.includes(tt)) matchedKeywords.push(tt);
        }
      }
    }

    // Object synergy: if prompt explicitly asked for hero/bg/accent
    if (explicitObjects.includes(sc.hero)) score += 18;
    if (sc.bg && explicitObjects.includes(sc.bg)) score += 12;
    if (sc.accent && explicitObjects.includes(sc.accent)) score += 10;

    return { scenario: sc, score, matchedKeywords };
  });

  // Sort descending by score
  scoredScenarios.sort((a, b) => b.score - a.score);
  const best = scoredScenarios[0];

  let selectedScenario: AIScenario;
  let isFallback = false;

  if (best && best.score > 0) {
    selectedScenario = best.scenario;
  } else {
    // Abstract, gibberish or empty prompt: select scenario deterministically
    isFallback = true;
    const hash = hashString(pLower || 'ochen-studio-default');
    selectedScenario = AI_SCENARIOS[hash % AI_SCENARIOS.length];
  }

  // 3. Determine scene objects (with dynamic adaptation if user explicitly asked for specific objects)
  let heroKey = selectedScenario.hero;
  let bgKey = selectedScenario.bg;
  let accentKey = selectedScenario.accent;

  if (explicitObjects.length > 0) {
    // If all explicit objects are already part of selectedScenario, preserve the carefully designed scenario roles!
    const scenarioObjects = [selectedScenario.hero, selectedScenario.bg, selectedScenario.accent].filter(Boolean);
    const hasExternalObjects = explicitObjects.some(obj => !scenarioObjects.includes(obj));

    if (hasExternalObjects) {
      if (explicitObjects.length === 1) {
        const explicit = explicitObjects[0];
        if (explicit !== heroKey && explicit !== bgKey && explicit !== accentKey) {
          if (['lamp', 'flowers', 'folder'].includes(explicit) && !bgKey) {
            bgKey = explicit;
          } else if (['coin', 'pen', 'puzzle'].includes(explicit) && !accentKey) {
            accentKey = explicit;
          } else {
            heroKey = explicit;
          }
        }
      } else if (explicitObjects.length >= 2) {
        const bgTypes = ['lamp', 'flowers', 'folder'];
        const accentTypes = ['coin', 'pen', 'puzzle'];

        // Prefer scenario hero if present among explicit objects
        const explicitHero = explicitObjects.find(k => k === selectedScenario.hero) ||
          explicitObjects.find(k => !bgTypes.includes(k) && !accentTypes.includes(k)) ||
          explicitObjects[0];

        const remaining = explicitObjects.filter(k => k !== explicitHero);
        const explicitBg = remaining.find(k => bgTypes.includes(k)) || null;
        const explicitAccent = remaining.find(k => accentTypes.includes(k) && k !== explicitBg) || remaining.find(k => k !== explicitBg) || null;

        heroKey = explicitHero;
        bgKey = explicitBg || selectedScenario.bg;
        accentKey = explicitAccent || selectedScenario.accent;
      }
    }
  }

  // Determine palette
  let recPalette: PaletteId = selectedScenario.palette;
  // Dynamic palette override if user explicitly specified color words
  if (pLower.includes('персик') || pLower.includes('тепл') || pLower.includes('peach')) {
    recPalette = 'peach';
  } else if (pLower.includes('мят') || pLower.includes('свеж') || pLower.includes('mint')) {
    recPalette = 'mint';
  } else if (pLower.includes('фиолет') || pLower.includes('пурпур') || pLower.includes('purple')) {
    recPalette = 'purple';
  }

  // Build authentic isometric scene
  const finalItems = buildIsometricScene(heroKey, bgKey, accentKey, format, detailSize);

  // 4. Generate professional, multi-line AI Reasoning / Rationale
  const heroLabel = OBJECT_CATALOG[heroKey]?.labelRu || heroKey;
  const paletteName = recPalette === 'purple' ? 'Purple Mist (Фиолетовая)' : recPalette === 'peach' ? 'Warm Peach (Персиковая)' : 'Fresh Mint (Мятная)';

  // Build accurate spatial description from actual finalItems
  const bgItems = finalItems.filter(i => i.state === 'bg');
  const mainAccents = finalItems.filter(i => i.state === 'main' && i.objectType !== heroKey);

  const spatialClauses: string[] = [`✨ Пространство кадра: Главный фокус — ${heroLabel}.`];
  if (bgItems.length > 0) {
    const bgLabels = bgItems.map(i => OBJECT_CATALOG[i.objectType]?.labelRu || i.objectType).join(' и ');
    spatialClauses.push(`В монохромной глубине второго плана расположен ${bgLabels} с естественным изометрическим вылетом за обрез холста (Studio Ochen 30° bleed).`);
  }
  if (mainAccents.length > 0) {
    const accentLabels = mainAccents.map(i => OBJECT_CATALOG[i.objectType]?.labelRu || i.objectType).join(', ');
    spatialClauses.push(`Акцентные предметы на переднем плане вдоль 30° изометрической оси: ${accentLabels}.`);
  }
  const spatialText = spatialClauses.join(' ');

  const matchedMarkers = best && best.matchedKeywords.length > 0
    ? best.matchedKeywords.slice(0, 5).join(', ')
    : 'эвристический контекст';

  let rationaleText = '';
  if (!isFallback) {
    rationaleText = `🤖 ИИ-Анализ сценария: «${selectedScenario.title}»\n` +
      `🎯 Контекст и смысловые маркеры: [${matchedMarkers}]. Тема интерпретирована как: ${selectedScenario.editorialConcept}.\n` +
      `📐 Визуальная метафора: ${selectedScenario.visualMetaphor}.\n` +
      `🎨 Колористика: Палитра ${paletteName}. ${selectedScenario.paletteRationale}.\n` +
      spatialText;
  } else {
    rationaleText = `🤖 ИИ-Анализ сценария: «${selectedScenario.title}» (Сбалансированная генерация)\n` +
      `🎯 Входной запрос не содержит явных маркеров, сгенерирован эталонный журнальный архетип: ${selectedScenario.editorialConcept}.\n` +
      `📐 Визуальная метафора: ${selectedScenario.visualMetaphor}.\n` +
      `🎨 Колористика: Рекомендована палитра ${paletteName}. ${selectedScenario.paletteRationale}.\n` +
      spatialText;
  }

  // Ensure matchedTheme reflects all unique objects in finalItems
  const itemLabels = finalItems.map(it => OBJECT_CATALOG[it.objectType]?.labelRu || it.objectType);
  const matchedTheme = Array.from(new Set(itemLabels)).join(' + ');

  return {
    title: pRaw || selectedScenario.title,
    matchedTheme,
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
    const companions = NATURAL_COMPANIONS[hero] || { bg: 'folder', accent: 'pen' };
    return buildIsometricScene(hero, companions.bg, companions.accent, format, detailSize);
  }

  // If 2 items selected: 1 Background + 1 Hero OR 1 Hero + 1 Accent
  if (validKeys.length === 2) {
    const bgTypes = ['lamp', 'flowers', 'folder'];
    const accentTypes = ['coin', 'pen', 'puzzle', 'phone'];
    
    if (bgTypes.includes(validKeys[0]) && !bgTypes.includes(validKeys[1])) {
      return buildIsometricScene(validKeys[1], validKeys[0], null, format, detailSize);
    }
    if (bgTypes.includes(validKeys[1]) && !bgTypes.includes(validKeys[0])) {
      return buildIsometricScene(validKeys[0], validKeys[1], null, format, detailSize);
    }
    if (accentTypes.includes(validKeys[1])) {
      return buildIsometricScene(validKeys[0], null, validKeys[1], format, detailSize);
    }
    if (accentTypes.includes(validKeys[0])) {
      return buildIsometricScene(validKeys[1], null, validKeys[0], format, detailSize);
    }
    return buildIsometricScene(validKeys[0], validKeys[1], null, format, detailSize);
  }

  // If 3+ items: Keep exactly 3 items (Hero, Background, Accent)
  const bgTypes = ['lamp', 'flowers', 'folder'];
  const bgCandidate = validKeys.find(k => bgTypes.includes(k)) || validKeys[1];
  const accentCandidate = validKeys.find(k => ['coin', 'pen', 'puzzle', 'phone'].includes(k) && k !== bgCandidate) || validKeys[2];
  const heroCandidate = validKeys.find(k => k !== bgCandidate && k !== accentCandidate) || validKeys[0];

  return buildIsometricScene(heroCandidate, bgCandidate, accentCandidate, format, detailSize);
}
