import { reply, bot } from "../utils/telegram";
import {
  addUser,
  saveMessage,
  getQuestions,
  updateUser,
  getAnswers,
  getUser,
} from "../utils/firebase";

export const questions = [
  {
    question: "What is your gender? 🚹 🚺",
    options: [[{ text: "Man" }, { text: "Woman" }, { text: "Others" }]],
  },
  {
    question: "How old are you? 🎁 🎂 🎈",
    options: [
      [{ text: "18-25 🎓" }, { text: "25-35 👨‍💼" }, { text: "35-45 🧑‍💼" }],
      [{ text: "45-55 👴" }, { text: "55-65 🧓" }, { text: "65+ 🧑‍🦳" }],
    ],
  },
  {
    question: "Chose the delivery company you work for the most: 🏍️ 🚴 🚗 ",
    options: [
      [{ text: "🛵 Grab" }, { text: "🍽️ FoodPanda" }, { text: "🍕 Deliveroo" }],
    ],
  },
  {
    question: " What vehicle you ride? 🚲 🛵 🚗",
    options: [
      [{ text: "🏍️ Motorcycle" }, { text: "🚴 Cycle" }],
      [{ text: "🚗 Car" }, { text: "🚲 E-bike" }, { text: "🚶 Walk" }],
    ],
  },
  {
    question: "What's your preferred zone in SG to work in? 📍 ",
    options: [
      [{ text: "👉 SG North" }, { text: "👈 SG South" }],
      [{ text: "👆 SG East" }, { text: "👇 SG West" }],
    ],
  },
  {
    question:
      " How did you buy your mobility device? (Choose ‘Not applicable’ if you don’t use a vehicle) 🛴 🚲 🚗",
    options: [
      [{ text: "🏦 Bank Loan" }, { text: "💰 Savings" }],
      [{ text: "🤝 Borrowed from friends" }],
      [{ text: "🚫 Not applicable" }],
    ],
  },
];

const showMainMenu = async (ctx, text) => {
  const { name } = ctx.from.first_name;
  let { caption, options } = menu;

  const keyboard = {
    //   reply_to_message_id: ctx.message_id,
    reply_markup: {
      force_reply: true,
      resize_keyboard: false,
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "🗣 Talk with PawLee",
            callback_data: "1 mainmenu:ans1",
          },
          {
            text: "💸 Income Tracker",
            callback_data: "1 mainmenu:ans2",
          },
        ],
        [
          {
            text: "📣 Incentives",
            callback_data: "1 mainmenu:ans4",
          },
          {
            text: "📣 Announcements",
            callback_data: "1 mainmenu:ans5",
          },
        ],
        [
          {
            text: "💰 Extra Earnings",
            callback_data: "1 mainmenu:ans3",
          },
        ],
      ],
    },
  };

  const ret = await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n How Can I help you? `,
    keyboard
  );
};

const handleQuestion = async (ctx, question, msg = "") => {
  console.log("handle question", question, msg);
  let { question: text, options } = question;
  text = msg ? msg + "\n" + text : text;

  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n Ready to answer a few quick questions and earn $6 SGD of extra money?`,
    {
      reply_markup: {
        force_reply: true,
        resize_keyboard: false,
        one_time_keyboard: true,
        keyboard: [
          [{ text: "🏁1 " }, { text: "Let's Got 2" }, { text: "🏁 3" }],
        ],
      },
    }
  );

  return await bot.sendMessage(ctx.chat.id, text, {
    reply_markup: {
      force_reply: true,
      resize_keyboard: false,
      one_time_keyboard: true,
      keyboard: [[{ text: "Man " }, { text: "Woman" }, { text: "Others" }]],
    },
  });

  const keyboard = {
    //   reply_to_message_id: ctx.message_id,
    reply_markup: {
      force_reply: true,
      resize_keyboard: false,
      one_time_keyboard: true,
      keyboard: options.map((option) =>
        option.map((o) => ({ text: o.text, callback_data: o.callback_data }))
      ),
    },
  };

  return await bot.sendMessage(ctx.chat.id, text, keyboard);
};

export async function surveyResponse(ctx) {
  // console.log("survey response", ctx);
  const qIndex = ctx.user.questionIndex ? ctx.user.questionIndex + 1 : 0;
  if (qIndex >= questions.length - 1) {
    const actionStrings = actions.map(
      (action) => `${action.command} - ${action.description}`
    );
    return showMainMenu(ctx, "You have completed the survey. Thank you!");
  }
  return handleQuestion(ctx, questions[qIndex]);
}

export async function handleStartSurvey(ctx) {
  console.log("start the survey ", ctx.from.id);
  const userData = {
    telegramId: ctx.from.id,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
    language_code: ctx.from.language_code,
    questionIndex: 0,
    state: "survey",
  };

  const user = await updateUser(userData);
  //   reply_to_message_id: ctx.message_id,
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n Ready to answer a few quick questions and earn $6 SGD of extra money?`,
    {
      reply_markup: {
        force_reply: true,
        resize_keyboard: false,
        one_time_keyboard: true,
        keyboard: [[{ text: "🏁 " }, { text: "Let's Got " }, { text: "🏁 " }]],
      },
    }
  );
}
