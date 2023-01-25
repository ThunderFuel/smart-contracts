library errors;

pub enum OrderError {
    MismatchedAddress: (),
    MismatchedPaymentAsset: (),
    MismatchedPrice: (),
    OrderNotExecutable: (),
    StrategyNotWhitelisted: (),
    AssetNotSupported: (),
    WrongExpRange: (),
    InvalidAddress: (),
    NonceCannotBeZero: (),
    PriceCannotBeZero: (),
    AmountCannotBeZero: (),
    ContractIdCannotBeZero: (),
    AmountExceedsPoolBalance: (),
    PoolBalanceTransferFailed: (),
    InvalidTransferManager: (),
}
