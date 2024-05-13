import { Repository } from '@soapjs/soap';
import { injectable } from 'inversify';

import { TokenMetadata } from '../entities/token-metadata';

@injectable()
export abstract class TokenMetadataRepository extends Repository<TokenMetadata> {
  static Token = 'TokenMetadataRepository';
}
