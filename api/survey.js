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
    answers: [
      [{ text: "👨 Man" }, { text: "👩 Woman" }, { text: "🧑 Others" }],
    ],
    key: "gender",
  },
  {
    question: "How old are you? 🎁 🎂 🎈",
    answers: [
      [{ text: "18-25 🎓" }, { text: "25-35 👨‍💼" }, { text: "35-45 🧑‍💼" }],
      [{ text: "45-55 👴" }, { text: "55-65 🧓" }, { text: "65+ 🧑‍🦳" }],
    ],
    key: "age",
  },
  {
    question: "Chose the delivery company you work for the most: 🏍️ 🚴 🚗 ",
    answers: [
      [{ text: "🛵 Grab" }, { text: "🍽️ FoodPanda" }, { text: "🍕 Deliveroo" }],
    ],
    key: "company",
  },
  {
    question: " What vehicle you ride? 🚲 🛵 🚗",
    answers: [
      [{ text: "🏍️ Motorcycle" }, { text: "🚴 Cycle" }],
      [{ text: "🚗 Car" }, { text: "🚲 E-bike" }, { text: "🚶 Walk" }],
    ],
    key: "vehicle",
  },
  {
    question: "What's your preferred zone in SG to work in? 📍 ",
    answers: [
      [{ text: "👉 SG North" }, { text: "👈 SG South" }],
      [{ text: "👆 SG East" }, { text: "👇 SG West" }],
    ],
    key: "zone",
  },
  {
    question:
      " How did you buy your mobility device? (Choose ‘Not applicable’ if you don’t use a vehicle) 🛴 🚲 🚗",
    answers: [
      [{ text: "🏦 Bank Loan" }, { text: "💰 Savings" }],
      [{ text: "🤝 Borrowed from friends" }],
      [{ text: "🚫 Not applicable" }],
    ],
    kye: "purchase",
  },
];

const showMainMenu = async (ctx, text) => {
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

  // const ret = await bot.sendMessage(
  //   ctx.chat.id,
  //   `Hi ${ctx.from.first_name}! \n How Can I help you? `,
  //   keyboard
  // );
};

const handleQuestion = async (ctx, question, msg = "") => {
  console.log("handleQuestion------", question);

  let { question: text, answers } = question;
  text = msg ? msg + "\n" + text : text;
  //   reply_to_message_id: ctx.message_id,
  return await bot.sendMessage(ctx.chat.id, text, {
    reply_markup: {
      force_reply: true,
      resize_keyboard: false,
      one_time_keyboard: true,
      keyboard: answers,
    },
  });
};

export async function surveyResponse(ctx) {
  const qIndex = ctx.user.questionIndex ? ctx.user.questionIndex : 0;
  console.log("surveyResponse------", qIndex);

  if (qIndex === 0) {
    await updateUser({ telegramId: ctx.from.id, questionIndex: qIndex + 1 });
    return handleQuestion(ctx, questions[qIndex + 1]);
  }

  if (qIndex >= questions.length) {
    if (!ctx.user.welcomed) {
      console.log("user not welcomed yet");
      try {
        await updateUser({
          telegramId: ctx.message.from.id,
          welcomed: true,
        });
      } catch (err) {
        console.log("Update user error", err);
      }
      await reply(
        "🎉👏 Hooray! Your answers have been received and will help us personalize your experience. Thanks for taking the time! 🙌🤝"
      );
      return showMainMenu(ctx);
    }
  }

  for (const answer of questions[qIndex].answers.flat()) {
    if (answer.text.includes(ctx.text)) {
      try {
        await updateUser({
          telegramId: ctx.from.id,
          questionIndex: qIndex + 1,
          [questions[qIndex].key]: ctx.text,
        });
      } catch (err) {
        console.log("Update user error", err);
      }
      if (qIndex + 1 < questions.length) {
        return handleQuestion(ctx, questions[qIndex + 1]);
      } else {
        await reply(
          "🎉👏 Hooray! Your answers have been received and will help us personalize your experience. Thanks for taking the time! 🙌🤝"
        );
        return showMainMenu(ctx);
      }
    }
  }

  // if (!answerFound && !ctx.user.welcomed) {
  //   return handleQuestion(
  //     ctx,
  //     questions[qIndex],
  //     `Please choose one of the options below`
  //   );
  // }
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
