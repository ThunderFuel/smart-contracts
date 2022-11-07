library interface;

use std::{contract_id::ContractId};

abi Thunder {
    /// Lists the NFT
    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, price: u64);

    /// Updates the listing details
    #[storage(read, write)]
    fn update_price(contract_Id: ContractId, token_id: u64, new_price: u64);

    /// Deletes the listed NFT details
    #[storage(read, write)]
    fn delete_listing(contract_Id: ContractId, token_id: u64);

    /// Purchases the listed NFT
    #[storage(read, write)]
    fn purchase_nft(contract_Id: ContractId, token_id: u64);
}
