const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email);

    const secret = process.env.JWT_SECRET;
    const expiration = process.env.JWT_EXPIRATION || '1h';

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email, password: password });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: expiration });
    res.status(200).json({ token: token, user: { id: user._id, email: user.email, username: user.username } });
});

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const secret = process.env.JWT_SECRET;
    const expiration = process.env.JWT_EXPIRATION || '1h';
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    const newUser = new User({ username: username, email: email, password: password });
    try {
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: expiration });
        res.status(201).json({ token: token, user: { id: newUser._id, email: newUser.email, username: newUser.username } });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
