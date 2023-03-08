const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_GNS,
});

export const getAnswer = async (question) => {
  const openai = new OpenAIApi(configuration);
  const prompt = `Answer the question in simple english \n\nQuestion: ${question}\n\nAnswer:`;

  const r3 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
    temperature: 0.2,
  });

  return r3.data.choices[0].text;
};
