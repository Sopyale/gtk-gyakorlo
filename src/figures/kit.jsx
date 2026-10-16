// Small helpers shared by the SVG figures. Plot units: x 0..200 right, y 0..200 up.
export const W = 260, H = 240, PAD = 34;
export const sx = (x) => PAD + (x / 200) * (W - PAD - 12);
export const sy = (y) => H - PAD - (y / 200) * (H - PAD - 12);

export const path = (fn, from, to, steps = 48) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const x = from + ((to - from) * i) / steps;
    return `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(fn(x)).toFixed(1)}`;
  }).join('');

export function Axes({ x = 'Qa', y = 'Qb' }) {
  return (
    <g className="fig-axis">
      <path d={`M${sx(0)} ${sy(200)}V${sy(0)}H${sx(200)}`} />
      <text x={sx(0) - 8} y={sy(200) + 4} textAnchor="end">{y}</text>
      <text x={sx(200)} y={sy(0) + 22} textAnchor="end">{x}</text>
    </g>
  );
}

export function Figure({ label, children }) {
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}
