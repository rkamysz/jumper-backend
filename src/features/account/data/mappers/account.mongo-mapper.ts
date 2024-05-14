import { Mapper } from '@soapjs/soap';
import { ObjectId } from 'mongodb';

import { Account } from '../../domain/entities/account';
import { AccountMongoDocument } from '../dto/account.dto';

/**
 * Mapper class to convert between Account domain entities and AccountMongoDocument database objects.
 *
 * @implements {Mapper<Account, AccountMongoDocument>}
 */
export class AccountMongoMapper implements Mapper<Account, AccountMongoDocument> {
  /**
   * Converts a database model to an Account domain entity.
   *
   * @param {AccountMongoDocument} model - The database model to convert.
   * @returns {Account} The corresponding Account domain entity.
   */
  toEntity(model: AccountMongoDocument): Account {
    const { _id, name, address } = model;
    return new Account(address, name, _id.toString());
  }

  /**
   * Converts an Account domain entity to a database model.
   *
   * @param {Account} entity - The domain entity to convert.
   * @returns {AccountMongoDocument} The corresponding database model.
   */
  fromEntity(entity: Account): AccountMongoDocument {
    const { id, address, name } = entity;
    return {
      _id: new ObjectId(id),
      address,
      name,
    };
  }
}
