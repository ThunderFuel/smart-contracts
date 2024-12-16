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
    ExceedsGiveawayMaxMintLimit: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
