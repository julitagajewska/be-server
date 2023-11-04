const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (userId) {
            // FILTER BY USER ID
            const transactions = await Transaction.find({ user: userId });
            res.json(transactions);
        } else {
            // GET ALL
            const allTransactions = await Transaction.find();
            res.json(allTransactions);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ONE
router.get('/:id', getTransaction, (req, res) => {
    res.json(res.transaction);
});

// CREATE
router.post('/', async (req, res) => {
    const { user, accountId, categoryId, status, recipient, title, value, isExpense, isRecurring, date, description } = req.body;

    try {
        const transaction = new Transaction({
            user,
            accountId,
            categoryId,
            status,
            recipient,
            title,
            value,
            isExpense,
            isRecurring,
            date,
            description,
        });

        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// EDIT
router.patch('/:id', getTransaction, async (req, res) => {
    const { user, accountId, categoryId, status, recipient, title, value, isExpense, isRecurring, date, description } = req.body;

    try {
        if (user) res.transaction.user = user;
        if (accountId) res.transaction.accountId = accountId;
        if (categoryId) res.transaction.categoryId = categoryId;
        if (status) res.transaction.status = status;
        if (recipient) res.transaction.recipient = recipient;
        if (title) res.transaction.title = title;
        if (value) res.transaction.value = value;
        if (isExpense) res.transaction.isExpense = isExpense;
        if (isRecurring) res.transaction.isRecurring = isRecurring;
        if (date) res.transaction.date = date;
        if (description) res.transaction.description = description;

        const updatedTransaction = await res.transaction.save();
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
router.delete('/:id', getTransaction, async (req, res) => {
    try {
        await res.transaction.deleteOne();
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MIDDLEWARE
async function getTransaction(req, res, next) {
    let transaction;

    try {
        transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction could not be found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    res.transaction = transaction;
    next();
}

module.exports = router;
