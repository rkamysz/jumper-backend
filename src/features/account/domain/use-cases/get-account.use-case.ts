import { Result, UseCase, Where } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { AccountNotFoundError } from '../account.errors';
import { Account } from '../entities/account';
import { AccountRepository } from '../repositories/account.repository';

/**
 * @injectable
 * Class representing the use case for retrieving account details.
 * Implements the UseCase interface.
 *
 * @implements {UseCase<Account>}
 */
@injectable()
export class GetAccountUseCase implements UseCase<Account> {
  static Token = 'GetAccountUseCase';
  /**
   * Creates an instance of GetAccountUseCase.
   *
   * @param {AccountRepository} accountRepository - The repository to interact with account data.
   */
  constructor(@inject(AccountRepository.Token) private accountRepository: AccountRepository) {}

  /**
   * Executes the use case to retrieve account data.
   *
   * @param {string} address - The address of the new account.
   * @returns {Promise<Result<Account>>} The result of the account creation, containing either the account or a failure.
   */
  async execute(address: string): Promise<Result<Account>> {
    const findResult = await this.accountRepository.find({ where: new Where().valueOf('address').isEq(address) });

    if (findResult.isFailure) {
      // problems with DB?
      return Result.withFailure(findResult.failure);
    }

    if (findResult.content.length === 0) {
      return Result.withFailure(new AccountNotFoundError());
    }

    return Result.withContent(findResult.content[0]);
  }
}
