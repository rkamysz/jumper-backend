import { Result } from '@soapjs/soap';
import { injectable } from 'inversify';

import { TokenBalance } from '../../data/dto/token-metadata.dto';
import { TokenMetadata } from '../entities/token-metadata';

/**
 * @injectable
 * Abstract class representing a service for exploring Ethereum tokens.
 *
 * This class defines the contract for services that fetch token balances and metadata
 * from Ethereum blockchain explorers like Alchemy.
 *
 * @abstract
 */
@injectable()
export abstract class EthereumExplorerService {
  public static Token = 'EthereumExplorerService';
  /**
   * Fetches token balances for a given address.
   *
   * @abstract
   * @param {string} address - The address to fetch token balances for.
   * @returns {Promise<Result<TokenBalance[]>>} A promise that resolves to a Result containing an array of TokenBalance.
   */
  abstract fetchTokenBalances(address: string): Promise<Result<TokenBalance[]>>;

  /**
   * Fetches metadata for a list of token contracts.
   *
   * @abstract
   * @param {string} address - The address of the token holder.
   * @param {string[]} contracts - The list of token contract addresses.
   * @returns {Promise<Result<TokenMetadata[]>>} A promise that resolves to a Result containing an array of TokenMetadata.
   */
  abstract fetchTokensMetadata(address: string, contracts: string[]): Promise<Result<TokenMetadata[]>>;
}
