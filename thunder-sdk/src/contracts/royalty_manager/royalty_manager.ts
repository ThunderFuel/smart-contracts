import { Provider, WalletUnlocked, WalletLocked, BigNumberish, Contract } from "fuels";
import { RoyaltyManager } from "../../types/royalty_manager";
import { NFTContract } from "../../types/erc721"
import { IdentityInput, ContractIdInput } from "../../types/royalty_manager/RoyaltyManager";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<RoyaltyManager> {
    const _provider = await Provider.create(provider)

    if (wallet && typeof wallet === "string") {
        const _provider = await Provider.create(provider)
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return new RoyaltyManager(contractId, walletUnlocked)
    } else if (wallet && typeof wallet !== "string") {
        return new RoyaltyManager(contractId, wallet)
    }

    return new RoyaltyManager(contractId, _provider)
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const call = await contract.functions
            .initialize()
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`RoyaltyManager. initialize failed. Reason: ${err}`)
    }
}

export async function registerRoyaltyInfo(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    collection: string,
    receiver: string,
    isReceiverAddress: boolean,
    fee: BigNumberish,
) {
    try {
        let _receiver: IdentityInput;
        isReceiverAddress ?
            _receiver = { Address: { bits: receiver } } :
            _receiver = { ContractId: { bits: receiver } };
        const contract = await setup(contractId, provider, wallet);
        const _collection: ContractIdInput = { bits: collection };
        const _provider = await Provider.create(provider)
        const _collectionContract = new NFTContract(collection, _provider);
        const call = await contract.functions
            .register_royalty_info(_collection, _receiver, fee)
            .txParams({})
            .addContracts([_collectionContract])
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`RoyaltyManager. registerRoyaltyInfo failed. Reason: ${err}`)
    }
}

export async function getRoyaltyInfo(
    contractId: string,
    provider: string,
    collection: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const _collection: ContractIdInput = { bits: collection };
        const { value } = await contract.functions
            .get_royalty_info(_collection)
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("RoyaltyManager: " + err);
        return { err };
    }
}

export async function setRoyaltyFeeLimit(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    feeLimit: BigNumberish,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const call = await contract.functions
            .set_royalty_fee_limit(feeLimit)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`RoyaltyManager. setRoyaltyFeeLimit failed. Reason: ${err}`)
    }
}

export async function getRoyaltyFeeLimit(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_royalty_fee_limit()
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("RoyaltyManager: " + err);
        return { err };
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
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("RoyaltyManager: " + err);
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
        const _newOwner: IdentityInput = { Address: { bits: newOwner } };
        const call = await contract.functions
            .transfer_ownership(_newOwner)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`RoyaltyManager. transferOwnership failed. Reason: ${err}`)
    }
}

export async function renounceOwnership(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const call = await contract.functions
            .renounce_ownership()
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        throw Error(`RoyaltyManager. renounceOwnership failed. Reason: ${err}`)
    }
}
