# CLAUDE.md — Koncerter

Dette dokument beskriver projektets formål, arkitektur og udviklingskonventioner til brug for AI-assistenter og udviklere.

---

## Projektbeskrivelse

**Koncerter** er en simpel dansk webapp, hvor brugere kan holde styr på, hvilke koncerter de har planlagt at tage til, og hvilke de har været til. Brugere kan oprette koncertsteder og koncerter, og de kan markere deres deltagelse på enkeltarrangementer.

Målgruppe: Privatpersoner i Danmark der ønsker en let, personlig oversigt over deres koncertliv.
Sprog: Dansk (UI og al tekst).

### Designfilosofi
Grænsefladen skal være meget simpel og tekst-dreven — tæt på det æstetiske udtryk man finder i apps som [Record Club](https://record-club.app). Det vil sige:
- Ren typografi, ingen dekorative elementer
- Sorte/hvide farver med minimal accent-farve
- Lister frem for kort eller tiles
- Ingen animationer, hover-effekter eller transitions
- Formularer der ligner plain HTML uden styling-lag oveni

---

## Domænemodel

### Bruger (User)
- `id` — unik identifikator
- `username` — brugernavn (unikt, vises offentligt)
- `email` — e-mailadresse (unikt, bruges kun til login)
- `password_hash` — krypteret adgangskode
- `created_at` — oprettelsestidspunkt

Registrering er simpel: brugernavn, e-mail og adgangskode. Ingen e-mailbekræftelse i første version.

---

### Koncertsted (Venue)
- `id` — unik identifikator
- `name` — stedets navn (f.eks. "Royal Arena")
- `address` — fuld adresse (f.eks. "Hannemanns Allé 18, 2300 København S")
- `website_url` — link til stedets hjemmeside (valgfrit)
- `created_by` — reference til den bruger der oprettede stedet
- `created_at` — oprettelsestidspunkt

Et koncertsted kan have mange koncerter tilknyttet.

---

### Koncert (Concert)
- `id` — unik identifikator
- `venue_id` — reference til det tilhørende koncertsted (påkrævet)
- `artist_name` — navn på den optrædendte artist/gruppe
- `date_time` — dato og tidspunkt for afholdelse (unikt per venue — to koncerter kan ikke afholdes på samme sted på samme tidspunkt)
- `description` — fritekstbeskrivelse af koncerten (valgfrit)
- `ticket_url` — link til billetsalg (valgfrit)
- `created_by` — reference til den bruger der oprettede koncerten
- `created_at` — oprettelsestidspunkt

---

### Deltagelse (Attendance)
- `id` — unik identifikator
- `user_id` — reference til brugeren
- `concert_id` — reference til koncerten
- `status` — enten `"forventer"` eller `"var_der"`
- `created_at` — oprettelsestidspunkt

**Vigtig regel:** Status er udelukkende styret af brugeren selv — systemet ændrer aldrig status automatisk baseret på om koncertens dato er passeret. En bruger markerer selv hvad der passer bedst. UI'en kan tilpasse knappes ordvalg baseret på datoen (se afsnit om brugerflows), men i databasen er der blot de to værdier.

En bruger kan kun have ét deltagerforhold per koncert (unik kombination af `user_id` + `concert_id`). Brugeren kan til enhver tid fjerne sin markering eller skifte status.

---

## Adgangskontrol og synlighed

- **Alle sider er offentligt tilgængelige for læsning** — man behøver ikke være logget ind for at se koncerter, steder og deltagerlister.
- **Oprettelse og markering kræver login** — kun indloggede brugere kan oprette steder, oprette koncerter og markere deltagelse.
- **Redigering og sletning** — en bruger kan kun redigere eller slette data som de selv har oprettet. Der er ingen admin-rolle i v1.

---

## Brugerflows

### 1. Opret bruger
1. Besøg `/register`
2. Udfyld brugernavn, e-mail og adgangskode (+ bekræft adgangskode)
3. Klik "Opret konto" → brugeren logges ind og sendes til forsiden

### 2. Log ind / log ud
- Log ind via `/login` med e-mail og adgangskode
- Log ud via link i navigationen

### 3. Opret koncertsted
1. Klik "Nyt koncertsted" (kræver login)
2. Udfyld: navn, adresse, hjemmeside-URL (valgfrit)
3. Gem → stedet vises i listen over koncertsteder

### 4. Opret koncert
1. Klik "Ny koncert" (kræver login)
2. Vælg eksisterende koncertsted fra dropdown (eller opret nyt først)
3. Udfyld: artistnavn, dato+tidspunkt, beskrivelse (valgfrit), billet-URL (valgfrit)
4. Gem → koncerten vises på stedet og i den samlede liste

### 5. Marker deltagelse
På en koncerts detaljeside vises en knap til indloggede brugere:

- **Ingen markering endnu:**
  - Koncerten er fremtidig → knap: "Jeg forventer at gå til denne koncert"
  - Koncerten er afholdt → knap: "Jeg var til denne koncert"
  - Begge knapper er altid tilgængelige uanset dato — brugeren vælger selv
- **Allerede markeret:** Brugerens nuværende status vises, og der er mulighed for at skifte status eller fjerne markeringen

### 6. Se deltagerliste
På en koncerts detaljeside vises to lister:
- Brugere der har markeret `"forventer"`
- Brugere der har markeret `"var_der"`

Listerne er synlige for alle (også ikke-indloggede).

---

## Sider / ruter

| Rute | Login krævet | Beskrivelse |
|------|-------------|-------------|
| `/` | Nej | Forside — liste over kommende og nyligt afholdte koncerter |
| `/register` | Nej | Opret bruger |
| `/login` | Nej | Log ind |
| `/venues` | Nej | Liste over alle koncertsteder |
| `/venues/new` | Ja | Opret nyt koncertsted |
| `/venues/:id` | Nej | Detaljeside for et koncertsted med tilknyttede koncerter |
| `/venues/:id/edit` | Ja (opretter) | Rediger koncertsted |
| `/concerts` | Nej | Liste over alle koncerter (kommende øverst, derefter afholdte) |
| `/concerts/new` | Ja | Opret ny koncert |
| `/concerts/:id` | Nej | Detaljeside for en koncert inkl. deltagerliste |
| `/concerts/:id/edit` | Ja (opretter) | Rediger koncert |
| `/profile` | Ja | Brugerens egne markeringer og oprettede data |

---

## Teknisk stack

Deployment-mål er **Netlify** (eller tilsvarende gratis platform som Vercel). Stacken skal holde driftsomkostninger på nul og kræve minimal ops.

### Anbefalet stack
- **Framework:** [SvelteKit](https://kit.svelte.dev/) med Netlify-adapteren — giver server-side rendering, formularhåndtering og routing i ét enkelt framework uden kompleksitet
- **Database:** [Turso](https://turso.tech/) (hosted libSQL/SQLite) — gratis tier dækker fint et lille projekt, og SQLite-semantik holder migrationer simple
- **ORM / query builder:** [Drizzle ORM](https://orm.drizzle.team/) — letvægts, TypeScript-nativt, fungerer med libSQL
- **Autentifikation:** [Lucia](https://lucia-auth.com/) eller håndlavet session-baseret login med cookies og [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Styling:** Minimal plain CSS — ingen CSS-framework. Maks. ét lille stylesheet

### Alternativ hvis SvelteKit er ukendt
- Next.js (App Router) + Turso + Drizzle + Netlify-adapter fungerer på samme vis

### Hvad der bevidst fravælges
- Ingen separate API-lag eller microservices
- Ingen React Query, SWR eller client-side data fetching — al data loades server-side
- Ingen UI-komponentbiblioteker (Tailwind, shadcn, MUI osv.)
- Ingen Redis, message queues eller andre infrastrukturkomponenter

---

## Udviklingskonventioner

### Generelt
- Al UI-tekst er på **dansk**
- Kode, variabelnavne og kommentarer er på **engelsk**
- Hold det simpelt — ingen abstraktioner der ikke er direkte nødvendige

### Database
- Skemaændringer håndteres med Drizzle migrations (`drizzle-kit generate` + `drizzle-kit migrate`)
- Alle `id`-felter er heltal med auto-increment
- Datoer gemmes som UTC i databasen, konverteres til dansk tidszone ved visning
- Brug transaktioner ved operationer der skriver til flere tabeller

### Validering
- `artist_name`, `name` (venue) og `address` er påkrævede felter
- `ticket_url` og `website_url` valideres som gyldige URL'er hvis de er udfyldt
- `date_time` + `venue_id` skal være unikt (håndhæves i databasen)
- Validering sker server-side — klient-side validering er kun til brugervenlighed

### Sikkerhed
- Adgangskoder hashes med bcrypt — aldrig plaintext
- CSRF-tokens på alle formularer der muterer data
- Sessions gemmes i en cookie (httpOnly, Secure, SameSite=Strict)
- Alle databaseforespørgsler bruger parametriserede queries — aldrig string-interpolation

### Tests
- Enhedstests for centrale dataoperationer: opret, rediger, slet venue og concert
- Test at deltagermarkering fungerer: opret, skift status, fjern
- Test at en bruger ikke kan redigere andres data

---

## Datamodel — SQL

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sessions til autentifikation
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at DATETIME NOT NULL
);

CREATE TABLE venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    website_url TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id INTEGER NOT NULL REFERENCES venues(id),
    artist_name TEXT NOT NULL,
    date_time DATETIME NOT NULL,
    description TEXT,
    ticket_url TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(venue_id, date_time)
);

CREATE TABLE attendances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concert_id INTEGER NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('forventer', 'var_der')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concert_id)
);
```

---

## Hvad der ikke er i scope (v1)

- Søgefunktion
- Kommentarer eller anmeldelser
- Notifikationer eller påmindelser
- Import fra ekstern kilde (fx Songkick, Ticketmaster)
- Mobilapp
- Engelsk sprog eller internationalisering
- Betaling eller billetkøb — kun link til ekstern billetsalg
- Admin-panel eller moderering
- Brugerprofiler med avatarer eller bio
