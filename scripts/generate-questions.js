/**
 * Küsimuste genereerimise skript — kontseptuaalsed küsimused.
 *
 * Tuvastab iga ülesande tüübi (kalkulaator, andmete-kuvamine, tekstiotsing)
 * ja genereerib loomulikke, kontseptuaalseid küsimusi, mis testivad
 * arusaamist, mitte mälu.
 *
 * Käivitus: node scripts/generate-questions.js
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..', 'input');
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'data');

function readFile(fp) {
  try { return fs.readFileSync(fp, 'utf-8'); } catch { return ''; }
}

function listNumberedFolders(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(n => /^\d{3,}$/.test(n)).sort();
}

function getAllFiles(dir) {
  const r = [];
  if (!fs.existsSync(dir)) return r;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) r.push(...getAllFiles(fp));
    else if (e.isFile() && e.name !== 'assignment.md') r.push(fp);
  }
  return r;
}

function extractTitle(md) {
  const m = md.match(/^#\s+(.+)/m);
  return m ? m[1].trim() : 'Tundmatu ülesanne';
}

function detectAssignmentType(assignmentMd, solutionFiles) {
  const allContent = assignmentMd + '\n' + solutionFiles.map(f => f.content).join('\n');
  const lower = allContent.toLowerCase();
  const exts = solutionFiles.map(f => path.extname(f.path).toLowerCase());

  const hasPython = exts.includes('.py');
  const hasJS = exts.includes('.js');
  const hasHTML  = exts.includes('.html');
  const hasJSON  = exts.includes('.json');
  const hasCSS   = exts.includes('.css');

  // Detect calculator
  if ((lower.includes('kalkulaator') || lower.includes('calculator') || lower.includes('arithmetic')) && hasJS) {
    return 'kalkulaator';
  }

  // Detect data display
  if (hasJSON && hasJS && (lower.includes('json') || lower.includes('fetch') || lower.includes('kuvamine') || lower.includes('display') || lower.includes('table'))) {
    return 'andmete-kuvamine';
  }

  // Detect CLI / Python text search
  if (hasPython && (lower.includes('otsing') || lower.includes('search') || lower.includes('teadmus') || lower.includes('knowledge') || lower.includes('vestlus') || lower.includes('chat') || lower.includes('cli') || lower.includes('käsurida'))) {
    return 'tekstiotsing';
  }

  // Detect unit testing / Jest
  if (hasJS && (lower.includes('test') || lower.includes('jest') || lower.includes('unit testing') || lower.includes('ühiktest') || lower.includes('matcher') || lower.includes('describe') || lower.includes('expect'))) {
    return 'testimine';
  }

  // Fallback by extension
  if (hasPython) return 'tekstiotsing';
  if (hasJS && hasHTML) return 'andmete-kuvamine';
  if (hasJS) return 'kalkulaator';

  return 'üldine';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Küsimuste komplektid tüübi järgi ─────────────────────────────

const questionSets = {

  kalkulaator: {
    easy: [
      {
        q: 'Millist HTML elementi kasutatakse kõige sagedamini nuppude tegemiseks?',
        options: ['<button>', '<div>', '<span>', '<a>'],
        correct: 0,
        hint: 'Milline HTML-element on mõeldud just klikkimise jaoks?'
      },
      {
        q: 'Kuidas teisendada string "10" numbriks 10 JavaScriptis?',
        options: ['parseInt() või Number()', 'toString()', 'toFixed()', 'toNumber()'],
        correct: 0,
        hint: 'parse-sõnaga funktsioon teisendab teksti arvuks.'
      },
      {
        q: 'Millise sündmusega reageeritakse nupuvajutusele JavaScriptis?',
        options: ['click', 'hover', 'press', 'change'],
        correct: 0,
        hint: 'Hiireklõpsu sündmus.'
      },
      {
        q: 'Mis märk tähistab JavaScriptis korrutamist?',
        options: ['*', 'x', '.', '#'],
        correct: 0,
        hint: 'Tärn klaviatuuril.'
      },
      {
        q: 'Kuidas kuvada tulemust HTML elemendis, mille ID on "vastus"?',
        options: [
          'document.getElementById("vastus").textContent = tulemus;',
          'document.find("vastus") = tulemus;',
          'get.element("vastus").value = tulemus;',
          'display("vastus", tulemus);'
        ],
        correct: 0,
        hint: 'getElementById on meetod elemendi leidmiseks.'
      },
      {
        q: 'Mis juhtub, kui proovid jagada nulliga JavaScriptis?',
        options: ['Tulemus on Infinity', 'Tekib viga (Error)', 'Tulemus on 0', 'Tulemus on undefined'],
        correct: 0,
        hint: 'Nulliga jagamisel ei teki viga, aga tulemus on lõpmatus.'
      },
      {
        q: 'Kuidas lisada JavaScriptis nupule funktsioon, mis käivitub klikkimisel?',
        options: [
          'addEventListener("click", funktsioon)',
          'onhover="funktsioon()"',
          'onpress="funktsioon()"',
          'onchange="funktsioon()"'
        ],
        correct: 0,
        hint: 'addEventListener on JavaScripti meetod sündmuste kuulamiseks.'
      },
      {
        q: 'Mis on tulemus 5 + 3 JavaScriptis?',
        options: ['8', '53', '35', 'Error'],
        correct: 0,
        hint: 'Tavaline aritmeetiline liitmine.'
      },
      {
        q: 'Kuidas deklareerida JavaScriptis muutuja?',
        options: ['let', 'var', 'const', 'Kõik eelnevad'],
        correct: 3,
        hint: 'Kõik kolm on JavaScriptis muutuja deklareerimise viisid.'
      },
      {
        q: 'Mis vahe on let ja const vahel?',
        options: [
          'const väärtust ei saa muuta, let väärtust saab',
          'let väärtust ei saa muuta, const väärtust saab',
          'Vahet pole, mõlemad on samad',
          'const on vanem kui let'
        ],
        correct: 0,
        hint: 'const tuleb sõnast constant ehk konstant.'
      },
      {
        q: 'Mida teeb operaator + kahe teksti vahel?',
        options: ['Liidab tekstid kokku', 'Liidab numbrid kokku', 'Tagastab vea', 'Korrutab tekstid'],
        correct: 0,
        hint: 'Tekstide liitmist nimetatakse konkatenatsiooniks.'
      },
      {
        q: 'Kuidas kommenteerida ühte rida JavaScriptis?',
        options: ['//', '/*', '#', '<!--'],
        correct: 0,
        hint: 'Kahte kaldkriipsu kasutatakse üherealiseks kommentaariks.'
      },
      {
        q: 'Milleks kasutatakse CSS-i veebilehel?',
        options: [
          'Välimuse ja kujunduse määramiseks',
          'Andmete salvestamiseks',
          'Loogika kirjutamiseks',
          'Serveriga suhtlemiseks'
        ],
        correct: 0,
        hint: 'CSS = Cascading Style Sheets.'
      },
      {
        q: 'Kuidas käivitada funktsioon JavaScriptis?',
        options: ['funktsioon()', 'execute funktsioon', 'run funktsioon', 'call.funktsioon'],
        correct: 0,
        hint: 'Funktsiooni nime järel kasutatakse sulge.'
      },
      {
        q: 'Mis tüüpi on väärtus "tere" JavaScriptis?',
        options: ['string', 'number', 'boolean', 'object'],
        correct: 0,
        hint: 'Tekstiväärtusi nimetatakse stringideks.'
      },
      {
        q: 'Mida teeb alert() funktsioon?',
        options: [
          'Kuvab hüpikakna teatega',
          'Salvestab andmed faili',
          'Saadab päringu serverisse',
          'Kustutab lehel oleva teksti'
        ],
        correct: 0,
        hint: 'alert tähendab hoiatust.'
      },
      {
        q: 'Kuidas kirjutada tingimuslause JavaScriptis?',
        options: ['if (tingimus) { ... }', 'when (tingimus) { ... }', 'condition (tingimus) { ... }', 'case (tingimus) { ... }'],
        correct: 0,
        hint: 'if on ingliskeelne sõna "kui" jaoks.'
      },
      {
        q: 'Mis väärtus on tõeväärtus "true" vastand?',
        options: ['false', '0', 'null', 'undefined'],
        correct: 0,
        hint: 'true ja false on JavaScripti tõeväärtused.'
      },
      {
        q: 'Mida tähendab lühend HTML?',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'HyperText Modern Links',
          'Home Tool Markup Language'
        ],
        correct: 0,
        hint: 'HTML on veebilehtede loomise standard.'
      },
    ],

    medium: [
      {
        q: 'Mis on tulemus 1 + "1" JavaScriptis?',
        options: ['"11"', '2', '"2"', 'Error'],
        correct: 0,
        hint: 'Kui üks operandidest on tekst, toimub sõnede liitmine.'
      },
      {
        q: 'Kuidas ümardada arv 10.567 kahe komakohani?',
        options: ['.toFixed(2)', '.round(2)', '.limit(2)', '.parseInt(2)'],
        correct: 0,
        hint: 'Fixed tähendab fikseeritud komakohtade arvu.'
      },
      {
        q: 'Kuidas vältida, et kasutaja saab sisestada mitu koma (nt "10..5")?',
        options: [
          'Kontrollida includes(".") abil, kas punkt juba sisaldub',
          'JavaScript keelab selle automaatselt',
          'Kasutada toFixed()',
          'Kasutada parseInt()'
        ],
        correct: 0,
        hint: 'includes() kontrollib, kas sõne sisaldab antud märki.'
      },
      {
        q: 'Mis juhtub, kui kasutaja sisestab kalkulaatorisse numbri asemel teksti?',
        options: [
          'parseFloat() tagastab NaN ja tulemus kuvab veateate',
          'Programm jookseb kokku',
          'Tekst teisendatakse automaatselt numbriks',
          'Midagi ei juhtu, arvutus tehakse ikkagi'
        ],
        correct: 0,
        hint: 'Kui teksti ei saa arvuks teisendada, on tulemuseks NaN (Not a Number).'
      },
      {
        q: 'Miks on vaja kasutaja sisend enne arvutamist arvuks teisendada?',
        options: [
          'Sest HTML input väljalt loetakse alati tekst, mitte arv',
          'Sest muidu läheb brauser kokku',
          'Sest JavaScript ei oska teksti lugeda',
          'Sest arvutused tehakse serveris'
        ],
        correct: 0,
        hint: 'Mis tüüpi on HTML input elemendi .value?'
      },
      {
        q: 'Mis vahe on == ja === operaatoritel JavaScriptis?',
        options: [
          '== võrdleb ainult väärtust, === võrdleb väärtust ja tüüpi',
          '== on kiirem kui ===',
          '=== on ainult numbrite jaoks',
          'Vahet pole, nad teevad sama asja'
        ],
        correct: 0,
        hint: 'Kolme võrdusmärgiga kontrollitakse ka tüüpi.'
      },
      {
        q: 'Kuidas kustutada stringilt viimane märk?',
        options: ['slice(0, -1)', 'deleteLast()', 'pop()', 'trim()'],
        correct: 0,
        hint: 'slice meetodiga saab lõigata stringi osa.'
      },
      {
        q: 'Miks on ohtlik kasutada eval() funktsiooni kalkulaatoris?',
        options: [
          'Sest eval() käivitab suvalise JavaScripti koodi, mis võib olla turvarisk',
          'Sest eval() on aeglane',
          'Sest eval() ei tööta brauseris',
          'Sest eval() tagastab alati vale tulemuse'
        ],
        correct: 0,
        hint: 'eval tähendab evaluate ehk "arvuta", aga see võib arvutada ka koodi.'
      },
      {
        q: 'Mida teeb typeof operaator?',
        options: [
          'Tagastab muutuja andmetüübi',
          'Teisendab muutuja tüüpi',
          'Kustutab muutuja',
          'Kontrollib, kas muutuja on defineeritud'
        ],
        correct: 0,
        hint: 'typeof "tere" tagastab "string".'
      },
      {
        q: 'Miks kuvatakse tulemus NaN, kui arvutada "abc" * 5?',
        options: [
          'Sest teksti ei saa arvuga korrutada',
          'Sest JavaScriptis on viga',
          'Sest korrutamine pole lubatud',
          'Sest tulemus on liiga suur'
        ],
        correct: 0,
        hint: 'NaN = Not a Number.'
      },
      {
        q: 'Kuidas kontrollida, kas muutuja on arv?',
        options: [
          'isNaN() või typeof === "number"',
          'isNumber()',
          'checkNumber()',
          'equalsNumber()'
        ],
        correct: 0,
        hint: 'isNaN kontrollib, kas väärtus EI OLE number.'
      },
      {
        q: 'Mis on tulemus "5" - 3 JavaScriptis?',
        options: ['2', '"53"', '"5-3"', 'Error'],
        correct: 0,
        hint: 'Miinus operaator teisendab stringid automaatselt numbriteks.'
      },
      {
        q: 'Kuidas lisada HTML-element JavaScriptiga lehele?',
        options: [
          'document.createElement() ja appendChild()',
          'document.addElement()',
          'document.insertHTML()',
          'document.newElement()'
        ],
        correct: 0,
        hint: 'createElement loob uue elemendi, appendChild lisab selle lehele.'
      },
      {
        q: 'Mida teeb switch-lause?',
        options: [
          'Võimaldab valida mitme variandi vahel',
          'Lülitab valgust sisse ja välja',
          'Vahetab muutujate väärtusi',
          'Katkestab tsükli'
        ],
        correct: 0,
        hint: 'Switch on nagu mitu if-else lauset koos.'
      },
      {
        q: 'Mis vahe on while ja for tsüklil?',
        options: [
          'for kasutab loendurit, while töötab tingimusega',
          'while on kiirem kui for',
          'for töötab ainult massiividega',
          'Vahet pole, mõlemad on samad'
        ],
        correct: 0,
        hint: 'for (let i = 0; i < 5; i++) on tüüpiline for tsükkel.'
      },
      {
        q: 'Mida teeb return lause funktsioonis?',
        options: [
          'Tagastab väärtuse ja lõpetab funktsiooni',
          'Prindib väärtuse konsooli',
          'Salvestab väärtuse muutujasse',
          'Käivitab funktsiooni uuesti'
        ],
        correct: 0,
        hint: 'Ilma returnita tagastab funktsioon undefined.'
      },
      {
        q: 'Kuidas võrrelda kahte massiivi JavaScriptis?',
        options: [
          'Massiive ei saa otseselt == operaatoriga võrrelda',
          'Massiive saab võrrelda == operaatoriga',
          'Massiive saab võrrelda === operaatoriga',
          'Massiive ei saa üldse võrrelda'
        ],
        correct: 0,
        hint: '== võrdleb massiivide puhul viiteid, mitte sisu.'
      },
    ],

    hard: [
      {
        q: 'Mida teeb e.target.value sündmuse käitlejas?',
        options: [
          'Tagastab selle elemendi väärtuse, millel sündmus toimus',
          'Tagastab kogu lehe HTML-i',
          'Tagastab sündmuse tüübi',
          'Tagastab brauseri nime'
        ],
        correct: 0,
        hint: 'target viitab elemendile, mis sündmuse põhjustas.'
      },
      {
        q: 'Mis on parim viis kalkulaatori nuppude sündmuste haldamiseks ilma igale nupule eraldi onclick lisamata?',
        options: [
          'Sündmuste delegeerimine (event delegation) konteinerile',
          'Kirjutada iga nupu jaoks eraldi funktsioon',
          'Kasutada eval() kõigi nuppude jaoks',
          'Kasutada document.write()'
        ],
        correct: 0,
        hint: 'Delegeerimine tähendab, et sündmust kuulatakse ülemiselemendil.'
      },
      {
        q: 'Miks annab 0.1 + 0.2 JavaScriptis tulemuseks 0.30000000000000004?',
        options: [
          'Sest ujukomaarvude täpsus on piiratud (IEEE 754 standard)',
          'Sest JavaScriptis on viga',
          'Sest 0.1 + 0.2 on tegelikult 0.30000000000000004',
          'Sest brauser ümardab valesti'
        ],
        correct: 0,
        hint: 'Arvutid esitavad murde kahendsüsteemis, mis pole alati täpne.'
      },
      {
        q: 'Kuidas tagada, et klaviatuurilt numbrite sisestamine töötaks kalkulaatoris?',
        options: [
          'Kuulata keydown sündmust ja kontrollida, kas sisestatud märk on number',
          'Kasutada <input type="number">',
          'JavaScript keelab automaatselt tähtede sisestamise',
          'Pole võimalik, kalkulaator töötab ainult hiirega'
        ],
        correct: 0,
        hint: 'keydown sündmus käivitub iga klahvivajutusega.'
      },
      {
        q: 'Milline probleem tekib, kui kasutada nuppude jaoks <div> elementi <button> asemel?',
        options: [
          '<div> ei ole vaikimisi fokuseeritav ega klaviatuuriga ligipääsetav',
          '<div> on aeglasem kui <button>',
          '<div> ei saa üldse klikkida',
          '<div> muudab lehe välimust'
        ],
        correct: 0,
        hint: '<button>-element on vaikimisi klaviatuuriga juhitav.'
      },
      {
        q: 'Mis juhtub, kui kalkulaatoris ei kontrollita jagamist nulliga?',
        options: [
          'Tulemus on Infinity, mis võib edasistes arvutustes põhjustada ootamatuid tulemusi',
          'Programm lõpetab töö',
          'Brauser kuvab veateate',
          'Tulemus on alati 0'
        ],
        correct: 0,
        hint: 'Infinity pluss midagi on ikka Infinity.'
      },
      {
        q: 'Kuidas muuta kalkulaatorit nii, et see töötaks ka klaviatuuri numbriklahvidega?',
        options: [
          'Lisada keydown sündmusekuulaja kogu lehele ja kontrollida klahvi koodi',
          'Pole võimalik, kalkulaator töötab ainult nupuvajutustega',
          'Lisada igale numbrile eraldi keydown kuulaja',
          'Kasutada setTimeout() funktsiooni'
        ],
        correct: 0,
        hint: 'Sündmusekuulaja saab lisada kogu dokumendile.'
      },
      {
        q: 'Mis on sulund (closure) JavaScriptis?',
        options: [
          'Funktsioon, mis mäletab oma väliskeskkonna muutujaid ka pärast seda, kui välisfunktsioon on lõpetanud',
          'Funktsioon, mis sulgeb brauseri akna',
          'Massiivi elementide sulgemine',
          'HTML elemendi sulgemine'
        ],
        correct: 0,
        hint: 'Closure võimaldab funktsioonil "mäletada" oma loomiskeskkonda.'
      },
      {
        q: 'Mida teeb this võtmesõna JavaScriptis?',
        options: [
          'Viitab kontekstile, kus funktsioon käivitatakse',
          'Viitab alati globaalsele objektile',
          'Viitab alati funktsioonile endale',
          'Viitab HTML dokumendile'
        ],
        correct: 0,
        hint: 'this väärtus sõltub sellest, kuidas funktsiooni kutsutakse.'
      },
      {
        q: 'Miks on oluline eemaldada sündmusekuulajad, kui elementi enam pole?',
        options: [
          'Et vältida mälulekkeid (memory leaks) ja tarbetut töötlust',
          'Sest muidu jookseb brauser kokku',
          'Sest elemente ei saa kustutada',
          'Sest see aeglustab Interneti ühendust'
        ],
        correct: 0,
        hint: 'Eemaldamata kuulajad hoiavad elemente mälus.'
      },
      {
        q: 'Kuidas takistada veebilehel teksti valimist (selection) kasutaja poolt?',
        options: [
          'CSS-iga user-select: none',
          'JavaScript-iga blockSelect()',
          'HTML-iga disableSelection',
          'Seda pole võimalik takistada'
        ],
        correct: 0,
        hint: 'CSS omadus user-select kontrollib teksti valimist.'
      },
      {
        q: 'Milline probleem tekib, kui kasutada kalkulaatoris globaalseid muutujaid?',
        options: [
          'Globaalseid muutujaid saab muuta iga funktsioon, mis võib põhjustada ootamatuid vigu',
          'Globaalsed muutujad töötavad aeglasemalt',
          'Globaalseid muutujaid ei saa kustutada',
          'Globaalsed muutujad ei tööta brauseris'
        ],
        correct: 0,
        hint: 'Globaalsed muutujad on nähtavad kogu programmi ulatuses.'
      },
      {
        q: 'Mis on erinevus atribuudil (attribute) ja omadusel (property) DOM-is?',
        options: [
          'Atribuudid on HTML-is, omadused on JavaScripti objektidel',
          'Vahet pole, mõlemad on samad',
          'Omadused on HTML-is, atribuudid on JavaScriptis',
          'Atribuudid on ainult CSS-is'
        ],
        correct: 0,
        hint: 'HTML elemendil on atribuudid, JavaScripti objektidel on omadused.'
      },
      {
        q: 'Miks võib kalkulaatori kuvale tekkida kummalisi ümardamisvigu?',
        options: [
          'Sest ujukomaarvud on kahendsüsteemis lõpmatud murrud, mida ei saa täpselt esitada',
          'Sest brauser ümardab valesti',
          'Sest JavaScript on aeglane',
          'Sest kalkulaator kasutab vale matemaatikat'
        ],
        correct: 0,
        hint: '0.1 + 0.2 != 0.3 on kuulus näide.'
      },
    ],
  },

  'andmete-kuvamine': {
    easy: [
      {
        q: 'Mis on JSON?',
        options: [
          'Tekstipõhine andmevahetusvorming',
          'Programmeerimiskeel',
          'Andmebaasi tüüp',
          'CSS raamistik'
        ],
        correct: 0,
        hint: 'JSON on lühend sõnadest JavaScript Object Notation.'
      },
      {
        q: 'Kuidas laadida brauseris andmeid JSON-failist?',
        options: ['fetch() abil', 'import() abil', 'require() abil', 'loadJSON() abil'],
        correct: 0,
        hint: 'See funktsioon teeb võrgupäringu ja tagastab Promise\'i.'
      },
      {
        q: 'Millist JavaScripti meetodit kasutatakse massiivi elementide filtreerimiseks?',
        options: ['filter()', 'find()', 'search()', 'select()'],
        correct: 0,
        hint: 'filter() loob uue massiivi ainult sobivatest elementidest.'
      },
      {
        q: 'Milleks kasutatakse HTML tabelit veebilehel?',
        options: [
          'Andmete kuvamiseks ridade ja veergudena',
          'Piltide paigutamiseks',
          'Menüü loomiseks',
          'Vormi saatmiseks'
        ],
        correct: 0,
        hint: 'Tabel koosneb ridadest (tr) ja veergudest (td).'
      },
      {
        q: 'Kuidas leida HTML element selle ID järgi?',
        options: [
          'document.getElementById("id")',
          'document.find("#id")',
          'document.locate("id")',
          'document.search("id")'
        ],
        correct: 0,
        hint: 'getElementById on kõige levinum meetod.'
      },
      {
        q: 'Mida teeb .then() meetod Promise\'i puhul?',
        options: [
          'Käivitab funktsiooni, kui Promise on edukalt täidetud',
          'Katkestab Promise\'i',
          'Saadab päringu uuesti',
          'Tagastab vea'
        ],
        correct: 0,
        hint: 'Promise täitub kas edukalt või veaga.'
      },
      {
        q: 'Milleks kasutatakse HTML-s <table> elementi?',
        options: [
          'Tabeli loomiseks',
          'Pildi lisamiseks',
          'Vormi saatmiseks',
          'Stiili määramiseks'
        ],
        correct: 0,
        hint: 'Table tähendab tabelit.'
      },
      {
        q: 'Mis on API?',
        options: [
          'Liides, mis võimaldab erinevatel tarkvaradel omavahel suhelda',
          'Programmeerimiskeel',
          'Andmebaasi tüüp',
          'Veebilehtede loomise tööriist'
        ],
        correct: 0,
        hint: 'API = Application Programming Interface.'
      },
      {
        q: 'Mida tähendab HTTP?',
        options: [
          'HyperText Transfer Protocol',
          'High Tech Transfer Protocol',
          'HyperText Transfer Program',
          'Home Tool Transfer Protocol'
        ],
        correct: 0,
        hint: 'See on protokoll veebilehtede edastamiseks.'
      },
      {
        q: 'Mis on JavaScripti massiiv?',
        options: [
          'Andmestruktuur mitme väärtuse hoidmiseks',
          'Funktsioonide kogum',
          'HTML elementide loend',
          'CSS reeglite kogum'
        ],
        correct: 0,
        hint: 'Massiiv on nagu nimekiri.'
      },
      {
        q: 'Kuidas lisada elementi HTML massiivi JavaScriptis?',
        options: ['push()', 'add()', 'insert()', 'append()'],
        correct: 0,
        hint: 'push lisab elemendi massiivi lõppu.'
      },
      {
        q: 'Mis vahe on HTTP GET ja POST päringul?',
        options: [
          'GET pärib andmeid, POST saadab andmeid',
          'GET saadab andmeid, POST pärib',
          'Mõlemad teevad sama asja',
          'GET on kiirem kui POST'
        ],
        correct: 0,
        hint: 'GET = get (saada), POST = post (postitada).'
      },
      {
        q: 'Mida teeb JSON.stringify()?',
        options: [
          'Teisendab JavaScripti objekti JSON-tekstiks',
          'Teisendab JSON-teksti JavaScripti objektiks',
          'Valideerib JSON-i',
          'Kuvab JSON-i konsoolis'
        ],
        correct: 0,
        hint: 'stringify teeb objektist sõne (string).'
      },
      {
        q: 'Mis on DOM?',
        options: [
          'Dokumendi objektimudel, mis esitab lehte puustruktuurina',
          'Andmebaasi haldussüsteem',
          'JavaScripti raamistik',
          'CSS preprotsessor'
        ],
        correct: 0,
        hint: 'DOM = Document Object Model.'
      },
      {
        q: 'Kuidas muuta HTML elemendi stiili JavaScriptis?',
        options: [
          'element.style.omadus = "väärtus"',
          'element.class = "väärtus"',
          'element.css = "väärtus"',
          'element.styles = "väärtus"'
        ],
        correct: 0,
        hint: 'style omadus võimaldab muuta elemendi CSS-i.'
      },
      {
        q: 'Mis on async/await?',
        options: [
          'Süntaks Promise\'ide lihtsamaks kasutamiseks',
          'Funktsioonide deklareerimise viis',
          'Muutujate tüübid',
          'Tsüklite kirjutamise viis'
        ],
        correct: 0,
        hint: 'async teeb funktsioonist asünkroonse, ootab await.'
      },
      {
        q: 'Mida teeb .length omadus massiivil?',
        options: [
          'Tagastab massiivi elementide arvu',
          'Kustutab massiivi',
          'Lisab massiivi elemendi',
          'Tagastab massiivi tüübi'
        ],
        correct: 0,
        hint: 'Seda omadust kasutatakse massiivi pikkuse leidmiseks.'
      },
      {
        q: 'Mis on URL?',
        options: [
          'Veebiaadress, mis viitab ressursile internetis',
          'Andmebaasi päringukeel',
          'Programmeerimiskeel',
          'Failivorming'
        ],
        correct: 0,
        hint: 'URL = Uniform Resource Locator.'
      },
      {
        q: 'Kuidas kuvada brauseri konsoolis midagi?',
        options: ['console.log()', 'print()', 'log.console()', 'write()'],
        correct: 0,
        hint: 'console.log on arendaja lemmikvahend.'
      },
    ],
    medium: [
      {
        q: 'Kuidas filter() meetod töötab?',
        options: [
          'Loob uue massiivi ainult elementidest, mis vastavad tingimusele',
          'Eemaldab elemente algsest massiivist',
          'Sorteerib massiivi tähestiku järjekorras',
          'Lisab igale elemendile uue omaduse'
        ],
        correct: 0,
        hint: 'filter() nagu sõel – laseb läbi ainult sobivad.'
      },
      {
        q: 'Mis juhtub, kui fetch() päring ebaõnnestub (nt faili pole)?',
        options: [
          'catch() plokk püüab vea ja saab kuvada veateate',
          'Leht läheb kokku ja kuvab tühja lehe',
          'Brauser proovib automaatselt uuesti',
          'JavaScript ignoreerib vea vaikselt'
        ],
        correct: 0,
        hint: 'Promise\'i vead püütakse kinni .catch() meetodiga.'
      },
      {
        q: 'Miks on andmed JSON-failis eraldi, mitte JavaScripti koodi sees?',
        options: [
          'Sest andmete eraldamine võimaldab neid muuta ilma koodi puutumata',
          'Sest JavaScript ei saa JSON-i koodi sees hoida',
          'Sest see muudab lehe kiiremaks',
          'Sest see on ainus viis andmete laadimiseks'
        ],
        correct: 0,
        hint: 'Kui andmed on eraldi failis, saab neid uuendada iseseisvalt.'
      },
      {
        q: 'Mis on otsingufunktsiooni põhiidee andmete kuvamisel?',
        options: [
          'Filtreerida andmed kasutaja sisestatud teksti alusel ja kuvada ainult sobivad',
          'Laadida andmed uuesti serverist iga kord',
          'Sortida andmed tähestiku järjekorras',
          'Kustutada mittesobivad andmed'
        ],
        correct: 0,
        hint: 'Otsing vähendab näidatavate andmete hulka.'
      },
      {
        q: 'Kuidas kuvada veateadet, kui JSON-faili laadimine ebaõnnestub?',
        options: [
          'Catch() plokis muuta mõne HTML elemendi tekst veateateks',
          'Viga kuvatakse automaatselt brauseri konsoolis',
          'Pole võimalik, veateadet ei saa kuvada',
          'Kirjutada vea HTML-faili sisse'
        ],
        correct: 0,
        hint: 'DOM-i manipulatsiooniga saab veateate kuvada.'
      },
      {
        q: 'Millist meetodit kasutatakse JSON-andmete teisendamiseks JavaScripti objektiks?',
        options: ['.json()', '.parse()', '.stringify()', '.text()'],
        correct: 0,
        hint: 'See meetod kutsutakse fetch() vastusest.'
      },
      {
        q: 'Kuidas lisada igale massiivi elemendile sama tehe?',
        options: ['map()', 'forEach()', 'Mõlemad sobivad', 'Kumbki ei sobi'],
        correct: 2,
        hint: 'map() loob uue massiivi, forEach() käivitab funktsiooni igal elemendil.'
      },
      {
        q: 'Miks on oluline kasutada fetch() päringus .catch() plokki?',
        options: [
          'Et püüda kinni võrguvead ja näidata kasutajale sõbralikku veateadet',
          'Sest ilma selleta ei tööta fetch() üldse',
          'Et kiirendada päringut',
          'Et automaatselt uuesti proovida'
        ],
        correct: 0,
        hint: 'Ilma catch()ta võib viga jääda märkamata.'
      },
      {
        q: 'Mis on Promise?',
        options: [
          'Objekt, mis esindab asünkroonse tegevuse lõpptulemust',
          'Funktsioon, mis käivitub kohe',
          'Muutuja tüüp',
          'HTML element'
        ],
        correct: 0,
        hint: 'Promise lubab, et tulemus saabub hiljem.'
      },
      {
        q: 'Mida teeb Array.sort() ilma argumentideta?',
        options: [
          'Sorteerib elemendid stringidena tähestiku järjekorras',
          'Sorteerib numbrid kasvavas järjekorras',
          'Sorteerib elemendid kahanevas järjekorras',
          'Ei sorteeri midagi'
        ],
        correct: 0,
        hint: 'Vaikimisi sort() käsitleb elemente stringidena.'
      },
      {
        q: 'Kuidas leida massiivist kindel element?',
        options: ['find()', 'filter()', 'search()', 'locate()'],
        correct: 0,
        hint: 'find() tagastab esimese elemendi, mis vastab tingimusele.'
      },
      {
        q: 'Miks on XMLHttpRequest vanem meetod kui fetch()?',
        options: [
          'Sest fetch() on moodsam ja lihtsamini kasutatav',
          'Sest XMLHttpRequest ei tööta enam',
          'Sest fetch() on aeglasem',
          'Vahet pole, mõlemad on samad'
        ],
        correct: 0,
        hint: 'fetch() põhineb Promise\'idel ja on puhtama süntaksiga.'
      },
      {
        q: 'Kuidas kuvada sõnum "Laadin..." andmete laadimise ajal?',
        options: [
          'Enne fetch() kutset muuta HTML elemendi tekstiks "Laadin..."',
          'Pärast fetch() kutset lisada teksti "Laadin..."',
          'See kuvatakse automaatselt',
          'Seda pole võimalik teha'
        ],
        correct: 0,
        hint: 'Kasutaja peab teadma, et midagi toimub.'
      },
      {
        q: 'Mis juhtub, kui proovid JSON.parse() sõnega, mis pole korrektne JSON?',
        options: [
          'Tekib viga (SyntaxError)',
          'Tagastatakse null',
          'Tagastatakse undefined',
          'Sõne tagastatakse muutmata'
        ],
        correct: 0,
        hint: 'Vigane JSON põhjustab parser-vea.'
      },
      {
        q: 'Kuidas teha mitu fetch() päringut järjest?',
        options: [
          'Kasutada Promise chainingut või async/await',
          'Teha mitu fetch() kutset samas reas',
          'Kasutada setTimeout()',
          'Pole võimalik, fetch() töötab ainult üks kord'
        ],
        correct: 0,
        hint: 'then() tagastab uue Promise\'i, mida saab aheldada.'
      },
      {
        q: 'Mida teeb spread-operaator (...) massiiviga?',
        options: [
          'Laiendab massiivi elementideks',
          'Kopeerib massiivi',
          'Kustutab massiivi',
          'Sorteerib massiivi'
        ],
        correct: 0,
        hint: '... laiendab massiivi nii, nagu elemendid oleks eraldi.'
      },
      {
        q: 'Kuidas kontrollida, kas massiiv sisaldab kindlat väärtust?',
        options: ['includes()', 'contains()', 'has()', 'exists()'],
        correct: 0,
        hint: 'includes tagastab true/false.'
      },
      {
        q: 'Mis on erinevus null ja undefined vahel?',
        options: [
          'null on teadlikult määratud tühiväärtus, undefined tähendab, et väärtus puudub',
          'Vahet pole, mõlemad tähendavad sama',
          'undefined on teadlikult määratud, null tähendab veateadet',
          'null on arv, undefined on tekst'
        ],
        correct: 0,
        hint: 'undefined tähendab "pole määratud", null tähendab "tühjus".'
      },
    ],
    hard: [
      {
        q: 'Mis on Event Delegation ja milleks seda kasutada?',
        options: [
          'Sündmuste kuulamine ülemiselemendil, et hallata dünaamiliselt lisatud elemente',
          'Iga elemendi jaoks eraldi sündmusekuulaja lisamine',
          'Sündmuste järjekorra muutmine',
          'Sündmuste eemaldamine'
        ],
        correct: 0,
        hint: 'Delegeerimine tähendab, et vanem kuulab laste sündmusi.'
      },
      {
        q: 'Kuidas optimeerida andmete kuvamist, kui JSON-failis on 10 000 rida?',
        options: [
          'Kasutada lehekülgedeks jaotamist (pagination) või virtualiseerimist',
          'Kuvada kõik korraga ühel lehel',
          'Keelata JavaScript ja kuvada staatiline HTML',
          'Teisendada JSON XML-iks'
        ],
        correct: 0,
        hint: 'Kui andmeid on palju, ei saa neid kõiki korraga kuvada.'
      },
      {
        q: 'Mis turvarisk tekib, kui kasutaja otsingusisend lisatakse innerHTML abil?',
        options: [
          'XSS (Cross-Site Scripting) – kasutaja saab lisada pahatahtlikku koodi',
          'Andmebaas kustutatakse',
          'Server läheb üle',
          'Leht ei lae üldse'
        ],
        correct: 0,
        hint: 'innerHTML lisab sisu HTML-ina, sealhulgas <script> elemendid.'
      },
      {
        q: 'Mis vahe on filter() ja map() meetoditel?',
        options: [
          'filter() valib elemendid tingimuse järgi, map() muudab iga elementi',
          'filter() muudab elemente, map() valib tingimuse järgi',
          'Mõlemad teevad sama asja',
          'filter() töötab ainult numbritega'
        ],
        correct: 0,
        hint: 'Üks vähendab elementide arvu, teine teisendab neid.'
      },
      {
        q: 'Kuidas muuta lahendust nii, et see töötaks reaalajas uuenevate andmetega?',
        options: [
          'Kasutada setInterval() või WebSocket ühendust andmete perioodiliseks uuendamiseks',
          'Laadida leht iga kord uuesti',
          'Pole võimalik, andmed laetakse ainult üks kord',
          'Kirjutada kogu HTML uuesti iga sekund'
        ],
        correct: 0,
        hint: 'Andmeid saab uuendada kindlate ajavahemike tagant.'
      },
      {
        q: 'Mis juhtub, kui fetch() päringu URL on vale ja veakäsitlus puudub?',
        options: [
          'Promise lükatakse tagasi ja JavaScripti konsoolis kuvatakse veateade',
          'Leht jätkab tööd ilma veateateta',
          'Brauser laeb automaatselt avalehe',
          'Tekib lõpmatu tsükkel'
        ],
        correct: 0,
        hint: 'Ilma .catch() plokita vea puhul Promise lihtsalt lükatakse tagasi.'
      },
      {
        q: 'Mis on CORS ja miks see võib fetch() päringut takistada?',
        options: [
          'Turvamehhanism, mis takistab ühe saidi skriptil teise saidi andmeid lugeda',
          'Andmebaasi ühenduse protokoll',
          'JavaScripti raamistik',
          'CSS reeglistik'
        ],
        correct: 0,
        hint: 'CORS = Cross-Origin Resource Sharing.'
      },
      {
        q: 'Kuidas optimeerida massiivi suurte andmehulkade töötlemist?',
        options: [
          'Kasutada tõhusaid algoritme ja vältida DOM-i muutmist iga elemendi jaoks',
          'Lisada rohkem kommentaare',
          'Kasutada rohkem muutujaid',
          'Kirjutada kood ühele reale'
        ],
        correct: 0,
        hint: 'DOM-i operatsioonid on aeglased, neid tuleks minimeerida.'
      },
      {
        q: 'Mis on localStorage ja kuidas see erineb sessioonist?',
        options: [
          'localStorage säilib pärast brauseri sulgemist, sessionStorage kustutatakse',
          'localStorage on kiirem kui sessionStorage',
          'sessionStorage säilib pärast sulgemist, localStorage kustutatakse',
          'Vahet pole, mõlemad teevad sama'
        ],
        correct: 0,
        hint: 'Local = kohalik, session = seanss.'
      },
      {
        q: 'Kuidas kuvada tabelis tuhandeid ridu ilma lehte aeglustamata?',
        options: [
          'Virtuaalne kerimine (virtual scrolling) – kuvada ainult nähtavaid ridu',
          'Kuvada kõik read korraga',
          'Keelata JavaScript',
          'Kasutada pilte tabeli asemel'
        ],
        correct: 0,
        hint: 'Brauser ei suuda tuhandeid DOM-elemente korraga tõhusalt hallata.'
      },
      {
        q: 'Mida teeb debounce ja milleks seda kasutada?',
        options: [
          'Vähendab funktsiooni väljakutsete arvu, oodates, kuni kasutaja lõpetab trükkimise',
          'Kiirendab funktsiooni täitmist',
          'Kustutab funktsiooni mälust',
          'Lisab funktsioonile viivituse enne käivitamist'
        ],
        correct: 0,
        hint: 'Debouncing on kasulik otsingiväljade puhul.'
      },
      {
        q: 'Kuidas laadida JSON-andmeid taustal ilma lehte blokeerimata?',
        options: [
          'Asünkroonne fetch() koos async/await või Promise-iga',
          'Sünkroonne XMLHttpRequest',
          'document.write()',
          'Kasutada <script> silti'
        ],
        correct: 0,
        hint: 'Asünkroonne tähendab, et leht ei külmu ooteajal.'
      },
      {
        q: 'Miks võib tekkinud veateade olla kasutajale kasutu, kui see on liiga tehniline?',
        options: [
          'Sest kasutaja ei mõista tehnilist sõnavara ja ei tea, mida teha',
          'Sest tehnilised veateated on alati valed',
          'Sest brauser peidab tehnilised vead automaatselt',
          'Sest tehnilised vead ei ole olulised'
        ],
        correct: 0,
        hint: '"404 Not Found" ei ütle tavakasutajale midagi.'
      },
    ],
  },

  tekstiotsing: {
    easy: [
      {
        q: 'Kuidas küsida Pythonis kasutajalt sisendit?',
        options: ['input()', 'read()', 'ask()', 'prompt()'],
        correct: 0,
        hint: 'See funktsioon ootab, et kasutaja midagi kirjutaks.'
      },
      {
        q: 'Kuidas kuvada Pythonis midagi ekraanile?',
        options: ['print()', 'write()', 'echo()', 'display()'],
        correct: 0,
        hint: 'See funktsioon väljastab teksti konsooli.'
      },
      {
        q: 'Millist andmestruktuuri kasutatakse võtme-väärtus paaride hoidmiseks Pythonis?',
        options: ['Sõnastik (dict)', 'Loend (list)', 'Ennik (tuple)', 'Hulk (set)'],
        correct: 0,
        hint: 'Selles struktuuris on igal võtmel vastav väärtus.'
      },
      {
        q: 'Kuidas lugeda Pythonis faili?',
        options: ['open() ja read()', 'load() ja read()', 'file() ja read()', 'getFile() ja read()'],
        correct: 0,
        hint: 'open() avab faili, read() loeb selle sisu.'
      },
      {
        q: 'Mida teeb funktsioon len() Pythonis?',
        options: [
          'Tagastab sõne või loendi pikkuse',
          'Teisendab teksti arvuks',
          'Loob uue loendi',
          'Kustutab muutuja'
        ],
        correct: 0,
        hint: 'len = length, pikkus.'
      },
      {
        q: 'Kuidas lõpetada tsükklit Pythonis enneaegselt?',
        options: ['break', 'stop', 'exit', 'end'],
        correct: 0,
        hint: 'See võtmesõna katkestab tsükli.'
      },
      {
        q: 'Mis tüüpi on Pythonis väärtus "hello"?',
        options: ['str', 'int', 'bool', 'list'],
        correct: 0,
        hint: 'str = string = tekst.'
      },
      {
        q: 'Mida teeb Pythonis operaator ==?',
        options: [
          'Võrdleb kahte väärtust',
          'Omistab väärtuse muutujale',
          'Kontrollib, kas väärtus on sama objekt',
          'Tagastab tüübi'
        ],
        correct: 0,
        hint: 'Kahekordne võrdusmärk on võrdlusoperaator.'
      },
      {
        q: 'Kuidas lisada elementi Pythoni loendisse?',
        options: ['append()', 'add()', 'push()', 'insert()'],
        correct: 0,
        hint: 'append lisab elemendi loendi lõppu.'
      },
      {
        q: 'Mida teeb Pythonis funktsioon range(5)?',
        options: [
          'Loob numbrite jada 0-st 4-ni',
          'Loob numbrite jada 1-st 5-ni',
          'Tagastab arvu 5',
          'Loob tühja loendi'
        ],
        correct: 0,
        hint: 'range() genereerib arvude jada.'
      },
      {
        q: 'Kuidas kommenteerida mitut rida Pythonis?',
        options: [
          'Kolme jutumärgiga """ """',
          'Kahe kaldkriipsuga //',
          'Trelliga #',
          'Nurksulgudega [ ]'
        ],
        correct: 0,
        hint: 'Kolme jutumärki kasutatakse mitmerealise kommentaari jaoks.'
      },
      {
        q: 'Mis vahe on loendil (list) ja ennikul (tuple) Pythonis?',
        options: [
          'Loendit saab muuta, ennikut ei saa',
          'Ennikut saab muuta, loendit ei saa',
          'Mõlemad on muudetavad',
          'Kumbki pole muudetav'
        ],
        correct: 0,
        hint: 'List on muudetav, tuple on muutumatu.'
      },
      {
        q: 'Mida teeb Pythonis def võtmesõna?',
        options: [
          'Defineerib funktsiooni',
          'Defineerib muutuja',
          'Kustutab objekti',
          'Määrab vaikeväärtuse'
        ],
        correct: 0,
        hint: 'def = define.'
      },
      {
        q: 'Kuidas kontrollida, kas muutuja on teatud tüüpi Pythonis?',
        options: ['isinstance()', 'typeof()', 'typecheck()', 'isType()'],
        correct: 0,
        hint: 'isinstance kontrollib, kas objekt on etteantud tüüpi.'
      },
      {
        q: 'Mis on Pythonis sõnastiku (dict) võtme ja väärtuse vahe?',
        options: [
          'Võti on unikaalne identifikaator, väärtus on sellega seotud info',
          'Võti on väärtus ja väärtus on võti',
          'Võti on alati number, väärtus on tekst',
          'Vahet pole'
        ],
        correct: 0,
        hint: 'Sõnastik on nagu päris sõnaraamat – märksõna ja seletus.'
      },
      {
        q: 'Kuidas avada faili kirjutamise režiimis Pythonis?',
        options: ['open("fail.txt", "w")', 'open("fail.txt", "r")', 'open("fail.txt", "a")', 'write("fail.txt")'],
        correct: 0,
        hint: '"w" = write (kirjuta).'
      },
      {
        q: 'Mida tähendab Pythonis "i" for-tsüklis nagu "for i in range(5)"?',
        options: [
          'Tsüklimuutuja, mis võtab iga iteratsiooniga uue väärtuse',
          'Konstant, mis on alati 1',
          'Funktsiooni nimi',
          'Veateade'
        ],
        correct: 0,
        hint: 'i on tavaline muutujanimi, mis saab väärtuse range() jadast.'
      },
      {
        q: 'Mida teeb Pythonis .strip() meetod?',
        options: [
          'Eemaldab sõne algusest ja lõpust tühikud ja reavahetused',
          'Kustutab kogu sõne',
          'Lisab sõnele tühikud',
          'Muudab sõne suurtähtedeks'
        ],
        correct: 0,
        hint: 'Strip tähendab eemaldama.'
      },
      {
        q: 'Kuidas ühendada kaks sõne Pythonis?',
        options: ['+ operaatoriga', '& operaatoriga', 'concat() funktsiooniga', 'merge() funktsiooniga'],
        correct: 0,
        hint: 'Sama operaator nagu arvude liitmisel.'
      },
    ],
    medium: [
      {
        q: 'Miks kasutada try/except plokki faili lugemisel?',
        options: [
          'Et püüda võimalikke vigu (nt faili puudumine) ja programm ei katkeks',
          'Et programm töötaks kiiremini',
          'Et muutujad oleksid kaitstud',
          'Et funktsioonid saaksid omavahel suhelda'
        ],
        correct: 0,
        hint: 'Mis juhtub veaga, kui seda ei püüta?'
      },
      {
        q: 'Miks kasutatakse while True tsüklit vestlusrobotites?',
        options: [
          'Et programm ootaks kasutaja sisendit korduvalt, kuni kasutaja otsustab lõpetada',
          'Et programm töötaks lõputult ega lõpeks kunagi',
          'Et arvutada matemaatilisi valemeid',
          'Et lugeda faili ühe korra läbi'
        ],
        correct: 0,
        hint: 'Kas vestlusrobot peaks pärast ühte vastust kinni jääma?'
      },
      {
        q: 'Mis juhtub, kui teadmistebaasi faili ei leita?',
        options: [
          'Programm püüab vea kinni ja kuvab sobiva teate',
          'Programm jääb igaveseks ootama',
          'Programm loob ise uue tühja faili',
          'Programm lõpetab töö ilma teateta'
        ],
        correct: 0,
        hint: 'Veakäsitlus (try/except) päästab programmi.'
      },
      {
        q: 'Miks on otsingul kasulik teisendada nii kasutaja sisend kui ka võtmesõnad väiketähtedeks?',
        options: [
          'Et otsing ei sõltuks suur- ja väiketähtede erinevusest',
          'Sest Python töötab ainult väiketähtedega',
          'Sest see muudab otsingu kiiremaks',
          'Sest muidu tekib viga'
        ],
        correct: 0,
        hint: 'Kas "Tere" ja "tere" on samad sõnad?'
      },
      {
        q: 'Kuidas saab Pythonis kontrollida, kas sõne sisaldab teist sõnet?',
        options: ['in operaatoriga', 'contains() meetodiga', 'includes() meetodiga', 'findText() funktsiooniga'],
        correct: 0,
        hint: 'in on Pythonis operaator, mis kontrollib sisaldumist.'
      },
      {
        q: 'Mis vahe on return ja print vahel Pythonis?',
        options: [
          'return annab väärtuse funktsioonist tagasi, print kuvab ekraanile',
          'Mõlemad teevad sama asja',
          'print annab väärtuse tagasi, return kuvab',
          'return töötab ainult tsüklites'
        ],
        correct: 0,
        hint: 'Üks neist lõpetab funktsiooni, teine lihtsalt väljastab.'
      },
      {
        q: 'Miks kasutada else-lauset if-ga koos?',
        options: [
          'Et määrata, mis juhtub siis, kui tingimus ei ole tõene',
          'Et tsükkel jätkuks',
          'Et lisada veel üks tingimus',
          'Et katkestada programm'
        ],
        correct: 0,
        hint: 'Else tähendab "muidu".'
      },
      {
        q: 'Kuidas sortida loend Pythonis?',
        options: ['sort()', 'order()', 'arrange()', 'reorder()'],
        correct: 0,
        hint: 'sort() sorteeri loendi elemendid kasvavas järjekorras.'
      },
      {
        q: 'Kuidas lugeda faili rida-realt Pythonis?',
        options: [
          'for line in file:',
          'file.readLines()',
          'file.each()',
          'file.iterate()'
        ],
        correct: 0,
        hint: 'Failiobjekti saab kasutada tsüklis.'
      },
      {
        q: 'Mis juhtub, kui proovid avada faili, mida pole, ilma veakäsitluseta?',
        options: [
          'Programm jookseb kokku veateatega FileNotFoundError',
          'Fail luuakse automaatselt',
          'Programm jätkab tööd',
          'Tagastatakse tühi fail'
        ],
        correct: 0,
        hint: 'Python viskab erindi, kui faili pole.'
      },
      {
        q: 'Kuidas kontrollida, kas sõne on tühi Pythonis?',
        options: ['if not sõne:', 'if sõne == null:', 'if sõne.empty():', 'if sõne.length() == 0:'],
        correct: 0,
        hint: 'Tühi sõne on Pythonis False-ga võrdväärne.'
      },
      {
        q: 'Mida teeb Pythonis enumerate() funktsioon?',
        options: [
          'Tagastab nii indeksi kui ka väärtuse tsüklis',
          'Loeb elemente',
          'Nummerdab muutujaid',
          'Eemaldab duplikaadid'
        ],
        correct: 0,
        hint: 'enumerate lisab igale elemendile indeksi.'
      },
      {
        q: 'Mis vahe on .txt ja .json failivormingul?',
        options: [
          '.txt on tavatekst, .json on struktureeritud andmevorming',
          '.txt on struktureeritud, .json on tavatekst',
          'Mõlemad on samad',
          '.json on pildivorming'
        ],
        correct: 0,
        hint: 'JSON järgib kindlat süntaksit.'
      },
      {
        q: 'Kuidas muuta kõik sõne tähed väiketähtedeks Pythonis?',
        options: ['.lower()', '.upper()', '.small()', '.toLower()'],
        correct: 0,
        hint: 'lower = väiksed tähed.'
      },
      {
        q: 'Mida teeb Pythonis with-lause faili avamisel?',
        options: [
          'Sulgeb faili automaatselt pärast ploki lõppu',
          'Avab faili kirjutamiseks',
          'Loeb faili sisu',
          'Kontrollib, kas fail on olemas'
        ],
        correct: 0,
        hint: 'With haldab ressursse automaatselt.'
      },
      {
        q: 'Kuidas eemaldada sõnest kindel märk?',
        options: [
          '.replace() meetodiga',
          '.remove() meetodiga',
          '.delete() meetodiga',
          '.strip() meetodiga'
        ],
        correct: 0,
        hint: 'replace("vana", "uus") asendab teksti.'
      },
      {
        q: 'Mis on põhjus, miks kasutaja sisend tuleb alati puhastada (strip)?',
        options: [
          'Sest sisend võib sisaldada juhuslikke tühikuid alguses ja lõpus',
          'Sest see muudab programmi kiiremaks',
          'Sest Python nõuab seda',
          'Sest muidu tekib süntaksiviga'
        ],
        correct: 0,
        hint: 'Kasutaja võib kogemata tühikuid lisada.'
      },
      {
        q: 'Kuidas teha Pythonis loendist kõigi unikaalsete elementide loend?',
        options: [
          'set(loend) abil',
          'unique(loend) abil',
          'distinct(loend) abil',
          'removeDuplicates(loend) abil'
        ],
        correct: 0,
        hint: 'Hulk (set) sisaldab ainult unikaalseid väärtusi.'
      },
    ],
    hard: [
      {
        q: 'Milline probleem võib tekkida, kui teadmistebaasi fail sisaldab eestikeelseid tähti?',
        options: [
          'Unicode-vead, kui faili avamisel pole encoding="utf-8" määratud',
          'Eestitähed muutuvad automaatselt inglise tähtedeks',
          'Programm jääb igaveseks tsüklisse',
          'Midagi ei juhtu, kõik töötab alati'
        ],
        correct: 0,
        hint: 'Pythoni open() kasutab vaikimisi süsteemi kodeeringut.'
      },
      {
        q: 'Milline piirang on lihtsal võtmesõnade otsingul?',
        options: [
          'Otsing leiab ainult täpse vaste, mitte sünonüüme või sarnaseid väljendeid',
          'Otsing töötab ainult ingliskeelsete sõnadega',
          'Otsing ei leia kunagi vastust',
          'Otsing on liiga aeglane'
        ],
        correct: 0,
        hint: 'Kas "palun seleta" ja "räägi mulle" on sama küsimus?'
      },
      {
        q: 'Kuidas muuta otsingut nii, et see leiaks vastuse ka siis, kui kasutaja teeb kirjavea?',
        options: [
          'Kasutada sarnasuse mõõtmist (nt Levenshteini kaugus) või osalist vasteotsingut',
          'Pole võimalik, programm nõuab täpset sisestust',
          'Lisada iga sõna kohta kõik võimalikud kirjavead faili',
          'Keelata kasutajal kirjutamine'
        ],
        correct: 0,
        hint: 'Levenshteini kaugus mõõdab, kui sarnased on kaks sõne.'
      },
      {
        q: 'Kuidas lisada programmi võimalus õppida uusi vastuseid kasutajalt?',
        options: [
          'Kirjutada kasutaja sisend ja vastus faili juurde, kui vastust ei leita',
          'Pole võimalik, programm kasutab ainult algset faili',
          'Lisada manuaalselt iga uus vastus käsitsi',
          'Lasta AI-l uued vastused genereerida'
        ],
        correct: 0,
        hint: 'Faili saab kirjutada juurde uusi andmeid.'
      },
      {
        q: 'Miks on oluline kontrollida, kas teadmistebaas on tühi enne tsükli alustamist?',
        options: [
          'Sest muidu võib programm töötada, aga mitte kunagi vastust leida',
          'Sest Python ei saa tühja sõnastikuga töötada',
          'Sest programm jookseb kokku',
          'Sest tühja faili pole võimalik avada'
        ],
        correct: 0,
        hint: 'Mis juhtub, kui otsid vastust, aga andmeid pole?'
      },
      {
        q: 'Kuidas muuta programmi nii, et see mäletaks varasemaid vestlusi?',
        options: [
          'Salvestada vestlusajalugu faili ja laadida see järgmisel käivitamisel',
          'Pole võimalik, programm unustab kõik pärast sulgemist',
          'Hoida kõik muutujad globaalsetena',
          'Kasutada andmebaasi'
        ],
        correct: 0,
        hint: 'Faili kirjutamine säilitab andmed ka pärast programmi sulgemist.'
      },
      {
        q: 'Mis probleem tekib, kui otsing ei tee vahet suur- ja väiketähtedel?',
        options: [
          'Otsing võib jätta mõned vastused leidmata, sest "Tere" ja "tere" on erinevad',
          'Otsing töötab aeglasemalt',
          'Programm jookseb kokku',
          'Probleemi pole, see on soovitud käitumine'
        ],
        correct: 0,
        hint: 'Inimene ei mõtle suurtähtedest sisestamisel.'
      },
      {
        q: 'Kuidas lahendada olukord, kus teadmistebaas on väga suur (tuhanded read)?',
        options: [
          'Indekseerida andmed sõnastikku kiiremaks otsinguks',
          'Kuvada kõik read korraga',
          'Kasutada aeglasemat otsingut',
          'Piirata faili suurust'
        ],
        correct: 0,
        hint: 'Sõnastiku (dict) otsing on palju kiirem kui järjestikune otsing.'
      },
      {
        q: 'Miks võib while True tsükkel olla ohtlik?',
        options: [
          'Kui puudub break-lause, jookseb programm lõputult ja külmub',
          'Sest while True on keelatud Pythonis',
          'Sest see teeb programmi aeglaseks',
          'Sest see kasutab liiga palju mälu'
        ],
        correct: 0,
        hint: 'Ilma väljumistingimuseta tsükkel ei peatu kunagi.'
      },
      {
        q: 'Kuidas kaitsta programmi selle eest, kui kasutaja sisestab CTRL+C?',
        options: [
          'Püüda kinni KeyboardInterrupt erind try/except blokiga',
          'Keelata klaviatuur',
          'Pole võimalik kaitsta',
          'Kasutada teist programmeerimiskeelt'
        ],
        correct: 0,
        hint: 'KeyboardInterrupt on erind, mida saab püüda.'
      },
      {
        q: 'Milline on parim viis hoida teadmistebaasi andmeid, et otsing oleks kiire?',
        options: [
          'Ehitada sõnastik, kus võtmeteks on märksõnad ja väärtusteks vastused',
          'Hoida kõik failis ja otsida iga kord algusest',
          'Kasutada HTML faili',
          'Kirjutada andmed koodi sisse'
        ],
        correct: 0,
        hint: 'Sõnastiku võtme järgi otsimine on O(1) keerukusega.'
      },
      {
        q: 'Kuidas teha kindlaks, kas kaks sõne on sisuliselt samad, isegi kui kirjapilt erineb?',
        options: [
          'Normaliseerida mõlemad sõned (väiketähed, eemaldada kirjavahemärgid) ja siis võrrelda',
          'Kasutada == operaatorit',
          'See pole võimalik',
          'Kasutada pikkuse võrdlust'
        ],
        correct: 0,
        hint: 'Normaliseerimine muudab mõlemad sõned võrreldavale kujule.'
      },
      {
        q: 'Mis juhtub, kui unustad faili sulgeda pärast lugemist?',
        options: [
          'Fail jääb andmekandjal lukustatuks ja mäluressurss vabastamata',
          'Midagi ei juhtu, fail suletakse automaatselt',
          'Programm jookseb kokku',
          'Fail kustutatakse'
        ],
        correct: 0,
        hint: 'Avatud failid tarbivad süsteemiressursse.'
      },
    ],
  },

  testimine: {
    easy: [
      {
        q: 'Mis on ühiktestimise eesmärk?',
        options: [
          'Kontrollida, kas üksikud funktsioonid või moodulid töötavad õigesti',
          'Testida kogu rakendust tervikuna',
          'Kirjutada dokumentatsiooni',
          'Optimeerida koodi kiirust'
        ],
        correct: 0,
        hint: 'Ühik = unit = üks väike osa.'
      },
      {
        q: 'Mis on Jest?',
        options: [
          'JavaScripti testimisraamistik',
          'CSS raamistik',
          'Andmebaasi haldustööriist',
          'Tekstiredaktor'
        ],
        correct: 0,
        hint: 'Jest on Facebooki loodud testiraamistik.'
      },
      {
        q: 'Mida teeb describe() blokk Jestis?',
        options: [
          'Grupeerib seotud testid ühte kategooriasse',
          'Käivitab kõik testid korraga',
          'Defineerib uue funktsiooni',
          'Kuvab testide tulemused'
        ],
        correct: 0,
        hint: 'describe kirjeldab testide gruppi.'
      },
      {
        q: 'Mida teeb it() või test() funktsioon Jestis?',
        options: [
          'Defineerib ühe testijuhtumi',
          'Käivitab kõik testid',
          'Lõpetab testimise',
          'Kontrollib testide katvust'
        ],
        correct: 0,
        hint: 'it või test määrab ühe testi.'
      },
      {
        q: 'Mida teeb expect() Jestis?',
        options: [
          'Loob ootuse, mida matcheriga võrrelda',
          'Ootab, kuni funktsioon lõpetab',
          'Eeldab, et test läbib',
          'Väljastab veateate'
        ],
        correct: 0,
        hint: 'expect loob "oodatava väärtuse" objekti.'
      },
      {
        q: 'Milleks kasutatakse toBe() matcherit?',
        options: [
          'Primitiivsete väärtuste võrdlemiseks (===)',
          'Objektide süvavõrdlemiseks',
          'Massiivide võrdlemiseks',
          'Vigade kontrollimiseks'
        ],
        correct: 0,
        hint: 'toBe kasutab range võrdlust (===).'
      },
      {
        q: 'Mis vahe on toBe() ja toEqual() vahel?',
        options: [
          'toBe võrdleb viiteid, toEqual võrdleb väärtusi',
          'toBe võrdleb väärtusi, toEqual võrdleb viiteid',
          'Vahet pole, mõlemad teevad sama',
          'toEqual töötab ainult numbritega'
        ],
        correct: 0,
        hint: 'toEqual teeb süvavõrdluse objektidele ja massiividele.'
      },
      {
        q: 'Mis on testifaili laiend Jestis?',
        options: [
          '.test.js või .spec.js',
          '.jest.js',
          '_test.js',
          '.js.test'
        ],
        correct: 0,
        hint: 'Jest otsib vaikimisi .test või .spec faile.'
      },
      {
        q: 'Kuidas käivitada Jest teste?',
        options: [
          'npm test või npx jest',
          'node test',
          'run jest',
          'npm start'
        ],
        correct: 0,
        hint: 'npm test käivitab package.json skripti "test".'
      },
      {
        q: 'Mida teeb toThrow() matcher?',
        options: [
          'Kontrollib, kas funktsioon viskab vea',
          'Kontrollib, kas funktsioon tagastab väärtuse',
          'Kontrollib, kas funktsioon on defineeritud',
          'Kontrollib, kas funktsioon on asünkroonne'
        ],
        correct: 0,
        hint: 'toThrow ootab, et funktsioon viskab erindi.'
      },
      {
        q: 'Mida tähendab TDD?',
        options: [
          'Test-Driven Development – esmalt testid, siis kood',
          'Technical Design Document',
          'Test Data Definition',
          'Total Development Delay'
        ],
        correct: 0,
        hint: 'TDD puhul kirjutatakse testid enne koodi.'
      },
      {
        q: 'Mis on assert?',
        options: [
          'Väide, mis kontrollib, kas tingimus on tõene',
          'Funktsioon, mis käivitab testi',
          'Muutuja testide jaoks',
          'Testide kogum'
        ],
        correct: 0,
        hint: 'Assert tähendab "väitma" või "kinnitama".'
      },
      {
        q: 'Mida teeb beforeEach() Jestis?',
        options: [
          'Käivitab funktsiooni enne iga testi',
          'Käivitab funktsiooni pärast iga testi',
          'Käivitab funktsiooni enne kõiki teste',
          'Käivitab funktsiooni üks kord'
        ],
        correct: 0,
        hint: 'beforeEach = enne iga testi.'
      },
      {
        q: 'Mida teeb afterAll() Jestis?',
        options: [
          'Käivitab funktsiooni pärast kõiki teste',
          'Käivitab funktsiooni pärast iga testi',
          'Käivitab funktsiooni enne teste',
          'Käivitab funktsiooni iga testi ajal'
        ],
        correct: 0,
        hint: 'afterAll = pärast kõiki.'
      },
      {
        q: 'Mis on mock-funktsioon?',
        options: [
          'Funktsioon, mis imiteerib päris funktsiooni käitumist testimiseks',
          'Vale funktsioon, mida kasutatakse tootmises',
          'Funktsioon, mis naeruvääristab koodi',
          'Aeglane funktsioon'
        ],
        correct: 0,
        hint: 'Mock tähendab "imitatsiooni" või "koopiat".'
      },
      {
        q: 'Kuidas kontrollida, kas väärtus on null?',
        options: ['toBeNull()', 'toBeUndefined()', 'toBeFalsy()', 'toBeEmpty()'],
        correct: 0,
        hint: 'toBeNull kontrollib täpselt null väärtust.'
      },
      {
        q: 'Mida teeb toBeDefined()?',
        options: [
          'Kontrollib, kas väärtus on defineeritud (mitte undefined)',
          'Kontrollib, kas väärtus on tõene',
          'Defineerib uue muutuja',
          'Kustutab muutuja'
        ],
        correct: 0,
        hint: 'toBeDefined = on defineeritud.'
      },
      {
        q: 'Kuidas testida, kas massiiv sisaldab kindlat elementi?',
        options: [
          'toContain()',
          'toInclude()',
          'toHave()',
          'toBeIn()'
        ],
        correct: 0,
        hint: 'toContain kontrollib sisaldumist.'
      },
      {
        q: 'Mis on coverage?',
        options: [
          'Mõõdik, mis näitab, kui palju koodist on testidega kaetud',
          'Testide koguarv',
          'Funktsioonide arv koodis',
          'Vigade arv testides'
        ],
        correct: 0,
        hint: 'Coverage = katvus.'
      },
      {
        q: 'Kuidas kuvada katvuse raportit Jestis?',
        options: [
          'jest --coverage',
          'jest --report',
          'jest --cover',
          'jest --verbose'
        ],
        correct: 0,
        hint: '--coverage lipuga kogub Jest katvuse info.'
      },
    ],
    medium: [
      {
        q: 'Miks on oluline testida ka äärejuhtumeid (edge cases)?',
        options: [
          'Sest just äärejuhtudel tekivad tihti vead, mida tavakasutusel ei märka',
          'Sest äärejuhtumeid on kõige lihtsam testida',
          'Sest need on nõutud testimise standardites',
          'Sest need parandavad jõudlust'
        ],
        correct: 0,
        hint: 'Null, tühi massiiv, negatiivsed arvud – need on tüüpilised äärejuhtumid.'
      },
      {
        q: 'Mille poolest erineb unit test integration testist?',
        options: [
          'Unit test testib ühte moodulit, integration test testib koostööd',
          'Integration test on kiirem kui unit test',
          'Unit test nõuab andmebaasi, integration test mitte',
          'Vahet pole, need on samad'
        ],
        correct: 0,
        hint: 'Unit = üksik, integration = koostoime.'
      },
      {
        q: 'Kuidas testida asünkroonset funktsiooni Jestis?',
        options: [
          'Kasutada async/await koos expectiga',
          'Asünkroonseid funktsioone ei saa testida',
          'Kasutada done() callbacki',
          'Mõlemad async/await ja done() sobivad'
        ],
        correct: 3,
        hint: 'Jest toetab nii async/await kui ka done() mustrit.'
      },
      {
        q: 'Mida teeb jest.fn()?',
        options: [
          'Loob mock-funktsiooni, mille käitumist saab kontrollida',
          'Käivitab kõik testid uuesti',
          'Lõpetab testimise',
          'Kontrollib funktsiooni olemasolu'
        ],
        correct: 0,
        hint: 'fn = function, aga see on imitatsioon.'
      },
      {
        q: 'Kuidas kontrollida, mitu korda mock-funktsiooni kutsuti?',
        options: [
          'toHaveBeenCalledTimes()',
          'toHaveBeenCalled()',
          'toHaveBeenCalledWith()',
          'Mõlemad toHaveBeenCalledTimes ja toHaveBeenCalled sobivad'
        ],
        correct: 3,
        hint: 'toHaveBeenCalledTimes kontrollib täpset arvu.'
      },
      {
        q: 'Miks on oluline, et testid oleksid üksteisest sõltumatud?',
        options: [
          'Sest sõltuvad testid võivad anda valetulemusi ja on raskesti hooldatavad',
          'Sest nii on testid kiiremad',
          'Sest Jest nõuab seda',
          'Sest sõltumatud testid on lühemad'
        ],
        correct: 0,
        hint: 'Üks test ei tohiks mõjutada teise tulemust.'
      },
      {
        q: 'Kuidas testida, kas funktsioon viskab vea kindla sõnumiga?',
        options: [
          'expect(() => fn()).toThrow("sõnum")',
          'expect(fn()).toThrow("sõnum")',
          'expect(fn).toThrow("sõnum")',
          'toThrow() kontrollib ainult vea olemasolu'
        ],
        correct: 0,
        hint: 'Funktsioon tuleb mähkida noolefunktsiooni, et see kohe ei käivituks.'
      },
      {
        q: 'Mida teeb toBeCloseTo() matcher?',
        options: [
          'Võrdleb ujukomaarveid etteantud täpsusega',
          'Võrdleb, kas väärtus on ligikaudu võrdne',
          'Kontrollib, kas väärtus on arv',
          'Ümardab arvu enne võrdlust'
        ],
        correct: 0,
        hint: 'Ujukomaarvude täpne võrdlus võib ebaõnnestuda ümardamisvigade tõttu.'
      },
      {
        q: 'Mis juhtub, kui testifailis on viga (süntaksiviga)?',
        options: [
          'Jest kuvab veateate ja see testifail ei käivitu',
          'Jest popib vea automaatselt',
          'Testid jooksevad edasi',
          'Jest lõpetab kogu testimise kohe'
        ],
        correct: 0,
        hint: 'Süntaksiviga korral ei saa faili käivitada.'
      },
      {
        q: 'Mida teeb toBeTruthy()?',
        options: [
          'Kontrollib, kas väärtus on tõene (truthy)',
          'Kontrollib, kas väärtus on true',
          'Kontrollib, kas väärtus on false',
          'Kontrollib, kas väärtus on defineeritud'
        ],
        correct: 0,
        hint: 'Truthy väärtused on kõik peale false, 0, "", null, undefined, NaN.'
      },
      {
        q: 'Miks on hea tava kirjutada testid enne koodi (TDD)?',
        options: [
          'Sest see sunnib mõtlema läbi, mida kood tegema peab',
          'Sest nii on testimine kiirem',
          'Sest TDD teste ei pea dokumenteerima',
          'Sest TDD nõuab vähem koodi'
        ],
        correct: 0,
        hint: 'Test-first lähenemine selgitab nõuded.'
      },
      {
        q: 'Kuidas grupeerida teste describe() bloki sisse?',
        options: [
          'Panna mitu it() blokki describe() sisse',
          'Panna describe() it() bloki sisse',
          'Kirjutada kõik testid ilma describe()ta',
          'Kasutada group() funktsiooni'
        ],
        correct: 0,
        hint: 'describe on konteiner it() blokkide jaoks.'
      },
      {
        q: 'Mida teeb jest.mock()?',
        options: [
          'Asendab terve mooduli mock-objektiga',
          'Käivitab testi mitu korda',
          'Loob uue testifaili',
          'Kustutab mock-funktsioonid'
        ],
        correct: 0,
        hint: 'mock() on võimas vahend sõltuvuste isoleerimiseks.'
      },
      {
        q: 'Kuidas testida, kas massiivi pikkus on oodatud?',
        options: [
          'expect(arr).toHaveLength(3)',
          'expect(arr.length).toBe(3)',
          'Mõlemad sobivad',
          'Kumbki ei sobi'
        ],
        correct: 2,
        hint: 'toHaveLength on spetsiifiline massiivi pikkuse kontrolliks.'
      },
      {
        q: 'Mida teeb toMatch() matcher?',
        options: [
          'Kontrollib, kas sõne sobib regulaaravaldisega',
          'Kontrollib, kas kaks objekti on võrdsed',
          'Kontrollib, kas funktsioon viskab vea',
          'Kontrollib, kas väärtus on tõene'
        ],
        correct: 0,
        hint: 'toMatch kasutab regexp või sõne.'
      },
      {
        q: 'Mis on beforeEach ja afterEach erinevus?',
        options: [
          'beforeEach käivitub enne iga testi, afterEach pärast iga testi',
          'beforeEach käivitub üks kord, afterEach pärast iga testi',
          'beforeEach käivitub enne kõiki teste, afterEach pärast kõiki',
          'Vahet pole'
        ],
        correct: 0,
        hint: 'before = enne, after = pärast, Each = iga.'
      },
      {
        q: 'Kuidas testida, et funktsiooni kutsuti õigete argumentidega?',
        options: [
          'toHaveBeenCalledWith()',
          'toHaveBeenCalled()',
          'toHaveBeenCalledTimes()',
          'toHaveArguments()'
        ],
        correct: 0,
        hint: 'toHaveBeenCalledWith kontrollib argumente.'
      },
      {
        q: 'Miks on testide nimed olulised?',
        options: [
          'Sest head nimed kirjeldavad, mida test kontrollib ja teevad veaotsingu lihtsamaks',
          'Sest Jest nõuab kindlat nimeformaati',
          'Sest nimed mõjutavad testide käivitamise järjekorda',
          'Sest ilma nimeta teste ei käivitata'
        ],
        correct: 0,
        hint: 'Testi nimi peaks ütlema, mida oodatakse.'
      },
      {
        q: 'Kuidas testida, et funktsioon tagastab õige tüübi?',
        options: [
          'typeof või instanceof kontrolliga expecti sees',
          'toBeType() matcheriga',
          'Seda ei saa testida',
          'Jest kontrollib tüüpe automaatselt'
        ],
        correct: 0,
        hint: 'typeof annab andmetüübi.'
      },
    ],
    hard: [
      {
        q: 'Mis on snapshot-testimine?',
        options: [
          'Salvestab väljundi ja võrdleb seda hilisemate käitustega',
          'Testib iga funktsiooni täpselt üks kord',
          'Testib ainult kasutajaliidest',
          'Salvestab testide tulemused faili'
        ],
        correct: 0,
        hint: 'Snapshot = hetketõmmis.'
      },
      {
        q: 'Kuidas testida, et funktsioon ei viska viga?',
        options: [
          'Mähkida expect() toThrow() negatiiviga või lihtsalt käivitada funktsioon',
          'Kasutada not.toThrow()',
          'Kasutada toBeNull()',
          'Kasutada toBeUndefined()'
        ],
        correct: 1,
        hint: 'not pöörab matcheri tähenduse ümber.'
      },
      {
        q: 'Mis on stub ja kuidas see erineb mockist?',
        options: [
          'Stub asendab väärtuse, mock asendab terve funktsiooni käitumise',
          'Stub on keerulisem kui mock',
          'Vahet pole, mõisted on sünonüümid',
          'Mock asendab väärtuse, stub asendab funktsiooni'
        ],
        correct: 0,
        hint: 'Stub annab etteantud vastuse, mock kontrollib ka väljakutseid.'
      },
      {
        q: 'Mis probleem võib tekkida, kui testid kasutavad globaalset olekut?',
        options: [
          'Testid võivad üksteist mõjutada ja anda valetulemusi',
          'Globaalne olek on aeglasem',
          'Globaalset olekut ei saa testides kasutada',
          'Probleemi pole, globaalne olek on testimisel soovitatav'
        ],
        correct: 0,
        hint: 'Iga test peaks algama puhtalt lehelt.'
      },
      {
        q: 'Mida teeb jest.useFakeTimers()?',
        options: [
          'Asendab päris taimerid (setTimeout, setInterval) mock-taimeritega',
          'Käivitab testid kiiremini',
          'Lülitab välja kõik taimerid',
          'Mõõdab testide kestust'
        ],
        correct: 0,
        hint: 'FakeTimers võimaldab aega kiirendada või peatada.'
      },
      {
        q: 'Kuidas testida, et funktsioon ei blokeeri põhithreadi?',
        options: [
          'Kasutada asünkroonseid teste ja kontrollida, et funktsioon tagastab Promise\'i',
          'Seda ei saa testida',
          'Kasutada setTimeout()',
          'Kasutada toBeAsync() matcherit'
        ],
        correct: 0,
        hint: 'Asünkroonne funktsioon tagastab Promise\'i.'
      },
      {
        q: 'Miks on oluline, et testid oleksid korratavad (repeatable)?',
        options: [
          'Sest test peab andma sama tulemuse sõltumata sellest, millal või kus seda käivitatakse',
          'Sest nii on testid kiiremad',
          'Sest korratavad testid on lühemad',
          'Sest vastasel juhul ei saa teste automatiseerida'
        ],
        correct: 0,
        hint: 'Kui test ebaõnnestub juhuslikult, pole see usaldusväärne.'
      },
      {
        q: 'Mis on matcherite not-pöördväärtuse kasutamise eesmärk?',
        options: [
          'Kontrollida, et väärtus EI vasta tingimusele',
          'Pöörata testi tulemus',
          'Keelata testi käivitamine',
          'Teha testist aeglasem'
        ],
        correct: 0,
        hint: 'expect(x).not.toBe(y) kontrollib, et x ei ole y.'
      },
      {
        q: 'Milline on hea testi struktuur (AAA muster)?',
        options: [
          'Arrange (ettevalmistus) – Act (tegevus) – Assert (kontroll)',
          'Arrange – Assert – Act',
          'Act – Arrange – Assert',
          'Assert – Act – Arrange'
        ],
        correct: 0,
        hint: 'AAA = Arrange, Act, Assert.'
      },
      {
        q: 'Kuidas testida funktsiooni, mis sõltub välistest andmetest (nt API päring)?',
        options: [
          'Mockida väline sõltuvus ja anda etteantud vastus',
          'Teha päris API päring iga testi ajal',
          'Jätta see funktsioon testimata',
          'Kirjutada test ainult edukale juhule'
        ],
        correct: 0,
        hint: 'Mockimine isoleerib testi välistest sõltuvustest.'
      },
      {
        q: 'Miks on vale kirjutada teste, mis sõltuvad teiste testide tulemustest?',
        options: [
          'Sest siis ei saa teste eraldi käivitada ja vead on raskesti leitavad',
          'Sest see on aeglasem',
          'Sest Jest keelab selle',
          'Sest testid peavad olema lühemad'
        ],
        correct: 0,
        hint: 'Iga test peaks töötama ka üksi käivitatuna.'
      },
      {
        q: 'Kuidas kontrollida, et massiiv on sorteeritud?',
        options: [
          'Itereerida massiiv ja kontrollida iga järjestikust paari',
          'toEqual() ei suuda seda kontrollida',
          'Kasutada toBeSorted() matcherit',
          'Sorteerida massiiv uuesti ja võrrelda'
        ],
        correct: 0,
        hint: 'Lihtne tsükkel kontrollib iga naabripaari.'
      },
      {
        q: 'Mis on koodi mutant ja mutant-testimine?',
        options: [
          'Koodi tahtlik muutmine, et kontrollida, kas testid suudavad vea leida',
          'Vigase koodi testimine',
          'Testide kirjutamine teises keeles',
          'Koodi kopeerimine uude faili'
        ],
        correct: 0,
        hint: 'Mutation testing mõõdab testide kvaliteeti.'
      },
      {
        q: 'Kuidas testida, et objekt sisaldab kindlat võtit?',
        options: [
          'toHaveProperty()',
          'toContain()',
          'toInclude()',
          'toHaveKey()'
        ],
        correct: 0,
        hint: 'toHaveProperty kontrollib objekti omadust.'
      },
      {
        q: 'Mis juhtub, kui testifailis on mitu describe() blokki?',
        options: [
          'Iga describe blokk käivitatakse eraldi gruppidena',
          'Ainult esimene describe käivitatakse',
          'Kõik testid käivitatakse ilma gruppideta',
          'Tekib viga'
        ],
        correct: 0,
        hint: 'Iga describe loob oma alamgrupi.'
      },
    ],
  },

  üldine: {
    easy: [
      {
        q: 'Mis on selle ülesande peamine eesmärk?',
        options: [
          'Lahendada etteantud probleem vastavalt nõuetele',
          'Kirjutada võimalikult palju koodi',
          'Kasutada võimalikult keerulisi tehnoloogiaid',
          'Teha ilus kasutajaliides'
        ],
        correct: 0,
        hint: 'Loe ülesande kirjeldust assignment.md failist.'
      },
      {
        q: 'Millist keelt selle ülesande lahendamiseks kasutatakse?',
        options: ['JavaScript / Python', 'HTML', 'SQL', 'C++'],
        correct: 0,
        hint: 'Vaata lahendusfailide laiendeid.'
      },
    ],
    medium: [
      {
        q: 'Miks on oluline testida programmi erinevate sisenditega?',
        options: [
          'Et veenduda, et programm töötab kõikide olukordadega õigesti',
          'Et programm kiiremini töötaks',
          'Et failid võtaks vähem ruumi',
          'Et programm näeks professionaalsem välja'
        ],
        correct: 0,
        hint: 'Mis juhtub, kui kasutaja sisestab ootamatu väärtuse?'
      },
    ],
    hard: [
      {
        q: 'Kuidas muuta lahendust nii, et seda oleks lihtsam edasi arendada?',
        options: [
          'Jagada kood väiksemateks funktsioonideks ja eraldada loogika kihtidesse',
          'Panna kogu kood ühte faili',
          'Eemaldada kõik funktsioonid',
          'Lisada rohkem pilte'
        ],
        correct: 0,
        hint: 'Kuidas jaotada suur kood väiksemateks tükkideks?'
      },
    ],
  },
};

// ─── Peamine skript ────────────────────────────────────────────────

const titleOverrides = {
  '003': 'Teadmistebaasiga CLI otsing',
  '004': 'Koodi testimine (Unit Testing & Jest)',
};

function main() {
  console.log('=== Miljonimäng - küsimuste genereerimine ===\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const folders = listNumberedFolders(INPUT_DIR);
  if (folders.length === 0) {
    console.log('Viga: input/ kaustast ei leitud ühtegi numbrilist alamkausta.');
    process.exit(1);
  }

  console.log(`Leitud ${folders.length} ülesanne(t): ${folders.join(', ')}\n`);

  const assignmentsList = [];

  for (const folder of folders) {
    const assignmentDir = path.join(INPUT_DIR, folder);
    const assignmentMd = readFile(path.join(assignmentDir, 'assignment.md'));

    if (!assignmentMd) {
      console.log(`  ${folder} - assignment.md puudub, vahele jäetud`);
      continue;
    }

    const title = titleOverrides[folder] || extractTitle(assignmentMd);
    const allFiles = getAllFiles(assignmentDir);
    const solutionFiles = allFiles.map(fp => ({
      path: path.relative(assignmentDir, fp),
      content: readFile(fp),
    }));

    const type = detectAssignmentType(assignmentMd, solutionFiles);
    console.log(`  ${folder} - ${title} (tüüp: ${type})`);

    const questions = [];
    let id = 0;

    const set = questionSets[type] || questionSets['üldine'];

    // Generate easy (level 1-5): distribute pool without wrapping
    const easyPool = shuffle(set.easy);
    for (let i = 0; i < Math.min(20, easyPool.length); i++) {
      const level = Math.floor(i / 4) + 1;
      if (level > 5) break;
      const item = easyPool[i];
      const shuffledOptions = shuffle(item.options);
      questions.push({
        id: ++id,
        level,
        question: item.q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(item.options[item.correct]),
        explanation: '',
        hint: item.hint,
      });
    }

    // Generate medium (level 6-10): distribute pool without wrapping
    const mediumPool = shuffle(set.medium);
    for (let i = 0; i < Math.min(20, mediumPool.length); i++) {
      const level = Math.floor(i / 4) + 6;
      if (level > 10) break;
      const item = mediumPool[i];
      const shuffledOptions = shuffle(item.options);
      questions.push({
        id: ++id,
        level,
        question: item.q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(item.options[item.correct]),
        explanation: '',
        hint: item.hint,
      });
    }

    // Generate hard (level 11-15): distribute pool without wrapping
    const hardPool = shuffle(set.hard);
    for (let i = 0; i < Math.min(15, hardPool.length); i++) {
      const level = Math.floor(i / 3) + 11;
      if (level > 15) break;
      const item = hardPool[i];
      const shuffledOptions = shuffle(item.options);
      questions.push({
        id: ++id,
        level,
        question: item.q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(item.options[item.correct]),
        explanation: '',
        hint: item.hint,
      });
    }

    // Recalculate correctIndex after options shuffle
    for (const q of questions) {
      const indexed = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
      const shuffled = shuffle(indexed);
      q.options = shuffled.map(s => s.text);
      q.correctIndex = shuffled.findIndex(s => s.isCorrect);
    }

    console.log(`    Genereeritud ${questions.length} küsimust`);

    // Save
    const outDir = path.join(OUTPUT_DIR, 'assignments', folder);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(outDir, 'questions.json'),
      JSON.stringify(questions, null, 2),
      'utf-8'
    );

    // Copy assignment.md and first solution file for runtime display
    const mdPath = path.join(assignmentDir, 'assignment.md');
    if (fs.existsSync(mdPath)) {
      fs.copyFileSync(mdPath, path.join(outDir, 'assignment.md'));
    }
    const toCopy = allFiles.filter(fp => {
      const rel = path.relative(assignmentDir, fp);
      return rel !== 'assignment.md' && (rel.startsWith('solution') || rel.startsWith('src') || rel.endsWith('.js') || rel.endsWith('.py') || rel.endsWith('.html'));
    });
    if (toCopy.length > 0) {
      const srcPath = toCopy[0];
      const dstName = path.basename(srcPath);
      fs.copyFileSync(srcPath, path.join(outDir, dstName));
    }

    assignmentsList.push({ id: folder, title });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'assignments.json'),
    JSON.stringify(assignmentsList, null, 2),
    'utf-8'
  );

  console.log(`\n=== Valmis! ===`);
  console.log(`Ülesannete nimekiri: ${OUTPUT_DIR}\\assignments.json`);
  console.log(`Küsimused: docs/data/assignments/{id}/questions.json`);
  console.log(`Kokku ${assignmentsList.length} ülesannet.`);
}

main();
