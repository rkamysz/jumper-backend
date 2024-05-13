import { Result } from '@soapjs/soap';
import { injectable } from 'inversify';

import { Account } from './account';

@injectable()
export class AccountController {
  public static Token = 'AccountController';
  public async createAccount(): Promise<Result<Account>> {
    return Result.withContent({});
  }
}
