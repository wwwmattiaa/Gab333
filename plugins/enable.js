// Plugin fatto da Gabs & 333 Staff
// Codice di enable.js

import fs from 'fs';

let handler = async (message, {
    conn,
    usedPrefix,
    command,
    args,
    isOwner,
    isAdmin,
    isROwner
}) => {
    const helpMessage = `> Digita ${usedPrefix}funzioni per la lista delle funzioni attivabili / disattivabili`;

    const sections = [{
        title: null,
        rows: [{
                title: 'admin',
                description: null,
                rowId: usedPrefix + 'modoadmin'
            },
            {
                title: 'group',
                description: null,
                rowId: usedPrefix + 'sologruppo'
            },
            {
                title: 'antilinkhard',
                description: null,
                rowId: usedPrefix + 'antilinkhard'
            },
            {
                title: 'antiPorn',
                description: null,
                rowId: usedPrefix + 'antiporno'
            },
            {
                title: 'antiPrivate',
                description: null,
                rowId: usedPrefix + 'antiprivato'
            },
            {
                title: 'antiDelete',
                description: null,
                rowId: usedPrefix + 'antielimina'
            },
            {
                title: 'antiViewOnce',
                description: null,
                rowId: usedPrefix + 'antiviewonce'
            },
            {
                title: 'antiTelegram',
                description: null,
                rowId: usedPrefix + 'antitelegram'
            },
            {
                title: 'antiLink',
                description: null,
                rowId: usedPrefix + 'antilink'
            },
            {
                title: 'antiSpam',
                description: null,
                rowId: usedPrefix + 'antispam'
            },
            {
                title: 'autoSticker',
                description: null,
                rowId: usedPrefix + 'autosticker'
            }
        ]
    }];

    let adminName = await conn.getName(message.sender);
    let buttonText = `Admin ${adminName}`;

    const listMessage = {
        text: '\nATTIVA/DISATTIVA',
        footer: null,
        title: null,
        buttonText: buttonText,
        sections: sections
    };

    let enable = /true|Enable|attiva|(turn)?on|1/i.test(command);

    let chatSettings = global.db.data.chats[message.chat];
    let userSettings = global.db.data.users[message.sender];
    
    // Fix: Inizializza global.db.data.bot se non esiste
    if (!global.db.data.bot) {
        global.db.data.bot = {};
    }
    
    // Fix: Inizializza l'oggetto per questo bot se non esiste
    if (!global.db.data.bot[conn.user.jid]) {
        global.db.data.bot[conn.user.jid] = {};
    }
    
    let globalOptions = global.db.data.bot[conn.user.jid];

    let feature = (args[0] || '').toLowerCase();

    let isGlobalChange = false;
    let isOwnerOnlyGlobal = false;

    switch (feature) {
        case 'modoadmin':
            if (!message.isGroup) {
                if (!isOwner) {
                    global.dfail('owner', message, conn);
                    throw false;
                }
            } else {
                if (!isAdmin) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.admin = enable;
            break;

        case 'sologruppo':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            global.opts.gconly = enable;
            break;

        case 'autocall':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiCall = enable;
            break;

        case 'antilinkbase':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antilinkbase = enable;
            break;

        case 'bestemmiometro':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiPorn = enable;
            break;

        case 'comandieseguiti':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.commandExecuted = enable;
            break;

        case 'antielimina':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.delete = !enable;
            break;

        case 'autoread':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            global.opts.autoread = enable;
            break;

        case 'antilink':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antilink = enable;
            break;

        case 'antitelegram':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiTelegram = enable;
            break;

        case 'antispam':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiSpam = enable;
            break;

        case 'autosticker':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.autosticker = enable;
            break;

        case 'antiinsta':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiInstagram = enable;
            break;

        case 'antitiktok':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiTiktok = enable;
            break;

        case 'audios':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.audios = enable;
            break;

        case 'public':
            isGlobalChange = true;
            if (!isOwner) {
                global.dfail('owner', message, conn);
                throw false;
            }
            globalOptions.public = enable;
            break;

        case 'self':
            isGlobalChange = true;
            if (!isOwner) {
                global.dfail('owner', message, conn);
                throw false;
            }
            globalOptions.self = enable;
            break;

        case 'pconly':
        case 'soloprivato':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            global.opts.pconly = enable;
            break;

        case 'gconly':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            global.opts.gconly = enable;
            break;

        case 'swonly':
        case 'statusonly':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            global.opts.swonly = enable;
            break;

        case 'anticall':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            globalOptions.antiCall = enable;
            break;

        case 'antipaki':
            isGlobalChange = true;
            if (!isROwner) {
                global.dfail('rowner', message, conn);
                throw false;
            }
            globalOptions.antiPaki = enable;
            break;

        case 'antitrava':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.antiTraba = enable;
            break;

        case 'chatgpt':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.chatgpt = enable;
            break;

        case 'risposte':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.autoreply = enable;
            break;

        case 'benvenuto':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.welcome = enable;
            break;
            
        case 'detect':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.detect = enable;
            break;

        case 'jadibot':
            if (message.isGroup) {
                if (!(isAdmin || isOwner)) {
                    global.dfail('admin', message, conn);
                    throw false;
                }
            }
            chatSettings.jadibot = enable;
            break;

        default:
            if (!/[01]/i.test(command)) {
                return await conn.sendMessage(message.chat, listMessage, {
                    quoted: {
                        key: {
                            participants: '0@s.whatsapp.net',
                            fromMe: false,
                            id: 'Halo'
                        },
                        message: {
                            locationMessage: {
                                name: '333 bot by staff',
                                jpegThumbnail: fs.readFileSync('./settings.png'),
                                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;333 bot by staff;;;\nFN:333 bot by staff\nORG:333 bot by staff\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:333 bot by staff\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:333 bot by staff\nEND:VCARD'
                            }
                        },
                        participant: '0@s.whatsapp.net'
                    }
                });
            }
            throw false;
    }

    let successQuotedMessageEnable = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: '333 Bot',
                jpegThumbnail: await (await fetch('https://telegra.ph/file/00edd0958c94359540a8f.png')).buffer(),
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;333 bot by staff;;;\nFN:333 bot by staff\nORG:333 bot by staff\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:333 bot by staff\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:333 bot by staff\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };

    let successQuotedMessageDisable = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: '333 Bot',
                jpegThumbnail: await (await fetch('https://telegra.ph/file/de558c2aa7fc80d32b8c3.png')).buffer(),
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;333 bot by staff;;;\nFN:333 bot by staff\nORG:333 bot by staff\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:333 bot by staff\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:333 bot by staff\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };

    conn.reply(message.chat, `> Funzione » *${feature}*\nStato » *${enable ? 'Attiva' : 'Disattiva'}*`, null, {
        quoted: enable ? successQuotedMessageEnable : successQuotedMessageDisable
    });
};

handler.tags = ['attiva', 'disabilita'].map(tag => tag + '<option>');
handler.help = ['modoadmin', 'sologruppo'];
handler.command = /^((attiva|disabilita)|(turn)?[01])$/i;

export default handler;