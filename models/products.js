const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    itemId: { type: Number, required: true },
    itemName: { type: String, required: true },
    cost: { type: Number, required: true },
    availability: { type: Boolean, required: true },
    category:{ type: String, required: true}
});
module.exports = mongoose.model('Product', productSchema);
