contract;

use interfaces::{royalty_manager_interface::*, ownable_interface::Ownable};
use libraries::{msg_sender_address::*, ownable::*};

use std::{auth::msg_sender, contract_id::ContractId, logging::log, identity::Identity, revert::revert, storage::StorageMap};

storage {
    royalty_info: StorageMap<ContractId, Option<RoyaltyInfo>> = StorageMap {},
    fee_limit: u64 = 0,
}

impl RoyaltyManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn register_royalty_info(
        collection: ContractId,
        receiver: Identity,
        fee: u64
    ) {
        let ownable = abi(Ownable, collection.into());

        if (ownable.owner().is_some()) {
            let caller = msg_sender().unwrap();
            let collection_owner = ownable.owner().unwrap();
            require(caller == collection_owner, "Royalty: Caller must be the owner or admin");
        } else if (ownable.admin().is_some()) {
            let caller = msg_sender().unwrap();
            let collection_admin = ownable.admin().unwrap();
            require(caller == collection_admin, "Royalty: Caller must be the owner or admin");
        } else {
            revert(111)
        }

        require(fee <= storage.fee_limit, "Royalty: Fee higher than limit");

        let info = RoyaltyInfo {
            collection: collection,
            receiver: receiver,
            fee: fee
        };

        let option_info: Option<RoyaltyInfo> = Option::Some(info);
        storage.royalty_info.insert(collection, option_info);

        log(RoyaltyRegistryEvent {
            royalty_info: info
        });
    }

    #[storage(read)]
    fn get_royalty_info(collection: ContractId) -> Option<RoyaltyInfo> {
        storage.royalty_info.get(collection)
    }

    #[storage(read, write)]
    fn set_royalty_fee_limit(new_fee_limit: u64) {
        only_owner();

        require(new_fee_limit <= 1000, "Royalty: Fee limit too high");

        storage.fee_limit = new_fee_limit;
    }

    #[storage(read)]
    fn get_royalty_fee_limit() -> u64 {
        storage.fee_limit
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
