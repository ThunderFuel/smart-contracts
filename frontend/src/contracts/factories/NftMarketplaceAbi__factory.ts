/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import { Interface, Contract } from "fuels";
import type {
  NftMarketplaceAbi,
  NftMarketplaceAbiInterface,
} from "../NftMarketplaceAbi";
const _abi = {
  types: [
    {
      typeId: 0,
      type: "()",
      components: [],
      typeParameters: null,
    },
    {
      typeId: 1,
      type: "(_, _)",
      components: [
        {
          name: "__tuple_element",
          type: 10,
          typeArguments: null,
        },
        {
          name: "__tuple_element",
          type: 19,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 2,
      type: "b256",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 3,
      type: "bool",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 4,
      type: "enum AccessError",
      components: [
        {
          name: "CallerIsNotAdmin",
          type: 0,
          typeArguments: null,
        },
        {
          name: "AdminDoesNotExist",
          type: 0,
          typeArguments: null,
        },
        {
          name: "ReceiverDoesNotExist",
          type: 0,
          typeArguments: null,
        },
        {
          name: "AlreadyInitialized",
          type: 0,
          typeArguments: null,
        },
        {
          name: "ContractIsPaused",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 5,
      type: "enum AssetError",
      components: [
        {
          name: "AlreadySupported",
          type: 0,
          typeArguments: null,
        },
        {
          name: "NotSupported",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 6,
      type: "enum Identity",
      components: [
        {
          name: "Address",
          type: 12,
          typeArguments: null,
        },
        {
          name: "ContractId",
          type: 13,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 7,
      type: "enum InputError",
      components: [
        {
          name: "PriceCannotBeZero",
          type: 0,
          typeArguments: null,
        },
        {
          name: "AddressCannotBeZero",
          type: 0,
          typeArguments: null,
        },
        {
          name: "ContractIdCannotBeZero",
          type: 0,
          typeArguments: null,
        },
        {
          name: "IdentityCannotBeZero",
          type: 0,
          typeArguments: null,
        },
        {
          name: "FeeIsTooHigh",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 8,
      type: "enum ListingError",
      components: [
        {
          name: "AlreadyListed",
          type: 0,
          typeArguments: null,
        },
        {
          name: "NotListed",
          type: 0,
          typeArguments: null,
        },
        {
          name: "IsNotApprovedForAll",
          type: 0,
          typeArguments: null,
        },
        {
          name: "CallerNotOwner",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 9,
      type: "enum PurchaseError",
      components: [
        {
          name: "WrongAsset",
          type: 0,
          typeArguments: null,
        },
        {
          name: "WrongAmount",
          type: 0,
          typeArguments: null,
        },
        {
          name: "OwnerCannotPurchase",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 10,
      type: "str[46]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 11,
      type: "str[7]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 12,
      type: "struct Address",
      components: [
        {
          name: "value",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 13,
      type: "struct ContractId",
      components: [
        {
          name: "value",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 14,
      type: "struct ListEvent",
      components: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "meta_data",
          type: 18,
          typeArguments: null,
        },
        {
          name: "owner",
          type: 6,
          typeArguments: null,
        },
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "price",
          type: 19,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 15,
      type: "struct ListedNFT",
      components: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "meta_data",
          type: 18,
          typeArguments: null,
        },
        {
          name: "owner",
          type: 6,
          typeArguments: null,
        },
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "price",
          type: 19,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 16,
      type: "struct PriceUpdateEvent",
      components: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "new_price",
          type: 19,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 17,
      type: "struct PurchaseEvent",
      components: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "meta_data",
          type: 18,
          typeArguments: null,
        },
        {
          name: "new_owner",
          type: 6,
          typeArguments: null,
        },
        {
          name: "purchase_price",
          type: 19,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 18,
      type: "struct TokenMetaData",
      components: [
        {
          name: "name",
          type: 11,
          typeArguments: null,
        },
        {
          name: "symbol",
          type: 11,
          typeArguments: null,
        },
        {
          name: "token_uri",
          type: 1,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 19,
      type: "u64",
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
      ],
      name: "add_supported_asset",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "admin",
      output: {
        name: "",
        type: 12,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "admin",
          type: 12,
          typeArguments: null,
        },
        {
          name: "receiver",
          type: 6,
          typeArguments: null,
        },
        {
          name: "fee",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "constructor",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "delete_listing",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "fee_receiver",
      output: {
        name: "",
        type: 6,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "initialized",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "is_listed",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "price",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "list_nft",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "listed_nft",
      output: {
        name: "",
        type: 15,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "pause",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "protocol_fee",
      output: {
        name: "",
        type: 19,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "purchase_nft",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
      ],
      name: "remove_supported_asset",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "admin",
          type: 12,
          typeArguments: null,
        },
      ],
      name: "set_admin",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "receiver",
          type: 6,
          typeArguments: null,
        },
      ],
      name: "set_fee_receiver",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "set_pause",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "new_fee",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "set_protocol_fee",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "asset_id",
          type: 13,
          typeArguments: null,
        },
      ],
      name: "supported_asset",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "contract_Id",
          type: 13,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 19,
          typeArguments: null,
        },
        {
          name: "new_price",
          type: 19,
          typeArguments: null,
        },
      ],
      name: "update_price",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
  ],
  loggedTypes: [
    {
      logId: 0,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 1,
      loggedType: {
        name: "",
        type: 5,
        typeArguments: [],
      },
    },
    {
      logId: 2,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 3,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 4,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 5,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 6,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 7,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 8,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 9,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 10,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 11,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 12,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 13,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 14,
      loggedType: {
        name: "",
        type: 5,
        typeArguments: [],
      },
    },
    {
      logId: 15,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 16,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 17,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 18,
      loggedType: {
        name: "",
        type: 14,
        typeArguments: [],
      },
    },
    {
      logId: 19,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 20,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: [],
      },
    },
    {
      logId: 21,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 22,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 23,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 24,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: [],
      },
    },
    {
      logId: 25,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: [],
      },
    },
    {
      logId: 26,
      loggedType: {
        name: "",
        type: 17,
        typeArguments: [],
      },
    },
    {
      logId: 27,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 28,
      loggedType: {
        name: "",
        type: 5,
        typeArguments: [],
      },
    },
    {
      logId: 29,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 30,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 31,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 32,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 33,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 34,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 35,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 36,
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: 37,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 38,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: [],
      },
    },
    {
      logId: 39,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 40,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 41,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: 42,
      loggedType: {
        name: "",
        type: 16,
        typeArguments: [],
      },
    },
  ],
};

export class NftMarketplaceAbi__factory {
  static readonly abi = _abi;
  static createInterface(): NftMarketplaceAbiInterface {
    return new Interface(_abi) as unknown as NftMarketplaceAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): NftMarketplaceAbi {
    return new Contract(
      id,
      _abi,
      walletOrProvider
    ) as unknown as NftMarketplaceAbi;
  }
}
