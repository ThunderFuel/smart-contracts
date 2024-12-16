/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.95.0
*/

import { Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  AbstractAddress,
  BigNumberish,
  BN,
  FunctionFragment,
  InvokeFunction,
} from 'fuels';

import type { Option, Enum } from "./common";

export enum AccessErrorInput { CannotReinitialized = 'CannotReinitialized', NotOwner = 'NotOwner' };
export enum AccessErrorOutput { CannotReinitialized = 'CannotReinitialized', NotOwner = 'NotOwner' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export enum PoolErrorsInput { OnlyOwner = 'OnlyOwner', Initialized = 'Initialized', AssetNotSupported = 'AssetNotSupported', AmountHigherThanBalance = 'AmountHigherThanBalance', CallerMustBeTheExchange = 'CallerMustBeTheExchange', IdentityMustBeNonZero = 'IdentityMustBeNonZero', FromToSameAddress = 'FromToSameAddress' };
export enum PoolErrorsOutput { OnlyOwner = 'OnlyOwner', Initialized = 'Initialized', AssetNotSupported = 'AssetNotSupported', AmountHigherThanBalance = 'AmountHigherThanBalance', CallerMustBeTheExchange = 'CallerMustBeTheExchange', IdentityMustBeNonZero = 'IdentityMustBeNonZero', FromToSameAddress = 'FromToSameAddress' };

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type DepositInput = { address: IdentityInput, asset: AssetIdInput, amount: BigNumberish };
export type DepositOutput = { address: IdentityOutput, asset: AssetIdOutput, amount: BN };
export type OwnershipRenouncedInput = { previous_owner: IdentityInput };
export type OwnershipRenouncedOutput = { previous_owner: IdentityOutput };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type OwnershipTransferredInput = { new_owner: IdentityInput, previous_owner: IdentityInput };
export type OwnershipTransferredOutput = { new_owner: IdentityOutput, previous_owner: IdentityOutput };
export type TransferInput = { from: IdentityInput, to: IdentityInput, asset: AssetIdInput, amount: BigNumberish };
export type TransferOutput = { from: IdentityOutput, to: IdentityOutput, asset: AssetIdOutput, amount: BN };
export type WithdrawalInput = { address: IdentityInput, asset: AssetIdInput, amount: BigNumberish };
export type WithdrawalOutput = { address: IdentityOutput, asset: AssetIdOutput, amount: BN };

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "enum errors::PoolErrors",
      "concreteTypeId": "d84fbe711625fc4963485a182bc445234732de8f75b22bb77cb6d99945f0d39a",
      "metadataTypeId": 1
    },
    {
      "type": "enum libraries::ownable::AccessError",
      "concreteTypeId": "b125b3c353d0e20ba2296785cc1653908f3c1fb7e67e055938c31fd0e1bb8086",
      "metadataTypeId": 2
    },
    {
      "type": "enum std::identity::Identity",
      "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335",
      "metadataTypeId": 3
    },
    {
      "type": "enum std::option::Option<enum std::identity::Identity>",
      "concreteTypeId": "253aea1197e8005518365bd24c8bc31f73a434fac0f7350e57696edfdd4850c2",
      "metadataTypeId": 4,
      "typeArguments": [
        "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
      ]
    },
    {
      "type": "struct events::Deposit",
      "concreteTypeId": "a93fb3d7088884ac8084fc44b117612059604f3d2051bfb1e2612381c3cebda9",
      "metadataTypeId": 6
    },
    {
      "type": "struct events::Transfer",
      "concreteTypeId": "ce820e1eb27c6aa6e2b6ba949183eb4a090927d56fbc51168bb4a45081326a7a",
      "metadataTypeId": 7
    },
    {
      "type": "struct events::Withdrawal",
      "concreteTypeId": "b84bb3c31965b31ba7e5d56509fdca7789962e30c056cae6569a46c6a41778a0",
      "metadataTypeId": 8
    },
    {
      "type": "struct libraries::ownable::OwnershipRenounced",
      "concreteTypeId": "6dd047dcef1fafba87b54170a1ee4a99a8ae37746e594cbc548c5315368b20c3",
      "metadataTypeId": 9
    },
    {
      "type": "struct libraries::ownable::OwnershipSet",
      "concreteTypeId": "8416605cb05f0e41791636365d6644426eb8723c9bbdfc940b41652fc5bb7e61",
      "metadataTypeId": 10
    },
    {
      "type": "struct libraries::ownable::OwnershipTransferred",
      "concreteTypeId": "947c52bd18fcf648398d82d4d7b3cb539ef96fec3211f41a6e733a8a4f02f67e",
      "metadataTypeId": 11
    },
    {
      "type": "struct std::asset_id::AssetId",
      "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974",
      "metadataTypeId": 13
    },
    {
      "type": "struct std::contract_id::ContractId",
      "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      "metadataTypeId": 14
    },
    {
      "type": "u64",
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    }
  ],
  "metadataTypes": [
    {
      "type": "b256",
      "metadataTypeId": 0
    },
    {
      "type": "enum errors::PoolErrors",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "OnlyOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Initialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AssetNotSupported",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AmountHigherThanBalance",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "CallerMustBeTheExchange",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "IdentityMustBeNonZero",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "FromToSameAddress",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum libraries::ownable::AccessError",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "CannotReinitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "NotOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "Address",
          "typeId": 12
        },
        {
          "name": "ContractId",
          "typeId": 14
        }
      ]
    },
    {
      "type": "enum std::option::Option",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "None",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Some",
          "typeId": 5
        }
      ],
      "typeParameters": [
        5
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 5
    },
    {
      "type": "struct events::Deposit",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "address",
          "typeId": 3
        },
        {
          "name": "asset",
          "typeId": 13
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::Transfer",
      "metadataTypeId": 7,
      "components": [
        {
          "name": "from",
          "typeId": 3
        },
        {
          "name": "to",
          "typeId": 3
        },
        {
          "name": "asset",
          "typeId": 13
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::Withdrawal",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "address",
          "typeId": 3
        },
        {
          "name": "asset",
          "typeId": 13
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct libraries::ownable::OwnershipRenounced",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "previous_owner",
          "typeId": 3
        }
      ]
    },
    {
      "type": "struct libraries::ownable::OwnershipSet",
      "metadataTypeId": 10,
      "components": [
        {
          "name": "new_owner",
          "typeId": 3
        }
      ]
    },
    {
      "type": "struct libraries::ownable::OwnershipTransferred",
      "metadataTypeId": 11,
      "components": [
        {
          "name": "new_owner",
          "typeId": 3
        },
        {
          "name": "previous_owner",
          "typeId": 3
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 12,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::asset_id::AssetId",
      "metadataTypeId": 13,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 14,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "account",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "balance_of",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Returns the balance of the user by the assetId"
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
      "inputs": [],
      "name": "deposit",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Deposits the supported asset into this contract"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " and assign the deposited amount to the depositer as bid balance"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        },
        {
          "name": "payable",
          "arguments": []
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_asset_manager",
      "output": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Getters"
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
      "inputs": [],
      "name": "get_exchange",
      "output": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
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
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        },
        {
          "name": "asset_manager",
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        }
      ],
      "name": "initialize",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
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
      "output": "253aea1197e8005518365bd24c8bc31f73a434fac0f7350e57696edfdd4850c2",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Ownable"
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
      "inputs": [],
      "name": "renounce_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
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
          "name": "asset_manager",
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        }
      ],
      "name": "set_asset_manager",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
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
          "name": "exchange_contract",
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        }
      ],
      "name": "set_exchange",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Setters"
          ]
        },
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
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "total_supply",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Returns the total supply of the asset in this contract"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "from",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "to",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        },
        {
          "name": "amount",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "transfer_from",
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Transfers the amount of bid balance from Identity to another Identity."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " Only callable by Thunder Exchange contract."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " It is used in accepting offers where the bid balance"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " is removed from the offerer by the amount of the offer and sent to the exchange contract"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " to unwrap the bid balance and send the amount to the user who accepted the offer after deducting the fees."
          ]
        },
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
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        }
      ],
      "name": "transfer_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
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
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        },
        {
          "name": "amount",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "withdraw",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Withdraws the amount of assetId from the contract"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " and sends to sender if sender has enough balance"
          ]
        },
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
      "logId": "15586886228264746057",
      "concreteTypeId": "d84fbe711625fc4963485a182bc445234732de8f75b22bb77cb6d99945f0d39a"
    },
    {
      "logId": "12195664052085097644",
      "concreteTypeId": "a93fb3d7088884ac8084fc44b117612059604f3d2051bfb1e2612381c3cebda9"
    },
    {
      "logId": "12764806370357731851",
      "concreteTypeId": "b125b3c353d0e20ba2296785cc1653908f3c1fb7e67e055938c31fd0e1bb8086"
    },
    {
      "logId": "9517900813706399297",
      "concreteTypeId": "8416605cb05f0e41791636365d6644426eb8723c9bbdfc940b41652fc5bb7e61"
    },
    {
      "logId": "7912903559520169914",
      "concreteTypeId": "6dd047dcef1fafba87b54170a1ee4a99a8ae37746e594cbc548c5315368b20c3"
    },
    {
      "logId": "14880471643791846054",
      "concreteTypeId": "ce820e1eb27c6aa6e2b6ba949183eb4a090927d56fbc51168bb4a45081326a7a"
    },
    {
      "logId": "10699517786846983752",
      "concreteTypeId": "947c52bd18fcf648398d82d4d7b3cb539ef96fec3211f41a6e733a8a4f02f67e"
    },
    {
      "logId": "13279905576758129435",
      "concreteTypeId": "b84bb3c31965b31ba7e5d56509fdca7789962e30c056cae6569a46c6a41778a0"
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const storageSlots: StorageSlot[] = [
  {
    "key": "1d63cc2495bbf5570c9a6d7f632018dc033107e7f4452405c44601bb771a4a5d",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "1d63cc2495bbf5570c9a6d7f632018dc033107e7f4452405c44601bb771a4a5e",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "38a1b038206f348ec947ba5770c6d713148c9d8bb0b312f47acc88777da1c09d",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "5241fe67131bb3e82a0a52cc83936f02e45f5108564dba8af8faef76ba31fd0a",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "5241fe67131bb3e82a0a52cc83936f02e45f5108564dba8af8faef76ba31fd0b",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "a26e4af2782c0ebfbe03e765ee791b2f42d3b347e2cc15ae0df792a366dfacc0",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "a26e4af2782c0ebfbe03e765ee791b2f42d3b347e2cc15ae0df792a366dfacc1",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class PoolInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    balance_of: FunctionFragment;
    deposit: FunctionFragment;
    get_asset_manager: FunctionFragment;
    get_exchange: FunctionFragment;
    initialize: FunctionFragment;
    owner: FunctionFragment;
    renounce_ownership: FunctionFragment;
    set_asset_manager: FunctionFragment;
    set_exchange: FunctionFragment;
    total_supply: FunctionFragment;
    transfer_from: FunctionFragment;
    transfer_ownership: FunctionFragment;
    withdraw: FunctionFragment;
  };
}

export class Pool extends Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: PoolInterface;
  declare functions: {
    balance_of: InvokeFunction<[account: IdentityInput, asset: AssetIdInput], BN>;
    deposit: InvokeFunction<[], void>;
    get_asset_manager: InvokeFunction<[], ContractIdOutput>;
    get_exchange: InvokeFunction<[], ContractIdOutput>;
    initialize: InvokeFunction<[exchange: ContractIdInput, asset_manager: ContractIdInput], void>;
    owner: InvokeFunction<[], Option<IdentityOutput>>;
    renounce_ownership: InvokeFunction<[], void>;
    set_asset_manager: InvokeFunction<[asset_manager: ContractIdInput], void>;
    set_exchange: InvokeFunction<[exchange_contract: ContractIdInput], void>;
    total_supply: InvokeFunction<[asset: AssetIdInput], BN>;
    transfer_from: InvokeFunction<[from: IdentityInput, to: IdentityInput, asset: AssetIdInput, amount: BigNumberish], boolean>;
    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    withdraw: InvokeFunction<[asset: AssetIdInput, amount: BigNumberish], void>;
  };

  constructor(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
