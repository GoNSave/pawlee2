const TelegramBot = require("node-telegram-bot-api");

export const bot = new TelegramBot(process.env.TELEGRAM_TOKEN_GNSGPTBOT);

export const reply = async (ctx, message) => {
  console.log("replying", message);
  return await bot.sendMessage(ctx.chat.id, message);
};
