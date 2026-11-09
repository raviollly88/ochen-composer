import React from 'react';
import type { CanvasFormat, DetailSize } from '../types';
import { FORMATS } from '../types';
import type { Palette } from '../palettes';
import { Download, Trash2, Palette as PaletteIcon, Sparkles } from 'lucide-react';

interface HeaderProps {
  format: CanvasFormat;
  onFormatChange: (fmt: CanvasFormat) => void;
  detailSize: DetailSize;
  onDetailSizeChange: (size: DetailSize) => void;
  palettes: Record<string, Palette>;
  paletteId: string;
  onPaletteChange: (pal: string) => void;
  onOpenPaletteModal: () => void;
  showDecor: boolean;
  onToggleDecor: () => void;
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
  showDecor,
  onToggleDecor,
  onExportSVG,
  onClearCanvas,
  itemsCount,
}) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-6 flex items-center justify-between z-30 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-xl tracking-tight text-white">
            Очень.
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/80 font-medium">
            Компоновщик
          </span>
        </div>
      </div>

      {/* Center Controls: Format, Size, Palette */}
      <div className="flex items-center gap-4">
        {/* Format Selector */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          {(Object.keys(FORMATS) as CanvasFormat[]).map(fmt => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                format === fmt
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {FORMATS[fmt].id}
            </button>
          ))}
        </div>

        {/* Detail Level (L vs S) */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => onDetailSizeChange('L')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              detailSize === 'L'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Высокая детализация (Размер L)"
          >
            L Детализация
          </button>
          <button
            onClick={() => onDetailSizeChange('S')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              detailSize === 'S'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Компактный размер (Размер S)"
          >
            S Компакт
          </button>
        </div>

        {/* Studio & Custom Color Palettes */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {Object.values(palettes).slice(0, 4).map(p => {
            const isActive = paletteId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPaletteChange(p.id)}
                title={`Палитра: ${p.nameRu}`}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: p.bgPrimary }}
                />
                <span className="hidden sm:inline">{p.nameRu}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenPaletteModal}
            title="Загрузить или настроить палитру (JSON / HEX)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-xs border border-dashed border-zinc-700 ml-1"
          >
            <PaletteIcon size={13} />
            <span className="hidden md:inline">Палитра</span>
          </button>

          {/* Background Decor Toggle (Studio scratches and accents) */}
          <button
            onClick={onToggleDecor}
            title={showDecor ? 'Отключить фирменные штрихи фона' : 'Включить фирменные штрихи фона'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-medium border ${
              showDecor
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
          >
            <Sparkles size={13} className={showDecor ? 'text-amber-400' : 'text-zinc-500'} />
            <span className="hidden lg:inline">Декор фона</span>
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearCanvas}
          disabled={itemsCount === 0}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
          title="Очистить холст"
        >
          <Trash2 size={17} />
        </button>

        <button
          onClick={onExportSVG}
          disabled={itemsCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download size={15} />
          <span>Скачать SVG</span>
        </button>
      </div>
    </header>
  );
};
