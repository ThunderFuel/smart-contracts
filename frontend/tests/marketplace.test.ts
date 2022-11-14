import fs from 'fs';
import { ContractFactory, Provider, Wallet, Contract, TestUtils } from 'fuels';
import path from 'path';

import { NftMarketplaceAbi__factory } from '../src/contracts/factories/NftMarketplaceAbi__factory';
import { IdentityInput, AddressInput, ContractIdInput, NftMarketplaceAbi } from '../src/contracts/NftMarketplaceAbi';

const ZERO_B256 = "0x0000000000000000000000000000000000000000000000000000000000000000";

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
        const bytecode = fs.readFileSync(path.join(__dirname, './artifacts/nft_marketplace.bin'));
        const factory = new ContractFactory(bytecode, NftMarketplaceAbi__factory.abi, wallet);
        contract = await factory.deployContract();

        // Connect
        contractInstance = NftMarketplaceAbi__factory.connect(contract.id, wallet);
        contractInstance2 = NftMarketplaceAbi__factory.connect(contract.id, user);
    });

    it('should revert before initialization', async () => {
        await contractInstance.functions.admin().get()
            .catch((err:any) => {
                const is_revert = err.toString().includes("Reverts");
                const is_error = err.toString().includes("42");
                expect(is_revert).toBeTruthy();
                expect(is_error).toBeTruthy();
            });
    });

    it('should return the admin after initialization', async () => {
        const admin: AddressInput = { value: wallet.address.toB256() };
        const receiver: IdentityInput = { Address: admin };

        await contractInstance.functions.constructor(admin, receiver).txParams({gasPrice: 1}).call();
        const { value } = await contractInstance.functions.admin().get();
        expect(value.value).toBe(wallet.address.toB256());
    });

    it('should return the admin after set-up', async () => {
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
            .catch((err:any) => {
                const is_revert = err.toString().includes("Reverts");
                const is_error = err.toString().includes("42");
                expect(is_revert).toBeTruthy();
                expect(is_error).toBeTruthy();
            });
    });

    it('should revert if new admin is zero address', async () => {
        const newAdmin: AddressInput = { value: ZERO_B256 };

        await contractInstance.functions.set_admin(newAdmin).txParams({gasPrice: 1}).call()
            .catch((err:any) => {
                const is_revert = err.toString().includes("Reverts");
                const is_error = err.toString().includes("42");
                expect(is_revert).toBeTruthy();
                expect(is_error).toBeTruthy();
            });
    });
});
