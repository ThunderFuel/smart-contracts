library;

pub enum RoyaltyManagerErrors {
    OnlyOwner: (),
    OwnerInitialized: (),
    CallerMustBeOwnerOrAdmin: (),
    FeeHigherThanLimit: (),
    FeeLimitTooHigh: (),
}
