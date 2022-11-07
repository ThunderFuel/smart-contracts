library events;

dep nft_interface;

use nft_interface::TokenMetaData;
use std::{contract_id::ContractId, identity::Identity};

pub struct ListEvent {
    contract_Id: ContractId,
    token_id: u64,
    meta_data: TokenMetaData,
    owner: Identity,
    price: u64,
}

pub struct PriceUpdateEvent {
    contract_Id: ContractId,
    token_id: u64,
    new_price: u64,
}

pub struct DeleteEvent {
    contract_Id: ContractId,
    token_id: u64,
}

pub struct PurchaseEvent {
    contract_Id: ContractId,
    token_id: u64,
    meta_data: TokenMetaData,
    new_owner: Identity,
    purchase_price: u64,
}
