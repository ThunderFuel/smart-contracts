contract;

mod errors;

use interfaces::{execution_manager_interface::ExecutionManager};
use libraries::{msg_sender_address::*, ownable::*};
use errors::*;

use std::{
    assert::assert,
    contract_id::ContractId,
    hash::Hash,
    revert::*,
    storage::{storage_map::*, storage_vec::*},
    vec::Vec
};

storage {
    is_initialized: bool = false,
    owner: Ownership = Ownership::uninitialized(),
    strategies: StorageVec<ContractId> = StorageVec {},
    is_whitelisted: StorageMap<ContractId, bool> = StorageMap {},
}

impl ExecutionManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        require(
            !_is_initialized(),
            ExecutionManagerErrors::Initialized
        );
        storage.is_initialized.write(true);

        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_strategy(strategy: ContractId) {
        storage.owner.only_owner();

        require(
            !_is_strategy_whitelisted(strategy),
            ExecutionManagerErrors::StrategyAlreadyWhitelisted
        );

        storage.is_whitelisted.insert(strategy, true);
        storage.strategies.push(strategy);
    }

    #[storage(read, write)]
    fn remove_strategy(index: u64) {
        storage.owner.only_owner();

        let strategy = storage.strategies.remove(index);
        storage.is_whitelisted.insert(strategy, false);
    }

    #[storage(read)]
    fn is_strategy_whitelisted(strategy: ContractId) -> bool {
        _is_strategy_whitelisted(strategy)
    }

    #[storage(read)]
    fn get_whitelisted_strategy(index: u64) -> Option<ContractId> {
        let len = storage.strategies.len();
        require(len != 0, ExecutionManagerErrors::ZeroLengthVec);
        require(index <= len, ExecutionManagerErrors::IndexOutOfBound);

        storage.strategies.get(index).unwrap().try_read()
    }

    #[storage(read)]
    fn get_count_whitelisted_strategies() -> u64 {
        storage.strategies.len()
    }

    #[storage(read)]
    fn owner() -> Option<Identity> {
        _owner()
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        storage.owner.only_owner();
        storage.owner.transfer_ownership(new_owner);
    }

    #[storage(read, write)]
    fn renounce_ownership() {
        storage.owner.only_owner();
        storage.owner.renounce_ownership();
    }
}

#[storage(read)]
fn _is_initialized() -> bool {
    match storage.is_initialized.try_read() {
        Option::Some(is_initialized) => is_initialized,
        Option::None => false,
    }
}

#[storage(read)]
fn _owner() -> Option<Identity> {
    match storage.owner.owner() {
        State::Initialized(owner) => Option::Some(owner),
        _ => Option::None,
    }
}

#[storage(read)]
fn _is_strategy_whitelisted(strategy: ContractId) -> bool {
    let status = storage.is_whitelisted.get(strategy).try_read();
    match status {
        Option::Some(is_whitelisted) => is_whitelisted,
        Option::None => false,
    }
}
