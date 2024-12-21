contract;

mod errors;
mod events;
mod interface;

use errors::{MintError, SetError};
use events::*;
use interface::*;
use standards::{src20::SRC20, src3::SRC3, src5::{SRC5, State}, src7::{Metadata, SRC7},};
use sway_libs::{
    asset::{
        base::{
            _name,
            _set_name,
            _set_symbol,
            _symbol,
            _total_assets,
            _total_supply,
            SetAssetAttributes,
        },
        metadata::*,
        supply::{
            _burn,
            _mint,
        },
    },
    ownership::{
        _owner,
        initialize_ownership,
        transfer_ownership,
        renounce_ownership,
        only_owner,
    },
    pausable::{
        _is_paused,
        _pause,
        _unpause,
        Pausable,
        require_not_paused,
    },
};
use std::{
    call_frames::*,
    context::*,
    hash::Hash,
    storage::storage_string::*,
    string::String,
    bytes_conversions::u64::*,
    bytes::*,
    asset::*,
    logging::log,
    auth::*
};

storage {
    /// The total number of unique assets minted by this contract.
    ///
    /// # Additional Information
    ///
    /// This is the number of NFTs that have been minted.
    total_assets: u64 = 0,
    /// The total number of coins minted for a particular asset.
    ///
    /// # Additional Information
    ///
    /// This should always be 1 for any asset as this is an NFT contract.
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    /// The name associated with a particular asset.
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    /// The symbol associated with a particular asset.
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    /// The metadata associated with a particular asset.
    ///
    /// # Additional Information
    ///
    /// In this NFT contract, there is no metadata provided at compile time. All metadata
    /// is added by users and stored into storage.
    metadata: StorageMetadata = StorageMetadata {},
    base_uri: StorageString = StorageString {},
    base_name: StorageString = StorageString {},
    base_symbol: StorageString = StorageString {},
    public_max_mint_per_wallet: Option<u64> = Option::None,
    whitelist_max_mint_per_wallet: Option<u64> = Option::None,
    public_total_mints_of: StorageMap<Identity, u64> = StorageMap {},
    whitelist_total_mints_of: StorageMap<Identity, u64> = StorageMap {},
    public_price: Option<u64> = Option::None,
    whitelist_price: Option<u64> = Option::None,
    withdraw_address: Option<Identity> = Option::None,
    /// Whitelisted addresses
    is_whitelisted: StorageMap<Identity, bool> = StorageMap {},
    /// Is whitelist phase is open
    is_whitelist_phase: bool = false,
    giveaway_supply: u64 = 0,
}

configurable {
    /// The maximum number of NFTs that may be minted.
    MAX_SUPPLY: u64 = 2019,
    /// The platform drop fee, %5
    DROP_FEE: u64 = 500,
    /// The platform drop fee recipient
    DROP_FEE_RECIPIENT: Address = Address::from(0xb68Cad665f815E808ab59b9D87119da08a306E20383010436A085da9F003452A),
    /// Giveaway amount
    GIVEAWAY_MAX_SUPPLY: u64 = 0
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        _total_assets(storage.total_assets)
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        _total_supply(storage.total_supply, asset)
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        _name(storage.name, asset)
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        _symbol(storage.symbol, asset)
    }

    #[storage(read)]
    fn decimals(_asset: AssetId) -> Option<u8> {
        Some(0u8)
    }
}

impl SRC3Payable for Contract {
    #[payable]
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, token_id: u64, amount: u64) {
        require_not_paused();

        let is_owner = _owner() == State::Initialized(msg_sender().unwrap());
        if (is_owner) {
            let giveaway_supply = storage.giveaway_supply.read();
            require(giveaway_supply <= GIVEAWAY_MAX_SUPPLY, MintError::ExceedsGiveawayMaxMintLimit);

            storage.giveaway_supply.write(giveaway_supply + 1);
        } else {
            if (storage.is_whitelist_phase.try_read().unwrap_or(false)) {
                // Whitelist phase
                let is_whitelisted = storage.is_whitelisted.get(recipient).try_read().unwrap_or(false);
                require(is_whitelisted, MintError::AddressIsNotWhitelisted);

                // Check the ETH amount if any
                let whitelist_price = storage.whitelist_price.try_read().unwrap_or(None);
                let base_asset_id = AssetId::base();
                if (whitelist_price.is_some()) {
                    require(whitelist_price.unwrap() == msg_amount(), MintError::InsufficientEth);
                    require(base_asset_id == msg_asset_id(), MintError::AssetIdMismatched);
                }

                // Check max mint per wallet if any
                let whitelist_max_mint_per_wallet = storage.whitelist_max_mint_per_wallet.try_read().unwrap_or(None);
                let whitelist_total_mints_of = storage.whitelist_total_mints_of.get(recipient).try_read().unwrap_or(0);
                if (whitelist_max_mint_per_wallet.is_some()) {
                    require(whitelist_total_mints_of + 1 <= whitelist_max_mint_per_wallet.unwrap(), MintError::ExceedsMaxMintLimit);
                }

                storage.whitelist_total_mints_of.insert(recipient, whitelist_total_mints_of + 1);

                // Transfer fees and funds
                if (whitelist_price.is_some()) {
                    let withdraw_address = storage.withdraw_address.try_read().unwrap_or(None);
                    require(withdraw_address.is_some(), MintError::WithdrawAddressNotSet);

                    let fee = (whitelist_price.unwrap() * DROP_FEE) / 10000;
                    let remaining = whitelist_price.unwrap() - fee;
                    transfer(Identity::Address(DROP_FEE_RECIPIENT), base_asset_id, fee);
                    transfer(withdraw_address.unwrap(), base_asset_id, remaining);
                }
            } else {
                // Public phase
                // Check the ETH amount if any
                let public_price = storage.public_price.try_read().unwrap_or(None);
                let base_asset_id = AssetId::base();
                if (public_price.is_some()) {
                    require(public_price.unwrap() == msg_amount(), MintError::InsufficientEth);
                    require(base_asset_id == msg_asset_id(), MintError::AssetIdMismatched);
                }

                // Check max mint per wallet if any
                let public_max_mint_per_wallet = storage.public_max_mint_per_wallet.try_read().unwrap_or(None);
                let public_total_mints_of = storage.public_total_mints_of.get(recipient).try_read().unwrap_or(0);
                if (public_max_mint_per_wallet.is_some()) {
                    require(public_total_mints_of + 1 <= public_max_mint_per_wallet.unwrap(), MintError::ExceedsMaxMintLimit);
                }

                storage.public_total_mints_of.insert(recipient, public_total_mints_of + 1);

                // Transfer fees and funds
                if (public_price.is_some()) {
                    let withdraw_address = storage.withdraw_address.try_read().unwrap_or(None);
                    require(withdraw_address.is_some(), MintError::WithdrawAddressNotSet);

                    let fee = (public_price.unwrap() * DROP_FEE) / 10000;
                    let remaining = public_price.unwrap() - fee;
                    transfer(Identity::Address(DROP_FEE_RECIPIENT), base_asset_id, fee);
                    transfer(withdraw_address.unwrap(), base_asset_id, remaining);
                }
            }
        }

        // Checks to ensure this is a valid mint.
        let asset = AssetId::new(ContractId::this(), sub_id);
        require(amount == 1, MintError::CannotMintMoreThanOneNFTWithSubId);
        require(
            storage
                .total_supply
                .get(asset)
                .try_read()
                .is_none(),
            MintError::NFTAlreadyMinted,
        );
        require(
            storage
                .total_assets
                .try_read()
                .unwrap_or(0) + amount <= MAX_SUPPLY,
            MintError::MaxNFTsMinted,
        );

        // Check if metadata is set already
        let key = String::from_ascii_str("uri");
        require(
            storage
                .metadata
                .get(asset, key)
                .is_none(),
            SetError::ValueAlreadySet,
        );

        // Set metadata
        let base_uri = storage.base_uri.read_slice().unwrap();
        let base_name = storage.base_name.read_slice().unwrap();
        let base_symbol = storage.base_symbol.read_slice().unwrap();
        let token_id_string = u64_to_string(token_id);
        let uri = concat_ascii(base_uri, token_id_string);
        let metadata = Metadata::String(uri);
        _set_metadata(storage.metadata, asset, key, metadata);
        _set_name(storage.name, asset, base_name);
        _set_symbol(storage.symbol, asset, base_symbol);

        // Mint the NFT
        let _ = _mint(
            storage
                .total_assets,
            storage
                .total_supply,
            recipient,
            sub_id,
            amount,
        );

        log(MintEvent {
            recipient,
            token_id,
            sub_id
        })
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require_not_paused();
        _burn(storage.total_supply, sub_id, amount);
    }
}

impl SRC7 for Contract {
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata> {
        storage.metadata.get(asset, key)
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

impl SetAssetAttributes for Contract {
    #[storage(write)]
    fn set_name(asset: AssetId, name: String) {
        only_owner();
        require(
            storage
                .name
                .get(asset)
                .read_slice()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_name(storage.name, asset, name);
    }

    #[storage(write)]
    fn set_symbol(asset: AssetId, symbol: String) {
        only_owner();
        require(
            storage
                .symbol
                .get(asset)
                .read_slice()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_symbol(storage.symbol, asset, symbol);
    }

    #[storage(write)]
    fn set_decimals(_asset: AssetId, _decimals: u8) {
        require(false, SetError::ValueAlreadySet);
    }
}

impl Pausable for Contract {
    #[storage(write)]
    fn pause() {
        only_owner();
        _pause();
    }

    #[storage(read)]
    fn is_paused() -> bool {
        _is_paused()
    }

    #[storage(write)]
    fn unpause() {
        only_owner();
        _unpause();
    }
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Identity) {
        initialize_ownership(owner);
        storage.is_whitelist_phase.write(true);
    }
}

impl BaseUri for Contract {
    #[storage(read, write)]
    fn set_base_uri(base_uri: String) {
        only_owner();
        storage.base_uri.write_slice(base_uri);
    }

    #[storage(read)]
    fn get_base_uri() -> String {
        storage.base_uri.read_slice().unwrap()
    }
}

impl Setters for Contract {
    #[storage(read, write)]
    fn set_public_price(value: u64) {
        only_owner();
        storage.public_price.write(Option::Some(value));
    }

    #[storage(read, write)]
    fn set_whitelist_price(value: u64) {
        only_owner();
        storage.whitelist_price.write(Option::Some(value));
    }

    #[storage(read)]
    fn get_public_price() -> Option<u64> {
        storage.public_price.try_read().unwrap_or(Option::None)
    }

    #[storage(read)]
    fn get_whitelist_price() -> Option<u64> {
        storage.whitelist_price.try_read().unwrap_or(Option::None)
    }

    #[storage(read, write)]
    fn set_public_max_mint_per_wallet(value: u64) {
        only_owner();
        storage.public_max_mint_per_wallet.write(Option::Some(value));
    }

    #[storage(read, write)]
    fn set_whitelist_max_mint_per_wallet(value: u64) {
        only_owner();
        storage.whitelist_max_mint_per_wallet.write(Option::Some(value));
    }

    #[storage(read)]
    fn get_public_max_mint_per_wallet() -> Option<u64> {
        storage.public_max_mint_per_wallet.try_read().unwrap_or(Option::None)
    }


    #[storage(read)]
    fn get_whitelist_max_mint_per_wallet() -> Option<u64> {
        storage.whitelist_max_mint_per_wallet.try_read().unwrap_or(Option::None)
    }

    #[storage(read, write)]
    fn set_withdraw_address(value: Identity) {
        only_owner();
        storage.withdraw_address.write(Option::Some(value));
    }

    #[storage(read)]
    fn get_withdraw_address() -> Option<Identity> {
        storage.withdraw_address.try_read().unwrap_or(Option::None)
    }

    #[storage(read, write)]
    fn set_whitelisted_addresses(value: Vec<Identity>) {
        only_owner();

        let mut i = 0;
        let length = value.len();

        while i < length {
            let address_option = value.get(i);
            if (address_option.is_none()) {
                continue;
            }

            storage.is_whitelisted.insert(address_option.unwrap(), true);
            i += 1;
        }
    }

    #[storage(read)]
    fn is_whitelisted(value: Identity) -> bool {
        storage.is_whitelisted.get(value).try_read().unwrap_or(false)
    }

    #[storage(read)]
    fn is_whitelist_phase() -> bool {
        storage.is_whitelist_phase.try_read().unwrap_or(false)
    }

    #[storage(read, write)]
    fn toggle_mint_phase() {
        only_owner();

        let is_whitelist_phase = storage.is_whitelist_phase.try_read().unwrap_or(false);
        if (is_whitelist_phase) {
            storage.is_whitelist_phase.write(false);
        } else {
            storage.is_whitelist_phase.write(true);
        }
    }

    #[storage(write)]
    fn set_base_name(name: String) {
        only_owner();
        storage.base_name.write_slice(name);
    }

    #[storage(write)]
    fn set_base_symbol(symbol: String) {
        only_owner();
        storage.base_symbol.write_slice(symbol);
    }
}

impl Ownership for Contract {
    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        transfer_ownership(new_owner);
    }

    #[storage(read, write)]
    fn renounce_ownership() {
        renounce_ownership();
    }
}

fn concat_ascii(prefix: String, suffix: String) -> String {
    let mut a = prefix.as_bytes();
    let b = suffix.as_bytes();
    a.append(b);
    String::from(a)
}

fn u64_to_string(num: u64) -> String {
    const ASCII_DIGIT_BASE: u8 = 48;
    const RADIX: u64 = 10;
    if num == 0 {
        return String::from_ascii_str("0");
    }

    let mut rem = num;
    let mut buf = Bytes::new();
    while rem > 0 {
        let digit = u8::try_from(rem % RADIX).unwrap();
        buf.insert(0, digit + ASCII_DIGIT_BASE);
        rem /= RADIX;
    }
    String::from(buf)
}
