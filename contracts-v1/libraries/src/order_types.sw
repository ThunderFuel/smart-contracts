library order_types;

use std::{block::timestamp};

pub enum Side {
    Buy: (),
    Sell: (),
}

impl core::ops::Eq for Side {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (Side::Buy, Side::Buy) => true,
            (Side::Sell, Side::Sell) => true,
            _ => false,
        }
    }
}

pub enum TokenType {
    Erc721: (),
    Erc1155: (),
    Other: (),
}

impl core::ops::Eq for TokenType {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (TokenType::Erc721, TokenType::Erc721) => true,
            (TokenType::Erc1155, TokenType::Erc1155) => true,
            (TokenType::Other, TokenType::Other) => true,
            _ => false,
        }
    }
}

pub struct MakerOrderInput {
    side: Side,
    maker: Address,
    collection: ContractId,
    token_id: u64,
    price: u64,
    amount: u64,
    nonce: u64,
    strategy: ContractId,
    payment_asset: ContractId,
    expiration_range: u64,
    extra_params: u64,
}

pub struct MakerOrder {
    side: Side,
    maker: Address,
    collection: ContractId,
    token_id: u64,
    price: u64,
    amount: u64,
    nonce: u64,
    strategy: ContractId,
    payment_asset: ContractId,
    start_time: u64,
    end_time: u64,
    extra_params: u64,
}

impl MakerOrder {
    pub fn new(input: MakerOrderInput) -> MakerOrder {
        MakerOrder {
            side: input.side,
            maker: input.maker,
            collection: input.collection,
            token_id: input.token_id,
            price: input.price,
            amount: input.amount,
            nonce: input.nonce,
            strategy: input.strategy,
            payment_asset: input.payment_asset,
            start_time: timestamp(),
            end_time: timestamp() + input.expiration_range,
            extra_params: input.extra_params,
        }
    }
}

pub struct TakerOrder {
    side: Side,
    taker: Address,
    maker: Address,
    nonce: u64,
    price: u64,
    token_id: u64,
    collection: ContractId,
    strategy: ContractId,
    extra_params: u64,
}
