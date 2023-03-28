/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.37.0
  Forc version: 0.35.3
  Fuel-Core version: 0.17.3
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Option, Enum } from "./common";

export type AccessErrorInput = Enum<{ CannotReinitialized: [], NotOwner: [] }>;
export type AccessErrorOutput = AccessErrorInput;
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type OwnershipRenouncedInput = { previous_owner: IdentityInput };
export type OwnershipRenouncedOutput = { previous_owner: IdentityOutput };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type OwnershipTransferredInput = { new_owner: IdentityInput, previous_owner: IdentityInput };
export type OwnershipTransferredOutput = { new_owner: IdentityOutput, previous_owner: IdentityOutput };

interface ExecutionManagerAbiInterface extends Interface {
  functions: {
    add_strategy: FunctionFragment;
    get_count_whitelisted_strategies: FunctionFragment;
    get_whitelisted_strategy: FunctionFragment;
    initialize: FunctionFragment;
    is_strategy_whitelisted: FunctionFragment;
    owner: FunctionFragment;
    remove_strategy: FunctionFragment;
    renounce_ownership: FunctionFragment;
    transfer_ownership: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'add_strategy', values: [ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_count_whitelisted_strategies', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'get_whitelisted_strategy', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'initialize', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'is_strategy_whitelisted', values: [ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'owner', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'remove_strategy', values: [ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'renounce_ownership', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'transfer_ownership', values: [IdentityInput]): Uint8Array;

  decodeFunctionData(functionFragment: 'add_strategy', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_count_whitelisted_strategies', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_whitelisted_strategy', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'initialize', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'is_strategy_whitelisted', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'owner', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'remove_strategy', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'renounce_ownership', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'transfer_ownership', data: BytesLike): DecodedValue;
}

export class ExecutionManagerAbi extends Contract {
  interface: ExecutionManagerAbiInterface;
  functions: {
    add_strategy: InvokeFunction<[strategy: ContractIdInput], void>;
    get_count_whitelisted_strategies: InvokeFunction<[], BN>;
    get_whitelisted_strategy: InvokeFunction<[index: BigNumberish], Option<ContractIdOutput>>;
    initialize: InvokeFunction<[], void>;
    is_strategy_whitelisted: InvokeFunction<[strategy: ContractIdInput], boolean>;
    owner: InvokeFunction<[], Option<IdentityOutput>>;
    remove_strategy: InvokeFunction<[strategy: ContractIdInput], void>;
    renounce_ownership: InvokeFunction<[], void>;
    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
  };
}
