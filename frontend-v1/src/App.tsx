import React from 'react';
import logo from './logo.svg';
import './App.css';

import { NativeAssetId } from "fuels";
import * as AssetManager from "./asset_manager";
import * as FuelWallet from "./wallet";

function App() {
  const ASSET = "0x1000000000000000000000000000000000000000000000000000000000000000"
  const CONTRACT_ID = "0x7cffafb0a1ca4641f6f11bf4da11d7493c322a8565e91a9ee67ddbdeeae71e50"
  const PROVIDER = "https://beta-3.fuel.network/graphql"

  const WALLET_PRIVATE_KEY = "0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0";
  const WALLET = "0xa2f17b294056ee9cd0e843ce6c6621cd70178f8cc4124b2dee92990213b75404";

  const USER_PRIVATE_KEY = "0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a";
  const USER = "0x7a29b2fe6e692350ce86d032b521417ed43b2a4d6db5a9b289c550d6481a6c01";

  async function setup() {
    await AssetManager.setup(CONTRACT_ID, PROVIDER, WALLET_PRIVATE_KEY);
  }

  async function setupFuel() {
    const res = await FuelWallet.connect();
    console.log(res);
    const walletAddr = await FuelWallet.get();
    console.log(walletAddr);
    const wallet = await FuelWallet.getWallet(walletAddr);

    await AssetManager.setupFuelWallet(CONTRACT_ID, wallet);
  }

  async function initialize() {
    const res = await AssetManager.initialize();
    console.log(res);
  }

  async function add() {
    const res = await AssetManager.addAsset(ASSET);
    console.log(res);
  }

  async function remove() {
    const res = await AssetManager.removeAsset(NativeAssetId);
    console.log(res);
  }

  async function getSupportedAsset() {
    const res = await AssetManager.getSupportedAssets();
    console.log(res);
  }

  async function isSupported() {
    const res = await AssetManager.isAssetSupported(NativeAssetId);
    console.log(res);
  }

  async function getCountSupportedAsset() {
    const res = await AssetManager.getCountSupportedAssets();
    console.log(res);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={setup}>set up</button>
        <button onClick={setupFuel}>set up fuel wallet</button>
        <button onClick={initialize}>initialize</button>
        <button onClick={add}>add asset</button>
        <button onClick={remove}>remove asset</button>
        <button onClick={getSupportedAsset}>get Supporte dAsset</button>
        <button onClick={isSupported}>Is Supported</button>
        <button onClick={getCountSupportedAsset}>get Count Supported Asset</button>
      </header>
    </div>
  );
}

export default App;
