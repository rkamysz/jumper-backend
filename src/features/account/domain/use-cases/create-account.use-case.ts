import { Result, UseCase, Where } from '@soapjs/soap';
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

    /**
     * BUG in SoapJS:
     * The Where clause will not work because checking the type of provided params does not work.
     * regardless of the filters used, find returns all records. The bug has already been reported.
     */
    const findResult = await this.accountRepository.find({ where: new Where().valueOf('address').isEq(address) });

    if (findResult.isFailure) {
      // problems with DB?
      return Result.withFailure(findResult.failure);
    }

    // way to bypass the error (temporary)
    if (findResult.content.findIndex((account) => account.address === address) > -1) {
      return Result.withFailure(new Error('Account already exists'));
    }

    const { content, failure } = await this.accountRepository.add([
      new Account(address, `user_${countResult.content || 0}`),
    ]);

    if (failure) {
      return Result.withFailure(failure);
    }

    return Result.withContent(content[0]);
  }
}
