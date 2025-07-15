// server.js - Lógica do Bot de Suporte para o BrainSkill no Telegram

// É altamente recomendado mover o token para um ficheiro .env para segurança
// Ex: const token = process.env.TELEGRAM_BOT_TOKEN;
const token = '7958682758:AAGpMg_ABXmFHynJGheUUc4394WuuZUhBnE';

const TelegramBot = require('node-telegram-bot-api');

// Inicializa o bot a usar o método "polling" para obter novas atualizações.
const bot = new TelegramBot(token, { polling: true });

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

// Teclado principal com todos os botões
const mainKeyboard = {
    inline_keyboard: [
        [
            { text: '🎮 Abrir a Plataforma BrainSkill', web_app: { url: webAppUrl } }
        ],
        [
            { text: '📞 Ajuda & Suporte', url: 'https://brainskill.site/support' }
        ],
        [
            { text: '룰 Como Jogar', url: 'https://brainskill.site/how-to-play' }
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
                [{ text: '룰 Como Jogar', url: 'https://brainskill.site/how-to-play' }],
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

console.log('🤖 Bot do BrainSkill iniciado com sucesso...');

// Opcional: para lidar com erros de forma mais graciosa
bot.on('polling_error', (error) => {
    console.error(`[Erro de Polling] - ${error.code}: ${error.message}`);
});