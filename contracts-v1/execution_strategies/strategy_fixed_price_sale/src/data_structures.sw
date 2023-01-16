library data_structures;

pub struct ExecutionResult {
    is_executable: bool,
    collection: ContractId,
    token_id: u64,
    amount: u64,
}

impl ExecutionResult {
    pub fn new(maker_order: MakerOrder, taker_order: TakerOrder) -> ExecutionResult {
        ExecutionResult {
            is_executable: (
                (maker_order.side != taker_order.side) &&
                (maker_order.maker != taker_order.taker) &&
                (maker_order.maker == taker_order.maker) &&
                (maker_order.nonce == taker_order.nonce) &&
                (maker_order.price == taker_order.price) &&
                (maker_order.token_id == taker_order.token_id) &&
                (maker_order.collection == taker_order.collection) &&
                (maker_order.end_time >= timestamp()) &&
                (maker_order.start_time <= timestamp())
            ),
            collection: taker_order.collection,
            token_id: taker_order.token_id,
            amount: taker_order.extra_params,
        }
    }
}
