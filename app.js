const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRoutes = require('./Routes/auth');
const profile = require('./Routes/profile')
const products = require('./Routes/Products/Products');
const categories = require('./Routes/Categories/index');
require('dotenv').config();

// Get port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Grocery Management API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api', authRoutes);
app.use('/api', profile);
app.use('/api', products);
app.use('/api', categories);

console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});