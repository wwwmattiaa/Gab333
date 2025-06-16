const CONFIG = {
    MAX_WARNINGS: 3,
    INSTAGRAM_DOMAINS: ['instagram.com'],
    MESSAGES: {
        WARNING: '⚠ 𝐋𝐈𝐍𝐊 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈',
        WARNING_COUNT: '* ° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎 ',
        FINAL_WARNING: '⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈',
        ANTI_INSTA_HEADER: '𝐀𝐧𝐭𝐢 - 𝐈𝐧𝐬𝐭𝐚 '
    },
    BOT_NUMBER: '0@s.whatsapp.net',
    FAKE_MESSAGE_ID: 'Halo',
    THUMBNAIL_URL: 'https://telegra.ph/file/e12aae9f5ea6c2e5e52aa.png'
};

const createInstagramRegex = () => {
    const domains = CONFIG.INSTAGRAM_DOMAINS.join('|');
    return new RegExp(domains, 'i');
};

const linkRegex = createInstagramRegex();

export async function before(message, { isAdmin, groupMetadata, isBotAdmin }) {
    try {
        if (message.isBaileys && message.fromMe) {
            return true;
        }
        
        if (!message.isGroup) {
            return true;
        }
        
        const chatData = global.db.data.chats[message.chat];
        const sender = message.key.participant;
        const messageId = message.key.id;
        const userData = global.db.data.users[this.user.jid] || {};
        
        const containsInstagramLink = linkRegex.exec(message.text);
        const instagramDomain = CONFIG.INSTAGRAM_DOMAINS[0];
        
        if (isAdmin && chatData.antiinsta && message.text.includes(instagramDomain)) {
            return;
        }
        
        if (chatData.antiinsta && containsInstagramLink && !isAdmin && isBotAdmin) {
            await handleInstagramLink(message, sender, messageId, chatData);
        }
        
        return true;
        
    } catch (error) {
        console.error('Error in anti-instagram module:', error);
        return true;
    }
}

async function handleInstagramLink(message, sender, messageId, chatData) {
    if (!isBotAdmin) return;
    
    try {
        if (!global.db.data.users[message.sender]) {
            global.db.data.users[message.sender] = { warn: 0 };
        }
        
        global.db.data.users[message.sender].warn += 1;
        
        await conn.sendMessage(message.chat, {
            delete: {
                remoteJid: message.chat,
                fromMe: false,
                id: messageId,
                participant: sender
            }
        });
        
        const userWarnings = global.db.data.users[message.sender].warn;
        const userInfo = global.db.data.users[message.sender];
        
        if (userWarnings < CONFIG.MAX_WARNINGS) {
            await sendWarningMessage(message.chat, userInfo, userWarnings);
        } else {
            await removeUserAfterMaxWarnings(message);
        }
        
    } catch (error) {
        console.error('Error handling Instagram link:', error);
    }
}

async function sendWarningMessage(chatId, userInfo, warningCount) {
    const fakeMessage = createFakeMessage();
    const warningText = `${CONFIG.MESSAGES.WARNING}\n*${userInfo.warn}${CONFIG.MESSAGES.WARNING_COUNT}`;
    
    await conn.reply(chatId, warningText, fakeMessage);
}

async function removeUserAfterMaxWarnings(message) {
    global.db.data.users[message.sender].warn = 0;
    
    await message.reply(CONFIG.MESSAGES.FINAL_WARNING);
    
    await conn.groupParticipantsUpdate(
        message.chat, 
        [message.sender], 
        'remove'
    );
}

function createFakeMessage() {
    return {
        key: {
            participants: CONFIG.BOT_NUMBER,
            fromMe: false,
            id: CONFIG.FAKE_MESSAGE_ID
        },
        message: {
            locationMessage: {
                name: CONFIG.MESSAGES.ANTI_INSTA_HEADER,
                jpegThumbnail: null,
                vcard: createVCard()
            }
        },
        participant: CONFIG.BOT_NUMBER
    };
}

function createVCard() {
    return `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`;
}

async function loadThumbnail() {
    try {
        const response = await fetch(CONFIG.THUMBNAIL_URL);
        return await response.buffer();
    } catch (error) {
        console.error('Error loading thumbnail:', error);
        return null;
    }
}

export { CONFIG };

export const utils = {
    createInstagramRegex,
    createFakeMessage,
    createVCard,
    loadThumbnail
};