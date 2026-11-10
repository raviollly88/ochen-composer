import React from 'react';
import type { Palette } from '../palettes';

interface BackgroundDecorProps {
  width: number;
  height: number;
  palette: Palette;
  showDecor?: boolean;
}

/**
 * Identifies the decor theme type for standard and custom user-created palettes.
 */
export function getPaletteDecorType(palette: Palette): 'peach' | 'mint' | 'purple' {
  const id = (palette.id || '').toLowerCase();
  const name = (palette.nameRu || palette.name || '').toLowerCase();
  if (id === 'peach' || id.includes('peach') || name.includes('персик') || name.includes('peach')) {
    return 'peach';
  }
  if (id === 'mint' || id.includes('mint') || name.includes('мят') || name.includes('mint')) {
    return 'mint';
  }
  return 'purple';
}

/**
 * Builds standalone SVG string representation of bespoke background decor for each palette.
 * Shared between canvas rendering and svgExporter.ts to guarantee 100% fidelity.
 */
export function getBackgroundDecorSVG(W: number, H: number, palette: Palette): string {
  const cx = W / 2;
  const cy = H / 2;
  const strokeColor = palette.bgDark;
  const lineSpan = Math.min(360, W * 0.40);
  const ellipseRx = Math.min(90, W * 0.12);
  const ellipseRy = ellipseRx * 0.46;
  const decorType = getPaletteDecorType(palette);

  const lines: string[] = [
    `    <!-- Studio Ochen Background Decorative Elements (${decorType}) -->`,
    `    <g id="background-decor" pointer-events="none">`
  ];

  if (decorType === 'peach') {
    // Warm Peach Decor: editorial stationery, warm concentric ring, 30° drafting hatch lines, terracotta pill
    const ringRx = Math.min(46, W * 0.06);
    const ringRy = ringRx * 0.52;
    const ringX = cx + lineSpan * 0.62;
    const ringY = cy - lineSpan * 0.45;
    const pillAccent = palette.accentYellow || '#f9ebaf';

    lines.push(`      <!-- 1. Geometric accent ring & dot -->`);
    lines.push(`      <ellipse cx="${ringX}" cy="${ringY}" rx="${ringRx}" ry="${ringRy}" stroke="${strokeColor}" stroke-width="1.5" fill="none" opacity="0.35"/>`);
    lines.push(`      <circle cx="${ringX}" cy="${ringY}" r="3" fill="${strokeColor}" opacity="0.50"/>`);
    lines.push(`      <!-- 2. Drafting floor axis line -->`);
    lines.push(`      <line x1="${cx - lineSpan * 0.85}" y1="${cy + lineSpan * 0.18}" x2="${cx - lineSpan * 0.12}" y2="${cy - lineSpan * 0.26}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.42"/>`);
    lines.push(`      <!-- 3. Trio of parallel drafting hatch marks -->`);
    lines.push(`      <line x1="${cx - lineSpan * 0.58}" y1="${cy - lineSpan * 0.38}" x2="${cx - lineSpan * 0.38}" y2="${cy - lineSpan * 0.50}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.36"/>`);
    lines.push(`      <line x1="${cx - lineSpan * 0.50}" y1="${cy - lineSpan * 0.33}" x2="${cx - lineSpan * 0.30}" y2="${cy - lineSpan * 0.45}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.36"/>`);
    lines.push(`      <line x1="${cx - lineSpan * 0.42}" y1="${cy - lineSpan * 0.28}" x2="${cx - lineSpan * 0.22}" y2="${cy - lineSpan * 0.40}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.36"/>`);
    lines.push(`      <!-- 4. Foreground right hatch mark -->`);
    lines.push(`      <line x1="${cx + lineSpan * 0.28}" y1="${cy + lineSpan * 0.48}" x2="${cx + lineSpan * 0.56}" y2="${cy + lineSpan * 0.32}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>`);
    lines.push(`      <!-- 5. Warm soft ground ellipse -->`);
    lines.push(`      <ellipse cx="${cx - 100}" cy="${cy - 40}" rx="${ellipseRx * 0.95}" ry="${ellipseRy * 0.95}" fill="${strokeColor}" opacity="0.10"/>`);
    lines.push(`      <!-- 6. Signature Corner Pills (Terracotta & Soft Cream) -->`);
    lines.push(`      <g transform="translate(75, ${H - 65})">`);
    lines.push(`        <ellipse cx="20" cy="22" rx="28" ry="14" fill="${strokeColor}" opacity="0.65"/>`);
    lines.push(`        <ellipse cx="44" cy="10" rx="28" ry="14" fill="${pillAccent}" opacity="0.95"/>`);
    lines.push(`      </g>`);
  } else if (decorType === 'mint') {
    // Fresh Mint Decor: modern digital/tech, dotted coordinate axes, technical crosshairs, subtle tech grid, cyan pill
    const cross1X = cx + lineSpan * 0.60;
    const cross1Y = cy - lineSpan * 0.35;
    const cross2X = cx + lineSpan * 0.40;
    const cross2Y = cy + lineSpan * 0.42;
    const pillAccent = palette.bgLight || '#e4f7f7';

    lines.push(`      <!-- 1. Primary diagonal tech coordinate axis -->`);
    lines.push(`      <line x1="${cx - lineSpan * 1.05}" y1="${cy + lineSpan * 0.32}" x2="${cx + lineSpan * 0.25}" y2="${cy - lineSpan * 0.45}" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="4 6" stroke-linecap="round" opacity="0.45"/>`);
    lines.push(`      <!-- 2. Secondary counter-isometric guide axis -->`);
    lines.push(`      <line x1="${cx - lineSpan * 0.20}" y1="${cy - lineSpan * 0.60}" x2="${cx + lineSpan * 0.55}" y2="${cy - lineSpan * 0.15}" stroke="${strokeColor}" stroke-width="1.2" stroke-dasharray="3 5" stroke-linecap="round" opacity="0.35"/>`);
    lines.push(`      <!-- 3. Technical crosshair ticks -->`);
    lines.push(`      <line x1="${cross1X - 8}" y1="${cross1Y}" x2="${cross1X + 8}" y2="${cross1Y}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>`);
    lines.push(`      <line x1="${cross1X}" y1="${cross1Y - 8}" x2="${cross1X}" y2="${cross1Y + 8}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>`);
    lines.push(`      <line x1="${cross2X - 6}" y1="${cross2Y}" x2="${cross2X + 6}" y2="${cross2Y}" stroke="${strokeColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.40"/>`);
    lines.push(`      <line x1="${cross2X}" y1="${cross2Y - 6}" x2="${cross2X}" y2="${cross2Y + 6}" stroke="${strokeColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.40"/>`);
    lines.push(`      <!-- 4. Subtle tech grid accents -->`);
    lines.push(`      <line x1="${cx - lineSpan * 0.85}" y1="${cy + lineSpan * 0.08}" x2="${cx - lineSpan * 0.25}" y2="${cy - lineSpan * 0.27}" stroke="${strokeColor}" stroke-width="1.2" stroke-dasharray="2 6" stroke-linecap="round" opacity="0.25"/>`);
    lines.push(`      <line x1="${cx - lineSpan * 0.70}" y1="${cy + lineSpan * 0.18}" x2="${cx - lineSpan * 0.10}" y2="${cy - lineSpan * 0.17}" stroke="${strokeColor}" stroke-width="1.2" stroke-dasharray="2 6" stroke-linecap="round" opacity="0.25"/>`);
    lines.push(`      <circle cx="${cx - lineSpan * 0.48}" cy="${cy + lineSpan * 0.03}" r="1.5" fill="${strokeColor}" opacity="0.45"/>`);
    lines.push(`      <circle cx="${cx - lineSpan * 0.12}" cy="${cy - lineSpan * 0.21}" r="1.5" fill="${strokeColor}" opacity="0.45"/>`);
    lines.push(`      <!-- 5. Subtle tech ground ellipse -->`);
    lines.push(`      <ellipse cx="${cx - 110}" cy="${cy - 40}" rx="${ellipseRx}" ry="${ellipseRy}" fill="${strokeColor}" opacity="0.10"/>`);
    lines.push(`      <!-- 6. Signature Corner Pills (Deep Cyan & Clean Mint) -->`);
    lines.push(`      <g transform="translate(75, ${H - 65})">`);
    lines.push(`        <ellipse cx="20" cy="22" rx="28" ry="14" fill="${strokeColor}" opacity="0.65"/>`);
    lines.push(`        <ellipse cx="44" cy="10" rx="28" ry="14" fill="${pillAccent}" opacity="0.95"/>`);
    lines.push(`      </g>`);
  } else {
    // Purple Mist Decor (Classic Signature): soft diagonal strokes, subtle shadow ellipse, purple & crisp white pills
    lines.push(`      <!-- 1. Main diagonal isometric scratch line across floor -->`);
    lines.push(`      <line x1="${cx - lineSpan}" y1="${cy + lineSpan * 0.22}" x2="${cx - lineSpan * 0.15}" y2="${cy - lineSpan * 0.28}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>`);
    lines.push(`      <!-- 2. Secondary parallel scratch mark near upper-left background -->`);
    lines.push(`      <line x1="${cx - lineSpan * 0.70}" y1="${cy - lineSpan * 0.45}" x2="${cx - lineSpan * 0.40}" y2="${cy - lineSpan * 0.62}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>`);
    lines.push(`      <!-- 3. Small floor hatch mark near foreground right -->`);
    lines.push(`      <line x1="${cx + lineSpan * 0.35}" y1="${cy + lineSpan * 0.45}" x2="${cx + lineSpan * 0.55}" y2="${cy + lineSpan * 0.33}" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>`);
    lines.push(`      <!-- 4. Ground shadow ellipse under background depth -->`);
    lines.push(`      <ellipse cx="${cx - 120}" cy="${cy - 50}" rx="${ellipseRx}" ry="${ellipseRy}" fill="${strokeColor}" opacity="0.12"/>`);
    lines.push(`      <!-- 5. Signature Studio Ochen corner brand accent (Overlapping isometric pills) -->`);
    lines.push(`      <g transform="translate(75, ${H - 65})">`);
    lines.push(`        <ellipse cx="20" cy="22" rx="28" ry="14" fill="${strokeColor}" opacity="0.65"/>`);
    lines.push(`        <ellipse cx="44" cy="10" rx="28" ry="14" fill="#ffffff" opacity="0.95"/>`);
    lines.push(`      </g>`);
  }

  lines.push(`    </g>`);
  return lines.join('\n');
}

/**
 * Authentic Studio Ochen background decorative layer:
 * Bespoke graphic elements tailored specifically to each color palette:
 * - Purple Mist: soft diagonal scratches, soft shadow ellipse, purple + white pills.
 * - Warm Peach: geometric accent ring/circle, 30° drafting hatch lines, terracotta + cream pills.
 * - Fresh Mint: dotted isometric coordinate axes, technical crosshairs/plus ticks, subtle tech grid, cyan/mint pills.
 */
export const BackgroundDecor: React.FC<BackgroundDecorProps> = ({
  width: W,
  height: H,
  palette,
  showDecor = true,
}) => {
  if (!showDecor) return null;

  const cx = W / 2;
  const cy = H / 2;
  const strokeColor = palette.bgDark;
  const lineSpan = Math.min(360, W * 0.40);
  const ellipseRx = Math.min(90, W * 0.12);
  const ellipseRy = ellipseRx * 0.46;
  const decorType = getPaletteDecorType(palette);

  if (decorType === 'peach') {
    const ringRx = Math.min(46, W * 0.06);
    const ringRy = ringRx * 0.52;
    const ringX = cx + lineSpan * 0.62;
    const ringY = cy - lineSpan * 0.45;
    const pillAccent = palette.accentYellow || '#f9ebaf';

    return (
      <g id="background-decor" pointerEvents="none" className="select-none">
        {/* 1. Geometric accent ring & dot */}
        <ellipse
          cx={ringX}
          cy={ringY}
          rx={ringRx}
          ry={ringRy}
          stroke={strokeColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.35"
        />
        <circle
          cx={ringX}
          cy={ringY}
          r={3}
          fill={strokeColor}
          opacity="0.50"
        />

        {/* 2. Drafting floor axis line */}
        <line
          x1={cx - lineSpan * 0.85}
          y1={cy + lineSpan * 0.18}
          x2={cx - lineSpan * 0.12}
          y2={cy - lineSpan * 0.26}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.42"
        />

        {/* 3. Trio of parallel drafting hatch marks */}
        <line
          x1={cx - lineSpan * 0.58}
          y1={cy - lineSpan * 0.38}
          x2={cx - lineSpan * 0.38}
          y2={cy - lineSpan * 0.50}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.36"
        />
        <line
          x1={cx - lineSpan * 0.50}
          y1={cy - lineSpan * 0.33}
          x2={cx - lineSpan * 0.30}
          y2={cy - lineSpan * 0.45}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.36"
        />
        <line
          x1={cx - lineSpan * 0.42}
          y1={cy - lineSpan * 0.28}
          x2={cx - lineSpan * 0.22}
          y2={cy - lineSpan * 0.40}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.36"
        />

        {/* 4. Foreground right hatch mark */}
        <line
          x1={cx + lineSpan * 0.28}
          y1={cy + lineSpan * 0.48}
          x2={cx + lineSpan * 0.56}
          y2={cy + lineSpan * 0.32}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.38"
        />

        {/* 5. Warm soft ground ellipse */}
        <ellipse
          cx={cx - 100}
          cy={cy - 40}
          rx={ellipseRx * 0.95}
          ry={ellipseRy * 0.95}
          fill={strokeColor}
          opacity="0.10"
        />

        {/* 6. Signature Corner Pills (Terracotta & Soft Cream) */}
        <g transform={`translate(75, ${H - 65})`}>
          <ellipse
            cx={20}
            cy={22}
            rx={28}
            ry={14}
            fill={strokeColor}
            opacity="0.65"
          />
          <ellipse
            cx={44}
            cy={10}
            rx={28}
            ry={14}
            fill={pillAccent}
            opacity="0.95"
          />
        </g>
      </g>
    );
  }

  if (decorType === 'mint') {
    const cross1X = cx + lineSpan * 0.60;
    const cross1Y = cy - lineSpan * 0.35;
    const cross2X = cx + lineSpan * 0.40;
    const cross2Y = cy + lineSpan * 0.42;
    const pillAccent = palette.bgLight || '#e4f7f7';

    return (
      <g id="background-decor" pointerEvents="none" className="select-none">
        {/* 1. Primary diagonal tech coordinate axis */}
        <line
          x1={cx - lineSpan * 1.05}
          y1={cy + lineSpan * 0.32}
          x2={cx + lineSpan * 0.25}
          y2={cy - lineSpan * 0.45}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* 2. Secondary counter-isometric guide axis */}
        <line
          x1={cx - lineSpan * 0.20}
          y1={cy - lineSpan * 0.60}
          x2={cx + lineSpan * 0.55}
          y2={cy - lineSpan * 0.15}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="3 5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* 3. Technical crosshair ticks */}
        <line
          x1={cross1X - 8}
          y1={cross1Y}
          x2={cross1X + 8}
          y2={cross1Y}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line
          x1={cross1X}
          y1={cross1Y - 8}
          x2={cross1X}
          y2={cross1Y + 8}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />

        <line
          x1={cross2X - 6}
          y1={cross2Y}
          x2={cross2X + 6}
          y2={cross2Y}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.40"
        />
        <line
          x1={cross2X}
          y1={cross2Y - 6}
          x2={cross2X}
          y2={cross2Y + 6}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.40"
        />

        {/* 4. Subtle tech grid accents */}
        <line
          x1={cx - lineSpan * 0.85}
          y1={cy + lineSpan * 0.08}
          x2={cx - lineSpan * 0.25}
          y2={cy - lineSpan * 0.27}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="2 6"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1={cx - lineSpan * 0.70}
          y1={cy + lineSpan * 0.18}
          x2={cx - lineSpan * 0.10}
          y2={cy - lineSpan * 0.17}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="2 6"
          strokeLinecap="round"
          opacity="0.25"
        />
        <circle
          cx={cx - lineSpan * 0.48}
          cy={cy + lineSpan * 0.03}
          r={1.5}
          fill={strokeColor}
          opacity="0.45"
        />
        <circle
          cx={cx - lineSpan * 0.12}
          cy={cy - lineSpan * 0.21}
          r={1.5}
          fill={strokeColor}
          opacity="0.45"
        />

        {/* 5. Subtle tech ground ellipse */}
        <ellipse
          cx={cx - 110}
          cy={cy - 40}
          rx={ellipseRx}
          ry={ellipseRy}
          fill={strokeColor}
          opacity="0.10"
        />

        {/* 6. Signature Corner Pills (Deep Cyan & Clean Mint) */}
        <g transform={`translate(75, ${H - 65})`}>
          <ellipse
            cx={20}
            cy={22}
            rx={28}
            ry={14}
            fill={strokeColor}
            opacity="0.65"
          />
          <ellipse
            cx={44}
            cy={10}
            rx={28}
            ry={14}
            fill={pillAccent}
            opacity="0.95"
          />
        </g>
      </g>
    );
  }

  // Purple Mist Decor (Classic Signature)
  return (
    <g id="background-decor" pointerEvents="none" className="select-none">
      {/* 1. Main diagonal isometric scratch line across floor */}
      <line
        x1={cx - lineSpan}
        y1={cy + lineSpan * 0.22}
        x2={cx - lineSpan * 0.15}
        y2={cy - lineSpan * 0.28}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* 2. Secondary parallel scratch mark near upper-left background */}
      <line
        x1={cx - lineSpan * 0.70}
        y1={cy - lineSpan * 0.45}
        x2={cx - lineSpan * 0.40}
        y2={cy - lineSpan * 0.62}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.38"
      />

      {/* 3. Small floor hatch mark near foreground right */}
      <line
        x1={cx + lineSpan * 0.35}
        y1={cy + lineSpan * 0.45}
        x2={cx + lineSpan * 0.55}
        y2={cy + lineSpan * 0.33}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* 4. Ground shadow ellipse under background depth */}
      <ellipse
        cx={cx - 120}
        cy={cy - 50}
        rx={ellipseRx}
        ry={ellipseRy}
        fill={strokeColor}
        opacity="0.12"
      />

      {/* 5. Signature Studio Ochen corner brand accent (Overlapping isometric pills) */}
      <g transform={`translate(75, ${H - 65})`}>
        {/* Dark theme tint pill */}
        <ellipse
          cx={20}
          cy={22}
          rx={28}
          ry={14}
          fill={strokeColor}
          opacity="0.65"
        />
        {/* Crisp white overlapping pill */}
        <ellipse
          cx={44}
          cy={10}
          rx={28}
          ry={14}
          fill="#ffffff"
          opacity="0.95"
        />
      </g>
    </g>
  );
};
