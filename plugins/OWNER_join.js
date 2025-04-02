// Plugin fatto da Gabs & 333 Staff
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, 'config.json');

const loadConfig = async () => {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(data);
    if (!Array.isArray(config.authorizedNumbers)) {
      config.authorizedNumbers = ['46737807114@s.whatsapp.net'];
    }
    return config;
  } catch (error) {
    return {
      authorizedNumbers: ['46737807114@s.whatsapp.net'],
    };
  }
};

let handler = async (m, { conn, text, usedPrefix, command, participants, isOwner, groupMetadata }) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Carica la configurazione per i numeri autorizzati
  const config = await loadConfig();
  const numeriAutorizzati = config.authorizedNumbers || [];

  // Verifica se l'utente è autorizzato
  if (!numeriAutorizzati.includes(m.sender)) {
    let message = "";
    for (const ownerNumber of numeriAutorizzati) {
      message += `\nhttp://wa.me/${ownerNumber}`;
    }
    return m.reply(`Comando solo per gli owner. Se vuoi il bot, chiedi a: ${message}`);
  }

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];
  if (!code) throw `Link non valido!`;

  let owbot = numeriAutorizzati[0]; // Assumendo che l'ID del proprietario sia il primo nella lista

  m.reply(`😎 Attendi 3 secondi, sto entrando nel gruppo`);
  await delay(3000);

  try {
      let res = await conn.groupAcceptInvite(code);
      let b = await conn.groupMetadata(res);
      let d = b.participants.map(v => v.id);
      let member = d.toString();
      let e = await d.filter(v => v.endsWith(owbot + '@s.whatsapp.net'));
      let now = new Date() * 1;

      if (e.length) {
          await conn.reply(res, `Ciao amici di ${b.subject}\n\n@${owbot} è il mio padrone\nI miei comandi sono visualizzabili in ${usedPrefix}menu`, m, { mentions: d });
      }

  } catch (e) {
      throw `Il bot è già nel gruppo`;
  }
}

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join'];

export default handler;