const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Account = require('../models/account')
const Goal = require('../models/goal')

// GET ALL
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId

    if (userId) {
      // FILTER BY USER ID
      const categories = await Category.find({ user: userId })
      res.json(categories)
    } else {
      // GET ALL
      const allCategories = await Category.find()
      res.json(allCategories)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ONE
router.get('/:id', getCategory, (req, res) => {
  res.json(res.category)
})

// CREATE
router.post('/', async (req, res) => {
  const { user, categoryType, name } = req.body

  console.log(user, categoryType, name)

  try {
    // Check if a category with the same name, user ID, and category type already exists
    const existingCategory = await Category.findOne({
      user,
      name,
      categoryType,
    })

    if (existingCategory) {
      return res.status(400).json({
        message:
          'Category with the same name already exists for this user and category type.',
      })
    }

    const category = new Category({
      user,
      name,
      categoryType,
    })

    const newCategory = await category.save()
    res.status(201).json(newCategory)
  } catch (error) {
    if (error.message.includes('duplicate key error')) {
      return res.status(400).json({
        message: error.message,
      })
    }
    res.status(400).json({ message: error.message })
  }
})

// EDIT
router.put('/:id', getCategory, async (req, res) => {
  const { user, categoryType, name } = req.body

  try {
    if (user) res.category.user = user
    if (categoryType) res.category.categoryType = categoryType
    if (name) res.category.name = name

    const updatedCategory = await res.category.save()
    res.json(updatedCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE
router.delete('/:id', getCategory, async (req, res) => {
  const categoryId = req.params.id

  try {
    // Delete the category itself
    await res.category.deleteOne()

    // Delete associated entities based on category type
    switch (res.category.categoryType) {
      case 'ACCOUNT':
        // Delete all accounts with categoryId equal to the deleted category id
        await Account.deleteMany({ category: categoryId })
        break
      case 'TRANSACTION':
        // Delete all transactions with categoryId equal to the deleted category id
        await Transaction.deleteMany({ categoryId: categoryId })
        break
      case 'GOAL':
        // Delete all goals with categoryId equal to the deleted category id
        await Goal.deleteMany({ category: categoryId })
        break
      default:
        break
    }

    res.json({
      message: 'Category and associated entities deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// MIDDLEWARE
async function getCategory(req, res, next) {
  let category

  try {
    category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category could not be found.' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  res.category = category
  next()
}

module.exports = router
