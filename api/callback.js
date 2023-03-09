import { getAnswer } from "../utils/openai";
import { replyWithId } from "../utils/telegram";

export async function onCallback(ctx) {
  console.log("onCallback", ctx);
  // const chosenAction = actions.find((action) => action.command === command);
  // if (chosenAction && chosenAction.func) {
  //   return chosenAction.func(ctx, param);
  // }
  return replyWithId(ctx.from.id, "Handle this callback.");
}
