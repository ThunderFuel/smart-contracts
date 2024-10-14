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
