contract;

mod interface;

use libraries::{msg_sender_address::*, ownable::*, constants::*};
use interface::{IERC721::*, errors::*};
use std::{
    auth::msg_sender,
    identity::Identity,
    logging::log,
    option::Option,
    result::Result,
    revert::require,
    storage::StorageMap,
};

storage {
    approved: StorageMap<u64, Option<Identity>> = StorageMap {},
    balances: StorageMap<Identity, u64> = StorageMap {},
    max_supply: u64 = 0,
    meta_data: StorageMap<u64, TokenMetaData> = StorageMap {},
    operator_approval: StorageMap<(Identity, Identity), bool> = StorageMap {},
    owners: StorageMap<u64, Option<Identity>> = StorageMap {},
    tokens_minted: u64 = 0,
    total_supply: u64 = 0,
}

impl IERC721 for Contract {
    #[storage(read)]
    fn owner() -> Option<Identity> {
        owner()
    }

    #[storage(read, write)]
    fn approve(to: Option<Identity>, token_id: u64) {
        let token_owner = storage.owners.get(token_id).unwrap();
        require(token_owner.is_some(), InputError::TokenDoesNotExist);

        // Ensure that the sender is the owner of the token to be approved
        let sender = msg_sender().unwrap();
        require(token_owner.unwrap() == sender, AccessError::SenderNotOwner);

        // Set and store the `approved` `Identity`
        storage.approved.insert(token_id, to);

        log(ApprovalEvent {
            approved: to,
            owner: token_owner.unwrap(),
            token_id: token_id,
        });
    }

    #[storage(read)]
    fn approved(token_id: u64) -> Option<Identity> {
        let approved = storage.approved.get(token_id).unwrap();
        require(approved.is_some(), InputError::ApprovedDoesNotExist);
        approved
    }

    #[storage(read)]
    fn balance_of(user: Identity) -> u64 {
        storage.balances.get(user).unwrap_or(0)
    }

    #[storage(read, write)]
    fn initialize(max_supply: u64, transfer_manager: ContractId) {
        require(max_supply != 0, InputError::TokenSupplyCannotBeZero);
        let caller = msg_sender().unwrap();
        set_ownership(caller);

        storage.max_supply = max_supply;
    }

    #[storage(read)]
    fn is_approved_for_all(operator: Identity, user: Identity) -> bool {
        storage.operator_approval.get((user, operator)).unwrap_or(false)
    }

    #[storage(read)]
    fn max_supply() -> u64 {
        storage.max_supply
    }

    #[storage(read, write)]
    fn mint(amount: u64, to: Identity) {
        let tokens_minted = storage.tokens_minted;
        let total_mint = tokens_minted + amount;
        // The current number of tokens minted plus the amount to be minted cannot be
        // greater than the total supply
        require(amount == 1, "Exceeds the mint limit");
        require(storage.max_supply >= total_mint, InputError::NotEnoughTokensToMint);

        let sender = get_msg_sender_address_or_panic();
        let balance_of_sender = storage.balances.get(Identity::Address(sender)).unwrap_or(0);
        require(balance_of_sender < 1, "Already minted");

        // Mint as many tokens as the sender has asked for
        let mut index = tokens_minted;
        while index < total_mint {
            // Create the TokenMetaData for this new token
            storage.meta_data.insert(index, TokenMetaData::new(index));
            storage.owners.insert(index, Option::Some(to));

            log(MintEvent {
                owner: to,
                token_id: index
            });

            index += 1;
        }

        storage.balances.insert(to, storage.balances.get(to).unwrap_or(0) + amount);
        storage.tokens_minted = total_mint;
        storage.total_supply += amount;
    }

    #[storage(read)]
    fn metadata(token_id: u64) -> TokenMetaData {
        require(token_id < storage.tokens_minted, InputError::TokenDoesNotExist);
        storage.meta_data.get(token_id).unwrap()
    }

    #[storage(read)]
    fn owner_of(token_id: u64) -> Option<Identity> {
        storage.owners.get(token_id).unwrap()
    }

    #[storage(write)]
    fn set_approval_for_all(approve: bool, operator: Identity) {
        // Store `approve` with the (sender, operator) tuple
        let sender = msg_sender().unwrap();
        storage.operator_approval.insert((sender, operator), approve);

        log(OperatorEvent {
            approved: approve,
            operator: operator,
            owner: sender,
        });
    }

    fn supports_interface(interface_id: u64) -> bool {
        match interface_id {
            ERC721_INTERFACE_ID => true,
            _ => false,
        }
    }

    #[storage(read)]
    fn total_supply() -> u64 {
        storage.total_supply
    }

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: u64) {
        // Make sure the `token_id` maps to an existing token
        let token_owner = storage.owners.get(token_id).unwrap_or(Option::None);
        require(token_owner.is_some(), InputError::TokenDoesNotExist);
        let token_owner = token_owner.unwrap();

        // Ensure that the sender is either:
        // 1. The owner of this token
        // 2. Approved for transfer of this token
        // 3. Has operator approval from the owner and this token belongs to the sender identity
        let sender = msg_sender().unwrap();
        let approved = storage.approved.get(token_id).unwrap_or(Option::None);
        require(
            (sender == token_owner) ||
            (approved.is_some() && sender == approved.unwrap()) ||
            (storage.operator_approval.get((token_owner, sender)).unwrap_or(false)), AccessError::SenderNotOwnerOrApproved
        );

        // Set the new owner of the token and reset the approved Identity
        storage.owners.insert(token_id, Option::Some(to));
        if approved.is_some() {
            let update_identity: Option<Identity> = Option::None;
            storage.approved.insert(token_id, update_identity);
        }

        storage.balances.insert(token_owner, storage.balances.get(token_owner).unwrap_or(0) - 1);
        storage.balances.insert(to, storage.balances.get(to).unwrap_or(0) + 1);

        log(TransferEvent {
            from: token_owner,
            sender: sender,
            to: to,
            token_id: token_id,
        });
    }
}
