import { useEffect, useState } from 'react';
import { Bell, Download, X } from 'lucide-react';
import { load, save } from '../lib/storage.js';

let deferred = null; // Chrome/Edge/Android: the browser's own install prompt, kept for the button
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });

const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const canNotify = typeof Notification !== 'undefined';

// ZH-emlékeztető: with permission, the day before and on the day of a ZH a notification comes when the site is opened.
// shortcut: no background push (needs a server with VAPID keys and a scheduled sender); add it with the push ideas.
export function remindZh(exam, left) {
  if (!canNotify || Notification.permission !== 'granted' || left > 1) return;
  const key = `${exam.path}:${exam.date}:${left}`;
  if (load('notified', '') === key) return;
  save('notified', key);
  const body = `${left ? 'Holnap' : 'Ma'} lesz: ${exam.title}. Egy gyors ismétlés még belefér.`;
  navigator.serviceWorker?.ready.then((r) => r.showNotification('ZH-emlékeztető', { body, icon: 'icon-192.png' }))
    .catch(() => new Notification('ZH-emlékeztető', { body }));
}

// "Telepítsd az oldalt": how to add the site to the home screen and turn on the ZH reminder; hidden once done or closed.
export default function InstallCard() {
  const [hidden, setHidden] = useState(() => load('installHidden', false));
  const [perm, setPerm] = useState(canNotify ? Notification.permission : 'denied');
  const [, refresh] = useState(0);
  useEffect(() => { const f = () => refresh((n) => n + 1); addEventListener('beforeinstallprompt', f); return () => removeEventListener('beforeinstallprompt', f); }, []);
  if (hidden || (installed() && perm !== 'default')) return null;
  const ios = /iphone|ipad/i.test(navigator.userAgent);
  return (
    <section className="wrap install" aria-labelledby="install-h">
      <div className="card install-card">
        <button className="icon-btn close" aria-label="Bezárás" onClick={() => { save('installHidden', true); setHidden(true); }}><X size={18} /></button>
        <h2 id="install-h">Tedd ki a kezdőképernyőre</h2>
        <div className="install-grid">
          <div>
            <h3><Download size={18} aria-hidden="true" />Telepítés</h3>
            {installed() ? <p>Már telepítetted, így alkalmazásként nyílik meg.</p> : <ol>
              {ios ? <><li>Nyisd meg az oldalt Safariban.</li><li>Koppints a <b>Megosztás</b> gombra.</li><li>Válaszd a <b>Főképernyőhöz adás</b> lehetőséget.</li></>
                : <><li>Androidon Chrome-ban nyisd meg a <b>⋮</b> menüt.</li><li>Válaszd az <b>Alkalmazás telepítése</b> (vagy Hozzáadás a kezdőképernyőhöz) pontot.</li><li>Gépen a címsor végén lévő telepítés ikonra kattints.</li></>}
            </ol>}
            {deferred && !installed() && <button className="btn sec" onClick={() => deferred.prompt().finally(() => { deferred = null; refresh((n) => n + 1); })}><Download size={18} aria-hidden="true" />Telepítés most</button>}
          </div>
          <div>
            <h3><Bell size={18} aria-hidden="true" />ZH-emlékeztető</h3>
            <p>A ZH előtti napon és a ZH napján értesítést kapsz, amikor megnyitod az oldalt.{ios && ' iPhone-on ehhez előbb telepítsd az oldalt.'}</p>
            {perm === 'granted' ? <p className="ok-line">Be van kapcsolva.</p>
              : perm === 'denied' ? <p className="muted">{canNotify ? 'Az értesítést letiltottad. A böngésző beállításaiban, az oldal adatainál kapcsolhatod vissza.' : 'Ez a böngésző nem tud értesítést küldeni.'}</p>
              : <button className="btn sec" onClick={() => Notification.requestPermission().then(setPerm)}><Bell size={18} aria-hidden="true" />Értesítés bekapcsolása</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
