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

export type ExtraParamsInput = {
  extra_address_param: AddressInput;
  extra_contract_param: ContractIdInput;
  extra_u64_param: BigNumberish;
};

export type ExtraParamsOutput = {
  extra_address_param: AddressOutput;
  extra_contract_param: ContractIdOutput;
  extra_u64_param: BN;
};

export type TakerOrderInput = {
  side: SideInput;
  taker: AddressInput;
  maker: AddressInput;
  nonce: BigNumberish;
  price: BigNumberish;
  token_id: BigNumberish;
  collection: ContractIdInput;
  strategy: ContractIdInput;
  extra_params: ExtraParamsInput;
};

export type TakerOrderOutput = {
  side: SideOutput;
  taker: AddressOutput;
  maker: AddressOutput;
  nonce: BN;
  price: BN;
  token_id: BN;
  collection: ContractIdOutput;
  strategy: ContractIdOutput;
  extra_params: ExtraParamsOutput;
};

export type MakerOrderInputInput = {
  side: SideInput;
  maker: AddressInput;
  collection: ContractIdInput;
  token_id: BigNumberish;
  price: BigNumberish;
  amount: BigNumberish;
  nonce: BigNumberish;
  strategy: ContractIdInput;
  payment_asset: ContractIdInput;
  expiration_range: BigNumberish;
  extra_params: ExtraParamsInput;
};

export type MakerOrderInputOutput = {
  side: SideOutput;
  maker: AddressOutput;
  collection: ContractIdOutput;
  token_id: BN;
  price: BN;
  amount: BN;
  nonce: BN;
  strategy: ContractIdOutput;
  payment_asset: ContractIdOutput;
  expiration_range: BN;
  extra_params: ExtraParamsOutput;
};

export type SideInput = Enum<{ Buy: []; Sell: [] }>;

export type SideOutput = Enum<{ Buy: []; Sell: [] }>;

export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;

export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;

export type OptionalIdentityInput = Option<IdentityInput>;

export type OptionalIdentityOutput = Option<IdentityOutput>;

interface ThunderExchangeAbiInterface extends Interface {
  functions: {
    cancel_all_orders: FunctionFragment;
    cancel_all_orders_by_side: FunctionFragment;
    cancel_order: FunctionFragment;
    execute_order: FunctionFragment;
    get_asset_manager: FunctionFragment;
    get_execution_manager: FunctionFragment;
    get_pool: FunctionFragment;
    get_protocol_fee_recipient: FunctionFragment;
    get_royalty_manager: FunctionFragment;
    get_transfer_selector: FunctionFragment;
    initialize: FunctionFragment;
    owner: FunctionFragment;
    place_order: FunctionFragment;
    renounce_ownership: FunctionFragment;
    set_asset_manager: FunctionFragment;
    set_execution_manager: FunctionFragment;
    set_pool: FunctionFragment;
    set_protocol_fee_recipient: FunctionFragment;
    set_royalty_manager: FunctionFragment;
    set_transfer_selector: FunctionFragment;
    transfer_ownership: FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "cancel_all_orders",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "cancel_all_orders_by_side",
    values: [ContractIdInput, SideInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "cancel_order",
    values: [ContractIdInput, BigNumberish, SideInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "execute_order",
    values: [TakerOrderInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_asset_manager",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_execution_manager",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_pool",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_protocol_fee_recipient",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_royalty_manager",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_transfer_selector",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(functionFragment: "owner", values?: undefined): Uint8Array;
  encodeFunctionData(
    functionFragment: "place_order",
    values: [MakerOrderInputInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "renounce_ownership",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_asset_manager",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_execution_manager",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_pool",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_protocol_fee_recipient",
    values: [IdentityInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_royalty_manager",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_transfer_selector",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "transfer_ownership",
    values: [IdentityInput]
  ): Uint8Array;

  decodeFunctionData(
    functionFragment: "cancel_all_orders",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "cancel_all_orders_by_side",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "cancel_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "execute_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_asset_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_execution_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_pool",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_protocol_fee_recipient",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_royalty_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_transfer_selector",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "initialize",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: "owner", data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: "place_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "renounce_ownership",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_asset_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_execution_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_pool",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_protocol_fee_recipient",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_royalty_manager",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_transfer_selector",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "transfer_ownership",
    data: BytesLike
  ): DecodedValue;
}

export class ThunderExchangeAbi extends Contract {
  interface: ThunderExchangeAbiInterface;
  functions: {
    cancel_all_orders: InvokeFunction<[strategy: ContractIdInput], void>;

    cancel_all_orders_by_side: InvokeFunction<
      [strategy: ContractIdInput, side: SideInput],
      void
    >;

    cancel_order: InvokeFunction<
      [strategy: ContractIdInput, nonce: BigNumberish, side: SideInput],
      void
    >;

    execute_order: InvokeFunction<[order: TakerOrderInput], void>;

    get_asset_manager: InvokeFunction<[], ContractIdOutput>;

    get_execution_manager: InvokeFunction<[], ContractIdOutput>;

    get_pool: InvokeFunction<[], ContractIdOutput>;

    get_protocol_fee_recipient: InvokeFunction<[], IdentityOutput>;

    get_royalty_manager: InvokeFunction<[], ContractIdOutput>;

    get_transfer_selector: InvokeFunction<[], ContractIdOutput>;

    initialize: InvokeFunction<[], void>;

    owner: InvokeFunction<[], OptionalIdentityOutput>;

    place_order: InvokeFunction<[order_input: MakerOrderInputInput], void>;

    renounce_ownership: InvokeFunction<[], void>;

    set_asset_manager: InvokeFunction<[asset_manager: ContractIdInput], void>;

    set_execution_manager: InvokeFunction<
      [execution_manager: ContractIdInput],
      void
    >;

    set_pool: InvokeFunction<[pool: ContractIdInput], void>;

    set_protocol_fee_recipient: InvokeFunction<
      [protocol_fee_recipient: IdentityInput],
      void
    >;

    set_royalty_manager: InvokeFunction<
      [royalty_manager: ContractIdInput],
      void
    >;

    set_transfer_selector: InvokeFunction<
      [transfer_selector: ContractIdInput],
      void
    >;

    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
  };
}
