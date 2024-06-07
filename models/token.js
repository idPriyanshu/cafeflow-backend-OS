const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    lastToken: { type: Number, required: true}
});
module.exports = mongoose.model('Token', tokenSchema);
