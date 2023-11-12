library;

pub enum AssetManagerErrors {
    OnlyOwner: (),
    AssetAlreadySupported: (),
    AssetNotSupported: (),
    ZeroLengthVec: (),
    IndexOutOfBound: (),
}
