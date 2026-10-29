import { addDays, today } from './plan.js';
import { load, save } from './storage.js';

export const TYPES = {
  'igaz-hamis': 'Igaz–hamis',
  feleletvalasztos: 'Feleletválasztós',
  'rovid-valasz': 'Rövid válasz',
  parositas: 'Párosítás',
  abra: 'Ábrás',
  szamolas: 'Számolás',
  tobbszoros: 'Többszörös választás',
  relacio: 'Relációanalízis',
  kifejtos: 'Kifejtős',
};

// Relációanalízis: two statements joined by "MERT"; the answer is one of these letters.
export const RELACIO = {
  A: 'Mindkét állítás igaz, és van köztük ok-okozati összefüggés.',
  B: 'Mindkét állítás igaz, de nincs köztük összefüggés.',
  C: 'Az első állítás igaz, a második hamis.',
  D: 'Az első állítás hamis, a második igaz.',
  E: 'Mindkét állítás hamis.',
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

// One typo (a letter added, missing or changed) in a word of 5+ letters, not in its first 4 letters,
// so "makro" never passes for "mikro"; two swapped letters count as one typo.
const near = (a, b) => {
  if (a.length < 5 || a.slice(0, 4) !== b.slice(0, 4) || Math.abs(a.length - b.length) > 1) return false;
  const k = [...a].findIndex((c, i) => c !== b[i]);
  if (a.length === b.length && a[k] === b[k + 1] && a[k + 1] === b[k] && a.slice(k + 2) === b.slice(k + 2)) return true;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
};
// Hungarian endings: "mikroökonómiát" still matches "mikroökonómia".
const stem = (w) => (w.length > 5 ? w.slice(0, -2) : w);
// Same words as an accepted answer in any order, with endings or one typo allowed; articles are ignored, and no
// extra words, so "határtermék-bevétel" never passes for "határtermék".
const same = (w, a) => w.startsWith(stem(a)) || near(w, a);
const covers = (reply, answer) => {
  const r = reply.split(' ').filter((w) => w.length > 2), a = answer.split(' ').filter((w) => w.length > 2);
  return a.length > 0 && a.every((x) => r.some((w) => same(w, x))) && r.every((w) => a.some((x) => same(w, x)));
};

// Typed numbers: decimal comma or point, spaces as thousands separators, a/b fractions; null if not a number.
export function parseNumber(s, fractions = true) {
  const t = String(s).replace(/[\s\u00a0]/g, '').replace(/−/g, '-').replace(',', '.');
  const m = t.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (!m || (m[2] && !fractions)) return null;
  return m[2] ? +m[1] / +m[2] : +m[1];
}

// One field of a calculation task. accept: int = exact whole number; dec = decimal within 0.001; frac = also a
// fraction; round = decimal with 2+ decimals that equals the answer rounded to as many decimals (or within 0.001);
// text = typed text (e.g. an account name in Számvitel) equal to the answer or one of `alts`, case and accents ignored.
export function fieldCorrect(field, text) {
  if (field.accept === 'text') {
    const r = normalize(text ?? '');
    return !!r && [field.answer, ...(field.alts ?? [])].some((a) => normalize(String(a)) === r);
  }
  const want = parseNumber(field.answer);
  const got = parseNumber(text ?? '', field.accept === 'frac');
  if (got === null) return false;
  if (field.accept === 'int') return /^-?\d+$/.test(String(text).replace(/[\s\u00a0]/g, '')) && got === want;
  const decimals = (String(text).replace(',', '.').split('.')[1] ?? '').length;
  if (field.accept === 'round' && decimals >= 2 && Math.abs(got - +want.toFixed(decimals)) < 1e-9) return true;
  return Math.abs(got - want) <= 0.001 + 1e-9;
}

export function isCorrect(q, response) {
  if (response == null) return false;
  // No partial credit: every field must be right.
  if (q.type === 'szamolas') return q.fields.every((f) => fieldCorrect(f, response[f.label]));
  if (q.type === 'rovid-valasz') {
    const r = normalize(response);
    // Longer model answers also accept a reply that contains one of the key phrases.
    return q.answer.some((a) => normalize(a) === r || (a.split(' ').length <= 4 && covers(r, normalize(a))))
      || (q.keywords ?? []).some((k) => r.includes(normalize(k)));
  }
  if (q.type === 'parositas') return q.answer.every(([l, r]) => response[l] === r);
  // Többszörös választás: the response marks every statement true or false; all must be right.
  if (q.type === 'tobbszoros') return q.statements.every((st, k) => response[k] === st.answer);
  // Kifejtős: the student ticks the model answer's points they covered (self-check); right when all are ticked.
  if (q.type === 'kifejtos') return response.got?.length === q.answer.length;
  return response === q.answer;
}

// Points a response earns in a mock ZH. Többszörös választás: points shared by the statements (the ZH scores
// each statement); kifejtős: share of the ticked points, rounded down to half points; else all or nothing.
export function score(q, response) {
  const points = q.points ?? 1;
  if (response == null) return 0;
  const part = (good, all) => Math.floor((points * good) / all * 2) / 2;
  if (q.type === 'tobbszoros') return part(q.statements.filter((st, k) => response[k] === st.answer).length, q.statements.length);
  if (q.type === 'kifejtos') return part(response.got?.length ?? 0, q.answer.length);
  return isCorrect(q, response) ? points : 0;
}

export function correctText(q) {
  if (isTrueFalse(q)) return q.answer ? 'Igaz' : 'Hamis';
  if (q.type === 'rovid-valasz') return q.answer[0];
  if (q.type === 'parositas') return q.answer.map(([l, r]) => `${l}: ${r}`).join('\n');
  if (q.type === 'szamolas') return q.fields.map((f) => `${f.label} ${f.answer}`).join('\n');
  if (q.type === 'tobbszoros') return q.statements.map((st) => `${st.answer ? 'Igaz' : 'Hamis'}: ${st.text}`).join('\n');
  if (q.type === 'relacio') return `${q.answer}) ${RELACIO[q.answer]}`;
  if (q.type === 'kifejtos') return q.answer.map((a) => `• ${a}`).join('\n');
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
  schedule(q.id, correct);
}

// "Más szavakkal, de ugyanezt írtam": the student's own answer was right after all, so undo the miss.
export function forgive(q) {
  save('answers', { ...load('answers', {}), [q.id]: true });
  for (const key of ['wrong', 'review']) { const m = load(key, {}); delete m[q.id]; save(key, m); }
}

// Ismétlés (spaced repetition): a missed question is due again after 1, then 3, then 7 days;
// a right answer on a due question moves it to the next step, a miss starts it over.
export const STEPS = [1, 3, 7];
export function schedule(id, correct, now = today()) {
  const review = load('review', {});
  const item = review[id];
  if (!correct) review[id] = { step: 0, due: addDays(now, STEPS[0]) };
  else if (!item || item.due > now) return;
  else if (item.step + 1 >= STEPS.length) delete review[id];
  else review[id] = { step: item.step + 1, due: addDays(now, STEPS[item.step + 1]) };
  save('review', review);
}
export const due = (qs, now = today()) => { const r = load('review', {}); return qs.filter((q) => r[q.id]?.due <= now); };

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

// The lecturer: many figure questions, so figures get a bigger share than in the practice ZH.
export const MOCK_MIX = { 'igaz-hamis': 13, feleletvalasztos: 4, 'rovid-valasz': 3, abra: 5 };

// ZH-level: the real practice-ZH questions and the hard ones written to match them.
export const zhLevel = (q) => q.official || q.difficulty === 3;

// Mock ZH: the real ZH's type mix, each type spread over the chapters in proportion to the pool;
// ZH-level questions only, unless a type has too few of them.
export function drawMock(questions, mock) {
  const mix = mock?.mix ?? MOCK_MIX;
  // Calculation ZH (Matematika): a fixed number of tasks from every task type.
  if (mock?.perChapter) {
    const byChapter = groupBy(questions);
    return Object.keys(byChapter).sort((a, b) => a - b).flatMap((c) => shuffle(byChapter[c]).slice(0, mock.perChapter));
  }
  const picked = [];
  for (const [type, quota] of Object.entries(mix)) {
    const all = questions.filter((q) => q.type === type);
    const hard = all.filter(zhLevel);
    const pool = hard.length >= quota ? hard : all;
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

// Typed definitions: which key concepts of the glossary entry the reply mentions. A concept is a list of
// interchangeable wordings; one wording counts when each of its words appears in the reply (endings, typos allowed).
// shortcut: words of 1–3 letters (like "ár") match any reply word starting with them, so "áru" also counts as "ár";
// add whole-word rules if students report false hits.
export function checkDefinition(card, reply) {
  const r = normalize(reply).split(' ');
  const hit = (alt) => normalize(alt).split(' ').every((x) => r.some((w) => same(w, x)));
  const found = card.concepts.map((group) => group.some(hit));
  return { found, share: found.filter(Boolean).length / found.length };
}

// Verdict from the concept share and, when the language model ran, the similarity (0–1) to the model definition.
// shortcut: thresholds are first guesses, not calibrated on real answers; tune them once answers come in.
export const definitionVerdict = (share, sim) =>
  share >= 0.75 || (sim >= 0.8 && share >= 0.5) ? 'jo' : share >= 0.4 || sim >= 0.7 ? 'reszben' : 'rossz';
