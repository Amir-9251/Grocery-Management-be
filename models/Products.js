const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // reference to Category collection
        required: true
    },
    code: {
        type: String,
        required: true
    },
    Unitprice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    ExpiryDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to User collection
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
