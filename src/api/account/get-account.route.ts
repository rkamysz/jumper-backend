import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { AnyFunction, Route } from '@/common/types';
import { AccountController } from '@/features';

import { getAccountHandler } from './get-account.handler';

export class GetAccountRoute implements Route {
  static create(container: Container) {
    const path = '/account';
    const tags = ['Get Account'];
    const method = 'get';
    const registry = new OpenAPIRegistry();
    const controller = container.get<AccountController>(AccountController.Token);

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new GetAccountRoute(path, method, getAccountHandler(controller), registry, []);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: AnyFunction[]
  ) {}
}
