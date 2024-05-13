import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { AnyFunction, Route } from '@/common/types';
import { TokensController } from '@/features';

export class ListTokensRoute implements Route {
  static create(container: Container) {
    const path = '/login';
    const tags = ['Login'];
    const method = 'get';
    const registry = new OpenAPIRegistry();
    const controller = container.get<TokensController>(TokensController.Token);

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new ListTokensRoute(path, method, controller.listAccountTokens.bind(controller), registry, []);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: any[]
  ) {}
}
