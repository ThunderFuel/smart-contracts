import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { metaData, mint, setApprovalForAll, isApprovedForAll, nftConstructor, ownerOf } from './nft';
import { constructor, admin, feeReceiver, pause, listNft, deleteListing, updatePrice, purchaseNft } from './marketplace';

function App() {
  const [tokenId, setTokenId] = useState(0);
  const [metadata, setMetadata] = useState("");

  const NFT_ID = "0x2ebbee5b516389b6808e6bb9793bb8f4f45c81265dde1e0bb3163b0d8d9d5569";
  const MARKETPLACE_ID = "0x69f21b8fc11def4b8ed838e2b922914e5e83177e0b5170b79767e4fdef91d0c1";
  const ADMIN_PRIVATE_KEY = "0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0";
  const ADMIN = "0xa2f17b294056ee9cd0e843ce6c6621cd70178f8cc4124b2dee92990213b75404";
  const USER_PRIVATE_KEY = "0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a";
  const USER = "0x7a29b2fe6e692350ce86d032b521417ed43b2a4d6db5a9b289c550d6481a6c01";
  const NATIVE_ASSET_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";

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
    const res = await nftConstructor(NFT_ID, ADMIN_PRIVATE_KEY, true, ADMIN, 100);
    console.log(res);
  }

  async function getMetaData() {
    const res = await metaData(NFT_ID, tokenId);
    console.log(res);
    setMetadata(res)
  }

  async function ownerOfNft() {
    const res = await ownerOf(NFT_ID, tokenId);
    console.log(res);
  }

  async function setApproval() {
    const res = await setApprovalForAll(NFT_ID, ADMIN_PRIVATE_KEY, true, MARKETPLACE_ID);
    console.log(res);
  }

  async function isApproved() {
    const res = await isApprovedForAll(NFT_ID, MARKETPLACE_ID, ADMIN);
    console.log(res);
  }

  async function mintNft() {
    const res = await mint(NFT_ID, ADMIN_PRIVATE_KEY, 1, ADMIN);
    console.log(res);
  }

  async function initializeMarketplace() {
    const res = await constructor(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, ADMIN, ADMIN);
    console.log(res);
  }

  async function getAdmin() {
    const res = await admin(MARKETPLACE_ID);
    console.log(res);
  }

  async function getFeeReceiver() {
    const res = await feeReceiver(MARKETPLACE_ID);
    console.log(res);
  }

  async function getPause() {
    const res = await pause(MARKETPLACE_ID);
    console.log(res);
  }

  async function list() {
    const res = await listNft(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, NFT_ID, tokenId, NATIVE_ASSET_ID, 10000);
    console.log(res);
  }

  async function purchase() {
    const res = await purchaseNft(MARKETPLACE_ID, USER_PRIVATE_KEY, NFT_ID, tokenId, 10000, NATIVE_ASSET_ID);
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
        <button onClick={ownerOfNft}>Owner of NFT</button>
        <button onClick={setApproval}>setApprovalForAll</button>
        <button onClick={isApproved}>isApprovedForAll</button>

        <button onClick={initializeMarketplace}>initializeMarketplace</button>
        <button onClick={getAdmin}>Admin</button>
        <button onClick={getFeeReceiver}>Fee Receiver</button>
        <button onClick={getPause}>Pause Status</button>
        <button onClick={list}>List NFT</button>
        <button onClick={purchase}>Purchase NFT</button>
      </header>
    </div>
  );
}

export default App;
