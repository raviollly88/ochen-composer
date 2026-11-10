import React, { useRef, useState, useEffect } from 'react';
import type { AssetMeta, CanvasFormat, CanvasItem, SVGPath } from '../types';
import { FORMATS } from '../types';
import type { Palette } from '../palettes';
import { adaptColorToPalette } from '../palettes';
import { BackgroundDecor } from './BackgroundDecor';

interface CanvasViewProps {
  items: CanvasItem[];
  format: CanvasFormat;
  palette: Palette;
  assetMap: Record<string, AssetMeta>;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  showDecor?: boolean;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  items,
  format,
  palette,
  assetMap,
  selectedItemId,
  onSelectItem,
  onUpdateItem,
  showDecor = true,
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
    hasMoved: boolean;
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
      hasMoved: false,
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

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragState.hasMoved = true;
      }

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
    <div className="relative flex items-center justify-center p-4 w-full h-full overflow-hidden select-none">
      <div
        className="relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 flex items-center justify-center"
        style={{
          aspectRatio: cfg.aspectRatio,
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 96px)',
          width: `min(100%, calc((100vh - 96px) * ${cfg.width / cfg.height}))`,
          height: `min(calc(100vh - 96px), calc(100% * ${cfg.height / cfg.width}))`,
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${cfg.width} ${cfg.height}`}
          className="w-full h-full block"
        >
          {/* Subtle drop shadow filter for floating elements */}
          <defs>
            <filter id="element-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
            </filter>
            <clipPath id="canvas-card-clip">
              <rect width={cfg.width} height={cfg.height} rx={20} />
            </clipPath>
          </defs>

          {/* Background rect: clicking here deselects */}
          <rect
            width={cfg.width}
            height={cfg.height}
            rx={20}
            fill={palette.bgPrimary}
            onClick={() => onSelectItem(null)}
            className="cursor-default"
          />

          {/* Framed card content with clean rounded boundary clipping */}
          <g clipPath="url(#canvas-card-clip)">
            {/* Authentic Studio Ochen background scratches & accents */}
            <BackgroundDecor
              width={cfg.width}
              height={cfg.height}
              palette={palette}
              showDecor={showDecor}
            />

            {/* Render composition objects */}
            {sortedItems.map(item => {
              const itemSize = item.size || 'L';
              const assetId = `${item.objectType}-${itemSize}-${item.state}`;
              const asset = assetMap[assetId] || assetMap[`${item.objectType}-L-${item.state}`] || assetMap[`${item.objectType}-L-main`];
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
                  onClick={e => {
                    e.stopPropagation();
                    onSelectItem(item.id);
                  }}
                  className="cursor-grab active:cursor-grabbing transition-opacity"
                  filter="url(#element-shadow)"
                >
                  {/* Invisible hit-area to allow instant single-click selection anywhere on the object */}
                  <rect
                    x={0}
                    y={0}
                    width={asset.w}
                    height={asset.h}
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Visual outline/highlight when selected (Figma-style) */}
                  {isSelected && (
                    <g pointerEvents="none">
                      <rect
                        x={-6}
                        y={-6}
                        width={asset.w + 12}
                        height={asset.h + 12}
                        rx={8}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        strokeDasharray="8 5"
                        opacity={0.9}
                      />
                      {/* Corner handles */}
                      <circle cx={-6} cy={-6} r={5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
                      <circle cx={asset.w + 6} cy={-6} r={5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
                      <circle cx={-6} cy={asset.h + 6} r={5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
                      <circle cx={asset.w + 6} cy={asset.h + 6} r={5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
                    </g>
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
          </g>
        </svg>

        {/* Empty state hint */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-zinc-500">
            <p className="text-base font-medium">Холст пуст</p>
            <p className="text-xs">Используйте ИИ-сборку или добавьте элементы из библиотеки</p>
          </div>
        )}
      </div>
    </div>
  );
};
