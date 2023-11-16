contract;

mod errors;

use interfaces::{
    execution_strategy_interface::ExecutionStrategy,
    thunder_exchange_interface::ThunderExchange,
    transfer_manager_interface::TransferManager,
    royalty_manager_interface::*
};
use libraries::{
    msg_sender_address::*,
    order_types::*,
    ownable::*,
    constants::*,
    execution_result::*
};
use errors::*;

use std::{
    block::timestamp,
    call_frames::contract_id,
    contract_id::ContractId,
    hash::Hash,
    revert::*,
    storage::storage_map::*
};

storage {
    owner: Ownership = Ownership::uninitialized(),
    protocol_fee: u64 = 0,
    exchange: Option<ContractId> = Option::None,

    sell_order: StorageMap<(Address, u64), Option<MakerOrder>> = StorageMap {},
    buy_order: StorageMap<(Address, u64), Option<MakerOrder>> = StorageMap {},

    user_sell_order_nonce: StorageMap<Address, u64> = StorageMap {},
    user_buy_order_nonce: StorageMap<Address, u64> = StorageMap {},

    user_min_sell_order_nonce: StorageMap<Address, u64> = StorageMap {},
    user_min_buy_order_nonce: StorageMap<Address, u64> = StorageMap {},
}

impl ExecutionStrategy for Contract {
    #[storage(read, write)]
    fn initialize(exchange: ContractId) {
        require(
            storage.owner.owner() == State::Uninitialized,
            StrategyFixedPriceErrors::OwnerInitialized
        );
        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));

        require(
            storage.exchange.try_read().is_none(),
            StrategyFixedPriceErrors::ExchangeAlreadyInitialized
        );
        storage.exchange.write(Option::Some(exchange));
    }

    #[storage(read, write)]
    fn place_order(order: MakerOrder) {
        only_exchange();

        match order.side {
            Side::Buy => {
                _place_or_update_buy_order(order)
            },
            Side::Sell => {
                //_validate_token_balance_and_approval(order, token_type);
                _place_or_update_sell_order(order)
            }
        }
    }

    #[storage(read, write)]
    fn cancel_order(
        maker: Address,
        nonce: u64,
        side: Side
    ) {
        only_exchange();

        match side {
            Side::Buy => {
                let none: Option<MakerOrder> = Option::None;
                storage.buy_order.insert((maker, nonce), none);
            },
            Side::Sell => {
                let none: Option<MakerOrder> = Option::None;
                storage.sell_order.insert((maker, nonce), none);
            },
        }
    }

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecutionResult {
        only_exchange();

        let maker_order = match order.side {
            Side::Buy => _sell_order(order.maker, order.nonce),
            Side::Sell => _buy_order(order.maker, order.nonce),
        };

        // TODO: consider more validation
        if (!_is_valid_order(maker_order)) {
            return ExecutionResult {
                is_executable: false,
                collection: ZERO_CONTRACT_ID,
                token_id: ZERO_B256,
                amount: 0,
                payment_asset: ZERO_ASSET_ID,
            }
        }

        let execution_result = ExecutionResult::s1(maker_order.unwrap(), order);
        if (execution_result.is_executable) {
            _execute_order(maker_order.unwrap());
        }

        execution_result
    }

    #[storage(read, write)]
    fn set_exchange(exchange_contract: ContractId) {
        storage.owner.only_owner();

        storage.exchange.write(Option::Some(exchange_contract));
    }

    #[storage(read, write)]
    fn set_protocol_fee(fee: u64) {
        storage.owner.only_owner();

        require(fee <= 500, StrategyFixedPriceErrors::FeeTooHigh);

        storage.protocol_fee.write(fee);
    }

    #[storage(read)]
    fn get_protocol_fee() -> u64 {
        storage.protocol_fee.read()
    }

    #[storage(read)]
    fn get_exchange() -> ContractId {
        storage.exchange.read().unwrap()
    }

    #[storage(read)]
    fn get_maker_order_of_user(
        user: Address,
        nonce: u64,
        side: Side
    ) -> Option<MakerOrder> {
        match side {
            Side::Buy => _buy_order(user, nonce),
            Side::Sell => _sell_order(user, nonce),
        }
    }

    #[storage(read)]
    fn is_valid_order(
        maker: Address,
        nonce: u64,
        side: Side
    ) -> bool {
        let maker_order = match side {
            Side::Buy => _buy_order(maker, nonce),
            Side::Sell => _sell_order(maker, nonce),
        };
        _is_valid_order(maker_order)
    }

    #[storage(read)]
    fn get_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => _user_buy_order_nonce(user),
            Side::Sell => _user_sell_order_nonce(user),
        }
    }

    #[storage(read)]
    fn get_min_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => _user_min_buy_order_nonce(user),
            Side::Sell => _user_min_sell_order_nonce(user),
        }
    }

    /// Ownable ///
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
fn only_exchange() {
    let caller = get_msg_sender_contract_or_panic();
    let exchange = storage.exchange.read().unwrap();
    require(caller == exchange, StrategyFixedPriceErrors::CallerMustBeTheExchange);
}

#[storage(read)]
fn _sell_order(address: Address, nonce: u64) -> Option<MakerOrder> {
    let status = storage.sell_order.get((address, nonce)).try_read();
    match status {
        Option::Some(order) => order,
        Option::None => Option::None,
    }
}

#[storage(read)]
fn _buy_order(address: Address, nonce: u64) -> Option<MakerOrder> {
    let status = storage.buy_order.get((address, nonce)).try_read();
    match status {
        Option::Some(order) => order,
        Option::None => Option::None,
    }
}

#[storage(read)]
fn _user_sell_order_nonce(address: Address) -> u64 {
    let status = storage.user_sell_order_nonce.get(address).try_read();
    match status {
        Option::Some(nonce) => nonce,
        Option::None => 0,
    }
}

#[storage(read)]
fn _user_buy_order_nonce(address: Address) -> u64 {
    let status = storage.user_buy_order_nonce.get(address).try_read();
    match status {
        Option::Some(nonce) => nonce,
        Option::None => 0,
    }
}

#[storage(read)]
fn _user_min_sell_order_nonce(address: Address) -> u64 {
    let status = storage.user_min_sell_order_nonce.get(address).try_read();
    match status {
        Option::Some(nonce) => nonce,
        Option::None => 0,
    }
}

#[storage(read)]
fn _user_min_buy_order_nonce(address: Address) -> u64 {
    let status = storage.user_min_buy_order_nonce.get(address).try_read();
    match status {
        Option::Some(nonce) => nonce,
        Option::None => 0,
    }
}

#[storage(read)]
fn _is_valid_order(maker_order: Option<MakerOrder>) -> bool {
    if (maker_order.is_some()) {
        let unwraped_order = maker_order.unwrap();
        let end_time = unwraped_order.end_time;

        let nonce = match unwraped_order.side {
            Side::Buy => _user_buy_order_nonce(unwraped_order.maker),
            Side::Sell => _user_sell_order_nonce(unwraped_order.maker),
        };

        let min_nonce = match unwraped_order.side {
            Side::Buy => _user_min_buy_order_nonce(unwraped_order.maker),
            Side::Sell => _user_min_sell_order_nonce(unwraped_order.maker),
        };

        let status = (
            (end_time >= timestamp()) &&
            (unwraped_order.nonce <= nonce) &&
            (min_nonce < unwraped_order.nonce)
        );
        return status;
    }
    return false;
}

#[storage(read, write)]
fn _place_or_update_buy_order(order: MakerOrder) {
    let nonce = _user_buy_order_nonce(order.maker);
    let min_nonce = _user_min_buy_order_nonce(order.maker);

    if (order.nonce == nonce + 1) {
        // Place buy order
        storage.user_buy_order_nonce.insert(order.maker, order.nonce);
        storage.buy_order.insert((order.maker, order.nonce), Option::Some(order));
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update buy order
        let buy_order = _buy_order(order.maker, order.nonce);
        _validate_updated_order(buy_order, order);
        storage.buy_order.insert((order.maker, order.nonce), Option::Some(order));
    } else {
        revert(112);
    }
}

#[storage(read, write)]
fn _place_or_update_sell_order(order: MakerOrder) {
    let nonce = _user_sell_order_nonce(order.maker);
    let min_nonce = _user_min_sell_order_nonce(order.maker);

    if (order.nonce == nonce + 1) {
        // Place sell order
        storage.user_sell_order_nonce.insert(order.maker, order.nonce);
        storage.sell_order.insert((order.maker, order.nonce), Option::Some(order));
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update sell order
        let sell_order = _sell_order(order.maker, order.nonce);
        _validate_updated_order(sell_order, order);
        storage.sell_order.insert((order.maker, order.nonce), Option::Some(order));
    } else {
        revert(113);
    }
}

#[storage(read)]
fn _validate_updated_order(order: Option<MakerOrder>, updated_order: MakerOrder) {
    require(
        (order.unwrap().maker == updated_order.maker) &&
        (order.unwrap().collection == updated_order.collection) &&
        (order.unwrap().token_id == updated_order.token_id) &&
        (order.unwrap().payment_asset == updated_order.payment_asset) &&
        _is_valid_order(order),
        StrategyFixedPriceErrors::OrderMismatchedToUpdate
    );
}

#[storage(write)]
fn _execute_order(maker_order: MakerOrder) {
    let none: Option<MakerOrder> = Option::None;
    match maker_order.side {
        Side::Buy => storage.buy_order.insert((maker_order.maker, maker_order.nonce), none),
        Side::Sell => storage.sell_order.insert((maker_order.maker, maker_order.nonce), none),
    }
}
