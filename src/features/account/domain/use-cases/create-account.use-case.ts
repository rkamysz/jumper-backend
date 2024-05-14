import { Result, UseCase } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Account } from '../entities/account';
import { AccountRepository } from '../repositories/account.repository';

/**
 * @injectable
 * Class representing the use case for creating an account.
 * Implements the UseCase interface.
 *
 * @implements {UseCase<Account>}
 */
@injectable()
export class CreateAccountUseCase implements UseCase<Account> {
  static Token = 'CreateAccountUseCase';
  /**
   * Creates an instance of CreateAccountUseCase.
   *
   * @param {AccountRepository} accountRepository - The repository to interact with account data.
   */
  constructor(@inject(AccountRepository.Token) private accountRepository: AccountRepository) {}

  /**
   * Executes the use case to create an account.
   *
   * @param {string} address - The address of the new account.
   * @returns {Promise<Result<Account>>} The result of the account creation, containing either the account or a failure.
   */
  async execute(address: string): Promise<Result<Account>> {
    const countResult = await this.accountRepository.count();

    if (countResult.isFailure) {
      // problems with DB?
      return Result.withFailure(countResult.failure);
    }

    const { content, failure } = await this.accountRepository.add([
      new Account(address, `user_${countResult.content}`),
    ]);

    if (failure) {
      return Result.withFailure(failure);
    }

    return Result.withContent(content[0]);
  }
}
