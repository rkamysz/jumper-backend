import { pino } from 'pino';

import { env } from './common/utils/envConfig';
import { buildContainer } from './ioc';
import { ExpressServer } from './server';

const bootstrap = async () => {
  const logger = pino({ name: 'server start' });
  const container = await buildContainer(env, logger);
  const server = ExpressServer.build(container, logger);

  server.start();

  const onCloseSignal = () => {
    logger.info('sigint received, shutting down');
    server.close(() => {
      logger.info('server closed');
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
  };

  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
};
bootstrap();
