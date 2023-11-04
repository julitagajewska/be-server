const express = require('express');
const router = express.Router();
const Goal = require('../models/goal');

// GET ALL
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
        if (userId) {
            // FILTER BY USER ID
            const goals = await Goal.find({ user: userId });
            res.json(goals);
        } else {
            // GET ALL
            const allGoals = await Goal.find();
            res.json(allGoals);
        }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
router.get('/:id', getGoal, (req, res) => {
  res.json(res.goal);
});

// CREATE
router.post('/', async (req, res) => {
  const { user, category, name, dueDate, targetBalance, currentBalance, description } = req.body;

  try {
    const goal = new Goal({
      user,
      category,
      name,
      dueDate,
      targetBalance,
      currentBalance,
      description,
    });

    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// EDIT
router.patch('/:id', getGoal, async (req, res) => {
  const { user, category, name, dueDate, targetBalance, currentBalance, description } = req.body;

  try {
    if (user) res.goal.user = user;
    if (category) res.goal.category = category;
    if (name) res.goal.name = name;
    if (dueDate) res.goal.dueDate = dueDate;
    if (targetBalance) res.goal.targetBalance = targetBalance;
    if (currentBalance) res.goal.currentBalance = currentBalance;
    if (description) res.goal.description = description;

    const updatedGoal = await res.goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', getGoal, async (req, res) => {
  try {
    await res.goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MIDDLEWARE
async function getGoal(req, res, next) {
  let goal;

  try {
    goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal could not be found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.goal = goal;
  next();
}

module.exports = router;
