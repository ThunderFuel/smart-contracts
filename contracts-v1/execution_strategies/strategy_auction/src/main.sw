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
    execution_result::*,
    msg_sender_address::*,
    order_types::*,
    ownable::*,
    constants::*,
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

    auction_item: StorageMap<(ContractId, u64), Option<MakerOrder>> = StorageMap {},
    auction_highest_bid: StorageMap<(ContractId, u64), Option<MakerOrder>> = StorageMap {},

    sell_order: StorageMap<(Address, u64), Option<MakerOrder>> = StorageMap {},
    user_sell_order_nonce: StorageMap<Address, u64> = StorageMap {},
    user_min_sell_order_nonce: StorageMap<Address, u64> = StorageMap {},
}

impl ExecutionStrategy for Contract {
    #[storage(read, write)]
    fn initialize(exchange: ContractId) {
        let caller = get_msg_sender_address_or_panic();
        set_ownership(Identity::Address(caller));

        require(
            storage.exchange.is_none(),
            "Strategy: Exchange already initialized"
        );
        storage.exchange = Option::Some(exchange);
    }

    #[storage(read, write)]
    fn place_order(order: MakerOrder) {
        only_exchange();

        match order.side {
            Side::Buy => {
                _place_buy_order(order)
            },
            Side::Sell => {
                let token_type = _get_token_type(order.collection);
                _validate_token_balance_and_approval(order, token_type);
                _place_sell_order(order)
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
            Side::Buy => (),
            Side::Sell => {
                let sell_order = storage.sell_order.get((maker, nonce)).unwrap_or(Option::None);
                require(
                    _is_valid_order(sell_order),
                    "Order: Cancelled or expired"
                );
                let none: Option<MakerOrder> = Option::None;
                storage.sell_order.insert((maker, nonce), none);
                storage.auction_item.insert(
                    (
                        sell_order.unwrap().collection,
                        sell_order.unwrap().token_id
                    ),
                    none
                );
            },
        }
    }

    #[storage(read, write)]
    fn cancel_all_orders(maker: Address) {
        only_exchange();

        _cancel_all_sell_orders(maker);
    }

    #[storage(read, write)]
    fn cancel_all_orders_by_side(maker: Address, side: Side) {
        only_exchange();

        _cancel_all_sell_orders(maker)
    }

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecutionResult {
        only_exchange();

        let auction = storage.auction_item
            .get((order.collection, order.token_id))
            .unwrap_or(Option::None);
        let highest_bid = match order.side {
            Side::Buy => Option::None,
            Side::Sell => storage.auction_highest_bid
                .get((order.collection, order.token_id))
                .unwrap_or(Option::None),
            //VALIDATE OWNER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        };

        if (highest_bid.is_none()) {
            return ExecutionResult {
                is_executable: false,
                collection: ZERO_CONTRACT_ID,
                token_id: 0,
                amount: 0,
                payment_asset: ZERO_CONTRACT_ID,
            }
        }

        let execution_result = ExecutionResult::s2(auction.unwrap(), highest_bid.unwrap());
        if (execution_result.is_executable) {
            _execute_order(auction.unwrap());
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
            Side::Buy => Option::None,
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
            Side::Buy => Option::None,
            Side::Sell => storage.sell_order
                .get((maker, nonce))
                .unwrap_or(Option::None),
        };
        _is_valid_order(maker_order)
    }

    #[storage(read)]
    fn get_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => 0,
            Side::Sell => storage.user_sell_order_nonce
                .get(user)
                .unwrap_or(0),
        }
    }

    #[storage(read)]
    fn get_min_order_nonce_of_user(user: Address, side: Side) -> u64 {
        match side {
            Side::Buy => 0,
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
    if (ERC165.supports_interface(ERC721_INTERFACE_ID)) {
        token_type = TokenType::Erc721;
    } else if (ERC165.supports_interface(ERC1155_INTERFACE_ID)) {
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
            Side::Buy => 0,
            Side::Sell => storage.user_sell_order_nonce
                .get(unwraped_order.maker)
                .unwrap_or(0),
        };
        let min_nonce = match unwraped_order.side {
            Side::Buy => 0,
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
        TokenType::Erc1155 => revert(30),
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
    let status = erc721.is_approved_for_all(Identity::ContractId(transfer_manager_addr), Identity::Address(order.maker));
    require(status, "Token: Not approved for all");

    let token_owner = erc721.owner_of(order.token_id).unwrap();
    require(token_owner == Identity::Address(order.maker), "Token: Caller not owner");
}

#[storage(read, write)]
fn _place_buy_order(order: MakerOrder) {
    let auction = storage.auction_item
        .get((order.collection, order.token_id))
        .unwrap_or(Option::None);
    let highest_bid = storage.auction_highest_bid
        .get((order.collection, order.token_id))
        .unwrap_or(Option::None);

    require(
        _is_valid_order(auction),
        "Auction: Item is not on auction"
    );
    require(
        order.maker != auction.unwrap().maker,
        "Auction: Owner can not place a bid"
    );

    match highest_bid {
        Option::Some(bid) => {
            require(
                order.price >= ((bid.price * 1100) / 1000),
                "Auction: Bid must be %10 higher than the previous one"
            );
        },
        Option::None => {
            require(order.price > 0, "Auction: Bid must be non-zero");

            let starting_price = auction.unwrap().extra_params.extra_u64_param;
            if (starting_price > 0) {
                require(
                    order.price >= starting_price,
                    "Auction: Bid must be higher than starting price"
                );
            }
        },
    }

    if (auction.unwrap().end_time - timestamp() <= 600) {
        let mut unwrapped_auction = auction.unwrap();
        unwrapped_auction.end_time += 600;
        storage.auction_item.insert((order.collection, order.token_id), Option::Some(unwrapped_auction));
    }

    storage.auction_highest_bid.insert((order.collection, order.token_id), Option::Some(order));
}

#[storage(read, write)]
fn _place_sell_order(order: MakerOrder) {
    let nonce = storage.user_sell_order_nonce
        .get(order.maker)
        .unwrap_or(0);

    require(
        !_is_valid_order(
            storage.auction_item
                .get((order.collection, order.token_id))
                .unwrap_or(Option::None)
        ),
        "Auction: Item is already on auction"
    );

    if (order.nonce == nonce + 1) {
        // Place sell order
        let nonce = storage.user_sell_order_nonce
            .get(order.maker)
            .unwrap_or(0);
        storage.user_sell_order_nonce.insert(order.maker, nonce + 1);
        storage.sell_order.insert((order.maker, nonce + 1), Option::Some(order));
        storage.auction_item.insert((order.collection, order.token_id), Option::Some(order));
    } else {
        revert(113);
    }
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
    // do like this ---> require(min_nonce <= current_nonce, "Cancel: Min nonce higher than current");

    storage.user_min_sell_order_nonce.insert(maker, current_nonce);
}

#[storage(write)]
fn _execute_order(maker_order: MakerOrder) {
    let none: Option<MakerOrder> = Option::None;
    match maker_order.side {
        Side::Buy => (),
        Side::Sell => {
            storage.auction_highest_bid.insert((maker_order.collection, maker_order.token_id), none);
            storage.auction_item.insert((maker_order.collection, maker_order.token_id), none);
            storage.sell_order.insert((maker_order.maker, maker_order.nonce), none);
        },
    }
}
