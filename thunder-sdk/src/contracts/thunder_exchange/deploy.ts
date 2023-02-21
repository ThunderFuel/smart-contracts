import fs from 'fs';
import { Contract, ContractFactory, Provider, WalletUnlocked, NativeAssetId } from 'fuels';
import path from 'path';

import { PoolAbi__factory } from "../../types/pool/factories/PoolAbi__factory";
import { ExecutionManagerAbi__factory } from "../../types/execution_manager/factories/ExecutionManagerAbi__factory";
import { RoyaltyManagerAbi__factory } from "../../types/royalty_manager/factories/RoyaltyManagerAbi__factory";
import { AssetManagerAbi__factory } from "../../types/asset_manager/factories/AssetManagerAbi__factory";
import { TransferSelectorAbi__factory } from "../../types/transfer_selector/factories/TransferSelectorAbi__factory";
import { TransferManager721Abi__factory } from "../../types/transfer_managers/transfer_manager_721/factories/TransferManager721Abi__factory";
import { NFTAbi__factory } from "../../types/erc721/factories/NFTAbi__factory";
import { StrategyFixedPriceSaleAbi__factory } from "../../types/execution_strategies/strategy_fixed_price_sale/factories/StrategyFixedPriceSaleAbi__factory"
import { ThunderExchangeAbi__factory } from "../../types/thunder_exchange/factories/ThunderExchangeAbi__factory";

import * as Pool from '../pool';
import * as ExecutionManager from '../execution_manager';
import * as RoyaltyManager from '../royalty_manager';
import * as AssetManager from '../asset_manager';
import * as TransferSelector from '../transfer_selector';
import * as TransferManager from '../transfer_managers';
import * as ERC721 from '../erc721';
import * as Strategy from '../execution_strategies';
import * as Exchange from './exchange';

let pool: Contract;
let executionManager: Contract;
let royaltyManager: Contract;
let assetManager: Contract;
let transferSelector: Contract;
let transferManager: Contract;
let erc721: Contract;
let strategy: Contract;
let exchange: Contract;
let contracts: Exchange.Contracts;

const PROVIDER = new Provider('http://127.0.0.1:4000/graphql');
const OWNER = new WalletUnlocked("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", PROVIDER);
const TM1155 = "0x1230000000000000000000000000000000000000000000000000000000000abc";


async function deployAll() {
    // Deploy Exchange
    const exchangeBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/thunder_exchange/out/debug/thunder_exchange.bin'));
    const exchangeFactory = new ContractFactory(exchangeBytecode, ThunderExchangeAbi__factory.abi, OWNER);
    exchange = await exchangeFactory.deployContract();

    // Initialize Exchange
    const { transactionResult: exchangeResult } = await Exchange.initialize(
        exchange.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
    );
    expect(exchangeResult?.status.type).toBe("success");
    const { value } = await Exchange.owner(
        exchange.id.toString(),
        PROVIDER.url,
    );
    expect(value?.Address?.value).toBe(OWNER.address.toB256());

    // Deploy AssetManager
    const assetManagerBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/asset_manager/out/debug/asset_manager.bin'));
    const assetManagerFactory = new ContractFactory(assetManagerBytecode, AssetManagerAbi__factory.abi, OWNER);
    assetManager = await assetManagerFactory.deployContract();

    // Initialize AssetManager
    const { transactionResult } = await AssetManager.initialize(
        assetManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey
    );
    const { transactionResult: result } = await AssetManager.addAsset(
        assetManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        NativeAssetId
    );
    expect(transactionResult?.status.type).toBe("success");
    expect(result?.status.type).toBe("success");

    // Deploy Pool
    const poolBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/pool/out/debug/pool.bin'));
    const poolFactory = new ContractFactory(poolBytecode, PoolAbi__factory.abi, OWNER);
    pool = await poolFactory.deployContract();

    // Initialize Pool
    const { transactionResult: poolResult } = await Pool.initialize(
        pool.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        exchange.id.toB256(),
        assetManager.id.toB256()
    );
    expect(poolResult.status.type).toBe("success");

    // Deploy Strategy
    const strategyBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/execution_strategies/strategy_fixed_price_sale/out/debug/strategy_fixed_price_sale.bin'));
    const strategyFactory = new ContractFactory(strategyBytecode, StrategyFixedPriceSaleAbi__factory.abi, OWNER);
    strategy = await strategyFactory.deployContract();

    // Initialize Strategy
    const { transactionResult: sResult } = await Strategy.initialize(
        strategy.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        exchange.id.toB256(),
    );
    expect(sResult?.status.type).toBe("success");

    const { transactionResult: protocolFeeRes } = await Strategy.setProtocolFee(
        strategy.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        250
    );
    expect(protocolFeeRes?.status.type).toBe("success");

    // Deploy Execution Manager
    const executionManagerBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/execution_manager/out/debug/execution_manager.bin'));
    const executionManagerFactory = new ContractFactory(executionManagerBytecode, ExecutionManagerAbi__factory.abi, OWNER);
    executionManager = await executionManagerFactory.deployContract();

    // Initialize Execution Manager
    const { transactionResult: executionManagerResult } = await ExecutionManager.initialize(
        executionManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey
    );
    const { transactionResult: addStrategy } = await ExecutionManager.addStrategy(
        executionManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        strategy.id.toB256()
    );
    expect(executionManagerResult.status.type).toBe("success");
    expect(addStrategy.status.type).toBe("success");

    // Deploy Transfer Manager
    const transferManagerBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/transfer_managers/transfer_manager_721/out/debug/transfer_manager_721.bin'));
    const transferManagerFactory = new ContractFactory(transferManagerBytecode, TransferManager721Abi__factory.abi, OWNER);
    transferManager = await transferManagerFactory.deployContract();

    // Initialize Transfer Manager
    const { transactionResult: tmInitialize } = await TransferManager.initialize(
        transferManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        exchange.id.toB256()
    );
    expect(tmInitialize.status.type).toBe("success");

    // Deploy Transfer Selector
    const transferSelectorBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/transfer_selector/out/debug/transfer_selector.bin'));
    const transferSelectorFactory = new ContractFactory(transferSelectorBytecode, TransferSelectorAbi__factory.abi, OWNER);
    transferSelector = await transferSelectorFactory.deployContract();

    // Initialize Transfer Selector
    const { transactionResult: tsResult } = await TransferSelector.initialize(
        transferSelector.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        transferManager.id.toB256(),
        TM1155,
    );
    expect(tsResult.status.type).toBe("success");

    // Deploy Royalty Manager
    const royaltyManagerBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/royalty_manager/out/debug/royalty_manager.bin'));
    const royaltyManagerFactory = new ContractFactory(royaltyManagerBytecode, RoyaltyManagerAbi__factory.abi, OWNER);
    royaltyManager = await royaltyManagerFactory.deployContract();

    // Initialize Royalty Manager
    const { transactionResult: rmResult } = await RoyaltyManager.initialize(
        royaltyManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey
    );
    expect(rmResult.status.type).toBe("success");

    const { transactionResult: royaltyFeeRes } = await RoyaltyManager.setRoyaltyFeeLimit(
        royaltyManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        1000
    );
    expect(royaltyFeeRes.status.type).toBe("success");

    // Deploy NFT
    const nftBytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/erc721/out/debug/NFT.bin'));
    const nftFactory = new ContractFactory(nftBytecode, NFTAbi__factory.abi, OWNER);
    erc721 = await nftFactory.deployContract();

    // Initialize NFT
    const { transactionResult: nftResult } = await ERC721.initialize(
        erc721.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        10000,
        transferManager.id.toB256()
    );
    expect(nftResult.status.type).toBe("success");

    const { transactionResult: registerRes } = await RoyaltyManager.registerRoyaltyInfo(
        royaltyManager.id.toString(),
        PROVIDER.url,
        OWNER.privateKey,
        erc721.id.toB256(),
        OWNER.address.toB256(),
        true,
        500
    );
    expect(registerRes.status.type).toBe("success");

    const nftContract = NFTAbi__factory.connect(erc721.id, OWNER);
    const { transactionResult: mintResult } = await nftContract.functions.mint(20, { Address: { value: OWNER.address.toB256() } })
        .txParams({gasPrice: 1})
        .call()
    const { transactionResult: approvalResult } = await nftContract.functions.setApprovalForAll({ ContractId: { value: transferManager.id.toB256() } }, true)
        .txParams({gasPrice: 1})
        .call()

    expect(mintResult.status.type).toBe("success");
    expect(approvalResult.status.type).toBe("success");

    contracts = {
        pool: pool.id.toB256(),
        executionManager: executionManager.id.toB256(),
        royaltyManager: royaltyManager.id.toB256(),
        assetManager: assetManager.id.toB256(),
        transferSelector: transferSelector.id.toB256(),
        transferManager: transferManager.id.toB256(),
    }
    console.log(contracts)
}