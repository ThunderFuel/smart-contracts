contract;

use interfaces::asset_manager_interface::AssetManager;
use libraries::{msg_sender_address::*, ownable::*};

use std::{assert::assert, contract_id::ContractId, storage::{StorageMap, StorageVec}, vec::Vec};

storage {
    assets: StorageVec<ContractId> = StorageVec {},
    is_supported: StorageMap<ContractId, bool> = StorageMap {},
}

impl AssetManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_asset(asset: ContractId) {
        only_owner();

        let status = storage.is_supported.get(asset);
        assert(!status);

        storage.is_supported.insert(asset, true);
        storage.assets.push(asset);
    }

    #[storage(read, write)]
    fn remove_asset(asset: ContractId) {
        only_owner();

        let status = storage.is_supported.get(asset);
        assert(status);

        storage.is_supported.insert(asset, false);

        let mut i = 0;
        let len = storage.assets.len();
        while len > i {
            let _asset = storage.assets.get(i).unwrap();
            if (_asset == asset) {
                storage.assets.remove(i);
                break;
            }

            i += 1;
        }
    }

    #[storage(read)]
    fn is_asset_supported(asset: ContractId) -> bool {
        storage.is_supported.get(asset)
    }

    #[storage(read)]
    fn get_supported_assets() -> Vec<ContractId> {
        let len = storage.assets.len();
        assert(len != 0);

        let mut i = 0;
        let mut vec = Vec::new();
        while len > i {
            let value = storage.assets.get(i).unwrap();
            vec.push(value);
            i += 1;
        }

        vec
    }

    #[storage(read)]
    fn get_count_supported_assets() -> u64 {
        storage.assets.len()
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
