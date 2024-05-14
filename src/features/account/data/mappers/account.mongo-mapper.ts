import { Mapper } from '@soapjs/soap';
import { ObjectId } from 'mongodb';

import { Account } from '../../domain/entities/account';
import { AccountMongoDocument } from '../dto/account.dto';

export class AccountMongoMapper implements Mapper<Account, AccountMongoDocument> {
  toEntity(model: AccountMongoDocument): Account {
    const { _id, name, address } = model;
    return new Account(address, name, _id.toString());
  }
  fromEntity(entity: Account): AccountMongoDocument {
    const { id, address, name } = entity;
    return {
      _id: new ObjectId(id),
      address,
      name,
    };
  }
}
