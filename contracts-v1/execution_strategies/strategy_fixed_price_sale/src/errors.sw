library errors;

pub enum Error {
    ExchangeInitialized: (),
    InvalidOrder: (),
    FeeTooHigh: (),
    UnauthorizedCaller: (),
    NotApprovedForAll: (),
    NotOwner: (),
    MismatchedOrders: (),
    CanceledOrInvalidOrder: (),
    MinNonceExceedsCurrentNonce: (),
    InvalidOrderAmount: (),
}
