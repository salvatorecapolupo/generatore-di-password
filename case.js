var dizionario = [
    "acqua", "albero", "ambra", "amico", "angelo",
    "barca", "bello", "blu", "buca",
    "caffè", "cane", "canto", "casa", "chiave", "cielo", "colle",
    "dolce",
    "erba", "estate",
    "fiume", "fiore", "foresta",
    "gatto", "gioco", "goccia", "grano",
    "lago", "lampo", "legno", "lente", "luna",
    "mare", "mela", "montagna",
    "neve", "notte", 
    "ombra", "onda", "orto",
    "pane", "penna", "pesce", "pioggia", "pietra",
    "rosso",
    "sale", "sasso", "sedia", "sole", "spada", "stella",
    "tigre", "torre",
    "vento", "verde", "viola",
    "zampa"
];

function generaPassword(dizionario) {
    let passphrase = [];
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * dizionario.length);
        passphrase.push(dizionario[random]);
    }

    return passphrase.join("-");
}

document.getElementById("genera").addEventListener("click", () => {
    document.getElementById("output").value = generaPassword(dizionario);
    calcola_entropia_tempo_di_cracking(dizionario);
});

document.getElementById("copia").addEventListener("click", () => {
    const output = document.getElementById("output");
    output.select();
    output.setSelectionRange(0, 99999);
    document.execCommand("copy");
});

// --- Utility: formatta numeri grandi in forma leggibile ---
function formatLargeNumber(value) {
  if (!isFinite(value)) return "∞";
  const units = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
  let u = 0;
  while (value >= 1000 && u < units.length - 1) {
    value /= 1000;
    u++;
  }
  // 3 significant digits
  const formatted = value >= 100 ? Math.round(value)
                  : value >= 10 ? Math.round(value * 10) / 10
                  : Math.round(value * 100) / 100;
  return `${formatted} ${units[u]}`.trim();
}

// --- Funzione principale ---
// entropyBits: numero di bit di entropia (es. 80, 85.3, ...)
// guessesPerSecond: tentativi dell'attaccante al secondo (es. 1e10)
// options.average (default true): se true usa 2^(entropy-1) come tentativi medi
function timeToCrack(entropyBits, guessesPerSecond = 1e10, options = {}) {
  if (entropyBits <= 0) {
    return {
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      months: 0,
      years: 0,
      attempts: 1
    };
  }

  // Numero medio di tentativi necessari per indovinare la password
  // 2^(n) = spazio totale; valore medio = metà delle possibilità
  const attempts = Math.pow(2, entropyBits - 1);

  // Tempo in secondi
  const seconds = attempts / guessesPerSecond;

  // Conversioni
  const minutes = seconds / 60;
  const hours = seconds / 3600;
  const days = seconds / 86400;
  const months = days / 30.44;      // media mesi anno
  const years = days / 365.25;      // anno medio con bisestili

  return {
    attempts,
    seconds,
    minutes,
    hours,
    days,
    months,
    years
  };
}


// se hai N parole e prendi k parole (es. k = 4 nella vignetta XKCD)
function entropyFromDictionary(N, k) {
  return k * Math.log2(N);
}

// Funzione per calcolare i bit di entropia di una passphrase tipo XKCD
// basata su parole separate da trattino o spazio
function entropyDaPassphrase(passphrase, dizionario) {
    const parole = passphrase.split(/[-\s]+/).filter(w => w.length > 0);
    const k = parole.length;
    const N = dizionario.length;
    return k * Math.log2(N);
}

// funzione che mostra entropia e tempo di crack
function calcola_entropia_tempo_di_cracking(dizionario) {
    const pwd = document.getElementById("output").value.trim();

    if (!pwd) {
        alert("Inserisci o genera una password prima!");
        return;
    }

    // 1) Calcolo entropia
    const entropy = entropyDaPassphrase(pwd, dizionario);

    // 2) Calcolo tempo per craccarla (10 miliardi tentativi/s esempio realistico)
    const risultato = timeToCrack(entropy, 1e10, { average: true });

    // 3) Mostra in pagina
    document.getElementById("outEntropy").textContent = entropy.toFixed(2) + " bit";
    document.getElementById("outTime").textContent = risultato.humanReadable;
};

function mostraDizionario() {
    const container = document.getElementById("listaDizionario");

    if (!container) {
        console.error("Elemento #listaDizionario non trovato!");
        return;
    }

    // Unisci le parole con virgole
    const testo = dizionario.join(", ");

    // Mostra a schermo
    container.textContent = testo;
}
