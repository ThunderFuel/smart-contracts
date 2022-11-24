contract;

dep data_structures;
dep errors;
dep events;
dep interface;
dep constants;
dep utils;
dep nft_interface;

use interface::Thunder;
use data_structures::ListedNFT;
use errors::*;
use events::*;
use constants::*;
use utils::*;
use nft_interface::NFTAbi;
use std::{
    auth::*,
    address::Address,
    context::*,
    logging::log,
    identity::Identity,
    option::Option,
    result::Result,
    revert::require,
    storage::StorageMap,
    call_frames::*,
    constants::*,
    contract_id::ContractId,
    token::*,
};

storage {
    protocol_fee: u64 = 20,
    not_paused: bool = false,
    is_initialized: bool = false,
    admin: Option<Address> = Option::None,
    fee_receiver: Option<Identity> = Option::None,
    is_listed: StorageMap<(ContractId, u64), bool> = StorageMap {},
    is_supported_asset: StorageMap<ContractId, bool> = StorageMap {},
    listed_nft: StorageMap<(ContractId, u64), Option<ListedNFT>> = StorageMap {},
}

#[storage(read)]
fn validate_admin() {
    let sender = get_msg_sender_address_or_panic();
    let admin = storage.admin;
    require(admin.is_some() && admin.unwrap() == sender, AccessError::CallerIsNotAdmin);
}

#[storage(read)]
fn validate_pause() {
    let status = storage.not_paused;
    require(status, AccessError::ContractIsPaused);
}

impl Thunder for Contract {

    #[storage(read)]
    fn admin() -> Address {
        let admin = storage.admin;
        require(admin.is_some(), AccessError::AdminDoesNotExist);
        admin.unwrap()
    }

    #[storage(read)]
    fn fee_receiver() -> Identity {
        let receiver = storage.fee_receiver;
        require(receiver.is_some(), AccessError::ReceiverDoesNotExist);
        receiver.unwrap()
    }

    #[storage(read)]
    fn pause() -> bool {
        storage.not_paused
    }

    #[storage(read)]
    fn initialized() -> bool {
        storage.is_initialized
    }

    #[storage(read)]
    fn protocol_fee() -> u64 {
        storage.protocol_fee
    }

    #[storage(read)]
    fn is_listed(contract_Id: ContractId, token_id: u64) -> bool {
        storage.is_listed.get((contract_Id, token_id))
    }

    #[storage(read)]
    fn listed_nft(contract_Id: ContractId, token_id: u64) -> ListedNFT {
        let nft = storage.listed_nft.get((contract_Id, token_id));
        nft.unwrap()
    }

    #[storage(read)]
    fn supported_asset(asset_id: ContractId) -> bool {
        storage.is_supported_asset.get(asset_id)
    }

    #[storage(read, write)]
    fn constructor(admin: Address, receiver: Identity, fee: u64) {
        require(fee <= 50, InputError::FeeIsTooHigh);
        require(!storage.is_initialized, AccessError::AlreadyInitialized);
        require(admin != ZERO_ADDRESS, InputError::AddressCannotBeZero);
        require(receiver != ZERO_IDENTITY, InputError::IdentityCannotBeZero);

        let admin = Option::Some(admin);
        let fee_receiver = Option::Some(receiver);

        storage.protocol_fee = fee;
        storage.is_initialized = true;
        storage.not_paused = true;
        storage.admin = admin;
        storage.fee_receiver = fee_receiver;
        storage.is_supported_asset.insert(BASE_ASSET_ID, true);
    }

    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, asset_id: ContractId, price: u64) {
        validate_pause();

        require(price > 0, InputError::PriceCannotBeZero);
        require(storage.is_supported_asset.get(asset_id), AssetError::NotSupported);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        require(!storage.is_listed.get((contract_Id, token_id)), ListingError::AlreadyListed);

        let nft = abi(NFTAbi, contract_Id.into());
        let meta_data = nft.meta_data(token_id);
        let owner = msg_sender().unwrap();
        let this_contract = Identity::ContractId(contract_id());
        require(nft.is_approved_for_all(this_contract, owner), ListingError::IsNotApprovedForAll);

        let listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            meta_data: meta_data,
            owner: owner,
            asset_id: asset_id,
            price: price,
        };

        let listed = Option::Some(listed_nft);
        storage.listed_nft.insert((contract_Id, token_id), listed);
        storage.is_listed.insert((contract_Id, token_id), true);

        log(ListEvent {
            contract_Id,
            token_id,
            meta_data,
            owner,
            asset_id,
            price,
        });
    }

    #[storage(read, write)]
    fn delete_listing(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(listed_nft.is_some(), ListingError::NotListed);
        require(storage.is_listed.get((contract_Id, token_id)), ListingError::NotListed);

        let caller = msg_sender().unwrap();
        require(listed_nft.unwrap().owner == caller, ListingError::CallerNotOwner);

        let none: Option<ListedNFT> = Option::None();
        storage.listed_nft.insert((contract_Id, token_id), none);
        storage.is_listed.insert((contract_Id, token_id), false);
    }

    #[storage(read, write)]
    fn update_price(contract_Id: ContractId, token_id: u64, new_price: u64) {
        validate_pause();

        require(new_price > 0, InputError::PriceCannotBeZero);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);

        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(listed_nft.is_some(), ListingError::NotListed);
        require(storage.is_listed.get((contract_Id, token_id)), ListingError::NotListed);

        let caller = msg_sender().unwrap();
        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(listed_nft.unwrap().owner == caller, ListingError::CallerNotOwner);

        let updated_listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            meta_data: listed_nft.unwrap().meta_data,
            owner: listed_nft.unwrap().owner,
            asset_id: listed_nft.unwrap().asset_id,
            price: new_price,
        };

        let updated = Option::Some(updated_listed_nft);
        storage.listed_nft.insert((contract_Id, token_id), updated);

        log(PriceUpdateEvent {
            contract_Id,
            token_id,
            new_price,
        });
    }

    /// Support purchasing NFTs with an asset which is different than listed_asset,
    /// e.g. the seller listed the NFT and wants the payment with ETH but the buyer wants to pay with different asset. Oracle is needed for this

    /// What if user listed an NFT and then transfer it to another address. What would it be in that case? See OpenSea docs
    #[storage(read, write)]
    fn purchase_nft(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(msg_asset_id() == listed_nft.unwrap().asset_id, PurchaseError::WrongAsset);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);

        require(listed_nft.is_some(), ListingError::NotListed);
        require(storage.is_listed.get((contract_Id, token_id)), ListingError::NotListed);

        require(msg_sender().unwrap() != listed_nft.unwrap().owner, PurchaseError::OwnerCannotPurchase);
        require(msg_amount() == listed_nft.unwrap().price, PurchaseError::WrongAmount);

        let none: Option<ListedNFT> = Option::None();
        storage.listed_nft.insert((contract_Id, token_id), none);
        storage.is_listed.insert((contract_Id, token_id), false);

        let protocol_fee = (msg_amount() * storage.protocol_fee) / 1000;
        let fee_receiver = storage.fee_receiver.unwrap();

        let nft = abi(NFTAbi, contract_Id.into());
        nft.transfer_from(listed_nft.unwrap().owner, msg_sender().unwrap(), token_id);

        transfer(protocol_fee, listed_nft.unwrap().asset_id, fee_receiver);

        let user_amount = msg_amount() - protocol_fee;
        transfer(user_amount, listed_nft.unwrap().asset_id, listed_nft.unwrap().owner);

        let meta_data = listed_nft.unwrap().meta_data;
        let new_owner = msg_sender().unwrap();
        let purchase_price = listed_nft.unwrap().price;

        log(PurchaseEvent {
            contract_Id,
            token_id,
            meta_data,
            new_owner,
            purchase_price,
        });
    }

    #[storage(read, write)]
    fn set_admin(admin: Address) {
        validate_admin();
        require(admin != ZERO_ADDRESS, InputError::AddressCannotBeZero);

        let admin = Option::Some(admin);
        storage.admin = admin;
    }

    #[storage(read, write)]
    fn set_fee_receiver(receiver: Identity) {
        validate_admin();
        require(receiver != ZERO_IDENTITY, InputError::IdentityCannotBeZero);

        let fee_receiver = Option::Some(receiver);
        storage.fee_receiver = fee_receiver;
    }

    #[storage(read, write)]
    fn set_pause() {
        validate_admin();

        let new_status = !storage.not_paused;
        storage.not_paused = new_status;
    }

    #[storage(read, write)]
    fn set_protocol_fee(new_fee: u64) {
        validate_admin();
        require(new_fee <= 50, InputError::FeeIsTooHigh);

        storage.protocol_fee = new_fee;
    }

    #[storage(read, write)]
    fn add_supported_asset(asset_id: ContractId) {
        validate_admin();
        require(!storage.is_supported_asset.get(asset_id), AssetError::AlreadySupported);

        storage.is_supported_asset.insert(asset_id, true);
    }

    #[storage(read, write)]
    fn remove_supported_asset(asset_id: ContractId) {
        validate_admin();
        require(storage.is_supported_asset.get(asset_id), AssetError::NotSupported);

        storage.is_supported_asset.insert(asset_id, false);
    }
}
