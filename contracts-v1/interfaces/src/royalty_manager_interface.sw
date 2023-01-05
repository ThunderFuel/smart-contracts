library royalty_manager_interface;

use std::{contract_id::ContractId, identity::Identity};

pub struct RoyaltyInfo {
    collection: ContractId,
    receiver: Identity,
    fee: u64
}

pub struct RoyaltyRegistryEvent {
    royalty_info: RoyaltyInfo
}

abi RoyaltyManager {
    #[storage(read, write)]
    fn initialize();

    #[storage(write)]
    fn register_royalty_info(
        collection: ContractId,
        receiver: Identity,
        fee: u64
    );

    #[storage(read)]
    fn get_royalty_info(collection: ContractId) -> Option<RoyaltyInfo>;

    #[storage(read, write)]
    fn set_royalty_fee_limit(fee_limit: u64);
}
