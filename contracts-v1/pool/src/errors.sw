library errors;

pub enum Error {
    WrongAmount: (),
    ZeroIdentity: (),
    Unauthorized: (),
    OnlySupportedAssets: (),
    AmountExceedsBalance: (),
    ExchangeInitialized: (),
}
