import { reply, bot } from "../utils/telegram";

import { getAnswer } from "../utils/openai";
import { replyWithId } from "../utils/telegram";
import { updateUser } from "../utils/firebase";
import { AnswerResponse, MainMenu } from "../utils/constants";

export const actions = [
  {
    action: "handleTalkToPawlee",
    description: "Talk to Pawlee",
    func: handleTalkToPawlee,
  },
  {
    action: "replyFromPawlee",
    description: "Talk to Pawlee",
    func: replyFromPawlee,
  },
  {
    action: "answerResponse",
    description: "Response to answer",
    func: answerResponse,
  },
];

const AnswerResponse = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "    👍    ",
          callback_data: "answerResponse:Like",
        },
        {
          text: "👎",
          callback_data: "answerResponse:Dislike",
        },
        {
          text: "🤐",
          callback_data: "answerResponse:End",
        },
      ],
    ],
  },
};

export async function answerResponse(ctx, param) {
  console.log("answerResponse ------", param);
  await updateUser({
    telegramId: ctx.from.id,
    lastCommand: "none",
  });

  return await bot.sendMessage(
    ctx.from.id,
    `It was pleasure talking to you ${ctx?.from?.first_name}, let's talk again soon.`,
    MainMenu
  );
  // return replyWithId(ctx.from.id, ``);
}

export async function replyFromPawlee(ctx, param) {
  console.log("replyFromPawlee ------", param);
  const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
  const answer = await getAnswer(param);
  // const answer = "The answer is coming for " + param;
  return await bot.sendMessage(telegramId, answer, AnswerResponse);
}

export async function handleTalkToPawlee(ctx, param) {
  console.log("handleTalkToPawlee ------", ctx);
  const keyboard = {
    //   reply_to_message_id: ctx.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🌧️ Tips for riding in rain 🌧️",
            callback_data: "replyFromPawlee:Tips for riding in rain",
          },
        ],
        [
          {
            text: "⛽ How to save fuel? ⛽",
            callback_data: "replyFromPawlee:How to save fuel?",
          },
        ],
        [
          {
            text: "💰 Tips for saving money? 💰",
            callback_data: "replyFromPawlee:Tips for saving money?",
          },
        ],
      ],
    },
  };

  await updateUser({
    telegramId: ctx.from.id,
    lastCommand: "talk",
  });

  const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
  await bot.sendMessage(
    telegramId,
    `Hi ${ctx.from.first_name}! \n\n I'm Pawlee, your personal assistant. You can ask me anything you want, try any of following...`,
    keyboard
  );
  return await bot.sendMessage(
    telegramId,
    `\n\n our just type your question ...`
  );
}

export async function onAction(ctx) {
  const actionData = ctx.data.split(":");
  console.log(actionData);
  for (const action of actions) {
    if (action.action === actionData[0]) {
      return await action.func(ctx, actionData[1]);
    }
  }
  return replyWithId(
    ctx.from.id,
    `Sorry, I don't understand that command ${ctx.data}`
  );
}
