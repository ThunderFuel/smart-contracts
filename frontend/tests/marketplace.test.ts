import fs from 'fs';
import { ContractFactory, Provider, WalletUnlocked, Contract, ContractIdLike, CoinQuantityLike, TestUtils, Wallet } from 'fuels';
import { describe, beforeAll, expect, it } from '@jest/globals'
import path from 'path';
import { NftMarketplaceAbi__factory } from '../src/contracts/factories/NftMarketplaceAbi__factory';
import { NFTAbi__factory } from '../src/contracts/factories/NFTAbi__factory';
import { IdentityInput, AddressInput, AddressOutput, ContractIdInput, NftMarketplaceAbi } from '../src/contracts/NftMarketplaceAbi';
import { NFTAbi } from '../src/contracts/NFTAbi';
import { ZeroBytes32 } from 'fuels';

const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";
const PROTOCOL_FEE = 20;

describe('admin and set_admin functions', () => {

    let user: WalletUnlocked;
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    //const PROVIDER: Provider = new Provider('https://node-beta-2.fuel.network/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER;
        user = USER;
        wallet = WALLET;

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should revert before initialization', async () => {
        await contractInstance.functions.admin().get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should return after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.admin().get();
        expect(value.value).toBe(wallet.address.toB256());
    });

    it('should set admin', async () => {
        const newWallet = await TestUtils.generateTestWallet(provider);
        const newAdmin: AddressInput = { value: newWallet.address.toB256() };

        await contractInstance.functions.set_admin(newAdmin).txParams({gasPrice: 1}).call();
        const { value } = await contractInstance.functions.admin().get();
        expect(value.value).toBe(newWallet.address.toB256());
    });

    it('should revert if the caller is not the admin', async () => {
        const newWallet = await TestUtils.generateTestWallet(provider);
        const newAdmin: AddressInput = { value: newWallet.address.toB256() };

        await contractInstance2.functions.set_admin(newAdmin).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if new admin is zero address', async () => {
        const newAdmin: AddressInput = { value: ZERO_B256 };

        await contractInstance.functions.set_admin(newAdmin).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

describe('fee_receiver and set_fee_receiver functions', () => {

    let user: WalletUnlocked
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER
        user = USER
        wallet = WALLET

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should revert before initialization', async () => {
        await contractInstance.functions.fee_receiver().get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should return after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.fee_receiver().get();
        const addr: AddressOutput = { value: wallet.address.toB256() };
        expect(value.Address).toStrictEqual(addr);
    });

    it('should set fee receiver', async () => {
        const newWallet = await TestUtils.generateTestWallet(provider);
        const newFeeReceiver: IdentityInput = { Address: { value: newWallet.address.toB256() } };

        await contractInstance.functions.set_fee_receiver(newFeeReceiver).txParams({gasPrice: 1}).call();
        const { value } = await contractInstance.functions.fee_receiver().get();
        const addr: AddressOutput = { value: newWallet.address.toB256() };
        expect(value.Address).toStrictEqual(addr);
    });

    it('should revert if the caller is not the admin', async () => {
        const newWallet = await TestUtils.generateTestWallet(provider);
        const newFeeReceiver: IdentityInput = { Address: { value: newWallet.address.toB256() } };

        await contractInstance2.functions.set_fee_receiver(newFeeReceiver).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if new fee receiver is zero identity', async () => {
        const newFeeReceiver: IdentityInput = { Address: { value: ZERO_B256 } };

        await contractInstance.functions.set_fee_receiver(newFeeReceiver).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

describe('pause and set_pause functions', () => {

    let user: WalletUnlocked
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER
        user = USER
        wallet = WALLET

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should be false before initialization', async () => {
        const { value } = await contractInstance.functions.pause().get();
        expect(value).toBeFalsy();
    });

    it('should be true after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.pause().get();
        expect(value).toBeTruthy();
    });

    it('should set pause', async () => {
        await contractInstance.functions.set_pause().txParams({gasPrice: 1}).call();
        const { value } = await contractInstance.functions.pause().get();
        expect(value).toBeFalsy();

        await contractInstance.functions.set_pause().txParams({gasPrice: 1}).call();
        const res = await contractInstance.functions.pause().get();
        expect(res.value).toBeTruthy();
    });

    it('should revert if the caller is not the admin', async () => {
        await contractInstance2.functions.set_pause().txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

describe('initialize and constructor functions', () => {

    let user: WalletUnlocked
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER
        user = USER
        wallet = WALLET

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should be false before initialization', async () => {
        const { value } = await contractInstance.functions.initialized().get();
        expect(value).toBeFalsy();
    });

    it('should initialize and return true', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.initialized().get();
        expect(value).toBeTruthy();
    });

    it('should revert if already initialized', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if admin is zero address', async () => {
        const admin: AddressInput = { value: ZERO_B256 };
        const receiver: IdentityInput = { Address: { value: wallet.address.toB256() } };

        await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if receiver is zero identity', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: { value: ZERO_B256 } };

        await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if fee is high', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        await contractInstance.functions.constructor(admin, receiver, 51).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

describe('protocol_fee and set_protocol_fee functions', () => {

    let user: WalletUnlocked
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER
        user = USER
        wallet = WALLET

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should return zero before initialization', async () => {
        const { value } = await contractInstance.functions.protocol_fee().get();
        expect(value.toString()).toBe("0")
    });

    it('should return after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.protocol_fee().get();
        expect(value.toString()).toBe(PROTOCOL_FEE.toString());
    });

    it('should set protocol fee', async () => {
        const newFee = 30;

        const { transactionResponse } = await contractInstance.functions.set_protocol_fee(newFee).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.protocol_fee().get();
        expect(value.toString()).toBe(newFee.toString());
    });

    it('should revert if the caller is not the admin', async () => {
        await contractInstance2.functions.set_protocol_fee(30).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if new fee is greater than 50', async () => {
        await contractInstance.functions.set_protocol_fee(60).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

describe('supported_asset, add_supported_asset and remove_supported_asset functions', () => {

    let user: WalletUnlocked
    let wallet: WalletUnlocked;
    let provider: Provider;
    let contract: Contract;
    let nativeAsset: ContractIdInput;
    let randomAsset: ContractIdInput;
    let randomAsset2: ContractIdInput;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER
        user = USER
        wallet = WALLET

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);

        // Native Asset
        nativeAsset = { value: ZERO_B256 };
        randomAsset = { value: wallet.address.toB256() };
        randomAsset2 = { value: user.address.toB256() };
    });

    it('should be false before initialization', async () => {
        const { value } = await contractInstance.functions.supported_asset(nativeAsset).get();
        expect(value).toBeFalsy();

        const res = await contractInstance.functions.supported_asset(randomAsset).get();
        expect(res.value).toBeFalsy();
    });

    it('should be true after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        const { transactionResponse } = await contractInstance.functions.constructor(admin, receiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.supported_asset(nativeAsset).get();
        expect(value).toBeTruthy();
    });

    it('should support asset', async () => {
        const { transactionResponse } = await contractInstance.functions.add_supported_asset(randomAsset).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.supported_asset(randomAsset).get();
        expect(value).toBeTruthy();
    });

    it('should revert if already supported', async () => {
        await contractInstance.functions.add_supported_asset(randomAsset).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should remove supported asset', async () => {
        const { transactionResponse } = await contractInstance.functions.remove_supported_asset(randomAsset).txParams({gasPrice: 1}).call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance.functions.supported_asset(randomAsset).get();
        expect(value).toBeFalsy();
    });

    it('should revert if not supported', async () => {
        await contractInstance.functions.remove_supported_asset(randomAsset).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if caller is not the admin', async () => {
        await contractInstance2.functions.add_supported_asset(randomAsset2).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance2.functions.remove_supported_asset(randomAsset2).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});

/*describe('list/purchase related functions', () => {
    let user: WalletUnlocked
    let user2: WalletUnlocked; // 0x75d3154a1550322715f8e35209f388a7ecde575a1103b6eb6e81ad742fb5fff6
    let wallet: WalletUnlocked;
    let receiver: WalletUnlocked; // 0xdf813f1021c5ef8d55bc9a01471b5a0b56f590eaf409e25e9493931d003cc977
    let provider: Provider;
    let contract: Contract;
    let nftInstance: NFTAbi;
    let nftInstance2: NFTAbi;
    let nftContract: Contract;
    let nativeAsset: ContractIdInput;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;
    let contractInstance3: NftMarketplaceAbi;

    const PROVIDER: Provider = new Provider('http://127.0.0.1:4000/graphql');
    const USER: WalletUnlocked = new WalletUnlocked("0xa248feefa01308eefa2a026975315516d1e07bdc7eae21bedec157c5390b818c", PROVIDER);
    const USER2: WalletUnlocked = new WalletUnlocked("0xde3e1acb330aa7ecd7b7bf6de7d92e07c7407014b9e1c5b72d41a5578006864a", PROVIDER);
    const WALLET: WalletUnlocked = new WalletUnlocked("0xf2807b4f3dca0c5b32ac06f5b309e41c1c4f302c4ac04890775855e5607404f6", PROVIDER);
    const RECEIVER: WalletUnlocked = new WalletUnlocked("0x915a15533cdd2186f7339139c533298ba47f39fd34c0824f5c71ea7603cfabf2", PROVIDER);

    beforeAll(async () => {
        // Set up wallets
        provider = PROVIDER;
        user = USER;
        user2 = USER2;
        wallet = WALLET;
        receiver = RECEIVER;

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        const nftBytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft/out/debug/NFT.bin'));
        const nftFactory = new ContractFactory(nftBytecode, NFTAbi__factory.abi, wallet);
        contract = await factory.deployContract({gasPrice: 1});

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
        contractInstance3 = NftMarketplaceAbi__factory.connect(contract.id, user2);
        nftInstance = NFTAbi__factory.connect(nftContract.id, wallet);
        nftInstance2 = NFTAbi__factory.connect(nftContract.id, user);

        // Native Asset
        nativeAsset = { value: ZERO_B256 };

        // Initialize contracts
        const admin: IdentityInput = { Address: { value: wallet.address.toB256() } };
        const admin_: AddressInput = { value: wallet.address.toB256() };
        const feeReceiver: IdentityInput = { Address: { value: receiver.address.toB256() } };
        const user_: IdentityInput = { Address: { value: user.address.toB256() } };
        await nftInstance.functions.constructor(true, admin, 100).txParams({gasPrice: 1}).call();
        await contractInstance.functions.constructor(admin_, feeReceiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        await nftInstance.functions.mint(10, admin).txParams({gasPrice: 1}).call();
        await nftInstance.functions.mint(10, user_).txParams({gasPrice: 1}).call();
    });

    it('should be false if not listed', async () => {
        const contract: ContractIdInput = { value: nftContract.id.toB256() };
        const { value } = await contractInstance.functions.is_listed(contract, 1).get();
        expect(value).toBeFalsy();
    });

    it('should revert if not listed', async () => {
        const contract: ContractIdInput = { value: nftContract.id.toB256() };
        const contractId: ContractIdLike = nftContract.id;
        const coin: CoinQuantityLike = { amount: 100, assetId: ZeroBytes32}

        await contractInstance.functions.listed_nft(contract, 1).get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("0");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions.delete_listing(contract, 1).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions.update_price(contract, 1, 10).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions.purchase_nft(contract, 11).txParams({gasPrice: 1, variableOutputs: 2}).addContracts([contractId]).callParams({forward: coin}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("0");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if price is 0', async () => {
        const contract: ContractIdInput = { value: nftContract.id.toB256() };
        await contractInstance.functions.list_nft(contract, 1, nativeAsset, 0).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions.update_price(contract, 1, 0).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if non-supported asset', async () => {
        const contract: ContractIdInput = { value: ZERO_B256 };
        const randomAsset: ContractIdInput = { value: receiver.address.toB256() };
        await contractInstance.functions.list_nft(contract, 1, randomAsset, 10).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if zero contract', async () => {
        const contractId: ContractIdLike = nftContract.id;
        const contract: ContractIdInput = { value: ZERO_B256 };
        await contractInstance.functions.list_nft(contract, 1, nativeAsset, 10).txParams({gasPrice: 1}).addContracts([contractId]).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions.update_price(contract, 1, 1).txParams({gasPrice: 1}).call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if not approved for all', async () => {
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const contractId: ContractIdLike = nftContract.id;
        await contractInstance.functions
            .list_nft(contract_, 1, nativeAsset, 10)
            .txParams({gasPrice: 1})
            .addContracts([contractId])
            .call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should list nft', async () => {
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const contractId: ContractIdLike = nftContract.id;
        const marketplace: IdentityInput = { ContractId: { value: contract.id.toB256() } };

        await nftInstance2.functions.set_approval_for_all(true, marketplace).txParams({gasPrice: 1}).call();
        const { transactionResponse } = await contractInstance2.functions
            .list_nft(contract_, 11, nativeAsset, 10000)
            .txParams({gasPrice: 1})
            .addContracts([contractId])
            .call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance2.functions.is_listed(contract_, 11).get();
        expect(value).toBeTruthy();

        const ipfsCID = "QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW";
        const owner: AddressOutput = { value: user.address.toB256() };
        const res = await contractInstance2.functions.listed_nft(contract_, 11).get();
        expect(res.value.asset_id.value).toBe(ZeroBytes32);
        expect(res.value.contract_Id.value).toBe(nftContract.id.toB256());
        expect(res.value.meta_data.token_uri[0]).toBe(ipfsCID);
        expect(res.value.meta_data.token_uri[1].toString()).toBe("11");
        expect(res.value.owner.Address).toStrictEqual(owner);
        expect(res.value.price.toString()).toBe("10000");
        expect(res.value.token_id.toString()).toBe("11");
    });

    it('should revert if already listed', async () => {
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const contractId: ContractIdLike = nftContract.id;

        await contractInstance2.functions
            .list_nft(contract_, 11, nativeAsset, 10000)
            .txParams({gasPrice: 1})
            .addContracts([contractId])
            .call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should revert if caller is not owner', async () => {
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        await contractInstance.functions
            .delete_listing(contract_, 11)
            .txParams({gasPrice: 1})
            .call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });

        await contractInstance.functions
            .update_price(contract_, 11, 1)
            .txParams({gasPrice: 1})
            .call()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should update the price', async () => {
        const newPrice = 1000;
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const { transactionResponse } = await contractInstance2.functions.
            update_price(contract_, 11, newPrice)
            .txParams({gasPrice: 1})
            .call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance2.functions.listed_nft(contract_, 11).get()
        expect(value.price.toString()).toBe(newPrice.toString());
    });

    it('should delete the listing', async () => {
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const { transactionResponse } = await contractInstance2.functions.
            delete_listing(contract_, 11)
            .txParams({gasPrice: 1})
            .call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const { value } = await contractInstance2.functions.is_listed(contract_, 11).get();
        expect(value).toBeFalsy();

        await contractInstance2.functions.listed_nft(contract_, 11).get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("0");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });

    it('should purchase nft', async () => {
        const price = 10000;
        const contract_: ContractIdInput = { value: nftContract.id.toB256() };
        const contractId: ContractIdLike = nftContract.id;
        const coin: CoinQuantityLike = { amount: price, assetId: ZeroBytes32 };

        const { transactionResponse } = await contractInstance2.functions
            .list_nft(contract_, 11, nativeAsset, price)
            .txParams({gasPrice: 1})
            .addContracts([contractId])
            .call();
        const { status } = await transactionResponse.wait();
        expect(status.type).toBe("success");

        const currentOwner = await nftInstance2.functions.owner_of(11).get();
        const preOwner: AddressOutput = { value: user.address.toB256() };
        expect(currentOwner.value.Address).toStrictEqual(preOwner);

        const fee = (price * PROTOCOL_FEE) / 1000;
        const preBalanceOfUser = await user.getBalance(ZeroBytes32);
        const preBalanceOfReceiver = await receiver.getBalance(ZeroBytes32);

        const res = await contractInstance3.functions
            .purchase_nft(contract_, 11)
            .txParams({gasPrice: 1, variableOutputs: 2})
            .addContracts([contractId])
            .callParams({forward: coin})
            .call();
        const result = await res.transactionResponse.wait();
        expect(result.status.type).toBe('success');

        const postBalanceOfUser = await user.getBalance(ZeroBytes32);
        const postBalanceOfReceiver = await receiver.getBalance(ZeroBytes32);
        const receivedAmount = Number(postBalanceOfUser) - Number(preBalanceOfUser);
        const receivedFee = Number(postBalanceOfReceiver) - Number(preBalanceOfReceiver);
        expect(receivedAmount).toBe((price - fee));
        expect(receivedFee).toBe(fee);

        const owner = await nftInstance2.functions.owner_of(11).get();
        const newOwner: AddressOutput = { value: user2.address.toB256() };
        expect(owner.value.Address).toStrictEqual(newOwner);

        const { value } = await contractInstance2.functions.is_listed(contract_, 11).get();
        expect(value).toBeFalsy();

        await contractInstance2.functions.listed_nft(contract_, 11).get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
                expect(isRevert).toBeTruthy();
                expect(isError).toBeTruthy();
            });
    });
});*/
