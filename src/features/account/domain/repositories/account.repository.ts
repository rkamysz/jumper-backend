import { Repository } from '@soapjs/soap';
import { injectable } from 'inversify';

import { Account } from '../entities/account';

@injectable()
export abstract class AccountRepository extends Repository<Account> {
  static Token = 'AccountRepository';
}
