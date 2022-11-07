library data_structures;

use std::{contract_id::ContractId, identity::Identity};

pub struct ListedNFT {
    /// Contract address of the NFT
    contract_Id: ContractId,

    /// Token id of the NFT
    token_id: u64,

    /// Current owner of the NFT
    owner: Identity,

    /// Listing price of the NFT
    price: u64,
}
