import { bot, reply } from "../utils/telegram";

export const userDocName = "users";
export const questionsDocName = "questions";
export const chatDocName = "chat";
export const filesDocName = "files";

export const AnswerResponse = {
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

export const MainMenu = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "🗣 Talk with PawLee",
          callback_data: "handleTalkToPawlee:Talk with PawLee",
        },
        {
          text: "\n💸 Income Tracker\n",
          callback_data: "handleIncomeTracker:Income Tracker",
        },
      ],
      [
        {
          text: "\n📣 Incentives\n",
          callback_data: "handleIncentives:Incentives",
        },
        {
          text: "\n📣 Announcements\n",
          callback_data: "handleAnnouncements:Announcements",
        },
      ],
      [
        {
          text: "\n💰 Extra Earnings\n",
          callback_data: "handleExtraEarnings:Extra Earnings",
        },
        {
          text: "\n👤 Edit Profile\n",
          callback_data: "handleProfile:Edit Profile",
        },
      ],
    ],
  },
};

export const EditProfile = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "🗣 Zone",
          callback_data: "handleEditProfile:Zone",
        },
        {
          text: "\n💸 Vehicle\n",
          callback_data: "handleEditProfile:Vehicle",
        },
      ],
      [
        {
          text: "\n💸 Company\n",
          callback_data: "handleEditProfile:Company",
        },
        {
          text: "\n📣 City\n",
          callback_data: "handleEditProfile:City",
        },
      ],
    ],
  },
};

export const defaultResponse = async (ctx, msg = "") => {
  console.log("---- defaultResponse ----", ctx, msg);
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n\n ${msg} \n\n Please chose one of the following to continue... \n\nThanks`,
    MainMenu
  );
};
