import { Result } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Token } from './entities/token';
import { FetchBalancesAndMetadataUseCase } from './use-cases/fetch-balances-and-metadate.use-case';

/**
 * @injectable
 * Controller class for handling token-related operations.
 */
@injectable()
export class TokensController {
  public static Token = 'TokensController';
  /**
   * Creates an instance of TokensController.
   *
   * @param {FetchBalancesAndMetadataUseCase} fetchBalancesAndMetadata - The use case to fetch token balances and metadata.
   */
  constructor(
    @inject(FetchBalancesAndMetadataUseCase.Token) private fetchBalancesAndMetadata: FetchBalancesAndMetadataUseCase
  ) {}

  /**
   * Lists tokens for a given address by fetching their balances and metadata.
   *
   * @param {string} address - The address to list tokens for.
   * @returns {Promise<Result<Token[]>>} The result of the tokens listing operation.
   */
  public async listTokens(address: string): Promise<Result<Token[]>> {
    return this.fetchBalancesAndMetadata.execute(address);
  }
}
