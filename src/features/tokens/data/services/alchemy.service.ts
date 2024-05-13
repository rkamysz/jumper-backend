import { Result } from '@soapjs/soap';
import { Alchemy, AlchemySettings } from 'alchemy-sdk';

import { TokenMetadata } from '../../domain/entities/token-metadata';
import { EthereumExplorerService } from '../../domain/services/ethereum-explorer.service';
import { TokenBalance } from '../dto/token-metadata.dto';

export type AlchemyServiceConfig = AlchemySettings & {
  batchSize?: number;
};

export class AlchemyService implements EthereumExplorerService {
  private client: Alchemy;

  constructor(private config: AlchemyServiceConfig) {
    this.client = new Alchemy(config);
  }

  private async getTokensMetadata(tokenAddresses: string[]): Promise<TokenMetadata[]> {
    const metadataPromises = tokenAddresses.map(async (address) => {
      const metadata = await this.client.core.getTokenMetadata(address);
      return new TokenMetadata(address, metadata.name, metadata.symbol, metadata.logo, metadata.decimals);
    });
    return Promise.all(metadataPromises);
  }

  private chunkList(items: string[], size: number) {
    if (size < 1) {
      return [items];
    }
    return Array.from({ length: Math.ceil(items.length / size) }, (v, i) => items.slice(i * size, i * size + size));
  }

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
