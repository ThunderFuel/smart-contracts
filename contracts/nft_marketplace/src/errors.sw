library errors;

pub enum InputError {
    PriceCannotBeZero: (),
    AddressCannotBeZero: (),
    ContractIdCannotBeZero: (),
    IdentityCannotBeZero: (),
    FeeIsTooHigh: (),
}

pub enum AccessError {
    CallerIsNotAdmin: (),
    AdminDoesNotExist: (),
    ReceiverDoesNotExist: (),
    AlreadyInitialized: (),
    ContractIsPaused: (),
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

pub enum OfferError {
    TokenNotExist: (),
    WrongOfferer: (),
    ZeroAmount: (),
    OfferNotExist: (),
    WrongCollection: (),
    WrongTokenId: (),
    WrongAmount: (),
    WrongAddedAmount: (),
    WrongAsset: (),
    NotOwner: (),
    NotApproved: (),
}

pub enum AssetError {
    AlreadySupported: (),
    NotSupported: (),
}
