library thunder_exchange_interface;

use libraries::{
    order_types::*,
};

abi ThunderExchange {
    #[storage(read, write)]
    fn initialize();

    #[storage(read, write)]
    fn place_order(order_input: MakerOrderInput);

    #[storage(read, write)]
    fn cancel_order(order: MakerOrder);

    #[storage(read, write)]
    fn execute_order(order: TakerOrder);

    #[storage(read, write)]
    fn set_execution_manager(execution_manager: ContractId);

    #[storage(read, write)]
    fn set_transfer_selector(transfer_selector: ContractId);

    #[storage(read, write)]
    fn set_royalty_manager(royalty_manager: ContractId);

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId);
}
