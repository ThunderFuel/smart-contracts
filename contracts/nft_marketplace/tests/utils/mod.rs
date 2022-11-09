use fuels::{contract::contract::CallResponse, prelude::*};

abigen!(Marketplace, "out/debug/nft_marketplace-abi.json");
abigen!(Nft, "tests/artifacts/NFT-abi.json");

pub struct NftMetadata {
    pub contract: Nft,
    pub wallet: WalletUnlocked,
}

pub struct MarketplaceMetadata {
    pub contract: Marketplace,
    pub wallet: WalletUnlocked,
}

pub mod abi_calls {

    use super::*;

    pub async fn nft_constructor(
        access_control: bool,
        contract: &Nft,
        owner: &Identity,
        token_supply: u64,
    ) -> CallResponse<()> {
        contract
            .methods()
            .constructor(access_control, owner.clone(), token_supply)
            .call()
            .await
            .unwrap()
    }

    pub async fn mint(
        amount: u64,
        contract: &Nft,
        owner: &Identity
    ) -> CallResponse<()> {
        contract
            .methods()
            .mint(amount, owner.clone())
            .call()
            .await
            .unwrap()
    }

    pub async fn is_approved_for_all(
        contract: &Nft,
        operator: &Identity,
        owner: &Identity,
    ) -> bool {
        contract
            .methods()
            .is_approved_for_all(operator.clone(), owner.clone())
            .call()
            .await
            .unwrap()
            .value
    }

    pub async fn set_approval_for_all(
        approve: bool,
        contract: &Nft,
        operator: &Identity,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_approval_for_all(approve, operator.clone())
            .call()
            .await
            .unwrap()
    }

    pub async fn admin(
        contract: &Marketplace,
    ) -> Address {
        contract
            .methods()
            .admin()
            .call()
            .await
            .unwrap()
            .value
    }

    pub async fn fee_receiver(
        contract: &Marketplace,
    ) -> Identity {
        contract
            .methods()
            .fee_receiver()
            .call()
            .await
            .unwrap()
            .value
    }

    pub async fn pause(
        contract: &Marketplace,
    ) -> bool {
        contract
            .methods()
            .pause()
            .call()
            .await
            .unwrap()
            .value
    }

    pub async fn supported_asset(
        asset_id: ContractId,
        contract: &Marketplace,
    ) -> bool {
        contract
            .methods()
            .supported_asset(asset_id)
            .call()
            .await
            .unwrap()
            .value
    }

    pub async fn constructor(
        admin: Address,
        receiver: Identity,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .constructor(admin, receiver)
            .call()
            .await
            .unwrap()
    }

    pub async fn list_nft(
        contract_Id: &ContractId,
        token_id: u64,
        asset_id: &ContractId,
        price: u64,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .list_nft(contract_Id.clone(), token_id, asset_id.clone(), price)
            .call()
            .await
            .unwrap()
    }

    pub async fn delete_listing(
        contract_Id: &ContractId,
        token_id: u64,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .delete_listing(contract_Id.clone(), token_id)
            .call()
            .await
            .unwrap()
    }

    pub async fn update_price(
        contract_Id: &ContractId,
        token_id: u64,
        new_price: u64,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .update_price(contract_Id.clone(), token_id, new_price)
            .call()
            .await
            .unwrap()
    }

    pub async fn purchase_nft(
        contract_Id: &ContractId,
        token_id: u64,
        contract: &Marketplace,
        amount: u64,
    ) -> CallResponse<()> {
        let call_params = CallParameters::new(Some(amount), Some(AssetId::BASE), None);

        contract
            .methods()
            .purchase_nft(contract_Id.clone(), token_id)
            .call_params(call_params)
            .call()
            .await
            .unwrap()
    }

    pub async fn set_admin(
        admin: &Address,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_admin(admin.clone())
            .call()
            .await
            .unwrap()
    }

    pub async fn set_fee_receiver(
        receiver: &Identity,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_fee_receiver(receiver.clone())
            .call()
            .await
            .unwrap()
    }

    pub async fn set_pause(
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_pause()
            .call()
            .await
            .unwrap()
    }

    pub async fn add_supported_asset(
        asset_id: ContractId,
        contract: &Marketplace,
    ) -> CallResponse<()> {
        contract
            .methods()
            .add_supported_asset(asset_id)
            .call()
            .await
            .unwrap()
    }
}

pub mod test_helpers {

    use super::*;

    pub async fn setup() -> (NftMetadata, NftMetadata, NftMetadata, MarketplaceMetadata, MarketplaceMetadata, MarketplaceMetadata) {
        let num_wallets = 3;
        let coins_per_wallet = 1;
        let amount_per_coin = 1_000_000;

        let mut wallets = launch_custom_provider_and_get_wallets(
            WalletsConfig::new(
                Some(num_wallets),
                Some(coins_per_wallet),
                Some(amount_per_coin),
            ),
            None,
        )
        .await;

        // Get the wallets from that provider
        let wallet1 = wallets.pop().unwrap();
        let wallet2 = wallets.pop().unwrap();
        let wallet3 = wallets.pop().unwrap();

        let nft_id = Contract::deploy(
            "./out/debug/NFT.bin",
            &wallet1,
            TxParameters::default(),
            StorageConfiguration::with_storage_path(Some(
                "./out/debug/NFT-storage_slots.json".to_string(),
            )),
        )
        .await
        .unwrap();

        let mp_id = Contract::deploy(
            "./out/debug/nft_marketplace.bin",
            &wallet1,
            TxParameters::default(),
            StorageConfiguration::with_storage_path(Some(
                "./out/debug/nft_marketplace-storage_slots.json".to_string(),
            )),
        )
        .await
        .unwrap();

        let nft_deploy_wallet = NftMetadata {
            contract: Nft::new(nft_id.to_string(), wallet1.clone()),
            wallet: wallet1.clone(),
        };

        let nft_owner1 = NftMetadata {
            contract: Nft::new(nft_id.to_string(), wallet2.clone()),
            wallet: wallet2.clone(),
        };

        let nft_owner2 = NftMetadata {
            contract: Nft::new(nft_id.to_string(), wallet3.clone()),
            wallet: wallet3.clone(),
        };

        let mp_deploy_wallet = MarketplaceMetadata {
            contract: Marketplace::new(mp_id.to_string(), wallet1.clone()),
            wallet: wallet1.clone(),
        };

        let mp_owner1 = MarketplaceMetadata {
            contract: Marketplace::new(mp_id.to_string(), wallet2.clone()),
            wallet: wallet2.clone(),
        };

        let mp_owner2 = MarketplaceMetadata {
            contract: Marketplace::new(mp_id.to_string(), wallet3.clone()),
            wallet: wallet3.clone(),
        };


        (nft_deploy_wallet, nft_owner1, nft_owner2, mp_deploy_wallet, mp_owner1, mp_owner2)
    }
}
