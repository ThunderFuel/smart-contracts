extern crate alloc;
use fuel_indexer_utils::prelude::*;

#[indexer(manifest = "thunder_indexer.manifest.yaml")]
pub mod thunder_indexer_index_mod {

    fn handle_order_placed_event(event: OrderPlaced, block: BlockData) {
        let maker_order = MakerOrderEntity {
            side: match event.order.side {
                Side::Sell => String::from("Sell"),
                Side::Buy => String::from("Buy"),
            },
            maker: event.order.maker,
            collection: event.order.collection,
            token_id: event.order.token_id.into_token(),
            price: event.order.price,
            amount: event.order.amount,
            nonce: event.order.nonce,
            strategy: event.order.strategy,
            payment_asset: event.order.payment_asset,
            start_time: event.order.start_time,
            end_time: event.order.end_time,
            extra_params: event.order.extra_params,
        };

        maker_order.save();
        // let order = OrderPlacedEntity::new(maker_order);

        // order.save();

        let height = block.height;
        info!("(height: {height}): Order Placed\n{:#?}", entry);
    }

    fn handle_order_updated_event(event: OrderPlaced) {

    }

    fn handle_order_executed_event(event: OrderPlaced) {

    }

    fn handle_order_canceled_event(event: OrderPlaced) {

    }
}
