// Plugin fatto da Gabs & 333 Staff
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (msg, { conn, usedPrefix, command, args, isOwner }) => {
  let chatConfig = global.db.data.chats[msg.chat] || {}

  const toggleOptions = {
    detect: { configKey: "detect", label: "🔍 𝐃𝐞𝐭𝐞𝐜𝐭" },
    gpt: { configKey: "gpt", label: "🤖 𝐆𝐏𝐓" },
    jadibot: { configKey: "jadibot", label: "🤖 𝐉𝐚𝐝𝐢𝐛𝐨𝐭" },
    benvenuto: { configKey: "welcome", label: "👋 𝐁𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨" },
    sologruppo: { configKey: "sologruppo", label: "👥 𝐒𝐨𝐥𝐨 𝐆𝐫𝐮𝐩𝐩𝐨" },
    soloprivato: { configKey: "soloprivato", label: "💬 𝐒𝐨𝐥𝐨 𝐏𝐫𝐢𝐯𝐚𝐭𝐨" },
    modoadmin: { configKey: "modoadmin", label: "⚠️ 𝐌𝐨𝐝𝐨 𝐀𝐝𝐦𝐢𝐧", ownerOnly: true },
    bangp: { configKey: "bangp", label: "🚫 𝐁𝐚𝐧𝐠𝐩" },
    antiporno: { configKey: "antiporno", label: "🚫 𝐀𝐧𝐭𝐢𝐩𝐨𝐫𝐧𝐨" },
    anticall: { configKey: "anticall", label: "📵 𝐀𝐧𝐭𝐢𝐜𝐚𝐥𝐥" },
    antitrava: { configKey: "antitrava", label: "🚫 𝐀𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚" },
    antipaki: { configKey: "antipaki", label: "🚫 𝐀𝐧𝐭𝐢𝐩𝐚𝐤𝐢" },
    antilink: { configKey: "antilink", label: "🚫 𝐀𝐧𝐭𝐢𝐥𝐢𝐧𝐤" },
    antiinsta: { configKey: "antiinsta", label: "🚫 𝐀𝐧𝐭𝐢𝐈𝐧𝐬𝐭𝐚" },
    antitiktok: { configKey: "antitiktok", label: "🚫 𝐀𝐧𝐭𝐢𝐓𝐢𝐤𝐓𝐨𝐤" },
    antielimina: { configKey: "antielimina", label: "🚫 𝐀𝐧𝐭𝐢𝐄𝐥𝐢𝐦𝐢𝐧𝐚" },
    bestemmiometro: { configKey: "bestemmiometro", label: "⚡ 𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨" },
    antilinkgp: { configKey: "antilinkgp", label: "🚫 𝐀𝐧𝐭𝐢𝐥𝐢𝐧𝐤 𝐆𝐫𝐮𝐩𝐩𝐢" },
    antilinkhard: { configKey: "antilinkhard", label: "🚫 𝐀𝐧𝐭𝐢𝐥𝐢𝐧𝐤 𝐇𝐚𝐫𝐝" },
    antitelegram: { configKey: "antitelegram", label: "🚫 𝐀𝐧𝐭𝐢𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦" }
  }

  let enable = /true|enable|attiva|(turn)?on|1/i.test(command)
  let option = (args[0] || "").toLowerCase()

  if (!option) {
    let menuText = "📌 *𝐎𝐩𝐳𝐢𝐨𝐧𝐢 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢:*\n\n"
    Object.entries(toggleOptions).forEach(([key, opt]) => {
      let state = chatConfig[opt.configKey] ? "🟢 𝐀𝐭𝐭𝐢𝐯𝐚𝐭𝐚" : "🔴 𝐃𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚"
      menuText += `• ${opt.label} (${key}): ${state}\n`
    })
    return conn.sendMessage(msg.chat, { text: menuText }, { quoted: msg })
  }

  if (!toggleOptions.hasOwnProperty(option)) {
    return conn.sendMessage(
      msg.chat,
      { text: "❌ *𝐎𝐩𝐳𝐢𝐨𝐧𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚!* ⚠️\n\n🔹 𝐃𝐢𝐠𝐢𝐭𝐚 *" + usedPrefix + command + "* 𝐩𝐞𝐫 𝐯𝐢𝐬𝐮𝐚𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐥𝐞 𝐨𝐩𝐳𝐢𝐨𝐧𝐢 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢." },
      { quoted: msg }
    )
  }

  let opt = toggleOptions[option]

  if (opt.ownerOnly && !isOwner) {
    return conn.sendMessage(
      msg.chat,
      { text: "🔒 *𝐒𝐨𝐥𝐨 𝐥'𝐨𝐰𝐧𝐞𝐫 𝐩𝐮ò 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐚 𝐨𝐩𝐳𝐢𝐨𝐧𝐞!*" },
      { quoted: msg }
    )
  }

  chatConfig[opt.configKey] = enable

  let stateText = enable ? "🟢 *𝐀𝐭𝐭𝐢𝐯𝐚𝐭𝐚*" : "🔴 *𝐃𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚*"
  return conn.sendMessage(
    msg.chat,
    { text: `✅ *𝐎𝐩𝐳𝐢𝐨𝐧𝐞:* _${opt.label}_\n📢 *𝐒𝐭𝐚𝐭𝐨:* ${stateText}` },
    { quoted: msg }
  )
}

handler.help = ["toggle <opzione> [stato]"]
handler.tags = ["config"]
handler.command = /^((attiva|disabilita)|(turn)?[01])$/i
export default handler