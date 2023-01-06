library transfer_manager_interface;

use std::{contract_id::ContractId, identity::Identity};

abi TransferManager {
    #[storage(read, write)]
    fn initialize(exchange_contract: ContractId);

    fn transfer_nft(
        collection: ContractId,
        from: Identity,
        to: Identity,
        token_id: u64,
        amount: u64
    );
}
