library;

pub enum StrategyFixedPriceErrors {
    OnlyOwner: (),
    OwnerInitialized: (),
    ExchangeAlreadyInitialized: (),
    FeeTooHigh: (),
    CallerMustBeTheExchange: (),
    OrderMismatchedToUpdate: (),
}
