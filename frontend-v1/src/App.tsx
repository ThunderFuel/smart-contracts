import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BigNumberish, WalletUnlocked, Provider, Contract, Script, WalletLocked } from "fuels"
import { NFTContractAbi__factory } from "./erc721/factories/NFTContractAbi__factory";
import bytecode from "./binFile";
import abi from "./bulk_mint-abi.json";
import * as FuelWallet from "./wallet";
import { bulkMint } from "./thunder-sdk/src/contracts/erc721/erc721";

function App() {
  const c = "0xf0921e06690cb421345151635fa55460d1b6d9682a5704cce3fe59a35ce38afd"

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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>CONNECT LOO</button>
        <button onClick={mintOnClick}>MINT LOO</button>
      </header>
    </div>
  );
}

export default App;
