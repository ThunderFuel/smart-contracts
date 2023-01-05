library ownable;

dep msg_sender_address;

use msg_sender_address::get_msg_sender_address_or_panic;

use std::{
    address::Address,
    assert::assert,
    storage::{get, store}
};

const OWNER: b256 = 0x1000000000000000000000000000000000000000000000000000000000000000;
const IS_INITIALIZED: b256 = 0x2000000000000000000000000000000000000000000000000000000000000000;

const ZERO_ADDRESS: Address = Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);

// TODO: Update according to the 721 standard

#[storage(read, write)]
pub fn initializer(new_owner: Address) {
    let status = get::<bool>(IS_INITIALIZED);
    assert(!status);

    store::<bool>(IS_INITIALIZED, true);
    _transfer_onwership(new_owner);
}

#[storage(read)]
pub fn only_owner() {
    let sender = get_msg_sender_address_or_panic();
    let owner = get::<Address>(OWNER);
    assert(owner == sender);
}

#[storage(read)]
pub fn owner() -> Address {
    get::<Address>(OWNER)
}

#[storage(write)]
pub fn renounce_ownership() {
    _transfer_onwership(ZERO_ADDRESS);
}

#[storage(read, write)]
pub fn transfer_onwership(new_owner: Address) {
    only_owner();
    _transfer_onwership(new_owner);
}

#[storage(write)]
fn _transfer_onwership(new_owner: Address) {
    store::<Address>(OWNER, new_owner);
}
