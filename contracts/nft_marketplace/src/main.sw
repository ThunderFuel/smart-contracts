contract;

dep data_structures;
dep errors;
dep events;
dep interface;
dep constants;
dep utils;
dep nft_interface;
dep weth_interface;

use interface::Thunder;
use data_structures::*;
use errors::*;
use events::*;
use constants::*;
use utils::*;
use nft_interface::NFTAbi;
use weth_interface::WETH;
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
    min_expiration: u64 = 0,
    max_expiration: u64 = 0,
    not_paused: bool = false,
    is_initialized: bool = false,
    is_supported_asset: StorageMap<ContractId, bool> = StorageMap {},
    admin: Option<Address> = Option::None,
    offers: StorageVec<Offer> = StorageVec {},
    fee_receiver: Option<Identity> = Option::None,
    weth: ContractId = ContractId { value: ZERO_B256 },
    bid: StorageMap<(ContractId, u64), HighestBid> = StorageMap {},
    auction: StorageMap<(ContractId, u64), Option<TimedAuction>> = StorageMap {},
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
    if (nft.is_some()) {
        let expiration_date = nft.unwrap().expiration_date;
        let currentTimestamp = timestamp();
        if (expiration_date > currentTimestamp) {
            return true;
        }
        return false;
    }
    return false;
}

#[storage(read)]
fn offer_status(offer_index: u64) -> bool {
    let offer = storage.offers.get(offer_index);
    if (offer.is_some()) {
        let expiration_date = offer.unwrap().expiration_date;
        let currentTimestamp = timestamp();
        if (expiration_date > currentTimestamp) {
            return true;
        }
        return false;
    }
    return false;
}

#[storage(read)]
fn auction_status(contract_Id: ContractId, token_id: u64) -> bool {
    let auction = storage.auction.get((contract_Id, token_id));
    if (auction.is_some()) {
        let expiration_date = auction.unwrap().expiration_date;
        let currentTimestamp = timestamp();
        if (expiration_date > currentTimestamp) {
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
    fn get_listed_nft(contract_Id: ContractId, token_id: u64) -> ListedNFT {
        let nft = storage.listed_nft.get((contract_Id, token_id));
        nft.unwrap()
    }

    #[storage(read)]
    fn get_listing_expiration_date(contract_Id: ContractId, token_id: u64) -> u64 {
        let nft = storage.listed_nft.get((contract_Id, token_id)).unwrap();
        nft.expiration_date
    }

    #[storage(read)]
    fn get_offer_expiration_date(offer_index: u64) -> u64 {
        let offer = storage.offers.get(offer_index).unwrap();
        offer.expiration_date
    }

    #[storage(read)]
    fn get_auction_expiration_date(contract_Id: ContractId, token_id: u64) -> u64 {
        let auction = storage.auction.get((contract_Id, token_id)).unwrap();
        auction.expiration_date
    }

    #[storage(read)]
    fn supported_asset(asset_id: ContractId) -> bool {
        storage.is_supported_asset.get(asset_id)
    }

    #[storage(read)]
    fn get_offer(offer_index: u64) -> Offer {
        storage.offers.get(offer_index).unwrap()
    }

    #[storage(read)]
    fn get_total_offers() -> u64 {
        storage.offers.len()
    }

    #[storage(read)]
    fn is_valid_offer(offer_index: u64) -> bool {
        let status = offer_status(offer_index);
        status
    }

    #[storage(read)]
    fn get_auction(contract_Id: ContractId, token_id: u64) -> TimedAuction {
        let auction = storage.auction.get((contract_Id, token_id));
        auction.unwrap()
    }

    #[storage(read)]
    fn is_valid_auction(contract_Id: ContractId, token_id: u64) -> bool {
        let status = auction_status(contract_Id, token_id);
        status
    }

    #[storage(read)]
    fn get_highest_bid(contract_Id: ContractId, token_id: u64) -> HighestBid {
        let bid = storage.bid.get((contract_Id, token_id));
        bid
    }

    #[storage(read)]
    fn get_weth() -> ContractId {
        storage.weth
    }

    #[storage(read, write)]
    fn constructor(admin: Address, receiver: Identity, fee: u64, weth_contract: ContractId) {
        require(fee <= 50, InputError::FeeIsTooHigh);
        require(!storage.is_initialized, AccessError::AlreadyInitialized);
        require(admin != ZERO_ADDRESS, InputError::AddressCannotBeZero);
        require(weth_contract != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        require(receiver != ZERO_IDENTITY_ADDRESS && receiver != ZERO_IDENTITY_CONTRACT, InputError::IdentityCannotBeZero);

        let admin = Option::Some(admin);
        let fee_receiver = Option::Some(receiver);

        storage.weth = weth_contract;
        storage.min_expiration = 3599;
        storage.max_expiration = 15778464;
        storage.protocol_fee = fee;
        storage.is_initialized = true;
        storage.not_paused = true;
        storage.admin = admin;
        storage.fee_receiver = fee_receiver;
        storage.is_supported_asset.insert(BASE_ASSET_ID, true);
    }

    #[storage(read, write)]
    fn list_nft(contract_Id: ContractId, token_id: u64, asset_id: ContractId, price: u64, expiration: u64) {
        validate_pause();

        let status = listing_status(contract_Id, token_id);
        require(!status, ListingError::AlreadyListed);

        require(price > 0, InputError::PriceCannotBeZero);
        require(storage.is_supported_asset.get(asset_id), AssetError::NotSupported);
        require(contract_Id != ZERO_CONTRACT_ID, InputError::ContractIdCannotBeZero);
        //require(storage.min_expiration < expiration && expiration < storage.max_expiration, InputError::InvalidDateRange);
        require(expiration < storage.max_expiration, InputError::InvalidDateRange);

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

        log(CancelListingEvent {
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
        if (new_expiration != 0) {
            //require(storage.min_expiration < new_expiration && new_expiration < storage.max_expiration, InputError::InvalidDateRange);
            require(new_expiration < storage.max_expiration, InputError::InvalidDateRange);
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

        log(UpdateListingEvent {
            contract_Id,
            token_id,
            new_price,
            new_expiration_date,
        });
    }

    /// Support purchasing NFTs with an asset which is different than listed_asset,
    /// e.g. the seller listed the NFT and wants the payment with ETH but the buyer wants to pay with different asset. Oracle is needed for this

    /// What if user listed an NFT and then transfer it to another address. What would it be in that case? See OpenSea docs

    // consider wash trading
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

        let purchased_nft = PurchasedNFT {
            contract_Id,
            token_id,
            meta_data,
            new_owner,
            purchase_price,
        };

        log(PurchaseEvent {
            nft: purchased_nft,
        });
    }

    #[storage(read, write)]
    fn make_offer(collection: ContractId, token_id: u64, offer_amount: u64, expiration: u64) {
        validate_pause();

        let nft = abi(NFTAbi, collection.into());
        let total_supply = nft.total_supply();
        let sender = get_msg_sender_address_or_panic();

        require(token_id <= total_supply, OfferError::TokenNotExist);
        require(offer_amount > 0, OfferError::ZeroAmount);
        // require(storage.min_expiration < expiration && expiration < storage.max_expiration, InputError::InvalidDateRange);
        require(expiration < storage.max_expiration, InputError::InvalidDateRange);

        let weth = abi(WETH, storage.weth.into());
        let this_contract = Identity::ContractId(contract_id());
        let allowance = weth.allowance(Identity::Address(sender), this_contract);
        require(allowance >= offer_amount, OfferError::InsufficientAllowance);

        let offer = Offer {
            collection: collection,
            token_id: token_id,
            offerer: sender,
            offer_amount: offer_amount,
            expiration_date: timestamp() + expiration,
        };

        storage.offers.push(offer);

        log(OfferEvent {
            offer,
        });
    }

    #[storage(read, write)]
    fn update_offer(offer_index: u64, new_offer_amount: u64, new_expiration: u64) {
        validate_pause();

        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        let status = offer_status(offer_index);
        require(status, OfferError::OfferNotExist);

        require(offer.offerer == sender, OfferError::WrongOfferer);
        require(offer.offer_amount != new_offer_amount && offer.offer_amount > 0, OfferError::WrongAmount);

        let mut new_expiration_date = offer.expiration_date;
        if (new_expiration != 0) {
            //require(storage.min_expiration < new_expiration && new_expiration < storage.max_expiration, InputError::InvalidDateRange);
            require(new_expiration < storage.max_expiration, InputError::InvalidDateRange);
            new_expiration_date = timestamp() + new_expiration;
        }

        let updated_offer = Offer {
            offerer: sender,
            offer_amount: new_offer_amount,
            collection: offer.collection,
            token_id: offer.token_id,
            expiration_date: new_expiration_date,
        };

        storage.offers.set(offer_index, updated_offer);

        log(UpdateOfferEvent {
            collection: offer.collection,
            token_id: offer.token_id,
            offer_index,
            offerer: sender,
            new_offer_amount,
            new_expiration_date,
        });
    }

    #[storage(read, write)]
    fn cancel_offer(offer_index: u64) {
        validate_pause();

        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        let status = offer_status(offer_index);
        require(status, OfferError::OfferNotExist);

        require(offer.offerer == sender, OfferError::WrongOfferer);

        storage.offers.remove(offer_index);

        log(CancelOfferEvent {
            collection: offer.collection,
            token_id: offer.token_id,
            offer_index,
            offerer: sender,
        });
    }

    #[storage(read, write)]
    fn accept_offer(offer_index: u64) {
        validate_pause();

        let offer = storage.offers.get(offer_index).unwrap();
        let sender = get_msg_sender_address_or_panic();

        let status = offer_status(offer_index);
        require(status, OfferError::OfferNotExist);

        let nft = abi(NFTAbi, offer.collection.into());
        let nft_owner = nft.owner_of(offer.token_id);
        let this_contract = Identity::ContractId(contract_id());

        require(Identity::Address(sender) == nft_owner, OfferError::NotOwner);
        require(nft.is_approved_for_all(this_contract, nft_owner), OfferError::NotApproved);

        let status = listing_status(offer.collection, offer.token_id);
        if (status) {
            let none: Option<ListedNFT> = Option::None();
            storage.listed_nft.insert((offer.collection, offer.token_id), none);
        }

        storage.offers.remove(offer_index);

        let offerer = Identity::Address(offer.offerer);
        let offer_amount = offer.offer_amount;
        nft.transfer_from(nft_owner, offerer, offer.token_id);

        let protocol_fee = (offer_amount * storage.protocol_fee) / 1000;
        let fee_receiver = storage.fee_receiver.unwrap();
        let weth = abi(WETH, storage.weth.into());
        require(weth.transfer_from(offerer, fee_receiver, protocol_fee), OfferError::WethTransferFailed);

        let user_amount = offer_amount - protocol_fee;
        require(weth.transfer_from(offerer, Identity::Address(sender), user_amount), OfferError::WethTransferFailed);

        log(AcceptOfferEvent {
            collection: offer.collection,
            token_id: offer.token_id,
            offer_index,
            offer_amount,
            pre_owner: nft_owner,
            new_owner: offerer,
        });
    }

    #[storage(read, write)]
    fn start_auction(contract_Id: ContractId, token_id: u64, starting_price: u64, expiration: u64) {
        validate_pause();

        let list_status = listing_status(contract_Id, token_id);
        require(!list_status, ListingError::AlreadyListed);

        let auc_status = auction_status(contract_Id, token_id);
        require(!auc_status, AuctionError::AlreadyStarted);

        let sender = get_msg_sender_address_or_panic();
        let nft = abi(NFTAbi, contract_Id.into());
        let nft_owner = nft.owner_of(token_id);
        require(Identity::Address(sender) == nft_owner, AuctionError::OnlyOwnerAllowed);

        let this_contract = Identity::ContractId(contract_id());
        require(nft.is_approved_for_all(this_contract, nft_owner), AuctionError::IsNotApprovedForAll);

        // require(storage.min_expiration < expiration && expiration < storage.max_expiration, InputError::InvalidDateRange);
        require(expiration < storage.max_expiration, InputError::InvalidDateRange);

        require(starting_price > 0, InputError::PriceCannotBeZero);

        let auction = TimedAuction {
            contract_Id: contract_Id,
            token_id: token_id,
            seller: sender,
            starting_price: starting_price,
            expiration_date: timestamp() + expiration,
        };

        let timed_auction = Option::Some(auction);
        storage.auction.insert((contract_Id, token_id), timed_auction);

        log(StartAuctionEvent {
            auction: auction,
        });
    }

    #[storage(read, write)]
    fn cancel_auction(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let status = auction_status(contract_Id, token_id);
        require(status, AuctionError::NotStarted);

        let sender = get_msg_sender_address_or_panic();
        let nft = abi(NFTAbi, contract_Id.into());
        let nft_owner = nft.owner_of(token_id);
        require(Identity::Address(sender) == nft_owner, AuctionError::OnlyOwnerAllowed);

        let none: Option<TimedAuction> = Option::None();
        storage.auction.insert((contract_Id, token_id), none);

        log(CancelAuctionEvent {
            contract_Id,
            token_id,
        });
    }

    /// think about contracts are allowed to place a bid
    #[storage(read, write)]
    fn place_bid(contract_Id: ContractId, token_id: u64, bid_amount: u64) {
        validate_pause();

        let status = auction_status(contract_Id, token_id);
        require(status, AuctionError::NotStarted);

        let auction = storage.auction.get((contract_Id, token_id)).unwrap();
        let current_bid = storage.bid.get((contract_Id, token_id));
        let mut min_required_bid_amount = auction.starting_price;
        if (current_bid.bid_amount != 0) {
            min_required_bid_amount = (current_bid.bid_amount * 11000) / 10000;
        }
        require(bid_amount >= min_required_bid_amount, AuctionError::InsufficientBidAmount);

        let weth = abi(WETH, storage.weth.into());
        let this_contract = Identity::ContractId(contract_id());
        let sender = get_msg_sender_address_or_panic();
        let allowance = weth.allowance(Identity::Address(sender), this_contract);
        require(allowance >= bid_amount, AuctionError::InsufficientAllowance);

        let remaining_time = auction.expiration_date - timestamp();
        if (remaining_time <= 600) {
            let extended_time = auction.expiration_date + 600;
            let extended_auction = TimedAuction {
                contract_Id: contract_Id,
                token_id: token_id,
                seller: auction.seller,
                starting_price: auction.starting_price,
                expiration_date: extended_time,
            };
            let extended_timed_auction: Option<TimedAuction> = Option::Some(extended_auction);
            storage.auction.insert((contract_Id, token_id), extended_timed_auction);
        }

        let sender = get_msg_sender_address_or_panic();
        let bid = HighestBid {
            bider: sender,
            bid_amount: bid_amount,
        };
        storage.bid.insert((contract_Id, token_id), bid);

        log(PlaceBidEvent {
            collection: contract_Id,
            token_id: token_id,
            bid: bid,
        });
    }

    #[storage(read, write)]
    fn accept_highest_bid(contract_Id: ContractId, token_id: u64) {
        validate_pause();

        let sender = get_msg_sender_address_or_panic();
        let nft = abi(NFTAbi, contract_Id.into());
        let nft_owner = nft.owner_of(token_id);
        require(Identity::Address(sender) == nft_owner, AuctionError::OnlyOwnerAllowed);

        let auction = storage.auction.get((contract_Id, token_id));
        require(auction.is_some(), AuctionError::NotStarted);

        if (auction.unwrap().expiration_date <= timestamp()) {
            require(timestamp() <= (auction.unwrap().expiration_date + 259200), AuctionError::TimePassedToAccept);
        }

        let none: Option<TimedAuction> = Option::None();
        storage.auction.insert((contract_Id, token_id), none);

        let bid = storage.bid.get((contract_Id, token_id));
        let protocol_fee = (bid.bid_amount * storage.protocol_fee) / 1000;
        let fee_receiver = storage.fee_receiver.unwrap();
        let weth = abi(WETH, storage.weth.into());
        require(weth.transfer_from(Identity::Address(bid.bider), fee_receiver, protocol_fee), AuctionError::WethTransferFailed);

        let user_amount = bid.bid_amount - protocol_fee;
        require(weth.transfer_from(Identity::Address(bid.bider), Identity::Address(sender), user_amount), AuctionError::WethTransferFailed);

        nft.transfer_from(nft_owner, Identity::Address(bid.bider), token_id);

        log(AcceptBidEvent {
            collection: contract_Id,
            token_id: token_id,
            bid: bid,
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

    #[storage(read, write)]
    fn set_min_expiration(min_expiration: u64) {
        validate_admin();
        require(storage.min_expiration > 3599, InputError::InvalidDateRange);
        storage.min_expiration = min_expiration;
    }

    #[storage(read, write)]
    fn set_max_expiration(max_expiration: u64) {
        validate_admin();
        require(storage.max_expiration < 15778464, InputError::InvalidDateRange);
        storage.min_expiration = max_expiration;
    }
}
