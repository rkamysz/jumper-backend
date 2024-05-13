import { Container } from 'inversify';

import { Config } from './common/utils/envConfig';
import { AccountController, EtherscanIO, TokensController } from './features';
import { EthereumExplorerService } from './features/tokens/domain/ethereum-explorer.service';

export const buildContainer = async (config: Config) => {
  const ioc = new Container();

  ioc.bind<AccountController>(AccountController.Token).to(AccountController);
  ioc.bind<TokensController>(TokensController.Token).to(TokensController);

  ioc
    .bind<EthereumExplorerService>(EthereumExplorerService.Token)
    .toConstantValue(
      new EtherscanIO({ apikey: config.ETHERSCAN_IO_API_KEY, listTokensOffset: config.ETHERSCAN_IO_LIST_TOKENS_OFFSET })
    );

  return ioc;
};
