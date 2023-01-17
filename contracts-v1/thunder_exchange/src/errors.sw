library errors;

pub enum OrderError {
    MismatchedAddress: (),
    StrategyNotWhitelisted: (),
    AssetNotSupported: (),
    WrongExpRange: (),
    InvalidAddress: (),
    NonceCannotBeZero: (),
    PriceCannotBeZero: (),
    AmountCannotBeZero: (),
    ContractIdCannotBeZero: (),
}
