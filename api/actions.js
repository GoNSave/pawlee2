import { reply, bot } from "../utils/telegram";

import { getAnswer } from "../utils/openai";
import { replyWithId } from "../utils/telegram";
import { updateUser } from "../utils/firebase";
import { AnswerResponse, MainMenu, EditProfile } from "../utils/constants";

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
  {
    action: "handleAnnouncements",
    description: "Send announcements",
    func: handleAnnouncements,
  },
  {
    action: "handleMainMenu",
    description: "Go to main menu",
    func: handleMainMenu,
  },
  {
    action: "handleProfile",
    description: "Edit profile",
    func: handleProfile,
  },
  {
    action: "handleExtraEarnings",
    description: "Extra Earnings",
    func: handleExtraEarnings,
  },
  {
    action: "handleEditProfile",
    description: "Edit Profile ",
    func: handleEditProfile,
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

export async function handleEditProfile(ctx, param) {
  return await bot.sendMessage(ctx.from.id, `Edit ${param}\n`);
}

export async function handleMainMenu(ctx, param) {}

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

export async function handleAnnouncements(ctx, param) {
  const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
  const announcement = `
  
  \n CW09 Mon - Fri  Motorbike/Cars/Ebike
  
   \nMon, 27 Feb, 12 am - Fri, 03 Mar 11:59 pm 
   Make 45 orders 👉 receive +$21
   Make 60 orders 👉 receive +$52
   Make 80 orders 👉 receive +$85
   Make 95 orders 👉 receive +$113
   Make 115 orders 👉 receive +$144
  
  \n CW10 Mon - Fri  Motorbike/Cars/Ebike
  
   \nMon, 27 Feb, 12 am - Fri, 03 Mar 11:59 pm 
   Make 45 orders 👉 receive +$21
   Make 60 orders 👉 receive +$52
   Make 80 orders 👉 receive +$85
   Make 95 orders 👉 receive +$113
   Make 115 orders 👉 receive +$144
  \n *90% Acceptance Rate & 95% Actual vs Planned`;
  return await bot.sendMessage(telegramId, announcement, AnswerResponse);
}

export async function handleProfile(ctx, param) {
  console.log("handleProfile ------ is", param);
  return await bot.sendMessage(
    ctx.from.id,
    `Chose the detail to edit\n`,
    EditProfile
  );
}

export async function handleExtraEarnings(ctx, param) {
  console.log("handleExtraEarnings ------", ctx);
  return replyWithId(
    ctx.from.id,

    `⚠️RULES OF THE WEEK⚠️

We are JUST paying for:
👉Payslips from 11:00 am to 2 pm and
     5:00 pm to 8 pm
👉Payslips from the 🔟 days before Today
👉Grab and Deliveroo payslips`
  );
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
  console.log("--------------------------------");
  console.log("in onAction", actionData, ctx);
  console.log("--------------------------------");
  for (const action of actions) {
    console.log("Find the action and call it", actionData[0], action.action);
    if (action.action === actionData[0]) {
      return await action.func(ctx, actionData[1]);
    }
  }

  const mainMenuButton = {
    reply_markup: {
      resize_keyboard: false,
      inline_keyboard: [
        [
          {
            text: "📋 Back to Main Menu ⬅️",
            callback_data: "handleBackToMainMenu:Talk with PawLee",
          },
        ],
      ],
    },
  };
  return await defaultResponse(
    ctx,
    "Sorry, I did not understand your request."
  );
  // return await bot.sendMessage(
  //   telegramId,
  //   `Sorry, I don't understand that command  ${ctx.data}`,
  //   mainMenuButton
  // );
  // return replyWithId(
  //   ctx.from.id,
  //   `Sorry, I don't understand that command  ${ctx.data}`
  // );
}
