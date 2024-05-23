library;

use ::order_types::*;
use std::{block::timestamp};

pub struct ExecutionResult {
    is_executable: bool,
    collection: ContractId,
    token_id: SubId,
    amount: u64,
    payment_asset: AssetId,
}

impl ExecutionResult {
    /// Strategy-Fixed-Price
    pub fn s1(maker_order: MakerOrder, taker_order: TakerOrder) -> ExecutionResult {
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
            amount: 1,
            payment_asset: maker_order.payment_asset,
        }
    }

    /// Strategy-Auction
    pub fn s2(auction: MakerOrder, highest_bid: MakerOrder) -> ExecutionResult {
        ExecutionResult {
            is_executable: (
                (auction.maker != highest_bid.maker) &&
                (auction.token_id == highest_bid.token_id) &&
                (auction.collection == highest_bid.collection) &&
                (auction.end_time + 7200 >= timestamp()) &&
                (auction.start_time <= timestamp())
            ),
            collection: highest_bid.collection,
            token_id: highest_bid.token_id,
            amount: 1,
            payment_asset: auction.payment_asset,
        }
    }
}
