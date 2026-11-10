import { useState, useMemo } from 'react';
import type { AssetMeta, CanvasFormat, CanvasItem, DetailSize, ObjectState, PaletteId } from './types';
import { FORMATS } from './types';
import type { Palette } from './palettes';
import { DEFAULT_PALETTES } from './palettes';
import rawObjects from './data/objects.json';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasView } from './components/CanvasView';
import { PaletteModal } from './components/PaletteModal';
import { generateCompositionFromPrompt, generateCompositionFromComponents, fitAndCenterScene } from './aiComposer';
import { buildStandaloneSVG, downloadSVG } from './svgExporter';

export function App() {
  // Asset dictionary indexed by `${object}-${size}-${state}`
  const assetMap = useMemo(() => {
    const map: Record<string, AssetMeta> = {};
    for (const obj of rawObjects as AssetMeta[]) {
      map[obj.id] = obj;
    }
    return map;
  }, []);

  const [initialComposition] = useState(() =>
    generateCompositionFromPrompt('Музыка и отдых', '1:1', 'L')
  );
  const [format, setFormat] = useState<CanvasFormat>('1:1');
  const [detailSize, setDetailSize] = useState<DetailSize>('L');
  const [palettes, setPalettes] = useState<Record<string, Palette>>(DEFAULT_PALETTES);
  const [paletteId, setPaletteId] = useState<PaletteId>(initialComposition.recommendedPalette);
  const [showDecor, setShowDecor] = useState(true);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [items, setItems] = useState<CanvasItem[]>(initialComposition.items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [lastAiRationale, setLastAiRationale] = useState<string | null>(initialComposition.rationale);

  const currentPalette = palettes[paletteId] || DEFAULT_PALETTES.purple;

  // Handlers for Canvas manipulation
  const handleUpdateItem = (id: string, updates: Partial<CanvasItem>) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, ...updates } : it))
    );
  };

  const handleFormatChange = (newFormat: CanvasFormat) => {
    setFormat(newFormat);
    if (items.length > 0) {
      setItems(prev => fitAndCenterScene(prev, newFormat));
    }
  };

  const handleAddItem = (objectType: string, state: ObjectState) => {
    const cfg = FORMATS[format];
    const maxZ = items.length > 0 ? Math.max(...items.map(i => i.zIndex)) : 0;
    
    // Add slightly offset from center
    const offset = (items.length % 5) * 20;
    const newItem: CanvasItem = {
      id: `item-${Date.now()}`,
      objectType,
      size: detailSize,
      state,
      x: Math.round(cfg.width / 2 + offset),
      y: Math.round(cfg.height / 2 + offset),
      scale: 0.85,
      rotation: 0,
      zIndex: maxZ + 5,
    };

    setItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const handleDuplicateItem = (id: string) => {
    const orig = items.find(it => it.id === id);
    if (!orig) return;
    const maxZ = Math.max(...items.map(i => i.zIndex));
    const dup: CanvasItem = {
      ...orig,
      id: `item-dup-${Date.now()}`,
      x: orig.x + 40,
      y: orig.y + 40,
      zIndex: maxZ + 5,
    };
    setItems(prev => [...prev, dup]);
    setSelectedItemId(dup.id);
  };

  const handleBringToFront = (id: string) => {
    const maxZ = Math.max(...items.map(i => i.zIndex), 0);
    handleUpdateItem(id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = (id: string) => {
    const minZ = Math.min(...items.map(i => i.zIndex), 0);
    handleUpdateItem(id, { zIndex: minZ - 1 });
  };

  const handleDetailSizeChange = (newSize: DetailSize) => {
    setDetailSize(newSize);
    setItems(prev => prev.map(it => ({ ...it, size: newSize })));
  };

  // AI Generation (Scenario 1)
  const handleGenerateAI = (prompt: string) => {
    const result = generateCompositionFromPrompt(prompt, format, detailSize);
    setItems(result.items);
    setPaletteId(result.recommendedPalette);
    setLastAiRationale(result.rationale);
    setSelectedItemId(null);
  };

  // Scenario 2: Batch components
  const handleAutoLayoutComponents = (keys: string[]) => {
    const newItems = generateCompositionFromComponents(keys, format, detailSize);
    setItems(newItems);
    setSelectedItemId(null);
  };

  // Export SVG
  const handleExportSVG = () => {
    const svgString = buildStandaloneSVG(items, format, currentPalette, assetMap, showDecor);
    downloadSVG(svgString, `ochen-composition-${format}-${paletteId}.svg`);
  };

  const handleClearCanvas = () => {
    setItems([]);
    setSelectedItemId(null);
    setLastAiRationale(null);
  };

  const handleAddPalette = (newPalette: Palette) => {
    setPalettes(prev => ({
      ...prev,
      [newPalette.id]: newPalette,
    }));
  };

  const selectedItem = items.find(it => it.id === selectedItemId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 font-sans">
      <Header
        format={format}
        onFormatChange={handleFormatChange}
        detailSize={detailSize}
        onDetailSizeChange={handleDetailSizeChange}
        palettes={palettes}
        paletteId={paletteId}
        onPaletteChange={setPaletteId}
        onOpenPaletteModal={() => setIsPaletteModalOpen(true)}
        showDecor={showDecor}
        onToggleDecor={() => setShowDecor(p => !p)}
        onExportSVG={handleExportSVG}
        onClearCanvas={handleClearCanvas}
        itemsCount={items.length}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          items={items}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItemId}
          detailSize={detailSize}
          assetMap={assetMap}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onDuplicateItem={handleDuplicateItem}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onGenerateAI={handleGenerateAI}
          onAutoLayoutComponents={handleAutoLayoutComponents}
          lastAiRationale={lastAiRationale}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-950 isometric-grid relative overflow-hidden">
          <CanvasView
            items={items}
            format={format}
            palette={currentPalette}
            assetMap={assetMap}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            onUpdateItem={handleUpdateItem}
            showDecor={showDecor}
          />
        </main>
      </div>

      <PaletteModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        palettes={palettes}
        activePaletteId={paletteId}
        onSelectPalette={(id) => setPaletteId(id)}
        onAddPalette={handleAddPalette}
      />
    </div>
  );
}

export default App;
