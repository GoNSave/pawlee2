import { getAnswer } from "../utils/openai";
import { reply } from "../utils/telegram";
import { handleStartSurvey } from "./survey";
import { defaultResponse } from "../utils/constants";
import { bot } from "../utils/telegram";
const path = require("path");

export async function onCommand(ctx, command, param) {
  const execCommand = commands.find((c) => c.command === command);
  if (execCommand && execCommand.func) {
    return execCommand.func(ctx, param);
  }
  return defaultResponse(ctx, `Sorry, ${command} is not a valid command.`);
}

export const commands = [
  {
    command: "/start",
    description: "Start saving now 📖",
    func: async (ctx, param) => {
      return await handleStartSurvey(ctx);
    },
  },
  {
    command: "/tell",
    description: "Get a bedtime story 📖",
    func: async (ctx, param) => {
      if (!param || param.length < 3) {
        const gpt = await getAnswer(
          "tell me something interesting about that happened on this date in history starting with Did you know..."
        );
        return reply(
          ctx,
          `Please ask a param with at least 3 characters.  \n\n BTW  ${gpt}`
        );
      } else {
        const answer = await getAnswer("tell me " + param);
        return reply(ctx, answer);
      }
    },
  },
  {
    command: "/poem",
    description: "Receive a beautiful poem 📜",
    func: async (ctx, param) => {
      const poem =
        "Roses are red, violets are blue, here's a beautiful poem just for you!" +
        param;
      reply(ctx, poem);
    },
  },
  {
    command: "/joke",
    description: "Laugh out loud with a joke 😂",
    func: async (ctx, param) => {
      const joke =
        "Why don't scientists trust atoms? Because they make up everything!";
      reply(ctx, joke);
    },
  },
  {
    command: "/fact",
    description: "Learn something new with a fact 🧐",
    func: async (ctx, param) => {
      const fact = "A group of flamingos is called a flamboyance.";
      return reply(ctx, fact);
    },
  },
  {
    command: "/quote",
    description: "Get inspired with a quote 💭",
    func: async (ctx, param) => {
      const quote =
        "The best way to predict your future is to create it. - Abraham Lincoln";
      return reply(ctx, quote);
    },
  },
  {
    command: "/news",
    description: "Stay up-to-date with the latest news 📰",
    func: async (ctx, param) => {
      const news = "Here are the latest headlines: ...";
      return reply(ctx, news);
    },
  },
  {
    command: "/weather",
    description: "Get the current weather forecast 🌤️",
    func: async (ctx, param) => {
      const weather =
        "The weather today is sunny with a high of 25 degrees Celsius.";
      return reply(ctx, weather);
    },
  },
  {
    command: "/horoscope",
    description: "Discover what the stars have in store for you 🔮",
    func: async (ctx, param) => {
      const horoscope = "Here's your horoscope for today: ...";
      return reply(ctx, horoscope);
    },
  },
  {
    command: "/tutorial",
    description: "Learn to do less and save more 🔮",
    func: async (ctx, param) => {
      const imagePath = path.resolve(__dirname, "assets", "tutorial.png");

      console.log(imagePath);
      // Send the photo to the user
      try {
        const r = await bot.sendPhoto({
          chat_id: ctx.chat.id,
          // photo: "tutorial.png",
          photo: `https://images.unsplash.com/photo-1586282023338-52aa50a846ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80`,
          caption: `This is my test image`,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
];
