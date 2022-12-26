library events;

use std::{identity::Identity};

pub struct Deposit {
    address: Identity,
    amount: u64,
}

pub struct Withdrawal {
    address: Identity,
    amount: u64,
}

pub struct Aprroval {
    owner: Identity,
    spender: Identity,
    amount: u64,
}

pub struct Transfer {
    from: Identity,
    to: Identity,
    amount: u64,
}
