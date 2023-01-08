contract;

use interfaces::{royalty_manager_interface::*, ownable_interface::Ownable};
use libraries::{msg_sender_address::*, ownable::{only_owner, initializer}};

use std::{auth::msg_sender, contract_id::ContractId, logging::log, identity::Identity, storage::StorageMap};

storage {
    royalty_info: StorageMap<ContractId, Option<RoyaltyInfo>> = StorageMap {},
    fee_limit: u64 = 0,
}

impl RoyaltyManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        initializer(caller);
    }

    #[storage(write)]
    fn register_royalty_info(
        collection: ContractId,
        receiver: Identity,
        fee: u64
    ) {
        let ownable = abi(Ownable, collection.into());
        let owner = ownable.owner();

        let caller = msg_sender().unwrap();
        assert(caller == owner);

        assert(fee <= storage.fee_limit);

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

        assert(new_fee_limit <= 1000);

        storage.fee_limit = new_fee_limit;
    }

    #[storage(read)]
    fn get_royalty_fee_limit() -> u64 {
        storage.fee_limit
    }
}
