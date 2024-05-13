import { ConfigVars, RepositoryImpl } from '@soapjs/soap';
import { MongoCollection, MongoConfig, MongoQueryFactory, MongoSource } from '@soapjs/soap-node-mongo';
import { Container } from 'inversify';

import { Logger } from './common/types';
import { Config } from './common/utils/envConfig';
import {
  AccountController,
  FetchBalancesAndMetadata,
  FetchTokensMetadata,
  TokenMetadataMongoMapper,
  TokenMetadataRepository,
  TokensController,
} from './features';
import { AlchemyService } from './features/tokens/data/services/alchemy.service';
import { EthereumExplorerService } from './features/tokens/domain/services/ethereum-explorer.service';

export const buildContainer = async (config: Config, logger: Logger) => {
  const ioc = new Container();
  const configVars = new ConfigVars();
  const mongoSource = await MongoSource.create(MongoConfig.create(configVars));

  /**
   * Services, Repositories, Utils
   */
  ioc
    .bind<EthereumExplorerService>(EthereumExplorerService.Token)
    .toConstantValue(new AlchemyService({ apiKey: config.ALCHEMY_API_KEY, batchSize: config.LIST_TOKENS_CHUNK_SIZE }));
  ioc.bind<Logger>('logger').toConstantValue(logger);

  ioc.bind<TokenMetadataRepository>(TokenMetadataRepository.Token).toConstantValue(
    new RepositoryImpl({
      collection: new MongoCollection(mongoSource, 'tokens.metadata'),
      mapper: new TokenMetadataMongoMapper(),
      queries: new MongoQueryFactory(),
    })
  );

  /**
   * Controllers
   */
  ioc.bind<AccountController>(AccountController.Token).to(AccountController);
  ioc.bind<TokensController>(TokensController.Token).to(TokensController);

  /**
   * Use cases
   */
  ioc.bind<FetchBalancesAndMetadata>(FetchBalancesAndMetadata.Token).to(FetchBalancesAndMetadata);
  ioc.bind<FetchTokensMetadata>(FetchTokensMetadata.Token).to(FetchTokensMetadata);

  return ioc;
};
