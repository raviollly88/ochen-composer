import React from 'react';
import type { CanvasFormat, DetailSize } from '../types';
import { FORMATS } from '../types';
import type { Palette } from '../palettes';
import { Download, Trash2, Palette as PaletteIcon } from 'lucide-react';

interface HeaderProps {
  format: CanvasFormat;
  onFormatChange: (fmt: CanvasFormat) => void;
  detailSize: DetailSize;
  onDetailSizeChange: (size: DetailSize) => void;
  palettes: Record<string, Palette>;
  paletteId: string;
  onPaletteChange: (pal: string) => void;
  onOpenPaletteModal: () => void;
  onExportSVG: () => void;
  onClearCanvas: () => void;
  itemsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  format,
  onFormatChange,
  detailSize,
  onDetailSizeChange,
  palettes,
  paletteId,
  onPaletteChange,
  onOpenPaletteModal,
  onExportSVG,
  onClearCanvas,
  itemsCount,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-30 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-white bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Очень.
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
            Компоновщик
          </span>
        </div>
      </div>

      {/* Center Controls: Format, Size, Palette */}
      <div className="flex items-center gap-4">
        {/* Format Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          {(Object.keys(FORMATS) as CanvasFormat[]).map(fmt => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                format === fmt
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {FORMATS[fmt].id}
            </button>
          ))}
        </div>

        {/* Detail Level (L vs S) */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onDetailSizeChange('L')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              detailSize === 'L'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Высокая детализация (Размер L)"
          >
            L Детализация
          </button>
          <button
            onClick={() => onDetailSizeChange('S')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              detailSize === 'S'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Компактный размер (Размер S)"
          >
            S Компакт
          </button>
        </div>

        {/* Studio & Custom Color Palettes */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {Object.values(palettes).slice(0, 4).map(p => {
            const isActive = paletteId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPaletteChange(p.id)}
                title={`Палитра: ${p.nameRu}`}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                  isActive
                    ? 'bg-slate-800 text-white ring-2 ring-purple-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                  style={{ backgroundColor: p.bgPrimary }}
                />
                <span className="hidden sm:inline">{p.nameRu}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenPaletteModal}
            title="Загрузить или настроить палитру (JSON / HEX)"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/30 transition-all text-xs border border-dashed border-slate-700 hover:border-purple-500/50 ml-1"
          >
            <PaletteIcon size={13} />
            <span className="hidden md:inline">Загрузить</span>
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearCanvas}
          disabled={itemsCount === 0}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
          title="Очистить холст"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={onExportSVG}
          disabled={itemsCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download size={16} />
          <span>Скачать SVG</span>
        </button>
      </div>
    </header>
  );
};
