contract;

mod errors;

use interfaces::asset_manager_interface::AssetManager;
use libraries::{msg_sender_address::*, ownable::*};
use errors::*;

use std::{
    assert::assert,
    contract_id::AssetId,
    hash::Hash,
    revert::*,
    storage::{storage_map::*, storage_vec::*},
    vec::Vec
};

storage {
    is_initialized: bool = false,
    owner: Ownership = Ownership::uninitialized(),
    assets: StorageVec<AssetId> = StorageVec {},
    is_supported: StorageMap<AssetId, bool> = StorageMap {},
}

impl AssetManager for Contract {
    #[storage(read, write)]
    fn initialize() {
        require(
            !_is_initialized(),
            AssetManagerErrors::Initialized
        );
        storage.is_initialized.write(true);

        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
    }

    #[storage(read, write)]
    fn add_asset(asset: AssetId) {
        storage.owner.only_owner();
        require(
            !_is_asset_supported(asset),
            AssetManagerErrors::AssetAlreadySupported
        );

        storage.is_supported.insert(asset, true);
        storage.assets.push(asset);
    }

    #[storage(read, write)]
    fn remove_asset(index: u64) {
        storage.owner.only_owner();
        let asset = storage.assets.remove(index);
        storage.is_supported.insert(asset, false);
    }

    #[storage(read)]
    fn is_asset_supported(asset: AssetId) -> bool {
        _is_asset_supported(asset)
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

#[storage(read)]
fn _is_asset_supported(asset: AssetId) -> bool {
    let status = storage.is_supported.get(asset).try_read();
    match status {
        Option::Some(is_supported) => is_supported,
        Option::None => false,
    }
}
