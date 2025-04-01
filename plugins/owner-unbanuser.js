async function handler(m, { conn, text }) {
  if (!text) return;
  let target;
  if (m.isGroup) {
    target = m.mentionedJid[0];
  } else {
    target = m.chat;
  }
  if (!target) return;
  global.db.data.users[target].banned = false;
  const vcardMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "Utente sbloccato",
        jpegThumbnail: await (await fetch("https://telegra.ph/file/592a9dbbe01cfaecbefb8.png")).buffer(),
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };
  conn.reply(m.chat, "Questo utente potrà eseguire di nuovo i comandi", vcardMessage);
}

handler.help = ['unbanuser'];
handler.tags = ['help'];
handler.command = /^unbanuser|unban$/i;
handler.owner = true;
export default handler;