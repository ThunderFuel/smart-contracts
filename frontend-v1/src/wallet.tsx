const windowLocal = (window as any);

export async function connect() {
    const isConnected = await windowLocal.fuel.connect();
    return isConnected;
}

export async function get() {
    const selectedAccount = await windowLocal.fuel.getSelectedAccount();
    return selectedAccount;
}

export async function getProvider() {
    const provider = await windowLocal.fuel.getProvider();
    return provider;
}

export async function getWallet(account: string) {
    const wallet = await windowLocal.fuel.getWallet(account);
    return wallet
}
