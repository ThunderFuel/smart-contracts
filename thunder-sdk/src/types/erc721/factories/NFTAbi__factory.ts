/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.38.1
  Forc version: 0.35.5
  Fuel-Core version: 0.17.3
*/

import { Interface, Contract } from "fuels";
import type { Provider, Account, AbstractAddress } from "fuels";
import type { NFTAbi, NFTAbiInterface } from "../NFTAbi";

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
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "bool",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum AccessError",
      "components": [
        {
          "name": "SenderCannotSetAccessControl",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "SenderNotAdmin",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "SenderNotOwner",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "SenderNotOwnerOrApproved",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 12,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "enum InputError",
      "components": [
        {
          "name": "AdminDoesNotExist",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "ApprovedDoesNotExist",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotEnoughTokensToMint",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OwnerDoesNotExist",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "TokenDoesNotExist",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "TokenSupplyCannotBeZero",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 8,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        8
      ]
    },
    {
      "typeId": 8,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "str[19]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "str[46]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "str[7]",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 13,
      "type": "struct Approval",
      "components": [
        {
          "name": "owner",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "approved",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "struct ApprovalForAll",
      "components": [
        {
          "name": "owner",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "operator",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "approved",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 16,
      "type": "struct OwnershipSet",
      "components": [
        {
          "name": "new_owner",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 17,
      "type": "struct TokenMetaData",
      "components": [
        {
          "name": "name",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "symbol",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "token_uri",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 18,
      "type": "struct Transfer",
      "components": [
        {
          "name": "from",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "to",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 19,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "to",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "approve",
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
          "name": "user",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "balanceOf",
      "output": {
        "name": "",
        "type": 19,
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
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "getApproved",
      "output": {
        "name": "",
        "type": 5,
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
          "name": "maxSupply",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "transferManager",
          "type": 15,
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
          "name": "user",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "operator",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "isApprovedForAll",
      "output": {
        "name": "",
        "type": 3,
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
      "name": "maxSupply",
      "output": {
        "name": "",
        "type": 19,
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
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "metadata",
      "output": {
        "name": "",
        "type": 17,
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
          "name": "amount",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "to",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "mint",
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
      "name": "owner",
      "output": {
        "name": "",
        "type": 7,
        "typeArguments": [
          {
            "name": "",
            "type": 5,
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
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "ownerOf",
      "output": {
        "name": "",
        "type": 5,
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
          "name": "from",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "to",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "safeTransferFrom",
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
          "name": "operator",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "approved",
          "type": 3,
          "typeArguments": null
        }
      ],
      "name": "setApprovalForAll",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "interfaceId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "supportsInterface",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "output": {
        "name": "",
        "type": 19,
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
          "name": "from",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "to",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "tokenId",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "transferFrom",
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
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 13,
        "typeArguments": []
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 9,
        "typeArguments": null
      }
    },
    {
      "logId": 6,
      "loggedType": {
        "name": "",
        "type": 16,
        "typeArguments": []
      }
    },
    {
      "logId": 7,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 8,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 9,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 10,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 11,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 12,
      "loggedType": {
        "name": "",
        "type": 18,
        "typeArguments": []
      }
    },
    {
      "logId": 13,
      "loggedType": {
        "name": "",
        "type": 14,
        "typeArguments": []
      }
    },
    {
      "logId": 14,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 15,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 16,
      "loggedType": {
        "name": "",
        "type": 18,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
}

export class NFTAbi__factory {
  static readonly abi = _abi
  static createInterface(): NFTAbiInterface {
    return new Interface(_abi) as unknown as NFTAbiInterface
  }
  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): NFTAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as NFTAbi
  }
}
