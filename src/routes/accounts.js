const express = require('express')
const router = express.Router()
const Account = require('../models/account')

// GET ALL
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId

    if (userId) {
      // FILTER BY USER ID
      const accounts = await Account.find({ user: userId })
      res.json(accounts)
    } else {
      // GET ALL
      const allAccounts = await Account.find()
      res.json(allAccounts)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ONE
router.get('/:id', getAccount, (req, res) => {
  res.json(res.account)
})

// CREATE
router.post('/', async (req, res) => {
  const { user, category, name, balance } = req.body

  try {
    const account = new Account({
      user,
      category,
      name,
      balance,
    })

    const newAccount = await account.save()
    res.status(201).json(newAccount)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// EDIT
router.patch('/:id', getAccount, async (req, res) => {
  const { user, category, name, balance } = req.body

  try {
    if (user) res.account.user = user
    if (category) res.account.category = category
    if (name) res.account.name = name
    if (balance) res.account.balance = balance

    const updatedAccount = await res.account.save()
    res.json(updatedAccount)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE
router.delete('/:id', getAccount, async (req, res) => {
  try {
    await res.account.deleteOne()
    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// MIDDLEWARE
async function getAccount(req, res, next) {
  let account

  try {
    account = await Account.findById(req.params.id)
    if (!account) {
      return res.status(404).json({ message: 'Account could not be found.' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  res.account = account
  next()
}

module.exports = router
