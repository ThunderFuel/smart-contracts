library;

pub enum AssetManagerErrors {
    OwnerInitialized: (),
    OnlyOwner: (),
    AssetAlreadySupported: (),
    AssetNotSupported: (),
    ZeroLengthVec: (),
    IndexOutOfBound: (),
}
