library errors;

pub enum InputError {
    PriceCannotBeZero: (),
    ContractIdCannotBeZero: (),
}

pub enum ListingError {
    AlreadyListed: (),
    NotListed: (),
    IsNotApprovedForAll: (),
    CallerNotOwner: (),
}

pub enum PurchaseError {
    WrongAsset: (),
    WrongAmount: (),
    OwnerCannotPurchase: (),
}