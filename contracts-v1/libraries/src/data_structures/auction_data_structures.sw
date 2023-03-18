library auction_data_structures;

use ::order_types::*;
use std::{block::timestamp};

pub struct ExecutionResult {
    is_executable: bool,
    collection: ContractId,
    token_id: u64,
    amount: u64,
    payment_asset: ContractId,
}

impl ExecutionResult {
    pub fn new(maker_order: MakerOrder, taker_order: TakerOrder) -> ExecutionResult {
        ExecutionResult {
            is_executable: (
                (maker_order.maker != taker_order.taker) &&
                (maker_order.token_id == taker_order.token_id) &&
                (maker_order.collection == taker_order.collection) &&
                (maker_order.end_time + 7200 >= timestamp()) &&
                (maker_order.start_time <= timestamp())
            ),
            collection: taker_order.collection,
            token_id: taker_order.token_id,
            amount: taker_order.extra_params.extra_u64_param,
            payment_asset: maker_order.payment_asset,
        }
    }
}
