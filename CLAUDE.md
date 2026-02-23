# CLAUDE.md — Koncerter

Dette dokument beskriver projektets formål, arkitektur og udviklingskonventioner til brug for AI-assistenter og udviklere.

---

## Projektbeskrivelse

**Koncerter** er en simpel dansk webapp, hvor brugere kan holde styr på, hvilke koncerter de har planlagt at tage til, og hvilke de har været til. Brugere kan oprette koncertsteder og koncerter, og de kan markere deres deltagelse på enkeltarrangementer.

Målgruppe: Privatpersoner i Danmark der ønsker en let, personlig oversigt over deres koncertliv.
Sprog: Dansk (UI og al tekst).

---

## Domænemodel

### Bruger (User)
- `id` — unik identifikator
- `username` — brugernavn (unikt)
- `email` — e-mailadresse (unikt)
- `password_hash` — krypteret adgangskode
- `created_at` — oprettelsestidspunkt

Registrering er simpel: brugernavn, e-mail og adgangskode. Ingen e-mailbekræftelse i første version.

---

### Koncertsted (Venue)
- `id` — unik identifikator
- `name` — stedets navn (f.eks. "Royal Arena")
- `address` — fuld adresse (f.eks. "Hannemanns Allé 18, 2300 København S")
- `website_url` — link til stedets hjemmeside
- `created_by` — reference til den bruger der oprettede stedet
- `created_at` — oprettelsestidspunkt

Et koncertsted kan have mange koncerter tilknyttet.

---

### Koncert (Concert)
- `id` — unik identifikator
- `venue_id` — reference til det tilhørende koncertsted (påkrævet)
- `artist_name` — navn på den optrædendte artist/gruppe
- `date_time` — dato og tidspunkt for afholdelse (unikt per venue — to koncerter kan ikke afholdes på samme sted på samme tidspunkt)
- `description` — fritekstbeskrivelse af koncerten
- `ticket_url` — link til billetsalg
- `created_by` — reference til den bruger der oprettede koncerten
- `created_at` — oprettelsestidspunkt

---

### Deltagelse (Attendance)
- `id` — unik identifikator
- `user_id` — reference til brugeren
- `concert_id` — reference til koncerten
- `status` — enten `"planlagt"` (forventer at gå) eller `"deltaget"` (var der)
- `created_at` — oprettelsestidspunkt

En bruger kan kun have ét deltagerforhold per koncert (unik kombination af `user_id` + `concert_id`). Status kan opdateres fra `"planlagt"` til `"deltaget"`.

---

## Brugerflows

### 1. Opret bruger
1. Besøg `/register`
2. Udfyld brugernavn, e-mail og adgangskode
3. Bekræft adgangskode
4. Klik "Opret konto" → brugeren logges ind og sendes til forsiden

### 2. Log ind / log ud
- Log ind via `/login` med e-mail og adgangskode
- Log ud via knap i navigationen

### 3. Opret koncertsted
1. Klik "Nyt koncertsted" (kræver login)
2. Udfyld: navn, adresse, hjemmeside-URL
3. Gem → stedet vises i listen over koncertsteder

### 4. Opret koncert
1. Klik "Ny koncert" (kræver login)
2. Vælg eksisterende koncertsted (eller opret nyt)
3. Udfyld: artistnavn, dato+tidspunkt, beskrivelse, billet-URL
4. Gem → koncerten vises på stedet og i den samlede liste

### 5. Marker deltagelse
- På en koncerts detaljeside finder brugeren en knap:
  - "Jeg forventer at gå til denne koncert" (status: `planlagt`)
  - Hvis koncertens dato er passeret, eller brugeren selv vælger: "Jeg var til denne koncert" (status: `deltaget`)
- Brugeren kan opdatere sin status eller fjerne sin markering

### 6. Se deltagerliste
- På en koncerts detaljeside vises en liste over alle brugere der har markeret `planlagt` eller `deltaget`, opdelt i to grupper

---

## Sider / ruter

| Rute | Beskrivelse |
|------|-------------|
| `/` | Forside — liste over kommende koncerter |
| `/register` | Opret bruger |
| `/login` | Log ind |
| `/venues` | Liste over alle koncertsteder |
| `/venues/new` | Opret nyt koncertsted |
| `/venues/:id` | Detaljeside for et koncertsted med tilknyttede koncerter |
| `/concerts` | Liste over alle koncerter (nyeste/kommende øverst) |
| `/concerts/new` | Opret ny koncert |
| `/concerts/:id` | Detaljeside for en koncert inkl. deltagerliste |
| `/profile` | Brugerens egne koncerter og deltagelser |

---

## Teknisk stack (forslag — ikke låst fast)

Projektet er endnu ikke teknisk besluttet. Følgende er en anbefalet simpel stack til et dansk hobbywebprojekt:

- **Backend:** Python (Flask eller FastAPI) eller Node.js (Express)
- **Database:** SQLite (simpel lokal fil) eller PostgreSQL
- **Frontend:** Server-rendered HTML med Jinja2/Nunjucks, eller en simpel React/Vue SPA
- **Autentifikation:** Session-baseret login (cookie) med bcrypt til password-hashing
- **Deployment:** Enkelt server eller gratis tier (Railway, Render, Fly.io)

Projektet bør holdes simpelt. Undgå over-engineering.

---

## Udviklingskonventioner

### Generelt
- Al UI-tekst er på **dansk**
- Variabelnavne og kodekommentarer kan være på engelsk (standard praksis)
- Hold det simpelt — ingen unødvendige abstraktioner

### Database
- Brug migrations til at håndtere skemaændringer
- `id`-felter er heltal med auto-increment (eller UUID hvis frameworket foretrækker det)
- Datoer gemmes som UTC

### Validering
- `artist_name`, `name` (venue), `address` er påkrævede felter
- `date_time` må ikke være i fortiden ved oprettelse (kun advarsel, ikke blokering)
- `ticket_url` og `website_url` valideres som gyldige URLs
- `date_time` + `venue_id` skal være unikt

### Sikkerhed
- Adgangskoder hashes med bcrypt (aldrig plaintext)
- Brug CSRF-beskyttelse på alle formularer
- Kun indloggede brugere kan oprette/redigere data
- En bruger kan kun redigere/slette sine egne oprettede koncerter og steder

### Tests
- Skriv enhedstests for centrale dataoperationer (opret, opdater, slet)
- Test validering af inputfelter
- Test at deltagermarkering fungerer korrekt (opret, opdater status, fjern)

---

## Datamodel — SQL-eksempel

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    website_url TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id INTEGER NOT NULL REFERENCES venues(id),
    artist_name TEXT NOT NULL,
    date_time DATETIME NOT NULL,
    description TEXT,
    ticket_url TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(venue_id, date_time)
);

CREATE TABLE attendances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    concert_id INTEGER NOT NULL REFERENCES concerts(id),
    status TEXT NOT NULL CHECK(status IN ('planlagt', 'deltaget')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concert_id)
);
```

---

## Hvad der ikke er i scope (v1)

- Søgefunktion
- Kommentarer eller anmeldelser
- Notifikationer / påmindelser
- Import fra ekstern kilde (fx Songkick, Ticketmaster)
- Mobilapp
- Engelsk sprog / internationalisering
- Betaling eller billetkøb (kun link til ekstern billetsalg)
