# Tasks

Every change the owner asks for is added here as a new task before work starts, and ticked off when it ships
(see [RULES.md](RULES.md)). Newest at the bottom.

## Done before 1.0.0

- [x] Stage 1: analysis, coverage plan, spec
- [x] Stage 2: design (direction A "Aurora" + live hero curve), skeleton, four practice modes, PWA, Pages deploy
- [x] Stage 3: 294 questions, 74 glossary terms, 23 SVG figures, `check-data`
- [x] Stage 4: interaction layer on every panel and button, Lighthouse ≥ 90, README
- [x] Animate the hero diagram (dot drops onto the optimum); pages float in on navigation
- [x] Make new deploys show up without a manual cache clear; show the version in the footer
- [x] Always animate, ignoring the reduced-motion setting
- [x] Ütemterv (study plan) for the ZH
- [x] Accounts: Neptun code + password + own non-ELTE e-mail, or Google sign-in; one e-mail per Neptun code;
      self-service password reset; progress sync; privacy notice
- [x] Admin tab, visible to admins only, listing every account

## 1.0.0

- [x] Save the current site as version 1.0.0 (git tag and GitHub release)
- [x] Add `log/LOG.md` with every change, and version every future change
- [x] Write the project rules to `docs/RULES.md` (English `.md` files, tasks first, keep SPEC/README/log current)
- [x] Bring SPEC.md and README.md up to date (accounts, admin, Ütemterv); README in English

## 1.1.0

- [x] Ask signed-out visitors to sign in on every visit (pop-up): progress is saved on every device, and Drive access
      must be requested with the e-mail used to register
- [x] "Bejelentkezve maradok" (stay signed in) checkbox at sign-in and sign-up
- [x] Add the rule to always use the installed plugins (agent-skills, frontend-design, webapp-testing, ponytail,
      graphify) to RULES.md

## 1.2.0

- [x] Build a graphify knowledge graph of the code (`graphify-out/`)
- [x] Short changelog page for students (Újdonságok, `#/ujdonsagok`)
- [x] Ticket tab (Kérdés, `#/kerdes`): signed-in students send a question, request or bug report; only the admin sees
      them, in the Admin page, and can mark them done

## 1.2.1

- [x] Redraw the 1. ZH card's diagram properly (axes, budget line, tangent indifference curve, optimum)
- [x] Label the ticket button "Segítség kérése" instead of an icon only

## 1.3.0

- [x] Ticket replies: the admin answers a ticket and the student can answer back (`supabase/ticket-replies.sql`)
- [x] Shorten the Újdonságok page to the notable changes only

## 1.4.0

- [x] "Hibás kérdés" button after every answer: sends a bug-report ticket with the question id and an optional comment
- [x] Countdown to the ZH on the home page and the 1. ZH card
- [x] Weak spots: error rate per chapter on the subject page, with a button to practise that chapter

## 1.5.0

- [x] Ismétlés (spaced repetition): missed questions come back after 1, 3 and 7 days; synced across devices
- [x] Párosító (timed matching game): match about 6 terms to their definitions from the glossary, best time saved

## 1.5.1

- [x] Clear, understandable explanations for every question: rewrite short or vague explanations using only the note
      and the textbook

## 1.5.2

- [x] Check every explanation one by one against the note and the textbook; rewrite only the ones that are wrong
      or clearly odd

## 1.6.0

- [x] ZH-style questions: add harder questions modelled on the practice ZH and the lecturer's ZH description (true/false
      traps, 4-option multiple choice, 1–2 word technical-term answers, many figure questions on the book summary's
      figures, case examples), only from the note and the textbook
- [x] "ZH-szint" filter on the ZH page, and the mock ZH prefers ZH-level questions

## 1.7.0

- [x] Keep only questions that resemble the real ZH questions (true/false, 4-option multiple choice, 1–2 word
      technical terms, figure questions); remove the rest, including the matching-type questions

## 1.8.0

- [x] Write the ZH question-bank workflow into RULES.md so it is applied to every subject automatically
- [x] Accept right short answers written in other words: endings, word order and small typos, plus a
      "Más szavakkal, de ugyanezt írtam" button in practice

## 1.9.0

- [x] Check typed definitions in other words: a key-concept list per glossary term (wordings that count) plus an
      optional in-browser Hungarian-capable language model that scores the meaning; new "Leírom a definíciót" mode
      on the flashcards
- [x] Write `ideas.md`: server-based AI on our own machine, hardware for 200 simultaneous checks within 1 second,
      and a store of already judged answers

## 1.10.0

- [x] Open the Matematika tab for the 2. ZH: the 40 practice tasks of `gyakorlo_feladatok.md` (8 task types × 5) as
      Moodle-style calculation cards (point value in the header, grey number fields, green tick / red cross, no partial
      credit), practice by task type and a mock ZH that draws one task per type (56 points)
- [x] Write the Matematika task-type rules into RULES.md
- [x] ~~Upload the Matematika 2. ZH exam note to the Google Drive study-materials folder~~ (dropped by the owner)

## 1.11.0

- [x] A step-by-step derivation ("Levezetés") for every Matematika task, as simple as possible and using only the
      note's methods; write the rule into RULES.md and into the owner's exam-note prompt (`vizsgajegyzet-prompt-altalanos.md`)

## 1.12.0

- [x] New question types for the other subjects' ZHs: többszörös választás (`tobbszoros`, scored per statement in the
      mock ZH), relációanalízis (`relacio`, fixed A–E), kifejtős (`kifejtos`, write then tick the model answer's points);
      text fields in calculation tasks (`accept: "text"`, Számvitel account names); a per-exam mock mix (`mock.mix`)
- [x] A filter change in the URL starts a fresh round (no stale answered card)
- [x] The laptop copy becomes a git clone; RULES.md updated

## 1.13.0

- [x] Take the Közgazdaságtan 1. ZH off the site (written on 2026-10-21) and remove the Moodle practice questions that
      were on the site word for word (`official: true`); new rule in RULES.md: no Moodle item word for word

## 2.0.0

- [x] Version 2.0.0: the site is fed by the daily automation; one short Hungarian line on the Újdonságok page
- [x] Remove the word-for-word Moodle questions from the repository history (history replaced by one commit at 2.0.0,
      old tags and releases deleted)
- [x] Record the 2.1.0 redesign plan in ideas.md; from now on every idea of the owner goes into ideas.md

## 2.0.1

- [x] Hide a ZH that was already written (inactive with a past `date`) from the subject page instead of showing
      "Hamarosan. Az anyaga később kerül fel." (Közgazdaságtan 1. ZH)

## 2.0.2

- [x] Every upcoming ZH's date (from the owner's Google Calendar, checked against `zh-anyagok.md`) on its exam in
      `subjects.json`, for every subject; a countdown on the "Hamarosan" cards too
- [x] Ütemterv: ZH date prefilled from `subjects.json`, the student picks the day they start studying

## 2.0.3

- [x] Mandatory feedback dialog every 3 days from registration (signed out: from the device's first visit), shown when
      the site is opened; the student goes on only after answering; the admin reads them in a "Visszajelzések" tab
      next to "Kérdések" (`supabase/feedback.sql`)
## 2.0.4

- [x] Upload the 2. ZH practice questions of Menedzsment (126), Számvitel (166), Marketing (117), Közösség és egyén (52)
      and the new Matematika task types (chapters 9-23, 75 tasks), with glossaries, exam dates and mock mixes
- [x] Mock ZH of a calculation exam can be limited to some task types (`mock.chapters`); ids may contain a digit in the
      prefix (`ke2-`); typed effects like `Eszk+ Erd-` keep their signs; long field labels get their own row layout

## 2.1.0

- [x] First visit: one-line legal banner with "Részletek"; sign-in prompt only after the first answer
- [x] Home: "Következő ZH" card; "Ma" panel (today's Ütemterv chapters, Ismétlés due, daily streak)
- [x] Menu: only active subjects, the rest in a "Hamarosan" dropdown
- [x] Own colour and line figure per subject (hub hero, ZH card, home hero)
- [x] Subject page: even card grid, every card with a real-data line
- [x] Practice on phones: check/next button stays at the bottom, footer below the screen
- [x] Ütemterv: today open, other days folded, ticked days faded; ticking re-spreads the rest of the material

## Open

- [ ] Later redesign ideas (result card, rewards, ranks, friends, student teachers, several solutions, hints,
      notifications, Fókusz mód): see ideas.md
