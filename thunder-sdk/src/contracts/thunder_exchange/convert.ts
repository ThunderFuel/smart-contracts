import { Contract, ContractFactory, Provider, WalletUnlocked, NativeAssetId, Address } from 'fuels';

const main = async (addr: string) => {
    const a = Address.fromPublicKey(addr)
    return a.toString()
}

main("0x73bacfa86ade2edbfe183e34c140c3e2d98ee14090826dab7484a1014af48134")
    .then((res) => {
        console.log(res)
    })