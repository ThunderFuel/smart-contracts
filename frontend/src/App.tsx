import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import * as nft from './nft';
import * as marketplace from './marketplace';

function App() {
  const [tokenId, setTokenId] = useState(0);
  const [metadata, setMetadata] = useState("");

  const NFT_ID = "0x486f1576bb3a136f5f8464baef1c8cfaca269e24df9076d7d23baedf960e6bf3";
  const MARKETPLACE_ID = "0x5ed8fe3f133a00a2e9b638b7a5a598b8b264b598b6842cf8806391b418c8f757"; //0x7848d875ea9a8cefdc5d1f88b7c3c211b27a18917fa0cb9fe12f4f431a66e7ea
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
    const res = await nft.nftConstructor(NFT_ID, ADMIN_PRIVATE_KEY, true, ADMIN, 100);
    console.log(res);
  }

  async function getMetaData() {
    const res = await nft.metaData(NFT_ID, tokenId);
    console.log(res);
    setMetadata(res)
  }

  async function ownerOfNft() {
    const res = await nft.ownerOf(NFT_ID, tokenId);
    console.log(res);
  }

  async function setApproval() {
    const res = await nft.setApprovalForAll(NFT_ID, USER_PRIVATE_KEY, true, MARKETPLACE_ID);
    console.log(res);
  }

  async function isApproved() {
    const res = await nft.isApprovedForAll(NFT_ID, MARKETPLACE_ID, USER);
    console.log(res);
  }

  async function mintNft() {
    const res = await nft.mint(NFT_ID, ADMIN_PRIVATE_KEY, 50, ADMIN);
    console.log(res);
  }

  async function initializeMarketplace() {
    const res = await marketplace.constructor(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, ADMIN, ADMIN, 20);
    console.log(res);
  }

  async function getAdmin() {
    const res = await marketplace.admin(MARKETPLACE_ID);
    console.log(res);
  }

  async function getFeeReceiver() {
    const res = await marketplace.feeReceiver(MARKETPLACE_ID);
    console.log(res);
  }

  async function getPause() {
    const res = await marketplace.pause(MARKETPLACE_ID);
    console.log(res);
  }

  async function list() {
    const res = await marketplace.listNft(MARKETPLACE_ID, USER_PRIVATE_KEY, NFT_ID, tokenId, NATIVE_ASSET_ID, 10000, 30);
    console.log(res);
  }

  async function purchase() {
    const res = await marketplace.purchaseNft(MARKETPLACE_ID, USER_PRIVATE_KEY, NFT_ID, tokenId, 10000, NATIVE_ASSET_ID);
    console.log(res);
  }

  async function isListedNft() {
    const res = await marketplace.isListed(MARKETPLACE_ID, USER_PRIVATE_KEY, NFT_ID, tokenId);
    console.log(res)
  }

  async function getOffer() {
    const res = await marketplace.getOffer(MARKETPLACE_ID, 0);
    console.log(res);
  }

  async function getTotalOffers() {
    const res = await marketplace.getTotalOffers(MARKETPLACE_ID);
    console.log(res);
  }

  async function makeOffer() {
    const res = await marketplace.makeOffer(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, ADMIN, NFT_ID, tokenId, 10000);
    console.log(res);
  }

  async function updateOffer() {
    const res = await marketplace.updateOffer(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, NFT_ID, tokenId, 10000, 12000, 0);
    console.log(res);
  }

  async function deleteOffer() {
    const res = await marketplace.deleteOffer(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, NFT_ID, tokenId, 0);
    console.log(res);
  }

  async function acceptOffer() {
    const res = await marketplace.acceptOffer(MARKETPLACE_ID, USER_PRIVATE_KEY, NFT_ID, tokenId, 0);
    console.log(res);
  }

  async function bulkList() {
    type data = {
      collectionId: string;
      tokenId: number;
      assetId: string;
      price: number;
      expiration: number,
    }

    let datas: data[] = []

    for(let i=50; i<55; i++) {
      const d: data = {
        collectionId: NFT_ID,
        tokenId: i,
        assetId: NATIVE_ASSET_ID,
        price: (i*100),
        expiration: 60,
      }
      datas.push(d)
    }
    const res = await marketplace.bulkListing(MARKETPLACE_ID, ADMIN_PRIVATE_KEY, datas);
    console.log(res);
  }

  async function bulkPurchase() {
    type data = {
      collectionId: string;
      tokenId: number;
      assetId: string;
      price: number;
      expiration: number;
    }

    let datas: data[] = []

    for(let i=29; i<34; i++) {
      const d: data = {
        collectionId: NFT_ID,
        tokenId: i,
        assetId: NATIVE_ASSET_ID,
        price: (i*100),
        expiration: 60
      }
      datas.push(d)
    }
    const res = await marketplace.bulkPurchasing(MARKETPLACE_ID, USER_PRIVATE_KEY, datas);
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
        <button onClick={isListedNft}>isListed</button>

        <button onClick={initializeMarketplace}>initializeMarketplace</button>
        <button onClick={getAdmin}>Admin</button>
        <button onClick={getFeeReceiver}>Fee Receiver</button>
        <button onClick={getPause}>Pause Status</button>
        <button onClick={list}>List NFT</button>
        <button onClick={purchase}>Purchase NFT</button>
        <button onClick={bulkList}>Bulk listing</button>
        <button onClick={bulkPurchase}>Bulk purchasing</button>

        <button onClick={getOffer}>Get Offer</button>
        <button onClick={getTotalOffers}>Get All Offers</button>
        <button onClick={makeOffer}>Make Offer</button>
        <button onClick={updateOffer}>Update Offer</button>
        <button onClick={deleteOffer}>Delete Offer</button>
        <button onClick={acceptOffer}>Accept Offer</button>
      </header>
    </div>
  );
}

export default App;
