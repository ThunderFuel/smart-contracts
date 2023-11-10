library;

pub enum ExecutionManagerErrors {
    StrategyAlreadyWhitelisted: (),
    StrategyNotWhitelisted: (),
    ZeroLengthVec: (),
    IndexOutOfBound: (),
}
