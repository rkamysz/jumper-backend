import { Result, UseCase, Where } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Logger } from '@/common/types';

import { TokenMetadata } from '../entities/token-metadata';
import { TokenMetadataRepository } from '../repositories/token-metadata.repository';
import { EthereumExplorerService } from '../services/ethereum-explorer.service';

@injectable()
export class FetchTokensMetadata implements UseCase<TokenMetadata[]> {
  static Token = 'FetchTokensMetadata';

  constructor(
    @inject(EthereumExplorerService.Token) private explorerService: EthereumExplorerService,
    @inject(TokenMetadataRepository.Token) private metadataRepository: TokenMetadataRepository,
    @inject('logger') private logger: Logger
  ) {}

  async execute(address: string, contractAddresses: string[]): Promise<Result<TokenMetadata[]>> {
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
