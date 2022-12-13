library data_structures;

dep nft_interface;

use nft_interface::TokenMetaData;
use std::{contract_id::ContractId, identity::Identity};

pub struct ListedNFT {
    /// Contract address of the NFT
    contract_Id: ContractId,

    /// Token id of the NFT
    token_id: u64,

    /// MetaData of the listed NFT
    meta_data: TokenMetaData,

    /// Current owner of the NFT
    owner: Identity,

    /// Expected payment asset for the NFT
    asset_id: ContractId,

    /// Listing price of the NFT
    price: u64,

    /// Expiration date of the listing
    expiration_date: u64,
}

pub struct PurchasedNFT {
    contract_Id: ContractId,
    token_id: u64,
    meta_data: TokenMetaData,
    new_owner: Identity,
    purchase_price: u64,
}

pub struct Offer {
    /// Address who made the offer
    offerer: Address,

    /// Amount to be offered to an NFT
    offer_amount: u64,

    /// Contract address of the NFT
    collection: ContractId,

    /// Token id of the NFT
    token_id: u64,

    /// Expiration date of the offer
    expiration_date: u64,
}

pub struct TimedAuction {
    /// Contract address of the NFT
    contract_Id: ContractId,

    /// Token id of the NFT
    token_id: u64,

    /// Current owner of the NFT
    seller: Address,

    /// Starting price to bid
    starting_price: u64,

    /// Expiration date of the auction
    expiration_date: u64,
}

pub struct HighestBid {
    bider: Address,
    bid_amount: u64,
}
