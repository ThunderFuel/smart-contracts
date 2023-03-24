contract;

use interfaces::{
    execution_strategy_interface::ExecutionStrategy,
    erc165_interface::IERC165,
    erc721_interface::IERC721,
    thunder_exchange_interface::ThunderExchange,
    transfer_selector_interface::*,
    transfer_manager_interface::TransferManager,
    royalty_manager_interface::*
};

use libraries::{
    msg_sender_address::*,
    order_types::*,
    ownable::*,
    constants::*,
    data_structures::{execution_result::*, fixed_price_sale_data_structures::*}
};

use std::{
    block::timestamp,
    call_frames::contract_id,
    contract_id::ContractId,
    revert::*,
    storage::StorageMap
};

storage {
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
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));

        require(storage.exchange.is_none(), "Strategy: Exchange already initialized");
        storage.exchange = Option::Some(exchange);
    }

    #[storage(read, write)]
    fn place_order(order: MakerOrder) {
        only_exchange();

        match order.side {
            Side::Buy => {
                _place_or_update_buy_order(order)
            },
            Side::Sell => {
                let token_type = _get_token_type(order.collection);
                _validate_token_balance_and_approval(order, token_type);
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
                let buy_order = storage.buy_order
                    .get((maker, nonce))
                    .unwrap_or(Option::None);
                require(
                    _is_valid_order(buy_order),
                    "Order: Cancelled or expired"
                );
                let none: Option<MakerOrder> = Option::None;
                storage.buy_order.insert((maker, nonce), none);
            },
            Side::Sell => {
                let sell_order = storage.sell_order
                    .get((maker, nonce))
                    .unwrap_or(Option::None);
                require(
                    _is_valid_order(sell_order),
                    "Order: Cancelled or expired"
                );
                let none: Option<MakerOrder> = Option::None;
                storage.sell_order.insert((maker, nonce), none);
            },
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
            Side::Buy => storage.sell_order
                .get((order.maker, order.nonce))
                .unwrap_or(Option::None),
            Side::Sell => storage.buy_order
                .get((order.maker, order.nonce))
                .unwrap_or(Option::None),
        };

        // TODO: consider more validation
        if (!_is_valid_order(maker_order)) {
            return ExecutionResult {
                is_executable: false,
                collection: ZERO_CONTRACT_ID,
                token_id: 0,
                amount: 0,
                payment_asset: ZERO_CONTRACT_ID,
            }
        }

        let execution_result = ExecutionResult::new(maker_order.unwrap(), order);
        if (execution_result.is_executable) {
            _execute_order(maker_order.unwrap());
        }

        execution_result
    }

    #[storage(read, write)]
    fn set_protocol_fee(fee: u64) {
        only_owner();

        require(fee <= 500, "Strategy: Fee too high");

        storage.protocol_fee = fee;
    }

    #[storage(read)]
    fn get_protocol_fee() -> u64 {
        storage.protocol_fee
    }

    #[storage(read)]
    fn get_exchange() -> ContractId {
        storage.exchange.unwrap()
    }

    #[storage(read)]
    fn get_maker_order_of_user(
        user: Address,
        nonce: u64,
        side: Side
    ) -> Option<MakerOrder> {
        match side {
            Side::Buy => storage.buy_order
                .get((user, nonce))
                .unwrap_or(Option::None),
            Side::Sell => storage.sell_order
                .get((user, nonce))
                .unwrap_or(Option::None),
        }
    }

    #[storage(read)]
    fn is_valid_order(
        maker: Address,
        nonce: u64,
        side: Side
    ) -> bool {
        let maker_order = match side {
            Side::Buy => storage.buy_order
                .get((maker, nonce))
                .unwrap_or(Option::None),
            Side::Sell => storage.sell_order
                .get((maker, nonce))
                .unwrap_or(Option::None),
        };
        _is_valid_order(maker_order)
    }

    #[storage(read)]
    fn get_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => storage.user_buy_order_nonce
                .get(user)
                .unwrap_or(0),
            Side::Sell => storage.user_sell_order_nonce
                .get(user)
                .unwrap_or(0),
        }
    }

    #[storage(read)]
    fn get_min_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => storage.user_min_buy_order_nonce
                .get(user)
                .unwrap_or(0),
            Side::Sell => storage.user_min_sell_order_nonce
                .get(user)
                .unwrap_or(0),
        }
    }

    /// Ownable ///

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

#[storage(read)]
fn only_exchange() {
    let caller = get_msg_sender_contract_or_panic();
    let exchange = storage.exchange.unwrap();
    require(caller == exchange, "Strategy: Caller must be the exchange");
}

fn _get_token_type(collection: ContractId) -> TokenType {
    let mut token_type = TokenType::Other;
    let ERC165 = abi(IERC165, collection.into());
    if (ERC165.supportsInterface(ERC721_INTERFACE_ID)) {
        token_type = TokenType::Erc721;
    } else if (ERC165.supportsInterface(ERC1155_INTERFACE_ID)) {
        token_type = TokenType::Erc1155;
    }

    token_type
}

#[storage(read)]
fn _is_valid_order(maker_order: Option<MakerOrder>) -> bool {
    if (maker_order.is_some()) {
        let unwraped_order = maker_order.unwrap();
        let end_time = unwraped_order.end_time;
        let nonce = match unwraped_order.side {
            Side::Buy => storage.user_buy_order_nonce
                .get(unwraped_order.maker)
                .unwrap_or(0),
            Side::Sell => storage.user_sell_order_nonce
                .get(unwraped_order.maker)
                .unwrap_or(0),
        };
        let min_nonce = match unwraped_order.side {
            Side::Buy => storage.user_min_buy_order_nonce
                .get(unwraped_order.maker)
                .unwrap_or(0),
            Side::Sell => storage.user_min_sell_order_nonce
                .get(unwraped_order.maker)
                .unwrap_or(0),
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

#[storage(read)]
fn _validate_token_balance_and_approval(order: MakerOrder, token_type: TokenType) {
    match token_type {
        TokenType::Erc721 => _validate_erc721_token_balance_and_approval(order),
        TokenType::Erc1155 => _validate_erc1155_token_balance_and_approval(order),
        _ => revert(31),
    }
}

#[storage(read)]
fn _validate_erc721_token_balance_and_approval(order: MakerOrder) {
    let exchange = abi(ThunderExchange, storage.exchange.unwrap().into());
    let transfer_selector_addr = exchange.get_transfer_selector();
    let transfer_selector = abi(TransferSelector, transfer_selector_addr.into());
    let transfer_manager_addr = transfer_selector.get_transfer_manager_for_token(order.collection).unwrap();

    require(order.amount == 1, "Order: Amount invalid");

    let erc721 = abi(IERC721, order.collection.into());
    let status = erc721.isApprovedForAll(Identity::Address(order.maker), Identity::ContractId(transfer_manager_addr));
    require(status, "Token: Not approved for all");

    let token_owner = erc721.ownerOf(order.token_id);
    require(token_owner == Identity::Address(order.maker), "Token: Caller not owner");
}

fn _validate_erc1155_token_balance_and_approval(order: MakerOrder) {
    // TODO
}

#[storage(read, write)]
fn _place_or_update_buy_order(order: MakerOrder) {
    let nonce = storage.user_sell_order_nonce
        .get(order.maker)
        .unwrap_or(0);
    let min_nonce = storage.user_min_sell_order_nonce
        .get(order.maker)
        .unwrap_or(0);

    if (order.nonce == nonce + 1) {
        // Place buy order
        let nonce = storage.user_buy_order_nonce
            .get(order.maker)
            .unwrap_or(0);
        storage.user_buy_order_nonce.insert(order.maker, nonce + 1);
        storage.buy_order.insert((order.maker, nonce + 1), Option::Some(order));
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update buy order
        let buy_order = storage.buy_order
            .get((order.maker, order.nonce))
            .unwrap_or(Option::None);
        _validate_updated_order(buy_order, order);
        storage.buy_order.insert((order.maker, order.nonce), Option::Some(order));
    } else {
        revert(112);
    }
}

#[storage(read, write)]
fn _place_or_update_sell_order(order: MakerOrder) {
    let nonce = storage.user_sell_order_nonce
        .get(order.maker)
        .unwrap_or(0);
    let min_nonce = storage.user_min_sell_order_nonce
        .get(order.maker)
        .unwrap_or(0);

    if (order.nonce == nonce + 1) {
        // Place sell order
        let nonce = storage.user_sell_order_nonce
            .get(order.maker)
            .unwrap_or(0);
        storage.user_sell_order_nonce.insert(order.maker, nonce + 1);
        storage.sell_order.insert((order.maker, nonce + 1), Option::Some(order));
    } else if ((min_nonce < order.nonce) && (order.nonce <= nonce)) {
        // Update sell order
        let sell_order = storage.sell_order
            .get((order.maker, order.nonce))
            .unwrap_or(Option::None);
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
        "Order: Mismatched to update"
    );
}

#[storage(read, write)]
fn _cancel_all_buy_orders(maker: Address) {
    let min_nonce = storage.user_min_sell_order_nonce
        .get(maker)
        .unwrap_or(0);
    let current_nonce = storage.user_sell_order_nonce
        .get(maker)
        .unwrap_or(0);
    require(min_nonce < current_nonce, "Cancel: Min nonce higher than current");

    storage.user_min_buy_order_nonce.insert(maker, current_nonce);
}

#[storage(read, write)]
fn _cancel_all_sell_orders(maker: Address) {
    let min_nonce = storage.user_min_sell_order_nonce
        .get(maker)
        .unwrap_or(0);
    let current_nonce = storage.user_sell_order_nonce
        .get(maker)
        .unwrap_or(0);
    require(min_nonce < current_nonce, "Cancel: Min nonce higher than current");

    storage.user_min_sell_order_nonce.insert(maker, current_nonce);
}

#[storage(write)]
fn _execute_order(maker_order: MakerOrder) {
    let none: Option<MakerOrder> = Option::None;
    match maker_order.side {
        Side::Buy => storage.buy_order.insert((maker_order.maker, maker_order.nonce), none),
        Side::Sell => storage.sell_order.insert((maker_order.maker, maker_order.nonce), none),
    }
}
