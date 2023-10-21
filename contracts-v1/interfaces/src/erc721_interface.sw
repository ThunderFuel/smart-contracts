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

abi IERC721 {
    fn balance_of(owner: Identity) -> u64;

    fn owner_of(token_id: u64) -> Option<Identity>;

    fn transfer(to: Identity, token_id: u64);

    fn approve(approved: Option<Identity>, token_id: u64);

    fn set_approval_for_all(approve: bool, operator: Identity);

    fn approved(token_id: u64) -> Option<Identity>;

    fn is_approved_for_all(operator: Identity, owner: Identity) -> bool;

    /// ERC165
    #[storage(read)]
    fn supports_interface(interfaceId: u64) -> bool;
}
