import { getAnswer } from "../utils/openai";
import { replyWithId } from "../utils/telegram";

// export async function handleIncomeTracker(ctx) {
//   console.log("-----handleIncomeTracker----");
//   return replyWithId(ctx.from.id, "Talk to pawlee now");
// }
// export async function handleIncentives(ctx) {
//   console.log("-----handleIncentives----");
//   return replyWithId(ctx.from.id, "Talk to pawlee now");
// }
// export async function handleAnnouncements(ctx) {
//   console.log("-----handleAnnouncements----");
//   return replyWithId(ctx.from.id, "Talk to pawlee now");
// }
// export async function handleAnnouncements(ctx) {
//   console.log("-----handleAnnouncements----");
//   return replyWithId(ctx.from.id, "Talk to pawlee now");
// }

// export async function handleTalkToPawlee(ctx) {
//   console.log("-----handleTalkToPawlee----");
//   return replyWithId(ctx.from.id, "Talk to pawlee now");
// }

export const actions = [
  { command: "/start", description: "Start saving now 📖", func: onStart },
  { command: "/tell", description: "Get a bedtime story 📖", func: onTell },
];

export async function onAction(ctx) {
  //   console.log(callbacks);
  //   callbacks[0].function(ctx);
  //   const exeCallback = callbacks.find((c) => c.function === ctx.data);
  //   if (exeCallback && exeCallback.function) {
  //     return exeCallback.func(ctx);
  //   }
  return reply(ctx, "Sorry, I don't understand that command.");
}
