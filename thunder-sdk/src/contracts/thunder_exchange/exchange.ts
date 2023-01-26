import { Provider, WalletUnlocked, WalletLocked, CoinQuantityLike } from "fuels";
import { ThunderExchangeAbi__factory } from "../../types/thunder_exchange";
import { ThunderExchangeAbi, IdentityInput, ContractIdInput, MakerOrderInput, MakerOrderInputInput, SideInput, TakerOrderInput } from "../../types/thunder_exchange/ThunderExchangeAbi";

async function setup(
    contractId: string,
    provider: string,
    wallet?: string | WalletLocked,
): Promise<ThunderExchangeAbi> {
    const _provider = new Provider(provider);

    if (wallet && typeof wallet === "string") {
        const _provider = new Provider(provider);
        const walletUnlocked: WalletUnlocked = new WalletUnlocked(wallet, _provider);
        return ThunderExchangeAbi__factory.connect(contractId, walletUnlocked);
    } else if (wallet && typeof wallet !== "string") {
        return ThunderExchangeAbi__factory.connect(contractId, wallet);
    }

    return ThunderExchangeAbi__factory.connect(contractId, _provider);
}

export async function initialize(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .initialize()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function placeOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: MakerOrderInputInput,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .place_order(order)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function cancelOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: MakerOrderInput,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_order(order)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function cancelAllOrders(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    strategy: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _strategy: ContractIdInput = { value: strategy };
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_all_orders(_strategy)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function cancelAllOrdersBySide(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    strategy: string,
    isBuySide: boolean,
) {
    try {
        let side: SideInput;
        isBuySide ?
            side = { Buy: [] } :
            side = { Sell: [] };
        const contract = await setup(contractId, provider, wallet);
        const _strategy: ContractIdInput = { value: strategy };
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_all_orders_by_side(_strategy, side)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function executeOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: TakerOrderInput,
    assetId: string,
) {
    let buySide: SideInput = { Buy: [] };
    order.side == buySide ?
        _executeBuyOrder(contractId, provider, wallet, order, assetId) :
        _executeSellOrder(contractId, provider, wallet, order);
}

async function _executeBuyOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: TakerOrderInput,
    assetId: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const coin: CoinQuantityLike = { amount: order.price, assetId: assetId };
        const { transactionResult, transactionResponse } = await contract.functions
            .execute_order(order)
            .txParams({gasPrice: 1, variableOutputs: 3})
            .callParams({forward: coin})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

async function _executeSellOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: TakerOrderInput,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .execute_order(order)
            .txParams({gasPrice: 1, variableOutputs: 3})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function setExecutionManager(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    executionManager: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _executionManager: ContractIdInput = { value: executionManager };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_execution_manager(_executionManager)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function setExchange(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    Exchange: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _Exchange: ContractIdInput = { value: Exchange };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_transfer_selector(_Exchange)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function setRoyaltyManager(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    royaltyManager: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _royaltyManager: ContractIdInput = { value: royaltyManager };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_royalty_manager(_royaltyManager)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function setAssetManager(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    assetManager: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _assetManager: ContractIdInput = { value: assetManager };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_asset_manager(_assetManager)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function setProtocolFeeRecipient(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    protocolFeeRecipient: string,
    isRecipientAddress: boolean,
) {
    try {
        let _protocolFeeRecipient: IdentityInput;
        isRecipientAddress ?
            _protocolFeeRecipient = { Address: { value: protocolFeeRecipient } } :
            _protocolFeeRecipient = { ContractId: { value: protocolFeeRecipient } };
        const contract = await setup(contractId, provider, wallet);
        const { transactionResult, transactionResponse } = await contract.functions
            .set_protocol_fee_recipient(_protocolFeeRecipient)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function getExecutionManager(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_execution_manager()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
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
            .get_transfer_selector()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function getRoyaltyManager(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_royalty_manager()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function getAssetManager(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_asset_manager()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}

export async function getProtocolFeeRecipient(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_protocol_fee_recipient()
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
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
            .get();
        return { value };
    } catch(err: any) {
        console.error("Exchange: " + err);
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
        const _newOwner: IdentityInput = { Address: { value: newOwner } };
        const { transactionResult, transactionResponse } = await contract.functions
            .transfer_ownership(_newOwner)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        console.error("Exchange: " + err);
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
        const { transactionResult, transactionResponse } = await contract.functions
            .renounce_ownership()
            .txParams({gasPrice: 1})
            .call();
        return { transactionResult, transactionResponse };
    } catch(err: any) {
        console.error("Exchange: " + err);
        return { err };
    }
}
