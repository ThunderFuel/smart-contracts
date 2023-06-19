import { BigNumberish, NativeAssetId } from "fuels"
import { isApprovedForAll, ownerOf, balanceOf } from "./erc721"

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
    const { value } = await balanceOf(collection, provider, owner);
    return Number(value)
}

balanceOfUser("0xb7310b2b00e8ebaaea73cbe8304c5216df2471d551a7cf1d5c84bbf0de932e63")
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
