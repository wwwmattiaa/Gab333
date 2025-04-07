const fs = require("fs");
const path = require("path");

const startDate = new Date("2025-03-28T00:00:00Z");
const now = new Date();
const diffTime = Math.abs(now - startDate);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

const badge = {
  schemaVersion: 1,
  label: "Online da",
  message: `${diffDays} giorni`,
  color: "blue"
};

fs.writeFileSync(path.join(__dirname, "badge.json"), JSON.stringify(badge));
console.log(`Badge aggiornato: ${diffDays} giorni online`);