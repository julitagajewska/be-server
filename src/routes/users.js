const express = require('express')
const router = express.Router()
const User = require('../models/user')

// GET ALL
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET ONE
router.get('/:id', getUser, (req, res) => {
    res.send(res.user)
})

// CREATE
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// EDIT
router.patch('/:id', getUser, async (req, res) => {
    console.log('Request reached')
    try {
        if(req.body.username != null) res.user.username = req.body.username
        if(req.body.email != null) res.user.email = req.body.email

        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({ message: "User deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// MIDDLEWARE
async function getUser(req, res, next) {
    let user

    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: "User could not be found."})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.user = user
    next()
}

module.exports = router