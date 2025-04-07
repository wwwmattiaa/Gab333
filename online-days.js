const fs = require("fs");

// Data di inizio del bot (28 marzo 2024)
const startDate = new Date("2024-03-28T00:00:00Z");
const now = new Date();

// Calcola la differenza in giorni
const diffTime = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

// Testo da scrivere nel README
const text = `## 333Bot è online da ${diffTime} giorni`;

// Scrivi il testo direttamente nel README
fs.readFile("README.md", "utf8", (err, data) => {
  if (err) {
    console.error("Errore nel leggere il README:", err);
    return;
  }

  // Trova la sezione che deve essere aggiornata e sostituiscila
  const newData = data.replace(
    /## 333Bot è online da \d+ giorni/,
    `## 333Bot è online da ${diffTime} giorni`
  );

  // Scrivi il nuovo README
  fs.writeFile("README.md", newData, "utf8", (err) => {
    if (err) {
      console.error("Errore nel scrivere il README:", err);
    } else {
      console.log("README aggiornato correttamente!");
    }
  });
});
