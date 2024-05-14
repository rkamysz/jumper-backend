import { Mapper } from '@soapjs/soap';
import { ObjectId } from 'mongodb';

import { TokenMetadata } from '../../domain/entities/token-metadata';
import { TokenMetadataMongoDocument } from '../dto/token-metadata.dto';

/**
 * Mapper class to convert between TokenMetadata domain entities and TokenMetadataMongoDocument database objects.
 *
 * @implements {Mapper<TokenMetadata, TokenMetadataMongoDocument>}
 */
export class TokenMetadataMongoMapper implements Mapper<TokenMetadata, TokenMetadataMongoDocument> {
  /**
   * Converts a database model to a TokenMetadata domain entity.
   *
   * @param {TokenMetadataMongoDocument} model - The database model to convert.
   * @returns {TokenMetadata} The corresponding TokenMetadata domain entity.
   */
  toEntity(model: TokenMetadataMongoDocument): TokenMetadata {
    const { _id, name, logo, symbol, decimals, contract_address } = model;
    return new TokenMetadata(contract_address, name, symbol, logo, decimals, _id.toString());
  }

  /**
   * Converts a TokenMetadata domain entity to a database model.
   *
   * @param {TokenMetadata} entity - The domain entity to convert.
   * @returns {TokenMetadataMongoDocument} The corresponding database model.
   */
  fromEntity(entity: TokenMetadata): TokenMetadataMongoDocument {
    const { id, contractAddress: contract_address, name, logo, decimals, symbol } = entity;
    return {
      _id: new ObjectId(id),
      contract_address,
      name,
      logo,
      decimals,
      symbol,
    };
  }
}
