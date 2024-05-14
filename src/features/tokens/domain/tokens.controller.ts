import { Result } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Token } from './entities/token';
import { FetchBalancesAndMetadataUseCase } from './use-cases/fetch-balances-and-metadate.use-case';

@injectable()
export class TokensController {
  public static Token = 'TokensController';

  constructor(
    @inject(FetchBalancesAndMetadataUseCase.Token) private fetchBalancesAndMetadata: FetchBalancesAndMetadataUseCase
  ) {}

  public async listTokens(address: string): Promise<Result<Token[]>> {
    return this.fetchBalancesAndMetadata.execute(address);
  }
}
