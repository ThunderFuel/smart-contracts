library;

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
    InsufficientEth: (),
    AssetIdMismatched: (),
    ExceedsMaxMintLimit: (),
    WithdrawAddressNotSet: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
