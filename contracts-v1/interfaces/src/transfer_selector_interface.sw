library transfer_selector_interface;

use std::contract_id::ContractId;

pub const ERC721_INTERFACE_ID = 0x80ac58cd;
pub const ERC1155_INTERFACE_ID = 0xd9b67a26;

abi TransferSelector {
    #[storage(read, write)]
    fn initialize(transfer_manager_721: ContractId, transfer_manager_1155: ContractId);

    #[storage(read, write)]
    fn get_transfer_manager_for_token(collection: ContractId) -> Option<ContractId>;

    #[storage(read, write)]
    fn add_collection_transfer_manager(collection: ContractId, transfer_manager: ContractId);

    #[storage(read, write)]
    fn remove_collection_transfer_manager(collection: ContractId, transfer_manager: ContractId);
}
