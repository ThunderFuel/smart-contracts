contract;

dep data_structures;
dep errors;
dep events;
dep interface;
dep constants;
dep utils;
dep nft_interface;

use interface::Thunder;
use data_structures::*;
use errors::*;
use events::*;
use constants::*;
use utils::*;
use nft_interface::NFTAbi;
use std::{
    auth::*,
    address::Address,
    block::timestamp,
    context::*,
    logging::log,
    identity::Identity,
    option::Option,
    result::Result,
    revert::require,
    storage::{StorageMap, StorageVec},
    call_frames::*,
    constants::*,
    contract_id::ContractId,
    token::*,
    vec::Vec,
};

storage {
    protocol_fee: u64 = 0,
    not_paused: bool = false,
    is_initialized: bool = false,
    admin: Option<Address> = Option::None,
    fee_receiver: Option<Identity> = Option::None,
    is_supported_asset: StorageMap<ContractId, bool> = StorageMap {},
    offers: StorageVec<Offer> = StorageVec {},
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

#[storage(read)]
fn listing_status(contract_Id: ContractId, token_id: u64) -> bool {
    let nft = storage.listed_nft.get((contract_Id, token_id));
    if(nft.is_some()) {
        let expiration_date = nft.unwrap().expiration_date;
        let currentTimestamp = timestamp();
        if(expiration_date > currentTimestamp) {
            return true;
        }
        return false;
    }
    return false;
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
        let status = listing_status(contract_Id, token_id);
        status
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

    #[storage(read)]
    fn get_offers(offer_index: u64) -> Offer {
        storage.offers.get(offer_index).unwrap()
    }

    #[storage(read)]
    fn get_total_offers() -> u64 {
        storage.offers.len()
    }

    #[storage(read, write)]
    fn constructor(admin: Address, receiver: Identity, fee: u64) {
        require(fee <= 50, InputError::FeeIsTooHigh);
        require(!storage.is_initialized, AccessError::AlreadyInitialized);
        require(admin != ZERO_ADDRESS, InputError::AddressCannotBeZero);
        require(receiver != ZERO_IDENTITY_ADDRESS && receiver != ZERO_IDENTITY_CONTRACT, InputError::IdentityCannotBeZero);

        let admin = Option::Some(admin);
        let fee_receiver = Option::Some(receiver);

        storage.protocol_fee = fee;
        storage.is_initialized = true;
        storage.not_paused = true;
        storage.admin = admin;
        storage.fee_receiver = fee_receiver;
        storage.is_supported_asset.insert(BASE_ASSET_ID, true);
    }

    // TODO: add a function that can set the min and max date range in sec
    // TODO: add a getter func to retrieve the expiration date of a listing
    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, asset_id: ContractId, price: u64, expiration: u64) {
        validate_pause();

        let status = listing_status(contract_Id, token_id);
        require(!status, ListingError::AlreadyListed);

        require(price > 0, InputError::PriceCannotBeZero);
        require(storage.is_supported_asset.get(asset_id), AssetError::NotSupported);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        //require(86399 < expiration && expiration < 15778464, InputError::InvalidDataRange);
        require(expiration < 15778464, InputError::InvalidDataRange);

        let nft = abi(NFTAbi, contract_Id.into());
        let meta_data = nft.meta_data(token_id);
        let owner = msg_sender().unwrap();
        let this_contract = Identity::ContractId(contract_id());

        require(nft.owner_of(token_id) == owner, ListingError::CallerNotOwner);
        require(nft.is_approved_for_all(this_contract, owner), ListingError::IsNotApprovedForAll);

        let expiration_date = timestamp() + expiration;

        let listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            meta_data: meta_data,
            owner: owner,
            asset_id: asset_id,
            price: price,
            expiration_date: expiration_date,
        };

        let listed = Option::Some(listed_nft);
        storage.listed_nft.insert((contract_Id, token_id), listed);

        log(ListEvent {
            nft: listed_nft,
        });
    }

    #[storage(read, write)]
    fn cancel_listing(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let status = listing_status(contract_Id, token_id);
        require(status, ListingError::NotListed);

        let caller = msg_sender().unwrap();
        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(listed_nft.unwrap().owner == caller, ListingError::CallerNotOwner);

        let none: Option<ListedNFT> = Option::None();
        storage.listed_nft.insert((contract_Id, token_id), none);

        log(DeleteEvent {
            contract_Id,
            token_id,
        });
    }

    #[storage(read, write)]
    fn update_listing(contract_Id: ContractId, token_id: u64, new_price: u64, new_expiration: u64) {
        validate_pause();

        let status = listing_status(contract_Id, token_id);
        require(status, ListingError::NotListed);

        require(new_price > 0, InputError::PriceCannotBeZero);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);

        let caller = msg_sender().unwrap();
        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(listed_nft.unwrap().owner == caller, ListingError::CallerNotOwner);

        let mut new_expiration_date = listed_nft.unwrap().expiration_date;
        if(new_expiration != 0) {
            require(86399 < new_expiration && new_expiration < 15778464, InputError::InvalidDataRange);
            new_expiration_date = timestamp() + new_expiration;
        }

        let updated_listed_nft = ListedNFT {
            contract_Id: contract_Id,
            token_id: token_id,
            meta_data: listed_nft.unwrap().meta_data,
            owner: listed_nft.unwrap().owner,
            asset_id: listed_nft.unwrap().asset_id,
            price: new_price,
            expiration_date: new_expiration_date,
        };

        let updated = Option::Some(updated_listed_nft);
        storage.listed_nft.insert((contract_Id, token_id), updated);

        log(UpdateEvent {
            contract_Id,
            token_id,
            new_price,
            new_expiration_date,
        });
    }

    /// Support purchasing NFTs with an asset which is different than listed_asset,
    /// e.g. the seller listed the NFT and wants the payment with ETH but the buyer wants to pay with different asset. Oracle is needed for this

    /// What if user listed an NFT and then transfer it to another address. What would it be in that case? See OpenSea docs
    #[storage(read, write)]
    fn purchase_nft(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let status = listing_status(contract_Id, token_id);
        require(status, ListingError::NotListed);

        let listed_nft = storage.listed_nft.get((contract_Id, token_id));
        require(msg_asset_id() == listed_nft.unwrap().asset_id, PurchaseError::WrongAsset);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);

        require(msg_sender().unwrap() != listed_nft.unwrap().owner, PurchaseError::OwnerCannotPurchase);
        require(msg_amount() == listed_nft.unwrap().price, PurchaseError::WrongAmount);

        let none: Option<ListedNFT> = Option::None();
        storage.listed_nft.insert((contract_Id, token_id), none);

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

    // TODO: add <expiration> parameter
    // TODO: add <offer_status> function like similar to listing_status
    // TODO: add a function that can set the min and max date range in sec
    // TODO: add a getter func to retrieve the expiration date of an offer
    #[storage(read, write)]
    fn make_offer(offer: Offer) {
        let nft = abi(NFTAbi, offer.collection.into());
        let total_supply = nft.total_supply();
        let sender = get_msg_sender_address_or_panic();

        require(offer.token_id <= total_supply, OfferError::TokenNotExist);
        require(offer.offerer == sender, OfferError::WrongOfferer);
        require(offer.offer_amount > 0, OfferError::ZeroAmount);
        require(msg_asset_id() == BASE_ASSET_ID, OfferError::WrongAsset);
        require(msg_amount() == offer.offer_amount, OfferError::WrongAmount);

        storage.offers.push(offer);

        log(OfferEvent {
            offer,
        });
    }

    #[storage(read, write)]
    fn update_offer(collection: ContractId, token_id: u64, offer_index: u64, new_offer_amount: u64) {
        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        //require(offer.is_some(), OfferError::OfferNotExist);
        require(offer.offerer == sender, OfferError::WrongOfferer);
        require(offer.offer_amount != new_offer_amount && offer.offer_amount > 0, OfferError::WrongAmount);

        if new_offer_amount > offer.offer_amount {
            let added_amount = new_offer_amount - offer.offer_amount;
            require(msg_asset_id() == BASE_ASSET_ID, OfferError::WrongAsset);
            require(msg_amount() == added_amount, OfferError::WrongAddedAmount);
        } else if new_offer_amount < offer.offer_amount {
            let transfer_amount = offer.offer_amount - new_offer_amount;
            let identity = Identity::Address(sender);
            transfer(transfer_amount, BASE_ASSET_ID, identity);
        }

        let updated_offer = Offer {
            offerer: sender,
            offer_amount: new_offer_amount,
            collection: collection,
            token_id: token_id,
        };

        storage.offers.insert(offer_index, updated_offer);

        log(UpdateOfferEvent {
            collection,
            token_id,
            offer_index,
            new_offer_amount,
            offerer: sender,
        });
    }

    #[storage(read, write)]
    fn delete_offer(collection: ContractId, token_id: u64, offer_index: u64) {
        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        //require(offer.is_some(), OfferError::OfferNotExist);
        require(offer.offerer == sender, OfferError::WrongOfferer);

        storage.offers.remove(offer_index);

        let transfer_amount = offer.offer_amount;
        let identity = Identity::Address(sender);
        transfer(transfer_amount, BASE_ASSET_ID, identity);

        log(DeleteOfferEvent {
            collection,
            token_id,
            offer_index,
            offerer: sender,
        });
    }

    // TODO: if nft is listed, then delete the listing after offer accepted
    #[storage(read, write)]
    fn accept_offer(collection: ContractId, token_id: u64, offer_index: u64) {
        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        //require(offer.is_some(), OfferError::OfferNotExist);

        let nft = abi(NFTAbi, collection.into());
        let nft_owner = nft.owner_of(token_id);
        let this_contract = Identity::ContractId(contract_id());

        require(Identity::Address(sender) == nft_owner, OfferError::NotOwner);
        require(nft.is_approved_for_all(this_contract, nft_owner), OfferError::NotApproved);

        storage.offers.remove(offer_index);

        let offerer = Identity::Address(offer.offerer);
        let offer_amount = offer.offer_amount;
        nft.transfer_from(nft_owner, offerer, token_id);

        let protocol_fee = (offer_amount * storage.protocol_fee) / 1000;
        let fee_receiver = storage.fee_receiver.unwrap();
        transfer(protocol_fee, BASE_ASSET_ID, fee_receiver);

        let user_amount = offer_amount - protocol_fee;
        transfer(user_amount, BASE_ASSET_ID, nft_owner);

        log(AcceptOfferEvent {
            collection,
            token_id,
            offer_index,
            offer_amount,
            pre_owner: nft_owner,
            new_owner: offerer,
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
        require(receiver != ZERO_IDENTITY_ADDRESS && receiver != ZERO_IDENTITY_CONTRACT, InputError::IdentityCannotBeZero);

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
