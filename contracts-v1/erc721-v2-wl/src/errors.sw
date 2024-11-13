library;

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
    InsufficientEth: (),
    AssetIdMismatched: (),
    ExceedsMaxMintLimit: (),
    WithdrawAddressNotSet: (),
    AddressIsNotWhitelisted: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
