import * as AlchemySdk from 'alchemy-sdk';
import { ObjectId } from 'mongodb';

export type TokenBalancesResponse = AlchemySdk.TokenBalancesResponse;

export type TokenBalance = {
  contractAddress: string;
  tokenBalance: number;
};

export type TokenMetadataDto = AlchemySdk.TokenMetadataResponse;

export type TokenMetadataMongoDocument = {
  _id: ObjectId;
  contract_address: string;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  logo: string | null;
};
