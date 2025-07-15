// server.js - Bot de Suporte INDEPENDENTE para o BrainSkill no Telegram

// É obrigatório usar variáveis de ambiente na Vercel
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Obtenha o token do bot a partir das variáveis de ambiente
const token = process.env.TELEGRAM_BOT_TOKEN;

// A Vercel fornece esta variável de ambiente automaticamente com a URL do seu deploy
const vercelUrl = process.env.VERCEL_URL;

// Crie a instância do bot sem polling
const bot = new TelegramBot(token);

// A URL completa do nosso webhook
const webhookUrl = `https://${vercelUrl}/api/bot`;

// Configure o webhook para que o Telegram envie as mensagens para a nossa URL
bot.setWebHook(webhookUrl)
    .then(() => console.log(`Webhook configurado com sucesso para a URL: ${webhookUrl}`))
    .catch((err) => console.error('Erro ao configurar o webhook:', err));

// Crie uma aplicação Express
const app = express();
app.use(express.json());

// Este é o único endpoint que a nossa aplicação terá.
// O Telegram irá fazer um pedido POST para esta rota sempre que receber uma mensagem.
app.post('/api/bot', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); // Envia uma resposta 'OK' para o Telegram para confirmar o recebimento
});

// --- Definição dos Comandos e Menus (lógica do bot) ---

// Define os comandos que aparecerão no botão "Menu" do Telegram
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

// Teclado principal com todos os botões inline
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

// Quando um utilizador envia /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: mainKeyboard
    });
});

// Responde ao comando /ajuda
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

// Responde ao comando /regras
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

// Responde ao comando /webapp
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

// Exporta a aplicação Express para a Vercel poder usá-la
module.exports = app;