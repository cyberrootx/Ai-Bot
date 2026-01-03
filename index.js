const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// WhatsApp ක්ලයන්ට් සාදන්න
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR කේතය පෙන්වන්න
client.on('qr', (qr) => {
    console.log('QR කේතය ස්කෑන් කරන්න:');
    qrcode.generate(qr, { small: true });
});

// සම්බන්ධතාවය ස්ථාපිත වූ විට
client.on('ready', () => {
    console.log('WhatsApp bot සූදානම්!');
});

// පණිවිඩ ලැබෙන විට
client.on('message', async (message) => {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const content = message.body.toLowerCase();

    console.log(`පණිවිඩය: ${content} | එව්වේ: ${contact.pushname}`);

    // සරල පණිවිඩ ප්‍රතිචාර
    if (content === 'හලෝ' || content === 'hello' || content === 'hi') {
        message.reply(`හලෝ ${contact.pushname}! මම WhatsApp bot එකක්. ඔයාට කෙසේ varද?`);
    }
    
    else if (content === 'කොහෙද' || content === 'location') {
        message.reply('මම අඩුම වේලාවකින් පිළිතුරු දෙන bot එකක්!');
    }
    
    else if (content === 'time' || content === 'වේලාව') {
        const now = new Date();
        message.reply(`දැන් වේලාව: ${now.toLocaleTimeString()}`);
    }
    
    else if (content === 'සහය' || content === 'help') {
        const helpText = `භාවිතා කළ හැකි විධාන:
        * හලෝ/hello - ආචාර කිරීම
        * කොහෙද/location - ස්ථානය ගැන
        * time/වේලාව - වර්තමාන වේලාව
        * සහය/help - සහාය පණිවිඩය`;
        message.reply(helpText);
    }
    
    // Group පණිවිඩ සඳහා
    else if (chat.isGroup) {
        if (content.startsWith('!සෑම')) {
            message.reply('@everyone කාලෙකට පස්සේ හමුවෙමු!');
        }
    }
});

// දෝෂ හැසිරවීම
client.on('auth_failure', (msg) => {
    console.error('Auth දෝෂය:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
});

// WhatsApp සම්බන්ධ කරන්න
client.initialize();
