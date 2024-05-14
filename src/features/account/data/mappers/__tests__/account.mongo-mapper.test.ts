import { ObjectId } from 'mongodb';
import { describe, expect, it } from 'vitest';

import { Account } from '../../../domain/entities/account';
import { AccountMongoDocument } from '../../dto/account.dto';
import { AccountMongoMapper } from '../account.mongo-mapper';

describe('AccountMongoMapper', () => {
  const mapper = new AccountMongoMapper();

  describe('toEntity', () => {
    it('should convert AccountMongoDocument to Account entity', () => {
      const model: AccountMongoDocument = {
        _id: new ObjectId(),
        address: '0x123',
        name: 'Test Account',
      };

      const entity = mapper.toEntity(model);

      expect(entity).toBeInstanceOf(Account);
      expect(entity.id).toBe(model._id.toString());
      expect(entity.address).toBe(model.address);
      expect(entity.name).toBe(model.name);
    });
  });

  describe('fromEntity', () => {
    it('should convert Account entity to AccountMongoDocument', () => {
      const entity = new Account('0x123', 'Test Account', new ObjectId().toString());

      const model = mapper.fromEntity(entity);

      expect(model).toBeDefined();
      expect(model._id).toBeInstanceOf(ObjectId);
      expect(model._id.toString()).toBe(entity.id);
      expect(model.address).toBe(entity.address);
      expect(model.name).toBe(entity.name);
    });

    it('should handle null name', () => {
      const entity = new Account('0x123', null, new ObjectId().toString());

      const model = mapper.fromEntity(entity);

      expect(model).toBeDefined();
      expect(model.name).toBeNull();
    });
  });
});
