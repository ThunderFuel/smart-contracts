library;

pub enum RoyaltyManagerErrors {
    OnlyOwner: (),
    CallerMustBeOwnerOrAdmin: (),
    FeeHigherThanLimit: (),
    FeeLimitTooHigh: (),
}
