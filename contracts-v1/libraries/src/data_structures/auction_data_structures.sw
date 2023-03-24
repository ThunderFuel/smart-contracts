library auction_data_structures;

dep execution_result;

use ::order_types::*;
use execution_result::*;
use std::{block::timestamp};

// auction vs highest bid
impl ExecutionResult {
    pub fn new(auction: MakerOrder, highest_bid: MakerOrder) -> ExecutionResult {
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
