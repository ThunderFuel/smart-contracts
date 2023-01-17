library pool_interface;

abi Pool {
    #[storage(read, write)]
    fn initialize(exchange: ContractId, asset_manager: ContractId);

    fn name() -> str[12];

    fn symbol() -> str[4];

    fn total_supply(asset: ContractId) -> u64;

    #[storage(read)]
    fn balance_of(account: Identity, asset: ContractId) -> u64;

    #[storage(read, write)]
    fn deposit();

    #[storage(read, write)]
    fn withdraw(asset: ContractId, amount: u64);

    #[storage(read, write)]
    fn transfer_from(from: Identity, to: Identity, asset: ContractId, amount: u64) -> bool;

    #[storage(read, write)]
    fn set_asset_manager(asset_manager: ContractId);
}
