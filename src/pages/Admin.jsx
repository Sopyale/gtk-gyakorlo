import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { listFeedback, listProfiles, listTickets, setTicketDone, useAccount } from '../lib/account.js';
import { getQuestions } from '../lib/data.js';
import { KINDS, Replies } from './Tickets.jsx';

const when = (t) => (t ? new Date(t).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–');
const DAY = 864e5;

// Admin: who registered, with which e-mail, whether they opened the Drive link, and how far they got.
export default function Admin() {
  const { ready, profile } = useAccount();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [tickets, setTickets] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [tab, setTab] = useState('kerdesek');
  const total = getQuestions('kozgazdasagtan').length;

  useEffect(() => {
    if (!profile?.is_admin) return;
    listProfiles().then(setRows, (e) => setError(e.message));
    listTickets().then(setTickets, (e) => setError(e.message));
    // Before supabase/feedback.sql is run there is no table: the tab just says so.
    listFeedback().then(setFeedback, () => setFeedback([]));
  }, [profile?.is_admin]);

  const shown = useMemo(() => (rows ?? []).filter((r) =>
    `${r.neptun} ${r.drive_email}`.toLowerCase().includes(q.trim().toLowerCase())), [rows, q]);

  if (!ready) return <div className="wrap page"><div className="skeleton" aria-label="Betöltés" /></div>;
  if (!profile?.is_admin) return <div className="wrap page narrow"><h1 className="page-title">Admin</h1><p className="lede">Ezt az oldalt csak az üzemeltető látja.</p></div>;

  const done = (r) => Object.values(r.progress?.answers ?? {}).filter(Boolean).length;
  const now = Date.now();
  const stats = rows && [
    [rows.length, 'regisztrált hallgató'],
    [tickets?.filter((t) => !t.done).length ?? 0, 'nyitott kérdés'],
    [rows.filter((r) => now - Date.parse(r.last_seen_at) < 7 * DAY).length, 'aktív az elmúlt 7 napban'],
    [rows.filter((r) => r.drive_clicks > 0).length, 'nyitotta meg a Drive-ot'],
    [rows.length ? Math.round(rows.reduce((s, r) => s + done(r), 0) / rows.length) : 0, `helyes válasz átlagosan (${total}-ból)`],
  ];

  return (
    <div className="wrap page">
      <h1 className="page-title">Admin</h1>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {!rows && !error && <div className="skeleton" aria-label="Betöltés" />}
      {stats && (
        <>
          <div className="bento admin-stats">{stats.map(([n, l]) => <div key={l} className="card stat"><b>{n}</b><span>{l}</span></div>)}</div>
          <div className="auth-tabs admin-tabs" role="tablist" aria-label="Beérkezett">
            {[['kerdesek', 'Kérdések', tickets?.length], ['visszajelzesek', 'Visszajelzések', feedback?.length]].map(([k, l, n]) => (
              <button key={k} role="tab" className="chip" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}{n ? ` (${n})` : ''}</button>
            ))}
          </div>
          {tab === 'kerdesek' ? (
            <>
            {tickets?.length ? (
              <ul className="tickets">
                {tickets.map((t) => {
                  const from = rows.find((r) => r.id === t.user_id);
                  const toggle = () => setTicketDone(t.id, !t.done).then(
                    () => setTickets(tickets.map((x) => (x.id === t.id ? { ...x, done: !t.done } : x))), (e) => setError(e.message));
                  return (
                    <li key={t.id} className={`card ${t.done ? 'is-done' : ''}`}>
                      <div className="ticket-head"><b>{from?.neptun ?? '?'}</b><span>{from?.drive_email}</span><span>{KINDS[t.kind]}, {when(t.created_at)}</span></div>
                      <p>{t.message}</p>
                      <Replies ticket={t} admin onSent={() => listTickets().then(setTickets)} />
                      <button className="chip" aria-pressed={t.done} onClick={toggle}><Check size={16} aria-hidden="true" />{t.done ? 'Megoldva' : 'Megoldva?'}</button>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="lede">Még nem jött kérdés.</p>}
            </>
          ) : feedback?.length ? (
            <ul className="tickets">
              {feedback.map((f) => {
                const from = f.user_id && rows.find((r) => r.id === f.user_id);
                return (
                  <li key={f.id} className="card">
                    <div className="ticket-head"><b>{from?.neptun ?? 'Nem regisztrált'}</b><span>{from?.drive_email ?? `eszköz ${f.device_id.slice(0, 8)}`}</span>
                      <span><span className="stars" aria-label={`${f.rating} az 5-ből`}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>, {when(f.created_at)}</span></div>
                    <p>{f.message}</p>
                  </li>
                );
              })}
            </ul>
          ) : <p className="lede">Még nem jött visszajelzés.</p>}
          <h2 className="tickets-title">Felhasználók</h2>
          <label className="admin-search">Keresés Neptun-kódra vagy e-mailre
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="pl. gmail.com" spellCheck="false" />
          </label>
          <div className="admin-table" role="region" aria-label="Felhasználók" tabIndex={0}>
            <table>
              <thead><tr><th>Neptun</th><th>Drive-e-mail</th><th>Belépés</th><th>Regisztrált</th><th>Utoljára</th><th>Drive</th><th>Haladás</th></tr></thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.neptun ?? r.created_at}>
                    <td><b>{r.neptun ?? '(még nincs)'}</b></td>
                    <td>{r.drive_email ?? '–'}</td>
                    <td>{r.login_method === 'google' ? 'Google' : 'Neptun'}</td>
                    <td>{when(r.created_at)}</td>
                    <td>{when(r.last_seen_at)}</td>
                    <td>{r.drive_clicks ? `${r.drive_clicks}×, ${when(r.drive_clicked_at)}` : '–'}</td>
                    <td><span className="admin-bar"><i style={{ width: `${(done(r) / total) * 100}%` }} /></span>{done(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
