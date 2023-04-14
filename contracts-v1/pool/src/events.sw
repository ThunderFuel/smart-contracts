library;

use std::{identity::Identity};

pub struct Deposit {
    address: Identity,
    asset: ContractId,
    amount: u64,
}

pub struct Withdrawal {
    address: Identity,
    asset: ContractId,
    amount: u64,
}

pub struct Transfer {
    from: Identity,
    to: Identity,
    asset: ContractId,
    amount: u64,
}
