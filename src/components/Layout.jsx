import { useEffect, useState } from 'react';
import { CircleUserRound, Menu, MessageCircleQuestion, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { accountsEnabled, useAccount } from '../lib/account.js';
import { subjects } from '../lib/data.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';
import { LEGAL, LegalBanner } from './Legal.jsx';
import FeedbackPrompt from './FeedbackPrompt.jsx';
import SignInPrompt from './SignInPrompt.jsx';

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

function AccountButton() {
  const { profile } = useAccount();
  if (!accountsEnabled) return null;
  return (
    <a className={`icon-btn account-btn ${profile?.neptun ? 'in' : ''}`} href={href('fiok')} aria-label={profile?.neptun ? `Fiók: ${profile.neptun}` : 'Belépés'}>
      <CircleUserRound size={20} aria-hidden="true" />{profile?.neptun && <span>{profile.neptun}</span>}
    </a>
  );
}

// Only admins see this tab; the data itself is fetched from Supabase and guarded by row-level security.
function AdminLink({ current }) {
  const { profile } = useAccount();
  if (!profile?.is_admin) return null;
  return (
    <a className={`icon-btn wide-only ${current === 'admin' ? 'on' : ''}`} href={href('admin')} aria-label="Admin" title="Admin"
      aria-current={current === 'admin' ? 'page' : undefined}>
      <ShieldCheck size={20} aria-hidden="true" />
    </a>
  );
}

function TicketLink({ current }) {
  if (!accountsEnabled) return null;
  return (
    <a className={`icon-btn account-btn wide-only help-btn ${current === 'kerdes' ? 'in' : ''}`} href={href('kerdes')} aria-label="Segítség kérése" title="Segítség kérése"
      aria-current={current === 'kerdes' ? 'page' : undefined}>
      <MessageCircleQuestion size={20} aria-hidden="true" /><span>Segítség kérése</span>
    </a>
  );
}

function DrawerAdmin({ close }) {
  const { profile } = useAccount();
  return profile?.is_admin ? <a href={href('admin')} onClick={close}>Admin</a> : null;
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
          <AdminLink current={current} />
          <TicketLink current={current} />
          <AccountButton />
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
            <a href={href('ujdonsagok')} onClick={() => setDrawer(false)}>Újdonságok</a>
            {accountsEnabled && <a href={href('kerdes')} onClick={() => setDrawer(false)}>Segítség kérése</a>}
            <DrawerAdmin close={() => setDrawer(false)} />
          </nav>
        </div>
      )}
      <main id="main" tabIndex={-1} className={calm ? 'calm' : ''}>{children}</main>
      <footer className="foot"><div className="wrap"><p>{LEGAL}</p>
        <p className="ver links"><a href={href('ujdonsagok')}>Újdonságok</a>{accountsEnabled && <a href={href('adatkezeles')}>Adatkezelési tájékoztató</a>}</p>
        <p className="ver">Verzió: {__VERSION__}</p></div></footer>
      <LegalBanner />
      <FeedbackPrompt />
      <SignInPrompt />
    </>
  );
}
