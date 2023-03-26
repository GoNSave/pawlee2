import { reply, bot } from "./../utils/telegram";
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

import { getAnswer } from "./../utils/openai";
import { replyWithId } from "./../utils/telegram";
import { updateUser } from "./../utils/firebase";
import { getSurgeData } from "./../utils/surge";
import { getQuestData } from "../utils/quest";

import { getQuestionsFromSheet } from "../utils/gsheet";

// export const questions = [
//   {
//     question: "What is your gender? 🚹 🚺",
//     answers: [
//       [{ text: "👨 Man" }, { text: "👩 Woman" }, { text: "🧑 Others" }],
//     ],
//     key: "gender",
//   },
//   {
//     question: "How old are you? 🎁 🎂 🎈",
//     answers: [
//       [{ text: "18-25 🎓" }, { text: "25-35 👨‍💼" }, { text: "35-45 🧑‍💼" }],
//       [{ text: "45-55 👴" }, { text: "55-65 🧓" }, { text: "65+ 🧑‍🦳" }],
//     ],
//     key: "age",
//   },
//   {
//     question: "Chose the delivery company you work for the most: 🏍️ 🚴 🚗 ",
//     answers: [
//       [{ text: "🛵 Grab" }, { text: "🍽️ FoodPanda" }, { text: "🍕 Deliveroo" }],
//     ],
//     key: "company",
//   },
//   {
//     question: " What vehicle you ride? 🚲 🛵 🚗",
//     //DO NOT CHANGE THE FOLLOWING TEXT OTHERWISE QUEST INCENTIVE IN FOLLOWING SPREADSHEET WILL BREAK
//     //https://docs.google.com/spreadsheets/d/1wwOr2Savmn3HQDGjFRdK5kRevH_kZLZb8yxuFiyrehE/edit#gid=0

//     answers: [
//       [{ text: "🏍️ Motorbike" }, { text: "🚴 Bicyle" }],
//       [{ text: "🚗 Car" }, { text: "🚲 E-bike" }, { text: "🚶 Walker" }],
//     ],
//     key: "vehicle",
//   },
//   {
//     question: "What's your preferred zone in SG to work in? 📍 ",
//     answers: [
//       [{ text: "Sengkang" }, { text: "West" }],
//       [{ text: "Panjang" }, { text: "Yishun" }],
//       [{ text: "Bedok" }, { text: "Serangoon" }],
//       [{ text: "Geylang" }, { text: "Bukit Timah" }],
//       [{ text: "East" }, { text: "Far East" }],
//       [{ text: "SG South" }, { text: "AMK" }],
//       [{ text: "Woodlands" }],
//     ],
//     key: "zone",
//   },
//   {
//     question:
//       " How did you buy your mobility device? (Choose ‘Not applicable’ if you don’t use a vehicle) 🛴 🚲 🚗",
//     answers: [
//       [{ text: "🏦 Bank Loan" }, { text: "💰 Savings" }],
//       [{ text: "🤝 Borrowed from friends" }],
//       [{ text: "🚫 Not applicable" }],
//     ],
//     kye: "purchase",
//   },
//   {
//     question: "How often do you take your mobility device to maintenance? ⚙️",
//     answers: [
//       [{ text: "Every 2️⃣ weeks" }, { text: "Every 4️⃣ weeks" }],
//       [{ text: "Every 6️⃣ weeks" }, { text: "Every 8️⃣ weeks" }],
//       [{ text: "Other" }],
//     ],
//     key: "maintenance_frequency",
//   },
//   {
//     question:
//       "How much do you spend each time you do maintenance to your mobility device? 💸",
//     answers: [
//       [{ text: "0 to 50 SGD" }, { text: "50 to 100 SGD" }],
//       [{ text: "100 to 250 SGD" }, { text: "250 to 500 SGD" }],
//       [{ text: "500+ SGD" }, { text: "Other" }],
//     ],
//     key: "maintenance_cost",
//   },
//   {
//     question:
//       "Where do you spend the greatest amount of money to do your work? 🤑",
//     answers: [
//       [{ text: "Internet data for mobile phone 🌐" }],
//       [{ text: "Maintenance ⚙️" }, { text: "Fuel ⛽" }],
//       [{ text: "Mobile phone 📱" }, { text: "Other" }],
//     ],
//     key: "work_expenses",
//   },
//   {
//     question: "What do you do during the off-peak hours? ⌛",
//     answers: [
//       [{ text: "I rest 💤" }, { text: "I eat 🥢" }],
//       [{ text: "I would like to earn extra 💰" }],
//       [{ text: "I have another job 📛" }],
//       [{ text: "I learn new things 📚" }],
//       [{ text: "Other" }],
//     ],
//     key: "off_peak_activities",
//   },
//   {
//     question: "Do you think you have a stable income? 📈",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "stable_income",
//   },
//   {
//     question:
//       "Are you currently looking for another job or a source of income? 🤝",
//     answers: [
//       [{ text: "Yes 👍" }, { text: "No ⛔" }],
//       [{ text: "I already have another part-time job" }],
//     ],
//     key: "looking_for_job",
//   },
//   {
//     question:
//       "Do you feel that advice can help to increase your income as a rider? 🫰",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "advice_for_income",
//   },
//   {
//     question:
//       "Have you ever taken out a loan from a bank within the past five years? 💵",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "loan_history",
//   },
//   {
//     question: "Do you record your monthly income and expenses? 📋",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "record_income_expenses",
//   },
//   {
//     question:
//       "Have you ever had an accident that stopped you from earning an income? ✋",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "accident_stopped_income",
//   },
//   {
//     question: "Do you have insurance on your mobility device? 💰",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "mobility_device_insurance",
//   },
//   {
//     question:
//       "Do you have income Insurance? Meaning that if you have an accident, they will give you some money to keep your income during recovery time? 💱",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "income_insurance",
//   },
//   {
//     question: "Do you save for retirement? 👴",
//     answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
//     key: "save_for_retirement",
//   },
// ];

import {
  AnswerResponse,
  MainMenu,
  EditProfile,
  SurgeFee,
  LikeDislikeMainMenu,
  QuestIncentive,
  IncomeTracker,
} from "../utils/constants";
import { defaultResponse } from "../utils/constants";
export const actions = [
  {
    action: "handleTalkToPawlee",
    description: "Chat Pawlee",
    func: async (ctx, param) => {
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
        `Hi ${ctx.from.first_name}! 👋 \nAs an AI language model, I'm here to assist you in finding information quickly and easily, making your work more efficient`,
        keyboard
      );
      return await bot.sendMessage(
        telegramId,
        `\n\n Ask me anything work-related, and I'll provide the best answer I can!`
      );
    },
  },
  {
    action: "replyFromPawlee",
    description: "Chat with Pawlee",
    func: async (ctx, param) => {
      console.log("replyFromPawlee ------", param);
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const answer = await getAnswer(param);
      // const answer = "The answer is coming for " + param;
      return await bot.sendMessage(telegramId, answer, AnswerResponse);
    },
  },
  {
    action: "answerResponse",
    description: "Response to answer",
    func: async (ctx, param) => {
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
    },
  },
  {
    action: "handleIncomeTracker",
    description: "Send announcements",
    func: async (ctx, param) => {
      await bot.sendMessage(
        ctx.from.id,
        `\n Hey ${ctx?.from?.first_name}, 👋 Juggling multiple sources of income can be a hassle. Let me simplify things for you by putting everything in one place!`
      );
      await bot.sendMessage(
        ctx.from.id,
        `\n Just share your income statements, and we'll provide a summary of your earnings.`
      );
      return await bot.sendMessage(
        ctx.from.id,
        `\n Plus, by sharing, you'll unlock constant access to all PawLee features. Work smarter, not harder. Are you ready?`,
        IncomeTracker
      );
    },
  },

  {
    action: "handleIncomeTrackerGoal",
    description: "Send announcements",
    func: async (ctx, param) => {
      return await bot.sendMessage(ctx.from.id, `\n income goal is ${param}`);
    },
  },
  {
    action: "handleAnnouncements",
    description: "Send announcements",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n You can make extra money 💵 to work during surge hours 🏃‍♂️, Please chose the surge time for extra fee 💰... `,
        SurgeFee
      );
    },
  },
  {
    action: "handleMainMenu",
    description: "Go to main menu",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n Please chose one of the following to continue... `,
        MainMenu
      );
    },
  },

  {
    action: "handleProfile",
    description: "Edit profile",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Please chose the profile detail to edit..\n`,
        EditProfile
      );
    },
  },
  {
    action: "handleUpdateProfile",
    description: "Update the  profile",
    func: async (ctx, param) => {
      const keyValue = param.split("\n");
      console.log(`handleUpdateProfile ${keyValue}`);
      await updateUser({
        telegramId: ctx.from.id,
        [keyValue[0]]: keyValue[1],
      });

      return await bot.sendMessage(
        ctx.from.id,
        `${keyValue[0]} is now updated to ${keyValue[1]}`,
        MainMenu
      );
    },
  },
  {
    action: "handleEditProfile",
    func: async (ctx, param) => {
      const questions = await getQuestionsFromSheet(
        process.env.GOOGLE_SHEET_SURVEY_DATA_ID,
        ctx.from.language_code
      );

      let EditProfileDetails = {
        reply_markup: {
          resize_keyboard: false,
          inline_keyboard: [
            [
              {
                text: "📋 Back to Main Menu ⬅️",
                callback_data: "handleMainMenu:Company",
              },
            ],
          ],
        },
      };
      const answerButtons = questions[param].answers.map((answerGroup) =>
        answerGroup.map((answer) => ({
          text: answer.text,
          callback_data: `handleUpdateProfile:${questions[param].key}\n${answer.text}`,
        }))
      );

      EditProfileDetails.reply_markup.inline_keyboard.unshift(...answerButtons);

      return await bot.sendMessage(
        ctx.from.id,
        `Please chose from following options to continue ...\n`,
        EditProfileDetails
      );
    },
  },
  {
    action: "handleExtraEarnings",
    description: "Extra Earnings",
    func: async (ctx, param) => {
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
    },
  },
  {
    action: "handleIncentives",
    description: "Handle Incentives",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Which week of quest incentive you want to see?\n`,
        QuestIncentive
      );
    },
  },
  {
    action: "LikeDislikeMainMenu",
    description: "Handle Incentives",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Chose the action below\n`,
        MainMenu
      );
    },
  },
  {
    action: "handleQuestIncentive",
    description: "Handle Quest Incentives",
    func: async (ctx, param) => {
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const message = await getQuestData(
        ctx.user.zone,
        ctx.user.vehicle,
        param
      );
      //in the below function, check the param and pull the data for that duration
      //quest incentives and show below
      return await bot.sendMessage(telegramId, message, LikeDislikeMainMenu);
    },
  },
  {
    action: "handleSurgeFee",
    description: "Handle Incentives",

    func: async (ctx, param) => {
      // console.log(ctx, param);
      const announcement = await getSurgeData(ctx.user.zone, param.trim());
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;

      return await bot.sendMessage(
        telegramId,
        announcement,
        LikeDislikeMainMenu
      );
    },
  },
  {
    action: "handleHelp",
    func: async (ctx, param) => {
      let form = new FormData();

      // Send the photo to the user
      try {
        const imageUrl =
          "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee-2-tutorial.png?alt=media&token=64da5765-8fa9-4dca-bee2-d5fb0f37d77d";
        const imageResponse = await axios.get(imageUrl, {
          responseType: "stream",
        });
        const readStream = imageResponse.data;

        form.append("photo", readStream);
        const re = await axios
          .post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN_GNSGPTBOT}/sendPhoto?chat_id=${ctx.from.id}`,
            form,
            {
              headers: form.getHeaders(),
            }
          )
          .then((response) => {
            console.log("sent photo already ", response.data);
          })
          .catch((error) => {
            console.log("error in sending file", error);
          });
      } catch (e) {
        console.log(e);
      }
    },
  },
  {
    action: "handleReceipt",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `This is receipt send funciton ${param}\n`
      );
    },
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

// export async function answerResponse(ctx, param) {
//   console.log("answerResponse ------", param);
//   await updateUser({
//     telegramId: ctx.from.id,
//     lastCommand: "none",
//   });

//   return await bot.sendMessage(
//     ctx.from.id,
//     `It was pleasure talking to you ${ctx?.from?.first_name}, let's talk again soon.`,
//     MainMenu
//   );
//   // return replyWithId(ctx.from.id, ``);
// }

export async function handleBackToMainMenu(ctx, param) {
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n\n ${msg} \n\n Please chose one of the following to continue... \n\nThanks`,
    MainMenu
  );
}

export async function onAction(ctx) {
  const actionData = ctx.data.split(":");
  // console.log("--------------------------------");
  // console.log("in onAction", actionData, ctx);
  // console.log("--------------------------------");
  for (const action of actions) {
    // console.log("Find the action and call it", actionData[0], action.action);
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
