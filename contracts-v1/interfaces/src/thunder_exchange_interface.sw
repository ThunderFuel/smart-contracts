library;

use libraries::{
    order_types::*,
};

abi ThunderExchange {
    #[storage(read, write)]
    fn initialize();

    #[storage(read), payable]
    fn place_order(order_input: MakerOrderInput);

    #[storage(read), payable]
    fn update_order(order_input: MakerOrderInput);

    #[storage(read)]
    fn cancel_order(strategy: ContractId, nonce: u64, side: Side);

    #[storage(read), payable]
    fn execute_order(order: TakerOrder);

    /// Setters ///
    #[storage(read, write)]
    fn set_pool(pool: ContractId);

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId);

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId);

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId);

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId);

    #[storage(read, write)]
    fn set_protocol_fee_recipient(protocol_fee_recipient: Identity);

    #[storage(read, write)]
    fn set_min_expiration(new_min_expiration: u64);

    #[storage(read, write)]
    fn set_max_expiration(new_max_expiration: u64);

    /// Getters ///
    #[storage(read)]
    fn get_pool() -> ContractId;

    #[storage(read)]
    fn get_execution_manager() -> ContractId;

    #[storage(read)]
    fn get_transfer_selector() -> ContractId;

    #[storage(read)]
    fn get_royalty_manager() -> ContractId;

    #[storage(read)]
    fn get_asset_manager() -> ContractId;

    #[storage(read)]
    fn get_protocol_fee_recipient() -> Identity;

    #[storage(read)]
    fn get_min_expiration() -> u64;

    #[storage(read)]
    fn get_max_expiration() -> u64;

    /// Ownable ///
    #[storage(read)]
    fn owner() -> Option<Identity>;

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);

    #[storage(read, write)]
    fn renounce_ownership();
}
