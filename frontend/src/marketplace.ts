import { BytesLike } from "ethers";
import { Provider, Wallet, CoinQuantityLike, NativeAssetId, ContractIdLike, Address } from "fuels";
import { NftMarketplaceAbi__factory } from "./contracts/factories/NftMarketplaceAbi__factory";
import { IdentityInput, ContractIdInput, AddressInput } from "./contracts/NftMarketplaceAbi";

const provider = new Provider("https://node-beta-1.fuel.network/graphql");

export async function admin(
    contractId: string,
) {
    try {
        const contract = NftMarketplaceAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .admin()
            .get();
        //console.log(value);
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
        //console.log(value);
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
        //console.log(value);
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
        //console.log(value);
        return value;
    } catch(err: any) {
        //console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const admin_: AddressInput = { value: admin };
        const receiver_: IdentityInput = { Address: { value: receiver } };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .constructor(admin_, receiver_, protocolFee)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        //console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const asset: ContractIdInput = { value: assetId };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .list_nft(collection, tokenId, asset, price)
            .txParams({gasPrice: 1})
            .addContracts([targetContract])
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        //console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .delete_listing(collection, tokenId)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .update_price(collection, tokenId, newPrice)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
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
    assetId: string,
) {
    try {
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const collection: ContractIdInput = { value: collectionId };
        const targetContract: ContractIdLike = Address.fromString(collectionId);
        const asset: BytesLike = assetId
        const coin: CoinQuantityLike = { amount: price, assetId: asset}
        const { value, transactionResponse, transactionResult } = await contract.functions
            .purchase_nft(collection, tokenId)
            .txParams({gasPrice: 1, variableOutputs: 2})
            .addContracts([targetContract])
            .callParams({forward: coin})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const admin: AddressInput = { value: newAdmin };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .set_admin(admin)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const receiver: IdentityInput = { Address: { value: newFeeReceiver } };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .set_fee_receiver(receiver)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message)
        return err;
    }
}

export async function setPause(
    contractId: string,
    walletPublicKey: string,
) {
    try {
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const { value, transactionResponse, transactionResult } = await contract.functions
            .set_pause()
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
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
        const wallet = new Wallet(walletPublicKey, provider);
        const contract = NftMarketplaceAbi__factory.connect(contractId, wallet);
        const asset: ContractIdInput = { value: assetId };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .add_supported_asset(asset)
            .txParams({gasPrice: 1})
            .call();
        //console.log(value);
        //console.log(transactionResponse);
        //console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Marketplace TS SDK: " + err);
        alert(err.message)
        return err;
    }
}
