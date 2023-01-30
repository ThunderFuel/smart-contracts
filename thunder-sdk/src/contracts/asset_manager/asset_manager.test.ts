import fs from 'fs';
import { Contract, ContractFactory, NativeAssetId, Provider, WalletUnlocked } from 'fuels';
import path from 'path';
import { AssetManagerAbi__factory } from "../../types/asset_manager/factories/AssetManagerAbi__factory";
import * as AssetManager from './asset_manager';

let contract: Contract;

const PROVIDER = new Provider('http://127.0.0.1:4000/graphql');
const OWNER: WalletUnlocked = new WalletUnlocked("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", PROVIDER);
const USER: WalletUnlocked = new WalletUnlocked("0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd", PROVIDER);

describe('AssetManager', () => {
  beforeAll(async () => {
    // Deploy
    const bytecode = fs.readFileSync(path.join(__dirname, '../../../../contracts-v1/asset_manager/out/debug/asset_manager.bin'));
    const factory = new ContractFactory(bytecode, AssetManagerAbi__factory.abi, OWNER);
    contract = await factory.deployContract();
  });

  it('should initialize', async () => {
    const { transactionResult } = await AssetManager.initialize(contract.id.toString(), PROVIDER.url, OWNER.privateKey);
    expect(transactionResult?.status.type).toBe("success");
  });

  it('should get owner', async () => {
    const { value } = await AssetManager.owner(contract.id.toString(), PROVIDER.url);
    expect(value?.Address?.value).toBe(OWNER.address.toB256());
  });

  it('should not initialize again', async () => {
    await AssetManager.initialize(contract.id.toString(), PROVIDER.url, OWNER.privateKey)
      .catch((err: any) => {
        const error = err.toString().includes("CannotReinitialized");
        expect(error).toBeTruthy();
      });
  });

  it('should add asset', async () => {
    const { value } = await AssetManager.isAssetSupported(contract.id.toString(), PROVIDER.url, NativeAssetId);
    expect(value).toBe(false);

    const { transactionResult } = await AssetManager.addAsset(contract.id.toString(), PROVIDER.url, OWNER.privateKey, NativeAssetId);
    expect(transactionResult?.status.type).toBe("success");

    const res = await AssetManager.getCountSupportedAssets(contract.id.toString(), PROVIDER.url);
    expect(Number(res.value)).toBe(1);

    const res2 = await AssetManager.isAssetSupported(contract.id.toString(), PROVIDER.url, NativeAssetId);
    expect(res2.value).toBe(true);

    const res3 = await AssetManager.getSupportedAsset(contract.id.toString(), PROVIDER.url, 0);
    expect(res3.value?.value).toBe(NativeAssetId);
  });

  it('should remove asset', async () => {
    const { value } = await AssetManager.isAssetSupported(contract.id.toString(), PROVIDER.url, NativeAssetId);
    expect(value).toBe(true);

    const { transactionResult } = await AssetManager.removeAsset(contract.id.toString(), PROVIDER.url, OWNER.privateKey, NativeAssetId);
    expect(transactionResult?.status.type).toBe("success");

    const res = await AssetManager.getCountSupportedAssets(contract.id.toString(), PROVIDER.url);
    expect(Number(res.value)).toBe(0);

    const res2 = await AssetManager.isAssetSupported(contract.id.toString(), PROVIDER.url, NativeAssetId);
    expect(res2.value).toBe(false);
  });

  it('should not call if non-owner', async () => {
    await AssetManager.addAsset(contract.id.toString(), PROVIDER.url, USER.privateKey, NativeAssetId)
      .catch((err: any) => {
        const error = err.toString().includes("NotOwner");
        expect(error).toBeTruthy();
      });

    await AssetManager.removeAsset(contract.id.toString(), PROVIDER.url, USER.privateKey, NativeAssetId)
      .catch((err: any) => {
        const error = err.toString().includes("NotOwner");
        expect(error).toBeTruthy();
      });
  });

  it('should transfer ownership', async () => {
    const { transactionResult } = await AssetManager.transferOwnership(contract.id.toString(), PROVIDER.url, OWNER.privateKey, USER.address.toB256());
    expect(transactionResult.status.type).toBe("success");

    const { value } = await AssetManager.owner(contract.id.toString(), PROVIDER.url);
    expect(value?.Address?.value).toBe(USER.address.toB256());
  });
});
