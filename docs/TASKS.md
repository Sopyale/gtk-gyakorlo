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

## Open
