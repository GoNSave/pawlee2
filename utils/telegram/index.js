// Require our Telegram helper package
const TelegramBot = require("node-telegram-bot-api");

export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_TOKEN_GNSGPTBOT
);

// const bot = new TelegramBot(process.env.TELEGRAM_TOKEN_GNSGPTBOT, {
//   polling: true,
// });
