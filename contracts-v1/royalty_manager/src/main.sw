contract;

mod errors;

use interfaces::{royalty_manager_interface::*, ownable_interface::Ownable};
use libraries::{msg_sender_address::*, ownable::*};
use errors::*;

use std::{
    auth::msg_sender,
    contract_id::ContractId,
    logging::log,
    hash::Hash,
    identity::Identity,
    revert::revert,
    storage::storage_map::*
};

storage {
    is_initialized: bool = false,
    owner: Ownership = Ownership::uninitialized(),
    royalty_info: StorageMap<ContractId, Option<RoyaltyInfo>> = StorageMap {},
    fee_limit: u64 = 0,
}

impl RoyaltyManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        require(
            !_is_initialized(),
            RoyaltyManagerErrors::Initialized
        );
        storage.is_initialized.write(true);

        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
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
            require(caller == collection_owner, RoyaltyManagerErrors::CallerMustBeOwnerOrAdmin);
        } else if (ownable.admin().is_some()) {
            let caller = msg_sender().unwrap();
            let collection_admin = ownable.admin().unwrap();
            require(caller == collection_admin, RoyaltyManagerErrors::CallerMustBeOwnerOrAdmin);
        } else {
            revert(111)
        }

        require(fee <= storage.fee_limit.read(), RoyaltyManagerErrors::FeeHigherThanLimit);

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
        let none: Option<RoyaltyInfo> = Option::None;
        let status = storage.royalty_info.get(collection).try_read();
        match status {
            Option::Some(royalty_info) => royalty_info,
            Option::None => none,
        }
    }

    #[storage(read, write)]
    fn set_royalty_fee_limit(new_fee_limit: u64) {
        storage.owner.only_owner();

        require(new_fee_limit <= 1000, RoyaltyManagerErrors::FeeLimitTooHigh);

        storage.fee_limit.write(new_fee_limit)
    }

    #[storage(read)]
    fn get_royalty_fee_limit() -> u64 {
        storage.fee_limit.read()
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
