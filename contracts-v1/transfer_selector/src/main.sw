contract;

use interfaces::transfer_selector_interface::TransferSelector;
use libraries::{msg_sender_address::*, ownable::{only_owner, initializer}};

use std::{assert::assert, contract_id::ContractId, storage::StorageMap};

storage {
    transfer_manager_721: Option<ContractId> = Option::None,
    transfer_manager_1155: Option<ContractId> = Option::None,
    transfer_manager: StorageMap<ContractId, Option<ContractId>> = StorageMap {},
}

impl TransferSelector for Contract {
    #[storage(read, write)]
    fn initialize(transfer_manager_721: ContractId, transfer_manager_1155: ContractId) {
        let caller = get_msg_sender_address_or_panic();
        initializer(caller);

        assert(storage.transfer_manager_721.is_none() && storage.transfer_manager_1155.is_none());

        storage.transfer_manager_721 = Option::Some(transfer_manager_721);
        storage.transfer_manager_1155 = Option::Some(transfer_manager_1155);
    }

    #[storage(read)]
    fn get_transfer_manager_721() -> Option<ContractId> {
        storage.transfer_manager_721
    }

    #[storage(read)]
    fn get_transfer_manager_1155() -> Option<ContractId> {
        storage.transfer_manager_1155
    }

    #[storage(read)]
    fn get_transfer_manager_for_token(collection: ContractId) -> Option<ContractId> {
        storage.transfer_manager.get(collection)
    }

    #[storage(read, write)]
    fn add_collection_transfer_manager(collection: ContractId, transfer_manager: ContractId) {
        only_owner();

        assert(storage.transfer_manager.get(collection).is_none());

        let manager: Option<ContractId> = Option::Some(transfer_manager);
        storage.transfer_manager.insert(collection, manager);
    }

    #[storage(read, write)]
    fn remove_collection_transfer_manager(collection: ContractId) {
        only_owner();

        assert(storage.transfer_manager.get(collection).is_some());

        let none: Option<ContractId> = Option::None;
        storage.transfer_manager.insert(collection, none);
    }
}
