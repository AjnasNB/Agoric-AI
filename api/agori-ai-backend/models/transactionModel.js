// models/transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, default: 'initiated' },
    chains: [String],
    createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
