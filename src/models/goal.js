const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: [
      {
        validator: async function (categoryId) {
          const category = await mongoose.model('Category').findById(categoryId)
          return category && category.categoryType === 'GOAL'
        },
        message: 'Category must have categoryType "GOAL"',
      },
      {
        validator: async function (categoryId) {
          const category = await mongoose.model('Category').findById(categoryId)
          return category && category.user.equals(this.user)
        },
        message: 'Category must belong to the same user as provided user ID',
      },
    ],
  },
  name: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  targetBalance: {
    type: Number,
    required: true,
  },
  currentBalance: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
