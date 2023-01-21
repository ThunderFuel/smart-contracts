/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import { Interface, Contract } from "fuels";
import type {
  AssetManagerAbi,
  AssetManagerAbiInterface,
} from "../AssetManagerAbi";
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
      type: "b256",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 2,
      type: "bool",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 3,
      type: "enum AccessError",
      components: [
        {
          name: "CannotReinitialized",
          type: 0,
          typeArguments: null,
        },
        {
          name: "NotOwner",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 4,
      type: "enum Identity",
      components: [
        {
          name: "Address",
          type: 8,
          typeArguments: null,
        },
        {
          name: "ContractId",
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 5,
      type: "enum Option",
      components: [
        {
          name: "None",
          type: 0,
          typeArguments: null,
        },
        {
          name: "Some",
          type: 6,
          typeArguments: null,
        },
      ],
      typeParameters: [6],
    },
    {
      typeId: 6,
      type: "generic T",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 7,
      type: "raw untyped ptr",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 8,
      type: "struct Address",
      components: [
        {
          name: "value",
          type: 1,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 9,
      type: "struct ContractId",
      components: [
        {
          name: "value",
          type: 1,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 10,
      type: "struct OwnershipRenounced",
      components: [
        {
          name: "previous_owner",
          type: 4,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 11,
      type: "struct OwnershipSet",
      components: [
        {
          name: "new_owner",
          type: 4,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 12,
      type: "struct OwnershipTransferred",
      components: [
        {
          name: "new_owner",
          type: 4,
          typeArguments: null,
        },
        {
          name: "previous_owner",
          type: 4,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 13,
      type: "struct RawVec",
      components: [
        {
          name: "ptr",
          type: 7,
          typeArguments: null,
        },
        {
          name: "cap",
          type: 15,
          typeArguments: null,
        },
      ],
      typeParameters: [6],
    },
    {
      typeId: 14,
      type: "struct Vec",
      components: [
        {
          name: "buf",
          type: 13,
          typeArguments: [
            {
              name: "",
              type: 6,
              typeArguments: null,
            },
          ],
        },
        {
          name: "len",
          type: 15,
          typeArguments: null,
        },
      ],
      typeParameters: [6],
    },
    {
      typeId: 15,
      type: "u64",
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: "asset",
          type: 9,
          typeArguments: null,
        },
      ],
      name: "add_asset",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [],
      name: "get_count_supported_assets",
      output: {
        name: "",
        type: 15,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [],
      name: "get_supported_assets",
      output: {
        name: "",
        type: 14,
        typeArguments: [
          {
            name: "",
            type: 9,
            typeArguments: null,
          },
        ],
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [],
      name: "initialize",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "asset",
          type: 9,
          typeArguments: null,
        },
      ],
      name: "is_asset_supported",
      output: {
        name: "",
        type: 2,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [],
      name: "owner",
      output: {
        name: "",
        type: 5,
        typeArguments: [
          {
            name: "",
            type: 4,
            typeArguments: null,
          },
        ],
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "asset",
          type: 9,
          typeArguments: null,
        },
      ],
      name: "remove_asset",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [],
      name: "renounce_ownership",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "new_owner",
          type: 4,
          typeArguments: null,
        },
      ],
      name: "transfer_ownership",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: 0,
      loggedType: {
        name: "",
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 1,
      loggedType: {
        name: "",
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 2,
      loggedType: {
        name: "",
        type: 11,
        typeArguments: [],
      },
    },
    {
      logId: 3,
      loggedType: {
        name: "",
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 4,
      loggedType: {
        name: "",
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 5,
      loggedType: {
        name: "",
        type: 10,
        typeArguments: [],
      },
    },
    {
      logId: 6,
      loggedType: {
        name: "",
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 7,
      loggedType: {
        name: "",
        type: 12,
        typeArguments: [],
      },
    },
  ],
  messagesTypes: [],
  configurables: [],
};

export class AssetManagerAbi__factory {
  static readonly abi = _abi;
  static createInterface(): AssetManagerAbiInterface {
    return new Interface(_abi) as unknown as AssetManagerAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): AssetManagerAbi {
    return new Contract(
      id,
      _abi,
      walletOrProvider
    ) as unknown as AssetManagerAbi;
  }
}
