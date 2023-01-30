import fs from 'fs';
import { ContractFactory, CreateTransactionRequest, Provider, TransactionCoder, transactionRequestify, WalletUnlocked } from 'fuels';
import path from 'path';
import { AssetManagerAbi__factory } from "../../types/asset_manager/factories/AssetManagerAbi__factory"

import { initialize } from './asset_manager';

const PROVIDER = new Provider('http://127.0.0.1:4000/graphql');
const USER: WalletUnlocked = new WalletUnlocked("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", PROVIDER);

describe('AssetManager', () => {
  it('should initialize', async () => {
    // Deploy
    console.log("1")
    const bytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/asset_manager/out/debug/asset_manager.bin'));
    const factory = new ContractFactory(bytecode, AssetManagerAbi__factory.abi, USER);
    console.log("2")
    const contract = await factory.deployContract();
    console.log("3")

    const result = await initialize(contract.id.toString(), PROVIDER.url, USER.privateKey);
    console.log(result);
  });
});
