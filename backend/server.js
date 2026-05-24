// you should must run `npm install cors dotenv express`
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeGoal, evaluateProgress } = require("./ai-agents");
const storage = require("./storage");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.post("/api/goals", async (req, res) => {
  try {
    const { goalText, durationDays } = req.body;

    if (!goalText || !durationDays) {
      return res.status(400).json({ error: "Goal and duration are required!" });
    }

    const plan = await analyzeGoal(goalText, durationDays);

    const goal = storage.saveGoal({
      title: goalText,
      durationDays,
      plan,
      status: "active",
    });

    // save tasks
    const tasks = storage.saveTasks(goal.id, plan.dailyTasks);

    // initaial progress tracking
    storage.saveProgress(goal.id, {
      goalId: goal.id,
      completedTasks: 0,
      totalTasks: tasks.length,
      progressParcentage: 0,
    });

    res.json(plan);
  } catch (err) {
    console.error(err);
  }
});
