const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    productCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
