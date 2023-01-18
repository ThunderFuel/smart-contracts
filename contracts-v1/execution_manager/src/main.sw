contract;

use interfaces::{execution_manager_interface::ExecutionManager};
use libraries::{msg_sender_address::*, ownable::*};

use std::{assert::assert, contract_id::ContractId, storage::{StorageMap, StorageVec}, vec::Vec};

storage {
    strategies: StorageVec<ContractId> = StorageVec {},
    is_whitelisted: StorageMap<ContractId, bool> = StorageMap {},
}

impl ExecutionManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_strategy(strategy: ContractId) {
        only_owner();

        assert(!storage.is_whitelisted.get(strategy));

        storage.is_whitelisted.insert(strategy, true);
        storage.strategies.push(strategy);
    }

    #[storage(read, write)]
    fn remove_strategy(strategy: ContractId) {
        only_owner();

        assert(storage.is_whitelisted.get(strategy));

        storage.is_whitelisted.insert(strategy, false);

        let mut i = 0;
        let len = storage.strategies.len();
        while len > i {
            let _strategy = storage.strategies.get(i).unwrap();
            if (_strategy == strategy) {
                storage.strategies.remove(i);
                break;
            }

            i += 1;
        }
    }

    #[storage(read)]
    fn is_strategy_whitelisted(strategy: ContractId) -> bool {
        storage.is_whitelisted.get(strategy)
    }

    #[storage(read)]
    fn get_whitelisted_strategies() -> Vec<ContractId> {
        let len = storage.strategies.len();
        assert(len != 0);

        let mut i = 0;
        let mut vec = Vec::new();
        while len > i {
            let strategy = storage.strategies.get(i).unwrap();
            vec.push(strategy);
            i += 1;
        }

        vec
    }

    #[storage(read)]
    fn get_count_whitelisted_strategies() -> u64 {
        storage.strategies.len()
    }

    #[storage(read)]
    fn owner() -> Option<Identity> {
        owner()
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        transfer_ownership(new_owner);
    }

    #[storage(read, write)]
    fn renounce_ownership() {
        renounce_ownership();
    }
}
