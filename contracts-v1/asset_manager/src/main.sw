contract;

use interfaces::asset_manager_interface::AssetManager;
use libraries::msg_sender_address::*;
use src_5::*;
use ownership::*;

use std::{
    assert::assert,
    contract_id::AssetId,
    hash::Hash,
    storage::{storage_map::*, storage_vec::*},
    vec::Vec
};

storage {
    owner: Ownership = Ownership::uninitialized(),
    assets: StorageVec<AssetId> = StorageVec {},
    is_supported: StorageMap<AssetId, bool> = StorageMap {},
}

impl AssetManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_asset(asset: AssetId) {
        storage.owner.only_owner();

        let status = storage.is_supported.get(asset).read();
        require(!status, "Asset: Already supported");

        storage.is_supported.insert(asset, true);
        storage.assets.push(asset);
    }

    #[storage(read, write)]
    fn remove_asset(asset: AssetId) {
        storage.owner.only_owner();

        let status = storage.is_supported.get(asset).read();
        require(status, "Asset: Not supported");

        storage.is_supported.insert(asset, false);

        let mut i = 0;
        let len = storage.assets.len();
        while len > i {
            let _asset = storage.assets.get(i).unwrap().read();
            if (_asset == asset) {
                let _ = storage.assets.remove(i);
                break;
            }

            i += 1;
        }
    }

    #[storage(read)]
    fn is_asset_supported(asset: AssetId) -> bool {
        storage.is_supported.get(asset).read()
    }

    #[storage(read)]
    fn get_supported_asset(index: u64) -> Option<AssetId> {
        let len = storage.assets.len();
        require(len != 0, "Asset: Zero length Vec");
        require(index <= len, "Asset: Index out of bound");

        storage.assets.get(index).unwrap().try_read()
    }

    #[storage(read)]
    fn get_count_supported_assets() -> u64 {
        storage.assets.len()
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
