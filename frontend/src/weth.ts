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
        const { value } = await contract.functions
            .deposit()
            .txParams({gasPrice: 1})
            .callParams({forward: coin})
            .call();
        return value;
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
        const { value } = await contract.functions
            .withdraw(withdrawAmount)
            .txParams({gasPrice: 1, variableOutputs: 1})
            .call();
        return value;
    } catch(err: any) {
        console.error("WETH TS SDK: " + err);
        return err;
    }
}
