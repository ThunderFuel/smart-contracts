import { Wallet, WalletUnlocked, CoinQuantity, Contract, Provider} from 'fuels';
import { ThunderExchangeAbi__factory } from "../../types/thunder_exchange/factories/ThunderExchangeAbi__factory"

const seller = async (address: string, assetId: string) => {
    const wallet = Wallet.fromAddress(address);
    const balance = await wallet.getBalance(assetId);
    console.log(`Seller Balance: ${Number(balance)}`)
}

const buyer = async (address: string, assetId: string) => {
    const wallet = Wallet.fromAddress(address);
    const balance = await wallet.getBalance(assetId);
    console.log(`Buyer Balance: ${Number(balance)}`)
}

const contract = async (id: string, assetId: string) => {
    const c = new Contract(id, ThunderExchangeAbi__factory.abi, new Provider("https://beta-4.fuel.network/graphql"))
    const balance = await c.getBalance(assetId);
    console.log(`Contract Balance: ${Number(balance)}`)
}

seller(
    "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307",
    "0xcc94f440931f127dccb4eb48b0974358737a095a376fda1b789f154a03af4ac0"
)
buyer(
    "0xb4efddf66465900398d520b7e1033c87db70e65e9f9ea9a9fa092b7d733183f4",
    "0xcc94f440931f127dccb4eb48b0974358737a095a376fda1b789f154a03af4ac0"
)
contract(
    "0x4e44f12baa949442371d1839ea6a8d2acaab716406f8fdee822aac48f93fdfc2",
    "0xcc94f440931f127dccb4eb48b0974358737a095a376fda1b789f154a03af4ac0"
)
