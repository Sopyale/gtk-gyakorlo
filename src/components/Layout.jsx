import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { subjects } from '../lib/data.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';
import { LEGAL, LegalBanner } from './Legal.jsx';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

function ThemeToggle() {
  const [theme, setTheme] = useState(() => load('theme', null));
  const dark = theme ? theme === 'dark' : systemDark();
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);
  const next = dark ? 'light' : 'dark';
  return (
    <button className="icon-btn" aria-label={dark ? 'Világos mód' : 'Sötét mód'}
      onClick={() => { save('theme', next); setTheme(next); }}>
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

function SubjectLinks({ current, onPick }) {
  return subjects.map((s) =>
    s.active ? (
      <a key={s.id} href={href(s.id)} className={current === s.id ? 'on' : ''}
        aria-current={current === s.id ? 'page' : undefined} onClick={onPick}>{s.name}</a>
    ) : (
      <span key={s.id} className="soon" aria-disabled="true">{s.name}<small>Hamarosan</small></span>
    ),
  );
}

export default function Layout({ current, calm, children }) {
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => e.key === 'Escape' && setDrawer(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [drawer]);

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Ugrás a tartalomra</a>
      <header className="top">
        <div className="wrap bar">
          <a className="logo" href="#/"><span className="mark" aria-hidden="true" />gyakorló</a>
          <nav className="nav" aria-label="Tárgyak"><SubjectLinks current={current} /></nav>
          <ThemeToggle />
          <button className="icon-btn burger" aria-label="Menü" aria-expanded={drawer} onClick={() => setDrawer(true)}>
            <Menu size={20} />
          </button>
        </div>
      </header>
      {drawer && (
        <div className="drawer-bg" onClick={() => setDrawer(false)}>
          <nav className="drawer" aria-label="Tárgyak" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn" aria-label="Menü bezárása" onClick={() => setDrawer(false)} autoFocus><X size={20} /></button>
            <a href="#/" onClick={() => setDrawer(false)}>Főoldal</a>
            <SubjectLinks current={current} onPick={() => setDrawer(false)} />
          </nav>
        </div>
      )}
      <main id="main" tabIndex={-1} className={calm ? 'calm' : ''}>{children}</main>
      <footer className="foot"><div className="wrap"><p>{LEGAL}</p>
        <p className="ver">Verzió: {__VERSION__}{reduced && '. Az animációk ki vannak kapcsolva, mert az eszközöd mozgáscsökkentést kér.'}</p></div></footer>
      <LegalBanner />
    </>
  );
}
