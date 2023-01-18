library thunder_exchange_interface;

use libraries::{
    order_types::*,
};

abi ThunderExchange {
    #[storage(read, write)]
    fn initialize();

    #[storage(read)]
    fn place_order(order_input: MakerOrderInput);

    #[storage(read)]
    fn cancel_order(order: MakerOrder);

    #[storage(read)]
    fn cancel_all_orders(strategy: ContractId);

    fn cancel_all_orders_by_side(strategy: ContractId, side: Side);

    #[storage(read)]
    fn execute_order(order: TakerOrder);

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId);

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId);

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId);

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId);

    // Ownable
    #[storage(read)]
    fn owner() -> Option<Identity>;

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);

    #[storage(read, write)]
    fn renounce_ownership();
}
