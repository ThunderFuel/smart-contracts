import { Wallet, WalletUnlocked, CoinQuantity, Contract, Provider} from 'fuels';
import { ThunderExchangeAbi__factory } from "../../types/thunder_exchange/factories/ThunderExchangeAbi__factory"

const provider = new Provider("https://beta-4.fuel.network/graphql")

const seller = async (address: string, assetId: string) => {
    const wallet = Wallet.fromAddress(address, provider);
    const balance = await wallet.getBalance(assetId);
    console.log(`Seller Balance: ${Number(balance)}`)
}

const buyer = async (address: string, assetId: string) => {
    const wallet = Wallet.fromAddress(address, provider);
    const balance = await wallet.getBalance(assetId);
    console.log(`Buyer Balance: ${Number(balance)}`)
}

const contract = async (id: string, assetId: string) => {
    const c = new Contract(id, ThunderExchangeAbi__factory.abi, provider)
    const balance = await c.getBalance(assetId);
    console.log(`Contract Balance: ${Number(balance)}`)
}

seller(
    "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
    "0x1c9663463021d38fef107d6164b3128c10413985d992a72898b7c43109ef6685"
)
buyer(
    "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4",
    "0x1c9663463021d38fef107d6164b3128c10413985d992a72898b7c43109ef6685"
)
contract(
    "0x302b52f2f5d0b1c4381ff21004f475c51a889b40185f1f57f2f3eed7cc542165",
    "0x1c9663463021d38fef107d6164b3128c10413985d992a72898b7c43109ef6685"
)
