// Handler per il comando "infostato" o "info-stato"
// Il comando mostra le informazioni dello stato/gruppo e invia un messaggio formattato
const handler = async (m, { conn, participants, groupMetadata }) => {
  // Recupera le impostazioni dal database globale per l'utente (o chat)
  // (Assumendo che le impostazioni siano memorizzate in global.db.data.settings)
  const settings = global.db.data.settings[m.sender.trim()];

  // Filtra i partecipanti per ottenere quelli che sono amministratori
  const adminParticipants = participants.filter(user => user.admin);
  // Crea una lista formattata degli admin (es. "1. 123456789")
  const adminListText = adminParticipants
    .map((admin, index) => `${index + 1}. ${admin.id.split('@')[0]}`)
    .join('\n');

  // Determina il proprietario del gruppo:
  // - se groupMetadata.owner esiste lo usa
  // - altrimenti cerca un admin con ruolo "superadmin"
  // - se tutto fallisce, usa una stringa di fallback basata sul mittente
  const groupOwner =
    groupMetadata.owner ||
    adminParticipants.find(user => user.admin === 'superadmin')?.id ||
    m.sender.trim()[0] + '-0';

  // Crea un "fake message" (messaggio citato) con un extendedTextMessage e un vCard
  // Questo serve per simulare un messaggio “quotato” e per formattare la risposta
  const fakeMessage = {
    key: {
      participants: 'status@broadcast',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      extendedTextMessage: {
        text:
          "══════ •⊰✧⊱• ══════\n" +
          "🪢 𝐈𝐧𝐟𝐨 - 𝐒𝐭𝐚𝐭𝐨 :\n" +
          "    ✧‌⃟ᗒ • 𝐁𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨 ( 👑 )\n" +
          "✧ 𝐈𝐧𝐯𝐢𝐚 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨 𝐞 𝐝𝐢 𝐚𝐝𝐝𝐢𝐨 𝐜𝐨𝐧 𝐥𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐝𝐞𝐥𝐥'𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐡𝐞 𝐞𝐧𝐭𝐫𝐚 𝐞/𝐨 𝐞𝐬𝐜𝐞 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨\n\n" +
          "    ✧‌⃟ᗒ • 𝐒𝐨𝐥𝐨𝐆𝐫𝐮𝐩𝐩𝐨 ( 👑 )\n" +
          "✧ 𝐈 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭 𝐯𝐞𝐫𝐫𝐚𝐧𝐧𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢 𝐬𝐨𝐥𝐨 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐞 𝐧𝐨𝐧 𝐬𝐚𝐫𝐚𝐧𝐧𝐨 𝐩𝐢𝐮̀ 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢 𝐢𝐧 𝐩𝐫𝐢𝐯𝐚𝐭𝐨\n\n" +
          "    ✧‌⃟ᗒ • 𝐒𝐨𝐥𝐨𝐏𝐫𝐢𝐯𝐚𝐭𝐨 ( 👑 )\n" +
          "✧ 𝐈 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭 𝐯𝐞𝐫𝐫𝐚𝐧𝐧𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢 𝐢𝐧 𝐩𝐫𝐢𝐯𝐚𝐭𝐨 𝐞 𝐧𝐨𝐧 𝐬𝐚𝐫𝐚𝐧𝐧𝐨 𝐩𝐢𝐮̀ 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨\n\n" +
          "    ✧‌⃟ᗒ • 𝐌𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧 ( 👑 )\n" +
          "✧ 𝐈 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭 𝐬𝐚𝐫𝐚𝐧𝐧𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐛𝐢𝐥𝐢 𝐬𝐨𝐥𝐨 𝐝𝐚𝐠𝐥𝐢 𝐚𝐦𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨\n\n" +
          "    ✧‌⃟ᗒ • 𝐆𝐫𝐮𝐩𝐩𝐨 𝐁𝐚𝐧 ( 👤 )\n" +
          "✧ 𝐈𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐞𝐬𝐞𝐠𝐮𝐢𝐫𝐚̀ 𝐩𝐢𝐮̀ 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨\n\n" +
          "    ✧‌⃟ᗒ • 𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭 𝐬𝐮𝐥 𝐛𝐨𝐭 ( 👤 -❗️ )\n" +
          "✧ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐢𝐨 𝐩𝐞𝐫 𝐢𝐥 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚𝐦𝐞𝐧𝐭𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨 𝐝𝐞𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢 ( 𝐭𝐞𝐧𝐞𝐫𝐥𝐨 𝐬𝐞𝐦𝐩𝐫𝐞 𝐚𝐭𝐭𝐢𝐯𝐨 )\n" +
          "════════════════\n" +
          "✧ 𝐈𝐍𝐅𝐎\n" +
          "( 👑 ) 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐛𝐢𝐥𝐞 𝐝𝐚 𝐚𝐝𝐦𝐢𝐧 𝐞 𝐨𝐰𝐧𝐞𝐫\n" +
          "( 👤 ) 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐝𝐚 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫\n" +
          "( ❗️ ) 𝐓𝐞𝐧𝐞𝐫𝐞 𝐬𝐞𝐦𝐩𝐫𝐞 𝐚𝐭𝐭𝐢𝐯𝐨\n" +
          "══════ •⊰✧⊱• ══════\n\n",
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Unlimited;;;\n" +
          "FN:Unlimited\n" +
          "ORG:Unlimited\n" +
          "TITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\n" +
          "X-WA-BIZ-NAME:Unlimited\n" +
          "END:VCARD"
      }
    },
    participant: 'status@broadcast'
  };

  // Identificativo fittizio per il messaggio (può essere generato dinamicamente se necessario)
  const fakeJid = '𝕀𝐍𝐅Ꮻ 𝐒𝐓𝚲𝐓Ꮻ 🛡️';

  // Invia il messaggio utilizzando il metodo sendMessage della connessione
  // L'opzione "reply" include tutti gli id dei partecipanti e il proprietario del gruppo
  conn.sendMessage(
    m.sender,
    fakeJid,
    fakeMessage,
    m,
    false,
    { reply: [...participants.map(u => u.id), groupOwner] }
  );
};

// Proprietà di configurazione del comando
handler.help = ['infostato'];
handler.tags = ['chats'];
handler.command = /^(infostato|info-stato|testot)$/i;


export default handler;