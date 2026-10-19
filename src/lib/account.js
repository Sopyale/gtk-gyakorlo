import { useSyncExternalStore } from 'react';
import { load, onSave, save } from './storage.js';

// Supabase project. The publishable key is public by design: Row Level Security on the server
// decides what each signed-in student may read or write (see supabase/schema.sql).
const URL = 'https://dtwfwwwdvbrsmwkqigql.supabase.co';
const KEY = 'sb_publishable_wtYcQSflbEGQaLN8y0pnIg_USM3Qt7E';
export const accountsEnabled = Boolean(KEY);

export const NEPTUN = /^[A-Z0-9]{6}$/;
export const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Same rule as the database: ELTE addresses are not accepted for the Drive.
export const ELTE = /@([a-z0-9-]+\.)*elte\.hu$/i;

// "Bejelentkezve maradok": the session goes to localStorage (kept) or sessionStorage (gone when the browser closes).
const REMEMBER = 'gtk:remember';
const keep = () => localStorage.getItem(REMEMBER) !== '0';
const authStorage = {
  getItem: (k) => localStorage.getItem(k) ?? sessionStorage.getItem(k),
  setItem: (k, v) => { (keep() ? localStorage : sessionStorage).setItem(k, v); (keep() ? sessionStorage : localStorage).removeItem(k); },
  removeItem: (k) => { localStorage.removeItem(k); sessionStorage.removeItem(k); },
};
export const setRemember = (on) => localStorage.setItem(REMEMBER, on ? '1' : '0');

// The client loads on demand so the first paint does not wait for it.
let client;
const getClient = () => (client ??= import('@supabase/supabase-js').then(({ createClient }) =>
  createClient(URL, KEY, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, storage: authStorage } })));

// Account state shared by every component: { ready, user, profile }.
let state = { ready: !accountsEnabled, user: null, profile: null, recovery: false };
const subs = new Set();
const set = (patch) => { state = { ...state, ...patch }; subs.forEach((fn) => fn()); };
export const useAccount = () => useSyncExternalStore((fn) => (subs.add(fn), () => subs.delete(fn)), () => state);

const SYNCED = (k) => k === 'answers' || k === 'wrong' || k === 'cards' || k.startsWith('plan:');
const localProgress = () => {
  const out = {};
  for (const k of ['answers', 'wrong', 'cards']) out[k] = load(k, {});
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i).replace(/^gtk:/, '');
      if (k.startsWith('plan:')) out[k] = load(k, null);
    }
  } catch { /* storage blocked: answers, wrong and cards are still in memory */ }
  return out;
};

// Merge on sign-in: this device's entries win over the server's for the same question.
export function mergeProgress(remote, local) {
  const out = {};
  for (const k of new Set([...Object.keys(remote), ...Object.keys(local)])) {
    out[k] = k.startsWith('plan:') ? (local[k] ?? remote[k]) : { ...remote[k], ...local[k] };
  }
  return out;
}

let pushTimer, syncing = false;
async function push() {
  if (!state.profile) return;
  const sb = await getClient();
  const progress = localProgress();
  const { error } = await sb.from('profiles').update({ progress, last_seen_at: new Date().toISOString() }).eq('id', state.user.id);
  if (!error) set({ profile: { ...state.profile, progress } });
}
onSave.add((key) => {
  if (syncing || !state.profile || !SYNCED(key)) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 1500);
});

async function loadProfile(user) {
  if (!user) return set({ ready: true, user: null, profile: null });
  const sb = await getClient();
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (profile?.neptun) {
    syncing = true;
    for (const [k, v] of Object.entries(mergeProgress(profile.progress ?? {}, localProgress()))) if (v != null) save(k, v);
    syncing = false;
  }
  set({ ready: true, user, profile });
  // A first Google sign-in lands on the home page; the Neptun code is still missing.
  if (!profile?.neptun && !location.hash.startsWith('#/fiok')) location.hash = '#/fiok';
  if (profile?.neptun) push();
}

export async function startAccounts() {
  if (!accountsEnabled) return;
  const sb = await getClient();
  // PKCE returns ?code=… next to the hash route; drop it once the session is in.
  sb.auth.onAuthStateChange((event, session) => {
    if (location.search.includes('code=')) history.replaceState(null, '', location.pathname + location.hash);
    if (event === 'PASSWORD_RECOVERY') { set({ recovery: true }); location.hash = '#/fiok'; }
    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') setTimeout(() => loadProfile(session?.user ?? null));
  });
}

// Supabase messages are English and technical; students get a short Hungarian reason instead.
const friendly = (error) => {
  const m = error?.message ?? '';
  if (/already registered|already exists|duplicate key|database error saving new user/i.test(m)) return 'Ezzel a Neptun-kóddal vagy e-mail-címmel már van fiók.';
  if (/invalid login credentials/i.test(m)) return 'Hibás Neptun-kód vagy jelszó.';
  if (/not confirmed/i.test(m)) return 'A fiókot még meg kell erősíteni. Szólj az oldal gazdájának.';
  if (/password/i.test(m)) return 'A jelszó legalább 8 karakter legyen.';
  if (/too many tickets/i.test(m)) return 'Egy órán belül legfeljebb 5 üzenetet küldhetsz.';
  if (/rate limit|too many/i.test(m)) return 'Túl sok próbálkozás. Várj pár percet.';
  return 'Nem sikerült. Próbáld újra később.';
};
const run = async (fn) => {
  const { error } = await fn(await getClient());
  if (error) throw new Error(friendly(error));
};

export const signUp = ({ neptun, password, email }) => run((sb) => sb.auth.signUp({
  email, password, options: { data: { neptun, consent: 'true' } },
}));

// The database hands back the account's e-mail only for the right password (see login_email in schema.sql).
export async function signIn({ neptun, password }) {
  const sb = await getClient();
  const { data: email, error } = await sb.rpc('login_email', { p_neptun: neptun, p_password: password });
  if (error) throw new Error(friendly(error));
  if (!email) throw new Error('Hibás Neptun-kód vagy jelszó.');
  await run(() => sb.auth.signInWithPassword({ email, password }));
}

export const sendPasswordReset = (email) => run((sb) => sb.auth.resetPasswordForEmail(email, {
  redirectTo: location.origin + import.meta.env.BASE_URL,
}));
export async function setNewPassword(password) {
  await run((sb) => sb.auth.updateUser({ password }));
  set({ recovery: false });
}
export const signInWithGoogle = () => run((sb) => sb.auth.signInWithOAuth({
  provider: 'google', options: { redirectTo: location.origin + import.meta.env.BASE_URL },
}));
export const signOut = () => run((sb) => sb.auth.signOut());

// Google users pick their Neptun code after their first sign-in.
export async function completeProfile({ neptun }) {
  await run((sb) => sb.from('profiles').update({ neptun, consent_at: new Date().toISOString() }).eq('id', state.user.id));
  await loadProfile(state.user);
}

export async function deleteAccount() {
  await run((sb) => sb.rpc('delete_me'));
  await run((sb) => sb.auth.signOut());
}

export async function recordDriveClick() {
  if (!state.profile) return;
  const sb = await getClient();
  await sb.from('profiles').update({ drive_clicks: state.profile.drive_clicks + 1, drive_clicked_at: new Date().toISOString() }).eq('id', state.user.id);
}

// Admin view: every profile; RLS returns only the caller's own row to anyone who is not admin.
export async function listProfiles() {
  const sb = await getClient();
  const { data, error } = await sb.from('profiles').select('id, neptun, drive_email, login_method, created_at, last_seen_at, drive_clicks, drive_clicked_at, progress').order('created_at', { ascending: false });
  if (error) throw new Error(friendly(error));
  return data;
}

// Tickets: a signed-in student sends a question or request; RLS shows each student only their own, the admin all.
export async function sendTicket({ kind, message }) {
  await run((sb) => sb.from('tickets').insert({ kind, message }));
}
export async function listTickets() {
  const sb = await getClient();
  const { data, error } = await sb.from('tickets')
    .select('id, user_id, kind, message, done, created_at, ticket_replies(id, from_admin, message, created_at)')
    .order('created_at', { ascending: false })
    .order('created_at', { referencedTable: 'ticket_replies', ascending: true });
  if (error) throw new Error(friendly(error));
  return data;
}
// The server records whether the admin or the student wrote it (see supabase/ticket-replies.sql).
export const sendReply = (ticketId, message) => run((sb) => sb.from('ticket_replies').insert({ ticket_id: ticketId, message }));
export const setTicketDone = (id, done) => run((sb) => sb.from('tickets').update({ done }).eq('id', id));
