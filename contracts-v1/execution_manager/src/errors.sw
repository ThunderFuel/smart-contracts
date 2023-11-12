library;

pub enum ExecutionManagerErrors {
    OnlyOwner: (),
    StrategyAlreadyWhitelisted: (),
    StrategyNotWhitelisted: (),
    ZeroLengthVec: (),
    IndexOutOfBound: (),
}
