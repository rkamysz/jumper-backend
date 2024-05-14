import { Repository } from '@soapjs/soap';
import { injectable } from 'inversify';

import { TokenMetadata } from '../entities/token-metadata';

/**
 * @injectable
 * Abstract class representing the repository for TokenMetadata entities.
 * Extends the base Repository class.
 *
 * @abstract
 * @extends {Repository<TokenMetadata>}
 */
@injectable()
export abstract class TokenMetadataRepository extends Repository<TokenMetadata> {
  static Token = 'TokenMetadataRepository';
}
