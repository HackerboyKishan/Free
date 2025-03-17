const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

const walletFile = 'address.txt';
const privateFile = 'key.txt';

fs.writeFileSync(walletFile, '');
fs.writeFileSync(privateFile, '');

// Generate 10 wallets and save them to files
for (let i = 0; i < 10; i++) {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = `[${keypair.secretKey.toString()}]`;
    fs.appendFileSync(walletFile, publicKey + '\n');
    fs.appendFileSync(privateFile, privateKey + '\n');
}

console.log('Wallets and private keys have been saved!');
