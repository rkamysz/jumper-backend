import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { isValidAddressMiddleware } from '@/common/middleware/is-valid-address.middleware';
import { AnyFunction, Route } from '@/common/types';
import { TokensController } from '@/features';

import { listTokensHandler } from './list-tokens.handler';

export class ListTokensRoute implements Route {
  static create(container: Container) {
    const path = '/tokens';
    const tags = ['Tokens'];
    const method = 'get';
    const registry = new OpenAPIRegistry();
    const controller = container.get<TokensController>(TokensController.Token);

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new ListTokensRoute(path, method, listTokensHandler(controller), registry, [isValidAddressMiddleware]);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: any[]
  ) {}
}
