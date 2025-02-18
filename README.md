# Learn&Share - Kompletan tehnički opis projekta

## Opšti opis

Learn&Share je mobilna aplikacija za razmenu znanja, gde korisnici mogu nastupati kako u ulozi učenika, tako i predavača. Aplikacija je razvijena korišćenjem React Native i Expo za frontend i Go za backend.

## Uvod

U savremenom svetu znanja i iskustva se obogaćuju kroz razmenu informacija. Projekat Learn&Share je kreiran kako bi pružio platformu na kojoj korisnici mogu ne samo steći nova znanja, već i podeliti svoje veštine, stvarajući aktivnu zajednicu uzajamne pomoći.
Glavni cilj aplikacije je razmena veština.

Learn&Share je inovativna mobilna aplikacija za razmenu znanja, gde svaki korisnik može biti kako učenik, tako i predavač. Aplikacija obezbeđuje intuitivno razumljiv interfejs i pojednostavljen proces interakcije, omogućavajući:

- **Autentifikacija i bezbednost:**  
  Jednostavan proces registracije i prijave uz korišćenje metoda validacije. Sistem obezbeđuje pouzdano čuvanje podataka i tokena autorizacije, a takođe primenjuje enkripciju za zaštitu korisničkih informacija.

- **Pretraga i odabir predavača:**  
  Korisnici dobijaju pristup proširenom spisku predavača, gde mogu dospeti svi koji žele deliti svoja znanja. Detaljne informacije uključuju ključne veštine, opis, obaveznu video prezentaciju (postavljenu na YouTube za potvrdu kompetentnosti) i recenzije, što pomaže u donošenju svesnog izbora.

- **Rezervacija časova:**  
  Praktičan proces rezervacije časova uključuje izbor kategorije časa, sinhronizaciju sa kalendarom i potvrdu vremena. Ovo pomaže u izbegavanju konflikata u rasporedu i efikasnom organizovanju sastanaka sa predavačima.

- **Multimedijalna komunikacija:**  
  Implementirana je podrška za kvalitetne video pozive za održavanje onlajn časova. Integracija sa savremenim video platformama obezbeđuje stabilnu vezu i kvalitetan prenos audio/video, čak i pri ograničenom protoku mreže.

## Arhitektura sistema

### Opšta struktura

Projekat je izgrađen na osnovu klijent-server arhitekture:

1. **Klijentski deo** (frontend) - mobilna aplikacija na React Native sa Expo
2. **Serverski deo** (backend) - REST API na Go
3. **Baza podataka** - PostgreSQL za čuvanje svih podataka aplikacije
4. **Skladište objekata** - Minio za čuvanje slika
5. **Video komunikacije** - LiveKit za kreiranje video konferencija

### Struktura frontenda

```
|── android - podešavanja za kompilaciju na android
|── assets - čuvanje dodatnih resursa
|── ios - podešavanja za kompilaciju na ios
|-- src
|  |── app - glavni ekrani aplikacije
|  |── components - komponente koje se mogu ponovo koristiti
|  |── utilities - uslužne funkcije i kukice
|  |── providers - provajderi konteksta
|  └── locales - fajlovi za lokalizaciju
```

### Struktura bekenda

```go
cmd/
├── main/main.go               // pokretanje projekta, učitavanje konfiguracije, graceful shutdown
internal/
├── application/application.go // aplikacija, upravljanje: povezivanje sa DB, logger, kreiranje/pokretanje/zaustavljanje servera
├── config/config.go           // učitavanje, validacija konfiguracije iz env
├── entities/...               // entiteti za DB i poslovnu logiku
├── errors/...                 // greške u poslovnoj logici, repozitorijumu i transportu
├── imgutils/...               // alati za operacije sa slikama
├── httputils/...              // http alati za transportni sloj
├── repository/...             // repozitorijum DB: inicijalizacija, upiti, transakcije
├── service/
│   ├── jwt/service.go         // jwt: generisanje, validacija
│   └── livekit/service.go     // livekit: generisanje tokena za sastanke
├── transport/rest/
│   ├── server.go              // rest api, rutiranje, dodavanje handlera i middleware-a
│   └── middlewares/...        // middleware: auth (jwt), cors, logger
├── use_cases/...              // poslovna logika: endpoint, servis, repozitorijum, tipovi
pkg/
├── db/postgres/postgres.go    // postgres: povezivanje
├── hasher/hasher.go           // heširanje: bcrypt
├── object_storage/...         // skladište objekata: za čuvanje slika
└── logger/logger.go           // logger: zap, konfiguracije
```

## Tehnički stek

### Frontend

- **Osnovne tehnologije:**

  - React Native (verzija 0.76.6)
  - Expo (verzija 52.0.25)
  - TypeScript
  - Node.js

- **Navigacija i rutiranje:**

  - expo-router
  - react-native-screens
  - react-native-safe-area-context

- **Stanje i forme:**

  - react-hook-form
  - zod (validacija)
  - @hookform/resolvers

- **UI komponente:**

  - react-native-dropdown-picker
  - react-native-toast-notifications
  - react-native-sticky-parallax-header

- **Multimedija i komunikacije:**

  - @livekit/react-native (video pozivi)
  - react-native-webrtc
  - FontAwesome (ikone)

- **Čuvanje podataka:**

  - expo-secure-store

- **Lokalizacija:**
  - i18next
  - react-i18next
  - expo-localization

### Backend

- **Osnovne tehnologije:**

  - Go (programski jezik)
  - PostgreSQL (baza podataka)
  - Docker (kontejnerizacija)

- **Veb okvir i rutiranje:**

  - chi (HTTP ruter)

- **Logovanje i dokumentacija:**

  - zap (logovanje)
  - swaggo (Swagger dokumentacija)

- **Autentifikacija i bezbednost:**

  - JWT (autentifikacija)
  - bcrypt (heširanje lozinki)

- **Rad sa bazom podataka:**

  - sqlx (komunikacija sa bazom podataka)

- **Multimedija i skladištenje:**
  - LiveKit (video komunikacije)
  - Minio (objektno skladište za slike)

## API Endpoints

Kompletan spisak dostupnih endpoint-a dostupan je na adresi: http://adoe.ru:81/swagger/index.html

```
API Handleri
├── Auth
│   ├── POST /auth/login             // Prijava sa email-om i lozinkom
│   └── POST /auth/signup            // Registracija novog korisnika
│
├── Categories
│   └── GET /categories              // Dobijanje liste svih kategorija
│
├── Image
│   └── GET /image                   // Dobijanje slike po imenu fajla
│
├── Lessons
│   ├── POST /lesson                 // Dodavanje nepotvrđenog časa (zahtev)
│   ├── GET /lessons                 // Dobijanje časova za studente
│   ├── GET /lessons/{id}            // Dobijanje podataka o času po ID
│   ├── GET /lessons/{id}/short-data // Dobijanje kratkih informacija o času po ID
│   ├── PUT /lessons/{id}/approve    // Potvrđivanje časa
│   ├── PUT /lessons/{id}/cancel     // Otkazivanje časa
│   ├── PUT /lessons/{id}/finish     // Završavanje časa
│   ├── GET /lessons/{id}/join       // Pridruživanje času (generisanje tokena)
│   └── PUT /lessons/{id}/start      // Početak časa (generisanje tokena)
│
├── Reviews
│   └── POST /review                 // Kreiranje recenzije
│
├── Teachers
│   ├── GET /teacher                 // Dobijanje podataka predavača (po JWT)
│   ├── POST /teacher                // Registracija kao predavač
│   ├── GET /teacher/lessons         // Dobijanje časova za predavača
│   ├── GET /teacher/schedule        // Dobijanje rasporeda
│   ├── POST /teacher/schedule       // Dodavanje vremena u raspored
│   ├── POST /teacher/skill          // Registracija nove veštine za predavača
│   ├── GET /teachers/{id}/reviews   // Dobijanje recenzija o predavaču po ID
│   ├── GET /teachers                // Dobijanje podataka svih predavača
│   ├── GET /teachers/{id}           // Dobijanje podataka predavača po ID
│   └── GET /teachers/{id}/schedule  // Dobijanje rasporeda predavača po ID
│
└── Users
    ├── GET /user/profile            // Dobijanje profila korisnika (po JWT)
    ├── PATCH /user/profile          // Uređivanje profila korisnika
    └── GET /users/{id}/profile      // Dobijanje profila korisnika po ID
```

## Osnovne komponente i funkcionalnost

### Autentifikacija

- Registracija novih korisnika
- Autorizacija postojećih korisnika
- Zaštićeno čuvanje tokena
- JWT-autentifikacija za zaštitu API-ja

### Profil predavača

Svaki korisnik može postati predavač, ako je spreman deliti svoja znanja. Za potvrdu vladanja veštinom neophodno je dostaviti video prezentaciju, postavljenu na YouTube.

- Upravljanje veštinama
- Raspored časova
- Statistika
- Recenzije (recenziju može ostaviti svaki korisnik koji je imao čas sa tim predavačem)

### Sistem rezervacija

- Pretraga predavača
- Izbor vremena
- Potvrđivanje časova
- Otkazivanje časova
- Završavanje časova

### Video komunikacije

- Održavanje onlajn časova putem video poziva
- Generisanje tokena za povezivanje sa LiveKit
- Interfejs za početak i pridruživanje času

### Sistem recenzija

- Ostavljanje recenzija nakon završetka časa
- Automatsko preračunavanje rejtinga predavača i veštine
- Pregled recenzija o predavačima

## Ključni ekrani i komponente

### 1. Ekran za pretragu predavača

- **TeacherListItem**  
  Prikazuje kratke informacije o predavaču u listi, omogućavajući korisniku da brzo proceni profil i pređe na detaljan opis.

### 2. Ekran profila predavača

- **TeacherProfilePage**  
  Učitava detaljne informacije o predavaču po njegovom ID, uključuje podatke o veštinama, video prezentaciju, kao i recenzije korisnika.

### 3. Ekran za rezervaciju časa

- **BookLesson**  
  Obezbeđuje funkcionalnost izbora kategorije časova i vremena za rezervaciju časa kod izabranog predavača.

### 4. Ekran profila korisnika

- **Profile**  
  Prikazuje lične informacije korisnika, statistiku, istoriju časova i stečene veštine, a takođe pruža mogućnosti za upravljanje profilom.

### 5. Ekran za registraciju i autentifikaciju

- **SignUp/SignIn**  
  Omogućava novim korisnicima da se registruju, a postojećim — da se bezbedno prijave u sistem.

### 6. Ekran za upravljanje zahtevima za čas (za predavače)

- **Requests**  
  Prikazuje zahteve za održavanje časova za predavače, pružajući funkcionalnost za njihovo prihvatanje ili odbijanje.

### 7. Ekran za predavanje i upravljanje časovima

- **Teaching**  
  Omogućava predavačima da upravljaju planiranim časovima, pregledaju statistiku, raspored i istoriju održavanja časova.

### 8. Ekran za dodavanje nove veštine

- **SkillAdding**  
  Omogućava korisnicima da dodaju nove veštine za predavanje, šaljući video prezentaciju i opis za proveru.

### 9. Ekran za uređivanje profila

- **EditProfile**  
  Pruža korisnicima mogućnost da uređuju svoje lične informacije i menjaju avatar.

### 10. Ekran za održavanje časa

- **RoomView**  
  Obezbeđuje implementaciju video veze za održavanje onlajn časova korišćenjem LiveKit.

### 11. Ekran za završetak časa

- **Finish**  
  Prikazuje informacije o završetku časa i pruža mogućnost ostavljanja recenzije o održanom času.

## Dodatna funkcionalnost

- **Višejezičnost:**  
  Aplikacija podržava 5 jezika: ruski, srpski, engleski, nemački i francuski. Korisnici mogu birati željeni jezik u podešavanjima, što obezbeđuje udobnost i dostupnost za široku publiku.

- **Promena teme aplikacije:**  
  Aplikacija pruža mogućnost prebacivanja između svetle i tamne teme za optimalno opažanje interfejsa u svim uslovima osvetljenja.

## Čuvanje podataka

### Baza podataka

- Projekat koristi PostgreSQL kao sistem za upravljanje bazama podataka
- Repozitorijum obrađuje inicijalizaciju tabela i uspostavlja veze između entiteta, uključujući tabele za korisnike, predavače, kategorije, veštine, rasporede, statuse, časove i recenzije
- Implementirani su trigeri za automatsko ažuriranje rejtinga predavača i veštine pri dodavanju novih recenzija
- Baza podataka je prethodno popunjena osnovnim podacima za kategorije i statuse kako bi se obezbedila pravilna funkcionalnost od samog početka

### Objektno skladište

- Minio se koristi za čuvanje slika (avatara korisnika itd.)
- Implementiran je sistem upravljanja pristupom objektima

## Deployment projekta

### Kontejnerizacija

Projekat je upakovan u Docker kontejnere za olakšavanje deployment-a:

- `postgres` - baza podataka
- `minio` - objektno skladište
- `nginx` - reverzni proksi server
- `app-1` - bekend aplikacija

### Instalacija frontenda

1. Kloniranje repozitorijuma:

```bash
git clone https://github.com/LearnShareApp/learn-share-app.git
```

2. Instalacija zavisnosti:

```bash
npm install
```

3. Pokretanje projekta:

```bash
npx expo start
# ili
npx expo start -c
```

### Instalacija bekenda

Bekend se deployuje korišćenjem Docker-a, što pojednostavljuje proces postavljanja.

## Zaključak

Learn&Share predstavlja potpuno rešenje za razmenu znanja, koje objedinjuje savremene tehnologije razvoja kako na klijentskoj, tako i na serverskoj strani. Zahvaljujući promišljenoj arhitekturi, sistem obezbeđuje visoku skalabilnost, bezbednost i jednostavnost korišćenja.

Ova dokumentacija pruža opšti uvid u projekat, njegovu strukturu i osnovne funkcije. Za detaljnije informacije o konkretnim komponentama i API-ju, molimo vas da pogledate odgovarajuću dokumentaciju ili izvorni kod.
