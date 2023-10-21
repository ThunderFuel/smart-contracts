import { BigNumberish, NativeAssetId } from "fuels"
import { isApprovedForAll, ownerOf, balanceOf, totalSupply } from "./erc721"

const owner = async (collection: string, tokenId: BigNumberish) => {
    const provider = "https://beta-3.fuel.network/graphql"
    const { value } = await ownerOf(collection, provider, tokenId);
    return value
}

const isApproved = async (collection: string) => {
    const provider = "https://beta-3.fuel.network/graphql"
    const owner = "0x169ebe67287de6d8ba394a9f8b7580ef9dd324f431496c301c715c5911acea6b"
    const tm = "0x44f93062f0e8ce54973a1c9fe972a25e3845a798adf892059bfe67c3576a1f22"
    const { value } = await isApprovedForAll(collection, provider, NativeAssetId, tm);
    return value
}

const balanceOfUser = async (collection: string) => {
    const provider = "https://beta-3.fuel.network/graphql"
    const owner = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"
    const okanNew = "0x00e313138f0bf1a8a67f7b84746dcb40781322cb1a6b5ad77f750c4c0dc3644f";
    const { value } = await balanceOf(collection, provider, owner);
    return Number(value)
}

const getTotalSupply = async () => {
    const openBeta = "0x2a5b42c6e92ac8aad4ac0b9fbc582b3f291d66dbe983fc27f228bf2298ff9baa"
    const provider = "https://beta-3.fuel.network/graphql"
    const { value } = await totalSupply(openBeta, provider);
    return Number(value)
}

const getTotalSupplyLoop = async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let i=0; i<1000; i++) {
        const openBeta = "0x2a5b42c6e92ac8aad4ac0b9fbc582b3f291d66dbe983fc27f228bf2298ff9baa"
        const provider = "https://beta-3.fuel.network/graphql"
        const { value } = await totalSupply(openBeta, provider);
        console.log(`${i}: ${20000 - Number(value)}`)
        await sleep(10000)
    }
}

owner("0x7fdb57ceb8e72598fbccec06af601503840a3ed029a9dc5443dac76b998dc422", 901)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

// getTotalSupply()
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err))
