contract;

dep errors;

use errors::Error;
use interfaces::{transfer_manager_interface::TransferManager, erc721_interface::IERC721};
use libraries::msg_sender_address::get_msg_sender_contract_or_panic;

use std::{auth::msg_sender, assert::assert, contract_id::ContractId};

storage {
    exchange: Option<ContractId> = Option::None,
}

impl TransferManager for Contract {
    #[storage(read, write)]
    fn initialize(exchange_contract: ContractId) {
        let exchange = storage.exchange;
        require(exchange.is_none(), Error::ExchangeInitialized);

        storage.exchange = Option::Some(exchange_contract);
    }

    #[storage(read)]
    fn transfer_nft(
        collection: ContractId,
        from: Identity,
        to: Identity,
        token_id: u64,
        amount: u64
    ) {
        let caller = get_msg_sender_contract_or_panic();
        require(caller == storage.exchange.unwrap(), Error::UnauthorizedCaller);

        let ERC721 = abi(IERC721, collection.into());
        ERC721.safeTransferFrom(from, to, token_id);
    }

    #[storage(read)]
    fn get_exchange() -> ContractId {
        storage.exchange.unwrap()
    }
}
