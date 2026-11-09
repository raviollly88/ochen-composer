import React from 'react';
import type { Palette } from '../palettes';

interface BackgroundDecorProps {
  width: number;
  height: number;
  palette: Palette;
  showDecor?: boolean;
}

/**
 * Authentic Studio Ochen background decorative layer:
 * - 30-degree isometric floor scratch lines (as in official studio SVGs)
 * - Ground plane anchor hatches
 * - Bottom-left overlapping isometric pills (signature brand accent)
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

  // Floor scratches adaptively scaled to fit canvas bounds
  const lineSpan = Math.min(360, W * 0.40);
  const ellipseRx = Math.min(90, W * 0.12);
  const ellipseRy = ellipseRx * 0.46;

  // 30-degree isometric slope: dx = L * cos(30) ≈ L * 0.866, dy = L * sin(30) ≈ L * 0.500
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
