const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');

// Set up middleware
app.use(bodyParser.json());

const OKTO_API_URL = 'https://sandbox-api.okto.tech/api/v1';
const OKTO_SECRET_TOKEN = '069c9899-9fd5-4631-b137-881c885b6742';

// Endpoint to authenticate the wallet
app.post('/authenticate', async (req, res) => {
    const { walletAddress } = req.body;

    // Verify wallet address - You can do additional checks if needed
    if (!walletAddress) {
        return res.status(400).send({ message: 'Wallet address is required.' });
    }

    // Here you would check if the user exists in your database and proceed with the authentication
    // For now, just simulate a successful authentication
    return res.status(200).send({ message: 'User authenticated', walletAddress });
});

// Endpoint to buy tokens (Placeholder for actual Okto API token purchase logic)
app.post('/buy-tokens', async (req, res) => {
    const { walletAddress, quantity, tokenAddress } = req.body;

    if (!walletAddress || !quantity || !tokenAddress) {
        return res.status(400).send({ message: 'Required parameters missing' });
    }

    try {
        // Placeholder for Okto API call to buy tokens
        const response = await axios.post(`${OKTO_API_URL}/transfer/tokens/execute`, {
            network_name: 'POLYGON',
            token_address: tokenAddress,
            quantity: quantity,
            recipient_address: walletAddress
        }, {
            headers: {
                Authorization: `Bearer ${OKTO_SECRET_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).send({
            message: 'Tokens bought successfully',
            orderId: response.data.data.orderId
        });
    } catch (error) {
        console.error('Error buying tokens:', error);
        return res.status(500).send({ message: 'Error buying tokens' });
    }
});

// Endpoint to send tokens
app.post('/send-tokens', async (req, res) => {
    const { walletAddress, quantity, recipientAddress, tokenAddress } = req.body;

    if (!walletAddress || !quantity || !recipientAddress || !tokenAddress) {
        return res.status(400).send({ message: 'Required parameters missing' });
    }

    try {
        // Send tokens via Okto API
        const response = await axios.post(`${OKTO_API_URL}/transfer/tokens/execute`, {
            network_name: 'POLYGON',
            token_address: tokenAddress,
            quantity: quantity,
            recipient_address: recipientAddress
        }, {
            headers: {
                Authorization: `Bearer ${OKTO_SECRET_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).send({
            message: 'Tokens sent successfully',
            orderId: response.data.data.orderId
        });
    } catch (error) {
        console.error('Error sending tokens:', error);
        return res.status(500).send({ message: 'Error sending tokens' });
    }
});

// Endpoint to transfer NFTs
app.post('/transfer-nft', async (req, res) => {
    const { walletAddress, recipientAddress, nftAddress, quantity, collectionAddress, collectionName } = req.body;

    if (!walletAddress || !recipientAddress || !nftAddress || !quantity || !collectionAddress) {
        return res.status(400).send({ message: 'Required parameters missing' });
    }

    try {
        const response = await axios.post(`${OKTO_API_URL}/nft/transfer`, {
            operation_type: 'NFT_TRANSFER',
            network_name: 'POLYGON',
            collection_address: collectionAddress,
            collection_name: collectionName,
            quantity: quantity,
            recipient_address: recipientAddress,
            nft_address: nftAddress
        }, {
            headers: {
                Authorization: `Bearer ${OKTO_SECRET_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).send({
            message: 'NFT transferred successfully',
            orderId: response.data.data.orderId
        });
    } catch (error) {
        console.error('Error transferring NFT:', error);
        return res.status(500).send({ message: 'Error transferring NFT' });
    }
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
