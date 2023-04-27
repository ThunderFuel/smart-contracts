import { Contract, ContractFactory, Provider, WalletUnlocked, NativeAssetId, Address } from 'fuels';

const main = async (addr: string) => {
    const a = Address.fromPublicKey(addr)
    return a.toString()
}

main("0xd7751c47b4a71cdd9197191e4083992be14452691b0e071cd3699d5445624061")
    .then((res) => {
        console.log(res)
    })