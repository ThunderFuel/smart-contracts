library data_structures;

pub struct TokenMetaData {
    // This is left as an example. Support for dynamic length string is needed here
    name: str[7],
    symbol: str[7],
    // Represents 46 char IPFS CID and token_id
    token_uri: (str[46], u64),
}

impl TokenMetaData {
    pub fn new(token_id: u64) -> Self {
        Self {
            name: "Thunder",
            symbol: "THUNDER",
            token_uri: ("QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW", token_id),
        }
    }
}
