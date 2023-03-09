process.env.NTBA_FIX_319 = "test";
import { onCommand } from "./commands";
import { getUser } from "../utils/firebase";
import { surveyResponse } from "./survey";
module.exports = async (request, response) => {
  try {
    if (!request?.body?.message?.text) {
      return response.json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    }

    let ctx = request.body.message;

    ctx.user = await getUser({
      telegramId: ctx.from.id,
    });

    if (ctx.user?.state === "survey") {
      surveyResponse(ctx);
      return response.send("OK");
    }
    console.log(ctx);
    if (ctx.entities) {
      if (ctx.entities[0]?.type === "bot_command")
        await onCommand(ctx, ctx.text, ctx.text.slice(ctx.entities[0].length));
      return response.send("OK");
    }
    console.log("not a command, handle it");
    return response.send("OK");
  } catch (error) {
    console.error("Error sending message");
    console.log("------ req begin-----------------------------------");
    console.log(request);
    console.log("------ req end-----------------------------------");
    console.log(error.toString());
  }
  return response.send("OK");
};
