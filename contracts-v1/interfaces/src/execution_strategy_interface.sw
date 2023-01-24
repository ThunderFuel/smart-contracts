library execution_strategy_interface;

use libraries::{
    order_types::*,
    data_structures::fixed_price_sale_data_structures::ExecutionResult,
};

abi ExecutionStrategy {
    #[storage(read, write)]
    fn initialize(exchange: ContractId);

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecutionResult;

    #[storage(read, write)]
    fn place_order(order: MakerOrder);

    #[storage(read, write)]
    fn cancel_order(order: MakerOrder);

    #[storage(read, write)]
    fn cancel_all_orders(maker: Address);

    #[storage(read, write)]
    fn cancel_all_orders_by_side(maker: Address, side: Side);

    #[storage(read, write)]
    fn set_protocol_fee(fee: u64);

    #[storage(read)]
    fn get_protocol_fee() -> u64;

    // Ownable
    #[storage(read)]
    fn owner() -> Option<Identity>;

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);

    #[storage(read, write)]
    fn renounce_ownership();
}
