library asset_manager_interface;

use std::{contract_id::ContractId, vec::Vec};

abi AssetManager {
    #[storage(read, write)]
    fn initialize();

    #[storage(read, write)]
    fn add_asset(asset: ContractId);

    #[storage(read, write)]
    fn remove_asset(asset: ContractId);

    #[storage(read)]
    fn is_asset_supported(asset: ContractId) -> bool;

    #[storage(read)]
    fn get_supported_assets() -> Vec<ContractId>;

    #[storage(read)]
    fn get_count_supported_assets() -> u64;
}
