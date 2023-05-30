script;

use interfaces::{
    thunder_exchange_interface::ThunderExchange,
    erc721_interface::IERC721,
};

use libraries::{
    order_types::*,
};

fn main(thunder_exchange: ContractId, transfer_manager: ContractId, order: TakerOrder) {
    let exchange = abi(ThunderExchange, thunder_exchange.into());
    let erc721 = abi(IERC721, order.collection.into());

    if (order.side != Side::Sell) {
        revert(2);
    }

    erc721.set_approval_for_all(true, Identity::ContractId(transfer_manager));
    exchange.execute_order(order);
}
