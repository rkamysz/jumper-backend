import { Result, UseCase } from '@soapjs/soap';
import { inject, injectable } from 'inversify';

import { Account } from '../entities/account';
import { AccountRepository } from '../repositories/account.repository';

@injectable()
export class CreateAccountUseCase implements UseCase<Account> {
  static Token = 'CreateAccountUseCase';

  constructor(@inject(AccountRepository.Token) private accountRepository: AccountRepository) {}

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
