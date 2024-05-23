library;

use std::{identity::Identity};

pub struct Deposit {
    address: Identity,
    asset: AssetId,
    amount: u64,
}

pub struct Withdrawal {
    address: Identity,
    asset: AssetId,
    amount: u64,
}

pub struct Transfer {
    from: Identity,
    to: Identity,
    asset: AssetId,
    amount: u64,
}
