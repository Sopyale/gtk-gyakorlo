# Change log

Newest first. Every shipped change gets an entry and a version (see [docs/RULES.md](../docs/RULES.md)).
Each version is tagged `vX.Y.Z` in git and published as a GitHub release.

## 2.0.1 – 2026-10-29

- **Written ZHs disappear:** the subject page showed the Közgazdaságtan 1. ZH as "Hamarosan. Az anyaga később kerül
  fel." although it was written on 2026-10-21. An inactive exam whose `date` has passed is now hidden; an inactive
  exam without a past date (an upcoming ZH) still shows "Hamarosan". Requested by the owner.

## 2.0.0 – 2026-10-29

- **Version 2:** the site is now fed by the owner's daily automation. New Moodle material goes into the exam notes, the
  practice questions for the current ZH are written from them and land here (and on the ZH's tab) without manual
  work; the notes go to the Drive folder. The automation itself lives outside this repository (`D:\Claude\School`).
  Students only see one short line about it on the Újdonságok page (owner's rule).
- **History rewritten:** the repository's earlier history contained the Moodle practice questions word for word
  (removed in 1.13.0). On the owner's request the history was replaced by a single commit at 2.0.0 and the old version
  tags and releases were deleted, so those questions are no longer in any public version. Earlier changes are still
  described in this log.
- **Next:** 2.1.0 is a full redesign of the site (see `ideas.md`).

## 1.13.0 – 2026-10-29

- **Közgazdaságtan 1. ZH off the site:** the ZH was written on 2026-10-21, so its exam card is inactive
  (`zh1.active: false`); the 2. ZH questions will come with the new material. Requested by the owner.
- **No Moodle items word for word:** the 39 practice-ZH questions copied from Moodle (`official: true`) are removed,
  because the owner could be penalised for publishing them. RULES.md now forbids it; similar questions are written
  from the note instead. The home page shows the number of subjects instead of the official-question count, and the
  exam cards no longer mention it.

## 1.12.0 – 2026-10-28

- **New question types** for the ZHs of Menedzsment, Marketing, Közösség és egyén and Számvitel (the owner asked to
  extend the site before their banks go up): `tobbszoros` (tick every true statement; the mock ZH gives a share of the
  points per statement, as the Menedzsment ZH does), `relacio` (two statements joined by "MERT", fixed answers A–E,
  as the Közösség és egyén practice questions), `kifejtos` (write the answer, then tick which points of the model
  answer it contains; the mock ZH gives the ticked share, rounded down to half points), and `accept: "text"` fields in
  `szamolas` tasks for Számvitel account names (the account number counts too via `alts`). Kakukktojás and
  esettörténet use the existing `feleletvalasztos` and `rovid-valasz` types.
- **Mock ZH mix per exam:** `mock.mix` in `subjects.json` sets the number of questions per type and the minutes;
  the mock ZH scores with the new `score()` (partial points only for többszörös and kifejtős).
- **Fix:** changing the filters in the URL (back/forward between two practice links) now starts a fresh round
  instead of showing the previous answered card.
- `check-data` validates the new types; ids may have two-digit chapter numbers. Self-checks cover every new type.
- **Workflow:** the laptop copy is now a git clone (RULES.md step 5).

## 1.11.0 – 2026-10-27

- **Levezetés for every Matematika task:** each of the 40 tasks now shows a numbered step-by-step derivation in the
  simplest form, with the note's methods (szita formula, tree diagram, compound interest with logarithm, variation)
  and section references; every number was recomputed by a script against the answer key. Where the note doesn't
  cover a topic (vectors, expected value and standard deviation) the method line says so. Shown in practice and in
  the mock ZH review. Requested by the owner so every solution can be understood.
- **Rule:** RULES.md (Matematika) and the owner's exam-note prompt now require a derivation for every practice task.

## 1.10.0 – 2026-10-27

- **Matematika 2. ZH:** the Matematika tab is open. 40 practice tasks from the owner's `gyakorlo_feladatok.md` (8 task
  types of the practice ZH × 5 own variants; the original ZH tasks are not on the site) as a new `szamolas` type:
  Moodle-style cards with points, grey number fields, a tick or cross per field and the solution, no partial credit.
  Decimal comma or point, fractions where allowed, whole numbers exact. Practice by task type, Rontott, Ismétlés,
  Ütemterv, and a 60-minute mock ZH with one task per type (56 points). No flashcards (no glossary). Requested by the
  owner.
- **Rule:** RULES.md has a Matematika section on which task types the bank has and how answers are checked.
- `check-data` accepts any subject id prefix, checks every calculation field against its own answer and only needs a
  glossary when a subject has one.

## 1.9.0 – 2026-10-21

- **Typed definitions:** new "Leírom a definíciót" mode on the flashcards. The student writes the definition in
  their own words; every glossary term now has a key-concept list (`concepts` in `glossary.json`, the interchangeable
  wordings that count), and the check shows which concepts are there and which are missing, plus the note's
  definition. "Okos ellenőrzés" adds a small multilingual sentence model (Hungarian included, ~120 MB, loaded from
  Hugging Face into the browser only when turned on) that scores how close the meaning is. The student still decides
  "Tudtam / Nem tudtam". `check-data` requires concepts and that each term's own definition passes them. Requested
  by the owner so long definitions in other words can be checked.
- **ideas.md:** server-based AI on our own machine, with a hardware estimate for 200 simultaneous checks within 1
  second and a store of already judged answers.

## 1.8.0 – 2026-10-21

- **Other wording accepted:** typed short answers now match with Hungarian endings ("mikroökonómiát"), any word
  order, articles ignored and one typo, but never with a different term ("makroökonómia", "határtermék-bevétel"). If
  the check still says wrong, the student can press "Más szavakkal, de ugyanezt írtam" in practice to count it as
  right. Requested by the owner so right answers in other words count.
- **Rule:** RULES.md now describes the ZH question-bank workflow for every subject (start from the uploaded practice
  ZH, cover the whole material in its style, keep only ZH-like questions), so it is applied without asking.

## 1.7.0 – 2026-10-21

- **Only ZH-like questions:** every question was compared with the practice ZH and the lecturer's ZH description; 54
  that didn't resemble ZH items were removed (all 14 matching questions, source trivia such as author names and
  "a könyv szerint" meta questions, giveaways and near-duplicates). 368 questions remain; no practice-ZH question was
  removed. Note section 1.3 now has no question. Requested by the owner.
- Question-type chips with no questions are hidden on the ZH page.

## 1.6.0 – 2026-10-20

- **ZH-style questions:** 128 new hard questions (`difficulty: 3`), 422 in total, modelled on the practice ZH and the
  lecturer's ZH description: tricky true/false statements, 4-option multiple choice with close distractors, 1–2 word
  technical terms, case examples and numeric comparative-advantage and cost-minimisation questions. 37 are figure
  questions, with 21 new own SVG figures of the book summary's diagrams (`src/figures/zh12.jsx`, `zh34.jsx`,
  `zh56.jsx`). Only from the note and the textbook; footnotes left out. Requested by the owner because the ZH asks for
  precise understanding.
- **Csak ZH-szintű filter** on the 1. ZH page (real practice-ZH questions plus the hard ones).
- **ZH-szimuláció:** draws ZH-level questions only, with 5 figure questions instead of 1 (13 true/false, 4 multiple
  choice, 3 short answer), because the lecturer said there will be many figure questions.
- `check-data` now finds figure ids in every file of `src/figures/`.

## 1.5.2 – 2026-10-19

- **Explanations checked:** all 294 explanations compared one by one with the note and the matching textbook pages
  (owner's request). Six fixed: kg-1-001 (secondary drives do serve the primary ones), kg-2-038 and kg-2-044 (a higher
  indifference curve does not always hold more of both goods), kg-3-009 and kg-4-014 (wording), kg-5-010 (the real
  cost of turning up the heating is what the gas money could buy elsewhere). No answer key conflicts with the sources.

## 1.5.1 – 2026-10-19

- **Explanations:** rewrote 270 of 294 question explanations so they say in plain words why the answer is right (for
  a false statement, what is true instead), define the terms they use, and drop remarks like "A könyv szerint igaz".
  Only from the note and the textbook; answer keys unchanged. Requested by the owner.

## 1.5.0 – 2026-10-19

- **Ismétlés:** new mode on the 1. ZH page. A missed question comes back 1 day later, then after 3 and 7 days if
  answered right on its due day; a miss starts it over. The card shows how many are due today. The schedule is the new
  `review` progress key, synced to the account and cleared by "Haladás törlése".
- **Párosító:** new timed game: 6 glossary terms and their definitions, shuffled; a wrong pair costs 1 second; the best
  time per ZH is kept (`match` key, synced).
- Progress keys now live in one list (`PROGRESS` in `storage.js`) used by sync and by "Haladás törlése".

## 1.4.0 – 2026-10-19

- **Hibás a kérdés?:** after every answer in practice, a button sends a bug-report ticket naming the question (id and
  text) with an optional comment, so wrong questions reach the owner directly. Signed-in students only.
- **ZH countdown:** the home page and the 1. ZH card show the days left until the ZH (2026-10-21, or the student's own
  Ütemterv date). `subjects.json` exams take an optional `date`.
- **Gyenge pontok:** the 1. ZH page lists the chapters by share of right answers, worst first, each with a link to
  practise that chapter. Ideas picked by the owner from the idea list.

## 1.3.0 – 2026-10-19

- **Ticket replies:** under every ticket the admin and the student can write back and forth, on the Admin page and on
  the student's Segítség kérése page. The server records who wrote each reply; a student's reply reopens a ticket
  marked done; at most 20 replies per account per hour. Database: new `supabase/ticket-replies.sql` (run once; it
  never deletes data). Requested by the owner so he can answer students directly.
- **Header:** the signed-in Neptun code shows as an icon below 1360 px, and the current subject link never gets cut
  off, so the header fits with the Admin and Segítség kérése buttons.
- **Újdonságok:** shortened to one short line per version, only the notable changes (owner's request); the rule is in
  RULES.md.

## 1.2.1 – 2026-10-19

- **1. ZH card diagram:** the old decoration (two loose curves, budget line only visible on hover) looked broken.
  It is now a to-scale consumer optimum: axes, budget line, three indifference curves with the middle one tangent
  to the budget line, guide lines and the optimum point.
- **Segítség kérése:** the ticket button in the header now has the text "Segítség kérése" (icon-only below 1240 px,
  in the menu on phones); the page title matches.
- **Header:** the subject menu switches to the hamburger menu below 1120 px, so the header never overflows.

## 1.2.0 – 2026-10-19

- **Újdonságok page** (`#/ujdonsagok`, footer and menu link): a short, Hungarian changelog for students, from
  `src/data/changelog.json`. Requested so students see what's new.
- **Kérdés tab** (`#/kerdes`, header icon, menu link): signed-in students send a question, request or bug report
  (up to 2000 characters, 5 per hour) and see their own tickets' status. Signed-out visitors are sent to sign in.
- **Admin:** new "Kérdések" list with the sender's Neptun code and e-mail, a "Megoldva" toggle, and an open-tickets
  count. Database: new `supabase/tickets.sql` (run once; it never deletes data), with row-level security so students
  only see their own tickets.
- **Header:** Admin and Kérdés are icon buttons; on phones they move into the menu.
- **Privacy notice:** lists the tickets among the stored data.
- **Safety:** `schema.sql` now warns that re-running it deletes all profiles.
- **graphify:** knowledge graph of the code in `graphify-out/` (GRAPH_REPORT.md, graph.html, graph.json).

## 1.1.0 – 2026-10-19

- **Sign-in prompt:** every time a signed-out visitor opens the site, a pop-up asks them to sign in. It says that
  progress is then saved on every device, and that Drive access must be requested with the e-mail they register with.
  It shows once per visit (not on every page change) and not on the account, admin and privacy pages.
  Requested by the owner so more students register before asking for Drive access.
- **Bejelentkezve maradok:** a checkbox (on by default) at sign-in, sign-up and Google sign-in. Checked keeps the
  session on the device; unchecked ends it when the browser closes.
- **Rules:** RULES.md now says to always use the installed plugins (agent-skills, frontend-design, webapp-testing,
  ponytail, graphify).

## 1.0.0 – 2026-10-19

First saved version: everything built so far.

- **Practice:** Közgazdaságtan 1. ZH with 294 questions in five types, 23 own SVG figures and 74 glossary flashcards.
  Modes: Gyakorlás (filter by chapter and type, explanation and source after every answer), Rontott kérdéseim,
  20-minute ZH-szimuláció in the real ZH mix, Flashcardok.
- **Ütemterv:** splits the chapters over the days until the ZH by question count; the last day is review.
- **Accounts (Supabase):** sign-up with Neptun code, password and the student's own non-ELTE e-mail, or Google sign-in.
  One e-mail per Neptun code. Self-service password reset. Progress syncs across devices.
  The Drive link asks for sign-in first, so the owner can match Drive access requests to Neptun codes.
- **Admin tab:** only for admins; lists every account's Neptun code, e-mail, sign-in method, activity,
  Drive clicks and progress.
- **Privacy notice** (#/adatkezeles) explaining why the data is collected and how to delete an account.
- **Design:** "Aurora" look with the live optimum curve in the hero; pointer light, tilt and ripple on every panel and
  button; pages float in on navigation; animations always on.
- **Platform:** installable PWA that works offline and reloads itself after a deploy; light and dark theme;
  footer shows the live version.

Development history before 1.0.0 (commits on `main`):

| Commit | Change |
|---|---|
| adb5b78 | Admin tab in the header for admins only |
| 36f2797 | Accounts on; real non-ELTE e-mail per Neptun code, self-service password reset |
| f760e44 | Accounts: Neptun or Google sign-in, progress sync, admin view |
| 68edb59 | Study plan (Ütemterv) per ZH |
| 489bc94 | Animate regardless of the reduced-motion setting |
| 49bb699 | Deployed version in the footer |
| 2e2d130 | Auto-reload when a new deploy's service worker takes over |
| 638f052 | Animated hero diagram, pages float in on navigation |
| 6e454b0 | Stage 4: interaction layer, animated counters, README |
| 2f24d7c | Stage 3: question bank, glossary and figures |
| 60e69e8 | Közgazdaságtan practice grouped under a 1. ZH card |
| 0026598 | Stage 2: app skeleton, four practice modes, PWA, Pages deploy |
| 0115f93 | Stage 1: spec, coverage plan and task plan |
