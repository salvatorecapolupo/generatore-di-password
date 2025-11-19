# README — Generatore di Password Sicure

Questo documento spiega i concetti tecnici e i principi di sicurezza utilizzati nel generatore di password, con riferimento ai temi del corso di **Sistemi e Reti**.

Link al tool di generazione password: (https://salvatorecapolupo.github.io/generatore-di-password/)

## 📌 1. Obiettivo del progetto

Realizzare un **generatore di passphrase sicure**, memorabili e robuste, che utilizza dizionari di parole italiane per generare frasi casuali secondo le linee guida della famosa vignetta XKCD #936.
Tutto il processo viene eseguito **lato client**, senza inviare dati a server esterni.

## 🧩 2. Concetti fondamentali

### ▶ 2.1 Entropia delle password

L’**entropia** misura l’imprevedibilità di una password. Più elevata è l'entropia, più difficile è indovinare la password tramite attacchi come:

* brute force
* dizionario
* probabilità e modelli statistici

L'entropia viene stimata come:

```
H = Σ log2(dimensione_pool)
```

Dove ogni parola scelta da un dizionario contribuisce con log₂(N) bit, dove N è la dimensione del dizionario.

### ▶ 2.2 Passphrase vs password tradizionali

Le password tradizionali tendono ad essere:

* corte
* difficili da ricordare
* spesso riutilizzate

Le **passphrase**, invece, possono contenere:

* parole reali (es. "gatto salta bicicletta mare")
* alta entropia dovuta al numero di combinazioni
* maggiore memorabilità

Secondo XKCD 936, 4 parole casuali di un dizionario ampio offrono maggiore entropia di una password complessa tradizionale.

### ▶ 2.3 Generazione crittograficamente sicura

Il sistema usa **`crypto.getRandomValues()`**, un RNG crittograficamente sicuro fornito dal browser.
Non vengono usati `Math.random()`, che non è sicuro per applicazioni crittografiche.

### ▶ 2.4 Utilizzo di dizionari multipli

Il generatore sfrutta più insiemi di parole:

* nomi propri
* sostantivi comuni
* parole rare/uniche
* verbi italiani

Questo aumenta:

* la variabilità delle passphrase
* la casualità grammaticale
* l’imprevedibilità complessiva

### ▶ 2.5 Modalità di generazione

Due modalità principali:

1. **Frase strutturata**: Soggetto + Verbo + Complemento + eventuali parole aggiuntive
2. **X parole casuali** prese dai dizionari

Il risultato può essere personalizzato con:

* separatori
* maiuscole casuali
* numeri
* simboli finali

### ▶ 2.6 Sicurezza lato client (client-side security)

Il generatore funziona **interamente nel browser**, quindi:

* Nessuna password viene inviata in rete
* Nessun server salva o elabora dati sensibili
* Perfettamente utilizzabile in contesti offline

Concetto fondamentale in Sistemi e Reti: **riduzione della superficie d'attacco** dovuta alla mancanza di comunicazione esterna.

### ▶ 2.7 CORS, fetch e fallback

Il sistema prova a caricare dizionari da GitHub tramite `fetch()`. Se i server remoti non rispondono o CORS blocca la richiesta:

* vengono utilizzati **fallback locali**

### ▶ 2.8 Responsività (Design responsive)

L’interfaccia utilizza CSS responsive per adattarsi a:

* desktop
* tablet
* smartphone

Concetto collegato: adattabilità delle interfacce nei sistemi distribuiti.

## 🔒 3. Minacce e contromisure

Il progetto considera diversi aspetti di sicurezza nel contesto Sistemi e Reti.

### 🚫 Attacchi mitigati

* **Sniffing**: nessuna password viaggia in rete
* **Man-in-the-middle**: non c’è comunicazione remota obbligatoria
* **Keylogging server-side**: impossibile, non c’è backend
* **Password reuse prediction**: frasi molto variabili evitano pattern ripetuti

### ⚠ Attacchi non mitigabili lato client

* Keylogger installati sul computer dell’utente
* Shoulder surfing
* Screenshot automatici del sistema operativo

## 🧠 4. Concetti di Sistemi e Reti applicati

Il progetto permette di toccare con mano vari argomenti fondamentali del corso:

### ✔ 4.1 Sicurezza informatica

* entropia
* generazione casuale sicura
* minimizzazione del rischio
* riduzione del flusso dati sensibili

### ✔ 4.2 Comunicazione in rete

* richieste HTTP e gestione errori (fetch)
* CORS
* accesso a risorse remote su GitHub

### ✔ 4.3 Struttura client-server

Questo progetto è **solo client**, ma mette in luce:

* cosa comporta l’assenza di server
* come cambia il modello di sicurezza
* vantaggi e limitazioni

### ✔ 4.4 Elaborazione locale vs remota

È un esempio pratico di edge computing: tutta la logica avviene sul dispositivo dell’utente.

## 📚 5. Per approfondire

* Vignetta XKCD 936: concetto di passphrase
* W3C: Web Crypto API
* OWASP: best practice per la gestione delle password
* Materiale “Sistemi e Reti” su sicurezza, protocolli e architetture

## 📜 6. Licenza

Puoi riutilizzare e modificare liberamente il materiale per uso didattico.

---

The future is there... looking back at us. 
Trying to make sense of the fiction we will have become. (W. Gibson)
