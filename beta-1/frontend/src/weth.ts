import { Provider, WalletUnlocked, CoinQuantityLike, ContractIdLike, Address, FunctionInvocationScope, NativeAssetId, BaseWalletUnlocked } from "fuels";
import { WethAbi__factory } from "./contracts/factories/WethAbi__factory";
import { AddressInput, ContractIdInput, IdentityInput } from "./contracts/WethAbi";

const provider = new Provider("https://node-beta-2.fuel.network/graphql");

export async function name(
    contractId: string,
) {
    try {
        const contract = WethAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .name()
            .get();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function symbol(
    contractId: string,
) {
    try {
        const contract = WethAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .symbol()
            .get();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function totalSupply(
    contractId: string,
) {
    try {
        const contract = WethAbi__factory.connect(contractId, provider);
        const { value } = await contract.functions
            .total_supply()
            .get();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function balanceOf(
    contractId: string,
    account: string,
) {
    try {
        const contract = WethAbi__factory.connect(contractId, provider);
        const _account: IdentityInput = { Address: { value: account } };
        const { value } = await contract.functions
            .balance_of(_account)
            .get();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function allowance(
    contractId: string,
    owner: string,
    spender: string,
) {
    try {
        const contract = WethAbi__factory.connect(contractId, provider);
        const _owner: IdentityInput = { Address: { value: owner } };
        const _spender: IdentityInput = { Address: { value: spender } };
        const { value } = await contract.functions
            .allowance(_owner, _spender)
            .get();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function deposit(
    contractId: string,
    walletPublicKey: string,
    depositAmount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const coin: CoinQuantityLike = { amount: depositAmount, assetId: NativeAssetId}
        const { logs } = await contract.functions
            .deposit()
            .txParams({gasPrice: 1})
            .callParams({forward: coin})
            .call();
        return logs;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function withdraw(
    contractId: string,
    walletPublicKey: string,
    withdrawAmount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const { logs } = await contract.functions
            .withdraw(withdrawAmount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return logs;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function approve(
    contractId: string,
    walletPublicKey: string,
    spender: string,
    amount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const _spender: IdentityInput = { ContractId: { value: spender } };
        const { value, logs } = await contract.functions
            .approve(_spender, amount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { value, logs };
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function transfer(
    contractId: string,
    walletPublicKey: string,
    to: string,
    amount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const _to: IdentityInput = { Address: { value: to } };
        const { value, logs } = await contract.functions
            .transfer(_to, amount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { value, logs };
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function transferFrom(
    contractId: string,
    walletPublicKey: string,
    from: string,
    to: string,
    amount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const _from: IdentityInput = { Address: { value: from } };
        const _to: IdentityInput = { Address: { value: to } };
        const { value, logs } = await contract.functions
            .transfer_from(_from, _to, amount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { value, logs };
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function increaseAllowance(
    contractId: string,
    walletPublicKey: string,
    spender: string,
    addedAmount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const _spender: IdentityInput = { ContractId: { value: spender } };
        const { value, logs } = await contract.functions
            .increase_allowance(_spender, addedAmount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { value, logs };
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}

export async function decreaseAllowance(
    contractId: string,
    walletPublicKey: string,
    spender: string,
    subtractedAmount: number,
) {
    try {
        const wallet = new BaseWalletUnlocked(walletPublicKey);
        const contract = WethAbi__factory.connect(contractId, wallet);
        const _spender: IdentityInput = { ContractId: { value: spender } };
        const { value, logs } = await contract.functions
            .decrease_allowance(_spender, subtractedAmount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return { value, logs };
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}
