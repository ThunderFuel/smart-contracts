library errors;

pub enum InputError {
    PriceCannotBeZero: (),
    AddressCannotBeZero: (),
    ContractIdCannotBeZero: (),
    IdentityCannotBeZero: (),
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

pub enum AssetError {
    AlreadySupported: (),
    NotSupported: (),
}
