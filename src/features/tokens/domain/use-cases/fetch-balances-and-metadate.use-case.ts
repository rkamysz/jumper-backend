import { Result, UseCase } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Token } from '../entities/token';
import { EthereumExplorerService } from '../services/ethereum-explorer.service';
import { FetchTokensMetadataUseCase } from './fetch-tokens-metadata.use-case';

/**
 * @injectable
 * Use case for fetching token balances and metadata.
 * Implements the UseCase interface for Token arrays.
 *
 * @implements {UseCase<Token[]>}
 */
@injectable()
export class FetchBalancesAndMetadataUseCase implements UseCase<Token[]> {
  static Token = 'FetchBalancesAndMetadata';

  /**
   * Creates an instance of FetchBalancesAndMetadataUseCase.
   *
   * @param {EthereumExplorerService} explorerService - The service to fetch token balances from the Ethereum blockchain.
   * @param {FetchTokensMetadataUseCase} fetchTokensMetadata - The use case to fetch token metadata.
   */
  constructor(
    @inject(EthereumExplorerService.Token) private explorerService: EthereumExplorerService,
    @inject(FetchTokensMetadataUseCase.Token) private fetchTokensMetadata: FetchTokensMetadataUseCase
  ) {}

  /**
   * Executes the use case to fetch token balances and metadata.
   *
   * @param {string} address - The address to fetch token balances and metadata for.
   * @returns {Promise<Result<Token[]>>} The result of the token balances and metadata fetch operation.
   */
  async execute(address: string): Promise<Result<Token[]>> {
    // Fetch token balances
    const { content: balances, failure: fetchBalancesFailure } = await this.explorerService.fetchTokenBalances(address);

    if (fetchBalancesFailure) {
      return Result.withFailure(fetchBalancesFailure);
    }

    // Retrieving contract addresses from balances
    const contractAddresses = balances.map((b) => b.contractAddress);

    // Using a use case to retrieve metadata
    const { content: metadatas, failure: fetchMetadataFailure } = await this.fetchTokensMetadata.execute(
      address,
      contractAddresses
    );

    if (fetchMetadataFailure) {
      return Result.withFailure(fetchMetadataFailure);
    }

    // Mapping metadata to token balances
    const tokensWithMetadata = balances.map((balance) => {
      const metadata = metadatas.find((m) => m.contractAddress === balance.contractAddress);
      return new Token(
        balance.contractAddress,
        metadata?.name || null,
        metadata?.symbol || null,
        metadata?.logo || null,
        metadata?.decimals || NaN,
        balance.tokenBalance
      );
    });

    return Result.withContent(tokensWithMetadata);
  }
}
