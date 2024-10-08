import { Provider, WalletUnlocked, WalletLocked, BigNumberish } from "fuels";
import { StrategyFixedPriceSale } from "../../types/execution_strategies/strategy_fixed_price_sale/";
//import { ContractIdInput, AddressInput, IdentityInput, SideInput } from "../../types/execution_strategies/strategy_fixed_price_sale/StrategyFixedPriceSaleAbi";
type AddressInput = { bits: string };
type ContractIdInput = { bits: string };
type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
type Enum<T> = {
    [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };
  }[keyof T];
enum SideInput { Buy = 'Buy', Sell = 'Sell' };

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<StrategyFixedPriceSale> {
    const _provider = await Provider.create(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = await Provider.create(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return new StrategyFixedPriceSale(contractId, walletUnlocked)
    } else if (wallet && typeof wallet !== "string") {
        return new StrategyFixedPriceSale(contractId, wallet)
    }

    return new StrategyFixedPriceSale(contractId, _provider)
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    exchange: string,
    fee: number
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _exchange: ContractIdInput = { bits: exchange };
        const call = await contract.functions
            .initialize(_exchange, fee)
            .txParams({})
            .call();
        const { transactionResponse, transactionResult } = await call.waitForResult()
        return { transactionResponse, transactionResult }
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function setProtocolFee(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    fee: BigNumberish,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const call = await contract.functions
            .set_protocol_fee(fee)
            .txParams({})
            .call();
        const { transactionResult } = await call.waitForResult()
        return { transactionResult };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function getProtocolFee(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_protocol_fee()
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
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
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function getMakerOrderOfUser(
    contractId: string,
    provider: string,
    privateKey: string,
    user: string,
    nonce: BigNumberish,
    isBuyOrder: boolean,
) {
    try {
        let side: SideInput;
        isBuyOrder?
            side = SideInput.Buy :
            side = SideInput.Sell;
        const _user: AddressInput = { bits: user };
        const contract = await setup(contractId, provider, privateKey);
        const { value } = await contract.functions
            .get_maker_order_of_user(_user, nonce, side)
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function isValidOrder(
    contractId: string,
    provider: string,
    privateKey: string,
    user: string,
    nonce: BigNumberish,
    isBuyOrder: boolean,
) {
    try {
        let side: SideInput;
        isBuyOrder?
            side = SideInput.Buy :
            side = SideInput.Sell;
        const _user: AddressInput = { bits: user };
        const contract = await setup(contractId, provider, privateKey);
        const { value } = await contract.functions
            .is_valid_order(_user, nonce, side)
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function getOrderNonceOfUser(
    contractId: string,
    provider: string,
    private_key: string,
    user: string,
    isBuyOrder: boolean,
) {
    try {
        let side: SideInput;
        isBuyOrder?
            side = SideInput.Buy :
            side = SideInput.Sell;
        const _user: AddressInput = { bits: user };
        const contract = await setup(contractId, provider, private_key);
        const { value } = await contract.functions
            .get_order_nonce_of_user(_user, side)
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
        return { err };
    }
}

export async function getMinOrderNonceOfUser(
    contractId: string,
    provider: string,
    user: string,
    isBuyOrder: boolean,
) {
    try {
        let side: SideInput;
        isBuyOrder?
            side = SideInput.Buy :
            side = SideInput.Sell;
        const _user: AddressInput = { bits: user };
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_min_order_nonce_of_user(_user, side)
            .simulate();
        return { value };
    } catch(err: any) {
        console.error("Strategy: " + err);
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
        console.error("Strategy: " + err);
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
        console.error("Strategy: " + err);
        return { err };
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
        console.error("Strategy: " + err);
        return { err };
    }
}
