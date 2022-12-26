const { Wallet } = require("fuels");

const wallet = Wallet.generate();

console.log("address", wallet.address.toB256());
console.log("private key", wallet.privateKey);
