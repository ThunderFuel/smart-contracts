import { Provider, WalletUnlocked, WalletLocked, BigNumberish } from "fuels";
import { TransferManager721Abi__factory } from "../../types/transfer_managers/transfer_manager_721";
import { TransferManager721Abi, IdentityInput, ContractIdInput } from "../../types/transfer_managers/transfer_manager_721/TransferManager721Abi";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<TransferManager721Abi> {
    const _provider = new Provider(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = new Provider(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return TransferManager721Abi__factory.connect(contractId, walletUnlocked);
    } else if (wallet && typeof wallet !== "string") {
        return TransferManager721Abi__factory.connect(contractId, wallet);
    }

    return TransferManager721Abi__factory.connect(contractId, _provider);
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    exchange: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _exchange: ContractIdInput = { value: exchange };
        const { transactionResult, transactionResponse } = await contract.functions
            .initialize(_exchange)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("RoyaltyManager: " + err);
        return { err };
    }
}

export async function getExchange(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_exchange()
            .get();
        return { value };
    } catch(err: any) {
        console.error("RoyaltyManager: " + err);
        return { err };
    }
}
