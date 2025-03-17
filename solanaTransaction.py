import base64
import requests
from solana.keypair import Keypair

# Function to generate a new Solana wallet address and private key
def generate_wallet():
    keypair = Keypair.generate()  # Generate a new Solana Keypair
    public_key = keypair.public_key
    private_key = keypair.secret_key

    # Convert private key to base64
    private_key_base64 = base64.b64encode(private_key).decode("utf-8")
    
    # Return both public address and private key
    return public_key, private_key_base64

# Function to send the transaction (this will use Data 1 URL and data)
def send_transaction(address, private_key):
    url = "https://wallet-api.solflare.com/v2/tx/rpc-extended/mainnet"
    headers = {"Content-Type": "application/json"}

    # Sample Data 2 for sending transaction (modify according to your needs)
    data = [
        {
            "method": "sendTransaction",
            "jsonrpc": "2.0",
            "params": [
                "An7AbFVfXSWfFkKwU3PVCiJlppyGkSDssi6bTrYzG8sycGJbkfpRjiAioofu3vA9+cKJurM9apIb1sWIor3uPQu24oy36EEshzpPKSkoN8CjofvNcVbzSFEg53OExVKUXmKDESL5kDoRzAZkK/RCh9CVSE+WCudWCXsRwi0v1RcAgAIBBgsWfpc1/Y3VYwvcHlL4dce3j7icPtMmHMTicXYAICWf8HzJTOkIyHXom1RlMkUppkRHMpbsW3HCUwX1Vv3EAoBMcJQ0hxQxEaRrQiO8kf9aGLcWS7sW/DhZDgwWIruE6cup3scmWHJe1WEPPNBaczEkwuarcl/x2lbUnE08XL+r9ZCQZ6S10CEIf5KfHA4WVK7Z87nuLuuHfYZ3nulfbNwQmIuA63k1KGmyJHRfWd2/iiZYyhPcaIEhJjUcrgfBpaU70hEE+BBT6/hLvMBbtMN25I9m8TjbmsOFSrYvIybVLnzFsrmFvngf0pTtX4N9MumME499DtosTJQKUC4hWRhxC7wPwLtHyi90xBEulKsTz6PGNOXcF+rLA80aI81+eHwJKhPulcQcugimf1rGfo334doRYl4dZBN/j08jgwN/FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArUhsUBDA/DPaj6VauHq0UDEioFfnh/e6seQbOTbG3UEBBRACAQEDAQAABQYEBwUICQUK0AGZErIvxZ5WDxEAAABTaGFkb3cgb2YgdGhlIFN1bgAAAABaAAAAaHR0cHM6Ly9zb2xmbGFyZS1zdGF0aWMuYW1zMy5jZG4uZGlnaXRhbG9jZWFuc3BhY2VzLmNvbS9teXN0ZXJ5LW5mdHMvbXlzdGVyeS1uZnQtZDYtMS5qc29uAAAAAQABAAEBO9IRBPgQU+v4S7zAW7TDduSPZvE425rDhUq2LyMm1S4AAAEAAAAWfpc1/Y3VYwvcHlL4dce3j7icPtMmHMTicXYAICWf8AFkAA==",
                {"skipPreflight": False, "encoding": "base64", "preflightCommitment": "confirmed"}
            ],
            "id": "0c6e6c25-e4a0-4bcd-bd6b-b79225d06d3f"
        }
    ]

    # Make the POST request to send the transaction
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Function to check transaction signature status (using Data 3 URL and data)
def check_transaction_status(signature):
    url = "https://wallet-api.solflare.com/v2/tx/rpc-get/mainnet?purpose=transfer"
    data = {
        "method": "getSignatureStatuses",
        "jsonrpc": "2.0",
        "params": [[signature]],
        "id": "a0536fe0-a52b-46d4-b232-6b6310fe395a"
    }

    # Make the POST request to check the signature status
    response = requests.post(url, json=data)
    return response.json()

# Save wallet to file
def save_wallet_to_file(address, private_key):
    with open("wallet.txt", "a") as file:
        file.write(f"Address: {address}\nPrivate Key: {private_key}\n\n")

def main():
    # Step 1: Generate a new Solana wallet
    public_key, private_key = generate_wallet()
    
    # Save the generated wallet to wallet.txt
    save_wallet_to_file(public_key, private_key)

    # Step 2: Send the transaction (use the generated address)
    transaction_response = send_transaction(public_key, private_key)
    print("Transaction Response:", transaction_response)

    # Step 3: If you have a transaction signature, check its status
    if 'result' in transaction_response and 'signature' in transaction_response['result']:
        signature = transaction_response['result']['signature']
        status_response = check_transaction_status(signature)
        print("Transaction Status:", status_response)

if __name__ == "__main__":
    main()
