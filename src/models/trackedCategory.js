const mongoose = require('mongoose');

const trackedCategorySchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: [
      {
        validator: async function (categoryId) {
          const budget = await mongoose.model('Budget').findById(this.budgetId);
          const category = await mongoose.model('Category').findById(categoryId);
            console.log(this.categoryId)
            console.log(budget)
            console.log(category)
          return budget && category && budget.user.equals(category.user);
        },
        message: 'Budget and Category must belong to the same user',
      },
      {
        validator: async function (categoryId) {
          const category = await mongoose.model('Category').findById(categoryId);
          return category.categoryType === 'TRANSACTION';
        },
        message: 'Category must have categoryType "TRANSACTION"',
      },
    ],
  },
  isLimit: {
    type: Boolean,
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
});

const TrackedCategory = mongoose.model('TrackedCategory', trackedCategorySchema);

module.exports = TrackedCategory;
