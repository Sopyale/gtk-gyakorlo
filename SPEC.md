# gtk-gyakorlo – specification

Practice website for first-semester ELTE GTK students. Static, Hungarian UI, English code.
Changes only with the owner's approval; every change follows [docs/RULES.md](docs/RULES.md) and is logged in
[log/LOG.md](log/LOG.md). Current version: 1.5.2.

## 1. Objective

A fast, good-looking static site where a student can:

1. pick a subject, then practise Közgazdaságtan by chapter or question type with instant feedback, the correct answer, an explanation and the source ("Jegyzet 3.4", "Könyv 37. o.");
2. sit a timed mock ZH in the real ZH format (20 min, 25 questions);
3. re-practise questions answered wrong;
4. revise the glossary with flashcards;
5. plan the days until the ZH;
6. keep progress across devices with an account, which also lets the owner match Drive access requests to Neptun codes.

Accuracy beats volume: a wrong key teaches a classmate the wrong thing.

Users: ELTE GTK first-year students (PSZ, NG, GM majors), on phones (360 px and up) and laptops.

### Content sources (never committed)

| Source | Role |
|---|---|
| Zsolnai Alíz: Közgazdaságtan 1. – 1. ZH vizsgajegyzet (PDF + HTML) | primary source; its chapters, sections and ★ marks decide coverage |
| Andor György: Közgazdaságtani alapismeretek (2023) | explanations, examples; Összefoglalás and Kiemelt fogalmak are the ZH backbone |
| gyakorlo-zh-kerdesek.md + q27 figure | the 38 official Moodle practice questions; imported, and used as style reference |

No fact, example, number or author may come from anywhere else. The source files stay outside the repository
(`.gitignore` blocks `kuldendo/` and `private/` as a safety net).

## 2. Scope

In: six subjects in the menu (Közgazdaságtan, Menedzsment, Marketing, Számvitel, Közösség és egyén, Matematika);
only Közgazdaságtan has content, the rest show "Hamarosan" and become active by adding data only.

In since 1.0.0: accounts and progress sync on Supabase (see §4a).

Out: own server code, third-party analytics or tracking, any content outside the two sources.

## 3. Tech stack

- Vite + React, JavaScript (no TypeScript).
- Hash routing (`#/kozgazdasagtan/gyakorlas`) so deep links work on GitHub Pages; Vite `base: '/gtk-gyakorlo/'`.
- GitHub Actions workflow builds and deploys to GitHub Pages.
- PWA: web manifest, icons, service worker caching the app shell and question data (offline after first visit).
- Icons: Lucide. Fonts: self-hosted, a display grotesk (e.g. Bricolage Grotesque) + a body face (e.g. Figtree).
- Animation: CSS and the View Transitions API; the `motion` library only if one specific effect needs it.
- Progress in `localStorage`, behind a tiny wrapper that falls back to memory when storage is unavailable;
  signed-in users' progress is also synced to Supabase.
- `@supabase/supabase-js` (lazy-loaded) for accounts.

## 4. Pages and modes

- **Menu**: top bar on desktop, drawer on phones; the six subjects in the order above.
- **Home**: intro, subject bento cards (Közgazdaságtan active with its question count, others "Hamarosan", not clickable),
  "Tananyagok (Google Drive)" button → `https://drive.google.com/drive/folders/15-MBuk89WvQ-HQwPefg7sUawg0LdZi-0?usp=drive_link`
  with a one-line note that access is granted on request. A countdown to each active ZH ("2 nap az 1. ZH-ig") shows in
  the hero and on the ZH card; the date is `date` on the exam in `subjects.json`, or the student's own Ütemterv date.
- **Subject page**: the four modes as cards, chapter filter (6 chapters), type filter, overall progress.
  "Gyenge pontok": share of right answers per chapter (latest answer per question), worst first, each linking to
  practice of that chapter.
- **Gyakorlás**: random questions from the selected chapters/types; one at a time; progress bar; feedback after each answer
  (correct/incorrect with icon + text, the correct answer, explanation, source); next button.
  "Hibás a kérdés?" next to it sends a bug-report ticket with the question id and an optional comment (signed in only).
  Keyboard: 1–4 options, I/H true/false, Enter submit/next.
- **Rontott kérdéseim**: every question answered wrong; leaves the list after two correct answers in a row.
- **Ismétlés** (spaced repetition): a missed question is due again 1 day later; a right answer on a due day moves it to
  3 days, then 7 days, then off the schedule; a miss starts it over. Stored in `review` (synced). The mode card shows
  how many are due today.
- **Párosító** (matching game): 6 random glossary terms and their definitions, shuffled; tap a term, then its
  definition; a wrong pair adds 1 second; the best time per ZH is kept in `match` (synced).
- **ZH-szimuláció**: 20 minutes, 25 questions drawn proportionally from the chapters; mix ≈ 16 igaz-hamis, 5 feleletválasztós,
  3 rövid válasz, 1 ábrás; no feedback until the end; then score, per-chapter breakdown, review of every question.
- **Flashcardok**: glossary terms (front: term; back: definition + section), "tudtam / nem tudtam", unknown cards repeat.
- **Ütemterv**: the student sets the ZH date; the chapters are spread over the days by question count, the last day is
  review when at least three days are left; days can be ticked off; "Újratervezés mától" re-plans from today.
- **Haladás törlése** button clears all stored progress.
- **Legal notice** (verbatim, see §7) in every page footer and as a dismissible first-visit banner.
- `<meta name="robots" content="noindex, nofollow">` on every page; `robots.txt` disallows everything.

## 4a. Accounts, admin, privacy

- **Sign-up**: Neptun code (6 letters/digits, the username), password (≥ 8, stored by Supabase Auth as a bcrypt hash)
  and the student's own e-mail. The e-mail must not be an ELTE address, and one e-mail belongs to one Neptun code
  (both enforced in the database). It receives password-reset mail and is the address used to request Drive access.
- **Google sign-in** (PKCE); the student then enters their Neptun code once.
- **Bejelentkezve maradok** checkbox (default on): the session is kept in localStorage; unchecked, in sessionStorage
  (ends when the browser closes).
- **Sign-in prompt**: on every visit (page load) a signed-out visitor gets a dialog saying progress is saved on every
  device after sign-in and that Drive access must be requested with the registered e-mail. "Most nem" closes it; it is
  not shown on `#/fiok`, `#/admin` and `#/adatkezeles`.
- **Sign-in with Neptun code**: the `login_email` RPC returns the account's e-mail only after a password check,
  at most 10 misses per code per 15 minutes.
- **Password reset** by e-mail (needs custom SMTP in Supabase). **Fiók törlése** deletes the account and its data.
- **Drive link**: signed-out visitors are sent to sign in first; clicks are counted per account.
- **Admin** (`#/admin`, header tab): only for `profiles.is_admin`; stats and a searchable list of every account
  (Neptun code, e-mail, sign-in method, registered, last seen, Drive clicks, progress). Row-level security keeps
  every other user to their own row.
- **Privacy notice** (`#/adatkezeles`, footer link): purpose (Drive access, progress sync), what is stored, where
  (Supabase, EU), retention and deletion.
- **Segítség kérése** (`#/kerdes`, labelled header button; in the menu on phones): signed-in students send a ticket (kind: kérdés, kérés,
  hibajelentés; up to 2000 characters; at most 5 per hour) and see their own tickets' status. The admin sees all
  tickets in Admin with the sender's Neptun code and e-mail and marks them done. Under each ticket the admin and the
  student reply back and forth (`supabase/ticket-replies.sql`); a student's reply reopens a done ticket.
- **Újdonságok** (`#/ujdonsagok`, footer and menu link): short Hungarian changelog from `src/data/changelog.json`,
  one short line per notable change.
- Schema: `supabase/schema.sql` (fresh project only; re-running deletes profiles) and `supabase/tickets.sql`.
  User data never goes into the repository.

## 5. Data format

Content lives in data files only; adding a subject = adding files + flipping `active`.

```
src/data/subjects.json                 all six subjects: { id, name, active, chapters: [{ n, title }] }
src/data/kozgazdasagtan/ch1.json … ch6.json   question arrays, one file per chapter
src/data/kozgazdasagtan/glossary.json  [{ term, definition, section, star }]
```

Question object:

| field | value |
|---|---|
| `id` | `"kg-3-017"` (subject-chapter-number), stable once published |
| `type` | `"igaz-hamis"` \| `"feleletvalasztos"` \| `"rovid-valasz"` \| `"parositas"` \| `"abra"` |
| `chapter` | `3` |
| `section` | `"3.4"` |
| `question` | Hungarian text |
| `answer` | igaz-hamis / abra-as-TF: `true`/`false`; feleletvalasztos / abra-as-choice: the correct option text (also first in `options`); rovid-valasz: array of accepted answers (first = model answer); parositas: array of `[left, right]` pairs (3–5) |
| `options` | feleletvalasztos and abra-as-choice: exactly 4 strings, correct first, shuffled at runtime |
| `figure` | abra only: id of an SVG figure component |
| `explanation` | 1–3 sentences: why, and the correct version for wrong options / false statements |
| `source` | `"Jegyzet 3.4"` or `"Jegyzet 3.4 · Könyv 30. o."` |
| `official` | `true` for the imported Moodle questions (UI badge "Valódi gyakorló ZH-kérdés") |
| `derivedKey` | `true` where the key was derived from the note/book, not given by Moodle |
| `difficulty` | `1`–`3` |

Short answers are compared case-, accent- and whitespace-insensitively; the model answer is always shown afterwards.

`npm run check-data` (plain Node script) validates every file against this table, rejects duplicate ids and duplicate
question texts, checks that every numbered section of chapters 1–6 has at least one question, and prints counts per
chapter, section and type. It must pass before each stage stop.

## 6. Design

Dark, futuristic, premium (Linear / Vercel / Raycast polish), built on the exam note's palette.

- Light tokens from the note CSS: plum `#4a1043`, plum2 `#7b2d6f`, orange `#d9822b`, green `#3c7a3e`, blue `#2f6690`,
  red `#a8233c`, border `#e6dce4`, tint `#faf6f9`.
- Dark tokens (hero theme): plum `#d79bcb`, accent `#f0a052`, background `#140b13`; other hues lightened to pass AA.
- Follows the system theme, with a manual toggle.
- Signature: slow aurora/mesh gradient + grain behind the hero; bento grid with 1 px gradient borders, glass surfaces and a
  cursor-following glow (desktop); View Transitions between pages; answer card slide/flip to feedback; shake on wrong,
  glow pulse on a correct streak; animated counters and score ring. 150–300 ms, ease-out. Animations always run,
  regardless of `prefers-reduced-motion` (owner's choice, 2026-10-16).
- The practice view stays calm: no motion behind question text, high contrast.
- Mobile first, 44 px tap targets, bottom-reachable buttons, no horizontal scroll, WCAG AA in both themes, visible
  accent focus rings, full keyboard use, Lighthouse mobile performance ≥ 90.
- Stage 2 starts with 2–3 home-page directions as screenshots; the owner picks one.

## 7. Legal notice (verbatim)

> Kizárólag saját felhasználásra – nem terjeszthető. Ez a weboldal kizárólag az ELTE Gazdaságtudományi Kar első féléves
> hallgatói (Pénzügy és számvitel, Nemzetközi gazdálkodás, Gazdálkodási és menedzsment szak) számára, saját tanulási célra
> készült. Az ELTE belső oktatási anyagaira épül, amelyekhez csak a kurzus hallgatói férnek hozzá, ezért hivatalosan nem
> osztható meg: tilos nyilvánosan közzétenni, továbbítani, feltölteni vagy a kurzuson kívüli személyeknek átadni. Az eredeti
> anyagok szerzői joga az oktatókat és az ELTE GTK-t illeti.

## 8. Question bank plan

- 37 official questions (38 minus no. 8, whose statement was lost) + about 250 new ones.
- New-question type mix: 138 igaz-hamis (55 %), 50 feleletválasztós (20 %), 25 rövid válasz (10 %),
  17 párosítás (7 %), 20 ábrás (8 %); igaz-hamis keys close to 50/50.
- Per-section counts are in `docs/coverage-plan.md`; ★ sections get more.
- Style rules: short precise statements, true/false pairs differing in one key word, everyday cases, plausible distractors
  from the same chapter, fresh numbers for comparative-advantage tasks with a worked opportunity-cost table in the
  explanation. No near-duplicates of the official questions or of each other (checked and reported at stage 3).
- Every figure is drawn as an inline SVG component in the site's colours; the note's SVGs and the q27 PNG are only
  references.

## 9. Project structure

```
index.html                 noindex meta, manifest link
public/                    robots.txt, icons, manifest
src/main.jsx, App.jsx      router + layout
src/pages/                 Home, Hub, Subject, Practice, Mock, Flashcards, Plan, Account, Admin, Privacy,
                           Tickets, Changelog
src/components/            QuestionCard, answer inputs per type, Legal, Menu, ThemeToggle
src/figures/               one small SVG component per figure id
src/lib/                   storage wrapper, shuffle/draw, answer normalisation, study plan, accounts
src/data/                  JSON content (see §5)
scripts/check-data.mjs     data validator
supabase/schema.sql        database schema for accounts; supabase/tickets.sql and
                           ticket-replies.sql tickets and replies
graphify-out/              graphify knowledge graph of the code
docs/RULES.md              project rules; docs/TASKS.md task list
log/LOG.md                 change log, one entry per version
.github/workflows/deploy.yml
```

## 10. Commands

```
npm install
npm run dev          # local dev server
npm run build        # production build to dist/
npm run preview      # serve the build
npm run check-data   # validate question data
npm test             # self-checks: scoring, study plan, progress merge
```

## 11. Testing

- `check-data` on every data change.
- Playwright (webapp-testing) click-through at 360 px and 1280 px in both themes; screenshots at stages 2–4.
- Lighthouse at stage 4: performance, accessibility, best practices ≥ 90.

## 12. Boundaries

- Always: cite a source on every question; keep source files out of git; Hungarian UI text, English code.
- Ask first: adding any dependency beyond React, Vite, the PWA plugin, Lucide, fonts and (if needed) `motion`.
- Never: content from outside the two sources; committing the note, textbook, ZH file or q27 image; third-party
  analytics or tracking; committing user data, secret keys or passwords.

## 13. Success criteria

See the stage list in `docs/TASKS.md`; done when the site deploys to Pages, every page has noindex + legal notice,
it works offline, every section has questions with explanation and source, `check-data` passes, all four modes work on
a 360 px phone and desktop in both themes and by keyboard, and the five other subjects show "Hamarosan".
