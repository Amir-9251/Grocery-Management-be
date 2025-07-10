const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to User collection
        required: true
    },
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
