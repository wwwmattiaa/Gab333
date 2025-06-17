import 'os';
import 'util';
import 'human-readable';
import '@whiskeysockets/baileys';
import 'fs';
import 'perf_hooks';

let handler = async (message, { conn, usedPrefix }) => {
  const senderName = await conn.getName(message.sender);
  const targetJid = message.quoted
    ? message.quoted.sender
    : message.mentionedJid && message.mentionedJid[0]
    ? message.mentionedJid[0]
    : message.fromMe
    ? conn.user.jid
    : message.sender;

  const botName = global.db.data.nomedelbot || "꙰ 𝟥𝟥𝟥 ꙰ 𝔹𝕆𝕋 ꙰";

  // Formattazione speciale dei comandi
  const commandList = `
╭━━━〔 *⚡ 𝑴𝑬𝑵𝑼 𝑫𝑬𝑳 𝑩𝑶𝑻 ⚡* 〕━━━╮
┃  
┃ 🛠 *𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑮𝑬𝑵𝑬𝑹𝑨𝑳𝑰* 🛠
┃ ━━━━━━━━━━━
┃ ✦ ${usedPrefix}𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻𝑨𝑹𝑰𝑶
┃ ✦ ${usedPrefix}𝑭𝑼𝑵𝒁𝑰𝑶𝑵𝑰
┃ ✦ ${usedPrefix}𝑨𝑫𝑴𝑰𝑵
┃ ✦ ${usedPrefix}𝑮𝑹𝑼𝑷𝑷𝑶
┃ ✦ ${usedPrefix}𝑶𝑾𝑵𝑬𝑹
┃ ✦ ${usedPrefix}𝑪𝑹𝑬𝑫𝑰𝑻𝑰
┃ ✦ ${usedPrefix}𝑺𝑼𝑷𝑷𝑶𝑹𝑻𝑶
┃ ✦ ${usedPrefix}𝑩𝑶𝑻
┃  
╰━━━━━━━━━━━━━━━━━━╯
🚀 𝑩𝒐𝒕: ${botName}
🌟 *𝑽𝑬𝑹𝑺𝑰𝑶𝑵𝑬:* ${vs}
`.trim();

  // Invio del menu senza immagine
  await conn.sendMessage(message.chat, {
    text: commandList,
    contextInfo: {
      mentionedJid: conn.parseMention(wm),
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363341274693350@newsletter',
        serverMessageId: '',
        newsletterName: botName
      }
    }
  });
};

handler.help = ["menu"];
handler.tags = ['menu'];
handler.command = /^(menu|comandi)$/i;

export default handler;

// Funzione per formattare il tempo (ma Youns è immortale 😂)
function clockString(milliseconds) {
  let hours = Math.floor(milliseconds / 3600000);
  let minutes = Math.floor(milliseconds / 60000) % 60;
  let seconds = Math.floor(milliseconds / 1000) % 60;

  console.log({ ms: milliseconds, h: hours, m: minutes, s: seconds });

  return [hours, minutes, seconds].map(timeUnit => timeUnit.toString().padStart(2, '0')).join(':');
}