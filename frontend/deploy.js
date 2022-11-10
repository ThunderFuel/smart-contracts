"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var fuels_1 = require("fuels");
var fuels_2 = require("fuels");
var provider = new fuels_1.Provider("https://node-beta-1.fuel.network/graphql");
var bytecode = (0, fs_1.readFileSync)("../contracts/nft/out/debug/NFT.bin");
var abiJSON = JSON.parse((0, fs_1.readFileSync)("../contracts/nft/out/debug/NFT-abi.json").toString());
var wallet = new fuels_1.BaseWalletLocked("fuel1s7eshwt30en99y2g7qdykkhql9m2z60yx4cxr24aftwrwrxctfjqumcq0t", provider);
var contractFactory = new fuels_2.ContractFactory(bytecode, abiJSON, wallet);
//var contract = await contractFactory.deployContract();
//console.log(contract.id);
contractFactory.deployContract().then((res) => {
    console.log(res.id);
});
