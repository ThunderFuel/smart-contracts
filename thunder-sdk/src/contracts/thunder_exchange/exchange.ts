import { Provider, WalletUnlocked, WalletLocked, CoinQuantityLike, Contract, BigNumberish, TransactionResult, TransactionResponse } from "fuels";
import { ThunderExchangeAbi__factory } from "../../types/thunder_exchange";
import { StrategyFixedPriceSaleAbi__factory } from "../../types/execution_strategies/strategy_fixed_price_sale/factories/StrategyFixedPriceSaleAbi__factory";
import { PoolAbi__factory } from "../../types/pool/factories/PoolAbi__factory";
import { ExecutionManagerAbi__factory } from "../../types/execution_manager/factories/ExecutionManagerAbi__factory";
import { RoyaltyManagerAbi__factory } from "../../types/royalty_manager/factories/RoyaltyManagerAbi__factory";
import { AssetManagerAbi__factory } from "../../types/asset_manager/factories/AssetManagerAbi__factory";
import { TransferSelectorAbi__factory } from "../../types/transfer_selector/factories/TransferSelectorAbi__factory";
import { TransferManager721Abi__factory } from "../../types/transfer_managers/transfer_manager_721/factories/TransferManager721Abi__factory";
import { NFTAbi__factory } from "../../types/erc721/factories/NFTAbi__factory";
import { ThunderExchangeAbi, IdentityInput, ContractIdInput, MakerOrderInputInput, SideInput, TakerOrderInput, ExtraParamsInput } from "../../types/thunder_exchange/ThunderExchangeAbi";

export type MakerOrder = {
    isBuySide: boolean;
    maker: string;
    collection: string;
    token_id: BigNumberish;
    price: BigNumberish;
    amount: BigNumberish;
    nonce: BigNumberish;
    strategy: string;
    payment_asset: string;
    expiration_range: BigNumberish;
    extra_params: ExtraParams;
}

export type TakerOrder = {
    isBuySide: boolean,
    taker: string;
    maker: string;
    nonce: BigNumberish;
    price: BigNumberish;
    token_id: BigNumberish;
    collection: string;
    strategy: string;
    extra_params: ExtraParams;
}

export type ExtraParams = {
    extra_address_param: string;
    extra_contract_param: string;
    extra_u64_param: BigNumberish;
}

export type Contracts = {
    pool: string,
    executionManager: string,
    transferSelector: string,
    royaltyManager: string,
    assetManager: string,
    transferManager: string
}

let pool: Contract;
let executionManager: Contract;
let transferSelector: Contract;
let royaltyManager: Contract;
let assetManager: Contract;
let transferManager: Contract;

export function setContracts(
    contracts: Contracts
) {
    pool = new Contract(contracts.pool, PoolAbi__factory.abi);
    executionManager = new Contract(contracts.executionManager, ExecutionManagerAbi__factory.abi);
    transferSelector = new Contract(contracts.transferSelector, TransferSelectorAbi__factory.abi);
    royaltyManager = new Contract(contracts.royaltyManager, RoyaltyManagerAbi__factory.abi);
    assetManager = new Contract(contracts.assetManager, AssetManagerAbi__factory.abi);
    transferManager = new Contract(contracts.transferManager, TransferManager721Abi__factory.abi);
}

function _convertToInput(makerOrder: MakerOrder): MakerOrderInputInput {
    const extraParams: ExtraParamsInput = {
        extra_address_param: { value: makerOrder.extra_params.extra_address_param },
        extra_contract_param: { value: makerOrder.extra_params.extra_contract_param },
        extra_u64_param: makerOrder.extra_params.extra_u64_param,
    };

    const output: MakerOrderInputInput = {
        side: makerOrder.isBuySide ? { Buy: [] } : { Sell: [] },
        maker: { value: makerOrder.maker },
        collection: { value: makerOrder.collection },
        token_id: makerOrder.token_id,
        price: makerOrder.price,
        amount: makerOrder.amount,
        nonce: makerOrder.nonce,
        strategy: { value: makerOrder.strategy },
        payment_asset: { value: makerOrder.payment_asset },
        expiration_range: makerOrder.expiration_range,
        extra_params: extraParams,
    }

    return output
}

function _convertToTakerOrder(takerOrder: TakerOrder): TakerOrderInput {
    const extraParams: ExtraParamsInput = {
        extra_address_param: { value: takerOrder.extra_params.extra_address_param },
        extra_contract_param: { value: takerOrder.extra_params.extra_contract_param },
        extra_u64_param: takerOrder.extra_params.extra_u64_param,
    };

    const output: TakerOrderInput = {
        side: takerOrder.isBuySide ? { Buy: [] } : { Sell: [] },
        taker: { value: takerOrder.taker },
        maker: { value: takerOrder.maker },
        collection: { value: takerOrder.collection },
        token_id: takerOrder.token_id,
        price: takerOrder.price,
        nonce: takerOrder.nonce,
        strategy: { value: takerOrder.strategy },
        extra_params: extraParams,
    }

    return output
}

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
        throw Error(`${err.logs[0]}`);
    }
}

export async function placeOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: MakerOrder,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _order = _convertToInput(order);
        const _strategy = new Contract(order.strategy, StrategyFixedPriceSaleAbi__factory.abi);
        const _collection = new Contract(order.collection, NFTAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .place_order(_order)
            .txParams({gasPrice: 1})
            .addContracts([_strategy, pool, executionManager, assetManager, _collection, transferSelector, contract])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: Place order failed')
    }
}

export async function cancelOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    strategy: string,
    nonce: BigNumberish,
    isBuySide: boolean,
) {
    try {
        let side: SideInput;
        isBuySide ?
            side = { Buy: [] } :
            side = { Sell: [] };
        const contract = await setup(contractId, provider, wallet);
        const _strategy: ContractIdInput = { value: strategy };
        const strategyContract = new Contract(strategy, StrategyFixedPriceSaleAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_order(_strategy, nonce, side)
            .addContracts([strategyContract, executionManager])
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: Cancel order failed')
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
        const _strategy = new Contract(strategy, StrategyFixedPriceSaleAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_all_orders({ value: _strategy.id.toB256() })
            .txParams({gasPrice: 1})
            .addContracts([_strategy])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: cancelAllOrders failed')
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
        const _strategy = new Contract(strategy, StrategyFixedPriceSaleAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .cancel_all_orders_by_side({ value: _strategy.id.toB256() }, side)
            .txParams({gasPrice: 1})
            .addContracts([_strategy])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: cancelAllOrdersBySide failed')
    }
}

export async function executeOrder(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    order: TakerOrder,
    assetId: string,
) {
    const takerOrder = _convertToTakerOrder(order);
    if (order.isBuySide) {
        const { transactionResult, transactionResponse } = await _executeBuyOrder(
            contractId,
            provider,
            wallet,
            takerOrder,
            assetId
        );
        return { transactionResult, transactionResponse }
    }
    const { transactionResult, transactionResponse } = await _executeSellOrder(
        contractId,
        provider,
        wallet,
        takerOrder,
    );
    return { transactionResult, transactionResponse }
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
        const _strategy = new Contract(order.strategy.value, StrategyFixedPriceSaleAbi__factory.abi);
        const _collection = new Contract(order.collection.value, NFTAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .execute_order(order)
            .txParams({gasPrice: 1, variableOutputs: 3})
            .addContracts([_strategy, _collection, royaltyManager, executionManager, transferSelector, transferManager])
            .callParams({forward: coin})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: _executeBuyOrder failed')
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
        const _strategy = new Contract(order.strategy.value, StrategyFixedPriceSaleAbi__factory.abi);
        const _collection = new Contract(order.collection.value, NFTAbi__factory.abi);
        const { transactionResult, transactionResponse } = await contract.functions
            .execute_order(order)
            .txParams({gasPrice: 1, variableOutputs: 3})
            .addContracts([_strategy, _collection, pool, assetManager, royaltyManager, executionManager, transferSelector, transferManager])
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        console.log(err)
        if (err.logs[0]) throw Error(`${err.logs[0]}`);
        console.error(err)
        throw Error('Exchange: _executeSellOrder failed')
    }
}

export async function setPool(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    pool: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _pool: ContractIdInput = { value: pool };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_pool(_pool)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
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
        throw Error(`${err.logs[0]}`);
    }
}

export async function setTransferSelector(
    contractId: string,
    provider: string,
    wallet: string | WalletLocked,
    transferSelector: string,
) {
    try {
        const contract = await setup(contractId, provider, wallet);
        const _transferSelector: ContractIdInput = { value: transferSelector };
        const { transactionResult, transactionResponse } = await contract.functions
            .set_transfer_selector(_transferSelector)
            .txParams({gasPrice: 1})
            .call();
        return { transactionResponse, transactionResult };
    } catch(err: any) {
        throw Error(`${err.logs[0]}`);
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
        throw Error(`${err.logs[0]}`);
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
        throw Error(`${err.logs[0]}`);
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
        throw Error(`${err.logs[0]}`);
    }
}

export async function getPool(
    contractId: string,
    provider: string,
) {
    try {
        const contract = await setup(contractId, provider);
        const { value } = await contract.functions
            .get_pool()
            .get();
        return { value };
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

export async function getTransferSelector(
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
        throw Error(`${err.logs[0]}`);
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
        throw Error(`${err.logs[0]}`);
    }
}
