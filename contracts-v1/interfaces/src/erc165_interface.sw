library erc165_interface;

abi IERC165 {
    #[storage(read)]
    fn supportsInterface(interfaceId: u64) -> bool;
}
