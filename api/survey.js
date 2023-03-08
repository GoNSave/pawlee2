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
    options: [
      [
        {
          text: "Man",
          callback_data: "1 gender:Man",
        },
        {
          text: "Woman",
          callback_data: "1 gender:Woman",
        },
        {
          text: "Others",
          callback_data: "1 gender:Others",
        },
      ],
    ],
  },
  {
    question: "How old are you? 🎁 🎂 🎈",
    options: [
      [
        { text: "18-25 🎓", callback_data: "2 age:18-25" },
        { text: "25-35 👨‍💼", callback_data: "2 age:25-35" },
        { text: "35-45 🧑‍💼", callback_data: "2 age:35-45" },
      ],
      [
        { text: "45-55 👴", callback_data: "2 age:45-55" },
        { text: "55-65 🧓", callback_data: "2 age:55-65" },
        { text: "65+ 🧑‍🦳", callback_data: "2 age:65+" },
      ],
    ],
  },
  {
    question: "Chose the delivery company you work for the most: 🏍️ 🚴 🚗 ",
    options: [
      [
        { text: "🛵 Grab", callback_data: "3 company:Grab" },
        { text: "🍽️ FoodPanda", callback_data: "3 company:FoodPanda" },
        { text: "🍕 Deliveroo", callback_data: "3 company:Deliveroo" },
      ],
    ],
  },
  {
    question: " What vehicle you ride? 🚲 🛵 🚗",
    options: [
      [
        { text: "🏍️ Motorcycle", callback_data: "4 vehicle:Motorcycle" },
        { text: "🚴 Cycle", callback_data: "4 vehicle:Cycle" },
      ],
      [
        { text: "🚗 Car", callback_data: "4 vehicle:Car" },
        { text: "🚲 E-bike", callback_data: "4 vehicle:E-bike" },
        { text: "🚶 Walk", callback_data: "4 vehicle:Walk" },
      ],
    ],
  },
  {
    question: "What's your preferred zone in SG to work in? 📍 ",
    options: [
      [
        { text: "👉 SG North", callback_data: "5 zone:SG North" },
        { text: "👈 SG South", callback_data: "5 zone:SG South" },
      ],
      [
        { text: "👆 SG East", callback_data: "5 zone:SG East" },
        { text: "👇 SG West", callback_data: "5 zone:SG West" },
      ],
    ],
  },
  {
    question:
      " How did you buy your mobility device? (Choose ‘Not applicable’ if you don’t use a vehicle) 🛴 🚲 🚗",
    options: [
      [
        { text: "🏦 Bank Loan", callback_data: "6 buy:Bank Loan" },
        { text: "💰 Savings", callback_data: "6 buy:Savings" },
      ],
      [
        {
          text: "🤝 Borrowed from friends",
          callback_data: "6 buy:Borrowed from friends",
        },
      ],
      [{ text: "🚫 Not applicable", callback_data: "6 buy:Not applicable" }],
    ],
  },
];

export async function handleStartSurvey(ctx) {
  console.log("start the survey ", ctx.from.id);
  const user = await getUser({
    telegramId: ctx.from.id,
  });
  if (!user) {
    const id = await addUser({
      telegramId: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      language_code: ctx.from.language_code,
      questionIndex: 0,
    });
  }
  const keyboard = {
    //   reply_to_message_id: ctx.message_id,
    reply_markup: {
      force_reply: true,
      resize_keyboard: false,
      one_time_keyboard: true,
      keyboard: [[{ text: "🏁 " }, { text: "Let's Got " }, { text: "🏁 " }]],
    },
  };

  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n Ready to answer a few quick questions and earn $6 SGD of extra money?`,
    keyboard
  );
}
