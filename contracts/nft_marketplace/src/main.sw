contract;

dep data_structures;
dep errors;
dep events;
dep interface;
dep constants;
dep nft_interface;

use interface::Thunder;
use data_structures::ListedNFT;
use errors::{InputError, ListingError, PurchaseError};
use events::{ListEvent, PriceUpdateEvent, DeleteEvent, PurchaseEvent};
use constants::*;
use nft_interface::NFTAbi;
use std::{
    auth::*,
    address::Address,
    logging::log,
    identity::Identity,
    option::Option,
    result::Result,
    revert::require,
    storage::StorageMap,
    call_frames::*,
    context::*,
    contract_id::ContractId,
    token::*,
};

storage {
    protocol_fee: u64 = 2,
    is_listed: StorageMap<(Option<ContractId>, u64), bool> = StorageMap {},
    listed_nft: StorageMap<(Option<ContractId>, u64), ListedNFT> = StorageMap {},
}

impl Thunder for Contract {
    /// TODO: add meta_data of the listed NFT in ListEvent
    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, price: u64) {
        require(price > 0, InputError::PriceCannotBeZero);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        require(!storage.is_listed.get((Option::Some(contract_Id), token_id)), ListingError::AlreadyListed);

        let nft = abi(NFTAbi, contract_Id.into());
        let owner = msg_sender().unwrap();
        let this_contract = Identity::ContractId(contract_id());
        require(nft.is_approved_for_all(this_contract, owner), ListingError::IsNotApprovedForAll);

        let listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            owner: owner,
            price: price,
        };

        storage.listed_nft.insert((Option::Some(contract_Id), token_id), listed_nft);
        storage.is_listed.insert((Option::Some(contract_Id), token_id), true);

        log(ListEvent {
            contract_Id,
            token_id,
            owner,
            price,
        });
    }

    #[storage(read, write)]
    fn delete_listing(contract_Id: ContractId, token_id: u64) {
        require(storage.is_listed.get((Option::Some(contract_Id), token_id)), ListingError::NotListed);

        let caller = msg_sender().unwrap();
        let listed_nft= storage.listed_nft.get((Option::Some(contract_Id), token_id));
        require(listed_nft.owner == caller, ListingError::CallerNotOwner);

        storage.listed_nft.insert((Option::Some(contract_Id), token_id), ZERO_LISTED_NFT);
        storage.is_listed.insert((Option::Some(contract_Id), token_id), false);
    }

    #[storage(read, write)]
    fn update_price(contract_Id: ContractId, token_id: u64, new_price: u64) {
        require(new_price > 0, InputError::PriceCannotBeZero);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        require(storage.is_listed.get((Option::Some(contract_Id), token_id)), ListingError::NotListed);

        let caller = msg_sender().unwrap();
        let listed_nft= storage.listed_nft.get((Option::Some(contract_Id), token_id));
        require(listed_nft.owner == caller, ListingError::CallerNotOwner);

        let updated_listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            owner: listed_nft.owner,
            price: new_price,
        };
        storage.listed_nft.insert((Option::Some(contract_Id), token_id), updated_listed_nft);

        log(PriceUpdateEvent {
            contract_Id,
            token_id,
            new_price,
        });
    }

    /// TODO: Support listing/purchasing NFTs with other assets as well.
    /// Add supported_tokens() getter function and add 'purchase_asset' parameter to list_nft(...)

    /// Support purchasing NFTs with an asset which is different than listed_asset,
    /// e.g. the seller listed the NFT and wants the payment with ETH but the buyer wants to pay with different asset. Oracle is needed for this

    /// What if user listed an NFT and then transfer it to some address. What would it be in that case? See OpenSea docs
    #[storage(read, write)]
    fn purchase_nft(contract_Id: ContractId, token_id: u64) {
        require(msg_asset_id() == BASE_TOKEN, PurchaseError::WrongAsset);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        require(storage.is_listed.get((Option::Some(contract_Id), token_id)), ListingError::NotListed);

        let listed_nft= storage.listed_nft.get((Option::Some(contract_Id), token_id));
        require(msg_sender().unwrap() != listed_nft.owner, PurchaseError::OwnerCannotPurchase);
        require(msg_amount() == listed_nft.price, PurchaseError::WrongAmount);

        let protocol_fee = (msg_amount() * storage.protocol_fee) / 100;
        let user_amount = msg_amount() - protocol_fee;
        transfer(user_amount, BASE_TOKEN, listed_nft.owner);

        let nft = abi(NFTAbi, contract_Id.into());
        nft.transfer_from(listed_nft.owner, msg_sender().unwrap(), token_id);

        storage.listed_nft.insert((Option::Some(contract_Id), token_id), ZERO_LISTED_NFT);
        storage.is_listed.insert((Option::Some(contract_Id), token_id), false);

        let new_owner = msg_sender().unwrap();
        let purchase_price = listed_nft.price;

        log(PurchaseEvent {
            contract_Id,
            token_id,
            new_owner,
            purchase_price,
        });
    }
}
