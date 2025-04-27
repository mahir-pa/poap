https://github.com/user-attachments/assets/2ceb33e3-2675-4e50-a852-79e9be460d7b

<img width="490" alt="Image" src="https://github.com/user-attachments/assets/e0402dda-101a-4c9a-a678-101932692851" />
<img width="490" alt="Image" src="https://github.com/user-attachments/assets/cda8e8c8-0610-4ebf-a9a8-b160c6da3c87" />
<img width="490" alt="Image" src="https://github.com/user-attachments/assets/2a045118-01ad-4db6-a4c1-49a86ccfe1ee" />
<img width="490" alt="Image" src="https://github.com/user-attachments/assets/3bd06c35-4a65-41c5-98d6-224d5062bd64" />

# ChainTix: Secret Code Minting System for Polkadot Asset Hub

ChainTix uses a three-contract modular system to manage the minting of secret-code-based digital collectibles (POAPs) on Polkadot Asset Hub.

Each component is optimized for gas-efficiency, security, and scalability, while staying within Polkadot’s 49 KB contract deployment limit.

---

## 🛠 Contract 1: `SecretCodeManager.sol`

### Purpose:
Manages secret codes securely and tracks per-user usage.

### Key Functions:
- `addSecret(bytes32 hashedSecret, string memory uri)`:  
  Adds a new event secret and links it to an IPFS metadata URI. Enables infinite event expansion without redeployments.

- `verifyAndMarkUsed(bytes32 hashedSecret, address user) returns (string)`:  
  Verifies if the secret is valid, ensures the wallet has not used it yet, marks it as used, and returns the metadata URI for minting.

- `hasUserMinted(bytes32 hashedSecret, address user)`:  
  Read-only check to see if a wallet has already minted with a given secret.

### Security:
- Secret words are **hashed off-chain** (SHA-256 or similar) before storage.
- No plain-text secrets are stored on-chain, preventing scanning/cheating.

### Scalability:
- New secret codes can be added anytime by calling `addSecret()`, supporting continuous event launches without new contract deployments.

---

## 🛠 Contract 2: `SecretPOAPNFT.sol`

### Purpose:
Handles the minting and management of ERC-721 digital collectibles.

### Key Functions:
- `mint(address to, string memory uri)`:  
  Mints a new NFT to a user with the provided IPFS metadata URI.

- `updateMinter(address newMinter)`:  
  Restricts minting rights to the Router contract after initial deployment.

### Security:
- Initially, the deployer had minting rights.
- After deployment, mint rights are transferred to the Router contract using `updateMinter()`.
- Prevents unauthorized NFT minting.

### Minimalist Design:
- Focused only on minting and ownership functions to stay gas-efficient and within Polkadot's 49 KB limit.

---

## 🛠 Contract 3: `SecretPOAPRouter.sol`

### Purpose:
Handles user interactions and mint flow logic.

### Key Functions:
- `mintWithSecret(string memory secretWord)`:  
  Accepts user input, hashes it, verifies it with the Manager, and mints an NFT if valid.

- `setSecretCodeManager(address _manager)`:  
  Updates the SecretCodeManager address (admin-only).

- `setNFTContract(address _nft)`:  
  Updates the NFT contract address (admin-only).

### Security:
- Only allows minting if the secret is verified and unused for the wallet.
- Central controller ensuring users can't bypass security and mint directly.

---

## 🔒 Key Security Features

- **Hashed Secrets**:  
  Secrets are never exposed on-chain. Users must genuinely know the correct secret to mint.

- **Single-Use Protection**:  
  Each wallet can only mint once per secret.

- **Upgradeable System**:  
  Admins can update Secret Manager or NFT contract addresses without redeploying the entire Router.

- **Only Authorized Minting**:  
  NFT contract only accepts minting calls from the authorized Router.

---

## 🔗 System Interaction Flow

1. User connects wallet and submits a secret word on the frontend.
2. Frontend hashes the secret word.
3. Router calls `verifyAndMarkUsed()` on Manager:
   - Verifies the secret.
   - Marks the secret as used for that wallet.
   - Fetches the associated metadata URI.
4. Router calls `mint()` on the NFT contract:
   - NFT is minted with the returned metadata.
5. User receives the collectible in their wallet.

---

## ✅ Final Summary

This smart contract architecture ensures that:
- Only real event attendees can mint their POAPs.
- Secrets are protected on-chain.
- Mass minting scales smoothly with Polkadot's Elastic Coretime.
- New events can be added without disruption.

---

Blocklink : https://blockscout-asset-hub.parity-chains-scw.parity.io/address/0x16E5BA2A5713E036B2dd10BA1c5861728FAb6D23?tab=contract

Website has been published at : https://mahir-pa.github.io/poap



