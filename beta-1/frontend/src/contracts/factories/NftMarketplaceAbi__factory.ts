/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, Wallet, AbstractAddress } from "fuels";
import { Interface, Contract } from "fuels";
import type {
  NftMarketplaceAbi,
  NftMarketplaceAbiInterface,
} from "../NftMarketplaceAbi";
const _abi = [
  {
    type: "function",
    name: "admin",
    inputs: [],
    outputs: [
      {
        type: "struct Address",
        name: "",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "fee_receiver",
    inputs: [],
    outputs: [
      {
        type: "enum Identity",
        name: "",
        components: [
          {
            type: "struct Address",
            name: "Address",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "struct ContractId",
            name: "ContractId",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "initialized",
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "protocol_fee",
    inputs: [],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "is_listed",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_listed_nft",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "struct ListedNFT",
        name: "",
        components: [
          {
            type: "struct ContractId",
            name: "contract_Id",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "token_id",
          },
          {
            type: "struct TokenMetaData",
            name: "meta_data",
            components: [
              {
                type: "str[7]",
                name: "name",
              },
              {
                type: "str[7]",
                name: "symbol",
              },
              {
                type: "(_, _)",
                name: "token_uri",
                components: [
                  {
                    type: "str[46]",
                    name: "__tuple_element",
                  },
                  {
                    type: "u64",
                    name: "__tuple_element",
                  },
                ],
              },
            ],
          },
          {
            type: "enum Identity",
            name: "owner",
            components: [
              {
                type: "struct Address",
                name: "Address",
                components: [
                  {
                    type: "b256",
                    name: "value",
                  },
                ],
              },
              {
                type: "struct ContractId",
                name: "ContractId",
                components: [
                  {
                    type: "b256",
                    name: "value",
                  },
                ],
              },
            ],
          },
          {
            type: "struct ContractId",
            name: "asset_id",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "price",
          },
          {
            type: "u64",
            name: "expiration_date",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "get_listing_expiration_date",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_offer_expiration_date",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
    ],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_auction_expiration_date",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "supported_asset",
    inputs: [
      {
        type: "struct ContractId",
        name: "asset_id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_offer",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
    ],
    outputs: [
      {
        type: "struct Offer",
        name: "",
        components: [
          {
            type: "struct Address",
            name: "offerer",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "offer_amount",
          },
          {
            type: "struct ContractId",
            name: "collection",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "token_id",
          },
          {
            type: "u64",
            name: "expiration_date",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "get_total_offers",
    inputs: [],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "is_valid_offer",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_auction",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "struct TimedAuction",
        name: "",
        components: [
          {
            type: "struct ContractId",
            name: "contract_Id",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "token_id",
          },
          {
            type: "struct Address",
            name: "seller",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "starting_price",
          },
          {
            type: "u64",
            name: "expiration_date",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "is_valid_auction",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "get_highest_bid",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "struct HighestBid",
        name: "",
        components: [
          {
            type: "struct Address",
            name: "bider",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "u64",
            name: "bid_amount",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "get_weth",
    inputs: [],
    outputs: [
      {
        type: "struct ContractId",
        name: "",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "constructor",
    inputs: [
      {
        type: "struct Address",
        name: "admin",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "enum Identity",
        name: "receiver",
        components: [
          {
            type: "struct Address",
            name: "Address",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "struct ContractId",
            name: "ContractId",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
        ],
      },
      {
        type: "u64",
        name: "fee",
      },
      {
        type: "struct ContractId",
        name: "weth_contract",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "list_nft",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
      {
        type: "struct ContractId",
        name: "asset_id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "price",
      },
      {
        type: "u64",
        name: "expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "cancel_listing",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "update_listing",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
      {
        type: "u64",
        name: "new_price",
      },
      {
        type: "u64",
        name: "new_expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "purchase_nft",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "make_offer",
    inputs: [
      {
        type: "struct ContractId",
        name: "collection",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
      {
        type: "u64",
        name: "offer_amount",
      },
      {
        type: "u64",
        name: "expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "update_offer",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
      {
        type: "u64",
        name: "new_offer_amount",
      },
      {
        type: "u64",
        name: "new_expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "cancel_offer",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "accept_offer",
    inputs: [
      {
        type: "u64",
        name: "offer_index",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "start_auction",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
      {
        type: "u64",
        name: "starting_price",
      },
      {
        type: "u64",
        name: "expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "cancel_auction",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "place_bid",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
      {
        type: "u64",
        name: "bid_amount",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "accept_highest_bid",
    inputs: [
      {
        type: "struct ContractId",
        name: "contract_Id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
      {
        type: "u64",
        name: "token_id",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_admin",
    inputs: [
      {
        type: "struct Address",
        name: "admin",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_fee_receiver",
    inputs: [
      {
        type: "enum Identity",
        name: "receiver",
        components: [
          {
            type: "struct Address",
            name: "Address",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
          {
            type: "struct ContractId",
            name: "ContractId",
            components: [
              {
                type: "b256",
                name: "value",
              },
            ],
          },
        ],
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_pause",
    inputs: [],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_protocol_fee",
    inputs: [
      {
        type: "u64",
        name: "new_fee",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "add_supported_asset",
    inputs: [
      {
        type: "struct ContractId",
        name: "asset_id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "remove_supported_asset",
    inputs: [
      {
        type: "struct ContractId",
        name: "asset_id",
        components: [
          {
            type: "b256",
            name: "value",
          },
        ],
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_min_expiration",
    inputs: [
      {
        type: "u64",
        name: "min_expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
  {
    type: "function",
    name: "set_max_expiration",
    inputs: [
      {
        type: "u64",
        name: "max_expiration",
      },
    ],
    outputs: [
      {
        type: "()",
        name: "",
        components: [],
      },
    ],
  },
];

export class NftMarketplaceAbi__factory {
  static readonly abi = _abi;
  static createInterface(): NftMarketplaceAbiInterface {
    return new Interface(_abi) as unknown as NftMarketplaceAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: Wallet | Provider
  ): NftMarketplaceAbi {
    return new Contract(
      id,
      _abi,
      walletOrProvider
    ) as unknown as NftMarketplaceAbi;
  }
}