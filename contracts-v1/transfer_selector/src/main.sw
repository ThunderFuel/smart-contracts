contract;

use interfaces::{transfer_selector_interface::*, erc165_interface::IERC165};
use libraries::{msg_sender_address::*, ownable::*};

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
        set_ownership(Identity::Address(caller));

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
        let mut transfer_manager = storage.transfer_manager.get(collection);

        if (transfer_manager.is_none()) {
            let ERC165 = abi(IERC165, collection.into());
            if (ERC165.supportsInterface(ERC721_INTERFACE_ID)) {
                transfer_manager = storage.transfer_manager_721;
            } else if (ERC165.supportsInterface(ERC1155_INTERFACE_ID)) {
                transfer_manager = storage.transfer_manager_1155;
            }
        }

        transfer_manager
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