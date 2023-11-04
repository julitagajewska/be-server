const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
     validate: [{
      validator: async function (categoryId) {
        const category = await mongoose.model('Category').findById(categoryId);
        return category && category.categoryType === 'ACCOUNT';
      },
      message: 'Category must have categoryType "ACCOUNT"',
    },
    {
      validator: async function (categoryId) {
        const category = await mongoose.model('Category').findById(categoryId);
        return category && category.user.equals(this.user);
      },
      message: 'Category must belong to the same user',
    },
    ],
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
