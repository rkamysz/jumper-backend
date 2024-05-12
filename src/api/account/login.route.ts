import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticateAddressMiddleware } from '@/common/middleware/authenticate-address.middleware';
import { recoverAddressMiddleware } from '@/common/middleware/recover-address.middleware';
import { AnyFunction, Route } from '@/common/types';

export class LoginRoute implements Route {
  static create(handler: AnyFunction) {
    const path = '/account/login';
    const tags = ['Login'];
    const method = 'get';
    const registry = new OpenAPIRegistry();

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new LoginRoute(path, method, handler, registry, [recoverAddressMiddleware, authenticateAddressMiddleware]);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: AnyFunction[]
  ) {}
}
