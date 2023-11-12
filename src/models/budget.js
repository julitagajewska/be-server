const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    validate: [
      {
        validator: async function (accountId) {
          const account = await mongoose.model('Account').findById(accountId)
          return account && account.user.equals(this.user)
        },
        message: 'Account must belong to the same user as provided user',
      },
    ],
  },
  isAggregate: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: [
      {
        validator: function (endDate) {
          return endDate >= this.startDate
        },
        message: 'End date must not be before the start date',
      },
    ],
  },
})

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget
