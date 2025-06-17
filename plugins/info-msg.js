import { getDevice } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'

const handler = async (m, { conn, usedPrefix, command }) => {
  const start = performance.now()

  const mention = m.mentionedJid?.[0] || (m.quoted?.sender ? m.quoted.sender : null)
  const who = mention || m.sender
  const user = global.db.data.users[who] || {}

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {
      money: 0, warn: 0, warnlink: 0, muto: false,
      banned: false, messaggi: 0, blasphemy: 0,
      command: 0, age: "👶🏼🍼"
    }
  }

  let gender = global.db.data.users[who].gender
  gender = gender === 'Maschio' ? 'M' : gender === 'Femmina' ? 'F' : 'Transformer'

  const dispositivo = await getDevice(m.key.id)

  const groups = Object.values(await conn.groupFetchAllParticipating())
  const gruppiAdmin = groups.filter(group =>
    group.participants.some(p => p.id === who && p.admin)
  )
  const numeroGruppi = gruppiAdmin.length
  const nomiGruppi = gruppiAdmin.map(group => group.subject)

  let pic
  try {
    pic = await conn.profilePictureUrl(who, 'image')
  } catch {
    pic = null
  }

  const end = performance.now()
  const speed = (end - start).toFixed(2)

  const isBot = who === conn.user.jid

  const isBotMentioned = m.mentionedJid?.[0] === conn.user.jid
  const isBotReplied = m.quoted?.sender === conn.user.jid
  const showBotInfo = isBotMentioned || isBotReplied

  const gestisceTesto = numeroGruppi
    ? `══════ •⊰✦⊱• ══════\n👑 𝐆𝐞𝐬𝐭𝐢𝐬𝐜𝐞 ${numeroGruppi} ${numeroGruppi === 1 ? '𝐠𝐫𝐮𝐩𝐩𝐨' : '𝐠𝐫𝐮𝐩𝐩𝐢'}${isBot ? '' : `:\n${nomiGruppi.join('\n')}`}\n`
    : ''

  conn.sendMessage(m.chat, {
    text:
      `${gestisceTesto}` +
      `══════ •⊰✦⊱• ══════\n` +
      ` 💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: ${user.messaggi || 0}\n` +
      ` 📱 𝐃𝐢𝐬𝐩𝐨𝐬𝐢𝐭𝐢𝐯𝐨: ${dispositivo}\n` +
      `${user.blasphemy ? ` 🤬 𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞: ${user.blasphemy || 0}\n` : ''}` +
      ` ⚠️ 𝐖𝐚𝐫𝐧: ${user.warn || 0} / 3\n` +
      `${user.warnlink ? ` ⚠️ 𝐖𝐚𝐫𝐧 𝐥𝐢𝐧𝐤: ${user.warnlink || 0} / 3\n` : ''}` +
      `${user.muto ? ` 🔇 𝐌𝐮𝐭𝐚𝐭𝐨: Si\n` : ''}` +
      `${user.banned ? ` 🚫 𝐂𝐨𝐦𝐚𝐧𝐝𝐢 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐢: Si\n` : ''}` +
      `${user.command ? ` 🎨 𝐂𝐨𝐦𝐚𝐧𝐝𝐢 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢: ${user.command || 0}\n` : ''}` +
      `${user.instagram ? ` 🔗 instagram.com/${user.instagram}` : ' 🔗 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: 𝐍𝐨𝐧 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨'}\n` +
      `${showBotInfo ? `⚡ 𝐕𝐞𝐥𝐨𝐜𝐢𝐭𝐚̀ 𝐛𝐨𝐭: ${speed} ms\n⤷ Scarica il bot: https://github.com/GabWT333/Gab333\n` : ''}` +
      `══════ •⊰✦⊱• ══════`,
    contextInfo: {
      mentionedJid: [who],
      forwardingScore: 99,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363341274693350@newsletter',
        serverMessageId: '',
        newsletterName: nomebot
      },
      externalAdReply: {
        title: isBot ? '333 Bot' : `${user.name || 'Sconosciuto'} | ${user.age} | ${gender}`,
        body: user.instagram ? '' : `${usedPrefix}setig + nome_ig per impostare Instagram`,
        sourceUrl: "https://wa.me/" + (mention ? mention.split("@")[0] : m.sender.split("@")[0]),
        thumbnail: pic ? await (await fetch(pic)).buffer() : await (await fetch('https://telegra.ph/file/560f1667a55ecf09650cd.png')).buffer(),
      }
    }
  }, { quoted: null })
}

handler.command = /^(bal|msg|attività|attivitá|attivita|profilo|info)$/i
export default handler