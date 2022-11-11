import { Provider, BaseWalletLocked, Contract, ContractIdLike } from "fuels";
import { NFTAbi__factory } from "./contracts/factories/NFTAbi__factory";
import { IdentityInput } from "./contracts/NFTAbi";

const provider = new Provider("https://node-beta-1.fuel.network/graphql");

export async function constructor(
    contractId: string,
    walletPublicKey: string,
    accessControl: boolean,
    admin: string,
    maxSupply: number
) {
    try {
        const wallet = new BaseWalletLocked(walletPublicKey, provider);
        const contract = NFTAbi__factory.connect(contractId, wallet);
        const admin_: IdentityInput = { Address: { value: admin }, ContractId: { value: admin } };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .constructor(accessControl, admin_, maxSupply)
            .txParams({gasPrice: 1})
            .call();
        console.log(value);
        console.log(transactionResponse);
        console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("NFT TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function mint(
    contractId: string,
    walletPublicKey: string,
    amount: number,
    to: string
) {
    try {
        const wallet = new BaseWalletLocked(walletPublicKey, provider);
        const contract = NFTAbi__factory.connect(contractId, wallet);
        const to_: IdentityInput = { Address: { value: to }, ContractId: { value: to } };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .mint(amount, to_)
            .txParams({gasPrice: 1})
            .call();
        console.log(value);
        console.log(transactionResponse);
        console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("NFT TS SDK: " + err);
        alert(err.message)
        return err;
    }
}

export async function setApprovalForAll(
    contractId: string,
    walletPublicKey: string,
    approve: boolean,
    operator: string,
) {
    try {
        const wallet = new BaseWalletLocked(walletPublicKey, provider);
        const contract = NFTAbi__factory.connect(contractId, wallet);
        const operator_: IdentityInput = { Address: { value: operator }, ContractId: { value: operator } };
        const { value, transactionResponse, transactionResult } = await contract.functions
            .set_approval_for_all(approve, operator_)
            .txParams({gasPrice: 1})
            .call();
        console.log(value);
        console.log(transactionResponse);
        console.log(transactionResult);
        return { value, transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("NFT TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function isApprovedForAll(
    contractId: string,
    operator: string,
    owner: string,
) {
    try {
        const contract = NFTAbi__factory.connect(contractId, provider);
        const operator_: IdentityInput = { Address: { value: operator }, ContractId: { value: operator } };
        const owner_: IdentityInput = { Address: { value: owner }, ContractId: { value: owner } };
        const { value } = await contract.functions
            .is_approved_for_all(operator_, owner_)
            .get();
        console.log(value);
        return value;
    } catch(err: any) {
        console.error("NFT TS SDK: " + err);
        alert(err.message);
        return err;
    }
}

export async function metaData(
    contractId: string,
    tokenId: number
) {
    try {
        const contract = NFTAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .meta_data(tokenId)
            .get();
        console.log(value);
        return value;
    } catch(err: any) {
        console.error("NFT TS SDK: " + err);
        alert(err.message);
        return err;
    }
}
