const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (userId) {
            // FILTER BY USER ID
            const categories = await Category.find({ user: userId });
            res.json(categories);
        } else {
            // GET ALL
            const allCategories = await Category.find();
            res.json(allCategories);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ONE
router.get('/:id', getCategory, (req, res) => {
    res.json(res.category);
});

// CREATE
router.post('/', async (req, res) => {
    const { user, categoryType, name } = req.body;

    try {
        // Check if a category with the same name and user ID already exists
        const existingCategory = await Category.findOne({ user, name });

        if (existingCategory) {
            return res.status(400).json({ message: "Category with the same name already exists for this user." });
        }

        const category = new Category({
            user,
            categoryType,
            name,
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// EDIT
router.patch('/:id', getCategory, async (req, res) => {
    const { user, categoryType, name } = req.body;

    try {
        if (user) res.category.user = user;
        if (categoryType) res.category.categoryType = categoryType;
        if (name) res.category.name = name;

        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MIDDLEWARE
async function getCategory(req, res, next) {
    let category;

    try {
        category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category could not be found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    res.category = category;
    next();
}

module.exports = router;
