import { getAnswer } from "../utils/openai";
import { reply } from "../utils/telegram";
import { handleStartSurvey } from "./survey";

export const commands = [
  { command: "/start", description: "Start saving now 📖", func: onStart },
  { command: "/tell", description: "Get a bedtime story 📖", func: onTell },
  {
    command: "/poem",
    description: "Receive a beautiful poem 📜",
    func: onPoem,
  },
  {
    command: "/joke",
    description: "Laugh out loud with a joke 😂",
    func: onJoke,
  },
  {
    command: "/fact",
    description: "Learn something new with a fact 🧐",
    func: onFact,
  },
  {
    command: "/quote",
    description: "Get inspired with a quote 💭",
    func: onQuote,
  },
  {
    command: "/news",
    description: "Stay up-to-date with the latest news 📰",
    func: onNews,
  },
  {
    command: "/weather",
    description: "Get the current weather forecast 🌤️",
    func: onWeather,
  },
  {
    command: "/horoscope",
    description: "Discover what the stars have in store for you 🔮",
    func: onHoroscope,
  },
];

// Functions to be called for each action
export async function onTell(ctx, param) {
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
}

export function onPoem(ctx, param) {
  // logic to fetch a poem
  const poem =
    "Roses are red, violets are blue, here's a beautiful poem just for you!" +
    param;
  // reply with the poem
  reply(ctx, poem);
}

export function onJoke(ctx, param) {
  // logic to fetch a joke
  const joke =
    "Why don't scientists trust atoms? Because they make up everything!";
  // reply with the joke
  reply(ctx, joke);
}

export function onFact(ctx, param) {
  // logic to fetch a fact
  const fact = "A group of flamingos is called a flamboyance.";
  // reply with the fact
  return reply(ctx, fact);
}

export function onQuote(ctx, param) {
  // logic to fetch a quote
  const quote =
    "The best way to predict your future is to create it. - Abraham Lincoln";
  // reply with the quote
  return reply(ctx, quote);
}

export function onNews(ctx, param) {
  // logic to fetch the latest news
  const news = "Here are the latest headlines: ...";
  // reply with the news
  return reply(ctx, news);
}

export function onWeather(ctx, param) {
  // logic to fetch the current weather forecast
  const weather =
    "The weather today is sunny with a high of 25 degrees Celsius.";
  // reply with the weather forecast
  return reply(ctx, weather);
}

export function onHoroscope(ctx, param) {
  // logic to fetch the user's horoscope based on their date of birth or zodiac sign
  const horoscope = "Here's your horoscope for today: ...";
  // reply with the horoscope
  return reply(ctx, horoscope);
}

export async function onStart(ctx, param) {
  console.log("onStart");
  return await handleStartSurvey(ctx);
}

export async function onCommand(ctx, command, param) {
  const execCommand = commands.find((c) => c.command === command);
  if (execCommand && execCommand.func) {
    return execCommand.func(ctx, param);
  }
  return reply(ctx, "Sorry, I don't understand that command.");
}
