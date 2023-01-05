library msg_sender_address;

use std::{
    address::*,
    auth::*,
    context::*,
    call_frames::*,
    result::*,
    revert::revert,
    identity::Identity,
};

/// Return the sender as an Address or panic
pub fn get_msg_sender_address_or_panic() -> Address {
    let sender: Result<Identity, AuthError> = msg_sender();
    if let Identity::Address(address) = sender.unwrap() {
       address
    } else {
       revert(0);
    }
}
