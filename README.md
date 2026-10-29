# GTK gyakorló

Practice question bank for first-semester ELTE GTK subjects. Currently it covers the Matematika 2. ZH
(40 calculation tasks in 8 task types, a 60-minute mock ZH of 8 tasks); the Közgazdaságtan 1. ZH is written and off the
site (1.13.0), and the other subjects' ZHs are added by the owner's daily automation as their material arrives. The site itself is in Hungarian.

Live site: https://sopyale.github.io/gtk-gyakorlo/ · Current version: 2.0.0 ([change log](log/LOG.md))

> For personal use only, not to be distributed. The site is based on ELTE's internal teaching materials; the copyright
> of the original materials belongs to the lecturers and ELTE GTK. The notes, the textbook and the ZH materials
> **never go into this repository**.

## Features

- **Gyakorlás** (practice), filtered by chapter and question type, with an explanation and source
  (note section, textbook page) after every answer, and a "Hibás a kérdés?" button that reports the question.
- **Gyenge pontok** (weak spots): right-answer share per chapter, worst first, with a link to practise it.
- **Countdown** to the ZH on the home page and the ZH card (exam `date` in `subjects.json`, or the student's own plan date).
- **Rontott kérdéseim** (my wrong answers): wrong answers collect here and leave after two correct answers in a row.
- **Ismétlés** (spaced repetition): missed questions come back after 1, 3 and 7 days.
- **Párosító** (matching game): match 6 terms to their definitions against the clock; the best time is kept.
- **ZH-szimuláció** (mock ZH): 20 minutes, 25 ZH-level questions (13 true/false, 4 multiple choice, 3 short answer,
  5 figure, since the lecturer said there will be many figure questions), scored at the end.
- **ZH-szint** filter: only the real practice-ZH questions and the hard ZH-style ones (`official` or `difficulty: 3`).
- **Flashcardok** from the note's glossary, also with typed definitions checked by key concepts and an optional
  in-browser language model.
- **Számolás** (Matematika): Moodle-style task cards with the point value, grey number fields, a tick or cross per
  field and a step-by-step derivation (Levezetés); no partial credit. Decimal comma or point, fractions where the format allows, spaces in whole numbers.
- **Ütemterv** (study plan): spreads the chapters over the days until the ZH by question count; the last day is review.
- **Accounts** (optional): Neptun code + password + own non-ELTE e-mail, or Google sign-in. Progress syncs across
  devices; the password can be reset by e-mail; "stay signed in" is optional. Signed-out visitors are asked to sign in
  on every visit. The Drive link asks for sign-in, so access requests can be matched to
  Neptun codes. Details in the privacy notice (`#/adatkezeles`).
- **Segítség kérése** (ticket) tab: signed-in students send a question, request or bug report to the owner, and the
  owner and the student can reply back and forth.
- **Újdonságok**: a short changelog for students.
- **Admin tab**, visible to admins only: every account with Neptun code, e-mail, activity and progress, plus the
  tickets.
- Installable as an app (PWA), works offline, light and dark theme, keyboard shortcuts (I/H, 1–4, Enter, space).

## Running locally

Needs Node 20.

```bash
npm ci
npm run dev        # dev server: http://localhost:5173/gtk-gyakorlo/
npm test           # self-checks: scoring, study plan, progress merge
npm run build      # data check + production build into dist/
npm run preview    # serve the build
```

## Editing questions

Only questions that resemble the real ZH stay in the bank (owner's rule): true/false, 4-option multiple choice,
1–2 word technical terms and figure questions; no matching questions.

Questions live in `src/data/<subject>/ch<N>.json`, one file per chapter. One question:

```json
{
  "id": "kg-1-001",
  "type": "igaz-hamis",
  "chapter": 1,
  "section": "1.4",
  "question": "A másodlagos drive-ok tanulással, tapasztalással alakulnak ki.",
  "answer": true,
  "explanation": "…",
  "source": "Jegyzet 1.4 · Könyv 5. o.",
  "official": true,
  "difficulty": 1
}
```

| Type (`type`) | `answer` | Extra fields |
|---|---|---|
| `igaz-hamis` | `true` / `false` | |
| `feleletvalasztos` | text of the correct option | `options`: 4 options, including the correct one |
| `rovid-valasz` | list of accepted answers, the first is the model answer | `keywords`: an answer containing one counts as correct. Typed answers also match with Hungarian endings, any word order and one typo (not in a word's first 4 letters); in practice the student can mark "Más szavakkal, de ugyanezt írtam" |
| `parositas` | `[["left", "right"], …]` pairs | |
| `abra` | a true/false or multiple-choice answer | `figure`: figure id from `src/figures/index.js` |
| `tobbszoros` | (none) | `statements`: 3+ `{ text, answer: true/false }`; the student ticks the true ones; `points`. Practice: right when every statement is right; mock ZH: points shared per statement |
| `relacio` | `"A"`–`"E"` | `statements`: the two halves joined by "MERT"; options A–E are fixed (A both true and related, B both true not related, C first true, D second true, E both false) |
| `kifejtos` | 2+ key points of the model answer | `points`; the student writes the answer, then ticks the points it contains (self-check); mock ZH: ticked share of the points, rounded down to half points |
| `szamolas` | (none) | `points`; `steps`: the numbered derivation shown as "Levezetés"; `fields`: `[{ label, answer, accept, format }]`. `accept`: `int` exact whole number, `dec` decimal within 0.001, `frac` also a fraction, `round` decimal with 2+ decimals rounded from the answer, `text` typed text such as an account name (`alts`: other accepted forms, e.g. the account number; case and accents ignored). `format` is the hint shown under the field |

`official: true` marks the real practice-ZH questions. The glossary is in `glossary.json` (`term`, `definition`,
`section`).

Before every build, `npm run check-data` checks the fields, duplicate ids and texts, figure references, and that every
section in `docs/coverage-plan.md` has a question. Bad data fails the build.

Explanations say in 1–3 plain sentences why the answer is right (for a false statement, what is true instead), without citing the source (that is in `source`). Content may only come from the uploaded note and textbook. Figures are our own SVGs (`src/figures/`), never images
from the sources.

## Adding a subject or a ZH

1. In `src/data/subjects.json`, set `"active": true` for the subject and fill in `chapters` and `exams`.
2. Create `src/data/<subject-id>/` with `ch<N>.json` files and, if it has flashcards, a `glossary.json`. The code
   picks them up; without a glossary the Flashcardok and Párosító modes are hidden.
3. For a new ZH, add an item with its chapter numbers to the `exams` list. A calculation ZH (Matematika) also gets
   `"mock": { "minutes", "perChapter" }`: the mock ZH then draws that many tasks from every chapter (task type).
   A ZH with its own question mix (e.g. Menedzsment: többszörös választás, párosítás, kifejtős) sets
   `"mock": { "minutes", "mix": { "<type>": <count>, … } }`. Kakukktojás is a `feleletvalasztos`, an esettörténet a
   `rovid-valasz`.
   `chapterLabel` on the subject renames the "Fejezetek" filter (Matematika: "Feladattípusok").

## Accounts setup

Accounts run on Supabase. The schema is in `supabase/schema.sql` (fresh project only: re-running it deletes every
profile) `supabase/tickets.sql` and `supabase/ticket-replies.sql` (tickets and replies; safe to re-run); the publishable key and project URL are in
`src/lib/account.js`. Only the publishable key may be in the code. User data stays in Supabase and never goes into
this repository. Make someone an admin in the Supabase SQL Editor:

```sql
update public.profiles set is_admin = true where neptun = 'ABC123';
```

## Deploying and versions

Every push to `main` runs the tests, builds, and publishes to GitHub Pages via GitHub Actions
(`.github/workflows/deploy.yml`). Every page is `noindex`.

Every shipped change gets a new version in `package.json`, an entry in [log/LOG.md](log/LOG.md), a `vX.Y.Z` git tag and
a GitHub release. The footer shows the live version. The working rules are in [docs/RULES.md](docs/RULES.md), the task
list in [docs/TASKS.md](docs/TASKS.md), and the specification in [SPEC.md](SPEC.md).

## Tech

Vite + React (JavaScript), hash routing, vite-plugin-pwa, Supabase, lucide-react icons, Bricolage Grotesque and Figtree
fonts.
