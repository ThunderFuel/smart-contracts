const { Wallet } = require("fuels");

export function createWallet() {
    const wallet = Wallet.generate();
    console.log("address", wallet.address.toString());
    console.log("private key", wallet.privateKey);
    return {
        address: wallet.address.toString(),
        walletKey: wallet.privateKey
    }
}
