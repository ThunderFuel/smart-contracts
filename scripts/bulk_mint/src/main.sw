script;

use src_3::SRC3;

/// script that mints tokens like ERC721 style
fn main(collection: ContractId, to: Identity, amount: u64) {
    let collection = abi(SRC3, collection.into());

    let mut i = 0;
    while amount > i {
        let sub_id = i.as_u256().as_b256();
        collection.mint(to, sub_id, 1);

        i += 1;
    }
}
