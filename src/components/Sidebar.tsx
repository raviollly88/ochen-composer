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
  Info
} from 'lucide-react';

interface SidebarProps {
  selectedItem: CanvasItem | null;
  detailSize: DetailSize;
  assetMap: Record<string, AssetMeta>;
  onAddItem: (objectType: string, state: ObjectState) => void;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onGenerateAI: (prompt: string) => void;
  onAutoLayoutComponents: (keys: string[]) => void;
  lastAiRationale: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedItem,
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
  const [activeTab, setActiveTab] = useState<'ai' | 'library' | 'inspector'>(
    selectedItem ? 'inspector' : 'ai'
  );
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryState, setLibraryState] = useState<ObjectState>('main');
  const [selectedLibraryKeys, setSelectedLibraryKeys] = useState<string[]>([]);

  // If item is selected, switch to inspector tab automatically
  React.useEffect(() => {
    if (selectedItem) {
      setActiveTab('inspector');
    }
  }, [selectedItem?.id]);

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
    onAutoLayoutComponents(selectedLibraryKeys);
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
    <aside className="w-96 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] z-20 select-none">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 p-2 gap-1 bg-slate-950/40">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ai'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={14} className="text-purple-400" />
          <span>ИИ-Сборка</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'library'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={14} />
          <span>Компоненты</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          disabled={!selectedItem}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'inspector'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none'
          }`}
        >
          <Sliders size={14} />
          <span>Свойства</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: AI GENERATION (SCENARIO 1) */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Сценарий 1: Сборка по метафоре</h3>
              <p className="text-xs text-slate-400">
                Задайте заголовок статьи или смысл иллюстрации — алгоритм выберет подходящие объекты и выстроит изометрическую сцену.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  placeholder="Например: Учеба и продуктивность..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 pr-10"
                />
                <button
                  type="submit"
                  disabled={!promptInput.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-40"
                >
                  <Sparkles size={14} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!promptInput.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Сгенерировать композицию</span>
              </button>
            </form>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Готовые сценарии для демонстрации:</span>
              <div className="space-y-1.5">
                {PRESET_THEMES.map(preset => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      setPromptInput(preset.title);
                      onGenerateAI(preset.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="text-xs font-medium text-slate-200 group-hover:text-purple-300">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Decision Rationale */}
            {lastAiRationale && (
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-medium">
                  <Info size={14} />
                  <span>Логика ИИ-компоновщика:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{lastAiRationale}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIBRARY & MANUAL COMPOSITION (SCENARIO 2) */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Сценарий 2: Выбор компонентов</h3>
              <p className="text-xs text-slate-400">
                Кликните для добавления на холст или выберите несколько предметов для автоматической группировки.
              </p>
            </div>

            {/* Search and State Toggle */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию или тегу..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setLibraryState('main')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    libraryState === 'main' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Главные (Цвет)
                </button>
                <button
                  onClick={() => setLibraryState('bg')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    libraryState === 'bg' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Фоновые (Монохром)
                </button>
              </div>
            </div>

            {/* Auto-layout selected button */}
            {selectedLibraryKeys.length > 0 && (
              <button
                onClick={handleAutoLayoutSelected}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Sparkles size={14} />
                <span>Скомпоновать выбранные ({selectedLibraryKeys.length})</span>
              </button>
            )}

            {/* Component Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filteredCatalog.map(([key, meta]) => {
                const assetId = `${key}-${detailSize}-${libraryState}`;
                const asset = assetMap[assetId];
                const isChecked = selectedLibraryKeys.includes(key);

                return (
                  <div
                    key={key}
                    className={`relative p-2.5 rounded-xl border transition-all flex flex-col items-center text-center group cursor-pointer ${
                      isChecked
                        ? 'bg-purple-950/30 border-purple-500/60'
                        : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => onAddItem(key, libraryState)}
                  >
                    {/* Checkbox for batch multi-select */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleSelectComponent(key);
                      }}
                      className="absolute top-2 left-2 p-1 text-slate-500 hover:text-white"
                    >
                      {isChecked ? (
                        <CheckCircle2 size={16} className="text-purple-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
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
                        <div className="w-8 h-8 rounded bg-slate-800 animate-pulse" />
                      )}
                    </div>

                    <span className="text-xs font-medium text-slate-200 mt-1">{meta.labelRu}</span>
                    <span className="text-[10px] text-slate-500">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: OBJECT INSPECTOR */}
        {activeTab === 'inspector' && selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Параметры объекта</h3>
                <p className="text-xs text-slate-400">
                  {OBJECT_CATALOG[selectedItem.objectType]?.labelRu || selectedItem.objectType}
                </p>
              </div>
              <button
                onClick={() => onDeleteItem(selectedItem.id)}
                className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* State Toggle: Main vs Bg */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Состояние элемента:</label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => onUpdateItem(selectedItem.id, { state: 'main' })}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    selectedItem.state === 'main' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Главный (Цвет)
                </button>
                <button
                  onClick={() => onUpdateItem(selectedItem.id, { state: 'bg' })}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    selectedItem.state === 'bg' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Фоновый (Монохром)
                </button>
              </div>
            </div>

            {/* Scale Slider (Strict Aspect Ratio Preservation) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Масштаб:</span>
                <span className="text-slate-200 font-mono">
                  {Math.round(selectedItem.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.01"
                value={selectedItem.scale}
                onChange={e =>
                  onUpdateItem(selectedItem.id, { scale: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-500"
              />
            </div>

            {/* Rotation Controls */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Поворот:</span>
                <span className="text-slate-200 font-mono">{selectedItem.rotation}°</span>
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
                className="w-full accent-purple-500"
              />
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => onUpdateItem(selectedItem.id, { rotation: 0 })}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  0° Сброс
                </button>
                <button
                  onClick={() =>
                    onUpdateItem(selectedItem.id, {
                      rotation: (selectedItem.rotation - 15) % 360,
                    })
                  }
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  -15°
                </button>
                <button
                  onClick={() =>
                    onUpdateItem(selectedItem.id, {
                      rotation: (selectedItem.rotation + 15) % 360,
                    })
                  }
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  +15°
                </button>
              </div>
            </div>

            {/* Layer Ordering (Z-Index) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Порядок слоёв:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onBringToFront(selectedItem.id)}
                  className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700/60"
                >
                  <ArrowUp size={14} />
                  <span>На передний план</span>
                </button>
                <button
                  onClick={() => onSendToBack(selectedItem.id)}
                  className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700/60"
                >
                  <ArrowDown size={14} />
                  <span>На задний план</span>
                </button>
              </div>
            </div>

            {/* Duplicate button */}
            <button
              onClick={() => onDuplicateItem(selectedItem.id)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 border border-slate-700/60"
            >
              <Copy size={14} />
              <span>Дублировать объект</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
