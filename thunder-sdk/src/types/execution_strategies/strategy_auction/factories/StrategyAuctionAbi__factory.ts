/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.37.0
  Forc version: 0.35.3
  Fuel-Core version: 0.17.3
*/

import { Interface, Contract } from "fuels";
import type { Provider, Account, AbstractAddress } from "fuels";
import type { StrategyAuctionAbi, StrategyAuctionAbiInterface } from "../StrategyAuctionAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "bool",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "enum AccessError",
      "components": [
        {
          "name": "CannotReinitialized",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotOwner",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 21,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 6,
      "type": "enum Side",
      "components": [
        {
          "name": "Buy",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Sell",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "str[21]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "str[22]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "str[23]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "str[27]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "str[29]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 13,
      "type": "str[31]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "str[34]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "str[35]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 16,
      "type": "str[37]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 17,
      "type": "str[38]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 18,
      "type": "str[47]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 19,
      "type": "str[53]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 20,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 21,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 22,
      "type": "struct ExecutionResult",
      "components": [
        {
          "name": "is_executable",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "collection",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "token_id",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "amount",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "payment_asset",
          "type": 21,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 23,
      "type": "struct ExtraParams",
      "components": [
        {
          "name": "extra_address_param",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "extra_contract_param",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "extra_u64_param",
          "type": 29,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 24,
      "type": "struct MakerOrder",
      "components": [
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "collection",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "token_id",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "price",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "amount",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "nonce",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "strategy",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "payment_asset",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "start_time",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "end_time",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "extra_params",
          "type": 23,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 25,
      "type": "struct OwnershipRenounced",
      "components": [
        {
          "name": "previous_owner",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 26,
      "type": "struct OwnershipSet",
      "components": [
        {
          "name": "new_owner",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 27,
      "type": "struct OwnershipTransferred",
      "components": [
        {
          "name": "new_owner",
          "type": 4,
          "typeArguments": null
        },
        {
          "name": "previous_owner",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 28,
      "type": "struct TakerOrder",
      "components": [
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "taker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "nonce",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "price",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "token_id",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "collection",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "strategy",
          "type": 21,
          "typeArguments": null
        },
        {
          "name": "extra_params",
          "type": 23,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 29,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        }
      ],
      "name": "cancel_all_orders",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "cancel_all_orders_by_side",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "nonce",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "cancel_order",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "order",
          "type": 28,
          "typeArguments": null
        }
      ],
      "name": "execute_order",
      "output": {
        "name": "",
        "type": 22,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_exchange",
      "output": {
        "name": "",
        "type": 21,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "user",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "nonce",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "get_maker_order_of_user",
      "output": {
        "name": "",
        "type": 5,
        "typeArguments": [
          {
            "name": "",
            "type": 24,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "user",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "get_min_order_nonce_of_user",
      "output": {
        "name": "",
        "type": 29,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "user",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "get_order_nonce_of_user",
      "output": {
        "name": "",
        "type": 29,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_protocol_fee",
      "output": {
        "name": "",
        "type": 29,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "exchange",
          "type": 21,
          "typeArguments": null
        }
      ],
      "name": "initialize",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "maker",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "nonce",
          "type": 29,
          "typeArguments": null
        },
        {
          "name": "side",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "is_valid_order",
      "output": {
        "name": "",
        "type": 2,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "owner",
      "output": {
        "name": "",
        "type": 5,
        "typeArguments": [
          {
            "name": "",
            "type": 4,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Ownable ///"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "order",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "place_order",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "renounce_ownership",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "fee",
          "type": 29,
          "typeArguments": null
        }
      ],
      "name": "set_protocol_fee",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_owner",
          "type": 4,
          "typeArguments": null
        }
      ],
      "name": "transfer_ownership",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 11,
        "typeArguments": null
      }
    },
    {
      "logId": 6,
      "loggedType": {
        "name": "",
        "type": 11,
        "typeArguments": null
      }
    },
    {
      "logId": 7,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 8,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 9,
      "loggedType": {
        "name": "",
        "type": 26,
        "typeArguments": []
      }
    },
    {
      "logId": 10,
      "loggedType": {
        "name": "",
        "type": 17,
        "typeArguments": null
      }
    },
    {
      "logId": 11,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": null
      }
    },
    {
      "logId": 12,
      "loggedType": {
        "name": "",
        "type": 13,
        "typeArguments": null
      }
    },
    {
      "logId": 13,
      "loggedType": {
        "name": "",
        "type": 14,
        "typeArguments": null
      }
    },
    {
      "logId": 14,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": null
      }
    },
    {
      "logId": 15,
      "loggedType": {
        "name": "",
        "type": 12,
        "typeArguments": null
      }
    },
    {
      "logId": 16,
      "loggedType": {
        "name": "",
        "type": 18,
        "typeArguments": null
      }
    },
    {
      "logId": 17,
      "loggedType": {
        "name": "",
        "type": 12,
        "typeArguments": null
      }
    },
    {
      "logId": 18,
      "loggedType": {
        "name": "",
        "type": 18,
        "typeArguments": null
      }
    },
    {
      "logId": 19,
      "loggedType": {
        "name": "",
        "type": 8,
        "typeArguments": null
      }
    },
    {
      "logId": 20,
      "loggedType": {
        "name": "",
        "type": 11,
        "typeArguments": null
      }
    },
    {
      "logId": 21,
      "loggedType": {
        "name": "",
        "type": 10,
        "typeArguments": null
      }
    },
    {
      "logId": 22,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": null
      }
    },
    {
      "logId": 23,
      "loggedType": {
        "name": "",
        "type": 8,
        "typeArguments": null
      }
    },
    {
      "logId": 24,
      "loggedType": {
        "name": "",
        "type": 11,
        "typeArguments": null
      }
    },
    {
      "logId": 25,
      "loggedType": {
        "name": "",
        "type": 10,
        "typeArguments": null
      }
    },
    {
      "logId": 26,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": null
      }
    },
    {
      "logId": 27,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 28,
      "loggedType": {
        "name": "",
        "type": 25,
        "typeArguments": []
      }
    },
    {
      "logId": 29,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 30,
      "loggedType": {
        "name": "",
        "type": 9,
        "typeArguments": null
      }
    },
    {
      "logId": 31,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 32,
      "loggedType": {
        "name": "",
        "type": 27,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
}

export class StrategyAuctionAbi__factory {
  static readonly abi = _abi
  static createInterface(): StrategyAuctionAbiInterface {
    return new Interface(_abi) as unknown as StrategyAuctionAbiInterface
  }
  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): StrategyAuctionAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as StrategyAuctionAbi
  }
}
