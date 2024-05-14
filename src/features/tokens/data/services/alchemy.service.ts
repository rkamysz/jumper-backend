import { Result } from '@soapjs/soap';
import { Alchemy, AlchemySettings } from 'alchemy-sdk';

import { TokenMetadata } from '../../domain/entities/token-metadata';
import { EthereumExplorerService } from '../../domain/services/ethereum-explorer.service';
import { TokenBalance } from '../dto/token-metadata.dto';

export type AlchemyServiceConfig = AlchemySettings & {
  batchSize?: number;
};

/**
 * Service class to interact with the Alchemy API for Ethereum token data.
 *
 * @implements {EthereumExplorerService}
 */
export class AlchemyService implements EthereumExplorerService {
  private client: Alchemy;

  /**
   * Creates an instance of AlchemyService.
   *
   * @param {AlchemyServiceConfig} config - The configuration for the Alchemy client.
   */
  constructor(private config: AlchemyServiceConfig) {
    this.client = new Alchemy(config);
  }

  /**
   * Fetches metadata for a list of token addresses.
   *
   * @private
   * @param {string[]} tokenAddresses - The token addresses to fetch metadata for.
   * @returns {Promise<TokenMetadata[]>} A promise that resolves to an array of TokenMetadata.
   */
  private async getTokensMetadata(tokenAddresses: string[]): Promise<TokenMetadata[]> {
    const metadataPromises = tokenAddresses.map(async (address) => {
      const metadata = await this.client.core.getTokenMetadata(address);
      return new TokenMetadata(address, metadata.name, metadata.symbol, metadata.logo, metadata.decimals);
    });
    return Promise.all(metadataPromises);
  }

  /**
   * Chunks a list of items into smaller lists of a specified size.
   *
   * @private
   * @param {string[]} items - The list of items to chunk.
   * @param {number} size - The size of each chunk.
   * @returns {string[][]} An array of chunked lists.
   */
  private chunkList(items: string[], size: number) {
    if (size < 1) {
      return [items];
    }
    return Array.from({ length: Math.ceil(items.length / size) }, (v, i) => items.slice(i * size, i * size + size));
  }

  /**
   * Fetches token balances for a given address.
   *
   * @param {string} address - The address to fetch token balances for.
   * @returns {Promise<Result<TokenBalance[]>>} A promise that resolves to a Result containing an array of TokenBalance.
   */
  async fetchTokenBalances(address: string): Promise<Result<TokenBalance[]>> {
    try {
      const balances = await this.client.core.getTokenBalances(address);

      // Remove tokens with NaN balance
      const nonNaNBalances = balances.tokenBalances.reduce((list: TokenBalance[], token) => {
        const { tokenBalance, contractAddress, error } = token;
        if (!error && typeof tokenBalance === 'string') {
          list.push({
            tokenBalance: +tokenBalance,
            contractAddress,
          });
        }
        return list;
      }, []);

      return Result.withContent(nonNaNBalances);
    } catch (error) {
      return Result.withFailure(error as Error);
    }
  }

  /**
   * Fetches metadata for a list of token contracts.
   *
   * @param {string} address - The address of the token holder.
   * @param {string[]} contracts - The list of token contract addresses.
   * @returns {Promise<Result<TokenMetadata[]>>} A promise that resolves to a Result containing an array of TokenMetadata.
   */
  async fetchTokensMetadata(address: string, contracts: string[]): Promise<Result<TokenMetadata[]>> {
    try {
      const chunks = this.chunkList(contracts, this.config.batchSize || -1);
      const list = [];

      for (const chunk of chunks) {
        const metadatas = await this.getTokensMetadata(chunk);
        list.push(...metadatas);
      }
      return Result.withContent(list);
    } catch (error) {
      return Result.withFailure(error as Error);
    }
  }
}
