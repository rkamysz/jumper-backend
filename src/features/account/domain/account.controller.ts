import { Result } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Account } from './entities/account';
import { CreateAccountUseCase } from './use-cases/create-account.use-case';

/**
 * @injectable
 * Controller class to handle account-related operations.
 */
@injectable()
export class AccountController {
  public static Token = 'AccountController';

  /**
   * Creates an instance of AccountController.
   *
   * @param {CreateAccountUseCase} createAccountUseCase - The use case to handle account creation.
   */
  constructor(@inject(CreateAccountUseCase.Token) private createAccountUseCase: CreateAccountUseCase) {}

  /**
   * Handles the creation of a new account.
   *
   * @param {string} address - The address of the new account.
   * @returns {Promise<Result<Account>>} The result of the account creation, containing either the account or a failure.
   */
  public async createAccount(address: string): Promise<Result<Account>> {
    return this.createAccountUseCase.execute(address);
  }
}
