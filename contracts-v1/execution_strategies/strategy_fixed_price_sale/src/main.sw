contract;

use interfaces::{execution_strategy_interface::{ExecutionStrategy, ExecuteResult}, transfer_selector_interface::*, transfer_manager_interface::TransferManager, royalty_manager_interface::*};
use libraries::{msg_sender_address::*, ownable::{only_owner, initializer}, order_types::*, constants::*, storagemapvec::StorageMapVec};

use std::{assert::assert, block::timestamp, call_frames::contract_id, contract_id::ContractId, storage::{StorageMap, StorageVec}};

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

        if (order.side == Side::Buy) {
            let nonce = storage.user_buy_order_nonce.get(order.maker);
            storage.buy_order.insert((order.maker, nonce), Option::Some(order));
            storage.user_buy_order_nonce.insert(order.maker, nonce + 1);
        } else if (order.side == Side::Sell) {
            if (order.token_type == TokenType::Erc721) {
                let sell_order = storage.erc721_order.get((order.collection, order.token_id));
                assert(!_is_valid_order(sell_order));
            }
            let nonce = storage.user_sell_order_nonce.get(order.maker);
            storage.sell_order.insert((order.maker, nonce), Option::Some(order));
            storage.user_sell_order_nonce.insert(order.maker, nonce + 1);
        }
    }

    #[storage(read, write)]
    fn cancel_order(order: MakerOrder) {
        only_exchange();

        if (order.side == Side::Buy) {
            let none: Option<MakerOrder> = Option::None;
            storage.buy_order.insert((order.maker, order.extra_params), none);
        } else if (order.side == Side::Sell) {
            let sell_order = storage.sell_order.get((order.maker, order.extra_params)).unwrap();
            if (sell_order.token_type == TokenType::Erc721) {
                let erc721_order = storage.erc721_order.get((order.collection, order.token_id));
                assert(_is_valid_order(erc721_order));
            }
            assert(sell_order.maker == order.maker);

            let none: Option<MakerOrder> = Option::None;
            storage.sell_order.insert((order.maker, order.extra_params), none);
        }
    }

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecuteResult {
        only_exchange();


        if (order.side == Side::Buy) {
            let sell_order = storage.sell_order.get((order.maker, order.extra_params)).unwrap();
            let executable = _executable(sell_order, order);
            return executable;
        } else if (order.side == Side::Sell) {
            let buy_order = storage.buy_order.get((order.maker, order.extra_params)).unwrap();
            let executable = _executable(buy_order, order);
            return executable;
        }

        ExecuteResult {
            is_executable: false,
            collection: ZERO_CONTRACT_ID,
            token_id: 0,
            amount: 0,
        }
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

fn _executable(maker_order: MakerOrder, taker_order: TakerOrder) -> ExecuteResult {
    let executable = ExecuteResult {
        is_executable: (
            (maker_order.price == taker_order.price) &&
            (maker_order.token_id == taker_order.token_id) &&
            (maker_order.end_time >= timestamp()) &&
            (maker_order.start_time <= timestamp())
        ),
        collection: taker_order.collection,
        token_id: taker_order.token_id,
        amount: taker_order.extra_params,
    };
    executable
}
