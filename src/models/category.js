const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryType: {
    type: String,
    enum: ['TRANSACTION', 'ACCOUNT', 'GOAL'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

// Create a compound unique index for user, categoryType, and name
categorySchema.index({ user: 1, categoryType: 1, name: 1 }, { unique: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
