process.env.NTBA_FIX_319 = "test";
import { onCommand } from "./commands";
import { getUser, updateUser } from "../utils/firebase";
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

    console.log(ctx);

    if (ctx.user?.lastCommand === "/start") {
      await surveyResponse(ctx);
      return response.send("OK");
    }
    console.log("----- after survey------------------------");
    if (ctx.entities) {
      if (ctx.entities[0]?.type === "bot_command") {
        updateUser({
          telegramId: ctx.from.id,
          lastCommand: ctx.text,
        });
        console.log("handle command: " + ctx.entities[0]);
        await onCommand(
          ctx,
          ctx.text,
          ctx.text.slice(ctx.entities[0].length).toLowerCase()
        );
      }
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
