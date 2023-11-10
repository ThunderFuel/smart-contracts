library;

pub enum StrategyFixedPriceErrors {
    ExchangeAlreadyInitialized: (),
    FeeTooHigh: (),
    CallerMustBeTheExchange: (),
    OrderMismatchedToUpdate: (),
}
