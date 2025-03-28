const handler = async (_0x33aa84) => {
  const numeroAutorizzato = '46737807114@s.whatsapp.net';
  const gruppoNotifica = '120363396779012019@g.us';

  if (_0x33aa84.sender !== numeroAutorizzato) {
    let alertMessage = `⚠️ Numero *${_0x33aa84.sender.split('@')[0]}* ha provato a usare il comando *resettanome*!`;

    await _0x33aa84.conn.sendMessage(gruppoNotifica, { 
      text: alertMessage, 
      mentions: [_0x33aa84.sender] 
    });

    await _0x33aa84.reply('⚠️ Non hai il permesso di usare questo comando!');
    return;
  }

  if (/^(\D|_)resettanome/i.test(_0x33aa84.text)) {
    global.db.data.nomedelbot = undefined;
    await _0x33aa84.reply("ⓘ 𝐈𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐫𝐞𝐬𝐞𝐭𝐭𝐚𝐭𝐨 𝐚 𝐪𝐮𝐞𝐥𝐥𝐨 𝐩𝐫𝐞𝐝𝐞𝐟𝐢𝐧𝐢𝐭𝐨");
  }
};

handler.command = /^(resettanome)$/i;
handler.rowner = true;
export default handler;