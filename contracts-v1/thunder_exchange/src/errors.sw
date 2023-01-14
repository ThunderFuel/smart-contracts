library errors;

pub enum OrderError {
    MismatchedAddress: (),
    StrategyNotWhitelisted: (),
    AssetNotSupported: (),
    WrongExpRange: (),
    InvalidAddress: (),
    PriceCannotBeZero: (),
    AmountCannotBeZero: (),
    ContractIdCannotBeZero: (),
}
