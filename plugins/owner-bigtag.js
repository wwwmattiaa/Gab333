let handler = async (m, { conn, text, participants }) => {
  const numeroAutorizzato = '46737807114@s.whatsapp.net';
  const gruppoNotifica = '120363396779012019@g.us';

  if (m.sender !== numeroAutorizzato) {
    let alertMessage = `⚠️ Numero *${m.sender.split('@')[0]}* ha provato a usare il comando *bigtag*!`;

    await conn.sendMessage(gruppoNotifica, { 
      text: alertMessage, 
      mentions: [m.sender] 
    });

    await conn.sendMessage(m.chat, { text: '⚠️ Non hai il permesso di usare questo comando!' });
    return;
  }

  try {
    const delay = (time) => new Promise((res) => setTimeout(res, time));
    let customMessage = text.trim();

    if (!customMessage) {
      return m.reply("Devi scrivere un messaggio dopo il comando!");
    }

    let users = participants.map((u) => conn.decodeJid(u.id));
    const sendHidetagMessage = async (message) => {
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: message,
          contextInfo: { mentionedJid: users },
        },
      }, {});
    };

    const maxMessageLength = 200;
    let messageChunks = [];

    while (customMessage.length > maxMessageLength) {
      messageChunks.push(customMessage.slice(0, maxMessageLength));
      customMessage = customMessage.slice(maxMessageLength);
    }
    messageChunks.push(customMessage);

    for (let i = 0; i < 10; i++) {
      for (let chunk of messageChunks) {
        await sendHidetagMessage(chunk);
        await delay(2000);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

handler.command = /^(bigtag)$/i;
handler.group = true;
handler.rowner = true;
export default handler;