import { Result } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Account } from './entities/account';
import { CreateAccountUseCase } from './use-cases/create-account.use-case';

@injectable()
export class AccountController {
  public static Token = 'AccountController';

  constructor(@inject(CreateAccountUseCase.Token) private createAccountUseCase: CreateAccountUseCase) {}

  public async createAccount(address: string): Promise<Result<Account>> {
    return this.createAccountUseCase.execute(address);
  }
}
