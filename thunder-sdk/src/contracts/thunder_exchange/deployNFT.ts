import { readFileSync } from "fs";
import path from 'path';
import { Contract, ContractFactory, Provider, WalletUnlocked, NativeAssetId } from 'fuels';
import { NFTAbi__factory } from "../../types/erc721/factories/NFTAbi__factory";

import * as ERC721 from '../erc721';

const localTestnet = new Provider('http://127.0.0.1:4000/graphql');
const beta3Testnet = new Provider("https://beta-3.fuel.network/graphql");

const main = async (provider: Provider) => {
    await deploy(provider);
}

const deploy = async (provider: Provider) => {
    const OWNER = new WalletUnlocked("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", provider);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Deploy NFTs
    const nftBytecode = readFileSync(path.join(__dirname, '../../bin-files/NFT.bin'));
    const nftFactory = new ContractFactory(nftBytecode, NFTAbi__factory.abi, OWNER);

    const nft1 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft1 contract id: ${nft1.id.toB256()}`)
    await sleep(1500);

    const nft2 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft2 contract id: ${nft2.id.toB256()}`)
    await sleep(1500);

    const nft3 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft3 contract id: ${nft3.id.toB256()}`)
    await sleep(1500);

    const nft4 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft4 contract id: ${nft4.id.toB256()}`)
    await sleep(1500);

    const nft5 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft5 contract id: ${nft5.id.toB256()}`)
    await sleep(1500);

    const nft6 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft6 contract id: ${nft6.id.toB256()}`)
    await sleep(1500);

    const nft7 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft7 contract id: ${nft7.id.toB256()}`)
    await sleep(1500);

    const nft8 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft8 contract id: ${nft8.id.toB256()}`)
    await sleep(1500);

    const nft9 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft9 contract id: ${nft9.id.toB256()}`)
    await sleep(1500);

    const nft10 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft10 contract id: ${nft10.id.toB256()}`)
    await sleep(1500);

    const nft11 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft11 contract id: ${nft11.id.toB256()}`)
    await sleep(1500);

    const nft12 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft12 contract id: ${nft12.id.toB256()}`)
    await sleep(1500);

    const nft13 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft13 contract id: ${nft13.id.toB256()}`)
    await sleep(1500);

    const nft14 = await nftFactory.deployContract({gasPrice: 1});
    console.log(`nft14 contract id: ${nft14.id.toB256()}`)
    await sleep(1500);
}

main(beta3Testnet)
    .then((res) => { return res })
    .catch((err) => console.log(err));
