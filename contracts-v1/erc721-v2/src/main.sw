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
    logging::log
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
    max_mint_per_wallet: Option<u64> = Option::None,
    total_mints_of: StorageMap<Identity, u64> = StorageMap {},
    price: Option<u64> = Option::None,
    withdraw_address: Option<Identity> = Option::None,
}

configurable {
    /// The maximum number of NFTs that may be minted.
    MAX_SUPPLY: u64 = 50000,
    /// The platform drop fee, %5
    DROP_FEE: u64 = 500,
    /// The platform drop fee recipient
    DROP_FEE_RECIPIENT: Address = Address::from(0xb68Cad665f815E808ab59b9D87119da08a306E20383010436A085da9F003452A),
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

        // Check the ETH amount if any
        let price = storage.price.try_read().unwrap_or(None);
        let base_asset_id = AssetId::base();
        if (price.is_some()) {
            require(price.unwrap() == msg_amount(), MintError::InsufficientEth);
            require(base_asset_id == msg_asset_id(), MintError::AssetIdMismatched);
        }

        // Check max mint per wallet if any
        let max_mint_per_wallet = storage.max_mint_per_wallet.try_read().unwrap_or(None);
        let total_mints_of = storage.total_mints_of.get(recipient).try_read().unwrap_or(0);
        if (max_mint_per_wallet.is_some()) {
            require(total_mints_of + 1 <= max_mint_per_wallet.unwrap(), MintError::ExceedsMaxMintLimit);
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
        let key = String::from_ascii_str("metadata");
        require(
            storage
                .metadata
                .get(asset, key)
                .is_none(),
            SetError::ValueAlreadySet,
        );

        // Set metadata
        let base_uri = storage.base_uri.read_slice().unwrap();
        let token_id_string = u64_to_string(token_id);
        let uri = concat_ascii(base_uri, token_id_string);
        let metadata = Metadata::String(uri);
        _set_metadata(storage.metadata, asset, key, metadata);

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

        storage.total_mints_of.insert(recipient, total_mints_of + 1);

        // Transfer fees and funds
        if (price.is_some()) {
            let withdraw_address = storage.withdraw_address.try_read().unwrap_or(None);
            require(withdraw_address.is_some(), MintError::WithdrawAddressNotSet);

            let fee = (price.unwrap() * DROP_FEE) / 10000;
            let remaining = price.unwrap() - fee;
            transfer(Identity::Address(DROP_FEE_RECIPIENT), base_asset_id, fee);
            transfer(withdraw_address.unwrap(), base_asset_id, remaining);
        }

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
    fn set_price(value: u64) {
        only_owner();
        storage.price.write(Option::Some(value));
    }

    #[storage(read)]
    fn get_price() -> Option<u64> {
        storage.price.try_read().unwrap_or(Option::None)
    }

    #[storage(read, write)]
    fn set_max_mint_per_wallet(value: u64) {
        only_owner();
        storage.max_mint_per_wallet.write(Option::Some(value));
    }

    #[storage(read)]
    fn get_max_mint_per_wallet() -> Option<u64> {
        storage.max_mint_per_wallet.try_read().unwrap_or(Option::None)
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
