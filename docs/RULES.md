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
3. **Log it.** Add an entry to [log/LOG.md](../log/LOG.md): version, date, what changed and why.
4. **Save a version.** Every shipped change gets a new version number:
   - bump `version` in `package.json` (patch `1.0.x` for fixes and small tweaks, minor `1.x.0` for new features,
     major `x.0.0` for redesigns),
   - commit, push to `main`,
   - tag the commit `vX.Y.Z` and publish a GitHub release with the log entry as its notes.
   The footer shows the version and the commit, so the owner can check what is live.
5. **Copy to the laptop.** Copy the changed files to `D:\Claude\School\Weboldal\gtk-gyakorlo` (the `.github`
   folder can't be written there).

## Content and copyright

- Content comes only from the uploaded note (Zsolnai) and textbook (Andor). Nothing from general knowledge or the web.
- The notes, the textbook, the ZH materials and their images never go into the repository: they are ELTE-internal and
  copyrighted, and the repository is public. Every figure is our own SVG.
- Don't touch the `kuldendo` folder or other files in `D:\Claude\School\Weboldal`.

## Privacy and secrets

- User data (Neptun codes, e-mail addresses, progress) lives only in Supabase, behind row-level security.
  It never goes into the repository, a log, a screenshot or the laptop copy.
- Only the Supabase publishable key may be in the code. Never commit a secret key, the `service_role` key,
  the Google client secret or any password.
- Only admins (`profiles.is_admin`) see the Admin tab and the user list.

## Design

- Every panel and button reacts to the pointer; the site should look premium.
- Animations always run, regardless of the device's reduced-motion setting (owner's choice).
