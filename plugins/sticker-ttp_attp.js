import { sticker } from '../lib/sticker.js'
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {  
  if (!text) throw `⚠️ *Escriba un texto para convertirlo en sticker.*\n\n📌 *Ejemplo:* \n${usedPrefix + command} Nuevo Sticker`

  let encodedText = encodeURIComponent(text)

  if (command === 'attp') {  
    let url = `https://api.xteam.xyz/attp?text=${encodedText}`  
    let stiker = await sticker(null, url, global.packname, global.author)  
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true })  
  }  

  if (command === 'ttp') {  
    let url = `https://api.xteam.xyz/ttp?text=${encodedText}`  
    let stiker = await sticker(null, url, global.packname, global.author)  
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true })  
  }  
}

handler.command = handler.help = ['ttp', 'attp']
handler.tags = ['sticker']
export default handler