script;

use interfaces::{
    pool_interface::Pool,
    thunder_exchange_interface::ThunderExchange,
};

use libraries::{
    order_types::*,
};

#[payable]
fn main(
    thunder_exchange: ContractId,
    pool: ContractId,
    order: MakerOrderInput,
    require_bid_amount: u64,
    asset: AssetId,
) {
    let pool = abi(Pool, pool.into());
    let exchange = abi(ThunderExchange, thunder_exchange.into());

    pool.deposit {
        coins: require_bid_amount,
        asset_id: asset.into(),
    }();

    exchange.place_order(order);
}
