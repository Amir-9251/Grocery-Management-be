const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const authMiddleware = require('../../Middleware/authMiddleware');



router.get('/categories', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }

})



router.get('/category/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        return category ?
            res.status(200).json(category) :
            res.status(404).json({ message: 'Category not found' });

    } catch (error) {
        console.log('Error fetching category:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
})

router.post('/category', authMiddleware, async (req, res) => {
    console.log('Creating category:', req.body);
    const { name, status } = req.body;
    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, status });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
})

router.delete('/category/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
})


router.put('/category/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;

    console.log('Updating category:', { id, name, status });

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, status }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
})


module.exports = router;