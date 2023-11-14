library;

pub enum ExecutionManagerErrors {
    OnlyOwner: (),
    OwnerInitialized: (),
    StrategyAlreadyWhitelisted: (),
    StrategyNotWhitelisted: (),
    ZeroLengthVec: (),
    IndexOutOfBound: (),
}
