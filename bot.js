const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const dotenv = require('dotenv');


dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot
if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
 } else {
    bot = new TelegramBot(token, { polling: true });
 }


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;


    request('https://los-simpsons-quotes.herokuapp.com/v1/quotes', function (error, response, body) {
        let result = JSON.parse(body)
        bot.sendMessage(chatId, result[0]['quote'] + " - " + result[0]['author'] );
    });

});

bot.onText(/\/quote/, (msg) => {
    const chatId = msg.chat.id;


    request('https://los-simpsons-quotes.herokuapp.com/v1/quotes', function (error, response, body) {
        let result = JSON.parse(body)
        bot.sendMessage(chatId, result[0]['quote'] + " - " + result[0]['author'] );
    });

});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

bot.sendMessage(chatId,"\n \
/start - startup message \n \
/quote - a random quote \n \
/gif   - get a random gif \n \
/help  - this list of commands \n \
/info  - Bot info \n \
\n");
});

bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;

bot.sendMessage(chatId, "\n \
Made by aioigzo \
\n The code is open source and can be found here: https://github.com/aioigzo \n \
\n")})


bot.onText(/\/gif/, (msg) => {
    const chatId = msg.chat.id;
    request.get("https://api.giphy.com/v1/gifs/random?api_key=" + process.env.GIPHY_API_KEY + "&tag=simpsons&rating=G", function(error, response, body){
        let result = JSON.parse(body)

        bot.sendDocument(chatId,result['data']['image_original_url'])
     })

})

const app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT)

app.post('/' + bot.token, (req,res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
} )