library;

pub enum PoolErrors {
    ExchangeAlreadyInitialized: (),
    AssetNotSupported: (),
    AmountHigherThanBalance: (),
    CallerMustBeTheExchange: (),
    IdentityMustBeNonZero: (),
}
