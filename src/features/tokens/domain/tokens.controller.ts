import { Result } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Token } from './entities/token';
import { FetchBalancesAndMetadata } from './use-cases/fetch-balances-and-metadate.use-case';

@injectable()
export class TokensController {
  public static Token = 'TokensController';

  constructor(@inject(FetchBalancesAndMetadata.Token) private fetchBalancesAndMetadata: FetchBalancesAndMetadata) {}

  public async listTokens(address: string): Promise<Result<Token[]>> {
    return this.fetchBalancesAndMetadata.execute(address);
  }
}
