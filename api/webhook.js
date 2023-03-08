process.env.NTBA_FIX_319 = "test";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN_GNSGPTBOT);

module.exports = async (request, response) => {
  try {
    if (!request?.body?.message?.text) {
      response.json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    }

    const ctx = request.body.message;

    console.log("----- start -----");
    console.log(ctx);
    console.log("----- end -----");

    const message = `✅ Thanks for your message: *""*\nHave a great day! 👋🏻`;
    const opts = {
      reply_to_message_id: ctx.message_id,
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
          ["uno :+1:"],
          ["uno \ud83d\udc4d", "due"],
          ["uno", "due", "tre"],
          ["uno", "due", "tre", "quattro"],
        ],
      },
    };

    await bot.sendMessage(ctx.chat.id, "I'm a test robot", opts);
    await bot.sendMessage(ctx.chat.id, message, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }
  response.json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
};
