var dizionario = [
    "acqua","albero","ambra","amico","angelo",
    "barca","bello","blu","buca",
    "caffè","cane","canto","casa","chiave","cielo","colle",
    "dolce",
    "erba","estate",
    "fiume","fiore","foresta",
    "gatto","gioco","goccia","grano",
    "lago","lampo","legno","lente","luna",
    "mare","mela","montagna",
    "neve","notte", 
    "ombra","onda","orto",
    "pane","penna","pesce","pioggia","pietra",
    "rosso",
    "sale","sasso","sedia","sole","spada","stella",
    "tigre","torre",
    "vento","verde","viola",
    "zampa", "zattera"
];

dizionario = dizionario.sort(() => 0.5 - Math.random()).slice(0, dizionario.length);
dizionario.sort();

function generaPassword(dizionario) {
    let passphrase = [];
    let MAX_PAROLE = parseInt(document.getElementById("digit172563").value);
    for (let i = 0; i < MAX_PAROLE; i++) {
        const random = Math.floor(Math.random() * dizionario.length);
        passphrase.push(dizionario[random]);
    }
    return passphrase.join("-");
}

// Mostra dizionario a schermo
function mostraDizionario() {
    const container = document.getElementById("listaDizionario");
    if (!container) {
        console.error("Elemento #listaDizionario non trovato!");
        return;
    }
    container.textContent = dizionario.join(", ");
}

// Calcolo entropia e tempo di cracking
function calcola_entropia_tempo_di_cracking(dizionario) {
    const pwd = document.getElementById("output").value.trim();

    if (!pwd) {
        document.getElementById("outEntropy").textContent = "-";
        document.getElementById("outTime").textContent = "-";
        return;
    }

    const entropy = entropyDaPassphrase(pwd, dizionario);
    const risultato = timeToCrack(entropy, 1000, { average: true });
    // ... dopo che hai calcolato `risultato`
    const bestTime = formatCrackTime(risultato.seconds);
    document.getElementById("outTime").textContent = bestTime;

    document.getElementById("outEntropy").textContent = entropy.toFixed(1) + " bit";

    // Formattazione illeggibile
    //const tmp = Object.entries(risultato)
        //.map(([unit, value]) => `${unit}: ${formatLargeNumber(value)}, `)
        //.join(", ");

    //document.getElementById("outTime").textContent = tmp;
}

// Utility
function formatLargeNumber(value) {
    if (!isFinite(value)) return "∞";
    const units = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
    let u = 0;
    while (value >= 1000 && u < units.length - 1) {
        value /= 1000;
        u++;
    }
    const formatted = value >= 100 ? Math.round(value)
                    : value >= 10 ? Math.round(value * 10) / 10
                    : Math.round(value * 100) / 100;
    return `${formatted} ${units[u]}`.trim();
}

function entropyFromDictionary(N, k) {
    return k * Math.log2(N);
}

function entropyDaPassphrase(passphrase, dizionario) {
    const parole = passphrase.split(/[-\s]+/).filter(w => w.length > 0);
    return parole.length * Math.log2(dizionario.length);
}

function timeToCrack(entropyBits, guessesPerSecond = 1000, options = {}) {
    if (entropyBits <= 0) {
        return { seconds: 0, minutes: 0, hours: 0, days: 0, months: 0, years: 0, attempts: 1 };
    }
    const attempts = Math.pow(2, entropyBits - 1); // tentativi necessari in media
    const seconds = attempts / guessesPerSecond;
    return {
        attempts: Math.round(attempts),
        seconds: parseFloat(seconds.toFixed(1)),
        minutes: parseFloat((seconds/60).toFixed(1)),
        hours: parseFloat((seconds/3600).toFixed(1)),
        days: parseFloat((seconds/86400).toFixed(1)),
        months: parseFloat((seconds/86400/30.44).toFixed(1)),
        years: parseFloat((seconds/86400/365.25).toFixed(1))
    };
}

function formatCrackTime(seconds) {
    if (!isFinite(seconds) || seconds <= 0) {
        return "0 secondi";
    }

    const units = [
        { name: "anni",   value: 365.25 * 24 * 3600 },
        { name: "mesi",   value: 30.44 * 24 * 3600 },
        { name: "giorni", value: 24 * 3600 },
        { name: "ore",    value: 3600 },
        { name: "minuti", value: 60 },
        { name: "secondi", value: 1 }
    ];

    for (const unit of units) {
        if (seconds >= unit.value) {
            const amount = seconds / unit.value;
            // Usa toFixed per avere un numero con decimali decenti
            return `${amount.toFixed(1)} ${unit.name}`;
        }
    }

    return "0 secondi";
}


// Eventi
document.getElementById("genera").addEventListener("click", () => {
    document.getElementById("output").value = generaPassword(dizionario);
    calcola_entropia_tempo_di_cracking(dizionario);
    mostraDizionario();
});

document.getElementById("copia").addEventListener("click", () => {
    const output = document.getElementById("output");
    if (!output.value) return;
    navigator.clipboard.writeText(output.value)
        .then(() => alert("Password copiata negli appunti!"))
        .catch(err => console.error("Errore copia: ", err));
});

// Mostra dizionario inizialmente
mostraDizionario();
