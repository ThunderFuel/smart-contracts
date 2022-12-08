library errors;

pub enum Error {
    WrongAmount: (),
    ZeroIdentity: (),
    OnlyWETH: (),
    OnlyBaseAsset: (),
    AmountExceedsBalance: (),
    InsufficientAllowance: (),
    DecreasedAllowanceBelowZero: (),
}
