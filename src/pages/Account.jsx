import { useState } from 'react';
import { FolderOpen, LogIn, LogOut, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { DRIVE } from './Home.jsx';
import {
  completeProfile, deleteAccount, EMAIL, NEPTUN, recordDriveClick, signIn, signInWithGoogle, signOut, signUp, useAccount,
} from '../lib/account.js';
import { href } from '../lib/route.js';

const GOOGLE = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

// One form for sign-in, sign-up and the Google users' first step; `mode` picks the fields.
function AuthForm({ mode, setMode, google }) {
  const [f, setF] = useState({ neptun: '', password: '', driveEmail: google?.email ?? '', consent: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const field = (k) => ({ value: f[k], onChange: (e) => { setError(''); setF({ ...f, [k]: k === 'neptun' ? e.target.value.toUpperCase() : e.target.value }); } });
  const isNew = mode !== 'in';

  const submit = async (e) => {
    e.preventDefault();
    const neptun = f.neptun.trim(), driveEmail = f.driveEmail.trim();
    if (!NEPTUN.test(neptun)) return setError('A Neptun-kód 6 karakter: betűk és számok.');
    if (mode !== 'google' && f.password.length < 8) return setError('A jelszó legalább 8 karakter legyen.');
    if (isNew && !EMAIL.test(driveEmail)) return setError('Adj meg egy érvényes e-mail-címet.');
    if (isNew && !f.consent) return setError('A regisztrációhoz el kell fogadnod az adatkezelést.');
    setError(''); setBusy(true);
    try {
      if (mode === 'in') await signIn({ neptun, password: f.password });
      else if (mode === 'up') await signUp({ neptun, password: f.password, driveEmail });
      else await completeProfile({ neptun, driveEmail });
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <form className="card auth" onSubmit={submit} noValidate>
      {mode !== 'google' && (
        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" className="chip" aria-pressed={mode === 'in'} aria-selected={mode === 'in'} onClick={() => setMode('in')}>Belépés</button>
          <button type="button" role="tab" className="chip" aria-pressed={mode === 'up'} aria-selected={mode === 'up'} onClick={() => setMode('up')}>Regisztráció</button>
        </div>
      )}
      <label>Neptun-kód
        <input {...field('neptun')} autoComplete="username" maxLength={6} placeholder="pl. ABC123" spellCheck="false" />
      </label>
      {mode !== 'google' && (
        <label>Jelszó
          <input {...field('password')} type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={8} />
          {isNew && <small>Legalább 8 karakter. Ne a Neptun-jelszavad legyen!</small>}
        </label>
      )}
      {isNew && (
        <label>E-mail-cím, amivel a Drive-hoz hozzáférést kérsz
          <input {...field('driveEmail')} type="email" autoComplete="email" placeholder="nev@gmail.com" />
        </label>
      )}
      {isNew && (
        <label className="auth-consent">
          <input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
          <span>Elolvastam az <a href={href('adatkezeles')}>adatkezelési tájékoztatót</a>, és hozzájárulok, hogy a Neptun-kódomat, az e-mail-címemet és a haladásomat tárolja az oldal.</span>
        </label>
      )}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="btn pri" disabled={busy}>
        {mode === 'in' ? <LogIn size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
        {busy ? 'Egy pillanat…' : mode === 'in' ? 'Belépés' : mode === 'up' ? 'Regisztráció' : 'Mentés'}
      </button>
      {mode !== 'google' && (
        <>
          <p className="auth-or"><span>vagy</span></p>
          <button type="button" className="btn sec" onClick={() => signInWithGoogle().catch((err) => setError(err.message))}>
            {GOOGLE}Belépés Google-fiókkal
          </button>
        </>
      )}
    </form>
  );
}

export default function Account({ params }) {
  const { ready, user, profile } = useAccount();
  const [mode, setMode] = useState('in');
  const fromDrive = params.get('drive') === '1';

  if (!ready) return <div className="wrap page narrow"><div className="skeleton" aria-label="Betöltés" /></div>;

  if (!user) {
    return (
      <div className="wrap page narrow">
        <h1 className="page-title">{mode === 'in' ? 'Belépés' : 'Regisztráció'}</h1>
        <p className="lede">{fromDrive
          ? 'A Drive-mappához Neptun-kóddal regisztrált hallgatók kérhetnek hozzáférést. Lépj be, vagy regisztrálj.'
          : 'Fiókkal a haladásod minden eszközödön megmarad. Gyakorolni fiók nélkül is lehet.'}</p>
        <AuthForm mode={mode} setMode={setMode} />
      </div>
    );
  }

  if (!profile?.neptun) {
    return (
      <div className="wrap page narrow">
        <h1 className="page-title">Még egy lépés</h1>
        <p className="lede">Add meg a Neptun-kódodat. Ez lesz a felhasználóneved, és később nem módosítható.</p>
        <AuthForm mode="google" google={user} />
      </div>
    );
  }

  return (
    <div className="wrap page narrow">
      <h1 className="page-title">{profile.neptun}</h1>
      <p className="lede">A haladásod a fiókodba mentődik, így minden eszközödön ugyanott folytathatod.</p>
      <dl className="card account">
        <div><dt>Belépés</dt><dd>{profile.login_method === 'google' ? `Google-fiók (${user.email})` : 'Neptun-kód és jelszó'}</dd></div>
        <div><dt>Drive-hoz használt e-mail</dt><dd>{profile.drive_email}</dd></div>
        <div><dt>Regisztráció</dt><dd>{new Date(profile.created_at).toLocaleDateString('hu-HU')}</dd></div>
      </dl>
      <div className="cta">
        {fromDrive && <a className="btn pri" href={DRIVE} target="_blank" rel="noreferrer" onClick={recordDriveClick}><FolderOpen size={18} aria-hidden="true" />Tananyagok (Google Drive)</a>}
        {profile.is_admin && <a className="btn sec" href={href('admin')}><ShieldCheck size={18} aria-hidden="true" />Admin</a>}
        <button className="btn sec" onClick={signOut}><LogOut size={18} aria-hidden="true" />Kijelentkezés</button>
      </div>
      <button className="btn ghost" onClick={() => {
        if (confirm('Biztosan törlöd a fiókodat? A Neptun-kódod, az e-mail-címed és a mentett haladásod véglegesen törlődik a szerverről.')) deleteAccount().catch((e) => alert(e.message));
      }}><Trash2 size={18} aria-hidden="true" />Fiók törlése</button>
    </div>
  );
}
