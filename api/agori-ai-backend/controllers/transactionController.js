// controllers/transactionController.js
const blockchainService = require('../services/blockchainService');

// Create Transaction (multi-chain handling)
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, currency, chains } = req.body;

        if (!type || !amount || !currency || !chains) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const transactionId = await blockchainService.processTransaction(chains, amount, currency);

        return res.status(200).json({
            status: 'success',
            message: 'Transaction initiated successfully',
            transactionId,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error processing transaction.' });
    }
};

// Get Transaction Status
exports.getTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const status = await blockchainService.getTransactionStatus(id);

        if (!status) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        return res.status(200).json(status);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving transaction status.' });
    }
};
