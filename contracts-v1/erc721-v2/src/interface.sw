library;

use std::string::String;

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
    fn set_price(value: Option<u64>);

    #[storage(read)]
    fn get_price() -> Option<u64>;

    #[storage(read, write)]
    fn set_max_mint_per_wallet(value: Option<u64>);

    #[storage(read)]
    fn get_max_mint_per_wallet() -> Option<u64>;
}
