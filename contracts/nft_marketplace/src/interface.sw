library interface;

dep data_structures;

use data_structures::ListedNFT;
use std::{contract_id::ContractId, address::Address, identity::Identity};

abi Thunder {

    /// Returns the current admin of the contract
    #[storage(read)]
    fn admin() -> Address;

    /// Returns the current protocol fee receiver
    #[storage(read)]
    fn fee_receiver() -> Identity;

    /// Returns the current status of the pausing
    #[storage(read)]
    fn pause() -> bool;

    #[storage(read)]
    fn initialized() -> bool;

    #[storage(read)]
    fn protocol_fee() -> u64;

    #[storage(read)]
    fn is_listed(contract_Id: ContractId, token_id: u64) -> bool;

    #[storage(read)]
    fn listed_nft(contract_Id: ContractId, token_id: u64) -> ListedNFT;

    /// Return true or false if asset is supported
    #[storage(read)]
    fn supported_asset(asset_id: ContractId) -> bool;

    /// Sets the inital state and unlocks the functionality for the rest of the contract
    #[storage(read, write)]
    fn constructor(admin: Address, receiver: Identity, fee: u64);

    /// Lists the NFT
    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, asset_id: ContractId, price: u64);

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
    fn set_pause();

    #[storage(read, write)]
    fn set_protocol_fee(new_fee: u64);

    #[storage(read, write)]
    fn add_supported_asset(asset_id: ContractId);

    #[storage(read, write)]
    fn remove_supported_asset(asset_id: ContractId);
}
