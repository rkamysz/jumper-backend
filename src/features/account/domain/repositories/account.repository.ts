import { Repository } from '@soapjs/soap';
import { injectable } from 'inversify';

import { Account } from '../entities/account';

/**
 * @injectable
 * Abstract class representing the repository for Account entities.
 * Extends the base Repository class.
 *
 * @abstract
 * @extends {Repository<Account>}
 */
@injectable()
export abstract class AccountRepository extends Repository<Account> {
  static Token = 'AccountRepository';
}
