import { useEffect, useState } from 'react';
import { Clock, Maximize2, Minimize2 } from 'lucide-react';
import { load, save } from '../lib/storage.js';

// Fókusz mód: hides the menu and the footer (html.focus in styles.css); in practice it also shows the time spent.
export default function Focus({ timer = true }) {
  const [on, setOn] = useState(() => load('focus', false));
  const [start] = useState(Date.now);
  const [, tick] = useState(0);
  useEffect(() => {
    document.documentElement.classList.toggle('focus', on);
    return () => document.documentElement.classList.remove('focus');
  }, [on]);
  useEffect(() => {
    if (!on || !timer) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [on, timer]);
  const s = Math.floor((Date.now() - start) / 1000);
  const toggle = () => { save('focus', !on); setOn(!on); };
  return (
    <span className="focus-tools">
      {on && timer && <span className="timer" role="timer" aria-label="Eltelt idő"><Clock size={16} aria-hidden="true" />
        {String(Math.floor(s / 60)).padStart(2, '0')}:{String(s % 60).padStart(2, '0')}</span>}
      <button className="icon-btn" onClick={toggle} aria-pressed={on} title={on ? 'Fókusz mód kikapcsolása' : 'Fókusz mód: csak a kérdés'}
        aria-label="Fókusz mód">{on ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
    </span>
  );
}
