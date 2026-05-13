# GitHub Project Board — seadistusjuhis

## 1. Loo uus projekt

1. Ava https://github.com/SanderKarbus/Questionnaire
2. Kliki **Projects** → **Create project**
3. Vali **Board** (klassikaline Kanban)
4. Projekti nimi: "Miljonimäng arendus"

## 2. Loo veerud (columns)

| Veerg | Kirjeldus |
|-------|-----------|
| **Backlog** | Kõik teadaolevad ideed ja soovid, mis pole prioriseeritud |
| **Todo** | Järgmiseks iteratsiooniks valitud ülesanded |
| **In Progress** | Ülesanded, mida parasjagu tehakse |
| **Review / Test** | Valmis, aga ootab ülevaatust ja testimist |
| **Done** | Valmis ja Definition of Done tingimused täidetud |

## 3. Lisa kaardid (product backlog)

Kasutajalood (README-st) lisa kaartidena:

| Kaart | Veerg | Sisu |
|-------|-------|------|
| US-001 | Todo | Kasutajana tahan näha kõiki saadaolevaid ülesandeid... |
| US-002 | In Progress | Kasutajana tahan enne mängu näha ülesande kirjeldust... |
| US-003 | Done | Kasutajana tahan vastata 15 kontseptuaalsele küsimusele... |
| US-004 | Done | Kasutajana tahan kasutada õlekõrsi... |
| US-005 | Done | Kasutajana tahan, et vale vastuse korral mäng lõppeks... |
| US-006 | Done | Kasutajana tahan, et küsimused ei korduks... |
| US-007 | Done | Kasutajana tahan, et uue ülesande lisamine oleks lihtne... |
| US-008 | Done | Kasutajana tahan, et rakendus näeks hea välja... |
| US-009 | Backlog | Kasutajana tahan, et koodiblokid oleksid süntaksivärvitud |
| US-010 | Backlog | Kasutajana tahan, et tulemused salvestataks |

## 4. Lingi issue'd ja pull requestid

Iga kaart võib viidata GitHub Issue'le ja/või Pull Requestile:

```
Viited: #12, #15
```

## 5. Automatiseerimine (soovituslik)

Seadista **Actions** → **Project automations**, et:
- Uus issue → Backlog
- Issue assignitud → In Progress  
- PR merged → Done
