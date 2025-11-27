function generaPassword() {
const dizionario = [
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

    let passphrase = [];
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * dizionario.length);
        passphrase.push(dizionario[random]);
    }

    return passphrase.join("-");
}

document.getElementById("genera").addEventListener("click", () => {
    document.getElementById("output").value = generaPassword();
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
  const average = options.average !== undefined ? options.average : true;

  // validate
  if (!(Number.isFinite(entropyBits) && entropyBits > 0)) {
    throw new Error("entropyBits deve essere un numero positivo");
  }
  if (!(Number.isFinite(guessesPerSecond) && guessesPerSecond > 0)) {
    throw new Error("guessesPerSecond deve essere un numero positivo");
  }

  // log10 of seconds = log10(2^(exp)) - log10(guessesPerSecond)
  // where exp = entropyBits - 1 (media) oppure entropyBits (peggiore)
  const exp = average ? (entropyBits - 1) : entropyBits;
  const log10_2 = Math.LOG10E * Math.log(2); // equival. a Math.log10(2)
  // safer: Math.log10(2) may be used if available
  const log10_time_seconds = exp * Math.log10(2) - Math.log10(guessesPerSecond);

  // time in seconds may be huge -> use powers of 10
  const timeSeconds = Math.pow(10, log10_time_seconds);

  // convert to years (seconds per year)
  const secondsPerYear = 60 * 60 * 24 * 365.2425;
  const timeYears = timeSeconds / secondsPerYear;

  // format human readable
  const human = formatLargeNumber(timeYears) + " years";

  return {
    years: timeYears,
    seconds: timeSeconds,
    humanReadable: human,
    raw: {
      entropyBits,
      guessesPerSecond,
      average
    }
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
