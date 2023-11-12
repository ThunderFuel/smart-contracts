library;

pub enum PoolErrors {
    OnlyOwner: (),
    ExchangeAlreadyInitialized: (),
    AssetNotSupported: (),
    AmountHigherThanBalance: (),
    CallerMustBeTheExchange: (),
    IdentityMustBeNonZero: (),
}
