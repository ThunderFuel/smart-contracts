import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BigNumberish, WalletUnlocked, Provider, Contract, Script, WalletLocked, BaseAssetId } from "fuels"
import { NFTContractAbi__factory } from "./thunder-sdk/src/types/erc721/factories/NFTContractAbi__factory";
import { Exchange, Pool, ExecutionStrategies } from "./thunder-sdk/src"
import { MakerOrder } from "./thunder-sdk/src/contracts/thunder_exchange";
import bytecode from "./binFile";
import abi from "./bulk_mint-abi.json";
import * as FuelWallet from "./wallet";
import { bulkMint } from "./thunder-sdk/src/contracts/erc721/erc721";

function App() {
  const c = "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337"

  type ContractIdInput = { value: string };
  type AddressInput = { value: string };
  type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
  type Enum<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

  const beta4Testnet = new Provider("https://beta-4.fuel.network/graphql");

  const mintNFTs = async (collection: string, amount: BigNumberish) => {
    const to = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const privateKey = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"
    const wallet = new WalletUnlocked(privateKey, beta4Testnet);
    const wallet2 = new WalletLocked(to, beta4Testnet);
    const wallet3 = await FuelWallet.getWallet(to);
    const script = new Script(bytecode, abi, wallet3);

    const _contract = new Contract(collection, NFTContractAbi__factory.abi, beta4Testnet);
    const _collection: ContractIdInput = { value: collection };
    const _to: IdentityInput = { Address: { value: to } };

    const { transactionResult, transactionResponse } = await script.functions
        .main(_collection, _to, amount)
        .txParams({gasPrice: 1})
        .addContracts([_contract])
        .call();
    console.log(transactionResult, transactionResponse)
    return transactionResult.isStatusSuccess;
  }

  const mintNFTs2 = async (collection: string, amount: number) => {
    const to = "0xe1ce548392573c35649165dfc7a372abaf5927880b3b6c2d780b235299baff5a"
    const wallet3 = await FuelWallet.getWallet(to);
    const res = await bulkMint(collection, beta4Testnet.url, wallet3, to, 300, amount);
    console.log(res)
    return res?.transactionResult.isStatusSuccess
  }

  const mintOnClick = async () => {
    const res = await mintNFTs2(c, 15);
    console.log(res)
  }

  const connectWallet = async () => {
    const res = await FuelWallet.connect();
    console.log(res)
  }

  async function makeOffer() {
    const provider = "https://beta-4.fuel.network/graphql"
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(provider)
    )

    const temp = {
      isBuySide: true,
      maker: w.address.toB256(),
      collection: "0x439c7e118889e1e9c56802ff4e5e14f9f4161ab85a233e8aa6758ad0c742dc74",
      token_id: 2,
      price: 2000,
      amount: 1,
      nonce: 5,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 10000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.depositAndPlaceOrder(exchange, provider, w, temp, 2000, BaseAssetId);
    console.log(res)
  }

  async function offer() {
    const provider = "https://beta-4.fuel.network/graphql"
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(provider)
    )

    const temp = {
      isBuySide: true,
      maker: w.address.toB256(),
      collection: "0x439c7e118889e1e9c56802ff4e5e14f9f4161ab85a233e8aa6758ad0c742dc74",
      token_id: 1,
      price: 200,
      amount: 1,
      nonce: 4,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 10000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.placeOrder(exchange, provider, w, temp);
    console.log(res)
  }

  async function acceptOffer() {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: false,
      taker: "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
      maker: buyer,
      collection: "0x439c7e118889e1e9c56802ff4e5e14f9f4161ab85a233e8aa6758ad0c742dc74",
      token_id: 1,
      price: 200,
      nonce: 4,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.executeOrder(exchange, beta4Testnet.url, w, temp, BaseAssetId)
    console.log(res)
  }

  async function list() {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: false,
      maker: w.address.toB256(),
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 4,
      price: 100,
      amount: 1,
      nonce: 2,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 100000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.placeOrder(exchange, beta4Testnet.url, w, temp)
    console.log(res)
  }

  const bulkPlaceOrder = async () => {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: false,
      maker: w.address.toB256(),
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 5,
      price: 100,
      amount: 1,
      nonce: 3,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 100000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const temp2 = {
      isBuySide: false,
      maker: w.address.toB256(),
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 6,
      price: 100,
      amount: 1,
      nonce: 4,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 100000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.bulkListing(exchange, beta4Testnet.url, w, [temp, temp2])
    console.log(res)
  }

  async function update() {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: false,
      maker: w.address.toB256(),
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 4,
      price: 200,
      amount: 1,
      nonce: 2,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      payment_asset: BaseAssetId,
      expiration_range: 100000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.updateOrder(exchange, beta4Testnet.url, w, temp)
    console.log(res)
  }

  async function cancel() {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const strategy = "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const res = await Exchange.cancelOrder(exchange, beta4Testnet.url, w, strategy, 2, false);
    console.log(res)
  }

  async function getOrder() {
    const strategy = "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7"
    const maker = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const privatekey = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"
    const res = await ExecutionStrategies.getMakerOrderOfUser(strategy, beta4Testnet.url, privatekey, buyer, 5, true)
    console.log(res)
  }

  async function purchase() {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: true,
      taker: buyer,
      maker: "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 3,
      price: 100,
      nonce: 1,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.executeOrder(exchange, beta4Testnet.url, w, temp, BaseAssetId)
    console.log(res)
  }

  const bulkExecute = async () => {
    const exchange = "0x2c52aff5c18dfb11ccbc5523f936addf884653116550ee36af37cae4b625ef2c"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f',
        executionManager: '0xe29368f3f9ea7bcc8dfa2f6aa362313ffbc7a1bb861f84840071e12bfe597ad3',
        royaltyManager: '0xe2ad3deb1e428275f31efe0564494f7bb2d1dd185c57e611afbbf02b79b7f2bb',
        assetManager: '0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc',
        strategyFixedPrice: '0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: true,
      taker: buyer,
      maker: "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 5,
      price: 100,
      nonce: 3,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const temp2 = {
      isBuySide: true,
      taker: buyer,
      maker: "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 6,
      price: 100,
      nonce: 4,
      strategy: "0x25e64f3d16c1b78ed74eaa687d5951440a46364c16bb3ecc40192464fbe591c7",
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.bulkPurchase(exchange, beta4Testnet.url, w, [temp, temp2], BaseAssetId)
    console.log(res)
  }

  async function depositPool() {
    const pool = "0xf1b2ec08d676726ff20b5ae129833bccd2b81789077440f49b451e3001c4ee5f"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const am = "0xbf862370246ecb6d93e48c1702e40a8af1cf199fc810218eaf17bba3d30d94fc"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const res = await Pool.deposit(pool, beta4Testnet.url, w, 100, BaseAssetId, am)
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>CONNECT</button>
        <button onClick={mintOnClick}>MINT</button>
        <button onClick={list}>LIST</button>
        <button onClick={bulkPlaceOrder}>BULK LIST</button>
        <button onClick={update}>UPDATE</button>
        <button onClick={cancel}>CANCEL</button>
        <button onClick={getOrder}>GET ORDER</button>
        <button onClick={makeOffer}>MAKE OFFER</button>
        <button onClick={offer}>OFFER</button>
        <button onClick={acceptOffer}>ACCEPT OFFER</button>
        <button onClick={purchase}>PURCHASE</button>
        <button onClick={bulkExecute}>BULK PURCHASE</button>
        <button onClick={depositPool}>DEPOSIT</button>
      </header>
    </div>
  );
}

export default App;
