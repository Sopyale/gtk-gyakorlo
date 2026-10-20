# Change log

Newest first. Every shipped change gets an entry and a version (see [docs/RULES.md](../docs/RULES.md)).
Each version is tagged `vX.Y.Z` in git and published as a GitHub release.

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
