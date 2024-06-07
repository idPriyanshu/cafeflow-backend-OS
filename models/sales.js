const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    userId:{ type: String,ref:'User',required: true },
    date: { type: String, required: true },
    orderDetails: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
});
module.exports = mongoose.model('Sale', saleSchema);