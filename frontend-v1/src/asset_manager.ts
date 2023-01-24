import { Provider, WalletUnlocked, WalletLocked } from "fuels";
import { AssetManagerAbi__factory } from "./contracts/factories/AssetManagerAbi__factory";
import { AssetManagerAbi, ContractIdInput, IdentityInput } from "./contracts/AssetManagerAbi";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<AssetManagerAbi> {
    const _provider = new Provider(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = new Provider(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return AssetManagerAbi__factory.connect(contractId, walletUnlocked);
    } else if (wallet && typeof wallet !== "string") {
        return AssetManagerAbi__factory.connect(contractId, wallet);
    }

    return AssetManagerAbi__factory.connect(contractId, _provider);
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked
) {
    try {
        const contract = await setup(contractId, provider, wallet)
        const { transactionResult, transactionResponse } = await contract.functions
            .initialize()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function addAsset(
    contractId: string,
    provider: string,
    asset: string,
    wallet?: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet)
        const _asset: ContractIdInput = { value: asset };
        const { transactionResult, transactionResponse } = await contract.functions
            .add_asset(_asset)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function removeAsset(
    contractId: string,
    provider: string,
    asset: string,
    wallet?: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _asset: ContractIdInput = { value: asset };
        const { transactionResult, transactionResponse } = await contract.functions
            .remove_asset(_asset)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function isAssetSupported(
    contractId: string,
    provider: string,
    asset: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const _asset: ContractIdInput = { value: asset };
        const { value } = await contract.functions
            .is_asset_supported(_asset)
            .get();
        return { value };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function getSupportedAssets(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_supported_assets()
            .get();
        return { value };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function getCountSupportedAssets(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_count_supported_assets()
            .get();
        return { value };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
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
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function transferOwnership(
    contractId: string,
    provider: string,
    newOwner: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const _newOwner: IdentityInput = { Address: { value: newOwner } };
        const { transactionResult, transactionResponse } = await contract.functions
            .transfer_ownership(_newOwner)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}

export async function renounceOwnership(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { transactionResult, transactionResponse } = await contract.functions
            .renounce_ownership()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        console.error("AssetManager: " + err);
        return err;
    }
}
