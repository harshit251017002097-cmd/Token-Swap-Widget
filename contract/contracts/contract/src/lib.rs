#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

#[contract]
pub struct TokenSwap;

#[contractimpl]
impl TokenSwap {

    // Swap tokens between two users
    pub fn swap(
        env: Env,
        user1: Address,
        user2: Address,
        token1: Address,
        token2: Address,
        amount1: i128,
        amount2: i128,
    ) {
        // Require authorization
        user1.require_auth();
        user2.require_auth();

        // Token client interfaces
        let token1_client = soroban_sdk::token::Client::new(&env, &token1);
        let token2_client = soroban_sdk::token::Client::new(&env, &token2);
    
        // Transfer token1 from user1 → user2
        token1_client.transfer(&user1, &user2, &amount1);

        // Transfer token2 from user2 → user1
        token2_client.transfer(&user2, &user1, &amount2);

        // Emit event
        env.events().publish(
            (Symbol::short("swap"),),
            (user1, user2, amount1, amount2),
        );
    }
}