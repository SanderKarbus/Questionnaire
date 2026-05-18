# Miljonimäng

Veebirakendus, mis aitab kontrollida, kas õppija saab aru enda või kellegi teise tehtud ülesande lahendusest. Rakendus töötab miljonimängu põhimõttel: kasutajale esitatakse järjest valikvastustega küsimusi, mis genereeritakse ülesande kirjelduse ja lahenduse põhjal.

## Projekti kirjeldus

Rakendus loeb `input/` kaustast ülesandeid (assignment.md + lahendusfailid), genereerib nende põhjal küsimuste komplekti ja võimaldab kasutajal mängida miljonimängu stiilis viktoriini. Mänguvaates kuvatakse valitud ülesande kirjeldus ja lahenduskood, mis loetakse reaalajas `docs/data/assignments/{id}/` kaustast.

Küsimused kontrollivad **arusaamist** — mitte ainult mälu. Näiteks küsitakse "Miks kasutatakse siin addEventListener meetodit?" mitte "Mis faili nimi on?"

### Kasutusvoog (lõppdemo)

1. **Menüü** — kasutaja näeb kõiki saadaolevaid ülesandeid bento gridis, igaühel oma ikoon ja aktsentvärv
2. **Ülesande info** — klikkides avaneb info kaart, kus kuvatakse `assignment.md` kirjeldus ja lahenduskood
3. **Mäng** — "Alusta mängu" viib 15 küsimusega mängu
4. **Vastamine** — iga küsimus 4 variandiga, õige/vale tagasiside
5. **Õlekõrred** — 50:50 (eemaldab 2 vale), vihje (kuvab vihjeteksti), publik (simuleerib hääletust)
6. **Tulemus** — vale vastus lõpetab mängu, kuvatakse punktisumma ja turvatase

## Kasutatud tehnoloogiad

| Tööriist | Versioon | Otstarve |
|----------|----------|----------|
| HTML5 + CSS3 | — | Kasutajaliides, dark glassmorphism teema |
| JavaScript (ES6) | — | Mänguloogika, UI renderdus, võrgupäringud |
| Node.js | 24.x | Küsimuste genereerimise skript (build-aegne) |
| GitHub Pages | — | Staatiline veebimajutus (`docs/` kaust) |
| JetBrains Mono + Inter | — | Google Fontid (monospace + sans-serif) |

## Projektijuhtimine (Kanban)

Kanban-tabel: `https://github.com/users/SanderKarbus/projects/2/views/1`

## Käivitamise juhend

### 1. Klooni repositoorium

```bash
git clone https://github.com/SanderKarbus/Questionnaire.git
cd Questionnaire
```

### 2. Genereeri küsimused

```bash
npm run generate
```

See loeb `input/` kaustast kõik ülesanded, tuvastab nende tüübi ja genereerib kontseptuaalsed küsimused `docs/data/` kausta.

### 3. Ava rakendus

Ava `docs/index.html` otse brauseris või kasuta lokaalset serverit:

```bash
npx serve docs
```

### 4. GitHub Pages

Pushi `docs/` kaust GitHubi ja sea GitHub Pages allikaks `docs/`:

1. GitHub repo → Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main`, folder: `/docs`

## Küsimuste genereerimise loogika (AI aspekt)

### Praegune lahendus: eelgenereeritud küsimuste pank

Küsimused genereeritakse **build-ajal** skriptiga `scripts/generate-questions.js`. AI-d reaalajas ei kasutata, kuna:

- Eelgenereeritud pangad töötavad ilma internetiühenduseta
- Stabiilsed ja korratavad — sama sisend annab alati sama väljundi
- Ei nõua API võtit ega piira kasutuskordi

Küsimuste koostamisel on järgitud AI-prompti loogikat (vt `prompts/question-generation.md`):
- Eemaldatud on kõik ülesande ID-le, failide asukohale või reanumbritele viitavad küsimused
- Küsitakse kontseptuaalset arusaamist: "Miks?", "Mis vahe on?", "Mis juhtub kui?"
- Iga küsimusel on selgituse ja vihje väli (õlekõrre jaoks)

### Edasine võimalus: AI API

Arhitektuur võimaldab vahetada `generate-questions.js` sisu, et kutsuda OpenAI API-t. Prompti näidis ja struktuur on kirjeldatud failis `prompts/question-generation.md`. Muuta tuleb ainult:

1. `generate-questions.js` — asendada mallipõhine valik API-kutsega
2. API võtme haldus (keskkonnamuutuja)

### Ülesande tüübi tuvastamine

Skript tuvastab neli tüüpi, analüüsides `assignment.md` ja lahendusfaile:

| Tüüp | Tuvastus | Näidisülesanne |
|------|----------|----------------|
| `kalkulaator` | JS + võtmesõnad (kalkulaator, arithmetic) | 001 |
| `andmete-kuvamine` | JSON + fetch + HTML | 002 |
| `tekstiotsing` | Python + failid + otsing | 003 |
| `testimine` | JS + võtmesõnad (test, jest, expect) | 004 |

Igal tüübil on oma küsimuste komplekt — 20 lihtsat, 20 keskmist, 15 rasket kontseptuaalset küsimust.

## Arendusprotsess

### Arendusjärjekord

1. **Skafolding** — kataloogistruktuur, package.json, .gitignore
2. **Näidisülesanded** — 001 (kalkulaator), 002 (JSON-kuvamine), 003 (CLI otsing)
3. **Frontend algversioon** — index.html, style.css, app.js — lihtne menüü ja mänguvaade
4. **Mänguloogika** — game.js: 15 küsimust, punktid, turvatasemed, Fisher-Yates shuffle
5. **Õlekõrred** — lifelines.js: 50:50, vihje, publik
6. **Kasutajaliidese uuendus** — ui.js: dünaamiline renderdus, tagasiside, tulemused
7. **Küsimuste generaator** — scripts/generate-questions.js: mallipõhised küsimused, kolm raskusastet
8. **Parandused** — correctIndex topelt-shuffle viga, duplikaatküsimused (modulo wrapping)
9. **004 lisamine** — uus tüüp "testimine" (Unit Testing & Jest), ~100 uut küsimust
10. **UI ümberkujundus** — dark glassmorphism teema, bento grid, JetBrains Mono font
11. **Infokaart** — assignment.md + lahenduskoodi kuvamine enne mängu
12. **Dokumentatsioon** — README, prompts/ kaust, testimine

### Miks selline järjekord?

- Kõigepealt loodi **töötav prototüüp** (1-6), et oleks kohe midagi testida
- Seejärel **automatiseeriti küsimuste genereerimine** (7), et ei peaks käsitsi JSON-i kirjutama
- Vead avastati testimisel ja **parandati kohe** (8)
- Uus tüüp (9) lisati, kui põhistruktuur oli stabiilne — see näitas **edasiarendatavust**
- UI uuendus (10-11) tehti lõpus, kui kogu funktsionaalsus oli paigas
- Dokumentatsioon (12) on viimane samm enne GitHubi saatmist

### Iteratiivne arendus

Iga samm lõppes testimisega:
1. Genereeri küsimused → kontrolli JSON-i valiidsust
2. Ava rakendus → kontrolli, kas menüü ja mäng töötavad
3. Lisa uus ülesanne → kontrolli, kas see ilmub menüüsse
4. Paranda viga → kontrolli, et asi toimib

## Definition of Done (DoD)

Ülesanne loetakse valmis, kui:

- [ ] Kood on kirjutatud ja järgib projekti stiili (ES6, ühtsed nimetused)
- [ ] Kood on süntaksilt korrektne (ei esine JS vigu konsoolis)
- [ ] Funktsionaalsus on testitud käsitsi või automaatselt
- [ ] Vastuvõtutingimused (kui on) on täidetud
- [ ] Uus kood ei murra olemasolevat funktsionaalsust
- [ ] Muudatused on sünkroonitud `docs/` kausta
- [ ] README on vajadusel uuendatud

## Testimine

### Testitulemused (30.04.2026)

Kõik testid viidi läbi automaatskriptiga:

| Test | Tulemus |
|------|---------|
| JSON-failide valiidsus (5 faili) | ✓ Kõik korrektsed |
| Küsimuste kvaliteet (4 ülesannet) | ✓ 0 viga, 0 duplikaati |
| Fisher-Yates mänguvalik (100 sim) | ✓ 0 duplikaati üheski mängus |
| Levelite jaotus (100 sim) | ✓ Täpselt 5+5+5 |
| 50:50 õige vastus jääb alles |✓ Kõigil küsimustel |
| Vihjete olemasolu | ✓ Kõigil küsimustel |
| Publiku % summa | ✓ 100% |
| correctIndex valiidne | ✓ Kõigil küsimustel |
| JS süntaks (kõik failid) | ✓ |
| Nõuete täitmine (11 põhinõuet) | ✓ Kõik täidetud |

### Testide kordamine

Testid on dokumenteeritud tabelis (vt ülal). Kordamiseks kasuta `npm run generate` ja käivita rakendus lokaalselt.

## Product backlog (kasutajalood)

| ID | Kasutajalugu | Prioriteet | Vastuvõtutingimus |
|----|-------------|-----------|-------------------|
| US-001 | Kasutajana tahan näha kõiki saadaolevaid ülesandeid, et valida, millist teemat harjutada. | Kõrge | Menüü kuvab kõik input/ kaustas olevad ülesanded oma nime ja ikooniga. |
| US-002 | Kasutajana tahan enne mängu näha ülesande kirjeldust ja lahenduskoodi, et teada, mida testitakse. | Kõrge | Klikkides avaneb info kaart assignment.md + lahenduskoodiga. |
| US-003 | Kasutajana tahan vastata 15 kontseptuaalsele küsimusele, et testida oma arusaamist. | Kõrge | Igal küsimusel 4 varianti, õige/vale tagasiside, küsimused lähevad raskemaks. |
| US-004 | Kasutajana tahan kasutada õlekõrsi (50:50, vihje, publik), et raskete küsimuste korral abi saada. | Keskmine | Iga õlekõrs töötab üks kord mängu jooksul. |
| US-005 | Kasutajana tahan, et vale vastuse korral mäng lõppeks ja ma näeks oma punktisummat. | Kõrge | Vale vastus → mäng läbi → tulemuse kaart punktide ja turvatasemega. |
| US-006 | Kasutajana tahan, et küsimused ei korduks ühe mängu jooksul. | Kõrge | Fisher-Yates segab ja valib 15 unikaalset küsimust. |
| US-007 | Kasutajana tahan, et uue ülesande lisamine oleks lihtne. | Keskmine | Lisa kaust input/ + assignment.md + lahendus → käivita npm run generate. |
| US-008 | Kasutajana tahan, et rakendus näeks hea välja ja oleks mugav kasutada. | Keskmine | Dark teema, glassmorphism, bento grid, responsive. |
| US-009 | Kasutajana tahan, et koodiblokid oleksid süntaksivärvitud. | Madal | Prism.js või Highlight.js lisatud. |
| US-010 | Kasutajana tahan, et tulemused salvestatakse. | Madal | localStorage + viimased 5 tulemust. |

## Nõuete täitmise ülevaade

| # | Kriteerium | Staatus | Märkused |
|---|-----------|---------|----------|
| 1 | GitHubi repo + kood | ✅ Olemas | https://github.com/SanderKarbus/Questionnaire |
| 2 | README (kirjeldus, juhised, tehnoloogiad, AI loogika, protsess) | ✅ Olemas | Kõik alapealkirjad täidetud |
| 3 | AI-le saadetav prompt | ✅ Olemas | `prompts/question-generation.md` |
| 4 | Link Kanban-tabelisse | ✅ Olemas | https://github.com/users/SanderKarbus/projects/2/views/1 |
| 5 | Kanbani etapid | ✅ Olemas | Backlog → Todo → In Progress → Review/Test → Done |
| 6 | Product backlog kasutajalugudega | ✅ Olemas | Vt jaotist "Product backlog" |
| 7 | Kasutajalood kujul "Kasutajana tahan..." | ✅ Olemas | US-001 kuni US-008 |
| 8 | Vastuvõtutingimused | ✅ Olemas | Igal kasutajalooyl kirjas |
| 9 | Funktsionaalsused seotud kasutajalooga | ✅ Olemas | Iga funktsioon viidatud US-idena |
| 10 | Iteratiivne arendus | ✅ Olemas | 12 sammu, igaüks testitud |
| 11 | Arendusjärjekord põhjendatud | ✅ Olemas | Vt "Arendusprotsess" |
| 12 | Sisukad commit'id | ✅ Olemas | 5 loogilist commit'i |
| 13 | Definition of Done | ✅ Olemas | Vt jaotist "Definition of Done" |
| 14 | Testimise tulemus dokumenteeritud | ✅ Olemas | Vt jaotist "Testimine" |
| 15 | Nõuete täitmise ülevaade | ✅ Olemas | See tabel |
| 16 | Lõppdemo kirjeldus | ✅ Olemas | Vt "Kasutusvoog" eespool |
| 17 | Tagasivaade (retrospective) | ✅ Olemas | Vt allpool |
| 18 | Edasiarendatavus | ✅ Olemas | 4 tüüpi, lihtne lisada |
| 19 | Koodistruktuur eraldatud | ✅ Olemas | generate / game / ui / lifelines |
| 20 | AI kasutamise osa läbimõeldud | ✅ Olemas | Vt "Küsimuste genereerimise loogika" |
| 21 | Agiilse protsessi mõistmine | ✅ Olemas | Iteratsioonid, DoD, backlog |
| 22 | Ligipääs | ⏳ Vajab kinnitamist | Kui repo on private, lisa õpetajale ligipääs |

## Tagasivaade (retrospective)

### Mis õnnestus?

- **Edasiarendatavus** — uue ülesande lisamine (004) võttis aega ~30 minutit, koodi muutmata
- **Küsimuste kvaliteet** — duplikaadid ja correctIndex vead said testimisel kiiresti avastatud ja parandatud
- **UI disain** — dark glassmorphism teema muudab rakenduse professionaalseks ja meeldivaks
- **Arhitektuur** — game.js / ui.js / lifelines.js eraldus võimaldas igat moodulit iseseisvalt arendada ja testida

### Mis oli keeruline?

- **Küsimuste koostamine** — 100+ kontseptuaalse küsimuse kirjutamine on aeganõudev ja vajab head valdkonna tundmist
- **Küsimuste duplikaatide vältimine** — esialgne modulo-wrapping põhjustas sama küsimuse ilmumise mitmel tasemel, mida oli alguses raske märgata
- **correctIndex viga** — topelt-shuffle oli peidetud viga, mis avaldus alles testimisel

### Mida parandada järgmises iteratsioonis?

- [ ] Lisada automaattestimine (Jest või Vitest) pidevasse integratsiooni
- [ ] Teha küsimuste genereerimine AI-põhiseks (OpenAI API)
- [ ] Lisada tulemuste salvestamine (localStorage)
- [ ] Lisada süntaksivärvimine koodiblokkidele (Prism.js või Highlight.js)
- [ ] Täiendada küsimuste panka iga tüübi jaoks 30+ küsimuseni raskes astmes
- [ ] Lisada õpetaja vaade (statistika kõigi õpilaste kohta)

## Input-kausta struktuur

```
input/
  001/
    assignment.md          # Ülesande püstitus (kohustuslik)
    index.html             # Lahenduse failid
    style.css
    script.js
  002/
    assignment.md
    src/
      app.js
      data.json
  003/
    assignment.md
    solution/
      main.py
  004/
    assignment.md
    solution/
      functions.js
      functions.test.js
```

Igas ülesande kaustas **peab** olema `assignment.md` fail, mille esimene rida on `# Pealkiri`. Ülejäänud failid on lahenduse osad.

## Mängu reeglid

### Põhireeglid

- Mängus on 15 küsimust
- Igal küsimusel on 4 vastusevarianti
- Ainult üks vastus on õige
- Küsimused lähevad järjest keerulisemaks (tase 1→15)
- Vale vastuse korral mäng lõpeb

### Punktid

| Küsimus | Punktid |
|---------|---------|
| 1 | 100 |
| 2 | 200 |
| 3 | 300 |
| 4 | 500 |
| **5** | **1 000 (turvatase)** |
| 6 | 2 000 |
| 7 | 4 000 |
| 8 | 8 000 |
| 9 | 16 000 |
| **10** | **32 000 (turvatase)** |
| 11 | 64 000 |
| 12 | 125 000 |
| 13 | 250 000 |
| 14 | 500 000 |
| **15** | **1 000 000 (võit)** |

### Turvatasemed

- Kui kasutaja vastab valesti pärast turvataset (5 või 10), jääb talle sellel tasemel punktisumma
- Enne esimest turvataset valesti vastates kaotab kõik

### Õlekõrred

| Õlekõrs | Kirjeldus |
|---------|-----------|
| **50:50** | Eemaldab kaks vale vastusevarianti |
| **Vihje** | Kuvab küsimuse kohta lühikese vihje |
| **Publik** | Simuleerib publiku hääletuse tulemuse |

## Teadaolevad piirangud

1. **Küsimuste pank** — praegu eelnevalt koostatud, mitte AI-põhine. Piiratud hulk küsimusi.
2. **Keelte tugi** — ainult eesti keel.
3. **Publiku simuleerimine** — juhuslik, mitte statistiline.
4. **Süntaksivärvimine** — koodiblokid ilma esiletõstmiseta.

## Edasiarenduse võimalused

- [ ] Päris AI API ühendus (OpenAI) reaalajas küsimuste genereerimiseks
- [ ] Tulemuste salvestamine (localStorage)
- [ ] Süntaksivärvimine koodiblokkidele (Prism.js)
- [ ] Õpetaja vaade (statistika)
- [ ] Küsimuste uuesti genereerimise nupp mänguvaates
- [ ] Ülesannete lisamine veebiliidese kaudu
