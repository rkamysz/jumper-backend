import * as AlchemySdk from 'alchemy-sdk';
import { ObjectId } from 'mongodb';

export type TokenBalancesResponse = AlchemySdk.TokenBalancesResponse;

export type TokenBalance = {
  contractAddress: string;
  tokenBalance: number;
};

export type TokenMetadataDto = AlchemySdk.TokenMetadataResponse;

/**
 * Represents a Token metadata document stored in MongoDB.
 *
 * @typedef {Object} TokenMetadataMongoDocument
 * @property {ObjectId} _id - The unique identifier for the token metadata document.
 * @property {string} contract_address - The contract address of the token.
 * @property {string | null} name - The name of the token, can be null.
 * @property {string | null} symbol - The symbol of the token, can be null.
 * @property {number | null} decimals - The number of decimals for the token, can be null.
 * @property {string | null} logo - The URL of the token's logo, can be null.
 */
export type TokenMetadataMongoDocument = {
  _id: ObjectId;
  contract_address: string;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  logo: string | null;
};
