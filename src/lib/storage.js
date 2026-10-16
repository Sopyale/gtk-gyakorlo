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

export function save(key, value) {
  memory.set(key, value);
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* memory only */ }
}

export function clearProgress() {
  for (const k of ['answers', 'wrong', 'cards']) {
    memory.delete(k);
    try { localStorage.removeItem(PREFIX + k); } catch { /* memory only */ }
  }
}
