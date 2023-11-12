const express = require('express')
const router = express.Router()
const Budget = require('../models/budget')

// GET ALL
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId
    if (userId) {
      // FILTER BY USER ID
      const budgets = await Budget.find({ user: userId })
      res.json(budgets)
    } else {
      // GET ALL
      const allBudgets = await Budget.find()
      res.json(allBudgets)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ONE
router.get('/:id', getBudget, (req, res) => {
  res.json(res.budget)
})

// CREATE
router.post('/', async (req, res) => {
  const {
    user,
    accountId,
    isAggregate,
    name,
    description,
    startDate,
    endDate,
  } = req.body

  try {
    const budget = new Budget({
      user,
      accountId,
      isAggregate,
      name,
      description,
      startDate,
      endDate,
    })

    const newBudget = await budget.save()
    res.status(201).json(newBudget)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// EDIT
router.patch('/:id', getBudget, async (req, res) => {
  const {
    user,
    accountId,
    isAggregate,
    name,
    description,
    startDate,
    endDate,
  } = req.body

  try {
    if (user) res.budget.user = user
    if (accountId) res.budget.accountId = accountId
    if (isAggregate) res.budget.isAggregate = isAggregate
    if (name) res.budget.name = name
    if (description) res.budget.description = description
    if (startDate) res.budget.startDate = startDate
    if (endDate) res.budget.endDate = endDate

    const updatedBudget = await res.budget.save()
    res.json(updatedBudget)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE
router.delete('/:id', getBudget, async (req, res) => {
  try {
    await res.budget.deleteOne()
    res.json({ message: 'Budget deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// MIDDLEWARE
async function getBudget(req, res, next) {
  let budget

  try {
    budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ message: 'Budget could not be found.' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  res.budget = budget
  next()
}

module.exports = router
