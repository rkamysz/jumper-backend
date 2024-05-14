import { ObjectId } from 'mongodb';
import { describe, expect, it } from 'vitest';

import { TokenMetadata } from '@/features/tokens/domain/entities/token-metadata';

import { TokenMetadataMongoDocument } from '../../dto/token-metadata.dto';
import { TokenMetadataMongoMapper } from '../token-metadata.mongo-mapper';

describe('TokenMetadataMongoMapper', () => {
  const mapper = new TokenMetadataMongoMapper();

  describe('toEntity', () => {
    it('should convert TokenMetadataMongoDocument to TokenMetadata entity', () => {
      const model: TokenMetadataMongoDocument = {
        _id: new ObjectId(),
        contract_address: '0x123',
        name: 'Test Token',
        symbol: 'TT',
        decimals: 18,
        logo: 'http://example.com/logo.png',
      };

      const entity = mapper.toEntity(model);

      expect(entity).toBeInstanceOf(TokenMetadata);
      expect(entity.id).toBe(model._id.toString());
      expect(entity.contractAddress).toBe(model.contract_address);
      expect(entity.name).toBe(model.name);
      expect(entity.symbol).toBe(model.symbol);
      expect(entity.decimals).toBe(model.decimals);
      expect(entity.logo).toBe(model.logo);
    });
  });

  describe('fromEntity', () => {
    it('should convert TokenMetadata entity to TokenMetadataMongoDocument', () => {
      const entity = new TokenMetadata(
        '0x123',
        'Test Token',
        'http://example.com/logo.png',
        'TT',
        18,
        new ObjectId().toString()
      );

      const model = mapper.fromEntity(entity);

      expect(model).toBeDefined();
      expect(model._id).toBeInstanceOf(ObjectId);
      expect(model._id.toString()).toBe(entity.id);
      expect(model.contract_address).toBe(entity.contractAddress);
      expect(model.name).toBe(entity.name);
      expect(model.symbol).toBe(entity.symbol);
      expect(model.decimals).toBe(entity.decimals);
      expect(model.logo).toBe(entity.logo);
    });

    it('should handle null fields', () => {
      const entity = new TokenMetadata('0x123', null, null, null, null, new ObjectId().toString());

      const model = mapper.fromEntity(entity);

      expect(model).toBeDefined();
      expect(model.name).toBeNull();
      expect(model.symbol).toBeNull();
      expect(model.decimals).toBeNull();
      expect(model.logo).toBeNull();
    });
  });
});
