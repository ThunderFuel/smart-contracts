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
    pool_interface::Pool,
};
use libraries::{
    msg_sender_address::*,
    ownable::*,
    constants::*,
    order_types::*,
};

use errors::OrderError;

use std::{
    assert::assert,
    block::timestamp,
    auth::*,
    call_frames::*,
    context::*,
    contract_id::ContractId,
    revert::require,
    storage::{StorageMap},
    token::*
};

storage {
    pool: Option<ContractId> = Option::None,
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
        set_ownership(Identity::Address(caller));

        //storage.min_expiration = 3600;
        storage.max_expiration = 15778465;
    }

    // TODO: bulk place order
    // TODO: internal _place_order()
    #[storage(read)]
    fn place_order(order_input: MakerOrderInput) {
        _validate_maker_order_input(order_input);

        let strategy = abi(ExecutionStrategy, order_input.strategy.into());
        let order = MakerOrder::new(order_input);

        if (order.side == Side::Buy) {
            let pool_balance = _get_pool_balance(order.maker, order.payment_asset);
            assert(order.price <= pool_balance);
        }

        strategy.place_order(order);
    }

    // TODO: bulk cancel order
    // TODO: internal _cancel_order()
    #[storage(read)]
    fn cancel_order(order: MakerOrder) {
        require(order.maker == get_msg_sender_address_or_panic(), OrderError::MismatchedAddress);
        require(order.strategy != ZERO_CONTRACT_ID, OrderError::ContractIdCannotBeZero);

        let execution_manager_addr = storage.execution_manager.unwrap().into();
        let execution_manager = abi(ExecutionManager, execution_manager_addr);
        require(execution_manager.is_strategy_whitelisted(order.strategy), OrderError::StrategyNotWhitelisted);

        let strategy = abi(ExecutionStrategy, order.strategy.into());
        strategy.cancel_order(order);
    }

    fn cancel_all_orders(strategy: ContractId) {
        let caller = get_msg_sender_address_or_panic();

        let strategy = abi(ExecutionStrategy, strategy.into());
        strategy.cancel_all_orders(caller);
    }

    fn cancel_all_orders_by_side(strategy: ContractId, side: Side) {
        let caller = get_msg_sender_address_or_panic();

        let strategy = abi(ExecutionStrategy, strategy.into());
        strategy.cancel_all_orders_by_side(caller, side);
    }

    #[storage(read)]
    fn execute_order(order: TakerOrder) {
        _validate_taker_order(order);

        match order.side {
            Side::Buy => _execute_buy_taker_order(order),
            Side::Sell => _execute_sell_taker_order(order),
        }
    }

    /// Setters ///

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId) {
        only_owner();
        storage.execution_manager = Option::Some(execution_manager);
    }

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId) {
        only_owner();
        storage.transfer_selector = Option::Some(transfer_selector);
    }

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId) {
        only_owner();
        storage.royalty_manager = Option::Some(royalty_manager);
    }

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId) {
        only_owner();
        storage.asset_manager = Option::Some(asset_manager);
    }

    #[storage(read, write)]
    fn set_protocol_fee_recipient(protocol_fee_recipient: Identity) {
        only_owner();
        storage.protocol_fee_recipient = Option::Some(protocol_fee_recipient);
    }

    /// Getters ///

    #[storage(read)]
    fn get_execution_manager() -> ContractId {
        storage.execution_manager.unwrap()
    }

    #[storage(read)]
    fn get_transfer_selector() -> ContractId {
        storage.transfer_selector.unwrap()
    }

    #[storage(read)]
    fn get_royalty_manager() -> ContractId {
        storage.royalty_manager.unwrap()
    }

    #[storage(read)]
    fn get_asset_manager() -> ContractId {
        storage.asset_manager.unwrap()
    }

    #[storage(read)]
    fn get_protocol_fee_recipient() -> Identity {
        storage.protocol_fee_recipient.unwrap()
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
#[storage(read)]
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

/// Accept offer/bid
#[storage(read)]
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

    _transfer_fees_and_funds_with_pool(
        order.strategy,
        execution_result.collection,
        execution_result.token_id,
        order.maker,
        order.taker,
        order.price,
        execution_result.payment_asset,
    );
}

#[storage(read)]
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
        let royalty_fee_amount = (royalty_info.unwrap().fee * amount) / 10000;
        final_seller_amount -= royalty_fee_amount;
        transfer(royalty_fee_amount, payment_asset, royalty_info.unwrap().receiver);
    }

    // Final amount to seller
    transfer(final_seller_amount, payment_asset, Identity::Address(to));
}

#[storage(read)]
fn _transfer_fees_and_funds_with_pool(
    strategy: ContractId,
    collection: ContractId,
    token_id: u64,
    from: Address,
    to: Address,
    amount: u64,
    payment_asset: ContractId,
) {
    let pool_addr = storage.pool.unwrap().into();
    let pool = abi(Pool, pool_addr);

    let mut final_seller_amount = amount;

    // Protocol fee
    let protocol_fee_amount = _calculate_protocol_fee(strategy, amount);
    let protocol_fee_recipient = storage.protocol_fee_recipient;

    if (storage.protocol_fee_recipient.is_some()) {
        final_seller_amount -= protocol_fee_amount;
        let success = pool.transfer_from(Identity::Address(from), protocol_fee_recipient.unwrap(), payment_asset, protocol_fee_amount);
        assert(success);
    }

    // Royalty Fee
    let royalty_manager_addr = storage.royalty_manager.unwrap().into();
    let royalty_manager = abi(RoyaltyManager, royalty_manager_addr);
    let royalty_info = royalty_manager.get_royalty_info(collection);

    if (royalty_info.is_some()) {
        let royalty_fee_amount = (royalty_info.unwrap().fee * amount) / 10000;
        final_seller_amount -= royalty_fee_amount;
        let success = pool.transfer_from(Identity::Address(from), royalty_info.unwrap().receiver, payment_asset, royalty_fee_amount);
        assert(success);
    }

    // Final amount to seller
    let success = pool.transfer_from(Identity::Address(from), Identity::Address(to), payment_asset, final_seller_amount);
    assert(success);
}

#[storage(read)]
fn _transfer_nft(
    collection: ContractId,
    from: Address,
    to: Address,
    token_id: u64,
    amount: u64,
) {
    let transfer_selector_addr = storage.transfer_selector.unwrap().into();
    let transfer_selector = abi(TransferSelector, transfer_selector_addr);

    let transfer_manager_addr = transfer_selector.get_transfer_manager_for_token(collection);
    assert(transfer_manager_addr.is_some());

    let transfer_manager = abi(TransferManager, transfer_manager_addr.unwrap().into());

    transfer_manager.transfer_nft(
        collection,
        Identity::Address(from),
        Identity::Address(to),
        token_id,
        amount,
    );
}

fn _calculate_protocol_fee(strategy: ContractId, amount: u64) -> u64 {
    let execution_strategy = abi(ExecutionStrategy, strategy.into());
    let protocol_fee = execution_strategy.get_protocol_fee();

    (protocol_fee * amount) / 10000
}

#[storage(read)]
fn _get_pool_balance(account: Address, asset: ContractId) -> u64 {
    let pool_addr = storage.pool.unwrap().into();
    let pool = abi(Pool, pool_addr);

    pool.balance_of(Identity::Address(account), asset)
}