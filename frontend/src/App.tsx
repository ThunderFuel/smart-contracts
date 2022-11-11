import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { metaData, mint, setApprovalForAll, isApprovedForAll, constructor } from './nft'

function App() {
  const [tokenId, setTokenId] = useState(0);
  const [metadata, setMetadata] = useState("");

  const NFT_ID = "0x2ebbee5b516389b6808e6bb9793bb8f4f45c81265dde1e0bb3163b0d8d9d5569";
  const MARKETPLACE_ID = "0x69f21b8fc11def4b8ed838e2b922914e5e83177e0b5170b79767e4fdef91d0c1";
  const WALLET_PRIVATE_KEY = "0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0";
  const WALLET = "0xa2f17b294056ee9cd0e843ce6c6621cd70178f8cc4124b2dee92990213b75404";

  const decrement = () => {
    let newTokenId = tokenId - 1;
    if (newTokenId < 0) {
      newTokenId = 0;
    }
    setTokenId(newTokenId);
  };

  const increment = () => {
    let newTokenId = tokenId + 1;
    if (newTokenId > 100) {
      newTokenId = 100;
    }
    setTokenId(newTokenId);
  };

  async function initialize() {
    const res = await constructor(NFT_ID, WALLET_PRIVATE_KEY, true, WALLET, 100);
    console.log(res);
  }

  async function getMetaData() {
    const res = await metaData(NFT_ID, tokenId);
    console.log(res);
    setMetadata(res)
  }

  async function mintNft() {
    const res = await mint(NFT_ID, WALLET_PRIVATE_KEY, 1, WALLET);
    console.log(res);
  }

  return (
    <div className="App">
      <header className="App-header">

        <button
          onClick={decrement}>
            -
        </button>
        <p>Token Id: {tokenId}</p>
        <button
          onClick={increment}>
            +
        </button>
        <button onClick={initialize}>initialize</button>
        <button onClick={mintNft}>mint</button>
        <button onClick={getMetaData}>getMetaData</button>
      </header>
    </div>
  );
}

export default App;
