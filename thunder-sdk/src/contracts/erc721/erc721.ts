import { Provider, WalletUnlocked, WalletLocked, BigNumberish, Wallet } from "fuels";
import { NFTContractAbi__factory } from "../../types/erc721";
import { NFTContractAbi, ContractIdInput, IdentityInput, AssetIdInput } from "../../types/erc721/NFTContractAbi";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<NFTContractAbi> {
    const _provider = new Provider(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = new Provider(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return NFTContractAbi__factory.connect(contractId, walletUnlocked);
    } else if (wallet && typeof wallet !== "string") {
        return NFTContractAbi__factory.connect(contractId, wallet);
    }

    return NFTContractAbi__factory.connect(contractId, _provider);
}

// export async function initialize(
//     contractId: string,
//     provider: string,
//     wallet: string | WalletLocked,
//     maxSupply: BigNumberish,
//     transferManager: string,
// ) {
//     try {
//         const contract = await setup(contractId, provider, wallet);
//         const _transferManager: ContractIdInput = { value: transferManager };
//         const { transactionResult, transactionResponse } = await contract.functions
//             .initialize(maxSupply, _transferManager)
//             .txParams({gasPrice: 1})
//             .call();
//         return { transactionResponse, transactionResult };
//     } catch(err: any) {
//         throw Error(`ERC721: Initialize failed. Reason: ${err}`);
//     }
// }

export async function mint(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    amount: BigNumberish,
    subId: string,
    to: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _to: IdentityInput = { Address: { value: to } };
        const { transactionResult, transactionResponse, logs } = await contract.functions
            .mint(_to, subId, amount)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult, logs };
    } catch(err: any) {
        throw Error(`ERC721: mint failed. Reason: ${err}`);
    }
}

export async function balanceOf(
    assetId: string,
    owner: string,
) {
    try {
       const wallet = Wallet.fromAddress(owner);
       const balance = await wallet.getBalance(assetId)
        return { balance };
    } catch(err: any) {
        throw Error('ERC721: balanceOf failed');
    }
}

// export async function ownerOf(
//     contractId: string,
//     provider: string,
//     tokenId: BigNumberish,
// ) {
//     try {
//         const contract = await setup(contractId, provider);
//         const { value } = await contract.functions
//             .owner_of(tokenId)
//             .get();
//         return { value };
//     } catch(err: any) {
//         throw Error(`ERC721: ownerOf failed. Reason: ${err}`);
//     }
// }

export async function totalSupply(
    contractId: string,
    provider: string,
    asset: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .total_assets()
            .simulate();
        return { value };
    } catch(err: any) {
        throw Error('ERC721: totalSupply failed');
    }
}
