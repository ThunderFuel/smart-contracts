library interface;

use std::{contract_id::ContractId, address::Address, identity::Identity};

abi Thunder {

    /// Returns the current admin of the contract
    #[storage(read)]
    fn admin() -> Address;

    /// Returns the current protocol fee receiver
    #[storage(read)]
    fn fee_receiver() -> Identity;

    /// Sets the inital state and unlocks the functionality for the rest of the contract
    #[storage(read, write)]
    fn constructor(admin: Address, receiver: Identity);

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

    /// Sets the admin of the contract
    #[storage(read, write)]
    fn set_admin(admin: Address);

    /// Sets the protocol fee receiver
    #[storage(read, write)]
    fn set_fee_receiver(receiver: Identity);

    /// Sets the pausing status
    #[storage(read, write)]
    fn set_pause(status: bool);
}
