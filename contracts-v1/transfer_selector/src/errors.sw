library errors;

pub enum Error {
    AlreadyInitialized: (),
    ZeroContractId: (),
    TransferManagerAlreadyAdded: (),
    TransferManagerNotAdded: (),
}
