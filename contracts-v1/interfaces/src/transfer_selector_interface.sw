library;

pub const ERC721_INTERFACE_ID = 0x80ac58cd;
pub const ERC1155_INTERFACE_ID = 0xd9b67a26;

abi TransferSelector {
    #[storage(read, write)]
    fn initialize(transfer_manager_721: ContractId, transfer_manager_1155: ContractId);

    #[storage(read)]
    fn get_transfer_manager_721() -> Option<ContractId>;

    #[storage(read)]
    fn get_transfer_manager_1155() -> Option<ContractId>;

    #[storage(read)]
    fn get_transfer_manager_for_token(collection: ContractId) -> Option<ContractId>;

    #[storage(read, write)]
    fn set_transfer_manager_721(erc721_manager: ContractId);

    #[storage(read, write)]
    fn set_transfer_manager_1155(erc1155_manager: ContractId);

    #[storage(read, write)]
    fn add_collection_transfer_manager(collection: ContractId, transfer_manager: ContractId);

    #[storage(read, write)]
    fn remove_collection_transfer_manager(collection: ContractId);

    // Ownable
    #[storage(read)]
    fn owner() -> Option<Identity>;

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);

    #[storage(read, write)]
    fn renounce_ownership();
}
