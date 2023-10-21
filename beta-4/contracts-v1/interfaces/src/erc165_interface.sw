library;

abi IERC165 {
    #[storage(read)]
    fn supports_interface(interface_id: u64) -> bool;
}
