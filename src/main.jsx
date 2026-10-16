import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/figtree';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);

// Pointer light: panels and controls read the pointer position from --mx/--my;
// link cards also get --rx/--ry (-1..1) for a slight tilt.
const LIT = '.card, .qcard, .soon-card, .review li, .btn, .opt, .chip, .flash';
addEventListener('pointermove', (e) => {
  const el = e.target.closest?.(LIT);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);
  if (el.matches('a.card')) {
    el.style.setProperty('--rx', ((x / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty('--ry', ((y / r.height) * 2 - 1).toFixed(3));
  }
}, { passive: true });

// Press ripple on every control and link card.
const PRESS = '.btn, .opt, .chip, .icon-btn, a.card, .nav a, .drawer a';
addEventListener('pointerdown', (e) => {
  const el = e.target.closest?.(PRESS);
  if (!el || el.disabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect();
  const d = Math.hypot(r.width, r.height) * 2;
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  el.append(dot);
  dot.addEventListener('animationend', () => dot.remove());
}, { passive: true });
