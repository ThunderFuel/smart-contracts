use crate::utils::{
    abi_calls::{admin, constructor, set_admin, pause},
    test_helpers::setup,
};
use fuels::prelude::*;

mod success {

    use super::*;

    #[tokio::test]
    async fn gets_admin() {
        let (nft_deploy_wallet, nft_owner1, nft_owner2, mp_deploy_wallet, mp_owner1, mp_owner2) = setup().await;

        let new_admin = Address::from(mp_owner1.wallet.address());
        let new_receiver = Identity::Address(mp_deploy_wallet.wallet.address().into());
        constructor(new_admin, new_receiver, &mp_deploy_wallet.contract).await;

        //let admin = admin(&mp_deploy_wallet.contract).await;

        //assert_eq!(false, pause(&mp_deploy_wallet.contract).await);
    }

    #[tokio::test]
    async fn gets_admin_after_change() {
        let (nft_deploy_wallet, nft_owner1, nft_owner2, mp_deploy_wallet, mp_owner1, mp_owner2) = setup().await;

        let new_admin = Address::from(mp_owner1.wallet.address());
        let new_receiver = Identity::Address(mp_owner2.wallet.address().into());
        constructor(new_admin, new_receiver, &mp_deploy_wallet.contract).await;

        assert_eq!(admin(&mp_owner1.contract).await, new_admin);

        let new_admin = Address::from(mp_owner1.wallet.address());
        set_admin(&new_admin, &mp_owner1.contract).await;

        assert_eq!(admin(&mp_owner1.contract).await, new_admin);
    }
}

mod reverts {

    use super::*;

    #[tokio::test]
    #[should_panic(expected = "Revert(42)")]
    async fn when_admin_not_set() {
        let (nft_deploy_wallet, nft_owner1, nft_owner2, mp_deploy_wallet, mp_owner1, mp_owner2) = setup().await;

        admin(&mp_owner1.contract).await;
    }
}
