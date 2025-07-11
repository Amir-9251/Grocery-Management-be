
const express = require('express');
const router = express.Router();
const Product = require('../../models/Products'); // Assuming you have a Product model
const authMiddleware = require('../../Middleware/authMiddleware'); // Assuming you have an auth middleware

router.get('/products', authMiddleware, async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    try {
        const products = await Product.find({ userId: req.user.id })
            .populate('category')
            .skip(skip)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments({ userId: req.user.id });
        const totalPages = Math.ceil(totalProducts / limitNumber);
        res.status(200).json({ products, totalPages });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

router.get('/products/search', authMiddleware, async (req, res) => {
    const { search } = req.query;
    console.log('Search query:', search);

    try {
        if (!search || search.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const products = await Product.find({
            userId: req.user.id,
            $or: [
                { productName: new RegExp(search, 'i') },
                { code: new RegExp(search, 'i') },
                { supplier: new RegExp(search, 'i') }
            ]
        }).populate('category');

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});


router.get('/product/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

router.post('/product', authMiddleware, async (req, res) => {
    const { productName, Unitprice, categoryId, code, quantity, supplier, ExpiryDate, totalProducts } = req.body.data; // Expecting { products: [ {...}, {...} ] }
    console.log('Category:', req.body.data.categoryId);


    try {
        const product = new Product({ productName, Unitprice, code, quantity, category: categoryId, supplier, ExpiryDate, totalProducts, userId: req.user.id });

        await product.save();

        // console.log('Total products in database:', user);
        res.status(201).json({ message: 'Products created successfully', products: [product] });
    } catch (error) {
        console.error('Error creating products:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});




router.put('/product/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const data = req.body.data || req.body; // Support both formats
    console.log('Update data:', data);
    // Build update object dynamically
    const updateFields = {};
    if (data.productName !== undefined) updateFields.productName = data.productName;
    if (data.Unitprice !== undefined) updateFields.Unitprice = data.Unitprice;
    if (data.quantity !== undefined) updateFields.quantity = data.quantity;
    if (data.supplier !== undefined) updateFields.supplier = data.supplier;
    if (data.categoryId !== undefined) updateFields.category = data.categoryId;

    // Debug logs
    console.log('Received data:', data);
    console.log('Update fields:', updateFields);

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Updated product:', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

router.delete('/product/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;
