library erc721_interface;

dep data_structures;

use data_structures::*;
use std::{identity::Identity};

pub const ERC721_INTERFACE_ID = 0x80ac58cd;
pub const ERC1155_INTERFACE_ID = 0xd9b67a26;

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
    #[storage(read)]
    fn balanceOf(user: Identity) -> u64;

    #[storage(read)]
    fn ownerOf(tokenId: u64) -> Identity;

    #[storage(read, write)]
    fn initialize(maxSupply: u64);

    #[storage(read, write)]
    fn safeTransferFrom(from: Identity, to: Identity, tokenId: u64);

    #[storage(read, write)]
    fn transferFrom(from: Identity, to: Identity, tokenId: u64);

    #[storage(read, write)]
    fn approve(to: Identity, tokenId: u64);

    #[storage(write)]
    fn setApprovalForAll(operator: Identity, approved: bool);

    #[storage(read)]
    fn maxSupply() -> u64;

    #[storage(read)]
    fn totalSupply() -> u64;

    #[storage(read, write)]
    fn mint(amount: u64, to: Identity);

    #[storage(read)]
    fn metadata(tokenId: u64) -> TokenMetaData;

    #[storage(read)]
    fn getApproved(tokenId: u64) -> Identity;

    #[storage(read)]
    fn isApprovedForAll(user: Identity, operator: Identity) -> bool;

    /// ERC165
    fn supportsInterface(interfaceId: u64) -> bool;

    /// Ownable
    #[storage(read)]
    fn owner() -> Option<Identity>;
}
