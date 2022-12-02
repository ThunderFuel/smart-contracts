import { BytesLike } from "ethers";
import { Provider, WalletUnlocked, CoinQuantityLike, ContractIdLike, Address, FunctionInvocationScope, NativeAssetId } from "fuels";
import { NftMarketplaceAbi__factory } from "./contracts/factories/NftMarketplaceAbi__factory";
import { IdentityInput, ContractIdInput, AddressInput, OfferInput } from "./contracts/NftMarketplaceAbi";

const provider = new Provider("https://node-beta-2.fuel.network/graphql");

export async function admin(
    contractId: string,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .admin()
            .get();
        return value;
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function feeReceiver(
    contractId: string,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .fee_receiver()
            .get();
        return value;
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function pause(
    contractId: string,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .pause()
            .get();
        return value;
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function supportedAsset(
    contractId: string,
    targetContract: string,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const target: ContractIdInput = { value: targetContract };
        const { value } = await contract.functions
            .supported_asset(target)
            .get();
        return value;
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function getOffer(
    contractId: string,
    collectionId: string,
    tokenId: number,
    offerIndex: number,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const collection: ContractIdInput = { value: collectionId };
        const { value } = await contract.functions
            .get_offers(collection, tokenId, offerIndex)
            .get();
        return value;
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function getTotalOffers(
    contractId: string,
    collectionId: string,
    tokenId: number,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const collection: ContractIdInput = { value: collectionId };
        const { value } = await contract.functions
            .get_total_offers(collection, tokenId)
            .get();
        return value;
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function constructor(
    contractId: string,
    walletPublicKey: string,
    admin: string,
    receiver: string,
    protocolFee: number,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const admin_: AddressInput = { value: admin };
        const receiver_: IdentityInput = { Address: { value: receiver } };
        const { transactionResponse, transactionResult } = await contract.functions
            .constructor(admin_, receiver_, protocolFee)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function listNft(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    assetId: string,
    price: number,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const asset: ContractIdInput = { value: assetId };
        const { logs, transactionResponse, transactionResult, functionScopes } = await contract.functions
            .list_nft(collection, tokenId, asset, price)
            .txParams({gasPrice: 1})
            .addContracts([targetContract])
            .call();
        return { logs, transactionResponse, transactionResult, functionScopes };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function deleteListing(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .delete_listing(collection, tokenId)
            .txParams({gasPrice: 1})
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function updatePrice(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    newPrice: number,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .update_price(collection, tokenId, newPrice)
            .txParams({gasPrice: 1})
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function purchaseNft(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    price: number,
    assetID: string,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const asset: BytesLike = assetID
        const coin: CoinQuantityLike = { amount: price, assetId: asset}
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .purchase_nft(collection, tokenId)
            .txParams({gasPrice: 1, variableOutputs: 2})
            .addContracts([targetContract])
            .callParams({forward: coin})
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function makeOffer(
    contractId: string,
    walletPublicKey: string,
    offererAddress: string,
    collectionId: string,
    tokenId: number,
    offerAmount: number,
) {
    try {
        const offerer: AddressInput = { value: offererAddress };
        const collection: ContractIdInput = { value: collectionId };
        const offer: OfferInput = {
            offerer: offerer,
            offer_amount: offerAmount,
            collection: collection,
            token_id: tokenId,
        }
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const coin: CoinQuantityLike = { amount: offerAmount, assetId: NativeAssetId}
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .make_offer(offer)
            .txParams({gasPrice: 1})
            .callParams({forward: coin})
            .addContracts([targetContract])
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function updateOffer(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    oldOfferAmount: number,
    newOfferAmount: number,
    offerIndex: number,
) {
    try {
        const collection: ContractIdInput = { value: collectionId };
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);

        if (newOfferAmount == oldOfferAmount) {
            return null
        } else if (newOfferAmount > oldOfferAmount) {
            const addedAmount = newOfferAmount - oldOfferAmount;
            const coin: CoinQuantityLike = { amount: addedAmount, assetId: NativeAssetId}
            const { logs, transactionResponse, transactionResult } = await contract.functions
                .update_offer(collection, tokenId, offerIndex, newOfferAmount)
                .txParams({gasPrice: 1, variableOutputs: 1})
                .callParams({forward: coin})
                .call();
            return { logs, transactionResponse, transactionResult };
        } else {
            const { logs, transactionResponse, transactionResult } = await contract.functions
                .update_offer(collection, tokenId, offerIndex, newOfferAmount)
                .txParams({gasPrice: 1, variableOutputs: 1})
                .call();
            return { logs, transactionResponse, transactionResult };
        }
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function deleteOffer(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    offerIndex: number,
) {
    try {
        const collection: ContractIdInput = { value: collectionId };
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .delete_offer(collection, tokenId, offerIndex)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function acceptOffer(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
    offerIndex: number,
) {
    try {
        const collection: ContractIdInput = { value: collectionId };
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const { logs, transactionResponse, transactionResult } = await contract.functions
            .accept_offer(collection, tokenId, offerIndex)
            .txParams({gasPrice: 1, variableOutputs: 2})
            .addContracts([targetContract])
            .call();
        return { logs, transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function setAdmin(
    contractId: string,
    walletPublicKey: string,
    newAdmin: string,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const admin: AddressInput = { value: newAdmin };
        const { transactionResponse, transactionResult } = await contract.functions
            .set_admin(admin)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message)
        return err;
    }
}

export async function setFeeReceiver(
    contractId: string,
    walletPublicKey: string,
    newFeeReceiver: string,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const receiver: IdentityInput = { Address: { value: newFeeReceiver } };
        const { transactionResponse, transactionResult } = await contract.functions
            .set_fee_receiver(receiver)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function setPause(
    contractId: string,
    walletPublicKey: string,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const { transactionResponse, transactionResult } = await contract.functions
            .set_pause()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function addSupportedAsset(
    contractId: string,
    walletPublicKey: string,
    assetId: string,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const asset: ContractIdInput = { value: assetId };
        const { transactionResponse, transactionResult } = await contract.functions
            .add_supported_asset(asset)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

export async function isListed(
    contractId: string,
    walletPublicKey: string,
    collectionId: string,
    tokenId: number,
) {
    try {
        const wallet = new WalletUnlocked(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const { value } = await contract.functions
            .is_listed(collection, tokenId)
            .get()
        return { value };
    } catch(err: any) {
        alert(err.message)
        return err;
    }
}

type data = {
    collectionId: string;
    tokenId: number;
    assetId: string;
    price: number;
}

export async function bulkListing(
    contractId: string,
    walletPublicKey: string,
    listings: data[]
) {
    const wallet = new WalletUnlocked(walletPublicKey, provider);
    const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);

    let calls: FunctionInvocationScope<any[], any>[] = [];
    let contracts: ContractIdLike[] = [];

    for(const listing of listings) {
        const { collectionId, tokenId, assetId, price } = listing;
        const collection: ContractIdInput = { value: collectionId };
        const asset: ContractIdInput = { value: assetId };
        const targetContract: ContractIdLike = Address.fromString(collectionId);

        if(!contracts.includes(targetContract)) {
            contracts.push(targetContract);
        }

        const call = contract.functions.list_nft(collection, tokenId, asset, price).addContracts([targetContract])
        calls.push(call);
    }

    let unvalidCalls: FunctionInvocationScope<any[], any>[] = []

    for(const call of calls) {
        try {
            await call.simulate()
        } catch(err) {
            unvalidCalls.push(call)
        }
    }

    console.log(unvalidCalls)

    const validCalls = calls.filter((call) => !unvalidCalls.includes(call));

    if(validCalls.length === 0) {
        return null;
    }

    const bulkTx = await contract.multiCall(validCalls)
        .addContracts(contracts)
        .txParams({gasPrice: 1})
        .call();
    return bulkTx.logs;
}

export async function bulkPurchasing(
    contractId: string,
    walletPublicKey: string,
    purchases: data[]
) {
    const wallet = new WalletUnlocked(walletPublicKey, provider);
    const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);

    let calls: FunctionInvocationScope<any[], any>[] = [];
    let contracts: ContractIdLike[] = [];

    for(const purchase of purchases) {
        const { collectionId, tokenId, assetId, price } = purchase;
        const collection: ContractIdInput = { value: collectionId };
        const asset: BytesLike = assetId
        const coin: CoinQuantityLike = { amount: price, assetId: asset}
        const targetContract: ContractIdLike = Address.fromString(collectionId);

        if(!contracts.includes(targetContract)) {
            contracts.push(targetContract);
        }

        const call = contract.functions.purchase_nft(collection, tokenId)
            .addContracts([targetContract])
            .txParams({gasPrice: 1, variableOutputs: 2})
            .addContracts([targetContract])
            .callParams({forward: coin})
        calls.push(call);
    }

    let unvalidCalls: FunctionInvocationScope<any[], any>[] = []

    for(const call of calls) {
        try {
            await call.simulate()
        } catch(err) {
            unvalidCalls.push(call)
        }
    }

    console.log(unvalidCalls)

    const validCalls = calls.filter((call) => !unvalidCalls.includes(call));

    if(validCalls.length === 0) {
        return null;
    }

    const bulkTx = await contract.multiCall(validCalls)
        .addContracts(contracts)
        .txParams({gasPrice: 1})
        .call();
    return bulkTx.logs;
}
