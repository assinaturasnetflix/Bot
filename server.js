// server.js - Bot de Suporte INDEPENDENTE para o BrainSkill no Telegram

require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const vercelUrl = process.env.VERCEL_URL;
const bot = new TelegramBot(token);
const webhookUrl = `https://${vercelUrl}/api/bot`;

bot.setWebHook(webhookUrl)
    .then(() => console.log(`Webhook configurado com sucesso para a URL: ${webhookUrl}`))
    .catch((err) => console.error('Erro ao configurar o webhook:', err));

const app = express();
app.use(express.json());

// --- ROTA DE "HEALTH CHECK" ADICIONADA AQUI ---
// Esta rota responde a quem visita a URL principal no navegador.
app.get('/', (req, res) => {
    res.send('Bot de Suporte do BrainSkill está online e à escuta!');
});

app.post('/api/bot', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// --- O resto da lógica do bot permanece igual ---

bot.setMyCommands([
    { command: 'start', description: '🚀 Iniciar o bot e ver o menu principal' },
    { command: 'ajuda', description: '📞 Obter ajuda e links de suporte' },
    { command: 'regras', description: '📜 Ver como jogar e políticas' },
    { command: 'webapp', description: '🎮 Abrir a plataforma BrainSkill' }
]);

const welcomeMessage = `
Olá! 👋 Bem-vindo ao Bot de Suporte do **BrainSkill**.

Use os botões abaixo para navegar rapidamente ou use o **Menu de Comandos** para aceder às funções.

Estou aqui para ajudar!
`;

const webAppUrl = 'https://t.me/brainskill1_bot/Brainskill';

const mainKeyboard = {
    inline_keyboard: [
        [
            { text: '🎮 Abrir a Plataforma BrainSkill', web_app: { url: webAppUrl } }
        ],
        [
            { text: '📞 Ajuda & Suporte', url: 'https://brainskill.site/support' }
        ],
        [
            { text: '♟️ Como Jogar', url: 'https://brainskill.site/how-to-play' }
        ],
        [
            { text: '📜 Termos e Condições', url: 'https://brainskill.site/terms' },
            { text: '🔒 Privacidade', url: 'https://brainskill.site/privacy' }
        ],
        [
            { text: '❤️ Jogo Responsável', url: 'https://brainskill.site/responsible-gaming' }
        ]
    ]
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: mainKeyboard
    });
});

bot.onText(/\/ajuda/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Precisa de ajuda? Clique no botão abaixo para ir para a nossa página de suporte.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📞 Ajuda & Suporte', url: 'https://brainskill.site/support' }]
            ]
        }
    });
});

bot.onText(/\/regras/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Consulte as nossas regras e políticas nos links abaixo:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '♟️ Como Jogar', url: 'https://brainskill.site/how-to-play' }],
                [
                    { text: '📜 Termos e Condições', url: 'https://brainskill.site/terms' },
                    { text: '🔒 Privacidade', url: 'https://brainskill.site/privacy' }
                ]
            ]
        }
    });
});

bot.onText(/\/webapp/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Clique no botão abaixo para abrir a plataforma BrainSkill diretamente no Telegram!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎮 Abrir a Plataforma BrainSkill', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

module.exports = app;