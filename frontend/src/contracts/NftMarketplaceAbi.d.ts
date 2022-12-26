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

export type TimedAuctionInput = {
  contract_Id: ContractIdInput;
  token_id: BigNumberish;
  seller: AddressInput;
  starting_price: BigNumberish;
  expiration_date: BigNumberish;
};

export type TimedAuctionOutput = {
  contract_Id: ContractIdOutput;
  token_id: BN;
  seller: AddressOutput;
  starting_price: BN;
  expiration_date: BN;
};

export type HighestBidInput = { bider: AddressInput; bid_amount: BigNumberish };

export type HighestBidOutput = { bider: AddressOutput; bid_amount: BN };

export type TokenMetaDataInput = {
  name: string;
  symbol: string;
  token_uri: [string, BigNumberish];
};

export type TokenMetaDataOutput = {
  name: string;
  symbol: string;
  token_uri: [string, BN];
};

export type ListedNFTInput = {
  contract_Id: ContractIdInput;
  token_id: BigNumberish;
  meta_data: TokenMetaDataInput;
  owner: IdentityInput;
  asset_id: ContractIdInput;
  price: BigNumberish;
  expiration_date: BigNumberish;
};

export type ListedNFTOutput = {
  contract_Id: ContractIdOutput;
  token_id: BN;
  meta_data: TokenMetaDataOutput;
  owner: IdentityOutput;
  asset_id: ContractIdOutput;
  price: BN;
  expiration_date: BN;
};

export type OfferInput = {
  offerer: AddressInput;
  offer_amount: BigNumberish;
  collection: ContractIdInput;
  token_id: BigNumberish;
  expiration_date: BigNumberish;
};

export type OfferOutput = {
  offerer: AddressOutput;
  offer_amount: BN;
  collection: ContractIdOutput;
  token_id: BN;
  expiration_date: BN;
};

export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;

export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;

interface NftMarketplaceAbiInterface extends Interface {
  functions: {
    accept_highest_bid: FunctionFragment;
    accept_offer: FunctionFragment;
    add_supported_asset: FunctionFragment;
    admin: FunctionFragment;
    cancel_auction: FunctionFragment;
    cancel_listing: FunctionFragment;
    cancel_offer: FunctionFragment;
    constructor: FunctionFragment;
    fee_receiver: FunctionFragment;
    get_auction: FunctionFragment;
    get_auction_expiration_date: FunctionFragment;
    get_highest_bid: FunctionFragment;
    get_listed_nft: FunctionFragment;
    get_listing_expiration_date: FunctionFragment;
    get_offer: FunctionFragment;
    get_offer_expiration_date: FunctionFragment;
    get_total_offers: FunctionFragment;
    get_weth: FunctionFragment;
    initialized: FunctionFragment;
    is_listed: FunctionFragment;
    is_valid_auction: FunctionFragment;
    is_valid_offer: FunctionFragment;
    list_nft: FunctionFragment;
    make_offer: FunctionFragment;
    pause: FunctionFragment;
    place_bid: FunctionFragment;
    protocol_fee: FunctionFragment;
    purchase_nft: FunctionFragment;
    remove_supported_asset: FunctionFragment;
    set_admin: FunctionFragment;
    set_fee_receiver: FunctionFragment;
    set_max_expiration: FunctionFragment;
    set_min_expiration: FunctionFragment;
    set_pause: FunctionFragment;
    set_protocol_fee: FunctionFragment;
    start_auction: FunctionFragment;
    supported_asset: FunctionFragment;
    update_listing: FunctionFragment;
    update_offer: FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accept_highest_bid",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "accept_offer",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "add_supported_asset",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(functionFragment: "admin", values?: undefined): Uint8Array;
  encodeFunctionData(
    functionFragment: "cancel_auction",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "cancel_listing",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "cancel_offer",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "constructor",
    values: [AddressInput, IdentityInput, BigNumberish, ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "fee_receiver",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_auction",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_auction_expiration_date",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_highest_bid",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_listed_nft",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_listing_expiration_date",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_offer",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_offer_expiration_date",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_total_offers",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_weth",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "initialized",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "is_listed",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "is_valid_auction",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "is_valid_offer",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "list_nft",
    values: [
      ContractIdInput,
      BigNumberish,
      ContractIdInput,
      BigNumberish,
      BigNumberish
    ]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "make_offer",
    values: [ContractIdInput, BigNumberish, BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(functionFragment: "pause", values?: undefined): Uint8Array;
  encodeFunctionData(
    functionFragment: "place_bid",
    values: [ContractIdInput, BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "protocol_fee",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "purchase_nft",
    values: [ContractIdInput, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "remove_supported_asset",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_admin",
    values: [AddressInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_fee_receiver",
    values: [IdentityInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_max_expiration",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_min_expiration",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_pause",
    values?: undefined
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "set_protocol_fee",
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "start_auction",
    values: [ContractIdInput, BigNumberish, BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "supported_asset",
    values: [ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "update_listing",
    values: [ContractIdInput, BigNumberish, BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "update_offer",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): Uint8Array;

  decodeFunctionData(
    functionFragment: "accept_highest_bid",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "accept_offer",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "add_supported_asset",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: "admin", data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: "cancel_auction",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "cancel_listing",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "cancel_offer",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "constructor",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "fee_receiver",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_auction",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_auction_expiration_date",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_highest_bid",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_listed_nft",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_listing_expiration_date",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_offer",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_offer_expiration_date",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_total_offers",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_weth",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "initialized",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "is_listed",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "is_valid_auction",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "is_valid_offer",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "list_nft",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "make_offer",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: "pause", data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: "place_bid",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "protocol_fee",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "purchase_nft",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "remove_supported_asset",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_admin",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_fee_receiver",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_max_expiration",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_min_expiration",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_pause",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "set_protocol_fee",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "start_auction",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "supported_asset",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "update_listing",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "update_offer",
    data: BytesLike
  ): DecodedValue;
}

export class NftMarketplaceAbi extends Contract {
  interface: NftMarketplaceAbiInterface;
  functions: {
    accept_highest_bid: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      void
    >;

    accept_offer: InvokeFunction<[offer_index: BigNumberish], void>;

    add_supported_asset: InvokeFunction<[asset_id: ContractIdInput], void>;

    admin: InvokeFunction<[], AddressOutput>;

    cancel_auction: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      void
    >;

    cancel_listing: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      void
    >;

    cancel_offer: InvokeFunction<[offer_index: BigNumberish], void>;

    constructor: InvokeFunction<
      [
        admin: AddressInput,
        receiver: IdentityInput,
        fee: BigNumberish,
        weth_contract: ContractIdInput
      ],
      void
    >;

    fee_receiver: InvokeFunction<[], IdentityOutput>;

    get_auction: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      TimedAuctionOutput
    >;

    get_auction_expiration_date: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      BN
    >;

    get_highest_bid: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      HighestBidOutput
    >;

    get_listed_nft: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      ListedNFTOutput
    >;

    get_listing_expiration_date: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      BN
    >;

    get_offer: InvokeFunction<[offer_index: BigNumberish], OfferOutput>;

    get_offer_expiration_date: InvokeFunction<[offer_index: BigNumberish], BN>;

    get_total_offers: InvokeFunction<[], BN>;

    get_weth: InvokeFunction<[], ContractIdOutput>;

    initialized: InvokeFunction<[], boolean>;

    is_listed: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      boolean
    >;

    is_valid_auction: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      boolean
    >;

    is_valid_offer: InvokeFunction<[offer_index: BigNumberish], boolean>;

    list_nft: InvokeFunction<
      [
        contract_Id: ContractIdInput,
        token_id: BigNumberish,
        asset_id: ContractIdInput,
        price: BigNumberish,
        expiration: BigNumberish
      ],
      void
    >;

    make_offer: InvokeFunction<
      [
        collection: ContractIdInput,
        token_id: BigNumberish,
        offer_amount: BigNumberish,
        expiration: BigNumberish
      ],
      void
    >;

    pause: InvokeFunction<[], boolean>;

    place_bid: InvokeFunction<
      [
        contract_Id: ContractIdInput,
        token_id: BigNumberish,
        bid_amount: BigNumberish
      ],
      void
    >;

    protocol_fee: InvokeFunction<[], BN>;

    purchase_nft: InvokeFunction<
      [contract_Id: ContractIdInput, token_id: BigNumberish],
      void
    >;

    remove_supported_asset: InvokeFunction<[asset_id: ContractIdInput], void>;

    set_admin: InvokeFunction<[admin: AddressInput], void>;

    set_fee_receiver: InvokeFunction<[receiver: IdentityInput], void>;

    set_max_expiration: InvokeFunction<[max_expiration: BigNumberish], void>;

    set_min_expiration: InvokeFunction<[min_expiration: BigNumberish], void>;

    set_pause: InvokeFunction<[], void>;

    set_protocol_fee: InvokeFunction<[new_fee: BigNumberish], void>;

    start_auction: InvokeFunction<
      [
        contract_Id: ContractIdInput,
        token_id: BigNumberish,
        starting_price: BigNumberish,
        expiration: BigNumberish
      ],
      void
    >;

    supported_asset: InvokeFunction<[asset_id: ContractIdInput], boolean>;

    update_listing: InvokeFunction<
      [
        contract_Id: ContractIdInput,
        token_id: BigNumberish,
        new_price: BigNumberish,
        new_expiration: BigNumberish
      ],
      void
    >;

    update_offer: InvokeFunction<
      [
        offer_index: BigNumberish,
        new_offer_amount: BigNumberish,
        new_expiration: BigNumberish
      ],
      void
    >;
  };
}
