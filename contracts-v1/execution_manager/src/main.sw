contract;

use interfaces::{execution_manager_interface::ExecutionManager};
use libraries::msg_sender_address::*;
use src_5::*;
use ownership::*;

use std::{
    assert::assert,
    contract_id::ContractId,
    hash::Hash,
    storage::{storage_map::*, storage_vec::*},
    vec::Vec
};

storage {
    owner: Ownership = Ownership::uninitialized(),
    strategies: StorageVec<ContractId> = StorageVec {},
    is_whitelisted: StorageMap<ContractId, bool> = StorageMap {},
}

impl ExecutionManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_strategy(strategy: ContractId) {
        storage.owner.only_owner();

        let is_whitelisted = storage.is_whitelisted.get(strategy).read();
        require(!is_whitelisted, "Strategy: Already whitelisted");

        storage.is_whitelisted.insert(strategy, true);
        storage.strategies.push(strategy);
    }

    #[storage(read, write)]
    fn remove_strategy(strategy: ContractId) {
        storage.owner.only_owner();

        let is_whitelisted = storage.is_whitelisted.get(strategy).read();
        require(is_whitelisted, "Strategy: Not whitelisted");

        storage.is_whitelisted.insert(strategy, false);

        let mut i = 0;
        let len = storage.strategies.len();
        while len > i {
            let _strategy = storage.strategies.get(i).unwrap().read();
            if (_strategy == strategy) {
                let _ = storage.strategies.remove(i);
                break;
            }

            i += 1;
        }
    }

    #[storage(read)]
    fn is_strategy_whitelisted(strategy: ContractId) -> bool {
        storage.is_whitelisted.get(strategy).read()
    }

    #[storage(read)]
    fn get_whitelisted_strategy(index: u64) -> Option<ContractId> {
        let len = storage.strategies.len();
        require(len != 0, "Asset: Zero length Vec");
        require(index <= len, "Asset: Index out of bound");

        storage.strategies.get(index).unwrap().try_read()
    }

    #[storage(read)]
    fn get_count_whitelisted_strategies() -> u64 {
        storage.strategies.len()
    }

    #[storage(read)]
    fn owner() -> Option<Identity> {
        let owner: Option<Identity> = match storage.owner.owner() {
            State::Uninitialized => Option::None,
            State::Initialized(owner) => Option::Some(owner),
            State::Revoked => Option::None,
        };
        owner
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        storage.owner.transfer_ownership(new_owner)
    }

    #[storage(read, write)]
    fn renounce_ownership() {
        storage.owner.renounce_ownership()
    }
}
