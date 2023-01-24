library errors;

pub enum Error {
    AssetAlreadySupported: (),
    AssetNotSupported: (),
    IndexOutOfBound: (),
    ZeroLengthVec: (),
}
