import { BytesLike } from "ethers";
import { Provider, WalletUnlocked, WalletLocked, BigNumberish, CoinQuantityLike, Contract } from "fuels";
import { PoolAbi__factory } from "../../types/pool";
import { AssetManagerAbi__factory } from "../../types/asset_manager/";
import { PoolAbi, ContractIdInput, IdentityInput } from "../../types/pool/PoolAbi";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<PoolAbi> {
    const _provider = new Provider(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = new Provider(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return PoolAbi__factory.connect(contractId, walletUnlocked);
    } else if (wallet && typeof wallet !== "string") {
        return PoolAbi__factory.connect(contractId, wallet);
    }

    return PoolAbi__factory.connect(contractId, _provider);
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    exchange: string,
    assetManager: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _exchange: ContractIdInput = { value: exchange };
        const _Pool: ContractIdInput = { value: assetManager };
        const { transactionResult, transactionResponse } = await contract.functions
            .initialize(_exchange, _Pool)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
    }
}

export async function name(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .name()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}

export async function symbol(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .symbol()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}

export async function totalSupply(
    contractId: string,
    provider: string,
    asset: string,
) {
    try {
        const _asset: ContractIdInput = { value: asset };
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .total_supply(_asset)
            .get();
        return { value };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}

export async function balanceOf(
    contractId: string,
    provider: string,
    account: string,
    asset: string,
) {
    try {
        const _account: IdentityInput = { Address: { value: account } };
        const _asset: ContractIdInput = { value: asset };
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .balance_of(_account, _asset)
            .get();
        return { value };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}

export async function deposit(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    amount: BigNumberish,
    assetId: BytesLike,
    assetManagerAddr: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const coin: CoinQuantityLike = { amount: amount, assetId: assetId };
        const assetManager = new Contract(assetManagerAddr, AssetManagerAbi__factory.abi);
        const { transactionResponse, transactionResult } = await contract.functions
            .deposit()
            .txParams({gasPrice: 1})
            .addContracts([assetManager])
            .callParams({forward: coin})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        throw Error('Pool: Deposit failed');
    }
}

export async function withdraw(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    amount: BigNumberish,
    assetId: string,
    assetManagerAddr: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _asset: ContractIdInput = { value: assetId };
        const assetManager = new Contract(assetManagerAddr, AssetManagerAbi__factory.abi);
        const { transactionResponse, transactionResult } = await contract.functions
            .withdraw(_asset, amount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .addContracts([assetManager])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Pool: Withdraw failed');
    }
}

export async function withdrawAll(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    assetManagerAddr: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const assetManager = new Contract(assetManagerAddr, AssetManagerAbi__factory.abi);
        const { transactionResponse, transactionResult } = await contract.functions
            .withdraw_all()
            .txParams({gasPrice: 1, variableOutputs: 1})
            .addContracts([assetManager])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
    }
}

export async function transferFrom(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    from: string,
    to: string,
    asset: string,
    amount: BigNumberish,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _from: IdentityInput = { Address: { value: from } };
        const _to: IdentityInput = { Address: { value: to } };
        const _asset: ContractIdInput = { value: asset };
        const { transactionResponse, transactionResult } = await contract.functions
            .transfer_from(_from, _to, _asset, amount)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        throw Error("Pool: TransferFrom failed");
    }
}

export async function setAssetManager(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    assetManager: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _Pool: ContractIdInput = { value: assetManager };
        const { transactionResponse, transactionResult } = await contract.functions
            .set_asset_manager(_Pool)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
    }
}

export async function getTransferManager(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_asset_manager()
            .get()
        return { value };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
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
            .get()
        return { value };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
    }
}

export async function owner(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .owner()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}

export async function transferOwnership(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    newOwner: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _newOwner: IdentityInput = { Address: { value: newOwner } };
        const { transactionResult, transactionResponse } = await contract.functions
            .transfer_ownership(_newOwner)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
    }
}

export async function renounceOwnership(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .renounce_ownership()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        console.error("Pool: " + err);
        return { err };
    }
}
