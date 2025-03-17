const base64 = require('base-64');
const axios = require('axios');
const { Keypair } = require('@solana/web3.js');

// Function to generate a new Solana wallet address and private key
function generateWallet() {
    const keypair = Keypair.generate();  // Generate a new Solana Keypair
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey;

    // Convert private key to base64
    const privateKeyBase64 = base64.encode(Buffer.from(privateKey));

    // Return both public address and private key
    return { publicKey, privateKeyBase64 };
}

// Function to send the transaction
async function sendTransaction(address, privateKey) {
    const url = 'https://wallet-api.solflare.com/v2/tx/rpc-extended/mainnet';
    const headers = { 'Content-Type': 'application/json' };

    // Sample Data for sending transaction
    const data = [
        {
            method: 'sendTransaction',
            jsonrpc: '2.0',
            params: [
                'An7AbFVfXSWfFkKwU3PVCiJlppyGkSDssi6bTrYzG8sycGJbkfpRjiAioofu3vA9+cKJurM9apIb1sWIor3uPQu24oy36EEshzpPKSkoN8CjofvNcVbzSFEg53OExVKUXmKDESL5kDoRzAZkK/RCh9CVSE+WCudWCXsRwi0v1RcAgAIBBgsWfpc1/Y3VYwvcHlL4dce3j7icPtMmHMTicXYAICWf8HzJTOkIyHXom1RlMkUppkRHMpbsW3HCUwX1Vv3EAoBMcJQ0hxQxEaRrQiO8kf9aGLcWS7sW/DhZDgwWIruE6cup3scmWHJe1WEPPNBaczEkwuarcl/x2lbUnE08XL+r9ZCQZ6S10CEIf5KfHA4WVK7Z87nuLuuHfYZ3nulfbNwQmIuA63k1KGmyJHRfWd2/iiZYyhPcaIEhJjUcrgfBpaU70hEE+BBT6/hLvMBbtMN25I9m8TjbmsOFSrYvIybVLnzFsrmFvngf0pTtX4N9MumME499DtosTJQKUC4hWRhxC7wPwLtHyi90xBEulKsTz6PGNOXcF+rLA80aI81+eHwJKhPulcQcugimf1rGfo334doRYl4dZBN/j08jgwN/FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArUhsUBDA/DPaj6VauHq0UDEioFfnh/e6seQbOTbG3UEBBRACAQEDAQAABQYEBwUICQUK0AGZErIvxZ5WDxEAAABTaGFkb3cgb2YgdGhlIFN1bgAAAABaAAAAaHR0cHM6Ly9zb2xmbGFyZS1zdGF0aWMuYW1zMy5jZG4uZGlnaXRhbG9jZWFuc3BhY2VzLmNvbS9teXN0ZXJ5LW5mdHMvbXlzdGVyeS1uZnQtZDYtMS5qc29uAAAAAQABAAEBO9IRBPgQU+v4S7zAW7TDduSPZvE425rDhUq2LyMm1S4AAAEAAAAWfpc1/Y3VYwvcHlL4dce3j7icPtMmHMTicXYAICWf8AFkAA==',
                { skipPreflight: false, encoding: 'base64', preflightCommitment: 'confirmed' }
            ],
            id: '0c6e6c25-e4a0-4bcd-bd6b-b79225d06d3f'
        }
    ];

    try {
        // Make the POST request to send the transaction
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Function to check transaction signature status
async function checkTransactionStatus(signature) {
    const url = 'https://wallet-api.solflare.com/v2/tx/rpc-get/mainnet?purpose=transfer';
    const data = {
        method: 'getSignatureStatuses',
        jsonrpc: '2.0',
        params: [[signature]],
        id: 'a0536fe0-a52b-46d4-b232-6b6310fe395a'
    };

    try {
        // Make the POST request to check the signature status
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error checking transaction status:', error);
    }
}

// Save wallet to file (using fs)
const fs = require('fs');
function saveWalletToFile(address, privateKey) {
    const walletInfo = `Address: ${address}\nPrivate Key: ${privateKey}\n\n`;
    fs.appendFileSync('wallet.txt', walletInfo);
}

async function main() {
    // Step 1: Generate a new Solana wallet
    const { publicKey, privateKeyBase64 } = generateWallet();

    // Save the generated wallet to wallet.txt
    saveWalletToFile(publicKey, privateKeyBase64);

    // Step 2: Send the transaction (use the generated address)
    const transactionResponse = await sendTransaction(publicKey, privateKeyBase64);
    console.log("Transaction Response:", transactionResponse);

    // Step 3: If you have a transaction signature, check its status
    if (transactionResponse && transactionResponse.result && transactionResponse.result.signature) {
        const signature = transactionResponse.result.signature;
        const statusResponse = await checkTransactionStatus(signature);
        console.log("Transaction Status:", statusResponse);
    }
}

// Run the main function
main();
