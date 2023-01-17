contract;

dep errors;

use interfaces::{
    thunder_exchange_interface::{ThunderExchange},
    transfer_selector_interface::*,
    transfer_manager_interface::TransferManager,
    royalty_manager_interface::*,
    asset_manager_interface::*,
    execution_manager_interface::ExecutionManager,
    execution_strategy_interface::ExecutionStrategy,
    erc165_interface::IERC165,
};
use libraries::{
    msg_sender_address::*,
    ownable::{only_owner, initializer},
    constants::*,
    order_types::*,
};

use errors::OrderError;

use std::{assert::assert, block::timestamp, call_frames::contract_id, contract_id::ContractId, revert::require, storage::{StorageMap}, token::*};

storage {
    execution_manager: Option<ContractId> = Option::None,
    transfer_selector: Option<ContractId> = Option::None,
    royalty_manager: Option<ContractId> = Option::None,
    asset_manager: Option<ContractId> = Option::None,
    protocol_fee_recipient: Option<Identity> = Option::None,
    min_expiration: u64 = 0,
    max_expiration: u64 = 0,
}

impl ThunderExchange for Contract {
    #[storage(read, write)]
    fn initialize() {
        let caller = get_msg_sender_address_or_panic();
        initializer(caller);

        //storage.min_expiration = 3600;
        storage.max_expiration = 15778465;
    }

    #[storage(read, write)]
    fn place_order(order_input: MakerOrderInput) {
        _validate_maker_order_input(order_input);

        /// Consider this. Beceuase it should be backward compatible
        let mut token_type = TokenType::None;

        let ERC165 = abi(IERC165, order_input.collection.into());
        if (ERC165.supportsInterface(ERC721_INTERFACE_ID)) {
            token_type = TokenType::Erc721;
        } else if (ERC165.supportsInterface(ERC1155_INTERFACE_ID)) {
            token_type = TokenType::Erc1155;
        }

        assert(token_type != TokenType::None);

        let strategy = abi(ExecutionStrategy, order_input.strategy.into());
        let order = MakerOrder::new(order_input, token_type);

        // TODO: WETH integration for Offer (Buy side)
        strategy.place_order(order);
    }

    // TODO: bulk cancel order
    // TODO: internal _cancel_order()
    #[storage(read, write)]
    fn cancel_order(order: MakerOrder) {
        require(order.maker == get_msg_sender_address_or_panic(), OrderError::MismatchedAddress);
        require(order.strategy != ZERO_CONTRACT_ID, OrderError::ContractIdCannotBeZero);

        let execution_manager_addr = storage.execution_manager.unwrap().into();
        let execution_manager = abi(ExecutionManager, execution_manager_addr);
        require(execution_manager.is_strategy_whitelisted(order.strategy), OrderError::StrategyNotWhitelisted);

        let strategy = abi(ExecutionStrategy, order.strategy.into());
        // TODO: WETH integration for Offer (Buy side)
        strategy.cancel_order(order);
    }

    #[storage(read, write)]
    fn cancel_all_orders(strategy: ContractId) {
        let caller = get_msg_sender_address_or_panic();

        let strategy = abi(ExecutionStrategy, strategy.into());
        // TODO: WETH integration for Offer (Buy side)
        strategy.cancel_all_orders(caller);
    }

    #[storage(read, write)]
    fn cancel_all_orders_by_side(strategy: ContractId, side: Side) {
        let caller = get_msg_sender_address_or_panic();

        let strategy = abi(ExecutionStrategy, strategy.into());
        // TODO: WETH integration for Offer (Buy side)
        strategy.cancel_all_orders_by_side(caller, side);
    }

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) {
        _validate_taker_order(order);

        // TODO: WETH integration for Offer (Buy side)
        // TODO: msg_amount() check

        match order.side {
            Side::Buy => _execute_buy_taker_order(order),
            Side::Sell => _execute_sell_taker_order(order),
        }
    }

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId) {

    }

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId) {

    }

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId) {

    }

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId) {

    }
}

#[storage(read)]
fn _validate_maker_order_input(input: MakerOrderInput) {
    require(input.maker != ZERO_ADDRESS, OrderError::InvalidAddress);
    require(input.maker == get_msg_sender_address_or_panic(), OrderError::MismatchedAddress);

    let min_expiration = storage.min_expiration;
    let max_expiration = storage.max_expiration;
    require(
        (storage.min_expiration <= input.expiration_range) &&
        (input.expiration_range <= storage.max_expiration),
        OrderError::WrongExpRange
    );

    require(input.nonce > 0, OrderError::NonceCannotBeZero);
    require(input.price > 0, OrderError::PriceCannotBeZero);
    require(input.amount > 0, OrderError::AmountCannotBeZero);

    let execution_manager_addr = storage.execution_manager.unwrap().into();
    let asset_manager_addr = storage.asset_manager.unwrap().into();

    let execution_manager = abi(ExecutionManager, execution_manager_addr);
    require(execution_manager.is_strategy_whitelisted(input.strategy), OrderError::StrategyNotWhitelisted);

    let asset_manager = abi(AssetManager, asset_manager_addr);
    require(asset_manager.is_asset_supported(input.payment_asset), OrderError::AssetNotSupported);
}

#[storage(read)]
fn _validate_taker_order(taker_order: TakerOrder) {
    require(taker_order.maker != ZERO_ADDRESS, OrderError::InvalidAddress);
    require(taker_order.taker != ZERO_ADDRESS, OrderError::InvalidAddress);
    require(taker_order.taker == get_msg_sender_address_or_panic(), OrderError::MismatchedAddress);

    require(taker_order.nonce > 0, OrderError::NonceCannotBeZero);
    require(taker_order.price > 0, OrderError::PriceCannotBeZero);

    let execution_manager_addr = storage.execution_manager.unwrap().into();
    let execution_manager = abi(ExecutionManager, execution_manager_addr);
    require(execution_manager.is_strategy_whitelisted(taker_order.strategy), OrderError::StrategyNotWhitelisted);
}

/// Buy now
#[storage(read, write)]
fn _execute_buy_taker_order(order: TakerOrder) {
    let strategy = abi(ExecutionStrategy, order.strategy.into());
    let execution_result = strategy.execute_order(order);
    assert(execution_result.is_executable);
    assert(execution_result.payment_asset == msg_asset_id());
    assert(order.price == msg_amount());

    _transfer_fees_and_funds(
        order.strategy,
        execution_result.collection,
        execution_result.token_id,
        order.maker,
        order.price,
        execution_result.payment_asset,
    );

    _transfer_nft(
        execution_result.collection,
        order.maker,
        order.taker,
        execution_result.token_id,
        execution_result.amount,
    );
}

/// Accept offer
#[storage(read, write)]
fn _execute_sell_taker_order(order: TakerOrder) {
    let strategy = abi(ExecutionStrategy, order.strategy.into());
    let execution_result = strategy.execute_order(order);
    assert(execution_result.is_executable);

    _transfer_nft(
        execution_result.collection,
        order.taker,
        order.maker,
        execution_result.token_id,
        execution_result.amount,
    );

    _transfer_fees_and_funds(
        order.strategy,
        execution_result.collection,
        execution_result.token_id,
        order.taker,
        order.price,
        execution_result.payment_asset,
    );
}

/// MakerOrder Buy Side
fn _deposit_to_pool() {

}


/// TakerOrder Sell Side
fn _withdraw_from_pool() {

}

#[storage(read, write)]
fn _transfer_fees_and_funds(
    strategy: ContractId,
    collection: ContractId,
    token_id: u64,
    to: Address,
    amount: u64,
    payment_asset: ContractId,
) {
    let mut final_seller_amount = amount;

    // Protocol fee
    let protocol_fee_amount = _calculate_protocol_fee(strategy, amount);
    let protocol_fee_recipient = storage.protocol_fee_recipient;

    if (storage.protocol_fee_recipient.is_some()) {
        final_seller_amount -= protocol_fee_amount;
        transfer(protocol_fee_amount, payment_asset, protocol_fee_recipient.unwrap());
    }

    // Royalty Fee
    let royalty_manager_addr = storage.royalty_manager.unwrap().into();
    let royalty_manager = abi(RoyaltyManager, royalty_manager_addr);

    let royalty_info = royalty_manager.get_royalty_info(collection);
    if (royalty_info.is_some()) {
        let royalty_fee_amount = (royalty_info.fee * amount) / 10000;
        final_seller_amount -= royalty_fee_amount;
        transfer(royalty_fee_amount, payment_asset, royalty_info.receiver);
    }

    // Final amount to seller
    transfer(final_seller_amount, payment_asset, to);
}

#[storage(read, write)]
fn _transfer_nft(
    collection: ContractId,
    from: Address,
    to: Address,
    token_id: u64,
    amount: u64,
) {
    let transfer_selector_addr = storage.transfer_selector.unwrap().into();
    let transfer_selector = abi(TransferSelector, transfer_selector_addr);

    let transfer_manager = transfer_selector.get_transfer_manager_for_token(collection);
    assert(transfer_manager.is_some());

    transfer_manager.unwrap().transfer_nft(
        collection,
        from,
        to,
        token_id,
        amount,
    );
}

fn _calculate_protocol_fee(strategy: ContractId, amount: u64) -> u64 {
    let execution_strategy = abi(ExecutionStrategy, strategy.into());
    let protocol_fee = execution_strategy.get_protocol_fee();

    (protocol_fee * amount) / 10000
}
