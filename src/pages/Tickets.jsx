import { useEffect, useState } from 'react';
import { CircleUserRound, Send } from 'lucide-react';
import { listTickets, sendTicket, useAccount } from '../lib/account.js';
import { href } from '../lib/route.js';

export const KINDS = { kerdes: 'Kérdés', keres: 'Kérés', hiba: 'Hibajelentés' };
export const when = (t) => new Date(t).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// Kérdés: a signed-in student writes to the owner; only the admin sees the tickets.
export default function Tickets() {
  const { ready, profile } = useAccount();
  const [kind, setKind] = useState('kerdes');
  const [message, setMessage] = useState('');
  const [mine, setMine] = useState(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const reload = () => listTickets().then(setMine, (e) => setError(e.message));

  useEffect(() => { if (profile?.neptun) reload(); }, [profile?.neptun]);

  if (!ready) return <div className="wrap page narrow"><div className="skeleton" aria-label="Betöltés" /></div>;
  if (!profile?.neptun) {
    return (
      <div className="wrap page narrow">
        <h1 className="page-title">Kérdés</h1>
        <p className="lede">Kérdést, kérést vagy hibajelentést bejelentkezve küldhetsz az oldal gazdájának.</p>
        <a className="btn pri" href={href('fiok')}><CircleUserRound size={18} aria-hidden="true" />Belépés vagy regisztráció</a>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return setError('Írd le, miben segíthetünk.');
    setError(''); setSent(false); setBusy(true);
    try { await sendTicket({ kind, message: message.trim() }); setMessage(''); setSent(true); await reload(); }
    catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <div className="wrap page narrow">
      <h1 className="page-title">Kérdés</h1>
      <p className="lede">Írj az oldal gazdájának. Csak ő látja, amit küldesz, a Neptun-kódoddal és az e-mail-címeddel együtt.</p>
      <form className="card auth" onSubmit={submit} noValidate>
        <div className="auth-tabs" role="radiogroup" aria-label="Típus">
          {Object.entries(KINDS).map(([k, l]) => (
            <button key={k} type="button" role="radio" className="chip" aria-checked={kind === k} aria-pressed={kind === k} onClick={() => setKind(k)}>{l}</button>
          ))}
        </div>
        <label>Üzenet
          <textarea value={message} maxLength={2000} rows={6} onChange={(e) => { setError(''); setSent(false); setMessage(e.target.value); }}
            placeholder="Például: a 3. fejezet egyik kérdésénél szerintem rossz a megoldás…" />
          <small>{message.length} / 2000</small>
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {sent && <p className="auth-ok" role="status">Elküldve. Köszönjük!</p>}
        <button className="btn pri" disabled={busy}><Send size={18} aria-hidden="true" />{busy ? 'Egy pillanat…' : 'Küldés'}</button>
      </form>
      {mine?.length > 0 && (
        <>
          <h2 className="tickets-title">Elküldött üzeneteid</h2>
          <ul className="tickets">
            {mine.map((t) => (
              <li key={t.id} className="card">
                <div className="ticket-head"><b>{KINDS[t.kind]}</b><span>{when(t.created_at)}</span><em className={t.done ? 'done' : ''}>{t.done ? 'Megoldva' : 'Nyitott'}</em></div>
                <p>{t.message}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
