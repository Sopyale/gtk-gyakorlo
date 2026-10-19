import { useState } from 'react';
import { FolderOpen, KeyRound, LogIn, LogOut, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { DRIVE } from './Home.jsx';
import {
  completeProfile, deleteAccount, ELTE, EMAIL, NEPTUN, recordDriveClick, sendPasswordReset, setNewPassword, setRemember,
  signIn, signInWithGoogle, signOut, signUp, useAccount,
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

// One form for every account step; `mode` picks the fields:
// in = sign in, up = register, reset = ask for a reset e-mail, newpass = set a new password, google = Google user's Neptun code.
function AuthForm({ mode, setMode }) {
  const [f, setF] = useState({ neptun: '', password: '', email: '', consent: false, remember: true });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const field = (k) => ({ value: f[k], onChange: (e) => { setError(''); setF({ ...f, [k]: k === 'neptun' ? e.target.value.toUpperCase() : e.target.value }); } });
  const has = { neptun: mode === 'in' || mode === 'up' || mode === 'google', password: mode === 'in' || mode === 'up' || mode === 'newpass', email: mode === 'up' || mode === 'reset', consent: mode === 'up' || mode === 'google' };

  const submit = async (e) => {
    e.preventDefault();
    const neptun = f.neptun.trim(), email = f.email.trim();
    if (has.neptun && !NEPTUN.test(neptun)) return setError('A Neptun-kód 6 karakter: betűk és számok.');
    if (has.password && f.password.length < 8) return setError('A jelszó legalább 8 karakter legyen.');
    if (has.email && !EMAIL.test(email)) return setError('Adj meg egy érvényes e-mail-címet.');
    if (mode === 'up' && ELTE.test(email)) return setError('ELTE-s e-mail-címet ne adj meg. Használd a saját, például gmailes címedet.');
    if (has.consent && !f.consent) return setError('A regisztrációhoz el kell fogadnod az adatkezelést.');
    setError(''); setBusy(true);
    if (mode === 'in' || mode === 'up') setRemember(f.remember);
    try {
      if (mode === 'in') await signIn({ neptun, password: f.password });
      else if (mode === 'up') await signUp({ neptun, password: f.password, email });
      else if (mode === 'reset') { await sendPasswordReset(email); setSent(true); }
      else if (mode === 'newpass') await setNewPassword(f.password);
      else await completeProfile({ neptun });
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  const label = { in: 'Belépés', up: 'Regisztráció', reset: 'Visszaállító e-mail küldése', newpass: 'Új jelszó mentése', google: 'Mentés' }[mode];
  return (
    <form className="card auth" onSubmit={submit} noValidate>
      {(mode === 'in' || mode === 'up') && (
        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" className="chip" aria-pressed={mode === 'in'} aria-selected={mode === 'in'} onClick={() => setMode('in')}>Belépés</button>
          <button type="button" role="tab" className="chip" aria-pressed={mode === 'up'} aria-selected={mode === 'up'} onClick={() => setMode('up')}>Regisztráció</button>
        </div>
      )}
      {has.neptun && (
        <label>Neptun-kód
          <input {...field('neptun')} autoComplete="username" maxLength={6} placeholder="pl. ABC123" spellCheck="false" />
        </label>
      )}
      {has.password && (
        <label>{mode === 'newpass' ? 'Új jelszó' : 'Jelszó'}
          <input {...field('password')} type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={8} />
          {mode !== 'in' && <small>Legalább 8 karakter. Ne a Neptun-jelszavad legyen!</small>}
        </label>
      )}
      {has.email && (
        <label>E-mail-cím
          <input {...field('email')} type="email" autoComplete="email" placeholder="nev@gmail.com" />
          {mode === 'up' && <small>Bármilyen saját címed jó, de <strong>ELTE-s ne legyen</strong>. Erre kapod a jelszó-visszaállító levelet, és ezzel kérsz hozzáférést a Drive-hoz. Egy e-mail-cím csak egy Neptun-kódhoz tartozhat.</small>}
          {mode === 'reset' && <small>Azt a címet add meg, amivel regisztráltál.</small>}
        </label>
      )}
      {has.consent && (
        <label className="auth-consent">
          <input type="checkbox" checked={f.consent} onChange={(e) => { setError(''); setF({ ...f, consent: e.target.checked }); }} />
          <span>Elolvastam az <a href={href('adatkezeles')}>adatkezelési tájékoztatót</a>, és hozzájárulok, hogy az oldal tárolja a Neptun-kódomat, az e-mail-címemet és a haladásomat.</span>
        </label>
      )}
      {(mode === 'in' || mode === 'up') && (
        <label className="auth-consent">
          <input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} />
          <span>Bejelentkezve maradok ezen az eszközön</span>
        </label>
      )}
      {error && <p className="auth-error" role="alert">{error}</p>}
      {sent && <p className="auth-ok" role="status">Ha van fiók ezzel a címmel, elküldtük a levelet. Nézd meg a spam mappát is.</p>}
      <button className="btn pri" disabled={busy}>
        {mode === 'in' ? <LogIn size={18} aria-hidden="true" /> : mode === 'up' ? <UserPlus size={18} aria-hidden="true" /> : <KeyRound size={18} aria-hidden="true" />}
        {busy ? 'Egy pillanat…' : label}
      </button>
      {mode === 'in' && <button type="button" className="auth-link" onClick={() => setMode('reset')}>Elfelejtetted a jelszavad?</button>}
      {mode === 'reset' && <button type="button" className="auth-link" onClick={() => setMode('in')}>Vissza a belépéshez</button>}
      {(mode === 'in' || mode === 'up') && (
        <>
          <p className="auth-or"><span>vagy</span></p>
          <button type="button" className="btn sec" onClick={() => { setRemember(f.remember); signInWithGoogle().catch((err) => setError(err.message)); }}>
            {GOOGLE}Belépés Google-fiókkal
          </button>
        </>
      )}
    </form>
  );
}

export default function Account({ params }) {
  const { ready, user, profile, recovery } = useAccount();
  const [mode, setMode] = useState('in');
  const fromDrive = params.get('drive') === '1';

  if (!ready) return <div className="wrap page narrow"><div className="skeleton" aria-label="Betöltés" /></div>;

  if (recovery) {
    return (
      <div className="wrap page narrow">
        <h1 className="page-title">Új jelszó</h1>
        <p className="lede">Add meg az új jelszavadat. Utána ezzel lépsz be a Neptun-kódoddal.</p>
        <AuthForm mode="newpass" setMode={setMode} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wrap page narrow">
        <h1 className="page-title">{{ in: 'Belépés', up: 'Regisztráció', reset: 'Elfelejtett jelszó' }[mode]}</h1>
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
        <AuthForm mode="google" setMode={setMode} />
      </div>
    );
  }

  return (
    <div className="wrap page narrow">
      <h1 className="page-title">{profile.neptun}</h1>
      <p className="lede">A haladásod a fiókodba mentődik, így minden eszközödön ugyanott folytathatod.</p>
      <dl className="card account">
        <div><dt>Belépés</dt><dd>{profile.login_method === 'google' ? 'Google-fiók' : 'Neptun-kód és jelszó'}</dd></div>
        <div><dt>E-mail-cím (ezzel kérsz hozzáférést a Drive-hoz)</dt><dd>{profile.drive_email}</dd></div>
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
