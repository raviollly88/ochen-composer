import React, { useState } from 'react';
import type { AssetMeta, CanvasItem, DetailSize, ObjectState } from '../types';
import { OBJECT_CATALOG } from '../types';
import { PRESET_THEMES } from '../aiComposer';
import {
  Sparkles,
  Layers,
  Sliders,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Search,
  CheckCircle2,
  Info,
  X,
  MousePointerClick
} from 'lucide-react';

interface SidebarProps {
  items: CanvasItem[];
  selectedItem: CanvasItem | null;
  onSelectItem: (id: string | null) => void;
  detailSize: DetailSize;
  assetMap: Record<string, AssetMeta>;
  onAddItem: (objectType: string, state: ObjectState, size?: DetailSize) => void;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onGenerateAI: (prompt: string) => void;
  onAutoLayoutComponents: (keys: string[], size?: DetailSize) => void;
  lastAiRationale: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedItem,
  onSelectItem,
  detailSize,
  assetMap,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onBringToFront,
  onSendToBack,
  onGenerateAI,
  onAutoLayoutComponents,
  lastAiRationale,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'library' | 'inspector'>('ai');
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryState, setLibraryState] = useState<ObjectState>('main');
  const [libraryDetailSize, setLibraryDetailSize] = useState<DetailSize>(detailSize || 'L');
  const [selectedLibraryKeys, setSelectedLibraryKeys] = useState<string[]>([]);

  // When an item is selected, smoothly open inspector tab
  const [prevSelectedId, setPrevSelectedId] = useState(selectedItem?.id);
  if (selectedItem?.id !== prevSelectedId) {
    setPrevSelectedId(selectedItem?.id);
    if (selectedItem?.id) {
      setActiveTab('inspector');
    }
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onGenerateAI(promptInput);
  };

  const toggleSelectComponent = (key: string) => {
    if (selectedLibraryKeys.includes(key)) {
      setSelectedLibraryKeys(selectedLibraryKeys.filter(k => k !== key));
    } else {
      setSelectedLibraryKeys([...selectedLibraryKeys, key]);
    }
  };

  const handleAutoLayoutSelected = () => {
    if (selectedLibraryKeys.length === 0) return;
    onAutoLayoutComponents(selectedLibraryKeys, libraryDetailSize);
    setSelectedLibraryKeys([]);
  };

  const filteredCatalog = Object.entries(OBJECT_CATALOG).filter(([key, meta]) => {
    const q = searchQuery.toLowerCase();
    return (
      meta.labelRu.toLowerCase().includes(q) ||
      key.toLowerCase().includes(q) ||
      meta.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <aside className="w-96 border-r border-zinc-800 bg-zinc-900/90 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] z-20 select-none">
      {/* Neutral Tab Navigation */}
      <div className="flex border-b border-zinc-800 p-2 gap-1 bg-zinc-950/60">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'ai'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={13} className="text-zinc-300" />
          <span>ИИ-Сборка</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'library'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers size={13} />
          <span>Компоненты</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'inspector'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders size={13} />
          <span>Свойства {selectedItem && '•'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: AI GENERATION (SCENARIO 1) */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Сценарий 1: Сборка по метафоре</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Введите заголовок статьи или смысл иллюстрации. Алгоритм выстроит чистую изометрическую композицию по дизайн-гайду студии.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  placeholder="Например: Личные финансы и бюджет..."
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 pr-10"
                />
                <button
                  type="submit"
                  disabled={!promptInput.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-all disabled:opacity-40"
                >
                  <Sparkles size={14} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!promptInput.trim()}
                className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Sparkles size={14} />
                <span>Собрать композицию</span>
              </button>
            </form>

            {/* Studio Reference Presets */}
            <div className="pt-2">
              <span className="text-xs font-medium text-zinc-400 block mb-2">Эталонные сценарии студии:</span>
              <div className="space-y-1.5">
                {PRESET_THEMES.map(preset => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      setPromptInput(preset.title);
                      onGenerateAI(preset.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 transition-all group"
                  >
                    <div className="text-xs font-medium text-zinc-200 group-hover:text-white">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 group-hover:text-zinc-400 mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Decision Rationale */}
            {lastAiRationale && (
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
                  <Info size={13} className="text-zinc-400" />
                  <span>Логика компоновки:</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-line">{lastAiRationale}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIBRARY & MANUAL COMPOSITION (SCENARIO 2) */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Сценарий 2: Библиотека компонентов</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Кликните для добавления на холст или отметьте несколько предметов для автоматической группировки.
              </p>
            </div>

            {/* Search and State Toggle */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию или тегу..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* State and Detail Size controls */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                  <button
                    onClick={() => setLibraryState('main')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                      libraryState === 'main' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Цвет
                  </button>
                  <button
                    onClick={() => setLibraryState('bg')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                      libraryState === 'bg' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Монохром
                  </button>
                </div>

                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLibraryDetailSize('L')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                      libraryDetailSize === 'L' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Высокая детализация (Размер L)"
                  >
                    Размер L
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryDetailSize('S')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                      libraryDetailSize === 'S' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Упрощенный компактный вид (Размер S)"
                  >
                    Размер S
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-layout selected button */}
            {selectedLibraryKeys.length > 0 && (
              <button
                onClick={handleAutoLayoutSelected}
                className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Sparkles size={14} />
                <span>Скомпоновать выбранные ({selectedLibraryKeys.length})</span>
              </button>
            )}

            {/* Component Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filteredCatalog.map(([key, meta]) => {
                const assetId = `${key}-${libraryDetailSize}-${libraryState}`;
                const asset = assetMap[assetId];
                const isChecked = selectedLibraryKeys.includes(key);

                return (
                  <div
                    key={key}
                    className={`relative p-2.5 rounded-xl border transition-all flex flex-col items-center text-center group cursor-pointer ${
                      isChecked
                        ? 'bg-zinc-800/80 border-zinc-500 ring-1 ring-zinc-400/40'
                        : 'bg-zinc-950/60 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                    onClick={() => onAddItem(key, libraryState, libraryDetailSize)}
                  >
                    {/* Checkbox for batch multi-select */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleSelectComponent(key);
                      }}
                      className="absolute top-2 left-2 p-1 text-zinc-500 hover:text-zinc-200"
                    >
                      {isChecked ? (
                        <CheckCircle2 size={16} className="text-zinc-200" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                      )}
                    </button>

                    {/* SVG Thumbnail Preview */}
                    <div className="w-16 h-16 flex items-center justify-center my-2 pointer-events-none">
                      {asset ? (
                        <svg
                          viewBox={`0 0 ${asset.w} ${asset.h}`}
                          className="max-w-full max-h-full"
                        >
                          {asset.paths.map((p, idx) => (
                            <path
                              key={idx}
                              d={p.d}
                              fill={p.fill}
                              fillRule={p.eo ? 'evenodd' : undefined}
                            />
                          ))}
                        </svg>
                      ) : (
                        <div className="w-8 h-8 rounded bg-zinc-800 animate-pulse" />
                      )}
                    </div>

                    <span className="text-xs font-medium text-zinc-200 mt-1">{meta.labelRu}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: OBJECT INSPECTOR & LAYERS */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">
                      {OBJECT_CATALOG[selectedItem.objectType]?.labelRu || selectedItem.objectType}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {selectedItem.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectItem(null)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                      title="Снять выбор"
                    >
                      <X size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteItem(selectedItem.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Удалить с холста"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Detail Level Toggle: L (Детализированный) vs S (Компактный / Упрощенный) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span className="font-medium">Детализация предмета:</span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {(selectedItem.size || 'L') === 'S' ? 'S (Упрощенный)' : 'L (Детализированный)'}
                    </span>
                  </div>
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateItem(selectedItem.id, { size: 'L' })}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        (selectedItem.size || 'L') !== 'S'
                          ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Высокая детализация (Размер L)"
                    >
                      L (Детализированный)
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateItem(selectedItem.id, { size: 'S' })}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        selectedItem.size === 'S'
                          ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Упрощенный компактный вид (Размер S)"
                    >
                      S (Упрощенный)
                    </button>
                  </div>
                </div>

                {/* State Toggle: Main vs Bg */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span className="font-medium">Состояние элемента:</span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {selectedItem.state === 'main' ? 'Главный (Цвет)' : 'Фоновый (Монохром)'}
                    </span>
                  </div>
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                    <button
                      onClick={() => onUpdateItem(selectedItem.id, { state: 'main' })}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        selectedItem.state === 'main' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Главный (Цвет)
                    </button>
                    <button
                      onClick={() => onUpdateItem(selectedItem.id, { state: 'bg' })}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                        selectedItem.state === 'bg' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Фоновый (Монохром)
                    </button>
                  </div>
                </div>

                {/* Scale Slider (Strict Aspect Ratio Preservation) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Масштаб (пропорции фиксированы):</span>
                    <span className="text-zinc-200 font-mono">
                      {Math.round(selectedItem.scale * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.01"
                    value={selectedItem.scale}
                    onChange={e =>
                      onUpdateItem(selectedItem.id, { scale: parseFloat(e.target.value) })
                    }
                    className="w-full accent-zinc-200 cursor-pointer"
                  />
                </div>

                {/* Rotation Controls */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Поворот:</span>
                    <span className="text-zinc-200 font-mono">{selectedItem.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={selectedItem.rotation}
                    onChange={e =>
                      onUpdateItem(selectedItem.id, { rotation: parseInt(e.target.value) })
                    }
                    className="w-full accent-zinc-200 cursor-pointer"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onUpdateItem(selectedItem.id, { rotation: 0 })}
                      className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg"
                    >
                      0° Сброс
                    </button>
                    <button
                      onClick={() =>
                        onUpdateItem(selectedItem.id, {
                          rotation: (selectedItem.rotation - 15) % 360,
                        })
                      }
                      className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg"
                    >
                      -15°
                    </button>
                    <button
                      onClick={() =>
                        onUpdateItem(selectedItem.id, {
                          rotation: (selectedItem.rotation + 15) % 360,
                        })
                      }
                      className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg"
                    >
                      +15°
                    </button>
                  </div>
                </div>

                {/* Layer Ordering (Z-Index) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Порядок слоёв:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onBringToFront(selectedItem.id)}
                      className="flex items-center justify-center gap-1.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl border border-zinc-700/60"
                    >
                      <ArrowUp size={14} />
                      <span>На передний план</span>
                    </button>
                    <button
                      onClick={() => onSendToBack(selectedItem.id)}
                      className="flex items-center justify-center gap-1.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl border border-zinc-700/60"
                    >
                      <ArrowDown size={14} />
                      <span>На задний план</span>
                    </button>
                  </div>
                </div>

                {/* Duplicate button */}
                <button
                  onClick={() => onDuplicateItem(selectedItem.id)}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 border border-zinc-700/60 transition-all"
                >
                  <Copy size={14} />
                  <span>Дублировать элемент</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <MousePointerClick size={16} />
                </div>
                <div className="text-xs font-medium text-zinc-200">Объект не выбран</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Кликните по любому объекту на холсте или выберите его в списке слоёв ниже.
                </p>
              </div>
            )}

            {/* Canvas Layers List */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Слои на холсте ({items.length}):</span>
              </div>

              {items.length === 0 ? (
                <p className="text-[11px] text-zinc-600">Холст пуст</p>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {[...items].reverse().map(item => {
                    const isSelected = selectedItem?.id === item.id;
                    const meta = OBJECT_CATALOG[item.objectType];
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                            : 'bg-zinc-950/50 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.state === 'main' ? 'bg-amber-400' : 'bg-zinc-500'}`} />
                          <span>{meta?.labelRu || item.objectType}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ({item.size || 'L'}, {item.state === 'main' ? 'цвет' : 'монохром'})
                          </span>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 rounded"
                          title="Удалить"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
