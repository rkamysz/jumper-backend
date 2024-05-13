import { Result, UseCase } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Token } from '../entities/token';
import { EthereumExplorerService } from '../services/ethereum-explorer.service';
import { FetchTokensMetadata } from './fetch-tokens-metadata.use-case';

@injectable()
export class FetchBalancesAndMetadata implements UseCase<Token[]> {
  static Token = 'FetchBalancesAndMetadata';

  constructor(
    @inject(EthereumExplorerService.Token) private explorerService: EthereumExplorerService,
    @inject(FetchTokensMetadata.Token) private fetchTokensMetadata: FetchTokensMetadata
  ) {}

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
