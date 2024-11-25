library;

use std::string::String;

abi SRC3Payable {
    #[payable]
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, token_id: u64, amount: u64);

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64);
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity);
}

abi BaseUri {
    #[storage(read, write)]
    fn set_base_uri(base_uri: String);

    #[storage(read)]
    fn get_base_uri() -> String;
}

abi Setters {
    #[storage(read, write)]
    fn set_public_price(value: u64);

    #[storage(read, write)]
    fn set_whitelist_price(value: u64);

    #[storage(read)]
    fn get_public_price() -> Option<u64>;

    #[storage(read)]
    fn get_whitelist_price() -> Option<u64>;

    #[storage(read, write)]
    fn set_public_max_mint_per_wallet(value: u64);

    #[storage(read, write)]
    fn set_whitelist_max_mint_per_wallet(value: u64);

    #[storage(read)]
    fn get_public_max_mint_per_wallet() -> Option<u64>;

    #[storage(read)]
    fn get_whitelist_max_mint_per_wallet() -> Option<u64>;

    #[storage(read, write)]
    fn set_withdraw_address(value: Identity);

    #[storage(read)]
    fn get_withdraw_address() -> Option<Identity>;

    #[storage(read, write)]
    fn set_whitelisted_addresses(value: Vec<Identity>);

    #[storage(read)]
    fn is_whitelisted(value: Identity) -> bool;

    #[storage(read)]
    fn is_whitelist_phase() -> bool;

    #[storage(read, write)]
    fn toggle_mint_phase();
}

abi Ownership {
    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);

    #[storage(read, write)]
    fn renounce_ownership();
}
