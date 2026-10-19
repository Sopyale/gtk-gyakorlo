// localStorage with an in-memory fallback, so the site works when storage is blocked.
const memory = new Map();
const PREFIX = 'gtk:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return memory.has(key) ? memory.get(key) : fallback;
  }
}

// Called after every save; the account sync listens here to push progress to the server.
export const onSave = new Set();

export function save(key, value) {
  memory.set(key, value);
  onSave.forEach((fn) => fn(key));
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* memory only */ }
}

export function clearProgress() {
  for (const k of ['answers', 'wrong', 'cards']) {
    memory.delete(k);
    try { localStorage.removeItem(PREFIX + k); } catch { /* memory only */ }
    onSave.forEach((fn) => fn(k));
  }
}
