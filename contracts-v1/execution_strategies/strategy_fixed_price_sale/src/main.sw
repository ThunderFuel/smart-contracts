contract;

use interfaces::{execution_strategy_interface::{ExecutionStrategy}, transfer_selector_interface::*, transfer_manager_interface::TransferManager, royalty_manager_interface::*};
use libraries::{msg_sender_address::*, ownable::{only_owner, initializer}, order_types::*, constants::*, data_structures::fixed_price_sale_data_structures::ExecutionResult};

use std::{assert::assert, block::timestamp, call_frames::contract_id, contract_id::ContractId, revert::revert, storage::{StorageMap, StorageVec}};

storage {
    protocol_fee: u64 = 0,
    exchange: Option<ContractId> = Option::None,

    erc721_order: StorageMap<(ContractId, u64), Option<MakerOrder>> = StorageMap {},

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
        let caller = get_msg_sender_address_or_panic();
        initializer(caller);

        assert(storage.exchange.is_none());
        storage.exchange = Option::Some(exchange);
    }

    #[storage(read, write)]
    fn place_order(order: MakerOrder) {
        only_exchange();

        if (order.token_type == TokenType::Erc721) {
            assert(order.amount == 1);
        }

        match order.side {
            Side::Buy => _place_or_update_buy_order(order),
            Side::Sell => _place_or_update_sell_order(order),
        }
    }

    #[storage(read, write)]
    fn cancel_order(order: MakerOrder) {
        only_exchange();

        match order.side {
            Side::Buy => _cancel_buy_order(order),
            Side::Sell => _cancel_sell_order(order),
        }
    }

    #[storage(read, write)]
    fn cancel_all_orders(maker: Address) {
        only_exchange();

        _cancel_all_buy_orders(maker);
        _cancel_all_sell_orders(maker);
    }

    #[storage(read, write)]
    fn cancel_all_orders_by_side(maker: Address, side: Side) {
        only_exchange();

        match side {
            Side::Buy => _cancel_all_buy_orders(maker),
            Side::Sell => _cancel_all_sell_orders(maker),
        }
    }

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecutionResult {
        only_exchange();

        let maker_order = match order.side {
            Side::Buy => storage.sell_order.get((order.maker, order.nonce)),
            Side::Sell => storage.buy_order.get((order.maker, order.nonce)),
        };

        // TODO: consider more validation
        assert(_is_valid_order(maker_order));

        let execution_result = ExecutionResult::new(maker_order.unwrap(), order);

        match execution_result.is_executable {
            true => _execute_order(maker_order.unwrap()),
            _ => revert(0),
        }

        execution_result
    }

    #[storage(read, write)]
    fn set_protocol_fee(fee: u64) {
        only_owner();

        assert(fee <= 500);

        storage.protocol_fee = fee;
    }

    #[storage(read)]
    fn get_protocol_fee() -> u64 {
        storage.protocol_fee
    }
}

#[storage(read)]
fn only_exchange() {
    let caller = get_msg_sender_contract_or_panic();
    let exchange = storage.exchange.unwrap();
    assert(caller == exchange);
}

fn _is_valid_order(maker_order: Option<MakerOrder>) -> bool {
    if (maker_order.is_some()) {
        let end_time = maker_order.unwrap().end_time;
        if (end_time >= timestamp()) {
            return true;
        }
        return false;
    }
    return false;
}

#[storage(read, write)]
fn _place_or_update_buy_order(order: MakerOrder) {
    let nonce = storage.user_buy_order_nonce.get(order.maker);
    let min_nonce = storage.user_min_buy_order_nonce.get(order.maker);

    if (order.nonce == nonce + 1) {
        // Place buy order
        _place_buy_order(order);
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update buy order
        _update_buy_order(order);
    } else {
        revert(0);
    }
}

#[storage(read, write)]
fn _place_or_update_sell_order(order: MakerOrder) {
    let nonce = storage.user_sell_order_nonce.get(order.maker);
    let min_nonce = storage.user_min_sell_order_nonce.get(order.maker);

    if (order.nonce == nonce + 1) {
        // Place sell order
        _place_sell_order(order);
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update sell order
        _update_sell_order(order);
    } else {
        revert(0);
    }
}

#[storage(read, write)]
fn _place_buy_order(order: MakerOrder) {
    let nonce = storage.user_buy_order_nonce.get(order.maker);
    storage.user_buy_order_nonce.insert(order.maker, nonce + 1);
    storage.buy_order.insert((order.maker, nonce + 1), Option::Some(order));
}

#[storage(read, write)]
fn _place_sell_order(order: MakerOrder) {
    if (order.token_type == TokenType::Erc721) {
        let sell_order = storage.erc721_order.get((order.collection, order.token_id));
        assert(!_is_valid_order(sell_order));
    }
    let nonce = storage.user_sell_order_nonce.get(order.maker);
    storage.user_sell_order_nonce.insert(order.maker, nonce + 1);
    storage.sell_order.insert((order.maker, nonce + 1), Option::Some(order));
}

#[storage(read, write)]
fn _update_buy_order(updated_buy_order: MakerOrder) {
    let buy_order = storage.buy_order.get((updated_buy_order.maker, updated_buy_order.nonce));
    _validate_updated_order(buy_order, updated_buy_order);

    storage.buy_order.insert((updated_buy_order.maker, updated_buy_order.nonce), Option::Some(updated_buy_order));
}

#[storage(read, write)]
fn _update_sell_order(updated_sell_order: MakerOrder) {
    let sell_order = storage.sell_order.get((updated_sell_order.maker, updated_sell_order.nonce));
    _validate_updated_order(sell_order, updated_sell_order);

    storage.sell_order.insert((updated_sell_order.maker, updated_sell_order.nonce), Option::Some(updated_sell_order));
}

fn _validate_updated_order(order: Option<MakerOrder>, updated_order: MakerOrder) {
    assert(
        (order.unwrap().maker == updated_order.maker) &&
        (order.unwrap().collection == updated_order.collection) &&
        (order.unwrap().token_id == updated_order.token_id) &&
        _is_valid_order(order)
    );
}

#[storage(read, write)]
fn _cancel_buy_order(order: MakerOrder) {
    let buy_order = storage.buy_order.get((order.maker, order.nonce));
    _validate_canceled_order(order, buy_order, Side::Buy);

    let none: Option<MakerOrder> = Option::None;
    storage.buy_order.insert((order.maker, order.nonce), none);
}

#[storage(read, write)]
fn _cancel_sell_order(order: MakerOrder) {
    let sell_order = storage.sell_order.get((order.maker, order.nonce));
    _validate_canceled_order(order, sell_order, Side::Sell);

    let none: Option<MakerOrder> = Option::None;
    storage.sell_order.insert((order.maker, order.nonce), none);
}

#[storage(read)]
fn _validate_canceled_order(order: MakerOrder, canceled_order: Option<MakerOrder>, side: Side) {
    let nonce = match side {
        Side::Buy => storage.user_buy_order_nonce.get(order.maker),
        Side::Sell => storage.user_sell_order_nonce.get(order.maker),
    };

    let min_nonce = match side {
        Side::Buy => storage.user_min_buy_order_nonce.get(order.maker),
        Side::Sell => storage.user_min_sell_order_nonce.get(order.maker),
    };

    assert(
        (order.maker == canceled_order.unwrap().maker) &&
        (order.nonce <= nonce) &&
        (min_nonce < order.nonce) &&
        _is_valid_order(canceled_order)
    );
}

#[storage(read, write)]
fn _cancel_all_buy_orders(maker: Address) {
    let min_nonce = storage.user_min_buy_order_nonce.get(maker);
    let current_nonce = storage.user_buy_order_nonce.get(maker);
    assert(min_nonce < current_nonce);

    storage.user_min_buy_order_nonce.insert(maker, current_nonce);
}

#[storage(read, write)]
fn _cancel_all_sell_orders(maker: Address) {
    let min_nonce = storage.user_min_sell_order_nonce.get(maker);
    let current_nonce = storage.user_sell_order_nonce.get(maker);
    assert(min_nonce < current_nonce);

    storage.user_min_sell_order_nonce.insert(maker, current_nonce);
}

#[storage(write)]
fn _execute_order(maker_order: MakerOrder) {
    let none: Option<MakerOrder> = Option::None;

    if (maker_order.token_type == TokenType::Erc721) {
        storage.erc721_order.insert((maker_order.collection, maker_order.token_id), none);
    }

    match maker_order.side {
        Side::Buy => storage.buy_order.insert((maker_order.maker, maker_order.nonce), none),
        Side::Sell => storage.sell_order.insert((maker_order.maker, maker_order.nonce), none),
    }
}
