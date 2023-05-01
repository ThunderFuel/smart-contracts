library;

use std::{identity::Identity};

/// This event MUST be logged when the approved Identity for an NFT is changed or modified.
/// Option::None indicates there is no approved Identity.
pub struct ApprovalEvent {
    approved: Option<Identity>,
    owner: Identity,
    token_id: u64,
}

/// This event MUST be logged when an operator is enabled or disabled for an owner.
/// The operator can manage all NFTs of the owner.
pub struct OperatorEvent {
    approved: bool,
    operator: Identity,
    owner: Identity,
}

/// This event MUST be logged when ownership of any NFT changes between two Identities.
/// Exception: Cases where there is no new or previous owner, formally known as minting and burning,
/// the event SHALL NOT be logged.
pub struct TransferEvent {
    from: Identity,
    sender: Identity,
    to: Identity,
    token_id: u64,
}

pub struct MintEvent {
    owner: Identity,
    token_id: u64,
}

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

abi IERC721 {
    #[storage(read)]
    fn balance_of(owner: Identity) -> u64;

    #[storage(read)]
    fn owner_of(token_id: u64) -> Option<Identity>;

    #[storage(read, write)]
    fn initialize(max_supply: u64, transfer_manager: ContractId);

    #[storage(read, write)]
    fn transfer(to: Identity, token_id: u64);

    #[storage(read, write)]
    fn approve(approved: Option<Identity>, token_id: u64);

    #[storage(write)]
    fn set_approval_for_all(approve: bool, operator: Identity);

    #[storage(read)]
    fn max_supply() -> u64;

    #[storage(read)]
    fn total_supply() -> u64;

    #[storage(read, write)]
    fn mint(amount: u64, to: Identity);

    #[storage(read)]
    fn metadata(token_id: u64) -> TokenMetaData;

    #[storage(read)]
    fn approved(token_id: u64) -> Option<Identity>;

    #[storage(read)]
    fn is_approved_for_all(operator: Identity, owner: Identity) -> bool;

    /// ERC165
    fn supports_interface(interface_id: u64) -> bool;

    /// Ownable
    #[storage(read)]
    fn owner() -> Option<Identity>;
}
