// Validates the question bank: format per type, duplicate ids/texts, section coverage. Exits 1 on errors.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { checkDefinition, fieldCorrect, parseNumber } from '../src/lib/quiz.js';

const root = new URL('../src/data/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const subjects = read('subjects.json');
const TYPES = ['igaz-hamis', 'feleletvalasztos', 'rovid-valasz', 'parositas', 'abra', 'szamolas', 'tobbszoros', 'relacio', 'kifejtos'];
const ACCEPT = ['int', 'dec', 'frac', 'round', 'text'];
const figDir = new URL('../src/figures/', import.meta.url);
const figures = readdirSync(figDir).map((f) => readFileSync(new URL(f, figDir), 'utf8')).join('\n');
const strict = process.argv.includes('--strict'); // stage 3+: missing sections become errors
const errors = [], warnings = [];
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();

for (const s of subjects.filter((x) => x.active)) {
  const dir = new URL(`${s.id}/`, root);
  const files = readdirSync(dir).filter((f) => /^ch\d+\.json$/.test(f));
  const ids = new Map(), texts = new Map(), bySection = {}, byType = {}, byChapter = {};
  for (const f of files) {
    const chapter = +f.match(/\d+/)[0];
    for (const q of read(`${s.id}/${f}`)) {
      const at = `${f} ${q.id ?? '?'}`;
      const err = (m) => errors.push(`${at}: ${m}`);
      if (!/^[a-z][a-z0-9]*-\d+-\d{3}$/.test(q.id ?? '')) err('id must look like kg-3-017');
      else if (+q.id.split('-')[1] !== chapter) err('id chapter does not match file');
      if (ids.has(q.id)) err(`duplicate id (also in ${ids.get(q.id)})`); else ids.set(q.id, f);
      if (!TYPES.includes(q.type)) err(`unknown type ${q.type}`);
      if (q.chapter !== chapter) err('chapter field does not match file');
      if (!new RegExp(`^${chapter}\\.\\d+$`).test(q.section ?? '')) err('section must look like 3.4');
      for (const k of ['question', 'explanation', 'source']) if (typeof q[k] !== 'string' || !q[k].trim()) err(`missing ${k}`);
      if (typeof q.official !== 'boolean') err('official must be boolean');
      if (![1, 2, 3].includes(q.difficulty)) err('difficulty must be 1, 2 or 3');
      if (q.type === 'igaz-hamis' && typeof q.answer !== 'boolean') err('igaz-hamis answer must be boolean');
      if (q.type === 'feleletvalasztos' || q.type === 'abra') {
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) err('needs 2–4 options');
        else if (q.options[0] !== q.answer) err('first option must be the answer');
        else if (new Set(q.options).size !== q.options.length) err('duplicate options');
      }
      if (q.type === 'abra' && !figures.includes(`${q.figure}:`) && !figures.includes(`'${q.figure}':`)) err(`unknown figure ${q.figure}`);
      if (q.type === 'rovid-valasz' && !(Array.isArray(q.answer) && q.answer.length && q.answer.every((a) => typeof a === 'string' && a.trim()))) err('short answer must be a list of accepted answers, model answer first');
      if (q.keywords !== undefined && !(Array.isArray(q.keywords) && q.keywords.every((k) => typeof k === 'string' && k.trim().length >= 3))) err('keywords must be strings of 3+ characters');
      if (q.type === 'szamolas') {
        if (!Number.isInteger(q.points) || q.points < 1) err('calculation task needs points');
        if (!(Array.isArray(q.steps) && q.steps.length >= 2 && q.steps.every((s) => typeof s === 'string' && s.trim()))) err('calculation task needs a step-by-step derivation (steps)');
        if (!(Array.isArray(q.fields) && q.fields.length)) err('calculation task needs fields');
        else for (const f of q.fields) {
          if (!f.label || !f.format || !ACCEPT.includes(f.accept)) err(`field ${f.label}: needs label, format, accept (${ACCEPT})`);
          else if (f.accept === 'text' ? !fieldCorrect(f, f.answer) : parseNumber(f.answer) === null || !fieldCorrect(f, f.answer)) err(`field ${f.label}: answer ${f.answer} is not a value it accepts`);
        }
      }
      if (q.why !== undefined && !(q.options && Object.entries(q.why).length && Object.entries(q.why).every(([o, w]) => q.options.includes(o) && o !== q.answer && typeof w === 'string' && w.trim()))) err('why: { wrong option text: reason } for options other than the answer');
      if (q.solutions !== undefined && !(q.steps && Array.isArray(q.solutions) && q.solutions.every((m) => m.title && Array.isArray(m.steps) && m.steps.length >= 2 && m.steps.every((x) => typeof x === 'string' && x.trim())))) err('solutions: [{ title, steps: 2+ strings }] next to steps (steps = the easiest way)');
      const strs = (a, n) => Array.isArray(a) && a.length >= n && a.every((x) => typeof x === 'string' && x.trim());
      if (q.type === 'tobbszoros') {
        if (!Number.isInteger(q.points) || q.points < 1) err('többszörös választás needs points');
        if (!(Array.isArray(q.statements) && q.statements.length >= 3 && q.statements.every((st) => typeof st.text === 'string' && st.text.trim() && typeof st.answer === 'boolean'))) err('többszörös választás needs 3+ statements {text, answer: true/false}');
      }
      if (q.type === 'relacio' && !(strs(q.statements, 2) && q.statements.length === 2 && ['A', 'B', 'C', 'D', 'E'].includes(q.answer))) err('relációanalízis needs 2 statements and an answer A–E');
      if (q.type === 'kifejtos') {
        if (!Number.isInteger(q.points) || q.points < 1) err('kifejtős needs points');
        if (!strs(q.answer, 2)) err('kifejtős needs 2+ model answer points (answer)');
      }
      if (q.type === 'parositas' && !(Array.isArray(q.answer) && q.answer.length >= 2 && q.answer.every((p) => p.length === 2))) err('matching needs [[left, right], ...]');
      const t = norm(q.question ?? '');
      if (texts.has(t)) err(`duplicate question text (also ${texts.get(t)})`); else texts.set(t, q.id);
      bySection[q.section] = (bySection[q.section] ?? 0) + 1;
      byType[q.type] = (byType[q.type] ?? 0) + 1;
      byChapter[chapter] = (byChapter[chapter] ?? 0) + 1;
    }
  }
  // Every section listed in the coverage plan must have at least one question.
  const plan = new URL('../docs/coverage-plan.md', import.meta.url);
  const sections = s.id === 'kozgazdasagtan' && existsSync(plan) ? [...readFileSync(plan, 'utf8').matchAll(/^\| (\d\.\d+) /gm)].map((m) => m[1]) : [];
  const missing = sections.filter((x) => !bySection[x]);
  if (missing.length) (strict ? errors : warnings).push(`${s.id}: ${missing.length} section(s) without questions: ${missing.join(', ')}`);

  const glossary = existsSync(new URL(`${s.id}/glossary.json`, root)) ? read(`${s.id}/glossary.json`) : [];
  glossary.forEach((g, k) => {
    if (!g.term || !g.definition || !g.section) errors.push(`${s.id} glossary #${k}: needs term, definition, section`);
    // The typed-definition check scores against these; the model definition itself must pass.
    if (!(Array.isArray(g.concepts) && g.concepts.length >= 2 && g.concepts.every((c) => Array.isArray(c) && c.length))) errors.push(`${s.id} glossary ${g.term}: needs 2+ concept groups`);
    else if (checkDefinition(g, g.definition).share < 0.75) errors.push(`${s.id} glossary ${g.term}: its own definition misses its concepts`);
  });

  console.log(`${s.name}: ${ids.size} questions, ${glossary.length} glossary terms`);
  console.log('  by chapter:', Object.entries(byChapter).map(([k, v]) => `${k}: ${v}`).join(', '));
  console.log('  by type:', Object.entries(byType).map(([k, v]) => `${k}: ${v}`).join(', '));
}
warnings.forEach((w) => console.warn('warning:', w));
errors.forEach((e) => console.error('error:', e));
console.log(errors.length ? `${errors.length} error(s)` : 'data ok');
process.exit(errors.length ? 1 : 0);
