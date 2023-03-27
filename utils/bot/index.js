import { NetApi } from "../netapi";
import { getUser } from "../firebase";

export class TelegramBot {
  constructor(botId) {
    this.httpApi = new NetApi(botId);
    this.user = null;
    console.log("TelegramBot ", botId);
  }

  async init(request, response) {
    this.ctx = request.body.message;
    console.log("context", this.ctx);
    this.user = await getUser({
      telegramId: this.ctx.from.id,
    });

    if (request.body.callback_query) {
      return await onAction(request.body.callback_query);
    }

    if (request.body.message?.photo) {
      console.log("handle photo", request.body.message);
    }

    if (request.body.message?.documents) {
      console.log("handle documents", request.body.message);
    }

    if (request.body.message.entities) {
      if (request.body.message.entities[0]?.type === "bot_command") {
        updateUser({
          telegramId: ctx.from.id,
          lastCommand: ctx.text,
        });
        console.log("handle command: " + ctx.entities[0]);
        return await onCommand(
          ctx,
          ctx.text,
          ctx.text.slice(ctx.entities[0].length).toLowerCase()
        );
      }
    }

    if (!request?.body?.message?.text) {
      return response.json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    }

    const ret = await this.sendMessage(
      `Sorry ${this.ctx.from.first_name} 🙏!  %0A <i>I don't understand your below request:</i>  %0A%0A<b>${this.ctx.text}</b>%0A%0ATry one of the following options please:%0A`
    );
    response.send(ret);
  }

  async sendMessage(message) {
    const ret = await this.httpApi.sendMessage(this.ctx.chat.id, message);
    return message;
  }

  async sendImage(ctx, param) {
    try {
      const imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee-2-tutorial.png?alt=media&token=64da5765-8fa9-4dca-bee2-d5fb0f37d77d";
      const imageResponse = await https.get(imageUrl);
      const photo = imageResponse.pipe(
        new stream.PassThrough()
      ); /* convert the image to a readable stream */

      const ret = await this.httpApi.sendPhoto(ctx.chat.id, photo);
      console.log("sent photo already ", ret);
    } catch (e) {
      console.log(e);
    }

    const message =
      "Press 👉 /menu to see all the options that I have for you.";
    return this.reply(ctx, message);
  }

  async reply(ctx, message) {
    return this.sendMessage(ctx, message);
  }
}

// module.exports = { TelegramBot };
