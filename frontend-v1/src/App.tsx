import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BigNumberish, WalletUnlocked, Provider, Contract, Script, WalletLocked, BaseAssetId } from "fuels"
import { NFTContractAbi__factory } from "./erc721/factories/NFTContractAbi__factory";
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
    const provider = "https://beta-3.fuel.network/graphql"
    const exchange = "0x04dcbd8af92195a65ee988bc89c0f564bb83c5efbd6465c527f60526c6f41ef1"
    const account = await FuelWallet.get();
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0x4fd8c3335fcb9daf317a0a0bff373735cb0b73b297f657eced288174fe9b504c',
        executionManager: '0xbaad27814dcfca96d88c209e80e4a5cc6fbaac6e07ba1ef75ca0fdbe54878f06',
        royaltyManager: '0x2a08b7c9a7133fa52a1505897975e0e5a6ff7cb385e16c0d551152de7ecca47e',
        assetManager: '0xa0732def1afa51e5fe6d8ada46824fbe794b2959e901875b219055b80a076891',
        strategyFixedPrice: '0x152140c1afc85dc22ba6183a7369648e7acd6a66e60e9c933fa93cb473183799',
      },
      new Provider(provider)
    )

    const temp = {
      isBuySide: true,
      maker: w.address.toB256(),
      collection: "0xc31f433a8c6927c30d9ae61c1948f6a3413c003c80ad4a63d685dc004094e3d8",
      token_id: 1,
      price: 400000000,
      amount: 1,
      nonce: 3,
      strategy: "0x0f0962ccac7ffb801475563daedfd9f017c80545afa5ba6d895333d6e21585ed",
      payment_asset: BaseAssetId,
      expiration_range: 10000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.depositAndPlaceOrder(exchange, provider, w, temp, 200000000, BaseAssetId);
    console.log(res)
  }

  async function list() {
    const exchange = "0x302b52f2f5d0b1c4381ff21004f475c51a889b40185f1f57f2f3eed7cc542165"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const w: WalletLocked = await FuelWallet.getWallet(account);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0x9edaaadfc52e3ba74273e5720cdaa502a6d5f60a5e3d4aeb60141d338f6afb44',
        executionManager: '0x0dd398ed74ae69809e377fb1fb80a91be8fe55414dd81d6ed4224968f73f756c',
        royaltyManager: '0x46625ff7ae9f8a280cdbb69293ddb43585ff7fc00771a6964e98f740bda9b1c8',
        assetManager: '0x307b2471aad2905f5fae690003889b1db199a5c26d9c5ff651be10863f72208b',
        strategyFixedPrice: '0x9b4677de2e652dbe7444dd09872a12290d50220e0102ff6046330b1a79d53c4e'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: false,
      maker: w.address.toB256(),
      collection: "0xc555e61a2bf170e0c936cce39dc9f74d5012fbe017590a22f87c8232bb250337",
      token_id: 2,
      price: 200,
      amount: 1,
      nonce: 1,
      strategy: "0x9b4677de2e652dbe7444dd09872a12290d50220e0102ff6046330b1a79d53c4e",
      payment_asset: BaseAssetId,
      expiration_range: 100000,
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.placeOrder(exchange, beta4Testnet.url, w, temp)
    console.log(res)
  }

  async function purchase() {
    const exchange = "0x4e44f12baa949442371d1839ea6a8d2acaab716406f8fdee822aac48f93fdfc2"
    const account = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const buyer = "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4"
    const w: WalletLocked = await FuelWallet.getWallet(buyer);
    const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    Exchange.setContracts(
      {
        pool: '0x197e9c73b8a4a9a09bbc9af4532cedb3aa8f32f7279dbe68b7e6213fdb6dc42c',
        executionManager: '0x59efc6ef98dbb4f4fc6219f31634cc5a8eff1d4b4ba7ee38cc1283e7fda5203f',
        royaltyManager: '0xce0ffc60fa9270859ff7f6fb003a8f9b3de7f6c35294728239ed10c5b2de10a1',
        assetManager: '0x5630091fe3f58e4cb4a9ed1b83c8acbb684c35cafebd5ab22369b5127fb1cece',
        strategyFixedPrice: '0xc0fa1c15c0f9807bb4e5654497202ffc419f029c3463329c55d098d3cd28584d'
      },
      new Provider(beta4Testnet.url)
    )

    const temp = {
      isBuySide: true,
      taker: buyer,
      maker: "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
      collection: "0x64c592daf6e7d462e3b0e853d9d486637c4467e56bc98f796f69f646e0c29112",
      token_id: 6,
      price: 100,
      nonce: 5,
      strategy: "0xc0fa1c15c0f9807bb4e5654497202ffc419f029c3463329c55d098d3cd28584d",
      extra_params: { extra_address_param: ZERO_B256, extra_contract_param: ZERO_B256, extra_u64_param: 0 },
    }
    const res = await Exchange.executeOrder(exchange, beta4Testnet.url, w, temp, BaseAssetId)
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>CONNECT</button>
        <button onClick={mintOnClick}>MINT</button>
        <button onClick={list}>LIST</button>
        <button onClick={purchase}>PURCHASE</button>
      </header>
    </div>
  );
}

export default App;
