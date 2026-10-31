# Ideas

Ideas the owner wants to keep for later. Nothing here is built yet; when one is picked up, it becomes a task in
[docs/TASKS.md](docs/TASKS.md) first. **Every idea the owner mentions goes here** (owner's rule), newest at the top.

## 2.1.0 – redesign (next version)

The owner's plan for the next release: a complete redesign of the site's design and features so it becomes much
better. A major change, so it gets its own minor version, 2.1.0. To be specified with the owner before work starts
(look, navigation, subject and ZH tabs, mobile use, new features); use frontend-design and the agent-skills spec
workflow.

Ideas the owner approved for the redesign on 2026-10-31 (from a review of the live 2.0.3 site):

### Fix first

- **First visit:** today the sign-in dialog and the large legal banner open at the same time and cover the page.
  Make the legal banner one short line with a "Részletek" link (the full text stays in the footer), and ask for
  sign-in only after the first answered question.
- **Home points to the next ZH:** the main button says "Közgazdaságtan gyakorlása" and leads to an empty "Hamarosan"
  page. Replace it with a "Következő ZH" card (subject, ZH, days left) and one button straight to its practice.
- **Menu:** show only active subjects; the "Hamarosan" ones go into one "Hamarosan" dropdown.

### Upgrades

- **"Ma" panel** at the top of the home page: today's Ütemterv chapters, the Ismétlés items due today and a
  streak counter.
- **Own colour and hero figure per subject** (for example a vector or a distribution curve for Matematika instead of
  the economics curve).
- **Even card grid on the subject page:** no half-empty Gyakorlás card and no gaps; every card shows real data
  (progress bar, last result).
- **Practice on phones:** the Ellenőrzés button is fixed at the bottom; the footer does not appear right under the
  question.
- **Ütemterv:** today's day is open and highlighted, the other days are collapsed, finished days are ticked and
  faded. It must not suggest that the other days are locked: every chapter stays open to practise. When a student
  gets ahead of the plan, the remaining material is re-spread over the remaining days automatically.

### Later

- **ZH result card** after a ZH-szimuláció that can be shown to others (score, ring, chapters).
- **Small rewards:** confetti on a streak of 5, a "heti célod kész" badge.
- **Ranks and leaderboard:** badges from bronze and silver up to diamond; every user has a profile card; a
  leaderboard on the site. Opt-in, under a nickname, never the Neptun code or e-mail.
- **Friends and messages:** students can add friends and message each other. Needs blocking, reporting and
  moderation, and a privacy-notice update.
- **Student teachers and videos** (owner's idea): students can apply to be a "tanár" and make videos that explain
  the material more clearly. Needs an application and approval step by the owner, and videos hosted outside the
  site (for example unlisted YouTube links). The videos must not show the ELTE notes, slides or ZH materials
  (copyright, see RULES.md).
- **Several solutions per task type** (Matematika, Számvitel): every task type shows the easiest solution first, so
  students understand it and it does not feel complicated, and other solution methods after it.

## 1. Server-based AI on our own machine for checking typed definitions

Today (since 1.9.0) a typed definition is checked in the student's browser: a key-concept list per term, plus an
optional small language model (~120 MB) that measures how close the meaning is. That model compares, it does not
really understand. This idea replaces it with a larger language model that understands Hungarian and judges the
definition like a teacher would, running on a machine we own.

### 1.1 Where the model can run

- The site stays on GitHub Pages. The page sends the student's answer to our server and gets the verdict back; a
  domain is not needed for this, though it can be used for the server's address.
- Ordinary web hosting (even with 20 GB space) can't run it: it only serves files and PHP. The model needs a program
  that runs all the time with a lot of memory, so it needs a VPS or our own computer, ideally with a GPU.
- The server only gets the question id and the answer text, never the Neptun code or e-mail. It needs a rate limit
  per user, and any key stays on the server (never in the repository).
- Alternative without our own machine: a hosted AI API called from a Supabase Edge Function, key in Supabase
  secrets. Cheaper and better in Hungarian at our scale, but the answers leave our hands.

### 1.2 Hardware for 200 students clicking "Ellenőrzés" at the same moment, answer in at most 1 second

Assumptions (all estimates, to be confirmed with a load test before buying anything):

- Model: an open 7–9 billion parameter model that handles Hungarian, run in 8-bit (FP8) with a batching server
  (for example vLLM). About 9 GB of weights.
- One check: about 300 tokens in (instructions, the term, the model definition, the key concepts, the answer) and a
  verdict of 1–3 tokens out ("jó", "részben", "rossz"). A long written explanation would make decoding the
  bottleneck, so the server only returns the verdict; the site already shows the missing concepts.
- The instructions and the model definition are the same for every student on a term, so the server caches them
  (prefix caching). Only about 80 new tokens per answer are computed.
- 1 second total leaves about 0.8 s for the model after the network.

Calculation:

- Work per token ≈ 2 × parameters ≈ 2 × 8 billion = 16 GFLOP.
- 200 answers × 80 new tokens = 16 000 tokens → 16 000 × 16 GFLOP ≈ 256 TFLOP for the whole burst.
- Done in 0.8 s → about 320 TFLOP/s of real, sustained throughput. GPUs reach roughly half of their datasheet
  figure in practice, so we need about 600–650 TFLOP/s (FP8) on paper.
- Memory: 9 GB weights + working memory for 200 answers × ~400 tokens (about 10 GB) → at least 24 GB of GPU memory,
  better 32 GB or more.

What that means:

| Setup | Roughly enough for 1 s? |
|---|---|
| CPU only (any desktop or VPS without GPU) | No: tens of seconds for such a burst |
| 1 × RTX 4090 (24 GB) | No, about 1.5–2 s for the full burst |
| 2 × RTX 4090 or 1 × RTX 5090 (32 GB) | Borderline, about 1 s |
| 1 × datacenter GPU (L40S 48 GB or H100 80 GB) | Yes, with headroom |

Suggested machine to buy: a desktop or small server with 1 × RTX 5090 (32 GB) or 2 × RTX 4090, 64 GB RAM, an 8+ core CPU, 1 TB NVMe SSD, a 1000 W+ power supply, a UPS, and a wired connection with a fixed
IP or a tunnel. It draws about 1 kW under load, so electricity is a running cost.

- A larger, better-in-Hungarian model (27–32 billion parameters) needs about 4 times the computing power: 2 datacenter
  GPUs for the same 1 second.
- 200 clicks in the very same second is the worst case. In practice clicks are spread out, and the answer store in
  1.3 removes most repeated work, so a smaller machine may do in real use.

### 1.3 Store of answers already judged

- Each definition term gets its model answer and its key-concept list (the mixed-up wordings to look for). This part
  exists already: `concepts` in `glossary.json`.
- Every typed answer is saved, normalized (lowercase, no accents, no punctuation), together with its verdict. The
  next time someone types the same answer, the verdict is looked up instead of asking the model again: instant and
  free.
- New wordings that the model accepts are collected; the admin reviews them and the good ones go into the key-concept
  list, so the in-browser check gets better too.
- Stored without the student's identity (only term, answer, verdict, count), in Supabase behind row-level security;
  the database change is a new non-destructive SQL file.
