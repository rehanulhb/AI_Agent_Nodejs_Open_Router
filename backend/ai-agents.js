const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "stepfun/step-3.5-flash",
    messages: [{ role: "user", content: "What is Agentic AI" }],
  });

  console.log(completion.choices[0].message.content);
}
main();
