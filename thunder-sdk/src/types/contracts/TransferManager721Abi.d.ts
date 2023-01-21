/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type {
  Interface,
  FunctionFragment,
  DecodedValue,
  Contract,
  BytesLike,
  BigNumberish,
  InvokeFunction,
  BN,
} from "fuels";

import type { Enum, Option } from "./common";

export type ContractIdInput = { value: string };

export type ContractIdOutput = { value: string };

export type AddressInput = { value: string };

export type AddressOutput = { value: string };

export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;

export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;

interface TransferManager721AbiInterface extends Interface {
  functions: {
    get_exchange: FunctionFragment;
    initialize: FunctionFragment;
    transfer_nft: FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "get_exchange",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "transfer_nft",
    values: [
      ContractIdInput,
      IdentityInput,
      IdentityInput,
      BigNumberish,
      BigNumberish
    ]
  ): Uint8Array;

  decodeFunctionData(
    functionFragment: "get_exchange",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "initialize",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "transfer_nft",
    data: BytesLike
  ): DecodedValue;
}

export class TransferManager721Abi extends Contract {
  interface: TransferManager721AbiInterface;
  functions: {
    get_exchange: InvokeFunction<[], ContractIdOutput>;

    initialize: InvokeFunction<[exchange_contract: ContractIdInput], void>;

    transfer_nft: InvokeFunction<
      [
        collection: ContractIdInput,
        from: IdentityInput,
        to: IdentityInput,
        token_id: BigNumberish,
        amount: BigNumberish
      ],
      void
    >;
  };
}