library;

abi IERC165 {
    #[storage(read)]
    fn supportsInterface(interfaceId: u64) -> bool;
}
