library constants;

dep data_structures;

use data_structures::ListedNFT;
use std::{
    address::Address,
    contract_id::ContractId,
    identity::Identity,
};

pub const ZERO_B256 = 0x0000000000000000000000000000000000000000000000000000000000000000;
pub const ZERO_ADDRESS = Address { value: ZERO_B256 };
pub const ZERO_CONTRACT_ID = ContractId { value: ZERO_B256 };
pub const ZERO_IDENTITY = Identity::Address(ZERO_ADDRESS);
