// A short confetti burst (CSS only); the parent remounts it via key to fire again.
const COLORS = ['var(--acc)', 'var(--good)', '#f5b83d', '#6aa7ff', '#ff7aa8'];
export default function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--d': `${(i % 7) * 60}ms`, '--r': `${(i * 53) % 360}deg`, background: COLORS[i % COLORS.length] }} />
      ))}
    </div>
  );
}
