import { BigNumberish, WalletLocked } from "fuels/*"
import { mint, setApprovalForAll } from "./erc721"

const main = async (amount: BigNumberish) => {
    const contractId = "0x2ed5b370451dad8a845d55d68f50e3bb20f2b7adec8d3f17c8bf22385b7757d7"
    const provider = "https://beta-3.fuel.network/graphql"
    const to = "0x4168ca3177168d8cb3a57756aadf25e3de4163dbf78e92ce36466429c7afbdd6"
    const wallet = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"
    const { transactionResult } = await mint(contractId, provider, wallet, amount, to);
    return transactionResult.status.type
}

const approve = async () => {
    const contractId = "0x2ed5b370451dad8a845d55d68f50e3bb20f2b7adec8d3f17c8bf22385b7757d7"
    const provider = "https://beta-3.fuel.network/graphql"
    const okanWallet = "0x655c28a6baf44bc723c5dabe985437538e198ba5527a079eeb2491414da1c4ff"
    const tm = "0x220eb586525d25953167bd92232761e2a00a1b1127e8fa8e00087c2055bf5299"

    const { transactionResult } = await setApprovalForAll(contractId, provider, okanWallet, tm, true);
    return transactionResult.status.type
}

approve()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
