# Koodi testimine (Unit Testing & Jest)

## Ülesande kirjeldus
Kirjuta JavaScripti funktsioonidele ühiktestid, kasutades Jest testimisraamistikku. Testid peavad kontrollima funktsioonide õigsust, äärejuhtumeid ja vigasid.

## Nõuded
- Testid peavad kasutama `describe` ja `it` plokke
- Iga funktsiooni jaoks vähemalt 3 testi
- Testida nii õigeid sisendeid kui ka äärejuhtumeid
- Kasutada erinevaid Jest matchereid (`toBe`, `toEqual`, `toThrow`, jne)
- Testid peavad läbima 100% edukalt

## Näidisfunktsioonid (failis `functions.js`)
- `add(a, b)` – liidab kaks arvu
- `divide(a, b)` – jagab arvu teisega, viskab vea nulliga jagamisel
- `filterUnique(arr)` – tagastab massiivist unikaalsed elemendid
- `parseNumber(str)` – teisendab sõne numbriks, viskab vea kui ei õnnestu

## Hindamiskriteeriumid
- [ ] Testid katavad kõiki funktsioone
- [ ] Äärejuhtumid on testitud (null, tühi sisend, negatiivsed arvud)
- [ ] Testid kasutavad sobivaid matchereid
- [ ] Testid on loetavad ja hästi struktureeritud
- [ ] Kõik testid läbivad edukalt
