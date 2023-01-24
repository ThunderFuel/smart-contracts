library errors;

pub enum Error {
    StrategyAlreadyWhitelisted: (),
    StrategyNotWhitelisted: (),
    IndexOutOfBound: (),
    ZeroLengthVec: (),
}
