import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import { Container } from 'inversify';

import rateLimiter from '@/common/middleware/rate-limiter.middleware';
import requestLogger from '@/common/middleware/request-logger.middleware';
import { env } from '@/common/utils/envConfig';

import { CreateAccountRoute } from './api/account/create-account.route';
import { LoginRoute } from './api/account/login.route';
import { HealthCheckRoute } from './api/health-check/health-check.route';
import { ListTokensRoute } from './api/tokens/list-tokens.route';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { ExpressRouter } from './common/router';
import { AnyFunction, Logger, Server } from './common/types';

export class ExpressServer implements Server<Express> {
  static build(container: Container, logger: Logger) {
    const app: Express = express();

    // Set the application to trust the reverse proxy
    app.set('trust proxy', true);

    // Middlewares
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(helmet());
    app.use(rateLimiter);

    // Request logging
    app.use(requestLogger);

    // Routes
    const router = new ExpressRouter(app, 'v1');
    router.mount(LoginRoute.create(() => {}));
    router.mount(CreateAccountRoute.create(container));
    router.mount(ListTokensRoute.create(container));
    router.mount(HealthCheckRoute.create());

    // Swagger UI
    router.buildDocumentation('/swagger.json');

    // Error handlers
    app.use(errorHandler(logger));

    return new ExpressServer(app, logger);
  }

  private _server: http.Server | undefined;

  constructor(
    public readonly app: Express,
    private logger: Logger
  ) {}

  start() {
    if (!this._server) {
      this._server = this.app.listen(env.PORT, () => {
        const { NODE_ENV, HOST, PORT } = env;
        this.logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
      });
    }
  }

  close(callback: AnyFunction) {
    if (this._server) {
      return this._server.close(callback);
    }
  }
}
