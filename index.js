const TelegramBot = require('node-telegram-bot-api')
// replace the value below with the Telegram token you receive from @BotFather
const token = '5548753687:AAFfEe_UXEgDznxJoUC4l5ZGS3urjpr_gVU';
const {gameOptions, againOptions} = require('./options')
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const charts = {}




const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю тебе цифру от 0 до 9, а ты ее отгадаешь')
     const randomNumber = Math.floor(Math.random() * 10)
     charts[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальная команда'},
        {command: '/info', description:'Узнай свое имя'},
        {command: '/game', description: 'Начать игру' }
    ])

    // messages.
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp')
            return bot.sendMessage(chatId, 'Hello')
        }

        if(text === '/info'){
            return bot.sendMessage(chatId, `your are ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if(text === '/game'){
            return startGame(chatId)
        }
        if(text === '/again'){
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'I dont understand you')
        
    });

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === charts[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${charts[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${charts[chatId]}`, againOptions)
        }
    })
}

start()