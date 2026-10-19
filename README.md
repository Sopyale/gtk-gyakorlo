# GTK gyakorló

Gyakorló kérdésbank az ELTE GTK első féléves tárgyaihoz. Jelenleg a Közgazdaságtan 1. ZH anyaga van fent: 294 kérdés, 74 flashcard, 20 perces ZH-szimuláció.

Élő oldal: https://sopyale.github.io/gtk-gyakorlo/

> Kizárólag saját felhasználásra, nem terjeszthető. Az oldal az ELTE belső oktatási anyagaira épül; az eredeti anyagok szerzői joga az oktatókat és az ELTE GTK-t illeti. A jegyzetek, a tankönyv és a ZH-anyagok **soha nem kerülnek ebbe a repóba**.

## Mit tud

- **Gyakorlás** fejezet és kérdéstípus szerint szűrve, minden válasz után magyarázattal és forrással (jegyzetfejezet, tankönyvoldal).
- **Rontott kérdéseim**: a hibás válaszok ide gyűlnek, és két egymás utáni helyes válasz után lekerülnek.
- **ZH-szimuláció**: 20 perc, 25 kérdés a valódi ZH arányaival (16 igaz–hamis, 5 feleletválasztós, 3 rövid válasz, 1 ábrás), értékelés a végén.
- **Flashcardok** a jegyzet fogalomtárából.
- **Ütemterv**: a ZH dátumából napokra bontja a fejezeteket (a kérdések száma szerint), az utolsó nap ismétlés.
- A haladás csak a böngészőben tárolódik (localStorage). Nincs fiók, nincs szerver, nincs analitika.
- Telepíthető alkalmazásként (PWA), és offline is működik.
- Sötét és világos téma, billentyűparancsok (I/H, 1–4, Enter, szóköz).

## Helyi futtatás

Node 20 kell hozzá.

```bash
npm ci
npm run dev        # fejlesztői szerver: http://localhost:5173/gtk-gyakorlo/
npm test           # a pontozó logika önellenőrzése
npm run build      # adatellenőrzés + éles build a dist/ mappába
npm run preview    # a build megnézése
```

## Kérdések szerkesztése

A kérdések a `src/data/<tárgy>/ch<N>.json` fájlokban vannak, fejezetenként. Egy kérdés:

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

| Típus (`type`) | `answer` | További mezők |
|---|---|---|
| `igaz-hamis` | `true` / `false` | |
| `feleletvalasztos` | a helyes opció szövege | `options`: 4 opció, a helyes is köztük |
| `rovid-valasz` | elfogadott válaszok listája, az első a mintaválasz | `keywords`: kulcskifejezések; ha a válasz tartalmaz egyet, helyesnek számít |
| `parositas` | `[["bal", "jobb"], …]` párok | |
| `abra` | igaz–hamis vagy feleletválasztós válasz | `figure`: ábra azonosítója a `src/figures/index.js`-ből |

Az `official: true` a valódi gyakorló ZH-kérdéseket jelöli. A fogalomtár a `glossary.json`-ban van (`term`, `definition`, `section`).

Build előtt a `npm run check-data` ellenőrzi a mezőket, az ismétlődő azonosítókat és szövegeket, az ábrahivatkozásokat, és hogy a `docs/coverage-plan.md` minden fejezetrészéhez van-e kérdés. Hibás adattal a build nem megy át.

Tartalom csak a feltöltött jegyzetből és tankönyvből kerülhet be. Az ábrák saját rajzolású SVG-k (`src/figures/`), a forrásanyagok képei nem.

## Új tárgy vagy ZH

1. A `src/data/subjects.json`-ban a tárgynál `"active": true`, és töltsd ki a `chapters` és `exams` mezőt.
2. Hozz létre egy `src/data/<tárgy-id>/` mappát `ch<N>.json` és `glossary.json` fájlokkal. A kód magától felveszi őket.
3. Egy új ZH-hoz elég az `exams` listában egy új elem a fejezetszámokkal.

## Közzététel

Minden `main`-re pusholt commit után a GitHub Actions (`.github/workflows/deploy.yml`) lefuttatja a teszteket, buildel, és kiteszi az oldalt a GitHub Pagesre. Az oldal minden lapja `noindex`, a keresők nem indexelik.

## Technika

Vite + React (JavaScript), hash alapú útvonalak, vite-plugin-pwa, lucide-react ikonok, Bricolage Grotesque és Figtree betűk. A specifikáció a [SPEC.md](SPEC.md)-ben van.
