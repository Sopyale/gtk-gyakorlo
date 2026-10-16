import { load, save } from './storage.js';

export const TYPES = {
  'igaz-hamis': 'Igaz–hamis',
  feleletvalasztos: 'Feleletválasztós',
  'rovid-valasz': 'Rövid válasz',
  parositas: 'Párosítás',
  abra: 'Ábrás',
};

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Case-, accent-, punctuation- and whitespace-insensitive comparison for typed answers.
export const normalize = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();

export const isTrueFalse = (q) => typeof q.answer === 'boolean';

export function isCorrect(q, response) {
  if (response == null) return false;
  if (q.type === 'rovid-valasz') return q.answer.some((a) => normalize(a) === normalize(response));
  if (q.type === 'parositas') return q.answer.every(([l, r]) => response[l] === r);
  return response === q.answer;
}

export function correctText(q) {
  if (isTrueFalse(q)) return q.answer ? 'Igaz' : 'Hamis';
  if (q.type === 'rovid-valasz') return q.answer[0];
  if (q.type === 'parositas') return q.answer.map(([l, r]) => `${l}: ${r}`).join('\n');
  return q.answer;
}

// Records an answer; a question leaves the wrong list after two correct answers in a row.
export function record(q, correct) {
  const answers = load('answers', {});
  answers[q.id] = correct;
  save('answers', answers);
  const wrong = load('wrong', {});
  if (!correct) wrong[q.id] = 0;
  else if (q.id in wrong) {
    wrong[q.id] += 1;
    if (wrong[q.id] >= 2) delete wrong[q.id];
  }
  save('wrong', wrong);
}

// Splits `total` over keys in proportion to their weights (largest remainder).
export function apportion(weights, total) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (!sum) return {};
  const raw = Object.entries(weights).map(([k, w]) => [k, (w / sum) * total]);
  const out = Object.fromEntries(raw.map(([k, v]) => [k, Math.floor(v)]));
  let left = total - Object.values(out).reduce((a, b) => a + b, 0);
  for (const [k] of raw.sort((a, b) => (b[1] % 1) - (a[1] % 1))) {
    if (left-- <= 0) break;
    out[k] += 1;
  }
  return out;
}

export const MOCK_MIX = { 'igaz-hamis': 16, feleletvalasztos: 5, 'rovid-valasz': 3, abra: 1 };

// Mock ZH: the real ZH's type mix, each type spread over the chapters in proportion to the pool.
export function drawMock(questions) {
  const picked = [];
  for (const [type, quota] of Object.entries(MOCK_MIX)) {
    const pool = questions.filter((q) => q.type === type);
    const byChapter = Object.groupBy ? Object.groupBy(pool, (q) => q.chapter) : groupBy(pool);
    const weights = Object.fromEntries(Object.entries(byChapter).map(([c, qs]) => [c, qs.length]));
    const share = apportion(weights, Math.min(quota, pool.length));
    for (const [c, n] of Object.entries(share)) picked.push(...shuffle(byChapter[c]).slice(0, n));
  }
  return shuffle(picked);
}

function groupBy(list) {
  const out = {};
  for (const q of list) (out[q.chapter] ||= []).push(q);
  return out;
}
