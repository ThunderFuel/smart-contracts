contract;

mod errors;
mod events;

use interfaces::{
    thunder_exchange_interface::{ThunderExchange},
    royalty_manager_interface::*,
    asset_manager_interface::*,
    execution_manager_interface::ExecutionManager,
    execution_strategy_interface::ExecutionStrategy,
    pool_interface::Pool,
};
use errors::*;
use events::*;
use libraries::{
    msg_sender_address::*,
    constants::*,
    order_types::*,
    ownable::*,
};

use std::{
    block::timestamp,
    auth::*,
    call_frames::*,
    context::*,
    contract_id::ContractId,
    logging::log,
    revert::require,
    storage::storage_map::*,
    token::*
};

storage {
    owner: Ownership = Ownership::uninitialized(),
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
        require(
            storage.owner.owner() == State::Uninitialized,
            ThunderExchangeErrors::OwnerInitialized
        );
        let caller = get_msg_sender_address_or_panic();
        storage.owner.set_ownership(Identity::Address(caller));
        //storage.min_expiration = 3600;
        storage.max_expiration.write(15778465);
    }

    #[storage(read)]
    fn place_order(order_input: MakerOrderInput) {
        _validate_maker_order_input(order_input);

        let strategy = abi(ExecutionStrategy, order_input.strategy.into());
        let order = MakerOrder::new(order_input);
        match order.side {
            Side::Buy => {
                // Make offer and Place Bid
                let pool_balance = _get_pool_balance(order.maker, order.payment_asset);
                require(order.price <= pool_balance, ThunderExchangeErrors::AmountHigherThanPoolBalance);
            },
            Side::Sell => {
                // List and Auction
                require(msg_asset_id() == AssetId::new(order_input.collection, order_input.token_id), ThunderExchangeErrors::AssetIdNotMatched);
                require(msg_amount() == order_input.amount, ThunderExchangeErrors::AmountNotMatched);
            },
        }

        strategy.place_order(order);

        log(OrderPlaced {
            order
        });
    }

    #[storage(read)]
    fn cancel_order(
        strategy: ContractId,
        nonce: u64,
        side: Side
    ) {
        let caller = get_msg_sender_address_or_panic();
        let execution_manager_addr = storage.execution_manager.read().unwrap().into();
        let execution_manager = abi(ExecutionManager, execution_manager_addr);
        require(strategy != ZERO_CONTRACT_ID, ThunderExchangeErrors::StrategyMustBeNonZeroContract);
        require(execution_manager.is_strategy_whitelisted(strategy), ThunderExchangeErrors::StrategyNotWhitelisted);

        let strategy_caller = abi(ExecutionStrategy, strategy.into());
        let order = strategy_caller.get_maker_order_of_user(caller, nonce, side);

        match side {
            Side::Buy => {
                // Cancel Offer/Bid
                strategy_caller.cancel_order(caller, nonce, side);
            },
            Side::Sell => {
                // Cancel Listing/Auction
                if (order.is_some()) {
                    let unwrapped_order = order.unwrap();
                    strategy_caller.cancel_order(caller, nonce, side);
                    transfer(
                        Identity::Address(unwrapped_order.maker),
                        AssetId::new(unwrapped_order.collection, unwrapped_order.token_id),
                        unwrapped_order.amount
                    );
                }
            },
        }

        log(OrderCanceled {
            user: caller,
            strategy,
            side,
            nonce,
        });
    }

    #[storage(read), payable]
    fn execute_order(order: TakerOrder) {
        _validate_taker_order(order);
        match order.side {
            Side::Buy => _execute_buy_taker_order(order),
            Side::Sell => _execute_sell_taker_order(order),
        }

        log(OrderExecuted {
            order
        });
    }

    /// Setters ///
    #[storage(read, write)]
    fn set_pool(pool: ContractId) {
        storage.owner.only_owner();
        storage.pool.write(Option::Some(pool));
    }

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId) {
        storage.owner.only_owner();
        storage.execution_manager.write(Option::Some(execution_manager));
    }

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId) {
        storage.owner.only_owner();
        storage.transfer_selector.write(Option::Some(transfer_selector));
    }

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId) {
        storage.owner.only_owner();
        storage.royalty_manager.write(Option::Some(royalty_manager));
    }

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId) {
        storage.owner.only_owner();
        storage.asset_manager.write(Option::Some(asset_manager));
    }

    #[storage(read, write)]
    fn set_protocol_fee_recipient(protocol_fee_recipient: Identity) {
        storage.owner.only_owner();
        storage.protocol_fee_recipient.write(Option::Some(protocol_fee_recipient));
    }

    /// Getters ///
    #[storage(read)]
    fn get_pool() -> ContractId {
        storage.pool.read().unwrap()
    }

    #[storage(read)]
    fn get_execution_manager() -> ContractId {
        storage.execution_manager.read().unwrap()
    }

    #[storage(read)]
    fn get_transfer_selector() -> ContractId {
        storage.transfer_selector.read().unwrap()
    }

    #[storage(read)]
    fn get_royalty_manager() -> ContractId {
        storage.royalty_manager.read().unwrap()
    }

    #[storage(read)]
    fn get_asset_manager() -> ContractId {
        storage.asset_manager.read().unwrap()
    }

    #[storage(read)]
    fn get_protocol_fee_recipient() -> Identity {
        storage.protocol_fee_recipient.read().unwrap()
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
fn _validate_maker_order_input(input: MakerOrderInput) {
    require(input.maker != ZERO_ADDRESS, ThunderExchangeErrors::MakerMustBeNonZeroAddress);
    require(input.maker == get_msg_sender_address_or_panic(), ThunderExchangeErrors::CallerMustBeMaker);

    require(
        (storage.min_expiration.read() <= input.expiration_range) &&
        (input.expiration_range <= storage.max_expiration.read()),
        ThunderExchangeErrors::ExpirationRangeOutOfBound
    );

    require(input.nonce > 0, ThunderExchangeErrors::NonceMustBeNonZero);
    require(input.price > 0, ThunderExchangeErrors::PriceMustBeNonZero);
    require(input.amount > 0, ThunderExchangeErrors::AmountMustBeNonZero);

    let execution_manager_addr = storage.execution_manager.read().unwrap().into();
    let execution_manager = abi(ExecutionManager, execution_manager_addr);
    require(execution_manager.is_strategy_whitelisted(input.strategy), ThunderExchangeErrors::StrategyNotWhitelisted);

    let asset_manager_addr = storage.asset_manager.read().unwrap().into();
    let asset_manager = abi(AssetManager, asset_manager_addr);
    require(asset_manager.is_asset_supported(input.payment_asset), ThunderExchangeErrors::AssetNotSupported);
}

#[storage(read)]
fn _validate_taker_order(taker_order: TakerOrder) {
    require(taker_order.maker != ZERO_ADDRESS, ThunderExchangeErrors::MakerMustBeNonZeroAddress);
    require(taker_order.taker != ZERO_ADDRESS, ThunderExchangeErrors::TakerMustBeNonZeroAddress);
    require(taker_order.taker == get_msg_sender_address_or_panic(), ThunderExchangeErrors::CallerMustBeMaker);

    require(taker_order.nonce > 0, ThunderExchangeErrors::NonceMustBeNonZero);
    require(taker_order.price > 0, ThunderExchangeErrors::PriceMustBeNonZero);

    let execution_manager_addr = storage.execution_manager.read().unwrap().into();
    let execution_manager = abi(ExecutionManager, execution_manager_addr);
    require(execution_manager.is_strategy_whitelisted(taker_order.strategy), ThunderExchangeErrors::StrategyNotWhitelisted);
}

/// Buy now
#[storage(read), payable]
fn _execute_buy_taker_order(order: TakerOrder) {
    let strategy = abi(ExecutionStrategy, order.strategy.into());
    let execution_result = strategy.execute_order(order);
    require(execution_result.is_executable, ThunderExchangeErrors::ExecutionInvalid);
    require(execution_result.payment_asset == msg_asset_id(), ThunderExchangeErrors::PaymentAssetMismatched);
    require(order.price == msg_amount(), ThunderExchangeErrors::PriceMismatched);

    _transfer_fees_and_funds(
        order.strategy,
        execution_result.collection,
        order.maker,
        order.price,
        execution_result.payment_asset,
    );

    transfer(
        Identity::Address(order.maker),
        AssetId::new(execution_result.collection, execution_result.token_id),
        execution_result.amount
    );
}

/// Accept offer/bid - (MIGHT NOT WORK FOR ACCEPT BID)
#[storage(read), payable]
fn _execute_sell_taker_order(order: TakerOrder) {
    let strategy = abi(ExecutionStrategy, order.strategy.into());
    let execution_result = strategy.execute_order(order);
    require(execution_result.is_executable, ThunderExchangeErrors::ExecutionInvalid);
    require(
        msg_asset_id() == AssetId::new(execution_result.collection, execution_result.token_id),
        ThunderExchangeErrors::PaymentAssetMismatched
    );
    require(msg_amount() == execution_result.amount, ThunderExchangeErrors::AmountMismatched);

    transfer(
        Identity::Address(order.taker),
        AssetId::new(execution_result.collection, execution_result.token_id),
        execution_result.amount
    );

    _transfer_fees_and_funds_with_pool(
        order.strategy,
        execution_result.collection,
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
    to: Address,
    amount: u64,
    payment_asset: AssetId,
) {
    let mut final_seller_amount = amount;

    // Protocol fee
    let protocol_fee_amount = _calculate_protocol_fee(strategy, amount);
    let protocol_fee_recipient = storage.protocol_fee_recipient.read();
    if (protocol_fee_recipient.is_some()) {
        final_seller_amount -= protocol_fee_amount;
        transfer(protocol_fee_recipient.unwrap(), payment_asset, protocol_fee_amount);
    }

    // Royalty Fee
    let royalty_manager_addr = storage.royalty_manager.read().unwrap().into();
    let royalty_manager = abi(RoyaltyManager, royalty_manager_addr);
    let royalty_info = royalty_manager.get_royalty_info(collection);
    if (royalty_info.is_some()) {
        let royalty_fee_amount = (royalty_info.unwrap().fee * amount) / 10000;
        final_seller_amount -= royalty_fee_amount;
        transfer(royalty_info.unwrap().receiver, payment_asset, royalty_fee_amount);
    }

    // Final amount to seller
    transfer(Identity::Address(to), payment_asset, final_seller_amount);
}

#[storage(read), payable]
fn _transfer_fees_and_funds_with_pool(
    strategy: ContractId,
    collection: ContractId,
    from: Address,
    to: Address,
    amount: u64,
    payment_asset: AssetId,
) {
    let pool_addr = storage.pool.read().unwrap().into();
    let pool = abi(Pool, pool_addr);

    // Transfer `amount` to this contract
    let success = pool.transfer_from(
        Identity::Address(from),
        Identity::ContractId(contract_id()),
        payment_asset,
        amount
    );
    require(success, ThunderExchangeErrors::PoolTransferFromFailed);

    // Withdraw `amount` from the pool
    let prevBalance = this_balance(payment_asset);
    pool.withdraw(payment_asset, amount);
    let postBalance = this_balance(payment_asset);
    require(prevBalance + amount == postBalance, ThunderExchangeErrors::PoolMismatchedAssetBalance);

    let mut final_seller_amount = amount;

    // Protocol fee
    let protocol_fee_amount = _calculate_protocol_fee(strategy, amount);
    let protocol_fee_recipient = storage.protocol_fee_recipient;
    if (storage.protocol_fee_recipient.read().is_some()) {
        final_seller_amount -= protocol_fee_amount;
        transfer(protocol_fee_recipient.read().unwrap(), payment_asset, protocol_fee_amount);
    }

    // Royalty Fee
    let royalty_manager_addr = storage.royalty_manager.read().unwrap().into();
    let royalty_manager = abi(RoyaltyManager, royalty_manager_addr);
    let royalty_info = royalty_manager.get_royalty_info(collection);
    if (royalty_info.is_some()) {
        let royalty_fee_amount = (royalty_info.unwrap().fee * amount) / 10000;
        final_seller_amount -= royalty_fee_amount;
        transfer(royalty_info.unwrap().receiver, payment_asset, royalty_fee_amount);
    }

    // Final amount to seller
    transfer(Identity::Address(to), payment_asset, final_seller_amount);
}

fn _calculate_protocol_fee(strategy: ContractId, amount: u64) -> u64 {
    let execution_strategy = abi(ExecutionStrategy, strategy.into());
    let protocol_fee = execution_strategy.get_protocol_fee();
    (protocol_fee * amount) / 10000
}

#[storage(read)]
fn _get_pool_balance(account: Address, asset: AssetId) -> u64 {
    let pool_addr = storage.pool.read().unwrap().into();
    let pool = abi(Pool, pool_addr);
    pool.balance_of(Identity::Address(account), asset)
}
