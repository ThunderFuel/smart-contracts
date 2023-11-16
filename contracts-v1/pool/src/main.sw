contract;

mod errors;
mod events;

use errors::*;
use events::*;
use std::{
    address::Address,
    auth::*,
    call_frames::*,
    constants::*,
    context::*,
    contract_id::ContractId,
    hash::Hash,
    logging::log,
    identity::Identity,
    revert::*,
    token::*,
    storage::storage_map::*,
};

use interfaces::{
    asset_manager_interface::*,
    pool_interface::*,
};
use libraries::{
    msg_sender_address::*,
    constants::*,
    ownable::*,
};

storage {
    owner: Ownership = Ownership::uninitialized(),
    exchange: Option<ContractId> = Option::None,
    asset_manager: Option<ContractId> = Option::None,
    balance_of: StorageMap<(Identity, AssetId), u64> = StorageMap {},
}

impl Pool for Contract {
    #[storage(read, write)]
    fn initialize(exchange: ContractId, asset_manager: ContractId) {
        require(
            storage.owner.owner() == State::Uninitialized,
            PoolErrors::OwnerInitialized
        );

        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));

        require(
            storage.exchange.try_read().is_none(),
            PoolErrors::ExchangeAlreadyInitialized
        );
        storage.exchange.write(Option::Some(exchange));
        storage.asset_manager.write(Option::Some(asset_manager));
    }

    fn total_supply(asset: AssetId) -> u64 {
        this_balance(asset)
    }

    #[storage(read)]
    fn balance_of(account: Identity, asset: AssetId) -> u64 {
        _balance_of(account, asset)
    }

    #[storage(read, write), payable]
    fn deposit() {
        let asset_manager_addr = storage.asset_manager.read().unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);
        require(asset_manager.is_asset_supported(msg_asset_id()), PoolErrors::AssetNotSupported);

        let address = msg_sender().unwrap();
        let amount = msg_amount();
        let asset = msg_asset_id();

        let current_balance = _balance_of(address, asset);
        let new_balance = current_balance + amount;
        storage.balance_of.insert((address, asset), new_balance);

        log(Deposit {
            address,
            asset,
            amount
        });
    }

    #[storage(read, write)]
    fn withdraw(asset: AssetId, amount: u64) {
        let sender = msg_sender().unwrap();
        let current_balance = _balance_of(sender, asset);
        require(current_balance >= amount, PoolErrors::AmountHigherThanBalance);

        let asset_manager_addr = storage.asset_manager.read().unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);
        require(asset_manager.is_asset_supported(asset), PoolErrors::AssetNotSupported);

        let new_balance = current_balance - amount;
        storage.balance_of.insert((sender, asset), new_balance);

        transfer(sender, asset, amount);

        log(Withdrawal {
            address: sender,
            asset,
            amount,
        });
    }

    #[storage(read, write)]
    fn withdraw_all() {
        let caller = msg_sender().unwrap();

        let asset_manager_addr = storage.asset_manager.read().unwrap().into();
        let asset_manager = abi(AssetManager, asset_manager_addr);

        let mut i = 0;
        let len = asset_manager.get_count_supported_assets();
        while len > i {
            let asset = asset_manager.get_supported_asset(i).unwrap();
            let balance = _balance_of(caller, asset);
            if (balance > 0) {
                storage.balance_of.insert((caller, asset), 0);
                transfer(caller, asset, balance);
            }

            i += 1;
        }
    }

    #[storage(read, write)]
    fn transfer_from(from: Identity, to: Identity, asset: AssetId, amount: u64) -> bool {
        let caller = get_msg_sender_contract_or_panic();
        let exchange = storage.exchange.read().unwrap();
        require(caller == exchange, PoolErrors::CallerMustBeTheExchange);

        _transfer(from, to, asset, amount);

        true
    }

    /// Setters
    #[storage(read, write)]
    fn set_exchange(exchange_contract: ContractId) {
        storage.owner.only_owner();

        storage.exchange.write(Option::Some(exchange_contract));
    }

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId) {
        storage.owner.only_owner();

        storage.asset_manager.write(Option::Some(asset_manager));
    }

    /// Getters
    #[storage(read)]
    fn get_asset_manager() -> ContractId {
        storage.asset_manager.read().unwrap()
    }

    #[storage(read)]
    fn get_exchange() -> ContractId {
        storage.exchange.read().unwrap()
    }

    /// Ownable
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
fn _owner() -> Option<Identity> {
    match storage.owner.owner() {
        State::Initialized(owner) => Option::Some(owner),
        _ => Option::None,
    }
}

#[storage(read)]
fn _balance_of(account: Identity, asset: AssetId) -> u64 {
    let status = storage.balance_of.get((account, asset)).try_read();
    match status {
        Option::Some(balance) => balance,
        Option::None => 0,
    }
}

#[storage(read, write)]
fn _transfer(from: Identity, to: Identity, asset: AssetId, amount: u64) {
    require(
        to != ZERO_IDENTITY_ADDRESS &&
        to != ZERO_IDENTITY_CONTRACT,
        PoolErrors::IdentityMustBeNonZero
    );

    let from_balance = _balance_of(from, asset);
    let to_balance = _balance_of(to, asset);
    require(from_balance >= amount, PoolErrors::AmountHigherThanBalance);

    storage.balance_of.insert((from, asset), from_balance - amount);
    storage.balance_of.insert((to, asset), to_balance + amount);

    log(Transfer {
        from,
        to,
        asset,
        amount,
    });
}

