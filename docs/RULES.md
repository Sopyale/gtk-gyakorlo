# Project rules

Every session that works on this site reads this file first and follows it. The owner (Kristóf) sets these rules;
add new ones here when he gives them.

## Language

- Talk to the owner in Hungarian.
- Write code, comments, commit messages and every `.md` file in English.
- The site's UI text stays Hungarian.

## Workflow for every change

1. **Write the task down first.** Every change the owner asks for becomes a new task in [TASKS.md](TASKS.md)
   (in English) before any code changes. Tick it off when it ships.
2. **Keep the docs current.** If the change affects what the site does, update [SPEC.md](../SPEC.md) and
   [README.md](../README.md) in the same commit.
3. **Log it.** Add an entry to [log/LOG.md](../log/LOG.md): version, date, what changed and why. If students
   would notice the change, also add a short Hungarian line to `src/data/changelog.json` (the Újdonságok page). Keep it to the notable
   changes, one short sentence each, no explanations (owner's rule).
4. **Save a version.** Every shipped change gets a new version number:
   - bump `version` in `package.json` (patch `1.0.x` for fixes and small tweaks, minor `1.x.0` for new features,
     major `x.0.0` for redesigns),
   - commit, push to `main`,
   - the Release workflow then tags the commit `vX.Y.Z` and publishes a GitHub release with the log entry as its notes
     (this session can't create tags itself).
   The footer shows the version and the commit, so the owner can check what is live.
5. **The laptop copy is a git clone.** Since 1.12.0 `D:\Claude\School\Weboldal\gtk-gyakorlo` is a clone of this
   repository. Work there (or `git pull` first when working elsewhere) and push to `main`; nothing is copied by hand.
   The owner's study-material agents (`D:\Claude\School\.claude\agents\weboldal.md`) upload new question banks this way.

## Tasks and ideas

- Every request of the owner first goes into [TASKS.md](TASKS.md) and every session reads TASKS.md before working.
- Every idea the owner mentions goes into [ideas.md](../ideas.md), even if nobody works on it yet.

## Plugins

Always use the installed plugins where they fit (owner's rule):
- **agent-skills**: spec, planning, incremental build, testing, code review, security and hardening, shipping.
- **frontend-design**: every visual change.
- **webapp-testing**: check every UI change with Playwright at 360 px and 1280 px in both themes before shipping.
- **ponytail**: smallest complete change, no unneeded code.
- **graphify**: map the codebase before larger changes and keep the graph current (`graphify-out/`).

## Content and copyright

- Content comes only from the uploaded note (Zsolnai) and textbook (Andor). Nothing from general knowledge or the web.
- The notes, the textbook, the ZH materials and their images never go into the repository: they are ELTE-internal and
  copyrighted, and the repository is public. Every figure is our own SVG.
- Don't touch the `kuldendo` folder or other files in `D:\Claude\School\Weboldal`.

## Question bank for every subject and ZH (owner's rule)

Do this on your own for every subject and every ZH, without being asked again:
1. When the owner uploads a practice ZH (próba-ZH) for a subject, read it first, together with the lecturer's ZH
   description if there is one. Note its question types, wording, traps, difficulty and figures.
2. Cover the whole ZH material with questions that closely resemble the practice ZH: same types, same style, same level.
   Many figure questions if the ZH has them (our own SVG figures of the textbook's figures).
3. Keep only ZH-like questions. Remove anything that doesn't resemble the ZH: types the ZH doesn't use (for example
   matching), trivia about the sources ("a könyv szerint", author names), giveaways and near-duplicates.
   Never put Moodle practice-test, practice-ZH or példatár items on the site word for word (owner's rule since 1.13.0:
   he could be penalised, and the repository is public). Write similar questions from the note with their own wording,
   word order, names, numbers and option order.
4. Content still comes only from that subject's note and textbook; explanations say in plain words why the answer is
   right. Check answer keys and explanations against the sources.
5. Use the question types the ZH uses: igaz-hamis, feleletvalasztos (also kakukktojás), rovid-valasz (also esettörténet,
   definition completion), parositas, abra, szamolas (Számvitel account grids with `accept: "text"` fields),
   tobbszoros, relacio, kifejtos (also "fogalom + indoklás"). Set the exam's mock mix in `subjects.json` (`mock.mix`).
6. Short (typed) answers accept other wording: endings, word order and small typos are matched automatically, and the
   student can mark "Más szavakkal, de ugyanezt írtam". Give every short-answer question its usual alternative
   spellings in `answer`.

## Matematika: task types (owner's rule)

Matematika ZHs are calculation tasks, not the true/false and multiple-choice questions above. For every Matematika ZH:
1. The bank is built from the owner's `gyakorlo_feladatok.md` (in `D:\Claude\School\Matematika`), which is generated
   from the practice ZH and the exam note. Put on the site only the tasks in that file, never the original ZH tasks.
2. Task types are exactly the practice ZH's types (2. ZH: vectors' linear dependence 3 p, inclusion–exclusion for two
   events 5 p, dice expected value and first success 10 p, two bags with total probability and Bayes 10 p, compound
   interest 3 p, two-state process 10 p, discrete distribution q / E(X) / D(X) 10 p, licence plates as variations 5 p).
   Every type has 5 own variants with their own story and wording, not the same text with new numbers.
3. One task = one `szamolas` question in the chapter of its type: the point value from the ZH, one number field per
   sub-question with its format ("tizedestört", "tört vagy tizedestört", "egész szám (Ft)" …) and the solution.
   Every answer is recalculated before it goes in (`npm run check-data` checks each field accepts its own answer).
4. Every task has a numbered step-by-step derivation (`steps`, shown as "Levezetés"), written in the simplest possible
   way: the data with notation, the method and the note section it comes from, the numbers substituted, every
   intermediate result, the final answer in the asked format. Use only the note's methods and notation (e.g. the tree
   diagram for Bayes); if a task needs something the note doesn't cover, say so in `explanation` (the one-line
   method). Every number in the derivation is recalculated by a script and must match the answer key.
5. Answer boxes look like the Moodle ZH: card with number and points, grey fields, green tick or red cross.
   No partial credit: a task scores only when every field is right.
6. Accept a decimal comma or point, spaces as thousands separators, fractions only where the format allows them,
   decimals within ±0.001, whole numbers exactly; a percentage where a decimal is asked is wrong.
7. The mock ZH draws one task per type with the ZH's points. Content still comes only from the subject's note and
   practice tasks; new weeks' material for a later ZH is added the same way when the owner sends a new task file.

## Privacy and secrets

- User data (Neptun codes, e-mail addresses, progress) lives only in Supabase, behind row-level security.
  It never goes into the repository, a log, a screenshot or the laptop copy.
- Only the Supabase publishable key may be in the code. Never commit a secret key, the `service_role` key,
  the Google client secret or any password.
- Only admins (`profiles.is_admin`) see the Admin tab, the user list and the tickets.
- Never re-run `supabase/schema.sql` on the live project: it deletes every profile. Database changes go in a new,
  non-destructive SQL file that the owner runs once.

## Design

- Every panel and button reacts to the pointer; the site should look premium.
- Animations always run, regardless of the device's reduced-motion setting (owner's choice).
