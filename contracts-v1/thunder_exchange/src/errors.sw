library;

pub enum ThunderExchangeErrors {
    OnlyOwner: (),
    AmountHigherThanPoolBalance: (),
    AssetIdNotMatched: (),
    AmountNotMatched: (),
    StrategyMustBeNonZeroContract: (),
    StrategyNotWhitelisted: (),
    MakerMustBeNonZeroAddress: (),
    TakerMustBeNonZeroAddress: (),
    CallerMustBeMaker: (),
    ExpirationRangeOutOfBound: (),
    NonceMustBeNonZero: (),
    PriceMustBeNonZero: (),
    AmountMustBeNonZero: (),
    AssetNotSupported: (),
    ExecutionInvalid: (),
    PaymentAssetMismatched: (),
    PriceMismatched: (),
    AmountMismatched: (),
    PoolTransferFromFailed: (),
    PoolMismatchedAssetBalance: (),
}
