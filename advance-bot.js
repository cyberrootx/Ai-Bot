const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot සක්‍රීයයි!');
});

// විධාන හැසිරවීම
const commands = {
    'info': async (message) => {
        const chat = await message.getChat();
        const info = `*ගෘහ පිළිබඳ තොරතුරු:*\nනම: ${chat.name}\nසාමාජිකයින්: ${chat.participants.length}`;
        message.reply(info);
    },
    
    'sticker': async (message) => {
        if (message.hasMedia) {
            const media = await message.downloadMedia();
            await message.reply(media, null, { sendMediaAsSticker: true });
        } else {
            message.reply('රූපයක් යොමු කරන්න sticker සාදා ගැනීමට');
        }
    },
    
    'broadcast': async (message, args) => {
        if (args.length > 0) {
            const broadcastMessage = args.join(' ');
            const chats = await client.getChats();
            chats.forEach(chat => {
                if (chat.isGroup) {
                    chat.sendMessage(`📢 Broadcast: ${broadcastMessage}`);
                }
            });
            message.reply('Broadcast පණිවිඩය යැවුවා!');
        }
    }
};

client.on('message', async (message) => {
    const content = message.body;
    
    // විධාන හඳුනාගැනීම
    if (content.startsWith('!')) {
        const args = content.slice(1).split(' ');
        const command = args.shift().toLowerCase();
        
        if (commands[command]) {
            await commands[command](message, args);
        } else {
            message.reply('නොදන්නා විධානයකි. !help භාවිතා කරන්න');
        }
    }
});

client.initialize();
