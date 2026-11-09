import React, { useRef, useState, useEffect } from 'react';
import type { AssetMeta, CanvasFormat, CanvasItem, SVGPath } from '../types';
import { FORMATS } from '../types';
import type { Palette } from '../palettes';
import { adaptColorToPalette } from '../palettes';

interface CanvasViewProps {
  items: CanvasItem[];
  format: CanvasFormat;
  palette: Palette;
  assetMap: Record<string, AssetMeta>;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  items,
  format,
  palette,
  assetMap,
  selectedItemId,
  onSelectItem,
  onUpdateItem,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cfg = FORMATS[format];

  // Dragging state
  const [dragState, setDragState] = useState<{
    itemId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    onSelectItem(id);

    const item = items.find(it => it.id === id);
    if (!item) return;

    setDragState({
      itemId: id,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState || !svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = cfg.width / rect.width;
      const scaleY = cfg.height / rect.height;

      const dx = (e.clientX - dragState.startX) * scaleX;
      const dy = (e.clientY - dragState.startY) * scaleY;

      onUpdateItem(dragState.itemId, {
        x: Math.round(dragState.origX + dx),
        y: Math.round(dragState.origY + dy),
      });
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, cfg, onUpdateItem]);

  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="relative flex items-center justify-center p-6 w-full h-full overflow-hidden select-none"
      onClick={() => onSelectItem(null)}
    >
      <div
        className="relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-white/10"
        style={{
          width: '100%',
          maxWidth: `${cfg.width}px`,
          aspectRatio: cfg.aspectRatio,
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${cfg.width} ${cfg.height}`}
          className="w-full h-full block"
          style={{ backgroundColor: palette.bgPrimary }}
        >
          {/* Subtle drop shadow filter for floating elements */}
          <defs>
            <filter id="element-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Render composition objects */}
          {sortedItems.map(item => {
            const assetId = `${item.objectType}-${item.size}-${item.state}`;
            const asset = assetMap[assetId];
            if (!asset) return null;

            const isSelected = selectedItemId === item.id;
            const isMonochrome = item.state === 'bg';
            const ox = asset.w / 2;
            const oy = asset.h / 2;

            return (
              <g
                key={item.id}
                transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation}) scale(${item.scale}) translate(-${ox}, -${oy})`}
                onPointerDown={e => handlePointerDown(e, item.id)}
                className="cursor-grab active:cursor-grabbing transition-opacity"
                filter="url(#element-shadow)"
              >
                {/* Visual outline/highlight when selected */}
                {isSelected && (
                  <rect
                    x={-8}
                    y={-8}
                    width={asset.w + 16}
                    height={asset.h + 16}
                    rx={12}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    strokeDasharray="10 6"
                    className="animate-pulse"
                  />
                )}

                {/* SVG Paths of object */}
                {asset.paths.map((p: SVGPath, idx: number) => {
                  const fill = adaptColorToPalette(p.fill, palette, isMonochrome);
                  return (
                    <path
                      key={idx}
                      d={p.d}
                      fill={fill}
                      fillRule={p.eo ? 'evenodd' : undefined}
                      fillOpacity={p.op && p.op < 1 ? p.op : undefined}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Empty state hint */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
            <p className="text-lg font-medium">Холст пуст</p>
            <p className="text-sm">Используйте ИИ-генератор или добавьте элементы из библиотеки</p>
          </div>
        )}
      </div>
    </div>
  );
};
