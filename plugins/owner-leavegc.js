let handler = async (m, { conn, args, command }) => {
    const allowedNumber = '46737807114@s.whatsapp.net'; // Sostituisci con il numero autorizzato

    if (m.sender !== allowedNumber) {
        await m.reply('Non hai il permesso di usare questo comando!');
        return;
    }

    await m.reply('Me so cagato il cazzo di fare il bot di turno qua dentro! 💩');
    await conn.groupLeave(m.chat);
};

handler.command = /^(out|leavegc|leave|salirdelgrupo)$/i;
handler.group = true;
handler.rowner = true;
export default handler;