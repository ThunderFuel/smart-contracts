import fs from 'fs';
import { ContractFactory, Provider, Wallet, Contract, TestUtils } from 'fuels';
import path from 'path';
import { NftMarketplaceAbi__factory } from '../src/contracts/factories/NftMarketplaceAbi__factory';
import { IdentityInput, AddressInput, AddressOutput, ContractIdInput, NftMarketplaceAbi } from '../src/contracts/NftMarketplaceAbi';

const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";
const PROTOCOL_FEE = 20;

describe('admin and set_admin functions', () => {

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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
});

describe('protocol_fee and set_protocol_fee functions', () => {

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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

    let user: Wallet
    let wallet: Wallet;
    let provider: Provider;
    let contract: Contract;
    let nativeAsset: ContractIdInput;
    let randomAsset: ContractIdInput;
    let randomAsset2: ContractIdInput;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

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
