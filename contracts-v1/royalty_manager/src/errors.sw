library errors;

pub enum Error {
    CallerNotOwner: (),
    CallerNotAdmin: (),
    FeeLimitTooHigh: (),
    RoyaltyFeeExceedsLimit: (),
}
