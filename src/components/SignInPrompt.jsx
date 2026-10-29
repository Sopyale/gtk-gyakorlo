import { useEffect, useRef } from 'react';
import { CircleUserRound, X } from 'lucide-react';
import { accountsEnabled, deviceFeedbackDue, useAccount } from '../lib/account.js';
import { href } from '../lib/route.js';

// Pages where the prompt would only be in the way.
const QUIET = ['#/fiok', '#/admin', '#/adatkezeles', '#/kerdes'];
let shown = false; // once per visit (page load), not on every navigation

// Signed-out visitors are asked to sign in every time they open the site.
export default function SignInPrompt() {
  const { ready, user } = useAccount();
  const ref = useRef(null);

  useEffect(() => {
    if (!accountsEnabled || !ready || user || shown || QUIET.some((p) => location.hash.startsWith(p))) return;
    if (deviceFeedbackDue()) return; // the mandatory feedback comes first on this visit
    shown = true;
    ref.current?.showModal();
  }, [ready, user]);

  const close = () => ref.current?.close();
  return (
    <dialog ref={ref} className="card signin-prompt" aria-labelledby="signin-title"
      onClick={(e) => e.target === ref.current && close()}>
      <button className="icon-btn signin-x" aria-label="Bezárás" onClick={close}><X size={20} /></button>
      <h2 id="signin-title">Lépj be, hogy minden megmaradjon</h2>
      <p>Ha bejelentkezel, a haladásod minden eszközödön mentve lesz.</p>
      <p>A Drive-mappához arra az e-mail-címre kérj hozzáférést, amellyel regisztrálsz.</p>
      <div className="cta">
        <a className="btn pri" href={href('fiok')} onClick={close}><CircleUserRound size={18} aria-hidden="true" />Belépés vagy regisztráció</a>
        <button className="btn ghost" onClick={close}>Most nem</button>
      </div>
    </dialog>
  );
}
