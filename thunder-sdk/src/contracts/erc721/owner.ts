import { BigNumberish, NativeAssetId } from "fuels"
import { isApprovedForAll, ownerOf } from "./erc721"

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

owner("0x5e0d3b171d31260925ddf5025268a77c0419478801ff1f068e0249502b24f042", 99)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
