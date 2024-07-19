
const TelegramBot = require('node-telegram-bot-api');
const token = '6878089992:AAHtBq56It8GnFa2uo-vq4yu5BotCbi1aRw';
//const token = '7144069228:AAGWrpKAtvoNt0r1o0nChOu1SgxC4ZIIC7Q';

const mongoose = require('mongoose');
let urls = "mongodb+srv://doadmin:59LJ3D417if8xjB2@db-mongodb-blr1-12705-a6503f91.mongo.ondigitalocean.com/tokame?authSource=admin&replicaSet=db-mongodb-blr1-12705&tls=true"
mongoose.connect(urls, {
    useNewUrlParser: true, useUnifiedTopology: true, dbName: "tokame"
})

const user = require('./user')

const bot = new TelegramBot(token, { polling: true });
const { Telegraf, Markup } = require('telegraf');




async function getgmaeid(chatId) {

    let getgmaeidMessage = `<b style="color:blue">your game Id is :  </b><code>${chatId}</code>\n\n`;
    let sentMessage = await bot.sendMessage(chatId, getgmaeidMessage, {
        parse_mode: 'HTML',
        reply_markup: customInlineKeyboard.reply_markup,

    });
}

async function getreferralcode(chatId) {
    let getreferralcodeMessage = `<b style="color:blue">your referral code is :  </b><code>${chatId}</code>\n\n`;
    let sentMessage = await bot.sendMessage(chatId, getreferralcodeMessage, {
        parse_mode: 'HTML',
        reply_markup: customInlineKeyboard.reply_markup,
    });
}


async function registration(chatId) {
    let checkrefferalcode = await user.findOne({ id: chatId })
    if (!checkrefferalcode) {
        let sentMessage = await bot.sendMessage(chatId, 'Welcome to the registration bot! Do you have a referral code?', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Yes', callback_data: 'referral_yes' }],
                    [{ text: 'No', callback_data: 'referral_no' }]
                ]
            }
        });
    } else {
        let sentMessage = await bot.sendMessage(chatId, "Already Registered", {
            parse_mode: 'HTML',
            reply_markup: customInlineKeyboard.reply_markup,
        });
    }

}

bot.on('callback_query', async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;
    let username = query.message.chat.username
    if (data == 'referral_yes') {
        let referralcode = await getusermsg(chatId, 'Please enter your referral code')
        let checkrefferalcode = await user.findOne({ id: referralcode })
        if (checkrefferalcode) {
            let getreferralcodeMessage = `<b style="color:blue">your referral code is :  </b><code>${referralcode}</code>\n\n`;
            const newUser = new user({ id: chatId, username: username, earngametap: 0, claimgametap: 0, earngamespin: 0, claimgamespin: 0, child: [referralcode] });
            await newUser.save();
            user.findOneAndUpdate(
                { id: referralcode },
                { $push: { child: chatId } },
                { new: true, useFindAndModify: false },
                (err, updatedUser) => {
                    if (err) {
                        console.error('Error updating user:', err);
                    } else {
                        console.log('Updated user:', updatedUser);
                    }
                }
            )
            let sentMessage = await bot.sendMessage(chatId, getreferralcodeMessage, {
                parse_mode: 'HTML',
                reply_markup: customInlineKeyboard.reply_markup,
            });
        } else {
            let sentMessage = await bot.sendMessage(chatId, 'Wrong referral code', {
            })
        }

    } else if (data == 'referral_no') {
        const newUser = new user({ id: chatId, earngametap: 0, claimgametap: 0, earngamespin: 0, claimgamespin: 0 });
        await newUser.save();
        let sentMessage = await bot.sendMessage(chatId, 'Registration successful without referral code!', {
            reply_markup: customInlineKeyboard.reply_markup,

        })
    }

})

async function getusermsg(chatId, prompt) {
    return new Promise(async (resolve, reject) => {
        let sentMessage = await bot.sendMessage(chatId, prompt);
        const messageId = sentMessage.message_id;
        bot.on('message', (msg) => {
            if (msg.chat.id === chatId) {
                resolve(msg.text);
            }
            else {
                reject(false)
            }
        });
    })

}

async function PlayGame(chatId) {
    let checkrefferalcode = await user.findOne({ id: chatId })
    if (!checkrefferalcode) {
        let sentMessage = await bot.sendMessage(chatId, 'please register?', {
            parse_mode: 'HTML',
            reply_markup: customInlineKeyboard.reply_markup
            
        });
    } else {
        let sentMessage = await bot.sendMessage(chatId, "Welcome", {
            parse_mode: 'HTML',
            reply_markup: customInlineKeyboard.reply_markup,
        });
    }

}

const customInlineKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [            { text: 'Play Game', url: 'https://t.me/fufitestcoin_bot/tokame' }

            ],

            [{ text: 'Registration', callback_data: 'registration', color: 'primary' },
            { text: 'referral code', callback_data: 'getreferralcode', color: 'primary' }

            ],
            [
                { text: 'Get game Id', callback_data: 'getgmaeid', color: 'primary' },

            ],
            [
            ], [
                { text: 'About', callback_data: 'About', color: 'primary' }
            ],

        ]
    }
};

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    switch (action) {
        case 'registration':
            await registration(chatId);
            break;
        case 'getgmaeid':
            await getgmaeid(chatId);
            break;
        case 'getreferralcode':
            await getreferralcode(chatId);
            break;

    }
});

async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    if (text === '/start') {
        try {
            const chatInfo = await bot.getChat('@abcdefghijaef');
            const groupChatId = chatInfo.id;
            let member = await bot.getChatMember(groupChatId, userId);
            let checkuser = ['member', 'administrator', 'creator'].includes(member.status);
            if (checkuser) {
                let sentMessage = await bot.sendMessage(chatId, "Hi", {
                    parse_mode: 'Markdown',
                    reply_markup: customInlineKeyboard.reply_markup,
                });
                const messageId = sentMessage.message_id;
                setTimeout(() => {
                    bot.deleteMessage(chatId, messageId);
                }, deleteAfterMillis);
            } else {
                const welcomeMessage =
                    `🤖 Join @abcdefghijaef for access to the  group & bot.\n\n🔄 Send /start after joining.\n\n⏳ Access may take up to 1 minute`;
                let sentMessage = await bot.sendMessage(chatId, welcomeMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

    } else {
    }
}
bot.on('message', async (message) => {
    console.log("message")
    await handleMessage(message);
});










