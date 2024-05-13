import { Result } from '@soapjs/soap';
import { injectable } from 'inversify';

@injectable()
export class TokensController {
  public static Token = 'TokensController';

  public async listAccountTokens(): Promise<Result<any>> {
    return Result.withContent({});
  }
}
