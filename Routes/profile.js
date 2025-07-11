const express = require('express');
const router = express.Router();
const User = require('../models/User'); // assuming you have a User model
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // exclude password
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;