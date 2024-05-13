import { Mapper } from '@soapjs/soap';
import { ObjectId } from 'mongodb';

import { TokenMetadata } from '../../domain/entities/token-metadata';
import { TokenMetadataMongoDocument } from '../dto/token-metadata.dto';

export class TokenMetadataMongoMapper implements Mapper<TokenMetadata, TokenMetadataMongoDocument> {
  toEntity(model: TokenMetadataMongoDocument): TokenMetadata {
    const { _id, name, logo, symbol, decimals, contract_address } = model;
    return new TokenMetadata(contract_address, name, logo, symbol, decimals, _id.toString());
  }
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
