import { readFileSync } from "fs";
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
let strategyFixedPrice: Contract;
let strategyAuction: Contract;
let exchange: Contract;
let contracts: Exchange.Contracts;

const localTestnet = new Provider('http://127.0.0.1:4000/graphql');
const beta3Testnet = new Provider("https://beta-3.fuel.network/graphql");

const main = async (provider: Provider) => {
    const OWNER = new WalletUnlocked("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", provider);
    const TM1155 = "0x1230000000000000000000000000000000000000000000000000000000000abc";

    const deployAll = async () => {
        // Deploy Exchange
        const exchangeBytecode = readFileSync(path.join(__dirname, '../../bin-files/thunder_exchange.bin'));
        const exchangeFactory = new ContractFactory(exchangeBytecode, ThunderExchangeAbi__factory.abi, OWNER);
        exchange = await exchangeFactory.deployContract({gasPrice: 1});

        // Initialize Exchange
        await Exchange.initialize(
            exchange.id.toString(),
            provider.url,
            OWNER.privateKey,
        );

        await Exchange.owner(
            exchange.id.toString(),
            provider.url,
        );

        // Deploy AssetManager
        const assetManagerBytecode = readFileSync(path.join(__dirname, '../../bin-files/asset_manager.bin'));
        const assetManagerFactory = new ContractFactory(assetManagerBytecode, AssetManagerAbi__factory.abi, OWNER);
        assetManager = await assetManagerFactory.deployContract({gasPrice: 1});

        // Initialize AssetManager
        await AssetManager.initialize(
            assetManager.id.toString(),
            provider.url,
            OWNER.privateKey
        );

        await AssetManager.addAsset(
            assetManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            NativeAssetId
        );

        // Deploy Pool
        const poolBytecode = readFileSync(path.join(__dirname, '../../bin-files/pool.bin'));
        const poolFactory = new ContractFactory(poolBytecode, PoolAbi__factory.abi, OWNER);
        pool = await poolFactory.deployContract({gasPrice: 1});

        // Initialize Pool
        await Pool.initialize(
            pool.id.toString(),
            provider.url,
            OWNER.privateKey,
            exchange.id.toB256(),
            assetManager.id.toB256()
        );

        // Deploy Strategy Fixed Price Sale
        const strategyBytecode = readFileSync(path.join(__dirname, '../../bin-files/strategy_fixed_price_sale.bin'));
        const strategyFactory = new ContractFactory(strategyBytecode, StrategyFixedPriceSaleAbi__factory.abi, OWNER);
        strategyFixedPrice = await strategyFactory.deployContract({gasPrice: 1});

        // Initialize Strategy Fixed Price Sale
        await Strategy.initialize(
            strategyFixedPrice.id.toString(),
            provider.url,
            OWNER.privateKey,
            exchange.id.toB256(),
        );

        await Strategy.setProtocolFee(
            strategyFixedPrice.id.toString(),
            provider.url,
            OWNER.privateKey,
            250
        );

        // Deploy Strategy Auction
        const strategyAuctionBytecode = readFileSync(path.join(__dirname, '../../bin-files/strategy_auction.bin'));
        const strategyAuctionFactory = new ContractFactory(strategyAuctionBytecode, StrategyFixedPriceSaleAbi__factory.abi, OWNER);
        strategyAuction = await strategyAuctionFactory.deployContract({gasPrice: 1});

        // Initialize Strategy Auction
        await Strategy.initialize(
            strategyAuction.id.toString(),
            provider.url,
            OWNER.privateKey,
            exchange.id.toB256(),
        );

        await Strategy.setProtocolFee(
            strategyAuction.id.toString(),
            provider.url,
            OWNER.privateKey,
            250
        );

        // Deploy Execution Manager
        const executionManagerBytecode = readFileSync(path.join(__dirname, '../../bin-files/execution_manager.bin'));
        const executionManagerFactory = new ContractFactory(executionManagerBytecode, ExecutionManagerAbi__factory.abi, OWNER);
        executionManager = await executionManagerFactory.deployContract({gasPrice: 1});

        // Initialize Execution Manager
        await ExecutionManager.initialize(
            executionManager.id.toString(),
            provider.url,
            OWNER.privateKey
        );
        await ExecutionManager.addStrategy(
            executionManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            strategyFixedPrice.id.toB256()
        );
        await ExecutionManager.addStrategy(
            executionManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            strategyAuction.id.toB256()
        );

        // Deploy Transfer Manager
        const transferManagerBytecode = readFileSync(path.join(__dirname, '../../bin-files/transfer_manager_721.bin'));
        const transferManagerFactory = new ContractFactory(transferManagerBytecode, TransferManager721Abi__factory.abi, OWNER);
        transferManager = await transferManagerFactory.deployContract({gasPrice: 1});

        // Initialize Transfer Manager
        await TransferManager.initialize(
            transferManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            exchange.id.toB256()
        );

        // Deploy Transfer Selector
        const transferSelectorBytecode = readFileSync(path.join(__dirname, '../../bin-files/transfer_selector.bin'));
        const transferSelectorFactory = new ContractFactory(transferSelectorBytecode, TransferSelectorAbi__factory.abi, OWNER);
        transferSelector = await transferSelectorFactory.deployContract({gasPrice: 1});

        // Initialize Transfer Selector
        await TransferSelector.initialize(
            transferSelector.id.toString(),
            provider.url,
            OWNER.privateKey,
            transferManager.id.toB256(),
            TM1155,
        );

        // Deploy Royalty Manager
        const royaltyManagerBytecode = readFileSync(path.join(__dirname, '../../bin-files/royalty_manager.bin'));
        const royaltyManagerFactory = new ContractFactory(royaltyManagerBytecode, RoyaltyManagerAbi__factory.abi, OWNER);
        royaltyManager = await royaltyManagerFactory.deployContract({gasPrice: 1});

        // Initialize Royalty Manager
        await RoyaltyManager.initialize(
            royaltyManager.id.toString(),
            provider.url,
            OWNER.privateKey
        );

        await RoyaltyManager.setRoyaltyFeeLimit(
            royaltyManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            1000
        );

        // Deploy NFT
        const nftBytecode = readFileSync(path.join(__dirname, '../../bin-files/NFT.bin'));
        const nftFactory = new ContractFactory(nftBytecode, NFTAbi__factory.abi, OWNER);
        erc721 = await nftFactory.deployContract({gasPrice: 1});

        // Initialize NFT
        await ERC721.initialize(
            erc721.id.toString(),
            provider.url,
            OWNER.privateKey,
            10000,
            transferManager.id.toB256()
        );

        await RoyaltyManager.registerRoyaltyInfo(
            royaltyManager.id.toString(),
            provider.url,
            OWNER.privateKey,
            erc721.id.toB256(),
            OWNER.address.toB256(),
            true,
            500
        );

        const nftContract = NFTAbi__factory.connect(erc721.id, OWNER);
        await nftContract.functions.mint(20, { Address: { value: OWNER.address.toB256() } })
            .txParams({gasPrice: 1})
            .call()
        await nftContract.functions.setApprovalForAll({ ContractId: { value: transferManager.id.toB256() } }, true)
            .txParams({gasPrice: 1})
            .call()

        contracts = {
            pool: pool.id.toB256(),
            executionManager: executionManager.id.toB256(),
            royaltyManager: royaltyManager.id.toB256(),
            assetManager: assetManager.id.toB256(),
            transferSelector: transferSelector.id.toB256(),
            transferManager: transferManager.id.toB256(),
        }
        Exchange.setContracts(contracts, provider);
        console.log([contracts, exchange.id.toB256(), erc721.id.toB256(), strategyFixedPrice.id.toB256(), strategyAuction.id.toB256()])
        return contracts
    }

    await deployAll()
}

main(localTestnet)
    .then((res) => {
        return res;
    })
    .catch((err) => console.log(err));
