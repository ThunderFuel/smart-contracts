library weth_interface;

use std::{identity::Identity};

abi WETH {
    fn name() -> str[13];

    fn symbol() -> str[4];

    fn total_supply() -> u64;

    #[storage(read)]
    fn balance_of(account: Identity) -> u64;

    #[storage(read)]
    fn allowance(owner: Identity, spender: Identity) -> u64;

    #[storage(read, write)]
    fn deposit();

    #[storage(read, write)]
    fn withdraw(amount: u64);

    #[storage(write)]
    fn approve(spender: Identity, amount: u64) -> bool;

    #[storage(read, write)]
    fn transfer(to: Identity, amount: u64) -> bool;

    #[storage(read, write)]
    fn transfer_from(from: Identity, to: Identity, amount: u64) -> bool;

    #[storage(read, write)]
    fn increase_allowance(spender: Identity, added_amount: u64) -> bool;

    #[storage(read, write)]
    fn decrease_allowance(spender: Identity, subtracted_amount: u64) -> bool;
}
