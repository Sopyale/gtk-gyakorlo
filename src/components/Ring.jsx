// Animated progress ring; value 0..1.
export default function Ring({ value, size = 84, label }) {
  const r = size / 2 - 6, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
      <defs><linearGradient id="ring-g"><stop style={{ stopColor: 'var(--plum)' }} /><stop offset="1" style={{ stopColor: 'var(--acc)' }} /></linearGradient></defs>
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" />
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-bar" stroke="url(#ring-g)"
        style={{ '--c': c }} strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dy=".35em" textAnchor="middle">{Math.round(value * 100)}%</text>
    </svg>
  );
}
