library;

pub enum StrategyFixedPriceErrors {
    OnlyOwner: (),
    ExchangeAlreadyInitialized: (),
    FeeTooHigh: (),
    CallerMustBeTheExchange: (),
    OrderMismatchedToUpdate: (),
}
