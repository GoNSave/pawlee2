process.env.NTBA_FIX_319 = "test";
import { onCommand } from "./commands";

module.exports = async (request, response) => {
  try {
    if (!request?.body?.message?.text) {
      response.json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    }

    let ctx = request.body.message;

    console.log(ctx);
    if (ctx.entities) {
      if (ctx.entities[0]?.type === "bot_command")
        return await onCommand(
          ctx,
          ctx.text,
          ctx.text.slice(ctx.entities[0].length)
        );
    }
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
