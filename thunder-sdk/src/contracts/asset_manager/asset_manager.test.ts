import fs from 'fs';
import { ContractFactory, CreateTransactionRequest, Provider, TransactionCoder, transactionRequestify, WalletUnlocked } from 'fuels';
import path from 'path';
import { AssetManagerAbi__factory } from "../../types/contracts/factories/AssetManagerAbi__factory"

import { initialize, setup } from './asset_manager';

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

    //const contract_id = "0x0505baedf17ef227563f99e7fbbda3f428bd38d4e206e8bb008e60ade7a81154"

    await setup(contract.id.toString(), PROVIDER.url, USER.address.toString());
    const result = await initialize();
    console.log(result);
  });
});
