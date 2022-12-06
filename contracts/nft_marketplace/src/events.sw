library events;

dep nft_interface;
dep data_structures;

use nft_interface::TokenMetaData;
use data_structures::*;
use std::{contract_id::ContractId, identity::Identity};

pub struct ListEvent {
    nft: ListedNFT,
}

pub struct UpdateListingEvent {
    contract_Id: ContractId,
    token_id: u64,
    new_price: u64,
    new_expiration_date: u64,
}

pub struct CancelListingEvent {
    contract_Id: ContractId,
    token_id: u64,
}

pub struct PurchaseEvent {
    nft: PurchasedNFT,
}

pub struct OfferEvent {
    offer: Offer,
}

pub struct UpdateOfferEvent {
    collection: ContractId,
    token_id: u64,
    offer_index: u64,
    offerer: Address,
    new_offer_amount: u64,
    new_expiration_date: u64,
}

pub struct CancelOfferEvent {
    collection: ContractId,
    token_id: u64,
    offer_index: u64,
    offerer: Address,
}

pub struct AcceptOfferEvent {
    collection: ContractId,
    token_id: u64,
    offer_index: u64,
    offer_amount: u64,
    pre_owner: Identity,
    new_owner: Identity,
}
