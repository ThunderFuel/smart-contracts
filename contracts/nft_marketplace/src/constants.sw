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
pub const ZERO_LISTED_NFT = ListedNFT {
    contract_Id: ZERO_CONTRACT_ID,
    token_id: 0,
    owner: ZERO_IDENTITY,
    price: 0,
};
pub const BASE_TOKEN = ContractId::from(0x0000000000000000000000000000000000000000000000000000000000000000);
