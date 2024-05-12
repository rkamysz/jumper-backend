import { pino } from 'pino';

import { ExpressServer } from './server';

const logger = pino({ name: 'server start' });
const server = ExpressServer.build({}, logger);

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
