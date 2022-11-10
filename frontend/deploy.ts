import { readFileSync } from 'fs';
import { JsonAbi, BaseWalletLocked, Provider } from 'fuels';
import { ContractFactory } from 'fuels';

const provider = new Provider("https://node-beta-1.fuel.network/graphql")
const bytecode = readFileSync("../contracts/nft/out/debug/NFT.bin");
const abiJSON = JSON.parse(readFileSync("../contracts/nft/out/debug/NFT-abi.json").toString()) as JsonAbi;

const wallet = new BaseWalletLocked("fuel1s7eshwt30en99y2g7qdykkhql9m2z60yx4cxr24aftwrwrxctfjqumcq0t", provider);
const contractFactory = new ContractFactory(bytecode, abiJSON, wallet);
const contract = await contractFactory.deployContract();

console.log(contract.id);
