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

use std::{assert::assert, block::timestamp, call_frames::contract_id, contract_id::ContractId, revert::require, storage::{StorageMap, StorageVec}};

storage {
    execution_manager: Option<ContractId> = Option::None,
    transfer_selector: Option<ContractId> = Option::None,
    royalty_manager: Option<ContractId> = Option::None,
    asset_manager: Option<ContractId> = Option::None,
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

    // TODO: Consider to add a mapping of user order nonce for `cancelAllOrdersForSender`and `cancelMultipleMakerOrders`
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
    fn execute_order(order: TakerOrder) {

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

    require(input.price > 0, OrderError::PriceCannotBeZero);
    require(input.amount > 0, OrderError::AmountCannotBeZero);

    let execution_manager_addr = storage.execution_manager.unwrap().into();
    let asset_manager_addr = storage.asset_manager.unwrap().into();

    let execution_manager = abi(ExecutionManager, execution_manager_addr);
    require(execution_manager.is_strategy_whitelisted(input.strategy), OrderError::StrategyNotWhitelisted);

    let asset_manager = abi(AssetManager, asset_manager_addr);
    require(asset_manager.is_asset_supported(input.payment_asset), OrderError::AssetNotSupported);
}
