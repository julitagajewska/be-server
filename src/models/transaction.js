const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: [
      {
        validator: async function (user) {
          const account = await mongoose
            .model('Account')
            .findById(this.accountId)
          const category = await mongoose
            .model('Category')
            .findById(this.categoryId)
          return (
            category &&
            account &&
            account.user.equals(user) &&
            category.user.equals(user)
          )
        },
        message:
          'Account and Category must belong to the same user as the provided user',
      },
    ],
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    validate: [
      {
        validator: async function (accountId) {
          const account = await mongoose.model('Account').findById(accountId)
          const category = await mongoose
            .model('Category')
            .findById(this.categoryId)
          return (
            category &&
            account &&
            account.user.equals(this.user) &&
            category.user.equals(this.user)
          )
        },
        message:
          'Account and Category must belong to the same user as the provided user',
      },
    ],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: [
      {
        validator: async function (categoryId) {
          const account = await mongoose
            .model('Account')
            .findById(this.accountId)
          const category = await mongoose.model('Category').findById(categoryId)
          return (
            category &&
            account &&
            account.user.equals(this.user) &&
            category.user.equals(this.user)
          )
        },
        message:
          'Account and Category must belong to the same user as the provided user',
      },
    ],
  },
  status: {
    type: String,
    enum: ['PENDING', 'FINISHED'],
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  isExpense: {
    type: Boolean,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
