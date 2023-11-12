contract;

mod errors;

use interfaces::asset_manager_interface::AssetManager;
use libraries::msg_sender_address::*;
use errors::*;

use std::{
    assert::assert,
    contract_id::AssetId,
    hash::Hash,
    storage::{storage_map::*, storage_vec::*},
    vec::Vec
};

storage {
    owner: Option<Identity> = Option::None,
    assets: StorageVec<AssetId> = StorageVec {},
    is_supported: StorageMap<AssetId, bool> = StorageMap {},
}

impl AssetManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        storage.owner.write(Option::Some(Identity::Address(caller)));
    }

    #[storage(read, write)]
    fn add_asset(asset: AssetId) {
        only_owner();

        let status = storage.is_supported.get(asset).read();
        require(!status, AssetManagerErrors::AssetAlreadySupported);

        storage.is_supported.insert(asset, true);
        storage.assets.push(asset);
    }

    #[storage(read, write)]
    fn remove_asset(asset: AssetId) {
        only_owner();

        let status = storage.is_supported.get(asset).read();
        require(status, AssetManagerErrors::AssetNotSupported);

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
        require(len != 0, AssetManagerErrors::ZeroLengthVec);
        require(index <= len, AssetManagerErrors::IndexOutOfBound);

        storage.assets.get(index).unwrap().try_read()
    }

    #[storage(read)]
    fn get_count_supported_assets() -> u64 {
        storage.assets.len()
    }

    #[storage(read)]
    fn owner() -> Option<Identity> {
        storage.owner.read()
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        only_owner();
        storage.owner.write(Option::Some(new_owner));
    }

    #[storage(read, write)]
    fn renounce_ownership() {
        only_owner();
        let none: Option<Identity> = Option::None;
        storage.owner.write(none);
    }
}

#[storage(read)]
fn only_owner() {
    require(storage.owner.read().unwrap() == msg_sender().unwrap(), AssetManagerErrors::OnlyOwner);
}
