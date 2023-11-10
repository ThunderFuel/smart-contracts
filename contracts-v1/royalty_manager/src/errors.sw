library;

pub enum RoyaltyManagerErrors {
    CallerMustBeOwnerOrAdmin: (),
    FeeHigherThanLimit: (),
    FeeLimitTooHigh: (),
}
