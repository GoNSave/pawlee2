export const parse = (message) => {
  const chatId = message.chat.id;
  let question = message.text;
  const name = message.from.first_name;
  let answer =
    "Hi <b>" +
    name +
    "</b>.%0A You can ask me anything, <b> /help</b> to find out what I can do. %0A /tell me to hear a joke";

  console.log("------------------------------------");
  console.log("in parse chatId", chatId, "question", question, "name", name);
  console.log("------------------------------------");

  let command = "";

  if (question.charAt(0) === "/") {
    const parts = question.split(" ");
    command = parts[0];
    question = parts.slice(1).join(" ").trim();
  }

  return { chatId, question, answer, name, command };
};
