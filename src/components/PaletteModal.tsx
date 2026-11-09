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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Управление палитрами</h2>
            <p className="text-xs text-slate-400">
              Выбирайте готовые палитры Студии, загружайте свои из JSON или настраивайте HEX
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Existing Palettes */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Доступные палитры:</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(palettes).map((p) => {
              const isActive = activePaletteId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPalette(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500/60 ring-2 ring-purple-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                        style={{ backgroundColor: p.bgPrimary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                        style={{ backgroundColor: p.bgDark }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{p.nameRu}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.bgPrimary}</div>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="text-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Palette Form */}
        <form onSubmit={handleCreateCustom} className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">
            Создать новую палитру:
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Название:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">Фон (Primary):</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
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
                    className="w-16 bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">Тень (Dark):</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
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
                    className="w-16 bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md"
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
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
          >
            <Upload size={14} />
            <span>Загрузить из JSON</span>
          </button>

          <button
            onClick={handleExportCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
          >
            <Download size={14} />
            <span>Экспорт JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};