# Küsimuste genereerimise prompt (AI-le)

Seda prompti saab kasutada, kui soovitakse AI-lt (nt OpenAI GPT) reaalajas küsimusi genereerida. Praegune rakendus kasutab eelgenereeritud küsimuste panka, kuid arhitektuur võimaldab hõlpsasti üle minna AI-põhisele genereerimisele.

## Prompti struktuur

```
Sina ose JavaScripti / Pythoni programmeerimise õpetaja.
Sinu ülesanne on koostada kontseptuaalseid valikvastustega küsimusi,
mis testivad õpilase ARUSAAMIST, mitte mälu.

ÄRA küsi:
- failinimede, ridade, funktsioonide asukohtade kohta
- koodilõikude päheõppimise kohta
- konkreetsetele ülesannete ID-dele viidates

KÜSI:
- miks mingit lahendust kasutatakse
- mis juhtub teatud olukorras
- mis vahe on kahel lähenemisel
- milline on parim praktika

Iga küsimus peab sisaldama:
1. question – eestikeelne küsimus
2. options – täpselt 4 vastusevarianti (A, B, C, D)
3. correct – õige variandi indeks (0-3)
4. hint – lühike vihje (1 lause)
5. explanation – lühike selgitus (1-2 lauset)

Tase 1-5 (lihtne): põhikontseptsioonid, süntaks, baasarusaam
Tase 6-10 (keskmine): loogika, vead, kompromissid
Tase 11-15 (raske): süvaarusaam, turvalisus, jõudlus, alternatiivid

Genereeri 55 küsimust: 20 lihtsat, 20 keskmist, 15 rasket.
Iga küsimuse tase peab olema määratud vastavalt ülaltoodule.
```

## Näidisväljund

```json
[
  {
    "id": 1,
    "level": 1,
    "question": "Kuidas teisendada string '10' numbriks 10 JavaScriptis?",
    "options": [
      "parseInt() või Number()",
      "toString()",
      "toFixed()",
      "toNumber()"
    ],
    "correct": 0,
    "hint": "parse-sõnaga funktsioon teisendab teksti arvuks.",
    "explanation": "parseInt() ja Number() on standardsed viisid stringi numbriks teisendamiseks."
  }
]
```

## Ülesande tüübi tuvastamine

Enne prompti saatmist tuvastab süsteem ülesande tüübi (kalkulaator, andmete-kuvamine, tekstiotsing, testimine) ja lisab prompti vastava konteksti:

- **kalkulaator**: DOM-i manipulatsioon, sündmused, aritmeetika, kasutajasisend
- **andmete-kuvamine**: fetch, Promise, JSON, tabelid, filtreerimine
- **tekstiotsing**: failide lugemine, otsingualgoritmid, tekstitöötlus, Python
- **testimine**: Jest matcherid, mockimine, TDD, testide struktuur

## Märkused

- Praegune lahendus kasutab eelnevalt koostatud küsimuste panka (`scripts/generate-questions.js`), kuna see töötab ilma internetiühenduseta ja on stabiilsem.
- AI-põhine genereerimine oleks paindlikum, kuid nõuab API võtit ja internetiühendust.
- Mõlemat lähenemist toetav arhitektuur: vahetada tuleb ainult `generate-questions.js` sisemist loogikat.
