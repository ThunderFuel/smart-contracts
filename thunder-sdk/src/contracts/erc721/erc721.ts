import { Provider, WalletUnlocked, WalletLocked, BigNumberish, Wallet, FunctionInvocationScope, getMintedAssetId, CoinQuantityLike } from "fuels";
import { NFTContract } from "../../types/erc721";
import { Erc721V2 } from "../../types/erc721-v2";
import { IdentityInput } from "../../types/erc721/NFTContract";

function numberTo64Hex (num: BigNumberish) {
    return '0x' + num.toString(16).padStart(64, '0');
}

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<NFTContract> {
    const _provider = await Provider.create(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = await Provider.create(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return new NFTContract(contractId, walletUnlocked)
    } else if (wallet && typeof wallet !== "string") {
        return new NFTContract(contractId, wallet)
    }

    return new NFTContract(contractId, _provider)
}

async function setupV2(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<Erc721V2> {
    const _provider = await Provider.create(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = await Provider.create(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return new Erc721V2(contractId, walletUnlocked)
    } else if (wallet && typeof wallet !== "string") {
        return new Erc721V2(contractId, wallet)
    }

    return new Erc721V2(contractId, _provider)
}

export async function constructor(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    owner: string
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const call = await contract.functions
            .constructor({ Address: { bits: owner } })
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`ERC721: mint failed. Reason: ${err}`);
    }
}

export async function mint(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    amount: BigNumberish,
    subId: BigNumberish,
    to: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const stringSubId = numberTo64Hex(subId)
        const _to: IdentityInput = { Address: { bits: to } };
        const call = await contract.functions
            .mint(_to, stringSubId, amount)
            .txParams({})
            .call();
        const { transactionResult, logs } = await call.waitForResult()
        return { transactionResult, logs };
    } catch(err: any) {
        throw Error(`ERC721: mint failed. Reason: ${err}`);
    }
}

export async function bulkMintWithMulticall(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    to: string,
    amount: number,
) {
    let calls: FunctionInvocationScope<any[], any>[] = [];

    const contract = await setup(contractId, provider, wallet);
    const currentIndexBN = await totalSupply(contractId, provider, wallet);
    const currentIndex = Number(currentIndexBN.value) === 0 ? 1 : Number(currentIndexBN.value)

    for (let i=currentIndex; i<(currentIndex + amount); i++) {
        const stringSubId = numberTo64Hex(i);
        const _to: IdentityInput = { Address: { bits: to } };
        const mintCall = contract.functions
            .mint(_to, stringSubId, 1)
            .txParams({variableOutputs: 1})
        calls.push(mintCall);
    }

    if (calls.length === 0) return null;

    try {
        const call = await contract.multiCall(calls)
            .txParams({ variableOutputs: amount})
            .call();
        const { transactionResult, logs } = await call.waitForResult()
        return { transactionResult, logs };
    } catch(err: any) {
        throw Error(`ERC721: bulkMintWithMulticall failed. Reason: ${err}`);
    }
}

export async function balanceOf(
    assetId: string,
    owner: string,
    provider: Provider
) {
    try {
       const wallet = Wallet.fromAddress(owner, provider);
       const balance = await wallet.getBalance(assetId)
        return { balance };
    } catch(err: any) {
        throw Error('ERC721: balanceOf failed');
    }
}

export async function totalSupply(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .total_assets()
            .get();
        return { value };
    } catch(err: any) {
        throw Error(`ERC721: totalSupply failed. Reason: ${err}`);
    }
}

export async function transfer(
    contractId: string,
    provider: Provider,
    wallet: WalletLocked,
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish
) {
    try {
        const _to = Wallet.fromAddress(to, provider);
        const zeroX = "0x";
        const fill0 = tokenId.toString().padStart(64, "0");
        const subId = fill0.padStart(66, zeroX);
        const assetId = getMintedAssetId(contractId, subId);

        const res = await wallet.transfer(_to.address, amount, assetId, {  });
        const txResult = await res.wait();
        return txResult;
    } catch(err: any) {
        throw Error(`ERC721: transfer failed. Reason: ${err}`);
    }
}

export async function getMetadata(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    tokenId: BigNumberish,
) {
    const zeroX = "0x";
    const fill0 = tokenId.toString().padStart(64, "0");
    const subId = fill0.padStart(66, zeroX);
    const assetId = getMintedAssetId(contractId, subId);

    try {
        const contract = await setup(contractId, provider, wallet);
        const { value } = await contract.functions
            .metadata({ bits: assetId }, "metadata")
            .simulate();
        return { value };
    } catch(err: any) {
        throw Error(`ERC721: getMetadata failed. Reason: ${err}`);
    }
}

/*** v2 functions ****/
export async function mintV2 (
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    subId: BigNumberish,
    to: string,
    price: BigNumberish,
    baseAssetId: string
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const stringSubId = numberTo64Hex(subId);
        const coin: CoinQuantityLike = { amount: price, assetId: baseAssetId };
        const _to: IdentityInput = { Address: { bits: to } };
        const call = await contract.functions
            .mint(_to, stringSubId, 1)
            .txParams({variableOutputs: 3})
            .callParams({forward: coin})
            .call();
        const { transactionResult, logs } = await call.waitForResult()
        return { transactionResult, logs };
    } catch(err: any) {
        throw Error(`ERC721: mintV2 failed. Reason: ${err}`);
    }
}

export async function bulkMintV2 (
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    to: string,
    tokenIds: number[],
    pricePerNft: BigNumberish,
    baseAssetId: string
) {
    let calls: FunctionInvocationScope<any[], any>[] = [];

    const contract = await setupV2(contractId, provider, wallet);

    for (const tokenId of tokenIds) {
        const stringSubId = numberTo64Hex(tokenId);
        const coin: CoinQuantityLike = { amount: pricePerNft, assetId: baseAssetId };
        const _to: IdentityInput = { Address: { bits: to } };
        const mintCall = contract.functions
            .mint(_to, stringSubId, 1)
            .txParams({ variableOutputs: 3 })
            .callParams({ forward: coin })
        calls.push(mintCall);
    }

    if (calls.length === 0) return null;

    try {
        const call = await contract.multiCall(calls)
            .txParams({variableOutputs: (calls.length * 3)})
            .call();
        const { transactionResult, logs } = await call.waitForResult()
        return { transactionResult, logs };
    } catch(err: any) {
        throw Error(`ERC721: bulkMintV2 failed. Reason: ${err}`);
    }
}

export async function setBaseUri(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    baseUri: string
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const call = await contract.functions
            .set_base_uri(baseUri)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`ERC721: setBaseUri failed. Reason: ${err}`);
    }
}

export async function setPrice(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    price: BigNumberish
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const call = await contract.functions
            .set_price(price)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`ERC721: setPrice failed. Reason: ${err}`);
    }
}

export async function setMaxMintPerWallet(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    maxMintPerWallet: number
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const call = await contract.functions
            .set_max_mint_per_wallet(maxMintPerWallet)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`ERC721: setMaxMintPerWallet failed. Reason: ${err}`);
    }
}

export async function setWithdrawAddress(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    withdrawAddress: string
) {
    try {
        const contract = await setupV2(contractId, provider, wallet);
        const call = await contract.functions
            .set_withdraw_address({ Address: { bits: withdrawAddress } })
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`ERC721: setWithdrawAddress failed. Reason: ${err}`);
    }
}
