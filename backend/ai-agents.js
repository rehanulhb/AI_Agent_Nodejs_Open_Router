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

const analyzeGoal = async (goalText, durationDays) => {
  const prompt = `User wants to ${goalText} within ${durationDays} days. 
    create a structured learning/execution plan with:
    1. main milestones for each week.
    2. success matrices
    3. potential challenges
    4. motivational approch

    Return as JSON with this structure:
    {
      "milestones": ["milestone1", "milestone2", "milestone3"],
      "dailyTasks": [{"day": 1, "title": "....", "description": "..."}],
      "successMetrics": ["metric 1", "metric 2", "metric 3"],
      "challenges": ["challenge 1"],
      "motivationalApproach": "...."
    } 
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "stepfun/step-3.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert personal productivity coach and learning specialist. Create actionable, structured plans.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch);
  } catch (err) {
    console.error(err);
  }
};

analyzeGoal();
