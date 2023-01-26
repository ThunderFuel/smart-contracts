/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import { Interface, Contract } from "fuels";
import type {
  ThunderExchangeAbi,
  ThunderExchangeAbiInterface,
} from "../ThunderExchangeAbi";
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
      typeId: 3,
      type: "enum Identity",
      components: [
        {
          name: "Address",
          type: 20,
          typeArguments: null,
        },
        {
          name: "ContractId",
          type: 21,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 4,
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
      typeId: 5,
      type: "enum Side",
      components: [
        {
          name: "Buy",
          type: 0,
          typeArguments: null,
        },
        {
          name: "Sell",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 6,
      type: "generic T",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 7,
      type: "str[20]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 8,
      type: "str[24]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 9,
      type: "str[25]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 10,
      type: "str[26]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 11,
      type: "str[27]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 12,
      type: "str[29]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 13,
      type: "str[30]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 14,
      type: "str[31]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 15,
      type: "str[34]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 16,
      type: "str[36]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 17,
      type: "str[37]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 18,
      type: "str[41]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 19,
      type: "str[42]",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 20,
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
      typeId: 21,
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
      typeId: 22,
      type: "struct ExtraParams",
      components: [
        {
          name: "extra_address_param",
          type: 20,
          typeArguments: null,
        },
        {
          name: "extra_contract_param",
          type: 21,
          typeArguments: null,
        },
        {
          name: "extra_u64_param",
          type: 29,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 23,
      type: "struct MakerOrder",
      components: [
        {
          name: "side",
          type: 5,
          typeArguments: null,
        },
        {
          name: "maker",
          type: 20,
          typeArguments: null,
        },
        {
          name: "collection",
          type: 21,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 29,
          typeArguments: null,
        },
        {
          name: "price",
          type: 29,
          typeArguments: null,
        },
        {
          name: "amount",
          type: 29,
          typeArguments: null,
        },
        {
          name: "nonce",
          type: 29,
          typeArguments: null,
        },
        {
          name: "strategy",
          type: 21,
          typeArguments: null,
        },
        {
          name: "payment_asset",
          type: 21,
          typeArguments: null,
        },
        {
          name: "start_time",
          type: 29,
          typeArguments: null,
        },
        {
          name: "end_time",
          type: 29,
          typeArguments: null,
        },
        {
          name: "extra_params",
          type: 22,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 24,
      type: "struct MakerOrderInput",
      components: [
        {
          name: "side",
          type: 5,
          typeArguments: null,
        },
        {
          name: "maker",
          type: 20,
          typeArguments: null,
        },
        {
          name: "collection",
          type: 21,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 29,
          typeArguments: null,
        },
        {
          name: "price",
          type: 29,
          typeArguments: null,
        },
        {
          name: "amount",
          type: 29,
          typeArguments: null,
        },
        {
          name: "nonce",
          type: 29,
          typeArguments: null,
        },
        {
          name: "strategy",
          type: 21,
          typeArguments: null,
        },
        {
          name: "payment_asset",
          type: 21,
          typeArguments: null,
        },
        {
          name: "expiration_range",
          type: 29,
          typeArguments: null,
        },
        {
          name: "extra_params",
          type: 22,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 25,
      type: "struct OwnershipRenounced",
      components: [
        {
          name: "previous_owner",
          type: 3,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 26,
      type: "struct OwnershipSet",
      components: [
        {
          name: "new_owner",
          type: 3,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 27,
      type: "struct OwnershipTransferred",
      components: [
        {
          name: "new_owner",
          type: 3,
          typeArguments: null,
        },
        {
          name: "previous_owner",
          type: 3,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 28,
      type: "struct TakerOrder",
      components: [
        {
          name: "side",
          type: 5,
          typeArguments: null,
        },
        {
          name: "taker",
          type: 20,
          typeArguments: null,
        },
        {
          name: "maker",
          type: 20,
          typeArguments: null,
        },
        {
          name: "nonce",
          type: 29,
          typeArguments: null,
        },
        {
          name: "price",
          type: 29,
          typeArguments: null,
        },
        {
          name: "token_id",
          type: 29,
          typeArguments: null,
        },
        {
          name: "collection",
          type: 21,
          typeArguments: null,
        },
        {
          name: "strategy",
          type: 21,
          typeArguments: null,
        },
        {
          name: "extra_params",
          type: 22,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 29,
      type: "u64",
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: "strategy",
          type: 21,
          typeArguments: null,
        },
      ],
      name: "cancel_all_orders",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "strategy",
          type: 21,
          typeArguments: null,
        },
        {
          name: "side",
          type: 5,
          typeArguments: null,
        },
      ],
      name: "cancel_all_orders_by_side",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "order",
          type: 23,
          typeArguments: null,
        },
      ],
      name: "cancel_order",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "order",
          type: 28,
          typeArguments: null,
        },
      ],
      name: "execute_order",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "get_asset_manager",
      output: {
        name: "",
        type: 21,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "get_execution_manager",
      output: {
        name: "",
        type: 21,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "get_protocol_fee_recipient",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "get_royalty_manager",
      output: {
        name: "",
        type: 21,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "get_transfer_selector",
      output: {
        name: "",
        type: 21,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "initialize",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "owner",
      output: {
        name: "",
        type: 4,
        typeArguments: [
          {
            name: "",
            type: 3,
            typeArguments: null,
          },
        ],
      },
    },
    {
      inputs: [
        {
          name: "order_input",
          type: 24,
          typeArguments: null,
        },
      ],
      name: "place_order",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [],
      name: "renounce_ownership",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "asset_manager",
          type: 21,
          typeArguments: null,
        },
      ],
      name: "set_asset_manager",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "execution_manager",
          type: 21,
          typeArguments: null,
        },
      ],
      name: "set_execution_manager",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "protocol_fee_recipient",
          type: 3,
          typeArguments: null,
        },
      ],
      name: "set_protocol_fee_recipient",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "royalty_manager",
          type: 21,
          typeArguments: null,
        },
      ],
      name: "set_royalty_manager",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "transfer_selector",
          type: 21,
          typeArguments: null,
        },
      ],
      name: "set_transfer_selector",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
    },
    {
      inputs: [
        {
          name: "new_owner",
          type: 3,
          typeArguments: null,
        },
      ],
      name: "transfer_ownership",
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
        type: 14,
        typeArguments: null,
      },
    },
    {
      logId: 1,
      loggedType: {
        name: "",
        type: 18,
        typeArguments: null,
      },
    },
    {
      logId: 2,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 3,
      loggedType: {
        name: "",
        type: 17,
        typeArguments: null,
      },
    },
    {
      logId: 4,
      loggedType: {
        name: "",
        type: 17,
        typeArguments: null,
      },
    },
    {
      logId: 5,
      loggedType: {
        name: "",
        type: 14,
        typeArguments: null,
      },
    },
    {
      logId: 6,
      loggedType: {
        name: "",
        type: 12,
        typeArguments: null,
      },
    },
    {
      logId: 7,
      loggedType: {
        name: "",
        type: 12,
        typeArguments: null,
      },
    },
    {
      logId: 8,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 9,
      loggedType: {
        name: "",
        type: 11,
        typeArguments: null,
      },
    },
    {
      logId: 10,
      loggedType: {
        name: "",
        type: 15,
        typeArguments: null,
      },
    },
    {
      logId: 11,
      loggedType: {
        name: "",
        type: 10,
        typeArguments: null,
      },
    },
    {
      logId: 12,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: null,
      },
    },
    {
      logId: 13,
      loggedType: {
        name: "",
        type: 11,
        typeArguments: null,
      },
    },
    {
      logId: 14,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: null,
      },
    },
    {
      logId: 15,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 16,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 17,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 18,
      loggedType: {
        name: "",
        type: 11,
        typeArguments: null,
      },
    },
    {
      logId: 19,
      loggedType: {
        name: "",
        type: 8,
        typeArguments: null,
      },
    },
    {
      logId: 20,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 21,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 22,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 23,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 24,
      loggedType: {
        name: "",
        type: 26,
        typeArguments: [],
      },
    },
    {
      logId: 25,
      loggedType: {
        name: "",
        type: 17,
        typeArguments: null,
      },
    },
    {
      logId: 26,
      loggedType: {
        name: "",
        type: 14,
        typeArguments: null,
      },
    },
    {
      logId: 27,
      loggedType: {
        name: "",
        type: 16,
        typeArguments: null,
      },
    },
    {
      logId: 28,
      loggedType: {
        name: "",
        type: 12,
        typeArguments: null,
      },
    },
    {
      logId: 29,
      loggedType: {
        name: "",
        type: 12,
        typeArguments: null,
      },
    },
    {
      logId: 30,
      loggedType: {
        name: "",
        type: 13,
        typeArguments: null,
      },
    },
    {
      logId: 31,
      loggedType: {
        name: "",
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 32,
      loggedType: {
        name: "",
        type: 7,
        typeArguments: null,
      },
    },
    {
      logId: 33,
      loggedType: {
        name: "",
        type: 19,
        typeArguments: null,
      },
    },
    {
      logId: 34,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 35,
      loggedType: {
        name: "",
        type: 25,
        typeArguments: [],
      },
    },
    {
      logId: 36,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 37,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 38,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 39,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 40,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 41,
      loggedType: {
        name: "",
        type: 2,
        typeArguments: [],
      },
    },
    {
      logId: 42,
      loggedType: {
        name: "",
        type: 27,
        typeArguments: [],
      },
    },
  ],
};

export class ThunderExchangeAbi__factory {
  static readonly abi = _abi;
  static createInterface(): ThunderExchangeAbiInterface {
    return new Interface(_abi) as unknown as ThunderExchangeAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): ThunderExchangeAbi {
    return new Contract(
      id,
      _abi,
      walletOrProvider
    ) as unknown as ThunderExchangeAbi;
  }
}