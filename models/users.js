const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastToken: { type: Number, required: true, default: 0 },
    plasticDetails: [
        {
            date: { type: String, required: true },
            itemName: { type: String, required: true },
            token: { type: Number, required: true }, //sequential number
            quantity: { type: Number, required: true },
            status: { type: String, required: false } //accepted, rejected
        }
    ],
    orderDetails: [
        {
            date: { type: String, required: true },
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
            status: { type: String, required: true }, // pending, accepted/rejected, confirmed, preparing, ready, delivered
            token: { type: Number, required: true }, //sequential number
            category: { type: String, required: false } //plastic, food
        }
    ],
});
module.exports = mongoose.model('User', userSchema);
