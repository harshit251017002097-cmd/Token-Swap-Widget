# 🔁 Token Swap Widget (Soroban Smart Contract)

## 📌 Project Description
The Token Swap Widget is a decentralized smart contract built on Stellar’s Soroban platform. It enables peer-to-peer token swapping between two users without relying on centralized exchanges or intermediaries.

This project demonstrates a simple and secure mechanism for atomic token exchange using Soroban smart contracts.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2d045565-e974-4286-8eea-a2f3b18765e7" />


---

## ⚙️ What it does
The smart contract facilitates a direct token swap between two users:

- User A sends Token X to User B
- User B sends Token Y to User A
- The swap is executed atomically (both transfers succeed or fail together)

This ensures fairness and eliminates counterparty risk.

---

## ✨ Features

- 🔐 **Secure Authorization**
  - Both users must approve the transaction before execution

- ⚡ **Atomic Swaps**
  - Ensures that either both transfers happen or none do

- 🔄 **Multi-Token Support**
  - Works with any Soroban-compatible token contracts

- 📢 **Event Logging**
  - Emits on-chain events for transparency and tracking

- 🧩 **Simple Integration**
  - Can be easily connected to a frontend widget or dApp

---

## 🏗️ Tech Stack

- **Blockchain:** Stellar (Soroban)
- **Language:** Rust
- **SDK:** soroban-sdk

---

## 🚀 How to Use

1. Deploy the contract to Soroban network
2. Call the `swap` function with:
   - Two user addresses
   - Two token contract addresses
   - Token amounts to swap

ID: https://stellar.expert/explorer/testnet/contract/CAL5P7OLFFJO6SUAMZHOHLZJJLAQWBYFNMHOMHPUALBVIJL2Z2EDSRE6
