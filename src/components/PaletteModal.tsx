import React, { useState, useRef } from 'react';
import type { Palette } from '../palettes';
import { DEFAULT_PALETTES } from '../palettes';
import { X, Upload, Download, Plus, Check } from 'lucide-react';

interface PaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  palettes: Record<string, Palette>;
  activePaletteId: string;
  onSelectPalette: (id: string) => void;
  onAddPalette: (newPalette: Palette) => void;
}

export const PaletteModal: React.FC<PaletteModalProps> = ({
  isOpen,
  onClose,
  palettes,
  activePaletteId,
  onSelectPalette,
  onAddPalette,
}) => {
  const [customName, setCustomName] = useState('Новая палитра');
  const [bgPrimary, setBgPrimary] = useState('#d7cdf5');
  const [bgDark, setBgDark] = useState('#7864d7');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `custom-${Date.now()}`;
    const newPal: Palette = {
      id,
      name: customName,
      nameRu: customName,
      bgPrimary,
      bgLight: bgPrimary,
      bgDark,
      accentColors: [bgPrimary, bgDark],
      outlineColor: '#181817',
    };
    onAddPalette(newPal);
    onSelectPalette(id);
    setErrorMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.bgPrimary || !parsed.bgDark) {
          setErrorMsg('Файл должен содержать поля "bgPrimary" и "bgDark" в формате HEX (например, #d7cdf5).');
          return;
        }

        const id = `imported-${Date.now()}`;
        const newPal: Palette = {
          id,
          name: parsed.name || parsed.nameRu || 'Импортированная',
          nameRu: parsed.nameRu || parsed.name || 'Импортированная',
          bgPrimary: parsed.bgPrimary,
          bgLight: parsed.bgLight || parsed.bgPrimary,
          bgDark: parsed.bgDark,
          accentColors: parsed.accentColors || [parsed.bgPrimary, parsed.bgDark],
          outlineColor: parsed.outlineColor || '#181817',
        };

        onAddPalette(newPal);
        onSelectPalette(id);
        setErrorMsg(null);
      } catch {
        setErrorMsg('Ошибка чтения JSON файла. Проверьте валидность синтаксиса.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCurrent = () => {
    const current = palettes[activePaletteId] || DEFAULT_PALETTES.purple;
    const jsonStr = JSON.stringify(current, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${current.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">Управление палитрами</h2>
            <p className="text-xs text-zinc-400">
              Выбирайте палитры студии, загружайте свои из JSON или настраивайте HEX
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Existing Palettes */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-semibold text-zinc-300">Доступные палитры:</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(palettes).map((p) => {
              const isActive = activePaletteId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPalette(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                    isActive
                      ? 'bg-zinc-800 border-zinc-500 shadow-sm ring-1 ring-zinc-400'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                        style={{ backgroundColor: p.bgPrimary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                        style={{ backgroundColor: p.bgDark }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-100">{p.nameRu}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{p.bgPrimary}</div>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="text-zinc-200" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Palette Form */}
        <form onSubmit={handleCreateCustom} className="mt-5 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
          <span className="text-xs font-semibold text-zinc-300 block">
            Создать новую палитру:
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Название:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-zinc-400 block mb-1">Фон (Primary):</label>
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg p-1">
                  <input
                    type="color"
                    value={bgPrimary}
                    onChange={(e) => setBgPrimary(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-none"
                  />
                  <input
                    type="text"
                    value={bgPrimary}
                    onChange={(e) => setBgPrimary(e.target.value)}
                    className="w-16 bg-transparent text-[11px] text-zinc-300 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[11px] text-zinc-400 block mb-1">Тень (Dark):</label>
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg p-1">
                  <input
                    type="color"
                    value={bgDark}
                    onChange={(e) => setBgDark(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-none"
                  />
                  <input
                    type="text"
                    value={bgDark}
                    onChange={(e) => setBgDark(e.target.value)}
                    className="w-16 bg-transparent text-[11px] text-zinc-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Plus size={14} />
            <span>Добавить и применить палитру</span>
          </button>
        </form>

        {errorMsg && (
          <p className="mt-2 text-xs text-red-400 bg-red-950/30 p-2 rounded-lg border border-red-500/20">
            {errorMsg}
          </p>
        )}

        {/* Footer Actions: Import / Export */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-all"
          >
            <Upload size={14} />
            <span>Загрузить из JSON</span>
          </button>

          <button
            onClick={handleExportCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-all"
          >
            <Download size={14} />
            <span>Экспорт JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
