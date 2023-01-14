library execution_strategy_interface;

use std::bytes::Bytes;
use libraries::{
    order_types::*,
};

pub struct ExecuteResult {
    is_executable: bool,
    collection: ContractId,
    token_id: u64,
    amount: u64,
}

abi ExecutionStrategy {
    #[storage(read, write)]
    fn initialize(exchange: ContractId);

    #[storage(read, write)]
    fn execute_order(order: TakerOrder) -> ExecuteResult;

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
}
