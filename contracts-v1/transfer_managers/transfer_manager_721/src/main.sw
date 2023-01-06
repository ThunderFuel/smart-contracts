contract;

use interfaces::{transfer_manager_interface::TransferManager, erc721_interface::IERC721};

use std::{assert::assert, bytes::Bytes, contract_id::ContractId};

storage {
    exchange: Option<ContractId> = Option::None,
}

impl TransferManager for Contract {
    #[storage(read, write)]
    fn initialize(exchange_contract: ContractId) {
        let exchange = storage.exchange;
        assert(exchange.is_none());

        let option_exchange = Option::Some(exchange_contract);
        storage.exchange = option_exchange;
    }

    fn transfer_nft(
        collection: ContractId,
        from: Identity,
        to: Identity,
        token_id: u64,
        amount: u64
    ) {
        let bytes = Bytes::new();
        let ERC721 = abi(IERC721, collection.into());
        ERC721.safeTransferFrom(from, to, token_id, bytes);
    }
}
