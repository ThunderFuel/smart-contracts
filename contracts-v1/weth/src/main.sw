contract;

dep errors;
dep events;
dep constants;
dep interface;

use errors::*;
use events::*;
use constants::*;
use interface::*;
use std::{
    address::Address,
    auth::*,
    call_frames::*,
    constants::*,
    context::*,
    contract_id::ContractId,
    logging::log,
    identity::Identity,
    revert::require,
    token::*,
    storage::StorageMap,
};

storage {
    balance_of: StorageMap<Identity, u64> = StorageMap {},
    allowance: StorageMap<(Identity, Identity), u64> = StorageMap {},
}

#[storage(write)]
fn approve_internal(owner: Identity, spender: Identity, amount: u64) {
    require(owner != ZERO_IDENTITY_ADDRESS && owner != ZERO_IDENTITY_CONTRACT, Error::ZeroIdentity);
    require(spender != ZERO_IDENTITY_ADDRESS && spender != ZERO_IDENTITY_CONTRACT, Error::ZeroIdentity);

    storage.allowance.insert((owner, spender), amount);

    log(Aprroval {
        owner,
        spender,
        amount,
    });
}

#[storage(read, write)]
fn spend_allowance(owner: Identity, spender: Identity, amount: u64) {
    let current_allowance = storage.allowance.get((owner, spender));
    if (current_allowance != 18446744073709551615) {
        require(current_allowance >= amount, Error::InsufficientAllowance);
        approve_internal(owner, spender, current_allowance - amount);
    }
}

#[storage(read, write)]
fn transfer_internal(from: Identity, to: Identity, amount: u64) {
    require(from != ZERO_IDENTITY_ADDRESS && from != ZERO_IDENTITY_CONTRACT, Error::ZeroIdentity);
    require(to != ZERO_IDENTITY_ADDRESS && to != ZERO_IDENTITY_CONTRACT, Error::ZeroIdentity);

    let from_balance = storage.balance_of.get(from);
    let to_balance = storage.balance_of.get(to);
    require(from_balance >= amount, Error::AmountExceedsBalance);

    storage.balance_of.insert(from, from_balance - amount);
    storage.balance_of.insert(to, to_balance + amount);

    log(Transfer {
        from,
        to,
        amount,
    });
}

impl WETH for Contract {
    fn name() -> str[13] {
        "Wrapped Ether"
    }

    fn symbol() -> str[4] {
        "WETH"
    }

    fn total_supply() -> u64 {
        this_balance(BASE_ASSET_ID)
    }

    #[storage(read)]
    fn balance_of(account: Identity) -> u64 {
        storage.balance_of.get(account)
    }

    #[storage(read)]
    fn allowance(owner: Identity, spender: Identity) -> u64 {
        storage.allowance.get((owner, spender))
    }

    #[storage(read, write)]
    fn deposit() {
        require(msg_asset_id() == BASE_ASSET_ID, Error::OnlyBaseAsset);

        let address = msg_sender().unwrap();
        let amount = msg_amount();
        let current_balance = storage.balance_of.get(address);
        let new_balance = current_balance + amount;
        storage.balance_of.insert(address, new_balance);

        log(Deposit {
            address,
            amount
        });
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) {
        let sender = msg_sender().unwrap();
        let current_balance = storage.balance_of.get(sender);
        require(current_balance >= amount, Error::AmountExceedsBalance);

        let new_balance = current_balance - amount;
        storage.balance_of.insert(sender, new_balance);

        transfer(amount, BASE_ASSET_ID, sender);

        log(Withdrawal {
            address: sender,
            amount,
        });
    }

    #[storage(write)]
    fn approve(spender: Identity, amount: u64) -> bool {
        let owner = msg_sender().unwrap();
        approve_internal(owner, spender, amount);
        true
    }

    #[storage(read, write)]
    fn transfer(to: Identity, amount: u64) -> bool {
        let owner = msg_sender().unwrap();
        transfer_internal(owner, to, amount);
        true
    }

    #[storage(read, write)]
    fn transfer_from(from: Identity, to: Identity, amount: u64) -> bool {
        let spender = msg_sender().unwrap();
        spend_allowance(from, spender, amount);
        transfer_internal(from, to, amount);
        true
    }

    #[storage(read, write)]
    fn increase_allowance(spender: Identity, added_amount: u64) -> bool {
        let owner = msg_sender().unwrap();
        let current_allowance = storage.allowance.get((owner, spender));
        approve_internal(owner, spender, current_allowance + added_amount);
        true
    }

    #[storage(read, write)]
    fn decrease_allowance(spender: Identity, subtracted_amount: u64) -> bool {
        let owner = msg_sender().unwrap();
        let current_allowance = storage.allowance.get((owner, spender));
        require(current_allowance >= subtracted_amount, Error::DecreasedAllowanceBelowZero);

        approve_internal(owner, spender, current_allowance - subtracted_amount);
        true
    }
}
