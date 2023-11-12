const express = require('express')
const router = express.Router()
const TrackedCategory = require('../models/trackedCategory')

// GET ALL
router.get('/', async (req, res) => {
  try {
    const budgetId = req.query.budgetId
    if (budgetId) {
      // FILTER BY BUDGET ID
      const categories = await TrackedCategory.find({ budgetId: budgetId })
      res.json(categories)
    } else {
      // GET ALL
      const allCategories = await TrackedCategory.find()
      res.json(allCategories)
    }

    const trackedCategories = await TrackedCategory.find()
    res.json(trackedCategories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ONE
router.get('/:id', getTrackedCategory, (req, res) => {
  res.json(res.trackedCategory)
})

// CREATE
router.post('/', async (req, res) => {
  const { budgetId, categoryId, isLimit, targetBalance, currentBalance } =
    req.body

  try {
    const trackedCategory = new TrackedCategory({
      budgetId,
      categoryId,
      isLimit,
      targetBalance,
      currentBalance,
    })

    const newTrackedCategory = await trackedCategory.save()
    res.status(201).json(newTrackedCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// EDIT
router.patch('/:id', getTrackedCategory, async (req, res) => {
  const { budgetId, categoryId, isLimit, targetBalance, currentBalance } =
    req.body

  try {
    if (budgetId) res.trackedCategory.budgetId = budgetId
    if (categoryId) res.trackedCategory.categoryId = categoryId
    if (isLimit) res.trackedCategory.isLimit = isLimit
    if (targetBalance) res.trackedCategory.targetBalance = targetBalance
    if (currentBalance) res.trackedCategory.currentBalance = currentBalance

    const updatedTrackedCategory = await res.trackedCategory.save()
    res.json(updatedTrackedCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE
router.delete('/:id', getTrackedCategory, async (req, res) => {
  try {
    await res.trackedCategory.deleteOne()
    res.json({ message: 'TrackedCategory deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// MIDDLEWARE
async function getTrackedCategory(req, res, next) {
  let trackedCategory

  try {
    trackedCategory = await TrackedCategory.findById(req.params.id)
    if (!trackedCategory) {
      return res
        .status(404)
        .json({ message: 'TrackedCategory could not be found.' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  res.trackedCategory = trackedCategory
  next()
}

module.exports = router
