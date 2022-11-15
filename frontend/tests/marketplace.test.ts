import fs from 'fs';
import { ContractFactory, Provider, Wallet, Contract, ContractIdLike, TestUtils } from 'fuels';
import { describe, beforeAll, expect, it } from '@jest/globals'
import path from 'path';
import { NftMarketplaceAbi__factory } from '../src/contracts/factories/NftMarketplaceAbi__factory';
import { NFTAbi__factory } from '../src/contracts/factories/NFTAbi__factory';
import { IdentityInput, AddressInput, AddressOutput, ContractIdInput, NftMarketplaceAbi } from '../src/contracts/NftMarketplaceAbi';
import { NFTAbi } from '../src/contracts/NFTAbi';

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

describe('list/purchase related functions', () => {
    let user: Wallet
    let user2: Wallet; // 0x75d3154a1550322715f8e35209f388a7ecde575a1103b6eb6e81ad742fb5fff6
    let wallet: Wallet;
    let receiver: Wallet; // 0xdf813f1021c5ef8d55bc9a01471b5a0b56f590eaf409e25e9493931d003cc977
    let provider: Provider;
    let contract: Contract;
    let nftInstance: NFTAbi;
    let nftInstance2: NFTAbi;
    let nftContract: Contract;
    let nativeAsset: ContractIdInput;
    let contractInstance: NftMarketplaceAbi;
    let contractInstance2: NftMarketplaceAbi;

    beforeAll(async () => {
        // Set up wallets
        provider = new Provider('http://127.0.0.1:4000/graphql');
        user = new Wallet("0xe26a3198aa8eb5f0d563575d6ccff5b1cc1e23b28a4d6a0d9138d71302add24a", provider);
        user2 = new Wallet("0x5e0151f897943dd4db47d032cf102a662bedcab5396dfeae6a8e1bae2c061421", provider);
        wallet = new Wallet("0x4e5409ba92be2859e82e0c4eafd1e30d3570dafa03bb70a2581a6291a4e9afd0", provider);
        receiver = new Wallet("0xe068bc7af53533a23d68eb91833de1d4414f985ab0b9055dd17c4dff976e7c57", provider);

        // Deploy
        const bytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft_marketplace/out/debug/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

        const nftBytecode = fs.readFileSync(path.join(__dirname, '../../contracts/nft/out/debug/NFT.bin'));
        const nftFactory = new ContractFactory(nftBytecode, NFTAbi__factory.abi, wallet);
        nftContract = await nftFactory.deployContract();

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
        nftInstance = NFTAbi__factory.connect(nftContract.id, wallet);
        nftInstance2 = NFTAbi__factory.connect(nftContract.id, user);

        // Native Asset
        nativeAsset = { value: ZERO_B256 };

        // Initialize contracts
        const admin: IdentityInput = { Address: { value: wallet.address.toB256() } };
        const admin_: AddressInput = { value: wallet.address.toB256() };
        const feeReceiver: IdentityInput = { Address: { value: receiver.address.toB256() } };
        const user_: IdentityInput = { Address: { value: user.address.toB256() } };
        nftInstance.functions.constructor(true, admin, 100).txParams({gasPrice: 1}).call();
        contractInstance.functions.constructor(admin_, feeReceiver, PROTOCOL_FEE).txParams({gasPrice: 1}).call();
        nftInstance.functions.mint(10, admin);
        nftInstance2.functions.mint(10, user_);
    });

    it('should be false if not listed', async () => {
        const contract: ContractIdInput = { value: nftContract.id.toB256() };
        const { value } = await contractInstance.functions.is_listed(contract, 1).get();
        expect(value).toBeFalsy();
    });

    it('should revert if not listed', async () => {
        const contract: ContractIdInput = { value: nftContract.id.toB256() };
        await contractInstance.functions.listed_nft(contract, 1).get()
            .catch((err: any) => {
                const isRevert = err.toString().includes("Reverts");
                const isError = err.toString().includes("42");
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
        const contract: ContractIdInput = { value: ZERO_B256 };
        await contractInstance.functions.list_nft(contract, 1, nativeAsset, 10).txParams({gasPrice: 1}).call()
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
        await nftInstance2.functions.set_approval_for_all(true, marketplace)
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
});
