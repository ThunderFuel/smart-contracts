contract;

dep errors;
dep events;

use errors::*;
use events::*;
use std::{
    address::Address,
    auth::*,
    call_frames::*,
    constants::*,
    context::*,
    contract_id::ContractId,
    logging::log,
    identity::Identity,
    revert::*,
    token::*,
    storage::StorageMap,
};

use interfaces::{
    asset_manager_interface::*,
    pool_interface::*,
};

use libraries::{
    msg_sender_address::*,
    ownable::*,
    constants::*,
};

storage {
    exchange: Option<ContractId> = Option::None,
    asset_manager: Option<ContractId> = Option::None,
    balance_of: StorageMap<(Identity, ContractId), u64> = StorageMap {},
}

impl Pool for Contract {
    #[storage(read, write)]
    fn initialize(exchange: ContractId, asset_manager: ContractId) {
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));

        assert(storage.exchange.is_none());

        storage.exchange = Option::Some(exchange);
        storage.asset_manager = Option::Some(asset_manager);
    }

    fn name() -> str[12] {
        "Thunder Pool"
    }

    fn symbol() -> str[4] {
        "POOL"
    }

    fn total_supply(asset: ContractId) -> u64 {
        this_balance(asset)
    }

    #[storage(read)]
    fn balance_of(account: Identity, asset: ContractId) -> u64 {
        storage.balance_of.get((account, asset))
    }

    #[storage(read, write)]
    fn deposit() {
        let asset_manager_addr = storage.asset_manager.unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);
        require(asset_manager.is_asset_supported(msg_asset_id()), Error::OnlySupportedAssets);

        let address = msg_sender().unwrap();
        let amount = msg_amount();
        let asset = msg_asset_id();
        let current_balance = storage.balance_of.get((address, asset));
        let new_balance = current_balance + amount;
        storage.balance_of.insert((address, asset), new_balance);

        log(Deposit {
            address,
            asset,
            amount
        });
    }

    #[storage(read, write)]
    fn withdraw(asset: ContractId, amount: u64) {
        let sender = msg_sender().unwrap();
        let current_balance = storage.balance_of.get((sender, asset));
        require(current_balance >= amount, Error::AmountExceedsBalance);

        let asset_manager_addr = storage.asset_manager.unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);
        require(asset_manager.is_asset_supported(msg_asset_id()), Error::OnlySupportedAssets);

        let new_balance = current_balance - amount;
        storage.balance_of.insert((sender, asset), new_balance);

        transfer(amount, asset, sender);

        log(Withdrawal {
            address: sender,
            asset,
            amount,
        });
    }

    #[storage(read, write)]
    fn withdraw_all() {
        let caller = msg_sender().unwrap();

        let asset_manager_addr = storage.asset_manager.unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);
        let supported_assets = asset_manager.get_supported_assets();

        let mut i = 0;
        let len = supported_assets.len();
        while len > i {
            let asset = supported_assets.get(i).unwrap();
            let balance = storage.balance_of.get((caller, asset));
            if (balance > 0) {
                storage.balance_of.insert((caller, asset), 0);

                transfer(balance, asset, caller);
            }

            i += 1;
        }
    }

    #[storage(read, write)]
    fn transfer_from(from: Identity, to: Identity, asset: ContractId, amount: u64) -> bool {
        let caller = get_msg_sender_contract_or_panic();
        let exchange = storage.exchange.unwrap();
        require(caller == exchange, Error::Unauthorized);

        _transfer(from, to, asset, amount);

        true
    }

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId) {
        only_owner();

        storage.asset_manager = Option::Some(asset_manager);
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

#[storage(read, write)]
fn _transfer(from: Identity, to: Identity, asset: ContractId, amount: u64) {
    require(to != ZERO_IDENTITY_ADDRESS && to != ZERO_IDENTITY_CONTRACT, Error::ZeroIdentity);

    let from_balance = storage.balance_of.get((from, asset));
    let to_balance = storage.balance_of.get((to, asset));
    require(from_balance >= amount, Error::AmountExceedsBalance);

    storage.balance_of.insert((from, asset), from_balance - amount);
    storage.balance_of.insert((to, asset), to_balance + amount);

    log(Transfer {
        from,
        to,
        asset,
        amount,
    });
}
