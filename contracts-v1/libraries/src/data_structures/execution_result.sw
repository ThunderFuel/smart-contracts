library execution_result;

pub struct ExecutionResult {
    is_executable: bool,
    collection: ContractId,
    token_id: u64,
    amount: u64,
    payment_asset: ContractId,
}
