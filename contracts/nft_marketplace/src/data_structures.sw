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
}
