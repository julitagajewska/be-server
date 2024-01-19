require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email }).lean()

  if (!user)
    return res.status(400).json({ message: 'Invalid username or password' })

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        surname: user.surname,
      },
      process.env.SECRET,
    )

    return res.status(201).json({ token: token })
  }

  return res.status(400).json({ message: 'Invalid username or password' })
})

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password: plainTextPassword } = req.body

  if (!plainTextPassword || typeof plainTextPassword !== 'string')
    return res.status(400).json({ message: 'Invalid password' })

  if (plainTextPassword.length < 6)
    return res.status(400).json({ message: 'Password too short' })

  const password = await bcrypt.hash(plainTextPassword, 10)

  const user = new User({
    username: username,
    email: email,
    password: password,
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
})

// CHANGE PASSWORD
router.post('/change-password', async (req, res) => {
  try {
    const { token } = req.body
    jwt.verify(token, process.env.SECRET)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
