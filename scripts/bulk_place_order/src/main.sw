script;

use interfaces::{
    thunder_exchange_interface::ThunderExchange,
    erc721_interface::IERC721,
};

use libraries::{
    order_types::*,
};

fn main(thunder_exchange: ContractId, transfer_manager: ContractId, orders: [Option<MakerOrderInput>;50]) {
    let exchange = abi(ThunderExchange, thunder_exchange.into());

    let mut i = 0;
    let len = 50;
    while len > i {
        let order = orders[i];

        if (order.is_none()) {
            break;
        }

        if (order.unwrap().side == Side::Buy) {
            continue;
        }

        let erc721 = abi(IERC721, order.unwrap().collection.into());
        let approval = erc721.is_approved_for_all(
            Identity::ContractId(transfer_manager),
            Identity::Address(order.unwrap().maker)
        );
        if (!approval) {
            erc721.set_approval_for_all(true, Identity::ContractId(transfer_manager));
        }

        exchange.place_order(order.unwrap());

        i += 1;
    }
}
