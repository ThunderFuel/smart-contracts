library;

pub enum PoolErrors {
    OnlyOwner: (),
    OwnerInitialized: (),
    ExchangeAlreadyInitialized: (),
    AssetNotSupported: (),
    AmountHigherThanBalance: (),
    CallerMustBeTheExchange: (),
    IdentityMustBeNonZero: (),
}
