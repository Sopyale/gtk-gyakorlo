import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { accountFeedbackDue, accountsEnabled, deviceFeedbackDue, sendFeedback, useAccount } from '../lib/account.js';

const RATINGS = ['Rossz', 'Gyenge', 'Közepes', 'Jó', 'Nagyon jó'];
let checked = false; // once per visit (page load)

// Mandatory feedback every 3 days (see feedbackDue): the dialog cannot be closed until it is sent.
export default function FeedbackPrompt() {
  const { ready, user, profile } = useAccount();
  const ref = useRef(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const done = useRef(false);
  const finish = () => { done.current = true; ref.current?.close(); };

  useEffect(() => {
    // A first Google sign-in has no Neptun code yet; wait until the profile is complete.
    if (!accountsEnabled || !ready || checked || (user && !profile?.neptun)) return;
    checked = true;
    if (profile?.is_admin) return;
    (profile ? accountFeedbackDue() : Promise.resolve(deviceFeedbackDue())).then((due) => due && ref.current?.showModal());
  }, [ready, user, profile]);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Válaszd ki, mennyire vagy elégedett.');
    if (!message.trim()) return setError('Írj pár szót is.');
    setError(''); setBusy(true);
    try { await sendFeedback({ rating, message: message.trim() }); finish(); }
    catch (err) { setError(err.message); setFailed(true); }
    setBusy(false);
  };

  return (
    <dialog ref={ref} className="card signin-prompt feedback-prompt" aria-labelledby="feedback-title"
      onCancel={(e) => e.preventDefault()} onClose={() => !done.current && ref.current?.showModal()}>
      <h2 id="feedback-title">Visszajelzés</h2>
      <p>Sokat segítesz vele, hogy jobb legyen az oldal. <strong>A válaszadás kötelező</strong>, utána folytathatod.</p>
      <form className="auth feedback-form" onSubmit={submit} noValidate>
        <fieldset className="rating">
          <legend>Mennyire vagy elégedett az oldallal?</legend>
          <div className="auth-tabs">
            {RATINGS.map((l, i) => (
              <button key={l} type="button" className="chip" aria-pressed={rating === i + 1} aria-label={`${i + 1}: ${l}`} title={l}
                onClick={() => { setError(''); setRating(i + 1); }}>{i + 1}</button>
            ))}
          </div>
          <small>{rating ? RATINGS[rating - 1] : '1 = rossz, 5 = nagyon jó'}</small>
        </fieldset>
        <label>Mi tetszik, mi hiányzik, mit javítanál?
          <textarea value={message} maxLength={2000} rows={4} required
            onChange={(e) => { setError(''); setMessage(e.target.value); }} placeholder="Például: több ábrás kérdést szeretnék…" />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn pri" disabled={busy}><Send size={18} aria-hidden="true" />{busy ? 'Egy pillanat…' : 'Küldés és tovább'}</button>
        {/* A server problem must not lock anyone out: after a failed send they may go on. */}
        {failed && <button type="button" className="btn ghost" onClick={finish}>Most nem sikerült, tovább</button>}
      </form>
    </dialog>
  );
}
