library transfer_selector_interface;

use std::contract_id::ContractId;

abi TransferSelector {
    #[storage(read, write)]
    fn get_transfer_manager_for_token(collection: ContractId) -> ContractId;
}
