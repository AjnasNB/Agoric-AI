// server.js
const express = require('express');
const transactionController = require('./controllers/transactionController');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.post('/api/transactions', transactionController.createTransaction);
app.get('/api/transactions/:id', transactionController.getTransactionStatus);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
