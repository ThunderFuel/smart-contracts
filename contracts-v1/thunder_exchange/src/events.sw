library;

use libraries::order_types::*;

pub struct OrderPlaced {
    order: MakerOrder,
}

pub struct OrderExecuted {
    order: TakerOrder,
}

pub struct OrderCanceled {
    user: Address,
    strategy: ContractId,
    side: Side,
    nonce: u64,
}