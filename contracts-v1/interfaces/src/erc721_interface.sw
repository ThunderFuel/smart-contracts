library erc721_interface;

use std::{bytes::Bytes, identity::Identity};

pub struct Transfer {
    from: Identity,
    to: Identity,
    tokenId: u64,
}

pub struct Approval {
    owner: Identity,
    approved: Identity,
    tokenId: u64,
}

pub struct ApprovalForAll {
    owner: Identity,
    operator: Identity,
    approved: bool,
}

abi IERC721 {
    fn balanceOf(owner: Identity) -> u64;

    fn ownerOf(tokenId: u64) -> Identity;

    fn safeTransferFrom(from: Identity, to: Identity, tokenId: u64, data: Bytes);

    fn transferFrom(from: Identity, to: Identity, tokenId: u64);

    fn approve(to: Identity, tokenId: u64);

    fn setApprovalForAll(operator: Identity, approved: bool);

    fn getApproved(tokenId: u64) -> Identity;

    fn isApprovedForAll(owner: Identity, operator: Identity) -> bool;

    /// ERC165
    #[storage(read)]
    fn supportsInterface(interfaceId: u64) -> bool;
}
