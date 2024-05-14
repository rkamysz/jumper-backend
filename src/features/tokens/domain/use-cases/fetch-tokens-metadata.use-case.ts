import { Result, UseCase, Where } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Logger } from '@/common/types';
import { Config } from '@/common/utils/envConfig';

import { TokenMetadata } from '../entities/token-metadata';
import { TokenMetadataRepository } from '../repositories/token-metadata.repository';
import { EthereumExplorerService } from '../services/ethereum-explorer.service';

/**
 * @injectable
 * Use case for fetching token metadata.
 * Implements the UseCase interface for TokenMetadata arrays.
 *
 * @implements {UseCase<TokenMetadata[]>}
 */
@injectable()
export class FetchTokensMetadataUseCase implements UseCase<TokenMetadata[]> {
  static Token = 'FetchTokensMetadata';

  /**
   * Creates an instance of FetchTokensMetadataUseCase.
   *
   * @param {EthereumExplorerService} explorerService - The service to fetch token metadata from the Ethereum blockchain.
   * @param {TokenMetadataRepository} metadataRepository - The repository to store and retrieve token metadata.
   * @param {Logger} logger - The logger for logging errors and information.
   * @param {Config} config - The configuration object for the environment.
   */
  constructor(
    @inject(EthereumExplorerService.Token) private explorerService: EthereumExplorerService,
    @inject(TokenMetadataRepository.Token) private metadataRepository: TokenMetadataRepository,
    @inject('logger') private logger: Logger,
    @inject('config') private config: Config
  ) {}

  /**
   * Executes the use case to fetch token metadata.
   *
   * @param {string} address - The address to fetch token metadata for.
   * @param {string[]} contractAddresses - The list of token contract addresses to fetch metadata for.
   * @returns {Promise<Result<TokenMetadata[]>>} The result of the token metadata fetch operation.
   */
  async execute(address: string, contractAddresses: string[]): Promise<Result<TokenMetadata[]>> {
    // Skip the cache to always have up-to-date data (when there is no cron jobs or indexer)
    if (this.config.USE_CACHE === false) {
      return this.explorerService.fetchTokensMetadata(address, contractAddresses);
    }
    // Try fetch metadata from the database
    const { content: storedMetadata, failure: metadataFromRepoFailure } = await this.metadataRepository.find({
      where: new Where().valueOf('contract_address').isIn(contractAddresses),
    });

    if (metadataFromRepoFailure) {
      return this.fetchMissingMetadata(address, contractAddresses);
    }
    // Verify that all metadata has been found
    const foundMetadataAddresses = new Set(storedMetadata.map((md) => md.contractAddress));
    const missingAddresses = contractAddresses.filter((address) => !foundMetadataAddresses.has(address));

    if (missingAddresses.length === 0) {
      // All metadata found in the repo
      return Result.withContent(storedMetadata);
    }

    // Retrieving missing metadata via EthereumExplorerService
    const missingMetadataResult = await this.fetchMissingMetadata(address, missingAddresses);

    if (missingMetadataResult.isFailure) {
      return Result.withFailure(missingMetadataResult.failure);
    }

    const allMetadata = storedMetadata.concat(missingMetadataResult.content);
    return Result.withContent(allMetadata);
  }

  /**
   * Fetches missing token metadata from the Ethereum explorer service and stores it in the repository.
   *
   * @private
   * @param {string} address - The address to fetch token metadata for.
   * @param {string[]} contracts - The list of token contract addresses to fetch metadata for.
   * @returns {Promise<Result<TokenMetadata[]>>} The result of the token metadata fetch and store operation.
   */
  private async fetchMissingMetadata(address: string, contracts: string[]): Promise<Result<TokenMetadata[]>> {
    const { content, failure } = await this.explorerService.fetchTokensMetadata(address, contracts);
    if (failure) {
      return Result.withFailure(failure);
    }

    const storeResult = await this.metadataRepository.add(content);

    if (storeResult.isFailure) {
      // here we should log this error to eg. new relic
      this.logger.error(storeResult.failure.error);
    }

    return Result.withContent(content);
  }
}
