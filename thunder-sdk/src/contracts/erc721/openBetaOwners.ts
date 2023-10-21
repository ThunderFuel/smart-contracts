import { BigNumberish, NativeAssetId } from "fuels"
import { isApprovedForAll, ownerOf, balanceOf, totalSupply } from "./erc721"
import tokens from "./openBetaMissedTokens";
import file from "./owners.json"

const fs = require('fs');

const guTokenIDs = [
    417,
    465,
    466,
]

const getOwners = async () => {
    const owners = []
    const user708 = "0x833ad9964a5b32c6098dfd8a1490f1790fc6459e239b07b74371607f21a2d307"

    const openBeta = "0x2a5b42c6e92ac8aad4ac0b9fbc582b3f291d66dbe983fc27f228bf2298ff9baa"
    const gu = "0xb96d28549d1a22f716c76abd7052171d554d0b84c4c492f5cadf3eb6273ffac1"
    const azuki = "0x985cfb25b18153750b51024e559670d093d81c97b22467a3cc849e211de055c3"
    const doodles = "0x2027da4b620609162cae3e1f07802b0e59b1beff71269121395b27d652e20c10"
    const ape = "0x8f1441f609b02de2c367e1c8c785e89d0dca1bd6fc1e2eccb9e982bf905791ce"
    const pudgy = "0x7fdb57ceb8e72598fbccec06af601503840a3ed029a9dc5443dac76b998dc422"
    const moon = "0x1b8b36002a10f1bbadd21a37deaf56387d80c57ef5a082418706fe519d998ceb"
    const ninja = "0x5f083b2c1618e850a217cad0e397f7668d2cf01fb80d3240dc40584c76ab348e"
    const cats = "0xa52f7cf2641a2111b159dd4e5a693eb5789619893e7d6858c254f68ca9f77d68"
    const clone = "0x84b0f13be0a36c063f13551cffbfd369b52f760045d0b2f7dd2a1f6d7a281ad3"
    const bean = "0xc89c1755844c41da1382e2138d2d5ec962924b7647bbef065768cc480fd77a84"
    const zones = "0x99248fef2f354594d4d4b90f0edecddc3b548dec6cf77238d238bc57f6caa18f"
    const provider = "https://beta-3.fuel.network/graphql"
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let i=0; i<guTokenIDs.length; i++) {
        const tokenId = guTokenIDs[i]
        const { value } = await ownerOf(ninja, provider, tokenId);
        if (value?.Address?.value !== user708) {
            console.log(`tokenId ${tokenId}: ${value?.Address?.value}`)
        }
        //console.log(`tokenId ${tokenId}: ${value?.Address?.value}`)
        const res = {
            tokenId: tokenId,
            owner: value?.Address?.value
        }
        owners.push(res)
        // let data = JSON.stringify(res);
        // fs.writeFileSync('owners.json', data);
        await sleep(500);
    }
    // let data = JSON.stringify(owners);
    // fs.writeFileSync('GenuineUndead.json', data)
}

const updateIDs = async () => {
    for (let i=0; i<tokens.length; i++) {
        const tokenId = tokens[i]
        file[i].tokenId = tokenId
    }
    let data = JSON.stringify(file);
    fs.writeFileSync('owners2.json', data)
}

getOwners()
    .then(() => console.log("done"))
    .catch((err) => console.log(err))

// updateIDs()
//     .then(() => console.log("done"))
//     .catch((err) => console.log(err))